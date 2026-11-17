import { useState, useMemo } from 'react';
import { PageContainer } from '../layouts';
import { Card, CardBody, CardHeader, Button, StageChip } from '../components/ui';
import { useNotifications } from '../hooks/useNotifications';
import { useMetricClick } from '../hooks/useMetricClick';
import {
  Sparkles,
  Activity,
  Heart,
  AlertTriangle,
  Play,
  RotateCw,
  Terminal,
  Cpu,
  Workflow,
  CheckCircle,
  Database,
  Clock,
  TrendingUp,
} from 'lucide-react';
import styles from './AiDashboardPage.module.css';

interface SystemNode {
  id: string;
  name: string;
  type: string;
  status: 'green' | 'yellow' | 'orange' | 'gray';
  latency: string;
  uptime: string;
}

interface ActiveProcess {
  id: string;
  name: string;
  category: 'Classification' | 'Generation' | 'Extraction' | 'Sync';
  status: 'Active' | 'Paused' | 'Idle';
  accuracy: number;
  processedToday: number;
}

interface AnomalyAlert {
  id: string;
  timestamp: string;
  source: string;
  severity: 'Critical' | 'Warning' | 'Info';
  message: string;
  resolved: boolean;
}

const INITIAL_NODES: SystemNode[] = [
  { id: 'node-1', name: 'Meta WABA Gateway Router', type: 'API Route', status: 'green', latency: '42ms', uptime: '99.98%' },
  { id: 'node-2', name: 'Inquiry Classifier LLM-v4', type: 'Core Model', status: 'green', latency: '185ms', uptime: '99.95%' },
  { id: 'node-3', name: 'Tuition Fee Intent Sync Node', type: 'DB Sync Engine', status: 'yellow', latency: '320ms', uptime: '99.78%' },
  { id: 'node-4', name: 'Document Transcripts OCR Parser', type: 'Vision Node', status: 'green', latency: '92ms', uptime: '99.91%' },
  { id: 'node-5', name: 'Scholarship Eligibility Resolver', type: 'Rules Engine', status: 'green', latency: '58ms', uptime: '99.97%' },
  { id: 'node-6', name: 'Email Campaign Dispatch Queue', type: 'Message Broker', status: 'green', latency: '110ms', uptime: '99.88%' },
  { id: 'node-7', name: 'Student Portal Auth Gateway', type: 'Auth Service', status: 'yellow', latency: '275ms', uptime: '99.72%' },
];

const INITIAL_PROCESSES: ActiveProcess[] = [
  { id: 'proc-1', name: 'Inquiry Intent Classifier', category: 'Classification', status: 'Active', accuracy: 96.8, processedToday: 1420 },
  { id: 'proc-2', name: 'Document Verification OCR', category: 'Extraction', status: 'Active', accuracy: 94.2, processedToday: 380 },
  { id: 'proc-3', name: 'WhatsApp Autopilot Agent', category: 'Generation', status: 'Active', accuracy: 92.5, processedToday: 2150 },
  { id: 'proc-4', name: 'CRM Status Auto-Sync', category: 'Sync', status: 'Idle', accuracy: 99.9, processedToday: 840 },
  { id: 'proc-5', name: 'Scholarship Merit Scorer', category: 'Classification', status: 'Active', accuracy: 97.3, processedToday: 610 },
  { id: 'proc-6', name: 'Fee Receipt PDF Generator', category: 'Generation', status: 'Active', accuracy: 99.1, processedToday: 275 },
  { id: 'proc-7', name: 'Hostel Allotment Extractor', category: 'Extraction', status: 'Paused', accuracy: 91.8, processedToday: 145 },
];

