export interface SiteImageItem {
  src: string;
  caption?: string;
  alt?: string;
}

export interface FocusAreaItem {
  label: string;
  color: string;
  icon: string;
}

export interface PartnerLogoItem {
  src: string;
  alt: string;
}

export interface SolutionEntry {
  sNo: number;
  indicator: string;
  indicatorCode: string;
  subIndicator: string;
  subIndicatorCode: string;
  solutionsLow: string[];
  solutionsMedium: string[];
  solutionsHigh: string[];
}

export interface SiteContent {
  heroImage: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  aboutTitle: string;
  aboutBody: string;
  focusTitle: string;
  focusBlurb: string;
  galleryTitle: string;
  mapTitle: string;
  mapDescription: string;
  topVillagesTitle: string;
  partnerLogos: PartnerLogoItem[];
  photoGallery: SiteImageItem[];
  focusAreas: FocusAreaItem[];
  solutions: SolutionEntry[];
}
