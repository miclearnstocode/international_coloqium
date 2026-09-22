import { PageDefinition } from './types';

export const aboutPage: PageDefinition = {
  slug: '/about',
  name: 'About',
  path: '/about',
  category: 'About',
  status: 'Published',
  updated: 'Sep 15, 2025 04:12 PM',
  structure: [
    {
      section: 'Page Hero',
      fields: [
        { key: 'hero.breadcrumb_home', label: 'Breadcrumb Home Text', type: 'text', value: 'Home' },
        { key: 'hero.breadcrumb_current', label: 'Breadcrumb Current Text', type: 'text', value: 'About' },
        { key: 'hero.title', label: 'Hero Title', type: 'text', value: 'About the Symposium' },
        { key: 'hero.subtitle', label: 'Hero Subtitle', type: 'textarea', value: 'Advancing research. Building partnerships. Creating science-based solutions for a resilient and sustainable future.' },
      ],
    },
    {
      section: 'About Content',
      fields: [
        { key: 'about.title', label: 'Section Title', type: 'textarea', value: 'About the 3RD INTERNATIONAL AGRI-LIFE & BIORESOURCE SCIENCES SYMPOSIUM' },
        { key: 'about.paragraph1', label: 'Paragraph 1', type: 'textarea', value: 'The 3rd International Agri-Life & Bioresource Sciences Symposium is envisioned as an international academic and scientific platform that brings together researchers, faculty members, students, government representatives, industry partners, and other stakeholders to exchange knowledge, present research findings, and establish meaningful collaborations in agriculture, life sciences, and bioresource sciences.' },
        { key: 'about.paragraph2', label: 'Paragraph 2', type: 'textarea', value: 'Building on the accomplishments of previous editions, the symposium seeks to strengthen international and inter-institutional cooperation and provide researchers and students with opportunities to disseminate their work to a broader scientific community.' },
        { key: 'about.paragraph3', label: 'Paragraph 3', type: 'textarea', value: 'The symposium recognizes that increasingly complex challenges involving food and agriculture, biodiversity, natural resources, climate resilience, and sustainable development require interdisciplinary and collaborative approaches. By bringing together participants from different disciplines and institutions, the symposium aims to stimulate new ideas, strengthen research partnerships, and contribute to practical and sustainable solutions.' },
        { key: 'about.cta_primary', label: 'Primary CTA Text', type: 'text', value: 'Discover the Symposium' },
        { key: 'about.cta_secondary', label: 'Secondary CTA Text', type: 'text', value: 'Presentation Guidelines' },
      ],
    },
    {
      section: 'Symposium at a Glance',
      fields: [
        { key: 'glance.title', label: 'Section Title', type: 'text', value: 'Symposium at a Glance' },
      ],
      list: {
        key: 'glance_items',
        label: 'Glance Stats',
        items: [
          { value: '3', label: 'Days of Scientific Exchange' },
          { value: '5', label: 'Scientific Tracks' },
          { value: '200+', label: 'Target Participants' },
          { value: 'Global', label: 'Academic & Research Collaboration' },
          { value: 'Oral + Poster', label: 'Research Presentations' },
        ],
      },
    },
    {
      section: 'Objectives',
      fields: [
        { key: 'objectives.title', label: 'Section Title', type: 'text', value: 'Symposium Objectives' },
        { key: 'objectives.description', label: 'Section Description', type: 'textarea', value: 'The symposium generally aims to provide an international platform for the presentation, dissemination, and exchange of research and innovations in agriculture, life sciences, and bioresource sciences.' },
      ],
      list: {
        key: 'objectives_items',
        label: 'Objective Items',
        items: [
          { text: 'Provide researchers, faculty members, and students with opportunities to present and disseminate their research findings and innovations' },
          { text: 'Facilitate interdisciplinary discussions on emerging issues and developments in agriculture, life sciences, and bioresource sciences' },
          { text: 'Strengthen research collaboration and academic linkages among participating universities, research institutions, government agencies, and industry partners' },
          { text: 'Promote internationalization through greater participation and engagement of international researchers and institutions' },
          { text: 'Provide opportunities for young and emerging researchers to interact with established scientists and experts' },
          { text: 'Identify potential areas for collaborative research, academic exchange, and other joint initiatives' },
          { text: 'Contribute to the advancement of sustainable and science-based solutions to challenges affecting agriculture, food systems, natural resources, and society' },
        ],
      },
    },
    {
      section: 'Who Should Attend',
      fields: [
        { key: 'attend.title', label: 'Section Title', type: 'text', value: 'Who Should Attend?' },
        { key: 'attend.description', label: 'Section Description', type: 'text', value: 'The symposium welcomes:' },
      ],
      list: {
        key: 'attend_items',
        label: 'Attendee Types',
        items: [
          { text: 'International delegates and researchers' },
          { text: 'Scientists and research professionals' },
          { text: 'Representatives of universities and research institutions' },
          { text: 'Faculty members' },
          { text: 'Graduate and undergraduate students' },
          { text: 'Eligible high-school research presenters' },
          { text: 'Government agencies and research councils' },
          { text: 'Professional and scientific organizations' },
          { text: 'Non-government organizations' },
          { text: 'Industry and private-sector partners' },
          { text: 'Stakeholders in agriculture, life sciences, fisheries, natural resources, food, health, innovation, and bioresource sciences' },
        ],
      },
    },
    {
      section: 'Host Institutions',
      fields: [
        { key: 'hosts.title', label: 'Section Title', type: 'text', value: 'About Us' },
        { key: 'hosts.description', label: 'Section Description', type: 'text', value: 'The host agency and collaborating institutions' },
      ],
      list: {
        key: 'hosts_items',
        label: 'Institutions',
        items: [
          { name: 'Capiz State University', location: 'Capiz, Philippines', role: 'Host Institution', description: 'Lead organizer of the symposium, providing venue, logistics, and overall coordination.' },
          { name: 'Hiroshima University', location: 'Hiroshima, Japan', role: 'Co-Host Institution', description: 'International partner contributing expertise in marine/aquatic sciences and research collaboration.' },
          { name: 'University of San Carlos', location: 'Cebu, Philippines', role: 'Co-Host Institution', description: 'Collaborating institution strengthening academic linkages and research partnerships.' },
          { name: 'Visayas State University', location: 'Leyte, Philippines', role: 'Co-Host Institution', description: 'Partner institution supporting agricultural and life sciences research exchange.' },
        ],
      },
    },
    {
      section: 'Organizing Committee',
      fields: [
        { key: 'committee.title', label: 'Section Title', type: 'text', value: 'Organizing Committee' },
      ],
      list: {
        key: 'committee_items',
        label: 'Committee Groups',
        items: [
          { title: 'Executive / Steering Committee', description: 'Provides strategic direction, coordination, and overall oversight.', members: ['Dr. Efren L. Linan', 'Atty. Toche Vic Doce', 'Dr. Leo Andrew B. Biclar', 'Dr. Annalie G. Campos', 'Dr. Salvacion J. Legaspi'] },
          { title: 'Symposium Chair', description: 'Provides overall leadership in planning and implementation.', members: ['Dr. John King N. Layos'] },
          { title: 'Symposium Co-Chairs / Institutional Focal Persons', description: 'Facilitate coordination among participating institutions.', members: ['Dr. Takeshi Tomiyama - HU', 'Dr. Rotacio Gravoso - VSU', 'Dr. Paul John Geraldino - USC', 'Dr. R-Jun Frederick A. Gaspe - CAPSU'] },
          { title: 'Scientific & Technical Committee', description: 'Develops the scientific program and tracks, manages the Call for Abstracts, oversees abstract review, organizes scientific sessions, and develops presentation/evaluation guidelines.', members: ['RDE Office', 'Track 1 - Dr. Escala', 'Track 2 - Prof. Faderogao', 'Track 3 - Dr. Dela Calzada', 'Track 4 - Dr. Hilapad', 'Track 5 - Engr. Oloroso'] },
          { title: 'Program Committee', description: 'Develops and coordinates the symposium program.', members: ['RDE Office'] },
          { title: 'Secretariat & Registration Committee', description: 'Handles communications, participant records, registration, certificates, and official documents.', members: ['EAL Office', 'RDE Office'] },
          { title: 'Finance & Sponsorship Committee', description: 'Manages budget planning, sponsorship, registration fees, and financial monitoring.', members: ['EAL Office', 'RDE Office', 'Dr. Layos', 'Dr. Escala', 'Dr. Berganio', 'BAC/Procurement'] },
          { title: 'Logistics & Venue Committee', description: 'Coordinates venue facilities, accommodation options, transportation, meals, audiovisual requirements, poster areas, and session rooms.', members: ['RDE Office', 'EAL Office', 'GSO - Sir Latoza', 'Dr. Hilapad'] },
          { title: 'International Relations & Delegates Committee', description: 'Assists international delegates, invitation documentation, transportation, and related coordination.', members: ['EAL Office', 'Dr. Quenga', 'Dr. Gaspe', 'Dr. Layos'] },
        ],
      },
    },
  ],
};