import { useState, useMemo } from 'react';
import { PageContainer } from '../layouts';
import { Card, CardBody, CardHeader, Button, StageChip } from '../components/ui';
import { useNotifications } from '../hooks/useNotifications';
import {
  GitBranch,
  TrendingUp,
  Sparkles,
  Filter,
  CheckCircle,
  RotateCw,
  Percent,
  Search,
} from 'lucide-react';
import styles from './AiFunnelsPage.module.css';

interface FunnelStep {
  id: string;
  name: string;
  count: number;
  stageConversion: number; // Conversion from previous step
  totalConversion: number; // Conversion from start
  description: string;
  dropouts: number;
  topDropoutReason: string;
}

interface AbTest {
  id: string;
  name: string;
  variant: string;
  traffic: number; // %
  clicks: number;
  ctr: number;
  conversions: number;
  rate: number; // %
  status: 'active' | 'draft' | 'paused';
}

interface Recommendation {
  id: string;
  title: string;
  targetStep: string;
  impact: string;
  upliftPercent: number;
  description: string;
  applied: boolean;
}

interface TrafficChannel {
  channel: string;
  sessions: number;
  leads: number;
  conversion: number;
  qualityScore: 'High' | 'Medium' | 'Low';
  stageColor: 'green' | 'blue' | 'yellow' | 'orange';
}

const INITIAL_STEPS: FunnelStep[] = [
  { id: 'step-1', name: 'Traffic / Landings', count: 10000, stageConversion: 100, totalConversion: 100, description: 'Unique visitors hitting admissions inquiry or landing pages', dropouts: 0, topDropoutReason: 'N/A' },
  { id: 'step-2', name: 'Form Submissions', count: 4200, stageConversion: 42, totalConversion: 42, description: 'Candidates who fully submitted the basic inquiry registration form', dropouts: 5800, topDropoutReason: 'Friction on 10th/12th CGPA calculation field' },
  { id: 'step-3', name: 'Document Upload', count: 1850, stageConversion: 44, totalConversion: 18.5, description: 'Candidates who uploaded required marksheets and identity proofs', dropouts: 2350, topDropoutReason: 'Image file size constraints (max 2MB limit)' },
  { id: 'step-4', name: 'Interview / Counselling', count: 920, stageConversion: 49.7, totalConversion: 9.2, description: 'Candidates who attended online/offline panel interviews', dropouts: 930, topDropoutReason: 'Scheduling slot conflicts during exam periods' },
  { id: 'step-5', name: 'Deposit Fee Locked', count: 480, stageConversion: 52.1, totalConversion: 4.8, description: 'Admitted students who paid the seat confirmation token fee', dropouts: 440, topDropoutReason: 'Lack of instant UPI/Netbanking payment failure fallback' },
];

const INITIAL_RECOMMENDATIONS: Recommendation[] = [
  { id: 'rec-1', title: 'Automate SMS Nudge for Uploads', targetStep: 'Document Upload', impact: '+8.5% Uplift', upliftPercent: 8.5, description: 'Send a automated text message 2 hours after form submission with a fast-upload link.', applied: false },
  { id: 'rec-2', title: 'Enable WhatsApp Auto-Clarify on Fee Errors', targetStep: 'Deposit Fee Locked', impact: '+12.0% Uplift', upliftPercent: 12.0, description: 'Trigger dynamic AI chat assistant when payment failures or banks decline cards.', applied: false },
  { id: 'rec-3', title: 'Implement AI Zip-Code Form Autofill', targetStep: 'Form Submissions', impact: '+3.2% Uplift', upliftPercent: 3.2, description: 'Autofill state, city, and high-school location based on zip code input.', applied: true },
  { id: 'rec-4', title: 'Smart Interview Slot Matcher', targetStep: 'Interview / Counselling', impact: '+6.8% Uplift', upliftPercent: 6.8, description: 'AI analyzes student calendar preferences from WhatsApp and auto-assigns the nearest available counselling slot to minimize scheduling conflicts.', applied: false },
  { id: 'rec-5', title: 'Document Upload Image Compressor', targetStep: 'Document Upload', impact: '+4.1% Uplift', upliftPercent: 4.1, description: 'Client-side image resizer automatically compresses mark sheet photos exceeding the 2MB limit before upload, eliminating file-size rejection errors.', applied: false },
];

const INITIAL_TESTS: AbTest[] = [
  { id: 'test-1', name: 'Admission inquiry core layout', variant: 'Variant A (Traditional Static Form)', traffic: 60, clicks: 3100, ctr: 8.4, conversions: 260, rate: 4.2, status: 'active' },
  { id: 'test-2', name: 'Admission inquiry core layout', variant: 'Variant B (Conversational AI Tips)', traffic: 40, clicks: 2150, ctr: 12.6, conversions: 248, rate: 5.8, status: 'active' },
];