const INITIAL_ALERTS: AnomalyAlert[] = [
  { id: 'alert-1', timestamp: '10:14 AM', source: 'WhatsApp Autopilot Agent', severity: 'Critical', message: 'Rate limit threshold hit on Meta Sandbox Endpoint: throttled.', resolved: false },
  { id: 'alert-2', timestamp: '12:05 PM', source: 'Document Verification OCR', severity: 'Warning', message: 'Low OCR parser confidence (41%) detected on freshman mark sheet upload.', resolved: false },
  { id: 'alert-3', timestamp: '01:42 PM', source: 'Tuition Fee Intent Sync Node', severity: 'Info', message: 'Minor packet loss detected on payment status polling trunk.', resolved: false },
  { id: 'alert-4', timestamp: '02:30 PM', source: 'Scholarship Merit Scorer', severity: 'Warning', message: 'JEE percentile normalization table outdated — using 2025 cutoff references instead of 2026.', resolved: false },
  { id: 'alert-5', timestamp: '03:18 PM', source: 'Student Portal Auth Gateway', severity: 'Critical', message: 'OAuth token refresh failure for 12 concurrent student sessions. SSO fallback activated.', resolved: false },
  { id: 'alert-6', timestamp: '04:05 PM', source: 'Email Campaign Dispatch Queue', severity: 'Info', message: 'Bulk admission confirmation mailer batch 47 completed — 340 emails dispatched successfully.', resolved: true },
];

