import { memo, useCallback } from 'react';
import { X, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import type { FunnelStep, FunnelStepContent } from '../../types/builder.types';
import styles from './StepEditor.module.css';

interface StepEditorProps {
  step: FunnelStep;
  onUpdate: (id: string, updates: Partial<FunnelStep>) => void;
  onClose: () => void;
}

function StepEditorComponent({ step, onUpdate, onClose }: StepEditorProps) {
  const handleContentChange = useCallback(<K extends keyof FunnelStepContent>(key: K, value: FunnelStepContent[K]) => {
    onUpdate(step.id, {
      content: {
        ...step.content,
        [key]: value,
      }
    });
  }, [step.id, step.content, onUpdate]);

  const handleStepChange = useCallback(<K extends keyof FunnelStep>(key: K, value: FunnelStep[K]) => {
    onUpdate(step.id, { [key]: value });
  }, [step.id, onUpdate]);

  return (
    <div className={styles.stepEditor}>
      <div className={styles.editorHeader}>
        <div className={styles.editorTitleRow}>
          <Settings size={16} />
          <h3 className={styles.editorTitle}>Edit Step</h3>
        </div>
        <button onClick={onClose} className={styles.closeButton}>
          <X size={16} />
        </button>
      </div>

      <div className={styles.editorContent}>
        <div className={styles.stepInfo}>
          <span className={styles.stepType} style={{ background: step.color }}>
            {step.type}
          </span>
          <span className={styles.stepId}>{step.id}</span>
        </div>

        <div className={styles.settingsGroup}>
          <h4 className={styles.settingsGroupTitle}>Step Details</h4>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Step Name</label>
            <input
              type="text"
              value={step.name}
              onChange={(e) => handleStepChange('name', e.target.value)}
              className={styles.fieldInput}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Step Color</label>
            <input
              type="color"
              value={step.color}
              onChange={(e) => handleStepChange('color', e.target.value)}
              className={styles.colorInput}
            />
          </div>
        </div>

        <div className={styles.settingsGroup}>
          <h4 className={styles.settingsGroupTitle}>Metrics</h4>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Visitors</label>
            <input
              type="number"
              value={step.visitors}
              onChange={(e) => handleStepChange('visitors', parseInt(e.target.value) || 0)}
              className={styles.fieldInput}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Conversions</label>
            <input
              type="number"
              value={step.conversions}
              onChange={(e) => handleStepChange('conversions', parseInt(e.target.value) || 0)}
              className={styles.fieldInput}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Conversion Rate (%)</label>
            <input
              type="number"
              value={step.conversionRate}
              onChange={(e) => handleStepChange('conversionRate', parseFloat(e.target.value) || 0)}
              className={styles.fieldInput}
              step="0.1"
            />
          </div>
        </div>

        {step.type === 'landing' && (
          <div className={styles.settingsGroup}>
            <h4 className={styles.settingsGroupTitle}>Landing Page Content</h4>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Headline</label>
              <input
                type="text"
                value={step.content.headline || ''}
                onChange={(e) => handleContentChange('headline', e.target.value)}
                className={styles.fieldInput}
                placeholder="Enter headline"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Subheadline</label>
              <textarea
                value={step.content.subheadline || ''}
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
                value={step.content.ctaText || ''}
                onChange={(e) => handleContentChange('ctaText', e.target.value)}
                className={styles.fieldInput}
                placeholder="Enter button text"
              />
            </div>
          </div>
        )}

        {step.type === 'inquiry' && (
          <div className={styles.settingsGroup}>
            <h4 className={styles.settingsGroupTitle}>Form Fields</h4>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Form Fields (comma-separated)</label>
              <textarea
                value={step.content.fields?.join(', ') || ''}
                onChange={(e) => handleContentChange('fields', e.target.value.split(',').map(f => f.trim()))}
                className={styles.fieldTextarea}
                placeholder="name, email, phone, program"
                rows={3}
              />
            </div>
          </div>
        )}

        <div className={styles.settingsGroup}>
          <h4 className={styles.settingsGroupTitle}>Advanced</h4>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Custom CSS Classes</label>
            <input
              type="text"
              value={step.content.customClasses || ''}
              onChange={(e) => handleContentChange('customClasses', e.target.value)}
              className={styles.fieldInput}
              placeholder="class-name-1 class-name-2"
            />
          </div>
        </div>
      </div>

      <div className={styles.editorFooter}>
        <Button variant="secondary" size="sm" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" size="sm" onClick={onClose}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}

export const StepEditor = memo(StepEditorComponent);
