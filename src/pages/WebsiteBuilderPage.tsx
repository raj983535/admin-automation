import { useState, useCallback, useMemo } from 'react';
import { BuilderActionBar } from '../components/website-builder/BuilderActionBar';
import { ComponentPanel } from '../components/website-builder/ComponentPanel';
import { BuilderCanvas } from '../components/website-builder/BuilderCanvas';
import { SettingsPanel } from '../components/website-builder/SettingsPanel';
import { TemplateGallery } from '../components/website-builder/TemplateGallery';
import { useNotifications } from '../hooks/useNotifications';
import { loadDemoState, saveDemoState } from '../services/demoStorage.service';
import type { PageSection, PageSectionContent, WebsiteSectionType } from '../types/builder.types';
import styles from './WebsiteBuilderPage.module.css';

type PreviewMode = 'desktop' | 'tablet' | 'mobile';
type ViewMode = 'editor' | 'preview' | 'templates';

const STORAGE_KEY = 'collegeos.websiteBuilder.sections';
const PUBLISHED_KEY = 'collegeos.websiteBuilder.published';

const initialSections: PageSection[] = [
  {
    id: 'hero',
    type: 'hero',
    title: 'Hero Section',
    content: {
      headline: 'Welcome to Springfield College',
      subheadline: 'Empowering Minds, Shaping Futures',
      ctaText: 'Apply Now',
      ctaLink: '/apply',
      metaTitle: 'Springfield College Admissions',
      metaDescription: 'A ready admissions landing page with inquiry, program, and contact sections.'
    },
    visible: true
  },
  {
    id: 'features',
    type: 'features',
    title: 'Key Features',
    content: {
      items: [
        { icon: 'Award', title: 'Excellence', description: 'Ranked among top colleges' },
        { icon: 'Users', title: 'Community', description: 'Diverse and inclusive campus' },
        { icon: 'BookOpen', title: 'Learning', description: 'World-class education' },
        { icon: 'Briefcase', title: 'Placements', description: 'Career support from day one' }
      ]
    },
    visible: true
  },
  {
    id: 'programs',
    type: 'programs',
    title: 'Our Programs',
    content: {
      programs: [
        { name: 'Business Administration', duration: '4 Years' },
        { name: 'Computer Science', duration: '4 Years' },
        { name: 'Psychology', duration: '3 Years' },
        { name: 'Data Science', duration: '4 Years' }
      ]
    },
    visible: true
  }
];

const templateSections: Record<string, WebsiteSectionType[]> = {
  'modern-landing': ['hero', 'features', 'about', 'programs', 'testimonials', 'contact', 'footer'],
  'academic-home': ['hero', 'about', 'programs', 'features', 'footer'],
  'admissions-portal': ['hero', 'features', 'programs', 'contact', 'footer'],
  'events-showcase': ['hero', 'features', 'testimonials', 'contact', 'footer'],
  'research-hub': ['hero', 'about', 'features', 'programs', 'footer'],
  'student-life': ['hero', 'features', 'testimonials', 'contact', 'footer'],
};

function titleForSection(type: WebsiteSectionType) {
  const titles: Record<WebsiteSectionType, string> = {
    hero: 'Hero Section',
    features: 'Key Benefits',
    about: 'About Institution',
    programs: 'Programs Offered',
    testimonials: 'Student Stories',
    contact: 'Admissions Contact',
    footer: 'Footer Navigation',
  };
  return titles[type];
}

function getDefaultContent(type: WebsiteSectionType, templateId = 'modern-landing'): PageSectionContent {
  const context = templateId.replace(/-/g, ' ');

  switch (type) {
    case 'hero':
      return {
        headline: templateId === 'events-showcase' ? 'Open Day Registrations Are Live' : 'Admissions Open for 2026',
        subheadline: `A ready-to-demo ${context} page for explaining lead capture, program discovery, and student conversion.`,
        ctaText: templateId === 'events-showcase' ? 'Book Campus Visit' : 'Start Application',
        ctaLink: templateId === 'events-showcase' ? '/events/open-day' : '/apply',
        metaTitle: 'CollegeOS Demo Landing Page',
        metaDescription: 'Explain how website sections convert visitors into qualified admission inquiries.',
      };
    case 'features':
      return {
        items: [
          { icon: 'Award', title: 'Scholarship Finder', description: 'Shows students eligible fee waivers before they apply.' },
          { icon: 'Users', title: 'Counsellor Routing', description: 'Connects every inquiry to the right admissions owner.' },
          { icon: 'BookOpen', title: 'Program Discovery', description: 'Helps families compare courses, duration, and outcomes.' },
          { icon: 'Clock', title: 'Fast Follow-up', description: 'Pushes high-intent leads into CRM workflows instantly.' },
        ],
      };
    case 'about':
      return {
        headline: 'Built for Admissions Teams',
        body: 'Use this section to explain the college story, campus strengths, accreditation, outcomes, and why students should take the next step.',
      };
    case 'programs':
      return {
        programs: [
          { name: 'B.Tech Computer Science', duration: '4 Years', outcome: 'AI, cloud, and product engineering careers' },
          { name: 'MBA Finance', duration: '2 Years', outcome: 'Banking, analytics, and consulting roles' },
          { name: 'B.Sc Biotechnology', duration: '3 Years', outcome: 'Research, lab operations, and healthcare pathways' },
          { name: 'BBA Digital Business', duration: '3 Years', outcome: 'Marketing, operations, and startup roles' },
        ],
      };
    case 'testimonials':
      return {
        testimonials: [
          { quote: 'The counsellor called within ten minutes and helped me choose the right branch.', author: 'Aarav Mehta', role: 'B.Tech applicant' },
          { quote: 'Scholarship details were clear before payment, so my parents trusted the process.', author: 'Kriti Sharma', role: 'MBA applicant' },
          { quote: 'Campus visit booking and reminders made the admission journey simple.', author: 'Sneha Rao', role: 'Biotech applicant' },
        ],
      };
    case 'contact':
      return {
        headline: 'Talk to Admissions',
        body: 'Use this form to capture name, phone, preferred course, city, and scholarship interest.',
        phone: '+91 80 6000 1200',
        email: 'admissions@collegeos.edu',
        address: 'Admissions Block, Knowledge Park Campus',
      };
    case 'footer':
      return {
        links: ['Admissions', 'Scholarships', 'Programs', 'Campus Tour', 'Contact'],
      };
  }
}