export function AiDashboardPage() {
  const { notify } = useNotifications();
  const metricClick = useMetricClick();
  const [nodes, setNodes] = useState<SystemNode[]>(INITIAL_NODES);
  const [processes, setProcesses] = useState<ActiveProcess[]>(INITIAL_PROCESSES);
  const [alerts, setAlerts] = useState<AnomalyAlert[]>(INITIAL_ALERTS);

  const [filterSeverity, setFilterSeverity] = useState<string>('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Stats Calculations
  const metrics = useMemo(() => {
    const activeAlerts = alerts.filter(a => !a.resolved).length;
    const avgAccuracy = processes.reduce((acc, p) => acc + p.accuracy, 0) / processes.length;
    const totalProcessed = processes.reduce((acc, p) => acc + p.processedToday, 0);
    const healthStatus = activeAlerts > 0 ? (activeAlerts > 1 ? 'yellow' : 'green') : 'green';

    return {
      activeAlerts,
      avgAccuracy: parseFloat(avgAccuracy.toFixed(1)),
      totalProcessed,
      healthStatus,
    };
  }, [alerts, processes]);

  const handleResolveAlert = (id: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === id ? { ...a, resolved: true } : a))
    );
    notify({
      type: 'success',
      title: 'Alert Resolved',
      message: 'Anomaly flagged as resolved. Restoring system status.',
    });
  };

  const handleToggleProcess = (id: string) => {
    setProcesses(prev =>
      prev.map(p => {
        if (p.id === id) {
          const nextStatus = p.status === 'Active' ? 'Paused' : 'Active';
          notify({
            type: 'info',
            title: `Process Status Changed`,
            message: `"${p.name}" status updated to ${nextStatus}.`,
          });
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  const handleSimulateRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Minor latency variation
      setNodes(prev =>
        prev.map(n => ({
          ...n,
          latency: `${Math.floor(n.status === 'green' ? 35 + Math.random() * 20 : 250 + Math.random() * 100)}ms`,
        }))
      );
      setIsRefreshing(false);
      notify({
        type: 'success',
        title: 'Operational Data Refreshed',
        message: 'Pulled real-time health logs and latency metrics successfully.',
        duration: 1200,
      });
    }, 800);
  };

  const filteredAlerts = alerts.filter(a => {
    if (filterSeverity === 'All') return true;
    return a.severity === filterSeverity;
  });

  return (
    <PageContainer breadcrumbs={[{ label: 'AI Suite' }, { label: 'AI Dashboard' }]}>
      {/* Dashboard Top bar with action button */}
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.headerTitle}>Centralized AI Operations Console</h2>
          <p className={styles.headerSubtitle}>Monitor student communication models, automation health, and OCR confidence loops.</p>
        </div>
        <Button 
          variant="gold" 
          size="sm" 
          icon={<RotateCw size={14} className={isRefreshing ? 'spin-animation' : ''} />}
          onClick={handleSimulateRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? 'Polling Nodes...' : 'Query Health Logs'}
        </Button>
      </div>

      {/* KPI Cards Grid */}
      <div className={styles.kpiGrid}>
        
        <Card padding="md" variant="default" className={styles.kpiCard} onClick={() => metricClick('Automation Health Factor', '98.4%')}>
          <CardBody>
            <div className={styles.kpiHeader}>
              <span>Automation Health Factor</span>
              <Heart size={16} style={{ color: 'var(--stage-green-text)' }} />
            </div>
            <h3>98.4%</h3>
            <div className={styles.kpiStatusRow}>
              <StageChip stage="green" label="Highly Optimal" />
              <span>Target: &gt;95%</span>
            </div>
          </CardBody>
        </Card>

        <Card padding="md" variant="default" className={styles.kpiCard} onClick={() => metricClick('AI Response Accuracy', `${metrics.avgAccuracy}%`)}>
          <CardBody>
            <div className={styles.kpiHeader}>
              <span>AI Response Accuracy</span>
              <Activity size={16} className={styles.purpleText} />
            </div>
            <h3>{metrics.avgAccuracy}%</h3>
            <div className={styles.kpiStatusRow}>
              <StageChip stage="purple" label="Verified LLM" />
              <span>4 Active Models</span>
            </div>
          </CardBody>
        </Card>

        <Card padding="md" variant="default" className={styles.kpiCard} onClick={() => metricClick('Active Anomalies', String(metrics.activeAlerts))}>
          <CardBody>
            <div className={styles.kpiHeader}>
              <span>Active Anomalies</span>
              <AlertTriangle size={16} style={{ color: metrics.activeAlerts > 0 ? 'var(--stage-orange-text)' : 'var(--stage-green-text)' }} />
            </div>
            <h3>{metrics.activeAlerts}</h3>
            <div className={styles.kpiStatusRow}>
              <StageChip 
                stage={metrics.activeAlerts > 0 ? 'orange' : 'green'} 
                label={metrics.activeAlerts > 0 ? 'Intervention Recommended' : 'All Systems Safe'} 
              />
              <span>Live Queue</span>
            </div>
          </CardBody>
        </Card>

        <Card padding="md" variant="default" className={styles.kpiCard} onClick={() => metricClick('Processed Inquiries Today', metrics.totalProcessed.toLocaleString())}>
          <CardBody>
            <div className={styles.kpiHeader}>
              <span>Processed Inquiries Today</span>
              <Sparkles size={16} className={styles.goldText} />
            </div>
            <h3>{metrics.totalProcessed.toLocaleString()}</h3>
            <div className={styles.kpiStatusRow}>
              <StageChip stage="blue" label="+14.2% hourly spike" />
              <span>Meta Channels</span>
            </div>
          </CardBody>
        </Card>

      </div>

      <div className={styles.dashboardSplitGrid}>
        
        {/* Left Side: System Health & Active Processes */}
        <div className={styles.splitLeft}>
          
          {/* Section: AI System Health */}
          <Card padding="md" variant="default">
            <CardHeader 
              title="AI System Health" 
              subtitle="Verify latency thresholds and ping parameters across microservice endpoints" 
            />
            <CardBody>
              <div className={styles.nodesList}>
                {nodes.map(n => (
                  <div key={n.id} className={styles.nodeRow}>
                    <div className={styles.nodeMeta}>
                      <div className={styles.nodeTitle}>
                        <Database size={14} className={styles.nodeIcon} />
                        <strong>{n.name}</strong>
                      </div>
                      <span className={styles.nodeType}>{n.type} • Uptime: {n.uptime}</span>
                    </div>
                    <div className={styles.nodeStatus}>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginRight: 'var(--space-2)' }}>
                        Latency: <strong>{n.latency}</strong>
                      </span>
                      <StageChip 
                        stage={n.status} 
                        label={n.status === 'green' ? 'Active' : n.status === 'yellow' ? 'Warning' : 'Congestion'} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Section: Active AI Processes */}
          <Card padding="md" variant="default" style={{ marginTop: 'var(--space-4)' }}>
            <CardHeader 
              title="Active AI Processes" 
              subtitle="Operational pipeline modules handling live student query context rules" 
            />
            <CardBody>
              <div className={styles.processesList}>
                {processes.map(p => (
                  <div key={p.id} className={styles.processItem}>
                    <div className={styles.processMeta}>
                      <strong>{p.name}</strong>
                      <div className={styles.processDetails}>
                        <span className={styles.categoryLabel}>{p.category}</span>
                        <span>Processed: <strong>{p.processedToday.toLocaleString()}</strong></span>
                        <span>Accuracy score: <strong>{p.accuracy}%</strong></span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <StageChip 
                        stage={p.status === 'Active' ? 'purple' : p.status === 'Paused' ? 'orange' : 'gray'} 
                        label={p.status} 
                      />
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        icon={p.status === 'Active' ? <Clock size={12} /> : <Play size={12} />}
                        onClick={() => handleToggleProcess(p.id)}
                      >
                        {p.status === 'Active' ? 'Pause' : 'Activate'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Section: AI Workflow Status & Response Accuracy */}
          <div className={styles.horizontalSplit} style={{ marginTop: 'var(--space-4)' }}>
            
            <Card padding="md" variant="bordered" style={{ flex: 1 }}>
              <CardHeader title="AI Workflow Status" subtitle="Completed conversions by execution step" />
              <CardBody>
                <div className={styles.workflowTimeline}>
                  
                  <div className={styles.timelineItem}>
                    <div className={styles.timelineDot} style={{ background: 'var(--stage-blue-text)' }}></div>
                    <div className={styles.timelineContent}>
                      <strong>Step 1: Lead Intent Captured</strong>
                      <span>99.8% Success Rate (6,850 matches)</span>
                    </div>
                  </div>

                  <div className={styles.timelineItem}>
                    <div className={styles.timelineDot} style={{ background: 'var(--stage-purple-text)' }}></div>
                    <div className={styles.timelineContent}>
                      <strong>Step 2: Document Credential Extraction</strong>
                      <span>94.5% Success Rate (2,120 matches)</span>
                    </div>
                  </div>

                  <div className={styles.timelineItem}>
                    <div className={styles.timelineDot} style={{ background: 'var(--stage-yellow-text)' }}></div>
                    <div className={styles.timelineContent}>
                      <strong>Step 3: Intent Classification Nudge</strong>
                      <span>92.1% Reply Rate (1,480 matches)</span>
                    </div>
                  </div>

                  <div className={styles.timelineItem}>
                    <div className={styles.timelineDot} style={{ background: 'var(--stage-green-text)' }}></div>
                    <div className={styles.timelineContent}>
                      <strong>Step 4: Deposit Verified & Assigned</strong>
                      <span>98.6% Goal Success (420 matches)</span>
                    </div>
                  </div>

                </div>
              </CardBody>
            </Card>

            <Card padding="md" variant="bordered" style={{ flex: 1 }}>
              <CardHeader title="AI Response Accuracy" subtitle="Language precision indices" />
              <CardBody>
                <div className={styles.accuracyIndicators}>
                  
                  <div className={styles.indicatorRow}>
                    <div className={styles.indicatorLabel}>
                      <span>Core Syntactic Precision</span>
                      <strong>97.2%</strong>
                    </div>
                    <div className={styles.barBg}>
                      <div className={styles.barFill} style={{ width: '97.2%', background: 'var(--stage-purple-text)' }}></div>
                    </div>
                  </div>

                  <div className={styles.indicatorRow}>
                    <div className={styles.indicatorLabel}>
                      <span>Context Retrieval Hit Ratio</span>
                      <strong>94.5%</strong>
                    </div>
                    <div className={styles.barBg}>
                      <div className={styles.barFill} style={{ width: '94.5%', background: 'var(--stage-blue-text)' }}></div>
                    </div>
                  </div>

                  <div className={styles.indicatorRow}>
                    <div className={styles.indicatorLabel}>
                      <span>Admissions Policy Alignment</span>
                      <strong>99.4%</strong>
                    </div>
                    <div className={styles.barBg}>
                      <div className={styles.barFill} style={{ width: '99.4%', background: 'var(--stage-green-text)' }}></div>
                    </div>
                  </div>

                  <div className={styles.indicatorRow}>
                    <div className={styles.indicatorLabel}>
                      <span>Escalation Trigger Threshold</span>
                      <strong>88.7%</strong>
                    </div>
                    <div className={styles.barBg}>
                      <div className={styles.barFill} style={{ width: '88.7%', background: 'var(--stage-orange-text)' }}></div>
                    </div>
                  </div>

                </div>
              </CardBody>
            </Card>

          </div>

        </div>

        {/* Right Side: AI Usage Trends, AI Alerts & Connected Modules */}
        <div className={styles.splitRight}>
          
          {/* Section: AI Usage Trends */}
          <Card padding="md" variant="default">
            <CardHeader 
              title="AI Usage Trends" 
              subtitle="Track token consumption volumes and hourly LLM usage logs" 
            />
            <CardBody>
              <div className={styles.trendsContainer}>
                <div className={styles.graphHeader}>
                  <div className={styles.graphLegendItem}>
                    <div className={styles.legendColor} style={{ background: 'var(--color-gold)' }}></div>
                    <span>Total Prompt Tokens (4.8M)</span>
                  </div>
                  <div className={styles.graphLegendItem}>
                    <div className={styles.legendColor} style={{ background: 'var(--color-brown-dark)' }}></div>
                    <span>Response Tokens (1.2M)</span>
                  </div>
                </div>

                {/* Soft enterprise bars representing usage spikes */}
                <div className={styles.usageChartVisual}>
                  <div className={styles.chartCol}>
                    <div className={styles.barSegment} style={{ height: '40px', background: 'var(--color-gold)' }}></div>
                    <div className={styles.barSegment} style={{ height: '15px', background: 'var(--color-brown-dark)' }}></div>
                    <span className={styles.chartLabel}>08:00</span>
                  </div>
                  <div className={styles.chartCol}>
                    <div className={styles.barSegment} style={{ height: '55px', background: 'var(--color-gold)' }}></div>
                    <div className={styles.barSegment} style={{ height: '20px', background: 'var(--color-brown-dark)' }}></div>
                    <span className={styles.chartLabel}>10:00</span>
                  </div>
                  <div className={styles.chartCol}>
                    <div className={styles.barSegment} style={{ height: '90px', background: 'var(--color-gold)' }}></div>
                    <div className={styles.barSegment} style={{ height: '35px', background: 'var(--color-brown-dark)' }}></div>
                    <span className={styles.chartLabel}>12:00</span>
                  </div>
                  <div className={styles.chartCol}>
                    <div className={styles.barSegment} style={{ height: '80px', background: 'var(--color-gold)' }}></div>
                    <div className={styles.barSegment} style={{ height: '30px', background: 'var(--color-brown-dark)' }}></div>
                    <span className={styles.chartLabel}>14:00</span>
                  </div>
                  <div className={styles.chartCol}>
                    <div className={styles.barSegment} style={{ height: '60px', background: 'var(--color-gold)' }}></div>
                    <div className={styles.barSegment} style={{ height: '22px', background: 'var(--color-brown-dark)' }}></div>
                    <span className={styles.chartLabel}>16:00</span>
                  </div>
                  <div className={styles.chartCol}>
                    <div className={styles.barSegment} style={{ height: '45px', background: 'var(--color-gold)' }}></div>
                    <div className={styles.barSegment} style={{ height: '18px', background: 'var(--color-brown-dark)' }}></div>
                    <span className={styles.chartLabel}>18:00</span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Section: AI Alerts */}
          <Card padding="md" variant="default" style={{ marginTop: 'var(--space-4)' }}>
            <CardHeader 
              title="AI Alerts & Anomalies" 
              subtitle="Real-time warning notifications requiring administrative checks" 
            />
            <CardBody>
              {/* Filter controls */}
              <div className={styles.filterControls}>
                <span className={styles.filterTitle}>Severity Filter:</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {['All', 'Critical', 'Warning', 'Info'].map(sev => (
                    <button type="button"
                      key={sev}
                      onClick={() => setFilterSeverity(sev)}
                      className={`${styles.filterBtn} ${filterSeverity === sev ? styles.filterBtnActive : ''}`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              {/* Alerts Outbox */}
              <div className={styles.alertsList}>
                {filteredAlerts.length === 0 ? (
                  <div className={styles.emptyAlerts}>
                    <CheckCircle size={28} className={styles.greenText} style={{ opacity: 0.4 }} />
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                      No active alerts matched the filter.
                    </p>
                  </div>
                ) : (
                  filteredAlerts.map(a => (
                    <div 
                      key={a.id} 
                      className={`${styles.alertCard} ${a.resolved ? styles.alertCardResolved : ''}`}
                      style={{
                        borderLeftColor: 
                          a.resolved ? 'var(--color-border)' :
                          a.severity === 'Critical' ? 'var(--stage-orange-text)' :
                          a.severity === 'Warning' ? 'var(--stage-yellow-text)' :
                          'var(--stage-blue-text)'
                      }}
                    >
                      <div className={styles.alertHeaderRow}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <AlertTriangle size={12} style={{ color: a.severity === 'Critical' ? 'red' : 'orange' }} />
                          <span className={styles.alertSource}>{a.source}</span>
                        </div>
                        <span className={styles.alertTime}>{a.timestamp}</span>
                      </div>
                      <p className={styles.alertMessage}>{a.message}</p>
                      <div className={styles.alertFooter}>
                        <span className={styles.severityTag} style={{
                          background:
                            a.severity === 'Critical' ? 'var(--stage-orange-bg)' :
                            a.severity === 'Warning' ? 'var(--stage-yellow-bg)' :
                            'var(--stage-blue-bg)',
                          color:
                            a.severity === 'Critical' ? 'var(--stage-orange-text)' :
                            a.severity === 'Warning' ? 'var(--stage-yellow-text)' :
                            'var(--stage-blue-text)',
                        }}>
                          {a.severity}
                        </span>
                        {!a.resolved ? (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleResolveAlert(a.id)}
                          >
                            Resolve Flag
                          </Button>
                        ) : (
                          <span className={styles.resolvedChip}>✓ Resolved</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardBody>
          </Card>

          {/* Section: Connected Modules */}
          <Card padding="md" variant="bordered" style={{ marginTop: 'var(--space-4)' }}>
            <CardHeader 
              title="Connected AI Systems Overview" 
              subtitle="Integrations mapping active webhook and REST connections" 
            />
            <CardBody>
              <div className={styles.connectedGrid}>
                
                <div className={styles.connectItem}>
                  <div className={styles.connectMeta}>
                    <Terminal size={14} className={styles.connectIcon} />
                    <span>Official CRM Sync Endpoint</span>
                  </div>
                  <StageChip stage="green" label="Connected" />
                </div>

                <div className={styles.connectItem}>
                  <div className={styles.connectMeta}>
                    <Workflow size={14} className={styles.connectIcon} />
                    <span>WhatsApp Meta API Sandbox</span>
                  </div>
                  <StageChip stage="green" label="Active" />
                </div>

                <div className={styles.connectItem}>
                  <div className={styles.connectMeta}>
                    <Cpu size={14} className={styles.connectIcon} />
                    <span>Email Campaign Scheduler</span>
                  </div>
                  <StageChip stage="green" label="Polled" />
                </div>

                <div className={styles.connectItem}>
                  <div className={styles.connectMeta}>
                    <Activity size={14} className={styles.connectIcon} />
                    <span>IVR Recording Streaming Node</span>
                  </div>
                  <StageChip stage="yellow" label="Latency: 320ms" />
                </div>

                <div className={styles.connectItem}>
                  <div className={styles.connectMeta}>
                    <TrendingUp size={14} className={styles.connectIcon} />
                    <span>LMS Student Portal</span>
                  </div>
                  <StageChip stage="gray" label="Idle Sync" />
                </div>

              </div>
            </CardBody>
          </Card>

        </div>

      </div>

    </PageContainer>
  );
}
