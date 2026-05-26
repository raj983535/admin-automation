import { useState, useMemo, memo, useCallback } from 'react';
import { Search, Star, Clock, ExternalLink, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import styles from './TemplateGallery.module.css';

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'landing' | 'academic' | 'admissions' | 'events';
  thumbnail: string;
  featured: boolean;
  sections: string[];
}

const templates: Template[] = [
  {
    id: 'modern-landing',
    name: 'Modern Landing',
    description: 'Clean and contemporary college homepage with hero, features, and programs',
    category: 'landing',
    thumbnail: '🎓',
    featured: true,
    sections: ['hero', 'features', 'programs', 'testimonials', 'contact', 'footer']
  },
  {
    id: 'academic-home',
    name: 'Academic Home',
    description: 'Traditional academic layout with department highlights and research showcase',
    category: 'academic',
    thumbnail: '📚',
    featured: true,
    sections: ['hero', 'features', 'programs', 'footer']
  },
  {
    id: 'admissions-portal',
    name: 'Admissions Portal',
    description: 'Focused on student recruitment with application CTAs and program details',
    category: 'admissions',
    thumbnail: '🎯',
    featured: false,
    sections: ['hero', 'features', 'programs', 'contact', 'footer']
  },
  {
    id: 'events-showcase',
    name: 'Events Showcase',
    description: 'Dynamic template for campus events and announcements',
    category: 'events',
    thumbnail: '📅',
    featured: false,
    sections: ['hero', 'features', 'testimonials', 'footer']
  },
  {
    id: 'research-hub',
    name: 'Research Hub',
    description: 'Highlight faculty research and academic achievements',
    category: 'academic',
    thumbnail: '🔬',
    featured: false,
    sections: ['hero', 'features', 'programs', 'footer']
  },
  {
    id: 'student-life',
    name: 'Student Life',
    description: 'Showcase campus culture and student activities',
    category: 'landing',
    thumbnail: '🎉',
    featured: false,
    sections: ['hero', 'features', 'testimonials', 'footer']
  }
];

const categories = [
  { id: 'all', label: 'All Templates' },
  { id: 'landing', label: 'Landing Pages' },
  { id: 'academic', label: 'Academic' },
  { id: 'admissions', label: 'Admissions' },
  { id: 'events', label: 'Events' }
];

interface TemplateGalleryProps {
  onSelectTemplate: (templateId: string) => void;
}

function TemplateGalleryComponent({ onSelectTemplate }: TemplateGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleSelect = useCallback((templateId: string) => {
    setSelectedTemplate(templateId);
    onSelectTemplate(templateId);
  }, [onSelectTemplate]);

  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);

  return (
    <div className={styles.templateGallery}>
      <div className={styles.galleryHeader}>
        <div>
          <h2 className={styles.galleryTitle}>Template Gallery</h2>
          <p className={styles.gallerySubtitle}>Choose a template to get started quickly</p>
        </div>
        <Button variant="primary" onClick={() => onSelectTemplate('blank')}>
          Start from Blank
        </Button>
      </div>

      <div className={styles.galleryControls}>
        <div className={styles.categoryTabs}>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`${styles.categoryTab} ${selectedCategory === cat.id ? styles.active : ''}`}
              onClick={() => handleCategoryChange(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.templateGrid}>
        {filteredTemplates.map(template => (
          <Card key={template.id} className={styles.templateCard}>
            {template.featured && (
              <div className={styles.featuredBadge}>
                <Star size={12} />
                Featured
              </div>
            )}
            <div className={styles.templateThumbnail}>
              <span className={styles.thumbnailEmoji}>{template.thumbnail}</span>
            </div>
            <div className={styles.templateInfo}>
              <div className={styles.templateHeader}>
                <h3 className={styles.templateName}>{template.name}</h3>
                <span className={styles.templateCategory}>{template.category}</span>
              </div>
              <p className={styles.templateDescription}>{template.description}</p>
              <div className={styles.templateMeta}>
                <div className={styles.metaItem}>
                  <Clock size={14} />
                  {template.sections.length} sections
                </div>
              </div>
            </div>
            <div className={styles.templateActions}>
              <Button
                variant="secondary"
                size="sm"
                className={styles.previewButton}
              >
                <ExternalLink size={14} />
                Preview
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSelect(template.id)}
                className={styles.useButton}
              >
                {selectedTemplate === template.id ? (
                  <>
                    <Check size={14} />
                    Selected
                  </>
                ) : (
                  'Use Template'
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔍</div>
          <h4>No templates found</h4>
          <p>Try adjusting your search or category filter</p>
        </div>
      )}
    </div>
  );
}

export const TemplateGallery = memo(TemplateGalleryComponent);
