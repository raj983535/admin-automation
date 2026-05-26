import { useState, useCallback, useMemo } from 'react';
import { FunnelActionBar } from '../components/funnel-builder/FunnelActionBar';
import { FunnelFlowCanvas } from '../components/funnel-builder/FunnelFlowCanvas';
import { StepEditor } from '../components/funnel-builder/StepEditor';
import { FunnelAnalytics } from '../components/funnel-builder/FunnelAnalytics';
import { FunnelTemplates } from '../components/funnel-builder/FunnelTemplates';
import styles from './FunnelBuilderPage.module.css';

type FunnelStep = {
  id: string;
  name: string;
  type: 'landing' | 'inquiry' | 'application' | 'review' | 'payment' | 'confirmation';
  color: string;
  conversionRate: number;
  dropOffRate: number;
  visitors: number;
  conversions: number;
  content: any;
};

type ViewMode = 'flow' | 'editor' | 'analytics' | 'templates';

const INITIAL_STEPS: FunnelStep[] = [
  {
    id: 'step-1',
    name: 'Landing Page',
    type: 'landing',
    color: '#D4A574',
    conversionRate: 100,
    dropOffRate: 0,
    visitors: 10000,
    conversions: 10000,
    content: {
      headline: 'Begin Your Journey',
      subheadline: 'Discover your path to academic excellence',
      ctaText: 'Start Application',
      ctaLink: '/apply'
    }
  },
  {
    id: 'step-2',
    name: 'Inquiry Form',
    type: 'inquiry',
    color: '#C4956A',
    conversionRate: 65,
    dropOffRate: 35,
    visitors: 10000,
    conversions: 6500,
    content: {
      fields: ['name', 'email', 'phone', 'program', 'interest']
    }
  },
  {
    id: 'step-3',
    name: 'Application',
    type: 'application',
    color: '#B48560',
    conversionRate: 45,
    dropOffRate: 55,
    visitors: 6500,
    conversions: 2925,
    content: {
      sections: ['personal', 'academic', 'documents', 'essays']
    }
  },
  {
    id: 'step-4',
    name: 'Review',
    type: 'review',
    color: '#A47556',
    conversionRate: 80,
    dropOffRate: 20,
    visitors: 2925,
    conversions: 2340,
    content: {
      checklist: ['verify-info', 'upload-docs', 'submit-essays']
    }
  },
  {
    id: 'step-5',
    name: 'Confirmation',
    type: 'confirmation',
    color: '#94654C',
    conversionRate: 100,
    dropOffRate: 0,
    visitors: 2340,
    conversions: 2340,
    content: {
      message: 'Application submitted successfully',
      nextSteps: ['email-confirmation', 'document-review', 'interview-schedule']
    }
  }
];

export function FunnelBuilderPage() {
  const [steps, setSteps] = useState<FunnelStep[]>(INITIAL_STEPS);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('flow');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddStep = useCallback((type: FunnelStep['type']) => {
    const typeColors: Record<FunnelStep['type'], string> = {
      landing: '#D4A574',
      inquiry: '#C4956A',
      application: '#B48560',
      review: '#A47556',
      payment: '#94654C',
      confirmation: '#845542'
    };
    
    const newStep: FunnelStep = {
      id: `step-${Date.now()}`,
      name: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      type,
      color: typeColors[type],
      conversionRate: 0,
      dropOffRate: 0,
      visitors: 0,
      conversions: 0,
      content: {}
    };
    setSteps(prev => [...prev, newStep]);
  }, []);

  const handleDeleteStep = useCallback((id: string) => {
    setSteps(prev => prev.filter(step => step.id !== id));
    if (selectedStep === id) setSelectedStep(null);
  }, [selectedStep]);

  const handleUpdateStep = useCallback((id: string, updates: Partial<FunnelStep>) => {
    setSteps(prev => prev.map(step => 
      step.id === id ? { ...step, ...updates } : step
    ));
  }, []);

  const handleReorderSteps = useCallback((fromIndex: number, toIndex: number) => {
    setSteps(prev => {
      const newSteps = [...prev];
      const [removed] = newSteps.splice(fromIndex, 1);
      newSteps.splice(toIndex, 0, removed);
      return newSteps;
    });
  }, []);

  const handleSelectTemplate = useCallback((templateId: string) => {
    if (templateId === 'blank') {
      setSteps([]);
      setSelectedStep(null);
    } else {
      setSteps(INITIAL_STEPS);
      setSelectedStep(null);
    }
    setViewMode('flow');
  }, []);

  const funnelMetrics = useMemo(() => {
    const totalVisitors = steps[0]?.visitors || 0;
    const totalConversions = steps[steps.length - 1]?.conversions || 0;
    const overallConversion = totalVisitors > 0 ? (totalConversions / totalVisitors) * 100 : 0;
    
    return {
      totalVisitors,
      totalConversions,
      overallConversion,
      totalSteps: steps.length
    };
  }, [steps]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Funnel Builder</h1>
          <p className={styles.subtitle}>Create and optimize your conversion funnels</p>
        </div>
      </div>

      <FunnelActionBar
        viewMode={viewMode}
        showAnalytics={showAnalytics}
        searchQuery={searchQuery}
        onViewModeChange={setViewMode}
        onToggleAnalytics={() => setShowAnalytics(!showAnalytics)}
        onSearchChange={setSearchQuery}
        onSave={() => console.log('Funnel saved')}
        onPublish={() => console.log('Funnel published')}
        metrics={funnelMetrics}
      />

      <div className={styles.builderContainer}>
        {viewMode === 'templates' ? (
          <FunnelTemplates onSelectTemplate={handleSelectTemplate} />
        ) : (
          <div className={styles.mainContent}>
            <FunnelFlowCanvas
              steps={steps}
              selectedStep={selectedStep}
              viewMode={viewMode}
              showAnalytics={showAnalytics}
              searchQuery={searchQuery}
              onSelectStep={setSelectedStep}
              onAddStep={handleAddStep}
              onDeleteStep={handleDeleteStep}
              onReorder={handleReorderSteps}
            />

            <div className={styles.sidePanel}>
              {selectedStep && viewMode === 'flow' && (
                <StepEditor
                  step={steps.find(s => s.id === selectedStep)!}
                  onUpdate={handleUpdateStep}
                  onClose={() => setSelectedStep(null)}
                />
              )}

              {showAnalytics && (
                <FunnelAnalytics
                  steps={steps}
                  onClose={() => setShowAnalytics(false)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
