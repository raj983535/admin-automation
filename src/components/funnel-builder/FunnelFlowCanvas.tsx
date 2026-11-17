import { useState, memo, useMemo, useCallback } from 'react';
import { 
  GripVertical, 
  Trash2, 
  Edit3,
  Plus,
  Users,
  ArrowDown
} from 'lucide-react';
import { Button } from '../ui/Button';
import type { FunnelStep, FunnelStepType } from '../../types/builder.types';
import styles from './FunnelFlowCanvas.module.css';

type ViewMode = 'flow' | 'editor' | 'analytics' | 'templates';

interface FunnelFlowCanvasProps {
  steps: FunnelStep[];
  selectedStep: string | null;
  viewMode: ViewMode;
  showAnalytics: boolean;
  searchQuery: string;
  onSelectStep: (id: string) => void;
  onAddStep: (type: FunnelStepType) => void;
  onDeleteStep: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

const STEP_TYPES: { type: FunnelStepType; label: string; color: string }[] = [
  { type: 'landing', label: 'Landing Page', color: '#D4A574' },
  { type: 'inquiry', label: 'Inquiry Form', color: '#C4956A' },
  { type: 'application', label: 'Application', color: '#B48560' },
  { type: 'review', label: 'Review', color: '#A47556' },
  { type: 'payment', label: 'Payment', color: '#94654C' },
  { type: 'confirmation', label: 'Confirmation', color: '#845542' }
];

function FunnelFlowCanvasComponent({
  steps,
  selectedStep,
  viewMode,
  searchQuery,
  onSelectStep,
  onAddStep,
  onDeleteStep,
  onReorder
}: FunnelFlowCanvasProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    onReorder(draggedIndex, index);
    setDraggedIndex(index);
  }, [draggedIndex, onReorder]);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
  }, []);

  const filteredSteps = useMemo(() => {
    if (!searchQuery) return steps;
    return steps.filter(step => 
      step.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      step.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [steps, searchQuery]);

  return (
    <div className={styles.flowCanvas}>
      <div className={styles.canvasContent}>
        {filteredSteps.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <Users size={48} />
            </div>
            <h4 className={styles.emptyTitle}>No funnel steps yet</h4>
            <p className={styles.emptyDescription}>Add your first step to start building your conversion funnel</p>
            <Button 
              variant="primary" 
              size="sm" 
              onClick={() => setShowAddMenu(!showAddMenu)}
              className={styles.emptyButton}
            >
              <Plus size={16} />
              Add First Step
            </Button>
            {showAddMenu && (
              <div className={styles.addMenu}>
                {STEP_TYPES.map(st => (
                  <button
                    key={st.type}
                    onClick={() => {
                      onAddStep(st.type);
                      setShowAddMenu(false);
                    }}
                    className={styles.addMenuItem}
                  >
                    <div className={styles.menuItemColor} style={{ background: st.color }} />
                    {st.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className={styles.funnelFlow}>
            {filteredSteps.map((step, index) => (
              <div key={step.id} className={styles.stepContainer}>
                <div
                  draggable={viewMode === 'flow'}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={[
                    styles.stepCard,
                    selectedStep === step.id ? styles.selected : ''
                  ].filter(Boolean).join(' ')}
                  style={{ 
                    width: `${Math.max(30, 100 - (index * 15))}%`,
                    background: step.color
                  }}
                >
                  <div className={styles.stepContent}>
                    <div className={styles.stepHeader}>
                      <div className={styles.stepInfo}>
                        <h4 className={styles.stepName}>{step.name}</h4>
                        <span className={styles.stepType}>{step.type}</span>
                      </div>
                      <div className={styles.stepActions}>
                        <button
                          onClick={() => onSelectStep(step.id)}
                          className={styles.actionButton}
                          title="Edit step"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => onDeleteStep(step.id)}
                          className={styles.actionButton}
                          title="Delete step"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className={styles.dragHandle}>
                          <GripVertical size={16} />
                        </div>
                      </div>
                    </div>

                    <div className={styles.stepMetrics}>
                      <div className={styles.metric}>
                        <Users size={14} />
                        <span className={styles.metricValue}>{step.visitors.toLocaleString()}</span>
                        <span className={styles.metricLabel}>visitors</span>
                      </div>
                      <div className={styles.metric}>
                        <span className={styles.metricValue}>{step.conversions.toLocaleString()}</span>
                        <span className={styles.metricLabel}>conversions</span>
                      </div>
                      <div className={styles.metric}>
                        <span className={styles.metricValue}>{step.conversionRate.toFixed(1)}%</span>
                        <span className={styles.metricLabel}>rate</span>
                      </div>
                    </div>
                  </div>
                </div>

                {index < filteredSteps.length - 1 && (
                  <div className={styles.flowArrow}>
                    <ArrowDown size={20} className={styles.arrowIcon} />
                    <span className={styles.flowRate}>
                      {(step.visitors > 0 ? (step.conversions / step.visitors) * 100 : 0).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            ))}

            <div className={styles.addStepContainer}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddMenu(!showAddMenu)}
                className={styles.addStepButton}
              >
                <Plus size={16} />
                Add Step
              </Button>
              {showAddMenu && (
                <div className={styles.addMenu}>
                  {STEP_TYPES.map(st => (
                    <button
                      key={st.type}
                      onClick={() => {
                        onAddStep(st.type);
                        setShowAddMenu(false);
                      }}
                      className={styles.addMenuItem}
                    >
                      <div className={styles.menuItemColor} style={{ background: st.color }} />
                      {st.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const FunnelFlowCanvas = memo(FunnelFlowCanvasComponent);
