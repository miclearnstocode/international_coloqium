import os
import re
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from googleapiclient.errors import HttpError
from dotenv import load_dotenv

load_dotenv()

SCOPES = ['https://www.googleapis.com/auth/drive']
SERVICE_ACCOUNT_FILE = 'rdesystem-secret.json'

ROOT_FOLDER_ID = '1pXuQFbe5yvBU0CECkgFNrfXySMDNWPC0'

# Event name
EVENT_NAME = "International Colloquium 2025"

def get_drive_service():
    creds = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
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
        view_url = f"https://drive.google.com/file/d/{file_id}/view"
        download_url = f"https://drive.google.com/uc?export=download&id={file_id}"
        return view_url, download_url
    except HttpError as e:
        raise e