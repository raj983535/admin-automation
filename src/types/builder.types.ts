export type WebsiteSectionType =
  | 'hero'
  | 'features'
  | 'about'
  | 'programs'
  | 'testimonials'
  | 'contact'
  | 'footer';

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface ProgramItem {
  name: string;
  duration: string;
  outcome?: string;
}

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
}

export interface PageSectionContent {
  title?: string;
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaLink?: string;
  body?: string;
  address?: string;
  phone?: string;
  email?: string;
  metaTitle?: string;
  metaDescription?: string;
  customClasses?: string;
  sectionId?: string;
  items?: FeatureItem[];
  programs?: ProgramItem[];
  testimonials?: TestimonialItem[];
  links?: string[];
}

export interface PageSection {
  id: string;
  type: WebsiteSectionType;
  title: string;
  content: PageSectionContent;
  visible: boolean;
}

export type FunnelStepType =
  | 'landing'
  | 'inquiry'
  | 'application'
  | 'review'
  | 'payment'
  | 'confirmation';

export interface FunnelStepContent {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaLink?: string;
  fields?: string[];
  sections?: string[];
  checklist?: string[];
  paymentMethods?: string[];
  message?: string;
  nextSteps?: string[];
  customClasses?: string;
}

export interface FunnelStep {
  id: string;
  name: string;
  type: FunnelStepType;
  color: string;
  conversionRate: number;
  dropOffRate: number;
  visitors: number;
  conversions: number;
  content: FunnelStepContent;
}
