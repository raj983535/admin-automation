import { memo } from 'react';
import { Monitor, Tablet, Smartphone, Eye, Save, Globe, Settings, Layers, Search, X } from 'lucide-react';
import { Button } from '../ui/Button';
import styles from './BuilderActionBar.module.css';

type PreviewMode = 'desktop' | 'tablet' | 'mobile';
type ViewMode = 'editor' | 'preview' | 'templates';

interface BuilderActionBarProps {
  viewMode: ViewMode;
  previewMode: PreviewMode;
  showSettings: boolean;
  showComponentPanel: boolean;
  searchQuery: string;
  onViewModeChange: (mode: ViewMode) => void;
  onPreviewModeChange: (mode: PreviewMode) => void;
  onToggleSettings: () => void;
  onToggleComponentPanel: () => void;
  onSearchChange: (query: string) => void;
  onSave: () => void;
  onPublish: () => void;
}

function BuilderActionBarComponent({
  viewMode,
  previewMode,
  showSettings,
  showComponentPanel,
  searchQuery,
  onViewModeChange,
  onPreviewModeChange,
  onToggleSettings,
  onToggleComponentPanel,
  onSearchChange,
  onSave,
  onPublish
}: BuilderActionBarProps) {
  return (
    <div className={styles.actionBar}>
      <div className={styles.leftSection}>
        <div className={styles.viewModeToggle}>
          <Button
            variant={viewMode === 'editor' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('editor')}
            className={styles.modeButton}
          >
            <Layers size={16} />
            <span className={styles.buttonText}>Editor</span>
          </Button>
          <Button
            variant={viewMode === 'templates' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('templates')}
            className={styles.modeButton}
          >
            <Globe size={16} />
            <span className={styles.buttonText}>Templates</span>
          </Button>
          <Button
            variant={viewMode === 'preview' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('preview')}
            className={styles.modeButton}
          >
            <Eye size={16} />
            <span className={styles.buttonText}>Preview</span>
          </Button>
        </div>

        {viewMode === 'preview' && (
          <div className={styles.previewModeToggle}>
            <Button
              variant={previewMode === 'desktop' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onPreviewModeChange('desktop')}
              title="Desktop"
            >
              <Monitor size={16} />
            </Button>
            <Button
              variant={previewMode === 'tablet' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onPreviewModeChange('tablet')}
              title="Tablet"
            >
              <Tablet size={16} />
            </Button>
            <Button
              variant={previewMode === 'mobile' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onPreviewModeChange('mobile')}
              title="Mobile"
            >
              <Smartphone size={16} />
            </Button>
          </div>
        )}
      </div>

      <div className={styles.centerSection}>
        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className={styles.clearSearch}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.panelToggles}>
          <Button
            variant={showComponentPanel ? 'primary' : 'ghost'}
            size="sm"
            onClick={onToggleComponentPanel}
            title="Toggle Components"
          >
            <Layers size={16} />
          </Button>
          <Button
            variant={showSettings ? 'primary' : 'ghost'}
            size="sm"
            onClick={onToggleSettings}
            title="Toggle Settings"
          >
            <Settings size={16} />
          </Button>
        </div>

        <div className={styles.actionButtons}>
          <Button variant="secondary" size="sm" onClick={onSave} className={styles.saveButton}>
            <Save size={16} />
            <span className={styles.buttonText}>Save</span>
          </Button>
          <Button variant="primary" size="sm" onClick={onPublish} className={styles.publishButton}>
            <Globe size={16} />
            <span className={styles.buttonText}>Publish</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export const BuilderActionBar = memo(BuilderActionBarComponent);
