import { memo, useCallback } from 'react';
import { X, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import type { PageSection, PageSectionContent } from '../../types/builder.types';
import styles from './SettingsPanel.module.css';

interface SettingsPanelProps {
  section: PageSection;
  onUpdate: (id: string, content: PageSectionContent) => void;
  onClose: () => void;
  onSave: () => void;
}

function SettingsPanelComponent({ section, onUpdate, onClose, onSave }: SettingsPanelProps) {
  const handleContentChange = useCallback(<K extends keyof PageSectionContent>(key: K, value: PageSectionContent[K]) => {
    onUpdate(section.id, {
      ...section.content,
      [key]: value
    });
  }, [section.id, section.content, onUpdate]);

  const renderSectionSettings = () => {
    switch (section.type) {
      case 'hero':
        return (
          <div className={styles.settingsGroup}>
            <h4 className={styles.settingsGroupTitle}>Hero Content</h4>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Headline</label>
              <input
                type="text"
                value={section.content.headline || ''}
                onChange={(e) => handleContentChange('headline', e.target.value)}
                className={styles.fieldInput}
                placeholder="Enter headline"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Subheadline</label>
              <textarea
                value={section.content.subheadline || ''}
                onChange={(e) => handleContentChange('subheadline', e.target.value)}
                className={styles.fieldTextarea}
                placeholder="Enter subheadline"
                rows={3}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>CTA Button Text</label>
              <input
                type="text"
                value={section.content.ctaText || ''}
                onChange={(e) => handleContentChange('ctaText', e.target.value)}
                className={styles.fieldInput}
                placeholder="Enter button text"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>CTA Link</label>
              <input
                type="text"
                value={section.content.ctaLink || ''}
                onChange={(e) => handleContentChange('ctaLink', e.target.value)}
                className={styles.fieldInput}
                placeholder="/path"
              />
            </div>
          </div>
        );

      case 'features':
        return (
          <div className={styles.settingsGroup}>
            <h4 className={styles.settingsGroupTitle}>Features</h4>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Feature Items</label>
              <p className={styles.fieldHint}>Edit features in the canvas</p>
            </div>
          </div>
        );

      case 'programs':
        return (
          <div className={styles.settingsGroup}>
            <h4 className={styles.settingsGroupTitle}>Programs</h4>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Program List</label>
              <p className={styles.fieldHint}>Edit programs in the canvas</p>
            </div>
          </div>
        );

      case 'about':
      case 'contact':
        return (
          <div className={styles.settingsGroup}>
            <h4 className={styles.settingsGroupTitle}>{section.type === 'about' ? 'About Copy' : 'Contact Copy'}</h4>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Headline</label>
              <input
                type="text"
                value={section.content.headline || ''}
                onChange={(e) => handleContentChange('headline', e.target.value)}
                className={styles.fieldInput}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Body</label>
              <textarea
                value={section.content.body || ''}
                onChange={(e) => handleContentChange('body', e.target.value)}
                className={styles.fieldTextarea}
                rows={4}
              />
            </div>
            {section.type === 'contact' && (
              <>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Phone</label>
                  <input
                    type="text"
                    value={section.content.phone || ''}
                    onChange={(e) => handleContentChange('phone', e.target.value)}
                    className={styles.fieldInput}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Email</label>
                  <input
                    type="email"
                    value={section.content.email || ''}
                    onChange={(e) => handleContentChange('email', e.target.value)}
                    className={styles.fieldInput}
                  />
                </div>
              </>
            )}
          </div>
        );

      default:
        return (
          <div className={styles.settingsGroup}>
            <h4 className={styles.settingsGroupTitle}>Section Settings</h4>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Section Title</label>
              <input
                type="text"
                value={section.title}
                onChange={(e) => onUpdate(section.id, { ...section.content, title: e.target.value })}
                className={styles.fieldInput}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.settingsPanel}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitleRow}>
          <Settings size={16} />
          <h3 className={styles.panelTitle}>Section Settings</h3>
        </div>
        <button onClick={onClose} className={styles.closeButton}>
          <X size={16} />
        </button>
      </div>

      <div className={styles.panelContent}>
        <div className={styles.sectionInfo}>
          <span className={styles.sectionType}>{section.type}</span>
          <span className={styles.sectionId}>{section.id}</span>
        </div>

        {renderSectionSettings()}

        <div className={styles.settingsGroup}>
          <h4 className={styles.settingsGroupTitle}>SEO Settings</h4>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Meta Title</label>
            <input
              type="text"
              value={section.content.metaTitle || ''}
              onChange={(e) => handleContentChange('metaTitle', e.target.value)}
              className={styles.fieldInput}
              placeholder="Page title for search engines"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Meta Description</label>
            <textarea
              value={section.content.metaDescription || ''}
              onChange={(e) => handleContentChange('metaDescription', e.target.value)}
              className={styles.fieldTextarea}
              placeholder="Brief description for search results"
              rows={3}
            />
          </div>
        </div>

        <div className={styles.settingsGroup}>
          <h4 className={styles.settingsGroupTitle}>Advanced</h4>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Custom CSS Classes</label>
            <input
              type="text"
              value={section.content.customClasses || ''}
              onChange={(e) => handleContentChange('customClasses', e.target.value)}
              className={styles.fieldInput}
              placeholder="class-name-1 class-name-2"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Section ID</label>
            <input
              type="text"
              value={section.content.sectionId || ''}
              onChange={(e) => handleContentChange('sectionId', e.target.value)}
              className={styles.fieldInput}
              placeholder="section-id"
            />
          </div>
        </div>
      </div>

      <div className={styles.panelFooter}>
        <Button variant="secondary" size="sm" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" size="sm" onClick={onSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}

export const SettingsPanel = memo(SettingsPanelComponent);
