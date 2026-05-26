import { useState, useCallback, useMemo } from 'react';
import { BuilderActionBar } from '../components/website-builder/BuilderActionBar';
import { ComponentPanel } from '../components/website-builder/ComponentPanel';
import { BuilderCanvas } from '../components/website-builder/BuilderCanvas';
import { SettingsPanel } from '../components/website-builder/SettingsPanel';
import { TemplateGallery } from '../components/website-builder/TemplateGallery';
import styles from './WebsiteBuilderPage.module.css';

type PreviewMode = 'desktop' | 'tablet' | 'mobile';
type ViewMode = 'editor' | 'preview' | 'templates';

interface PageSection {
  id: string;
  type: 'hero' | 'features' | 'about' | 'programs' | 'testimonials' | 'contact' | 'footer';
  title: string;
  content: any;
  visible: boolean;
}

const initialSections: PageSection[] = [
  {
    id: 'hero',
    type: 'hero',
    title: 'Hero Section',
    content: {
      headline: 'Welcome to Springfield College',
      subheadline: 'Empowering Minds, Shaping Futures',
      ctaText: 'Apply Now',
      ctaLink: '/apply'
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
        { icon: 'BookOpen', title: 'Learning', description: 'World-class education' }
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
        { name: 'Psychology', duration: '3 Years' }
      ]
    },
    visible: true
  }
];

export function WebsiteBuilderPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('editor');
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(true);
  const [showComponentPanel, setShowComponentPanel] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sections, setSections] = useState<PageSection[]>(initialSections);

  const handleAddSection = useCallback((type: PageSection['type']) => {
    setSections(prev => [...prev, {
      id: `${type}-${Date.now()}`,
      type,
      title: type.charAt(0).toUpperCase() + type.slice(1) + ' Section',
      content: {},
      visible: true
    }]);
  }, []);

  const handleUpdateSection = useCallback((id: string, content: any) => {
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

  const handleSelectTemplate = useCallback(() => {
    setViewMode('editor');
  }, []);

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
        onSave={() => console.log('Saving page...')}
        onPublish={() => console.log('Publishing page...')}
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
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