const INITIAL_TRAFFIC: TrafficChannel[] = [
  { channel: 'Meta Ads (Instagram/FB)', sessions: 4800, leads: 260, conversion: 5.4, qualityScore: 'Medium', stageColor: 'blue' },
  { channel: 'Google Search PPC', sessions: 3200, leads: 288, conversion: 9.0, qualityScore: 'High', stageColor: 'green' },
  { channel: 'Email Campaign Newsletter', sessions: 1200, leads: 74, conversion: 6.1, qualityScore: 'Medium', stageColor: 'yellow' },
  { channel: 'Direct Student Portal', sessions: 800, leads: 30, conversion: 3.7, qualityScore: 'Low', stageColor: 'orange' },
  { channel: 'WhatsApp Broadcast Campaign', sessions: 2400, leads: 192, conversion: 8.0, qualityScore: 'High', stageColor: 'green' },
  { channel: 'YouTube Pre-Roll Ads', sessions: 1800, leads: 54, conversion: 3.0, qualityScore: 'Low', stageColor: 'orange' },
  { channel: 'Alumni Referral Program', sessions: 650, leads: 78, conversion: 12.0, qualityScore: 'High', stageColor: 'green' },
];

export function AiFunnelsPage() {
  const { notify } = useNotifications();

  // Component states
  const [funnelSteps, setFunnelSteps] = useState<FunnelStep[]>(INITIAL_STEPS);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(INITIAL_RECOMMENDATIONS);
  const [abTests, setAbTests] = useState<AbTest[]>(INITIAL_TESTS);
  const [selectedStepId, setSelectedStepId] = useState<string>('step-3'); // Default is Document Upload
  const [trafficAllocation, setTrafficAllocation] = useState<number>(60); // 60% for Variant A
  const [trafficSearchQuery, setTrafficSearchQuery] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Selected step meta helper
  const selectedStep = useMemo(() => {
    return funnelSteps.find(s => s.id === selectedStepId) || funnelSteps[0];
  }, [funnelSteps, selectedStepId]);

  // Dynamically calculate blended conversion metrics based on traffic slider allocation
  const abMetrics = useMemo(() => {
    // If slider shifts, Variant A traffic is trafficAllocation, Variant B is 100 - trafficAllocation
    const rateA = abTests[0].rate;
    const rateB = abTests[1].rate;
    const blendedRate = (rateA * trafficAllocation + rateB * (100 - trafficAllocation)) / 100;
    
    // Project potential deposits based on 10,000 visitors
    const projectedDeposits = Math.round((10000 * blendedRate) / 100);
    const estimatedTuitionValue = projectedDeposits * 185000; // Average course cost

    return {
      blendedRate: parseFloat(blendedRate.toFixed(2)),
      projectedDeposits,
      estimatedTuitionValue,
    };
  }, [abTests, trafficAllocation]);

  // Apply or revoke recommendation, simulating conversion rate change
  const handleToggleRecommendation = (id: string) => {
    setRecommendations(prev =>
      prev.map(rec => {
        if (rec.id === id) {
          const nextState = !rec.applied;
          
          // Modify matching funnel steps to simulate "optimization uplift"
          setFunnelSteps(currSteps =>
            currSteps.map(step => {
              if (step.name === rec.targetStep) {
                const modifier = nextState ? (1 + rec.upliftPercent / 100) : (1 / (1 + rec.upliftPercent / 100));
                const newCount = Math.round(step.count * modifier);
                const nextConv = parseFloat((step.stageConversion * modifier).toFixed(1));
                const newTotalConv = parseFloat((step.totalConversion * modifier).toFixed(1));
                return {
                  ...step,
                  count: Math.min(newCount, 10000), // Cap at Traffic maximum
                  stageConversion: Math.min(nextConv, 100),
                  totalConversion: Math.min(newTotalConv, 100),
                };
              }
              return step;
            })
          );

          notify({
            type: nextState ? 'success' : 'info',
            title: nextState ? 'Recommendation Applied!' : 'Recommendation Revoked',
            message: `"${rec.title}" is now ${nextState ? 'active and optimizing the funnel.' : 'disabled.'}`,
          });

          return { ...rec, applied: nextState };
        }
        return rec;
      })
    );
  };

  const handleSimulateOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      // Alter variants slightly to show AI optimization
      setAbTests(prev => [
        prev[0],
        { ...prev[1], rate: parseFloat((prev[1].rate + 0.2).toFixed(1)) }
      ]);
      notify({
        type: 'success',
        title: 'Funnel Optimization Run Complete',
        message: 'AI model successfully refined A/B nudges. Variant B conversion uplifted by +0.2%.',
      });
    }, 1200);
  };

  const filteredTraffic = useMemo(() => {
    return INITIAL_TRAFFIC.filter(t => 
      t.channel.toLowerCase().includes(trafficSearchQuery.toLowerCase()) ||
      t.qualityScore.toLowerCase().includes(trafficSearchQuery.toLowerCase())
    );
  }, [trafficSearchQuery]);

  return (
    <PageContainer breadcrumbs={[{ label: 'AI Suite' }, { label: 'AI Funnels' }]}>
      
      {/* Page Header */}
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.headerTitle}>AI Conversion Funnels & Insights</h2>
          <p className={styles.headerSubtitle}>
            Optimize admissions pipelines, run interactive form A/B experiments, and review AI smart interventions.
          </p>
        </div>
        <Button 
          variant="gold" 
          size="sm" 
          icon={<RotateCw size={14} className={isOptimizing ? 'spin-animation' : ''} />}
          onClick={handleSimulateOptimize}
          disabled={isOptimizing}
        >
          {isOptimizing ? 'Recalculating Yield...' : 'Run Optimization Scan'}
        </Button>
      </div>

      {/* KPI Cards Grid */}
      <div className={styles.kpiGrid}>
        
        <Card padding="md" variant="default" className={styles.kpiCard}>
          <CardBody>
            <div className={styles.kpiHeader}>
              <span>Blended Inquiry Conversion</span>
              <Percent size={16} className={styles.goldText} />
            </div>
            <h3>{abMetrics.blendedRate}%</h3>
            <div className={styles.kpiStatusRow}>
              <StageChip stage="green" label="Fall 2026 Live" />
              <span>Target: &gt;5.0%</span>
            </div>
          </CardBody>
        </Card>

        <Card padding="md" variant="default" className={styles.kpiCard}>
          <CardBody>
            <div className={styles.kpiHeader}>
              <span>Projected Student Yield</span>
              <TrendingUp size={16} style={{ color: 'var(--stage-purple-text)' }} />
            </div>
            <h3>{abMetrics.projectedDeposits} Enrolled</h3>
            <div className={styles.kpiStatusRow}>
              <StageChip stage="purple" label="Estimated Deposits" />
              <span>Scale: 10k visits</span>
            </div>
          </CardBody>
        </Card>

        <Card padding="md" variant="default" className={styles.kpiCard}>
          <CardBody>
            <div className={styles.kpiHeader}>
              <span>Projected Revenue Impact</span>
              <Sparkles size={16} style={{ color: 'var(--stage-green-text)' }} />
            </div>
            <h3>₹{(abMetrics.estimatedTuitionValue).toLocaleString('en-IN')}</h3>
            <div className={styles.kpiStatusRow}>
              <StageChip stage="blue" label="Calculated ROI" />
              <span>Tuition Seat locked</span>
            </div>
          </CardBody>
        </Card>

        <Card padding="md" variant="default" className={styles.kpiCard}>
          <CardBody>
            <div className={styles.kpiHeader}>
              <span>AI Recommendations Uplift</span>
              <GitBranch size={16} style={{ color: 'var(--stage-orange-text)' }} />
            </div>
            <h3>+23.7%</h3>
            <div className={styles.kpiStatusRow}>
              <StageChip stage="orange" label="Growth Potential" />
              <span>3 Suggestions</span>
            </div>
          </CardBody>
        </Card>

      </div>

      {/* Main Layout Split */}
      <div className={styles.funnelSplitLayout}>
        
        {/* LEFT COLUMN: Visual Funnel Steps & A/B testing sliders */}
        <div className={styles.leftCol}>
          
          {/* Section: Funnel Performance Step Graph */}
          <Card padding="md" variant="default">
            <CardHeader 
              title="Admissions Funnel Performance" 
              subtitle="Identify dropouts across the 5 core stages. Click a stage block to inspect friction points." 
            />
            <CardBody>
              <div className={styles.funnelChartContainer}>
                {funnelSteps.map((step, idx) => {
                  // Calculate width percentage relative to maximum (Traffic is 100%)
                  const percentWidth = Math.max(25, (step.count / 10000) * 100);
                  const isSelected = step.id === selectedStepId;
                  
                  return (
                    <div 
                      key={step.id} 
                      className={`${styles.funnelStepWrapper} ${isSelected ? styles.funnelStepSelected : ''}`}
                      onClick={() => setSelectedStepId(step.id)}
                    >
                      <div 
                        className={styles.funnelStepBar} 
                        style={{ 
                          width: `${percentWidth}%`,
                          backgroundColor: 
                            idx === 0 ? '#ebe5d8' :
                            idx === 1 ? '#d6c8b0' :
                            idx === 2 ? '#bfae91' :
                            idx === 3 ? '#a89474' :
                            '#8e7958'
                        }}
                      >
                        <div className={styles.stepBarInner}>
                          <span className={styles.stepNumber}>Stage {idx + 1}</span>
                          <strong className={styles.stepName}>{step.name}</strong>
                        </div>
                        <div className={styles.stepMetrics}>
                          <strong>{step.count.toLocaleString()}</strong>
                          <span className={styles.convLabel}>{step.totalConversion}% of total</span>
                        </div>
                      </div>

                      {idx < funnelSteps.length - 1 && (
                        <div className={styles.funnelStepGap}>
                          <Filter size={10} className={styles.gapIcon} />
                          <span>Stage Drop-off: <strong>{(100 - funnelSteps[idx+1].stageConversion).toFixed(1)}%</strong></span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>

          {/* Section: A/B Testing & Variant Traffic Allocation */}
          <Card padding="md" variant="default" style={{ marginTop: 'var(--space-4)' }}>
            <CardHeader 
              title="Form Design A/B Testing Playground" 
              subtitle="Allocate live student traffic weights to evaluate form engagement and intent nudges." 
            />
            <CardBody>
              
              {/* Sliders Console */}
              <div className={styles.abPlaygroundConsole}>
                
                <div className={styles.sliderMetaRow}>
                  <div className={styles.variantDetail}>
                    <strong>Variant A (Traditional Core)</strong>
                    <span>Traffic Weight: <strong>{trafficAllocation}%</strong></span>
                    <span>Direct Conversion: <strong>{abTests[0].rate}%</strong></span>
                  </div>
                  <div className={styles.variantDetail} style={{ textAlign: 'right' }}>
                    <strong>Variant B (Conversational AI Tips)</strong>
                    <span>Traffic Weight: <strong>{100 - trafficAllocation}%</strong></span>
                    <span>Direct Conversion: <strong>{abTests[1].rate}%</strong></span>
                  </div>
                </div>

                <div className={styles.sliderTrackWrapper}>
                  <span className={styles.sliderLabel}>Variant A ({trafficAllocation}%)</span>
                  <input 
                    type="range" 
                    min={10} 
                    max={90} 
                    value={trafficAllocation} 
                    onChange={(e) => setTrafficAllocation(parseInt(e.target.value))}
                    className={styles.allocationSlider}
                  />
                  <span className={styles.sliderLabel} style={{ textAlign: 'right' }}>Variant B ({100 - trafficAllocation}%)</span>
                </div>

                <div className={styles.simulatedStatHighlight}>
                  <p>
                    Blended Funnel Conversion Rate under active weights is <strong>{abMetrics.blendedRate}%</strong>.
                    Estimated yield: <strong>{abMetrics.projectedDeposits} enrolled students</strong>, 
                    Variant B demonstrates a <strong style={{ color: 'var(--stage-green-text)' }}>+38.1% performance uplift</strong> over A.
                  </p>
                </div>

              </div>

              {/* Experiments list */}
              <div className={styles.experimentsList}>
                {abTests.map(test => (
                  <div key={test.id} className={styles.testCard}>
                    <div className={styles.testHeader}>
                      <div className={styles.testMeta}>
                        <strong>{test.variant}</strong>
                        <span>Experiment: {test.name}</span>
                      </div>
                      <StageChip stage={test.status === 'active' ? 'green' : 'gray'} label={test.status} />
                    </div>
                    <div className={styles.testStatsRow}>
                      <div className={styles.testStat}>
                        <span>Traffic Share</span>
                        <strong>{test.id === 'test-1' ? trafficAllocation : 100 - trafficAllocation}%</strong>
                      </div>
                      <div className={styles.testStat}>
                        <span>CTR Index</span>
                        <strong>{test.ctr}%</strong>
                      </div>
                      <div className={styles.testStat}>
                        <span>Measured Conversion</span>
                        <strong className={styles.purpleText}>{test.rate}%</strong>
                      </div>
                      <div className={styles.testStat}>
                        <span>Goal Achieved</span>
                        <strong>{test.conversions}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </CardBody>
          </Card>

        </div>

        {/* RIGHT COLUMN: Stage detail panel, recommendations list, traffic channels */}
        <div className={styles.rightCol}>
          
          {/* Section: Selected Stage Insights Panel */}
          <Card padding="md" variant="bordered" className={styles.detailsInspectedCard}>
            <CardHeader 
              title={`Friction Index: ${selectedStep.name}`} 
              subtitle="AI insights identifying dropout bottlenecks at this pipeline level" 
            />
            <CardBody>
              <div className={styles.frictionDetailsPanel}>
                
                <div className={styles.statSplitGroup}>
                  <div className={styles.splitStatItem}>
                    <span>Successful Submissions</span>
                    <h3>{selectedStep.count.toLocaleString()}</h3>
                  </div>
                  <div className={styles.splitStatItem}>
                    <span>Stage Dropouts</span>
                    <h3 style={{ color: selectedStep.dropouts > 0 ? 'var(--stage-orange-text)' : 'var(--color-text-secondary)' }}>
                      {selectedStep.dropouts.toLocaleString()}
                    </h3>
                  </div>
                </div>

                <div className={styles.dropoutReasonBlock}>
                  <div className={styles.reasonHeader}>
                    <strong>Top Drop-off Trigger</strong>
                  </div>
                  <p className={styles.reasonText}>{selectedStep.topDropoutReason}</p>
                </div>

                <div className={styles.optimizedNudgesSection}>
                  <span className={styles.nudgesTitle}>AI Recommended Nudges</span>
                  <div className={styles.nudgeItem}>
                    <div className={styles.nudgeDot}></div>
                    <span>Integrate live autocomplete APIs on target inputs to reduce physical keystrokes.</span>
                  </div>
                  <div className={styles.nudgeItem}>
                    <div className={styles.nudgeDot}></div>
                    <span>Shorten page fields from four separate layouts down to a single conversational card screen.</span>
                  </div>
                </div>

              </div>
            </CardBody>
          </Card>

          {/* Section: AI Optimization Recommendations */}
          <Card padding="md" variant="default" style={{ marginTop: 'var(--space-4)' }}>
            <CardHeader 
              title="Automated Funnel Interventions" 
              subtitle="Active AI interventions proposed to patch dropout thresholds" 
            />
            <CardBody>
              <div className={styles.recommendationsList}>
                {recommendations.map(rec => (
                  <div key={rec.id} className={`${styles.recCard} ${rec.applied ? styles.recCardApplied : ''}`}>
                    <div className={styles.recHeaderRow}>
                      <div className={styles.recTitleBlock}>
                        <strong>{rec.title}</strong>
                        <span>Target: <strong>{rec.targetStep}</strong></span>
                      </div>
                      <StageChip stage="green" label={rec.impact} />
                    </div>
                    <p className={styles.recDesc}>{rec.description}</p>
                    <div className={styles.recFooterAction}>
                      {rec.applied ? (
                        <span className={styles.appliedStatusChip}>
                          <CheckCircle size={12} style={{ color: 'var(--stage-green-text)' }} />
                          Applied & Live
                        </span>
                      ) : (
                        <span className={styles.appliedStatusChip} style={{ color: 'var(--color-text-muted)' }}>
                          Ready
                        </span>
                      )}
                      <Button 
                        variant={rec.applied ? "secondary" : "gold"} 
                        size="sm" 
                        onClick={() => handleToggleRecommendation(rec.id)}
                      >
                        {rec.applied ? 'Deactivate' : 'Apply Instantly'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Section: Traffic Channels Analysis */}
          <Card padding="md" variant="bordered" style={{ marginTop: 'var(--space-4)' }}>
            <CardHeader 
              title="Inbound Traffic Performance" 
              subtitle="Evaluate campaign quality indices and conversion ratios by channel" 
            />
            <CardBody>
              
              <div className={styles.trafficSearchField}>
                <Search size={14} className={styles.searchIcon} />
                <input 
                  type="text" 
                  placeholder="Filter channels (e.g. Google, High)..." 
                  value={trafficSearchQuery}
                  onChange={(e) => setTrafficSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              <div className={styles.trafficTableWrapper}>
                <table className={styles.trafficTable}>
                  <thead>
                    <tr>
                      <th>Source Channel</th>
                      <th>Sessions</th>
                      <th>Leads</th>
                      <th>Conv %</th>
                      <th>Quality</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTraffic.map((t, idx) => (
                      <tr key={idx}>
                        <td><strong>{t.channel}</strong></td>
                        <td>{t.sessions.toLocaleString()}</td>
                        <td>{t.leads}</td>
                        <td className={styles.boldCell}>{t.conversion}%</td>
                        <td>
                          <StageChip stage={t.stageColor} label={t.qualityScore} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </CardBody>
          </Card>

        </div>

      </div>

    </PageContainer>
  );
}
