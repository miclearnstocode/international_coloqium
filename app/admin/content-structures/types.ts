export interface FieldDefinition {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'url' | 'image';
    value: string;
}

export interface ListDefinition {
    key: string;
    label: string;
    items: Record<string, any>[];
}

export interface SectionDefinition {
    section: string;
    fields: FieldDefinition[];
    list?: ListDefinition;
}

export interface PageDefinition {
    slug: string;
    name: string;
    path: string;
    category: string;
    status: 'Published' | 'Draft' | 'Archived';
    updated: string;
    structure: SectionDefinition[];
}