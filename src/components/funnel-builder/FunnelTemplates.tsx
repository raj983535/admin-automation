import { useState, useMemo, memo, useCallback } from 'react';
import { Search, Star, Clock, ExternalLink, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import styles from './FunnelTemplates.module.css';

interface FunnelTemplate {
  id: string;
  name: string;
  description: string;
  category: 'admissions' | 'events' | 'donations' | 'surveys';
  thumbnail: string;
  featured: boolean;
  steps: number;
}

const templates: FunnelTemplate[] = [
  { id: 'admissions-standard', name: 'Standard Admissions', description: 'Full admission journey from landing page to confirmation.', category: 'admissions', thumbnail: 'ADM', featured: true, steps: 5 },
  { id: 'quick-apply', name: 'Quick Application', description: 'Short inquiry funnel for high-intent leads and walk-in campaigns.', category: 'admissions', thumbnail: 'FAST', featured: true, steps: 3 },
  { id: 'graduate-admissions', name: 'Graduate Admissions', description: 'Longer MBA/PG funnel with review and payment checkpoint.', category: 'admissions', thumbnail: 'PG', featured: true, steps: 6 },
  { id: 'international-students', name: 'International Students', description: 'Enrollment path with document review, fee quote, and visa support.', category: 'admissions', thumbnail: 'INTL', featured: false, steps: 6 },
  { id: 'event-registration', name: 'Event Registration', description: 'Campus event sign-up with payment and attendance confirmation.', category: 'events', thumbnail: 'EVT', featured: false, steps: 4 },
  { id: 'webinar-signup', name: 'Webinar Registration', description: 'Webinar opt-in funnel with automated follow-up.', category: 'events', thumbnail: 'WEB', featured: false, steps: 3 },
  { id: 'campus-tour', name: 'Campus Tour Booking', description: 'Schedule visits and route families to counsellors.', category: 'events', thumbnail: 'TOUR', featured: false, steps: 3 },
  { id: 'donation-campaign', name: 'Donation Campaign', description: 'Fundraising funnel with donor details and payment step.', category: 'donations', thumbnail: 'GIVE', featured: false, steps: 4 },
  { id: 'alumni-giving', name: 'Alumni Giving', description: 'Alumni engagement path with recurring giving prompts.', category: 'donations', thumbnail: 'ALUM', featured: false, steps: 4 },
  { id: 'student-survey', name: 'Student Survey', description: 'Collect feedback and show analytics-ready response flow.', category: 'surveys', thumbnail: 'SURV', featured: false, steps: 3 },
  { id: 'course-evaluation', name: 'Course Evaluation', description: 'Course feedback path for academic quality teams.', category: 'surveys', thumbnail: 'EVAL', featured: false, steps: 3 },
  { id: 'scholarship-apply', name: 'Scholarship Application', description: 'Eligibility-first scholarship funnel with document review.', category: 'admissions', thumbnail: 'SCH', featured: false, steps: 5 },
  { id: 'summer-program', name: 'Summer Program', description: 'Summer enrollment with seat fee and confirmation.', category: 'admissions', thumbnail: 'SUM', featured: false, steps: 4 },
  { id: 'newsletter-signup', name: 'Newsletter Signup', description: 'Simple lead capture for nurturing parents and students.', category: 'surveys', thumbnail: 'MAIL', featured: false, steps: 2 },
  { id: 'volunteer-registration', name: 'Volunteer Registration', description: 'Campus volunteer onboarding with approval checklist.', category: 'events', thumbnail: 'VOL', featured: false, steps: 4 },
  { id: 'research-participation', name: 'Research Participation', description: 'Research study opt-in with consent and confirmation.', category: 'surveys', thumbnail: 'LAB', featured: false, steps: 3 },
];

const categories = [
  { id: 'all', label: 'All Templates' },
  { id: 'admissions', label: 'Admissions' },
  { id: 'events', label: 'Events' },
  { id: 'donations', label: 'Donations' },
  { id: 'surveys', label: 'Surveys' },
];

interface FunnelTemplatesProps {
  onSelectTemplate: (templateId: string) => void;
}

function FunnelTemplatesComponent({ onSelectTemplate }: FunnelTemplatesProps) {
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

  return (
    <div className={styles.templateGallery}>
      <div className={styles.galleryHeader}>
        <div>
          <h2 className={styles.galleryTitle}>Funnel Templates</h2>
          <p className={styles.gallerySubtitle}>Choose a working conversion example for your presentation</p>
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
              onClick={() => setSelectedCategory(cat.id)}
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
          <div key={template.id} className={styles.templateCard}>
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
                  {template.steps} steps
                </div>
              </div>
            </div>
            <div className={styles.templateActions}>
              <Button variant="secondary" size="sm" className={styles.previewButton}>
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
          </div>
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

export const FunnelTemplates = memo(FunnelTemplatesComponent);
