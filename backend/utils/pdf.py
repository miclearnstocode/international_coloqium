import tempfile
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.units import inch
from reportlab.lib import colors

def generate_abstract_pdf(data):
    """Generates a professional PDF for the abstract matching the symposium template."""
    buffer = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
    file_path = buffer.name
    buffer.close()
    
    # Page dimensions
    doc = SimpleDocTemplate(
        file_path, 
        pagesize=letter,
        rightMargin=54, leftMargin=54,
        topMargin=54, bottomMargin=54
    )
    
    styles = getSampleStyleSheet()
    
    # Color scheme - Forest Green theme
    FOREST_GREEN = colors.HexColor('#2E5E2E')
    DARK_GREEN = colors.HexColor('#1F3F1F')
    LIGHT_GREEN = colors.HexColor('#E8F5E8')
    BORDER_GREEN = colors.HexColor('#2E5E2E')
    TEXT_COLOR = colors.HexColor('#333333')
    WHITE = colors.white
    
    # Custom styles
    event_title_style = ParagraphStyle(
        'EventTitleStyle',
        parent=styles['Title'],
        fontSize=16,
        spaceAfter=4,
        textColor=WHITE,
        alignment=1,
        fontName='Helvetica-Bold',
        leading=16
    )
    
    # FIXED: Changed 'Times New Roman' to 'Times-Roman' (built-in PostScript font)
    event_subtitle_style = ParagraphStyle(
        'EventSubtitleStyle',
        parent=styles['Normal'],
        fontSize=12,
        spaceAfter=2,
        textColor=WHITE,
        alignment=1,
        fontName='Times-Italic',
        leading=13
    )
    
    # Updated Event Details Style - Font 12, Line Spacing 1.0
    event_details_style = ParagraphStyle(
        'EventDetailsStyle',
        parent=styles['Normal'],
        fontSize=12,
        spaceAfter=0,  
        spaceBefore=0,  
        textColor=WHITE,
        alignment=1,
        fontName='Helvetica',  
        leading=12,
    )
    
    # Updated Form Title Style with Century Gothic font, size 20
    form_title_style = ParagraphStyle(
        'FormTitleStyle',
        parent=styles['Title'],
        fontSize=20,
        spaceAfter=12,
        textColor=WHITE,
        alignment=1,
        fontName='Helvetica-Bold',
        leading=24
    )
    
    # Label style - font size 12
    section_label_style = ParagraphStyle(
        'SectionLabelStyle',
        parent=styles['Normal'],
        fontSize=12,
        leading=16,
        textColor=TEXT_COLOR,
        fontName='Helvetica-Bold',
        spaceAfter=4
    )
    
    # Value style - font size 11
    value_style = ParagraphStyle(
        'ValueStyle',
        parent=styles['Normal'],
        fontSize=11,
        leading=15,
        textColor=TEXT_COLOR,
        spaceAfter=2
    )
    
    abstract_style = ParagraphStyle(
        'AbstractStyle',
        parent=styles['Normal'],
        fontSize=11,
        leading=16,
        spaceAfter=8,
        alignment=4,
        textColor=TEXT_COLOR
    )
    
    from reportlab.platypus import Table, TableStyle
    
    story = []
    
    event_details_text = (
        "10-13 March 2027 | Roxas City, Campus, Philippines<br/>"
        "THE SEAFOOD CAPITAL OF THE PHILIPPINES"
    )
    
    header_data = [
        [Paragraph("3RD INTERNATIONAL AGRI-LIFE &amp; BIORESOURCE SCIENCES SYMPOSIUM", event_title_style)],
        [Paragraph('"Converging Frontiers in Agri-Life and Bioresource Sciences: Science, Innovation, and Collaboration for a Resilient and Sustainable Future"', event_subtitle_style)],
        [Paragraph(event_details_text, event_details_style)],
        [Paragraph("Abstract Submission Form", form_title_style)]
    ]
    
    header_table = Table(header_data, colWidths=[7*inch])
    header_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), FOREST_GREEN),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, 0), 6),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 2),
        ('TOPPADDING', (0, 1), (-1, 1), 4),
        ('BOTTOMPADDING', (0, 1), (-1, 1), 4),
        ('TOPPADDING', (0, 2), (-1, 2), 6),
        ('BOTTOMPADDING', (0, 2), (-1, 2), 2),
        ('TOPPADDING', (0, 3), (-1, 3), 8),
        ('BOTTOMPADDING', (0, 3), (-1, 3), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('BOX', (0, 0), (-1, -1), 1.5, FOREST_GREEN),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 12))
    
    # ===== MAIN FORM TABLE =====
    # Determine selected preferences - using checkmark symbol ✓
    presentation_type = data.get('presentation_type', '')
    is_oral = '✓' if presentation_type == 'oral' else '&nbsp;&nbsp;&nbsp;'
    is_poster = '✓' if presentation_type == 'poster' else '&nbsp;&nbsp;&nbsp;'
    
    # Make selected option bold for presentation type
    if presentation_type == 'oral':
        oral_text = f"<b>{is_oral}&nbsp;&nbsp; Oral Presentation</b>"
        poster_text = f"{is_poster}&nbsp;&nbsp; Poster presentation"
    else:
        oral_text = f"{is_oral}&nbsp;&nbsp; Oral Presentation"
        poster_text = f"<b>{is_poster}&nbsp;&nbsp; Poster presentation</b>"
    
    city_tour_option = data.get('city_tour_option', '')
    is_option1 = '✓' if city_tour_option == 'option1' else '&nbsp;&nbsp;&nbsp;'
    is_option2 = '✓' if city_tour_option == 'option2' else '&nbsp;&nbsp;&nbsp;'
    
    # Make selected option bold for city tour
    if city_tour_option == 'option1':
        option1_text = f"<b>{is_option1}&nbsp;&nbsp; Option 1 (City Tour Only)</b>"
        option2_text = f"{is_option2}&nbsp;&nbsp; Option 2 (City tour, and Boracay Transfer)"
    else:
        option1_text = f"{is_option1}&nbsp;&nbsp; Option 1 (City Tour Only)"
        option2_text = f"<b>{is_option2}&nbsp;&nbsp; Option 2 (City tour, and Boracay Transfer)</b>"
    
    # Define form rows
    form_data = []
    
    # Row 1: Presentation Preference
    form_data.append([
        Paragraph("Please indicate preference", section_label_style),
        Paragraph(
            f"{oral_text} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {poster_text}",
            value_style
        )
    ])
    
    # Row 2: Presentation Title
    form_data.append([
        Paragraph("PRESENTATION TITLE", section_label_style),
        Paragraph(data['research_title'], value_style)
    ])
    
    # Row 3: Author(s)
    author_text = data['author']
    if data.get('co_author'):
        author_text += f", {data['co_author']}"
    form_data.append([
        Paragraph("AUTHOR (S)", section_label_style),
        Paragraph(author_text, value_style)
    ])
    
    # Row 4: Presenting Author
    form_data.append([
        Paragraph("PRESENTING AUTHOR", section_label_style),
        Paragraph(data['presenter'], value_style)
    ])
    
    # Row 5: Affiliation
    form_data.append([
        Paragraph("AFFILIATION/S (Institution/ Office)", section_label_style),
        Paragraph(data['university_agency'], value_style)
    ])
    
    # Row 6: Address
    form_data.append([
        Paragraph("Address", section_label_style),
        Paragraph(data.get('address', ''), value_style)
    ])
    
    # Row 7: Phone Number (Telephone/Fax/Cellphone)
    form_data.append([
        Paragraph("Telephone/ Fax. No./ Cellphone No.", section_label_style),
        Paragraph(data.get('phone_number', ''), value_style)
    ])
    
    # Row 8: Email
    form_data.append([
        Paragraph("Email address", section_label_style),
        Paragraph(data['email_address'], value_style)
    ])
    
    # Row 9: City Tour/Boracay Transfer (Multi-line with bold selection)
    city_tour_text = (
        f"{option1_text}<br/><br/>"
        f"{option2_text}<br/><br/>"
        f"<font size='8'><i>Participants proceeding to Boracay shall be responsible for arranging their own "
        f"accommodation and return/onward travel. Delegates may arrange their departure at their convenience through "
        f"Caticlan or Kalibo, depending on their preferred flight or onward travel arrangements. The Organizing "
        f"Committee may provide general travel information and coordination assistance but shall not be responsible "
        f"for individual bookings or personal travel expenses.</i></font>"
    )
    
    form_data.append([
        Paragraph("City Tour/Boracay Transfer", section_label_style),
        Paragraph(city_tour_text, value_style)
    ])
    
    # Create form table
    form_table = Table(form_data, colWidths=[2.5*inch, 4.5*inch])
    form_table.setStyle(TableStyle([
        # Borders
        ('GRID', (0, 0), (-1, -1), 0.75, BORDER_GREEN),
        ('BOX', (0, 0), (-1, -1), 1.5, BORDER_GREEN),
        
        # Cell backgrounds - alternating
        ('BACKGROUND', (0, 0), (0, -1), LIGHT_GREEN),
        ('BACKGROUND', (1, 0), (1, -1), WHITE),
        
        # Text alignment
        ('ALIGN', (0, 0), (0, -1), 'LEFT'),
        ('ALIGN', (1, 0), (1, -1), 'LEFT'),
        
        # Vertical alignment
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        
        # Padding
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(form_table)
    story.append(Spacer(1, 12))
    
    # ===== ABSTRACT SECTION =====
    abstract_data = [
        [Paragraph("Abstract <i>(not more than 300 words)</i>", section_label_style)],
        [Paragraph(data['abstract'].replace('\n', '<br/>'), abstract_style)]
    ]
    
    abstract_table = Table(abstract_data, colWidths=[7*inch])
    abstract_table.setStyle(TableStyle([
        ('GRID', (0, 0), (-1, -1), 0.75, BORDER_GREEN),
        ('BOX', (0, 0), (-1, -1), 1.5, BORDER_GREEN),
        ('BACKGROUND', (0, 0), (-1, -1), WHITE),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(abstract_table)
    
    # ===== KEYWORDS SECTION =====
    story.append(Spacer(1, 12))
    keywords_data = [
        [Paragraph("<b>KEYWORDS:</b>", section_label_style)],
        [Paragraph(data['keywords'], value_style)]
    ]
    
    keywords_table = Table(keywords_data, colWidths=[7*inch])
    keywords_table.setStyle(TableStyle([
        ('GRID', (0, 0), (-1, -1), 0.75, BORDER_GREEN),
        ('BOX', (0, 0), (-1, -1), 1.5, BORDER_GREEN),
        ('BACKGROUND', (0, 0), (0, 0), LIGHT_GREEN),
        ('BACKGROUND', (0, 1), (-1, 1), WHITE),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(keywords_table)
    
    # ===== APPLICATION INFO =====
    story.append(Spacer(1, 16))
    application_text = Paragraph(
        "<b>Application for oral/poster presentation shall be submitted to the official symposium portal on or before January 10, 2027.</b>",
        ParagraphStyle(
            'ApplicationStyle',
            parent=styles['Normal'],
            fontSize=9,
            leading=13,
            textColor=colors.HexColor('#333333'),
            alignment=1
        )
    )
    story.append(application_text)
    story.append(Spacer(1, 6))
    
    story.append(Paragraph(
        "<i>For additional concerns, please contact us through: (insert RDE contact details)</i>",
        ParagraphStyle(
            'ContactStyle',
            parent=styles['Normal'],
            fontSize=8,
            leading=12,
            textColor=colors.HexColor('#666666'),
            alignment=1
        )
    ))
    
    doc.build(story)
    return file_path
