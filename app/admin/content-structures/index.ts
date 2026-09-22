import { PageDefinition } from './types';
import { homePage } from './home';
import { aboutPage } from './about';
import { programPage } from './program';
import { scientificTracksPage } from './scientificTracks';
import { abstractSubmissionPage } from './abstractSubmission';
import { registrationPage } from './registration';
import { guidelinesPage } from './guidelines';
import { partnerInstitutionsPage } from './partnerInstitutions';
import { hotelMappingPage } from './hotelMapping';
import { contactPage } from './contact';

// All pages live here. Adding a new page = 1 import + 1 array entry.
export const PAGES: PageDefinition[] = [
  homePage,
  aboutPage,
  programPage,
  scientificTracksPage,
  abstractSubmissionPage,
  registrationPage,
  guidelinesPage,
  partnerInstitutionsPage,
  hotelMappingPage,
  contactPage,
];

// Fast lookup by slug
export const PAGE_BY_SLUG: Record<string, PageDefinition> = PAGES.reduce(
  (acc, p) => ({ ...acc, [p.slug]: p }),
  {}
);

export const getPageBySlug = (slug: string): PageDefinition | undefined =>
  PAGE_BY_SLUG[slug];

export const hasStructure = (slug: string): boolean => {
  const page = PAGE_BY_SLUG[slug];
  return !!page && page.structure.length > 0;
};

// Re-export types
export * from './types';