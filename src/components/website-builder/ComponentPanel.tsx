import { useState, useMemo, memo } from 'react';
import { 
  Layout, 
  Square, 
  Mail,
  Award,
  BookOpen,
  MessageSquare,
  FileText
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import styles from './ComponentPanel.module.css';

type SectionType = 'hero' | 'features' | 'about' | 'programs' | 'testimonials' | 'contact' | 'footer';

interface Component {
  type: SectionType;
  icon: any;
  label: string;
  description: string;
  category: 'layout' | 'content' | 'media' | 'interactive';
}

const components: Component[] = [
  {
    type: 'hero',
    icon: Layout,
    label: 'Hero Section',
    description: 'Main banner with headline and CTA',
    category: 'layout'
  },
  {
    type: 'features',
    icon: Award,
    label: 'Features Grid',
    description: 'Highlight key features or benefits',
    category: 'content'
  },
  {
    type: 'about',
    icon: FileText,
    label: 'About Section',
    description: 'Tell your institution story',
    category: 'content'
  },
  {
    type: 'programs',
    icon: BookOpen,
    label: 'Programs List',
    description: 'Display academic programs',
    category: 'content'
  },
  {
    type: 'testimonials',
    icon: MessageSquare,
    label: 'Testimonials',
    description: 'Student and faculty reviews',
    category: 'content'
  },
  {
    type: 'contact',
    icon: Mail,
    label: 'Contact Section',
    description: 'Contact form and information',
    category: 'interactive'
  },
  {
    type: 'footer',
    icon: Square,
    label: 'Footer',
    description: 'Site navigation and links',
    category: 'layout'
  }
];

const categories = [
  { id: 'all', label: 'All' },
  { id: 'layout', label: 'Layout' },
  { id: 'content', label: 'Content' },
  { id: 'media', label: 'Media' },
  { id: 'interactive', label: 'Interactive' }
];

interface ComponentPanelProps {
  onAddSection: (type: SectionType) => void;
  searchQuery: string;
}

function ComponentPanelComponent({ onAddSection, searchQuery }: ComponentPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredComponents = useMemo(() => {
    return components.filter(comp => {
      const matchesSearch = comp.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           comp.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || comp.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className={styles.componentPanel}>
      <div className={styles.panelHeader}>
        <h3 className={styles.panelTitle}>Components</h3>
      </div>

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

      <div className={styles.componentList}>
        {filteredComponents.map(comp => (
          <Card key={comp.type} className={styles.componentCard}>
            <div className={styles.componentIcon}>
              <comp.icon size={18} />
            </div>
            <div className={styles.componentInfo}>
              <h4 className={styles.componentLabel}>{comp.label}</h4>
              <p className={styles.componentDescription}>{comp.description}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddSection(comp.type)}
              className={styles.addButton}
            >
              +
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

export const ComponentPanel = memo(ComponentPanelComponent);
