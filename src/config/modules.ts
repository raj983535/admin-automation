import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Globe,
  Filter,
  FileInput,
  ShoppingBag,
  Rocket,
  Link2,
  Mail,
  MessageCircle,
  MessagesSquare,
  Smartphone,
  Phone,
  Send,
  Workflow,
  Sparkles,
  Brain,
  GitBranch,
  Inbox,
  Users,
  BarChart3,
  Wallet,
  CreditCard,
  Handshake,
  Calendar,
  BookOpen,
  GraduationCap,
  UsersRound,
  MessageSquare,
  Target,
  UserCog,
  Lock,
  Store,
  Kanban,
  School,
  HeartPulse,
} from 'lucide-react';

export type NavSectionId =
  | 'dashboard'
  | 'builders'
  | 'marketing'
  | 'ai'
  | 'crm'
  | 'learning'
  | 'operations';

export interface ModuleConfig {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  section: NavSectionId;
  title: string;
  subtitle: string;
}

export interface NavSection {
  id: NavSectionId;
  title: string | null;
  items: ModuleConfig[];
}

const placeholderSubtitle =
  'Configure and monitor this module from the admin workspace.';

export const modules: ModuleConfig[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
    section: 'dashboard',
    title: 'Dashboard',
    subtitle: 'Admissions, leads, finance, AI, and engagement at a glance.',
  },
  // Builders
  {
    id: 'website-builder',
    label: 'Website Builder',
    path: '/builders/website-builder',
    icon: Globe,
    section: 'builders',
    title: 'Website Builder',
    subtitle: placeholderSubtitle,
  },
  {
    id: 'funnel-builder',
    label: 'Funnel Builder',
    path: '/builders/funnel-builder',
    icon: Filter,
    section: 'builders',
    title: 'Funnel Builder',
    subtitle: placeholderSubtitle,
  },
  {
    id: 'form-builder',
    label: 'Form Builder',
    path: '/builders/form-builder',
    icon: FileInput,
    section: 'builders',
    title: 'Form Builder',
    subtitle: placeholderSubtitle,
  },
  {
    id: 'shop-builder',
    label: 'Shop Builder',
    path: '/builders/shop-builder',
    icon: ShoppingBag,
    section: 'builders',
    title: 'Shop Builder',
    subtitle: placeholderSubtitle,
  },
  {
    id: 'ad-launcher',
    label: 'Ad Launcher',
    path: '/builders/ad-launcher',
    icon: Rocket,
    section: 'builders',
    title: 'Ad Launcher',
    subtitle: placeholderSubtitle,
  },
  {
    id: 'url-shortener',
    label: 'URL Shortener',
    path: '/builders/url-shortener',
    icon: Link2,
    section: 'builders',
    title: 'URL Shortener',
    subtitle: placeholderSubtitle,
  },
  // Marketing
  {
    id: 'email-campaigns',
    label: 'Email Campaigns',
    path: '/marketing/email-campaigns',
    icon: Mail,
    section: 'marketing',
    title: 'Email Campaigns',
    subtitle: placeholderSubtitle,
  },
  {
    id: 'whatsapp-sender',
    label: 'WhatsApp Sender',
    path: '/marketing/whatsapp-sender',
    icon: MessageCircle,
    section: 'marketing',
    title: 'WhatsApp Sender',
    subtitle: placeholderSubtitle,
  },
  {
    id: 'waba',
    label: 'WABA',
    path: '/marketing/waba',
    icon: MessagesSquare,
    section: 'marketing',
    title: 'WABA',
    subtitle: placeholderSubtitle,
  },
  {
    id: 'sms-campaigns',
    label: 'SMS Campaigns',
    path: '/marketing/sms-campaigns',
    icon: Smartphone,
    section: 'marketing',
    title: 'SMS Campaigns',
    subtitle: placeholderSubtitle,
  },
  {
    id: 'ivr-calls',
    label: 'IVR Calls',
    path: '/marketing/ivr-calls',
    icon: Phone,
    section: 'marketing',
    title: 'IVR Calls',
    subtitle: placeholderSubtitle,
  },
  {
    id: 'bulk-campaigns',
    label: 'Bulk Campaigns',
    path: '/marketing/bulk-campaigns',
    icon: Send,
    section: 'marketing',
    title: 'Bulk Campaigns',
    subtitle: placeholderSubtitle,
  },
  {
    id: 'workflow-automation',
    label: 'Workflow Automation',
    path: '/marketing/workflow-automation',
    icon: Workflow,
    section: 'marketing',
    title: 'Workflow Automation',
    subtitle: placeholderSubtitle,
  },
  // AI Suite
  {
    id: 'ai-dashboard',
    label: 'AI Dashboard',
    path: '/ai/dashboard',
    icon: Sparkles,
    section: 'ai',
    title: 'AI Dashboard',
    subtitle: placeholderSubtitle,
  },
  {
    id: 'ai-brain',
    label: 'AI Brain',
    path: '/ai/brain',
    icon: Brain,
    section: 'ai',
    title: 'AI Brain',
    subtitle: placeholderSubtitle,
  },
  {
    id: 'ai-funnels',
    label: 'AI Funnels',
    path: '/ai/funnels',
    icon: GitBranch,
    section: 'ai',
    title: 'AI Funnels',
    subtitle: placeholderSubtitle,
  },
  {
    id: 'ai-agent-inbox',
    label: 'AI Agent Inbox',
    path: '/ai/agent-inbox',
    icon: Inbox,
    section: 'ai',
    title: 'AI Agent Inbox',
    subtitle: placeholderSubtitle,
  },
  // CRM & Sales
  {
    id: 'crm',
    label: 'CRM',
    path: '/crm',
    icon: Users,
    section: 'crm',
    title: 'CRM',
    subtitle: placeholderSubtitle,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    path: '/crm/analytics',
    icon: BarChart3,
    section: 'crm',
    title: 'Analytics',
    subtitle: placeholderSubtitle,
  },
  {
    id: 'finance-management',
    label: 'Finance Management',
    path: '/crm/finance',
    icon: Wallet,
    section: 'crm',
    title: 'Finance Management',
    subtitle: placeholderSubtitle,
  },
  {
    id: 'payment-gateway',
    label: 'Payment Gateway',
    path: '/crm/payment-gateway',
    icon: CreditCard,
    section: 'crm',
    title: 'Payment Gateway',
    subtitle: placeholderSubtitle,
  },
  {
    id: 'affiliate-management',
    label: 'Affiliate Management',
    path: '/crm/affiliates',
    icon: Handshake,
    section: 'crm',
    title: 'Affiliate Management',
    subtitle: placeholderSubtitle,
  },
  {
    id: 'calendar-booking',
    label: 'Calendar Booking',
    path: '/crm/calendar',
    icon: Calendar,
    section: 'crm',
    title: 'Calendar Booking',
    subtitle: placeholderSubtitle,
  },
  // Learning & Community
  {
    id: 'lms',
    label: 'LMS',
    path: '/learning/lms',
    icon: BookOpen,
    section: 'learning',
    title: 'LMS',
    subtitle: placeholderSubtitle,
  },
  {
    id: 'student-portal',
    label: 'Student Portal',
    path: '/learning/student-portal',
    icon: GraduationCap,
    section: 'learning',
    title: 'Student Portal',
    subtitle: placeholderSubtitle,
  },
  {
    id: 'community',
    label: 'Community',
    path: '/learning/community',
    icon: UsersRound,
    section: 'learning',
    title: 'Community',
    subtitle: placeholderSubtitle,
  },
  {
    id: 'discussion-forum',
    label: 'Discussion Forum',
    path: '/learning/discussion-forum',
    icon: MessageSquare,
    section: 'learning',
    title: 'Discussion Forum',
    subtitle: placeholderSubtitle,
  },
  {
    id: 'success-habits',
    label: 'Success Habits',
    path: '/learning/success-habits',
    icon: Target,
    section: 'learning',
    title: 'Success Habits',
    subtitle: placeholderSubtitle,
  },
  // Operations
  {
    id: 'manage-staff',
    label: 'Manage Staff',
    path: '/operations/staff',
    icon: UserCog,
    section: 'operations',
    title: 'Manage Staff',
    subtitle: placeholderSubtitle,
  },
  {
    id: 'vault',
    label: 'Vault',
    path: '/operations/vault',
    icon: Lock,
    section: 'operations',
    title: 'Vault',
    subtitle: placeholderSubtitle,
  },
  {
    id: 'app-store',
    label: 'App Store',
    path: '/operations/app-store',
    icon: Store,
    section: 'operations',
    title: 'App Store',
    subtitle: placeholderSubtitle,
  },
  {
    id: 'project-management',
    label: 'Project Management',
    path: '/operations/projects',
    icon: Kanban,
    section: 'operations',
    title: 'Project Management',
    subtitle: placeholderSubtitle,
  },
  {
    id: 'school-module',
    label: 'School Module',
    path: '/operations/school',
    icon: School,
    section: 'operations',
    title: 'School Module',
    subtitle: placeholderSubtitle,
  },
  {
    id: 'health-module',
    label: 'Health Module',
    path: '/operations/health',
    icon: HeartPulse,
    section: 'operations',
    title: 'Health Module',
    subtitle: placeholderSubtitle,
  },
];

const sectionTitles: Record<NavSectionId, string | null> = {
  dashboard: null,
  builders: 'Builders',
  marketing: 'Marketing',
  ai: 'AI Suite',
  crm: 'CRM & Sales',
  learning: 'Learning & Community',
  operations: 'Operations',
};

const sectionOrder: NavSectionId[] = [
  'dashboard',
  'builders',
  'marketing',
  'ai',
  'crm',
  'learning',
  'operations',
];

export const navigationSections: NavSection[] = sectionOrder.map((id) => ({
  id,
  title: sectionTitles[id],
  items: modules.filter((m) => m.section === id),
}));

export const moduleRoutes = modules.filter((m) => m.id !== 'dashboard');

export function getModuleByPath(pathname: string): ModuleConfig {
  const normalized =
    pathname.length > 1 && pathname.endsWith('/')
      ? pathname.slice(0, -1)
      : pathname;
  return (
    modules.find((m) => m.path === normalized) ??
    modules[0]
  );
}

export function getSectionLabel(sectionId: NavSectionId): string {
  return sectionTitles[sectionId] ?? 'Dashboard';
}
