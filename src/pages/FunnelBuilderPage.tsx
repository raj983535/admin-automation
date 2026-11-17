import { useState, useCallback, useMemo } from 'react';
import { FunnelActionBar } from '../components/funnel-builder/FunnelActionBar';
import { FunnelFlowCanvas } from '../components/funnel-builder/FunnelFlowCanvas';
import { StepEditor } from '../components/funnel-builder/StepEditor';
import { FunnelAnalytics } from '../components/funnel-builder/FunnelAnalytics';
import { FunnelTemplates } from '../components/funnel-builder/FunnelTemplates';
import { useNotifications } from '../hooks/useNotifications';
import { loadDemoState, saveDemoState } from '../services/demoStorage.service';
import type { FunnelStep, FunnelStepContent, FunnelStepType } from '../types/builder.types';
import styles from './FunnelBuilderPage.module.css';

type ViewMode = 'flow' | 'editor' | 'analytics' | 'templates';
const STORAGE_KEY = 'collegeos.funnelBuilder.steps';
const PUBLISHED_KEY = 'collegeos.funnelBuilder.published';

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

const templateStepTypes: Record<string, FunnelStepType[]> = {
  'admissions-standard': ['landing', 'inquiry', 'application', 'review', 'confirmation'],
  'quick-apply': ['landing', 'inquiry', 'confirmation'],
  'graduate-admissions': ['landing', 'inquiry', 'application', 'review', 'payment', 'confirmation'],
  'international-students': ['landing', 'inquiry', 'application', 'review', 'payment', 'confirmation'],
  'event-registration': ['landing', 'inquiry', 'payment', 'confirmation'],
  'webinar-signup': ['landing', 'inquiry', 'confirmation'],
  'campus-tour': ['landing', 'inquiry', 'confirmation'],
  'donation-campaign': ['landing', 'inquiry', 'payment', 'confirmation'],
  'alumni-giving': ['landing', 'inquiry', 'payment', 'confirmation'],
  'student-survey': ['landing', 'inquiry', 'confirmation'],
  'course-evaluation': ['landing', 'inquiry', 'confirmation'],
  'scholarship-apply': ['landing', 'inquiry', 'application', 'review', 'confirmation'],
  'summer-program': ['landing', 'inquiry', 'payment', 'confirmation'],
  'newsletter-signup': ['landing', 'confirmation'],
  'volunteer-registration': ['landing', 'inquiry', 'review', 'confirmation'],
  'research-participation': ['landing', 'inquiry', 'confirmation'],
};

const typeColors: Record<FunnelStepType, string> = {
  landing: '#D4A574',
  inquiry: '#C4956A',
  application: '#B48560',
  review: '#A47556',
  payment: '#94654C',
  confirmation: '#845542',
};

function contentForStep(type: FunnelStepType, templateId: string): FunnelStepContent {
  switch (type) {
    case 'landing':
      return {
        headline: templateId.includes('event') ? 'Reserve Your Campus Seat' : 'Start Your Admission Journey',
        subheadline: 'Campaign landing page collects student intent and explains the next best action.',
        ctaText: 'Continue',
        ctaLink: '/start',
      };
    case 'inquiry':
      return {
        fields: ['student name', 'phone', 'email', 'preferred program', 'city', 'scholarship interest'],
      };
    case 'application':
      return {
        sections: ['personal details', 'academic records', 'documents', 'program preference', 'parent information'],
      };
    case 'review':
      return {
        checklist: ['eligibility verified', 'documents checked', 'counsellor assigned', 'fee quote generated'],
      };
    case 'payment':
      return {
        paymentMethods: ['UPI', 'card', 'net banking', 'education loan callback'],
      };
    case 'confirmation':
      return {
        message: 'Student receives confirmation, counsellor owner, and next-step reminders.',
        nextSteps: ['send WhatsApp confirmation', 'create CRM deal', 'schedule counselling call'],
      };
  }
}

function createTemplateSteps(templateId: string): FunnelStep[] {
  const types = templateStepTypes[templateId] || templateStepTypes['admissions-standard'];
  let visitors = templateId === 'quick-apply' ? 7200 : 10000;

  return types.map((type, index) => {
    const conversionRate = index === 0 ? 100 : Math.max(38, 86 - index * 11);
    const conversions = index === 0 ? visitors : Math.round(visitors * (conversionRate / 100));
    const step: FunnelStep = {
      id: `${templateId}-${type}-${index + 1}`,
      name: `${index + 1}. ${type.charAt(0).toUpperCase()}${type.slice(1)}`,
      type,
      color: typeColors[type],
      conversionRate,
      dropOffRate: 100 - conversionRate,
      visitors,
      conversions,
      content: contentForStep(type, templateId),
    };
    visitors = conversions;
    return step;
  });
}

export function FunnelBuilderPage() {
  const { notify } = useNotifications();
  const [steps, setSteps] = useState<FunnelStep[]>(() => loadDemoState(STORAGE_KEY, INITIAL_STEPS));
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('flow');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddStep = useCallback((type: FunnelStepType) => {
    const newStep: FunnelStep = {
      id: `step-${Date.now()}`,
      name: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      type,
      color: typeColors[type],
      conversionRate: 0,
      dropOffRate: 0,
      visitors: 0,
      conversions: 0,
      content: contentForStep(type, 'custom')
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
      const nextSteps = createTemplateSteps(templateId);
      setSteps(nextSteps);
      setSelectedStep(null);
    }
    setViewMode('flow');
    notify({
      type: 'success',
      title: templateId === 'blank' ? 'Blank funnel started' : 'Funnel template loaded',
      message: templateId === 'blank' ? 'Add demo steps from the flow canvas.' : 'Working conversion steps are ready for live explanation.',
    });
  }, [notify]);

  const handleSave = useCallback(() => {
    saveDemoState(STORAGE_KEY, steps);
    notify({
      type: 'success',
      title: 'Funnel draft saved',
      message: `${steps.length} steps saved locally for this demo browser.`,
    });
  }, [notify, steps]);

  const handlePublish = useCallback(() => {
    saveDemoState(STORAGE_KEY, steps);
    saveDemoState(PUBLISHED_KEY, {
      steps,
      publishedAt: new Date().toISOString(),
      status: 'active-demo',
    });
    notify({
      type: 'success',
      title: 'Funnel published',
      message: 'Demo funnel snapshot created with current steps and conversion metrics.',
    });
  }, [notify, steps]);

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
        onSave={handleSave}
        onPublish={handlePublish}
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
