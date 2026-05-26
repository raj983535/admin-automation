import { useState, memo, useMemo } from 'react';
import { 
  GripVertical, 
  Eye, 
  EyeOff, 
  Trash2, 
  Edit3
} from 'lucide-react';
import { Card } from '../ui/Card';
import styles from './BuilderCanvas.module.css';

type PreviewMode = 'desktop' | 'tablet' | 'mobile';
type ViewMode = 'editor' | 'preview' | 'templates';

interface PageSection {
  id: string;
  type: 'hero' | 'features' | 'about' | 'programs' | 'testimonials' | 'contact' | 'footer';
  title: string;
  content: any;
  visible: boolean;
}

interface BuilderCanvasProps {
  sections: PageSection[];
  selectedSection: string | null;
  previewMode: PreviewMode;
  viewMode: ViewMode;
  onSelectSection: (id: string) => void;
  onDeleteSection: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

function BuilderCanvasComponent({
  sections,
  selectedSection,
  previewMode,
  viewMode,
  onSelectSection,
  onDeleteSection,
  onToggleVisibility,
  onReorder
}: BuilderCanvasProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    onReorder(draggedIndex, index);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const renderSectionPreview = useMemo(() => (section: PageSection) => {
    switch (section.type) {
      case 'hero':
        return (
          <div className={styles.heroPreview}>
            <h2 className={styles.heroHeadline}>{section.content.headline || 'Hero Headline'}</h2>
            <p className={styles.heroSubheadline}>{section.content.subheadline || 'Hero subheadline goes here'}</p>
            <button className={styles.heroCta}>{section.content.ctaText || 'Call to Action'}</button>
          </div>
        );
      case 'features':
        return (
          <div className={styles.featuresPreview}>
            {section.content.items?.map((item: any, idx: number) => (
              <div key={idx} className={styles.featureItem}>
                <div className={styles.featureIcon}>★</div>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        );
      case 'programs':
        return (
          <div className={styles.programsPreview}>
            {section.content.programs?.map((prog: any, idx: number) => (
              <div key={idx} className={styles.programItem}>
                <h4>{prog.name}</h4>
                <span className={styles.programDuration}>{prog.duration}</span>
              </div>
            ))}
          </div>
        );
      default:
        return <div className={styles.placeholderPreview}>{section.title}</div>;
    }
  }, []);

  const previewWidth = useMemo(() => {
    switch (previewMode) {
      case 'desktop': return '100%';
      case 'tablet': return '768px';
      case 'mobile': return '375px';
    }
  }, [previewMode]);

  return (
    <div className={styles.builderCanvas}>
      <div className={styles.canvasHeader}>
        <h3 className={styles.canvasTitle}>Page Canvas</h3>
        <div className={styles.canvasMeta}>
          <span className={styles.sectionCount}>{sections.length} sections</span>
        </div>
      </div>

      <div className={styles.canvasContent}>
        <div 
          className={styles.previewContainer}
          style={{ maxWidth: previewWidth }}
        >
          {sections.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📄</div>
              <h4>No sections yet</h4>
              <p>Add components from the left panel to start building your page</p>
            </div>
          ) : (
            sections.map((section, index) => (
              <div
                key={section.id}
                draggable={viewMode === 'editor'}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={[
                  styles.sectionWrapper,
                  selectedSection === section.id ? styles.selected : '',
                  !section.visible ? styles.hidden : ''
                ].filter(Boolean).join(' ')}
              >
                {viewMode === 'editor' && (
                  <div className={styles.sectionToolbar}>
                    <div className={styles.dragHandle}>
                      <GripVertical size={14} />
                    </div>
                    <div className={styles.sectionActions}>
                      <button
                        onClick={() => onSelectSection(section.id)}
                        className={styles.actionButton}
                        title="Edit section"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => onToggleVisibility(section.id)}
                        className={styles.actionButton}
                        title={section.visible ? 'Hide section' : 'Show section'}
                      >
                        {section.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                      <button
                        onClick={() => onDeleteSection(section.id)}
                        className={styles.actionButton}
                        title="Delete section"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}

                <Card className={styles.sectionCard}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionType}>{section.type}</span>
                    <span className={styles.sectionTitle}>{section.title}</span>
                  </div>
                  <div className={styles.sectionPreview}>
                    {renderSectionPreview(section)}
                  </div>
                </Card>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export const BuilderCanvas = memo(BuilderCanvasComponent);