function createSection(type: WebsiteSectionType, index: number, templateId = 'modern-landing'): PageSection {
  return {
    id: `${templateId}-${type}-${index + 1}`,
    type,
    title: titleForSection(type),
    content: getDefaultContent(type, templateId),
    visible: true,
  };
}

export function WebsiteBuilderPage() {
  const { notify } = useNotifications();
  const [viewMode, setViewMode] = useState<ViewMode>('editor');
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(true);
  const [showComponentPanel, setShowComponentPanel] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sections, setSections] = useState<PageSection[]>(() => loadDemoState(STORAGE_KEY, initialSections));

  const handleAddSection = useCallback((type: WebsiteSectionType) => {
    setSections(prev => [...prev, {
      id: `${type}-${Date.now()}`,
      type,
      title: titleForSection(type),
      content: getDefaultContent(type, 'custom'),
      visible: true
    }]);
  }, []);

  const handleUpdateSection = useCallback((id: string, content: PageSectionContent) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, content } : s));
  }, []);

  const handleDeleteSection = useCallback((id: string) => {
    setSections(prev => prev.filter(s => s.id !== id));
    setSelectedSection(prev => prev === id ? null : prev);
  }, []);

  const handleToggleVisibility = useCallback((id: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, visible: !s.visible } : s));
  }, []);

  const handleReorder = useCallback((fromIndex: number, toIndex: number) => {
    setSections(prev => {
      const newSections = [...prev];
      const [removed] = newSections.splice(fromIndex, 1);
      newSections.splice(toIndex, 0, removed);
      return newSections;
    });
  }, []);

  const handleSelectTemplate = useCallback((templateId: string) => {
    if (templateId === 'blank') {
      setSections([]);
      setSelectedSection(null);
      setViewMode('editor');
      notify({
        type: 'info',
        title: 'Blank website started',
        message: 'Add demo-ready sections from the component panel.',
      });
      return;
    }

    const nextSections = (templateSections[templateId] || templateSections['modern-landing'])
      .map((type, index) => createSection(type, index, templateId));
    setSections(nextSections);
    setSelectedSection(nextSections[0]?.id ?? null);
    setViewMode('editor');
    notify({
      type: 'success',
      title: 'Template loaded',
      message: `${nextSections.length} working example sections are ready to present.`,
    });
  }, [notify]);

  const handleSave = useCallback(() => {
    saveDemoState(STORAGE_KEY, sections);
    notify({
      type: 'success',
      title: 'Website draft saved',
      message: `${sections.length} sections saved locally for this demo browser.`,
    });
  }, [notify, sections]);

  const handlePublish = useCallback(() => {
    saveDemoState(STORAGE_KEY, sections);
    saveDemoState(PUBLISHED_KEY, {
      sections,
      publishedAt: new Date().toISOString(),
      slug: 'springfield-college-admissions',
    });
    notify({
      type: 'success',
      title: 'Website published',
      message: 'Demo publish snapshot created. You can now explain the visitor-to-lead journey.',
    });
  }, [notify, sections]);

  const selectedSectionData = useMemo(
    () => sections.find(s => s.id === selectedSection),
    [sections, selectedSection]
  );

  const shouldShowSettings = showSettings && selectedSectionData;

  return (
    <div className={styles.page}>
      <BuilderActionBar
        viewMode={viewMode}
        previewMode={previewMode}
        showSettings={showSettings}
        showComponentPanel={showComponentPanel}
        searchQuery={searchQuery}
        onViewModeChange={setViewMode}
        onPreviewModeChange={setPreviewMode}
        onToggleSettings={() => setShowSettings(prev => !prev)}
        onToggleComponentPanel={() => setShowComponentPanel(prev => !prev)}
        onSearchChange={setSearchQuery}
        onSave={handleSave}
        onPublish={handlePublish}
      />

      <div className={styles.builderContainer}>
        {viewMode === 'templates' ? (
          <TemplateGallery onSelectTemplate={handleSelectTemplate} />
        ) : (
          <>
            {showComponentPanel && (
              <ComponentPanel
                onAddSection={handleAddSection}
                searchQuery={searchQuery}
              />
            )}

            <BuilderCanvas
              sections={sections}
              selectedSection={selectedSection}
              previewMode={previewMode}
              viewMode={viewMode}
              onSelectSection={setSelectedSection}
              onDeleteSection={handleDeleteSection}
              onToggleVisibility={handleToggleVisibility}
              onReorder={handleReorder}
            />

            {shouldShowSettings && (
              <SettingsPanel
                section={selectedSectionData}
                onUpdate={handleUpdateSection}
                onClose={() => setSelectedSection(null)}
                onSave={handleSave}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
