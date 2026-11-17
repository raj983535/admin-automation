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
    description: 'Homepage with story, benefits, programs, student proof, contact, and footer.',
    category: 'landing',
    thumbnail: 'HOME',
    featured: true,
    sections: ['hero', 'features', 'about', 'programs', 'testimonials', 'contact', 'footer'],
  },
  {
    id: 'academic-home',
    name: 'Academic Home',
    description: 'Traditional academic layout for explaining departments, outcomes, and trust signals.',
    category: 'academic',
    thumbnail: 'ACAD',
    featured: true,
    sections: ['hero', 'about', 'programs', 'features', 'footer'],
  },
  {
    id: 'admissions-portal',
    name: 'Admissions Portal',
    description: 'Recruitment-focused page with application CTA, scholarship benefits, and contact handoff.',
    category: 'admissions',
    thumbnail: 'APPLY',
    featured: false,
    sections: ['hero', 'features', 'programs', 'contact', 'footer'],
  },
  {
    id: 'events-showcase',
    name: 'Events Showcase',
    description: 'Campus open day page with event benefits, student proof, and booking contact.',
    category: 'events',
    thumbnail: 'EVENT',
    featured: false,
    sections: ['hero', 'features', 'testimonials', 'contact', 'footer'],
  },
  {
    id: 'research-hub',
    name: 'Research Hub',
    description: 'Research and faculty showcase with program pathways and proof points.',
    category: 'academic',
    thumbnail: 'LAB',
    featured: false,
    sections: ['hero', 'about', 'features', 'programs', 'footer'],
  },
  {
    id: 'student-life',
    name: 'Student Life',
    description: 'Campus culture page for clubs, hostel life, placements, and student stories.',
    category: 'landing',
    thumbnail: 'LIFE',
    featured: false,
    sections: ['hero', 'features', 'testimonials', 'contact', 'footer'],
  },
];

const categories = [
  { id: 'all', label: 'All Templates' },
  { id: 'landing', label: 'Landing Pages' },
  { id: 'academic', label: 'Academic' },
  { id: 'admissions', label: 'Admissions' },
  { id: 'events', label: 'Events' },
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
          <p className={styles.gallerySubtitle}>Choose a working demo template for your presentation</p>
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
          <div className={styles.emptyIcon}>NO</div>
          <h4>No templates found</h4>
          <p>Try adjusting your search or category filter</p>
        </div>
      )}
    </div>
  );
}

export const TemplateGallery = memo(TemplateGalleryComponent);
