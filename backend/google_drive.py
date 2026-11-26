import os
import re
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload, MediaIoBaseDownload, MediaIoBaseUpload
from googleapiclient.errors import HttpError
from dotenv import load_dotenv

load_dotenv()

SCOPES = ['https://www.googleapis.com/auth/drive']
CREDENTIALS_PATH = os.getenv('GOOGLE_APPLICATION_CREDENTIALS', 'rdesystem.json')

ROOT_FOLDER_ID = '1pXuQFbe5yvBU0CECkgFNrfXySMDNWPC0'

# Event name
EVENT_NAME = "International Colloquium 2025"

def get_drive_service():
    creds = service_account.Credentials.from_service_account_file(CREDENTIALS_PATH, scopes=SCOPES)
    return build('drive', 'v3', credentials=creds)

def sanitize_folder_name(name):
    if not name or not isinstance(name, str):
        return "Untitled"
    sanitized = re.sub(r'[<>:"/\\|?*\x00-\x1f]', '_', name)
    sanitized = sanitized.strip()
    return sanitized[:100] if sanitized else "Untitled"

def get_or_create_folder(service, folder_name, parent_id=None):
    folder_name = sanitize_folder_name(folder_name)
    try:
        query = f"name='{folder_name}' and mimeType='application/vnd.google-apps.folder' and trashed=false"
        if parent_id:
            query += f" and '{parent_id}' in parents"
        
        response = service.files().list(
            q=query, spaces='drive', fields='files(id, name)',
            supportsAllDrives=True, includeItemsFromAllDrives=True
        ).execute()
        
        files = response.get('files', [])
        if files:
            return files[0]['id']
        
        file_metadata = {'name': folder_name, 'mimeType': 'application/vnd.google-apps.folder'}
        if parent_id:
            file_metadata['parents'] = [parent_id]
        
        folder = service.files().create(body=file_metadata, fields='id', supportsAllDrives=True).execute()
        return folder.get('id')
    except HttpError as e:
        raise e

def upload_file_to_drive(file_path, filename, project_title=None):
    if not os.path.exists(file_path):
        raise Exception(f"File not found: {file_path}")
    
    filename = sanitize_folder_name(filename)
    
    service = get_drive_service()
    
    # Get or create Event folder
    event_folder_id = get_or_create_folder(service, EVENT_NAME, ROOT_FOLDER_ID)
    
    # Create project subfolder
    final_folder_id = event_folder_id
    if project_title:
        project_folder_id = get_or_create_folder(service, project_title, event_folder_id)
        final_folder_id = project_folder_id
    
    file_metadata = {'name': filename, 'parents': [final_folder_id]}
    media = MediaFileUpload(file_path, mimetype='application/pdf', resumable=True)
    
    try:
        file = service.files().create(
            body=file_metadata, media_body=media,
            fields='id, name', supportsAllDrives=True
        ).execute()
        
        file_id = file.get('id')
        
        # ========== MAKE FILE PUBLICLY VIEWABLE ==========
        # This allows anyone with the link to view the file
        try:
            permission = {
                'type': 'anyone',
                'role': 'reader',
                'allowFileDiscovery': False
            }
            service.permissions().create(
                fileId=file_id,
                body=permission,
                supportsAllDrives=True
            ).execute()
        except Exception as e:
            print(f"Warning: Could not set public permission: {e}")
        # =================================================
        
        view_url = f"https://drive.google.com/file/d/{file_id}/view"
        download_url = f"https://drive.google.com/uc?export=download&id={file_id}"
        return view_url, download_url
    except HttpError as e:
        raise e

def extract_file_id(drive_url_or_id):
    if not drive_url_or_id or not isinstance(drive_url_or_id, str):
        return None
    patterns = [
        r'/file/d/([a-zA-Z0-9_-]+)',
        r'/d/([a-zA-Z0-9_-]+)',
        r'id=([a-zA-Z0-9_-]+)',
        r'open\?id=([a-zA-Z0-9_-]+)',
        r'([a-zA-Z0-9_-]{25,})'
    ]
    for pattern in patterns:
        match = re.search(pattern, drive_url_or_id)
        if match:
            return match.group(1).split('?')[0].split('&')[0]
    return None

def set_drive_file_trashed(drive_url_or_id, trashed):
    file_id = extract_file_id(drive_url_or_id)
    if not file_id:
        raise ValueError('Could not find the linked Google Drive file ID.')

    files = get_drive_service().files()
    file = files.get(fileId=file_id, fields='id,trashed', supportsAllDrives=True).execute()
    if file.get('trashed') is trashed:
        return False

    updated = files.update(
        fileId=file_id,
        body={'trashed': trashed},
        fields='id,trashed',
        supportsAllDrives=True,
    ).execute()
    if updated.get('trashed') is not trashed:
        raise RuntimeError('Google Drive did not confirm the file trash status.')
    return True


def trash_file_from_drive(drive_url_or_id):
    """Move a Drive file to Trash and report whether this call changed it."""
    return set_drive_file_trashed(drive_url_or_id, True)


def upload_payment_proof_to_drive(file_path, filename, mime_type, abstract_url):
    abstract_id = extract_file_id(abstract_url)
    if not abstract_id:
        raise ValueError('The abstract has no Google Drive file.')

    service = get_drive_service()
    files = service.files()
    abstract = files.get(fileId=abstract_id, fields='parents,trashed', supportsAllDrives=True).execute()
    if abstract.get('trashed') or not abstract.get('parents'):
        raise ValueError('The abstract has no accessible Google Drive folder.')

    folder = abstract['parents'][0]
    page_token = None
    while True:
        permissions = service.permissions().list(
            fileId=folder, fields='nextPageToken,permissions(type)',
            pageToken=page_token, supportsAllDrives=True,
        ).execute()
        if any(permission['type'] in ('anyone', 'domain') for permission in permissions.get('permissions', [])):
            raise ValueError('The abstract folder is shared publicly or across the domain.')
        page_token = permissions.get('nextPageToken')
        if not page_token:
            break

    with open(file_path, 'rb') as stream:
        media = MediaIoBaseUpload(stream, mimetype=mime_type, chunksize=8 * 1024 * 1024, resumable=True)
        result = files.create(
            body={'name': filename, 'parents': [folder]},
            media_body=media, fields='id', supportsAllDrives=True,
        ).execute()
    return result['id']


def download_drive_file(file_id, output):
    request = get_drive_service().files().get_media(fileId=file_id, supportsAllDrives=True)
    download = MediaIoBaseDownload(output, request, chunksize=8 * 1024 * 1024)
    done = False
    while not done:
        _, done = download.next_chunk(num_retries=2)
    output.seek(0)
