import { useState, memo, useMemo } from 'react';
import {
  GripVertical,
  Eye,
  EyeOff,
  Trash2,
  Edit3,
} from 'lucide-react';
import { Card } from '../ui/Card';
import type {
  FeatureItem,
  PageSection,
  ProgramItem,
  TestimonialItem,
} from '../../types/builder.types';
import styles from './BuilderCanvas.module.css';

type PreviewMode = 'desktop' | 'tablet' | 'mobile';
type ViewMode = 'editor' | 'preview' | 'templates';

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
  onReorder,
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
            {(section.content.items || []).map((item: FeatureItem, idx: number) => (
              <div key={`${item.title}-${idx}`} className={styles.featureItem}>
                <div className={styles.featureIcon}>*</div>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        );
      case 'programs':
        return (
          <div className={styles.programsPreview}>
            {(section.content.programs || []).map((prog: ProgramItem, idx: number) => (
              <div key={`${prog.name}-${idx}`} className={styles.programItem}>
                <div>
                  <h4>{prog.name}</h4>
                  {prog.outcome && <p className={styles.programOutcome}>{prog.outcome}</p>}
                </div>
                <span className={styles.programDuration}>{prog.duration}</span>
              </div>
            ))}
          </div>
        );
      case 'about':
        return (
          <div className={styles.copyPreview}>
            <h4>{section.content.headline || section.title}</h4>
            <p>{section.content.body || 'Add an institution story and proof points.'}</p>
          </div>
        );
      case 'testimonials':
        return (
          <div className={styles.testimonialPreview}>
            {(section.content.testimonials || []).map((item: TestimonialItem, idx: number) => (
              <div key={`${item.author}-${idx}`} className={styles.testimonialItem}>
                <p>"{item.quote}"</p>
                <strong>{item.author}</strong>
                <span>{item.role}</span>
              </div>
            ))}
          </div>
        );
      case 'contact':
        return (
          <div className={styles.copyPreview}>
            <h4>{section.content.headline || 'Contact Admissions'}</h4>
            <p>{section.content.body}</p>
            <div className={styles.contactGrid}>
              <span>{section.content.phone}</span>
              <span>{section.content.email}</span>
              <span>{section.content.address}</span>
            </div>
          </div>
        );
      case 'footer':
        return (
          <div className={styles.footerPreview}>
            {(section.content.links || []).map((link) => (
              <span key={link}>{link}</span>
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
              <div className={styles.emptyIcon}>DOC</div>
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
                  !section.visible ? styles.hidden : '',
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
