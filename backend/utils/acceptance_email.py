from email.headerregistry import Address
from email.message import EmailMessage
import smtplib
import ssl

from flask import current_app


def send_acceptance_email(submission):
    config = current_app.config
    sender = config.get('MAIL_FROM')
    if not sender:
        raise ValueError('MAIL_FROM or MAIL_USERNAME is required')

    message = EmailMessage()
    message['From'] = Address(config['MAIL_FROM_NAME'], addr_spec=sender)
    message['To'] = Address(addr_spec=submission.email_address.strip())
    message['Subject'] = 'Your symposium abstract has been accepted'
    message.set_content(
        f"Dear {submission.author},\n\n"
        "We are pleased to inform you that your abstract has been accepted "
        "for the International Agri-Life and Bioresource Sciences Symposium.\n\n"
        f"Research title: {submission.research_title}\n\n"
        "Please sign in to the symposium portal to view your submission status.\n\n"
        "Symposium Secretariat\n"
    )

    port = config['MAIL_PORT']
    context = ssl.create_default_context()
    smtp_class = smtplib.SMTP_SSL if port == 465 else smtplib.SMTP
    options = {'context': context} if port == 465 else {}
    with smtp_class(config['MAIL_SERVER'], port, timeout=10, **options) as smtp:
        if port != 465:
            smtp.starttls(context=context)
        if config.get('MAIL_USERNAME'):
            smtp.login(config['MAIL_USERNAME'], config['MAIL_PASSWORD'] or '')
        smtp.send_message(message)
