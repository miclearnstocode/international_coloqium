import type { PageDefinition } from "./types";

export const hotelMappingPage: PageDefinition = {
  slug: "hotel-mapping",
  name: "Hotel & Mapping",
  path: "/hotel-mapping",
  category: "Hotel & Mapping",
  status: "Published",
  updated: "",
  structure: [
    {
      section: "Page Hero",
      fields: [
        { key: "hero.title", label: "Hero Title", type: "text" },
        { key: "hero.description", label: "Hero Description", type: "textarea" },
      ],
    },
    {
      section: "Map Section",
      fields: [
        { key: "map.title", label: "Map Title", type: "text" },
        { key: "map.description", label: "Map Description", type: "text" },
        { key: "map.center_lat", label: "Map Center Latitude", type: "text", placeholder: "Decimal degrees" },
        { key: "map.center_lng", label: "Map Center Longitude", type: "text", placeholder: "Decimal degrees" },
        { key: "map.zoom", label: "Map Zoom", type: "text", placeholder: "Whole number from 0 to 19" },
      ],
    },
    {
      section: "Important Note",
      fields: [
        { key: "note.title", label: "Note Title", type: "text" },
        { key: "note.text", label: "Note Text", type: "textarea" },
      ],
    },
    {
      section: "Venues",
      fields: [
        { key: "venues.title", label: "Venue List Title", type: "text" },
        { key: "venues.description", label: "Venue List Description", type: "text" },
      ],
      list: {
        key: "venues_items",
        label: "Venues",
        items: [],
        itemFields: ["name", "loc", "desc", "pos", "num", "color", "icon"],
      },
    },
    {
      section: "Travel Information",
      fields: [{ key: "travel.title", label: "Section Title", type: "text" }],
      list: {
        key: "travel_items",
        label: "Travel Entries",
        items: [],
        itemFields: ["title", "description", "icon"],
      },
    },
    {
      section: "Download Box",
      fields: [
        { key: "download.title", label: "Box Title", type: "text", placeholder: "Download Venue Map" },
        { key: "download.description", label: "Box Description", type: "textarea", placeholder: "Describe what the map file contains" },
        { key: "download.button_text", label: "Button Text", type: "text", placeholder: "Download PDF" },
        { key: "download.file_url", label: "Map PDF URL", type: "url", placeholder: "Enter a PDF link or site path" },
      ],
    },
    {
      section: "Bottom CTA",
      fields: [
        { key: "bottom_cta.title", label: "CTA Title", type: "text", placeholder: "Need Assistance?" },
        { key: "bottom_cta.description", label: "CTA Description", type: "textarea", placeholder: "Describe how visitors can get help" },
        { key: "bottom_cta.button_text", label: "Button Text", type: "text", placeholder: "Contact Secretariat" },
        { key: "bottom_cta.button_link", label: "Contact Link", type: "url", placeholder: "Enter a contact link or site path" },
      ],
    },
  ],
};
