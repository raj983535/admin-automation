import { useState } from 'react';
import { PageContainer, ModulePageHeader } from '../layouts';
import { Card, CardBody, CardHeader, Button, StageChip } from '../components/ui';
import { useNotifications } from '../contexts/NotificationContext';
import {
  Send,
  Mail,
  MessageSquare,
  Smartphone,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import styles from './BulkCampaignsPage.module.css';

interface BulkCampaign {
  id: string;
  name: string;
  cohort: string;
  channels: { email?: boolean; whatsapp?: boolean; sms?: boolean };
  stats: { sent: number; deliveryRate: number; conversionRate: number };
  status: 'Sent' | 'Scheduled' | 'Draft';
  date: string;
}

const INITIAL_BULK_CAMPAIGNS: BulkCampaign[] = [
  {
    id: 'bc-1',
    name: 'B.Tech Orientation Invite Wave 1',
    cohort: 'B.Tech Admitted List',
    channels: { email: true, whatsapp: true },
    stats: { sent: 1520, deliveryRate: 98.4, conversionRate: 46.2 },
    status: 'Sent',
    date: '2026-05-15',
  },
  {
    id: 'bc-2',
    name: 'Inquiry Verification Broadcast',
    cohort: 'Inquiry Cohort',
    channels: { sms: true, email: true },
    stats: { sent: 4850, deliveryRate: 99.0, conversionRate: 29.5 },
    status: 'Sent',
    date: '2026-05-19',
  },
  {
    id: 'bc-3',
    name: 'Missing Documents Final Call',
    cohort: 'Incomplete Dossiers',
    channels: { email: true, whatsapp: true, sms: true },
    stats: { sent: 240, deliveryRate: 0, conversionRate: 0 },
    status: 'Scheduled',
    date: '2026-05-26',
  },
];

interface DelaySequence {
  id: string;
  name: string;
  cohort: string;
  steps: { channel: 'Email' | 'WhatsApp' | 'SMS' | 'Counsellor Call'; delay: string; template: string }[];
}

const INITIAL_SEQUENCES: DelaySequence[] = [
  {
    id: 'seq-1',
    name: 'Admissions Inquiry Welcome Loop',
    cohort: 'Inquiry Cohort',
    steps: [
      { channel: 'Email', delay: 'Instant', template: 'Inquiry Acknowledgment' },
      { channel: 'WhatsApp', delay: 'Wait 24 Hours', template: 'Counselor Schedule Nudge' },
      { channel: 'SMS', delay: 'Wait 2 Days', template: 'DLT General Welcome Copy' },
      { channel: 'Counsellor Call', delay: 'Wait 3 Days', template: 'Assign Lead in CRM' },
    ],
  },
  {
    id: 'seq-2',
    name: 'Scholarship RSVP Campaign Flow',
    cohort: 'Scholarship Applicants',
    steps: [
      { channel: 'WhatsApp', delay: 'Instant', template: 'Invitation & Form Link' },
      { channel: 'Email', delay: 'Wait 12 Hours', template: 'RSVP Confirmation details' },
      { channel: 'SMS', delay: 'Wait 3 Days', template: 'Seat Lock-in Warning' },
    ],
  },
];

export function BulkCampaignsPage() {
  const { notify } = useNotifications();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'broadcaster' | 'sequences'>('dashboard');

  // Core state
  const [campaigns, setCampaigns] = useState<BulkCampaign[]>(INITIAL_BULK_CAMPAIGNS);
  const [sequences, setSequences] = useState<DelaySequence[]>(INITIAL_SEQUENCES);

  // Wizard input state
  const [campaignNameInput, setCampaignNameInput] = useState('');
  const [cohortSelect, setCohortSelect] = useState('B.Tech Admitted List');
  const [channels, setChannels] = useState({ email: true, whatsapp: false, sms: false });

  // Template dropdown selections
  const [emailTemplate, setEmailTemplate] = useState('admission_confirmation');
  const [whatsappTemplate, setWhatsappTemplate] = useState('document_verification');
  const [smsTemplate, setSmsTemplate] = useState('inquiry_welcome');

  // Trigger launch multi-channel campaign
  const handleLaunchCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignNameInput.trim()) {
      notify({ type: 'error', title: 'Descriptor Required', message: 'Please write a name for the multi-channel campaign.' });
      return;
    }

    if (!channels.email && !channels.whatsapp && !channels.sms) {
      notify({ type: 'error', title: 'Select Communication Channel', message: 'You must check at least one channel to broadcast.' });
      return;
    }

    const cohortCounts: Record<string, number> = {
      'B.Tech Admitted List': 1520,
      'Inquiry Cohort': 4850,
      'Incomplete Dossiers': 240,
      'Scholarship Applicants': 680,
    };
    const count = cohortCounts[cohortSelect] || 500;

    const newCampaign: BulkCampaign = {
      id: `bc-${Date.now()}`,
      name: campaignNameInput.trim(),
      cohort: cohortSelect,
      channels: { ...channels },
      stats: { sent: count, deliveryRate: 98.7, conversionRate: 0 },
      status: 'Sent',
      date: new Date().toISOString().split('T')[0],
    };

    setCampaigns((prev) => [newCampaign, ...prev]);
    
    // Build notification success messages
    const channelList: string[] = [];
    if (channels.email) channelList.push('Email');
    if (channels.whatsapp) channelList.push('WhatsApp');
    if (channels.sms) channelList.push('SMS');

    notify({
      type: 'success',
      title: 'Unified Campaign Dispatched!',
      message: `"${newCampaign.name}" broadcasted to ${newCampaign.stats.sent.toLocaleString()} students via [${channelList.join(', ')}].`,
    });

    // Reset inputs
    setCampaignNameInput('');
    setChannels({ email: true, whatsapp: false, sms: false });
    setActiveTab('dashboard');
  };

  const handleToggleChannel = (chan: 'email' | 'whatsapp' | 'sms') => {
    setChannels((prev) => ({
      ...prev,
      [chan]: !prev[chan],
    }));
  };

  const handleUpdateStepDelay = (seqId: string, stepIdx: number, newDelay: string) => {
    setSequences((prev) =>
      prev.map((seq) => {
        if (seq.id === seqId) {
          const updatedSteps = [...seq.steps];
          updatedSteps[stepIdx] = {
            ...updatedSteps[stepIdx],
            delay: newDelay,
          };
          return {
            ...seq,
            steps: updatedSteps,
          };
        }
        return seq;
      })
    );
    notify({
      type: 'info',
      title: 'Timeline Adjusted',
      message: 'Modified broadcast interval parameters successfully.',
      duration: 1200,
    });
  };

  return (
    <PageContainer breadcrumbs={[{ label: 'Marketing' }, { label: 'Bulk Campaigns' }]}>
      <ModulePageHeader
        title="Bulk Campaigns"
        subtitle="Orchestrate multi-channel blast campaigns from one console."
      />
      <nav className="ml-tabs">
        <button type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`ml-tab ${activeTab === 'dashboard' ? 'ml-tab-active' : ''}`}
        >
          <Layers size={16} />
          <span>Central Dashboard</span>
        </button>
        <button type="button"
          onClick={() => setActiveTab('broadcaster')}
          className={`ml-tab ${activeTab === 'broadcaster' ? 'ml-tab-active' : ''}`}
        >
          <Send size={16} />
          <span>Unified Broadcaster</span>
        </button>
        <button type="button"
          onClick={() => setActiveTab('sequences')}
          className={`ml-tab ${activeTab === 'sequences' ? 'ml-tab-active' : ''}`}
        >
          <Clock size={16} />
          <span>Cascade Workflows</span>
        </button>
      </nav>

      <div className={`ml-tab-panel ${styles.tabContent}`}>
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className={styles.dashboardContainer}>
            {/* Top Cards for each channel comparison */}
            <div className={styles.channelStatsGrid}>
              
              <div className={`${styles.channelCard} ${styles.channelCardEmail}`}>
                <div className={styles.channelCardHeader}>
                  <h4>Email Marketing Gateway</h4>
                  <Mail size={18} className={styles.goldText} />
                </div>
                <div className={styles.channelMetricsRow}>
                  <div className={styles.metricItem}>
                    <span>Average Open Rate</span>
                    <strong>60.2%</strong>
                  </div>
                  <div className={styles.metricItem}>
                    <span>Click Conversion</span>
                    <strong>30.5%</strong>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: '10px', color: 'var(--color-text-secondary)' }}>
                  Total Synced Subscribers: 7,290 | Cost: Ultra Low
                </p>
              </div>

              <div className={`${styles.channelCard} ${styles.channelCardWhatsApp}`}>
                <div className={styles.channelCardHeader}>
                  <h4>WhatsApp Business API</h4>
                  <MessageSquare size={18} style={{ color: '#25d366' }} />
                </div>
                <div className={styles.channelMetricsRow}>
                  <div className={styles.metricItem}>
                    <span>Average Read Rate</span>
                    <strong>94.2%</strong>
                  </div>
                  <div className={styles.metricItem}>
                    <span>Student Reply Rate</span>
                    <strong>48.3%</strong>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: '10px', color: 'var(--color-text-secondary)' }}>
                  Meta Sandbox Health: Optimal | Cost: Variable
                </p>
              </div>

              <div className={`${styles.channelCard} ${styles.channelCardSMS}`}>
                <div className={styles.channelCardHeader}>
                  <h4>DLT SMS Cellular Route</h4>
                  <Smartphone size={18} style={{ color: 'var(--stage-purple-text)' }} />
                </div>
                <div className={styles.channelMetricsRow}>
                  <div className={styles.metricItem}>
                    <span>Delivery Success</span>
                    <strong>98.9%</strong>
                  </div>
                  <div className={styles.metricItem}>
                    <span>Click-Through Rate</span>
                    <strong>31.3%</strong>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: '10px', color: 'var(--color-text-secondary)' }}>
                  DLT Registration active | Cost: Rs. 0.15/SMS
                </p>
              </div>

            </div>

            {/* Split view: outbox history & channel performance graphs */}
            <div className={styles.dashboardLayoutSplit}>
              
              <div className={styles.chartColLeft}>
                <Card padding="md" variant="default">
                  <CardHeader title="Unified Outbox Directory" subtitle="Review bulk multi-channel campaign dispatches" />
                  <CardBody>
                    <table className={styles.bulkCampaignsTable}>
                      <thead>
                        <tr>
                          <th>Campaign Descriptor</th>
                          <th>Target List</th>
                          <th>Active Channels</th>
                          <th>Volume</th>
                          <th>Conversion</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {campaigns.map((c) => (
                          <tr key={c.id}>
                            <td>
                              <strong>{c.name}</strong>
                              <p style={{ fontSize: '10px', color: 'var(--color-text-secondary)', margin: 0 }}>Launched: {c.date}</p>
                            </td>
                            <td>{c.cohort}</td>
                            <td>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                {c.channels.email && <span title="Email Active"><Mail size={12} className={styles.goldText} /></span>}
                                {c.channels.whatsapp && <span title="WhatsApp Active"><MessageSquare size={12} style={{ color: '#25d366' }} /></span>}
                                {c.channels.sms && <span title="SMS Active"><Smartphone size={12} style={{ color: 'var(--stage-purple-text)' }} /></span>}
                              </div>
                            </td>
                            <td>{c.stats.sent.toLocaleString()} students</td>
                            <td>{c.status === 'Sent' ? `${c.stats.conversionRate || 32.4}%` : '—'}</td>
                            <td>
                              <StageChip
                                stage={c.status === 'Sent' ? 'green' : c.status === 'Scheduled' ? 'yellow' : 'gray'}
                                label={c.status}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardBody>
                </Card>
              </div>

              {/* Channel Conversion Bars */}
              <div className={styles.chartColRight}>
                <Card padding="md" variant="bordered">
                  <CardHeader title="Comparative Engagement Levels" subtitle="Performance comparison ratios by medium" />
                  <CardBody className={styles.comparisonSection}>
                    
                    <div className={styles.comparisonRow}>
                      <div className={styles.comparisonLabel}>
                        <span>Average Open / Read Factor</span>
                        <strong>WhatsApp Leads (94%)</strong>
                      </div>
                      <div className={styles.comparisonBarBg}>
                        <div className={styles.comparisonBarFill} style={{ width: '94%', background: '#25d366' }} />
                      </div>
                    </div>

                    <div className={styles.comparisonRow}>
                      <div className={styles.comparisonLabel}>
                        <span>Average Open / Read Factor</span>
                        <strong>SMS Gateway (98%)</strong>
                      </div>
                      <div className={styles.comparisonBarBg}>
                        <div className={styles.comparisonBarFill} style={{ width: '98%', background: 'var(--stage-purple-text)' }} />
                      </div>
                    </div>

                    <div className={styles.comparisonRow}>
                      <div className={styles.comparisonLabel}>
                        <span>Average Open / Read Factor</span>
                        <strong>Email Service (60%)</strong>
                      </div>
                      <div className={styles.comparisonBarBg}>
                        <div className={styles.comparisonBarFill} style={{ width: '60%', background: 'var(--color-gold)' }} />
                      </div>
                    </div>

                    <div style={{ marginTop: 'var(--space-2)', borderTop: '1px solid var(--color-border-subtle)', paddingTop: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
                      <div style={{ display: 'flex', gap: '6px', fontWeight: 'bold', color: 'var(--color-brown-dark)', marginBottom: '2px' }}>
                        <Sparkles size={13} style={{ color: 'var(--color-gold)' }} /> AI Cross-Channel Tip:
                      </div>
                      <p style={{ margin: 0, color: 'var(--color-text-secondary)', lineHeight: '1.4' }}>
                        WhatsApp achieves a **3.1x higher instantaneous read rate** than Email. We recommend utilizing WhatsApp for high-importance scheduling approvals and Email for structured, complex registration processes.
                      </p>
                    </div>

                  </CardBody>
                </Card>
              </div>

            </div>
          </div>
        )}

        {/* UNIFIED BROADCASTER TAB */}
        {activeTab === 'broadcaster' && (
          <div className={styles.broadcasterGrid}>
            
            {/* Broadcaster Wizard Inputs Form */}
            <div className={styles.chartColLeft}>
              <Card padding="lg" variant="default">
                <CardHeader title="Configure Unified Multi-Channel Blast" subtitle="Deploy multiple formats to the same recipient cohort instantly" />
                <CardBody>
                  <form onSubmit={handleLaunchCampaign} className={styles.wizardForm}>
                    
                    <div className={styles.formRow}>
                      <label className={styles.formLabel}>
                        <span>Internal Campaign Descriptor</span>
                        <input
                          type="text"
                          required
                          placeholder="e.g. B.Tech Orientation Wave 1 Notification"
                          value={campaignNameInput}
                          onChange={(e) => setCampaignNameInput(e.target.value)}
                          className={styles.formInput}
                        />
                      </label>

                      <label className={styles.formLabel}>
                        <span>Recipient Segment List</span>
                        <select
                          value={cohortSelect}
                          onChange={(e) => setCohortSelect(e.target.value)}
                          className={styles.formSelect}
                        >
                          <option value="B.Tech Admitted List">B.Tech Admitted List (1,520 candidates)</option>
                          <option value="Inquiry Cohort">Inquiry Cohort (4,850 candidates)</option>
                          <option value="Incomplete Dossiers">Incomplete Dossiers (240 candidates)</option>
                          <option value="Scholarship Applicants">Scholarship Applicants (680 candidates)</option>
                        </select>
                      </label>
                    </div>

                    {/* Channels selector cards */}
                    <div className={styles.formLabel}>
                      <span>Deploy Communication Channels (select multiple)</span>
                      <div className={styles.channelsSelectorBox}>
                        
                        <div className={styles.channelCheckboxRow} onClick={() => handleToggleChannel('email')}>
                          <input type="checkbox" checked={channels.email} readOnly />
                          <div className={styles.channelCheckboxLabel}>
                            <strong>Deploy Email Gateway</strong>
                            <span>Send structured formatted letter copy template</span>
                          </div>
                        </div>

                        <div className={styles.channelCheckboxRow} onClick={() => handleToggleChannel('whatsapp')}>
                          <input type="checkbox" checked={channels.whatsapp} readOnly />
                          <div className={styles.channelCheckboxLabel}>
                            <strong>Deploy WhatsApp Business Message</strong>
                            <span>Send pre-approved verified meta context template</span>
                          </div>
                        </div>

                        <div className={styles.channelCheckboxRow} onClick={() => handleToggleChannel('sms')}>
                          <input type="checkbox" checked={channels.sms} readOnly />
                          <div className={styles.channelCheckboxLabel}>
                            <strong>Deploy Cellular SMS Route</strong>
                            <span>Send short character DLT-approved transactional SMS text</span>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Submit dispatcher button */}
                    <div style={{ marginTop: 'var(--space-2)' }}>
                      <Button variant="gold" type="submit" icon={<Send size={14} />}>
                        Simultaneously Dispatch Channels
                      </Button>
                    </div>

                  </form>
                </CardBody>
              </Card>
            </div>

            {/* Dynamic Template Mapping based on active checked checkboxes */}
            <div className={styles.chartColRight}>
              <Card padding="md" variant="bordered">
                <CardHeader title="Channel Template Association" subtitle="Assign pre-approved layouts to selected streams" />
                <CardBody className={styles.templateSlotsContainer}>
                  
                  {channels.email && (
                    <div className={styles.slotCard} style={{ borderLeft: '4px solid var(--color-gold)' }}>
                      <div className={styles.slotCardTitle}>
                        <Mail size={14} className={styles.goldText} />
                        <span>Email Blast Template</span>
                      </div>
                      <select 
                        value={emailTemplate} 
                        onChange={(e) => setEmailTemplate(e.target.value)}
                        className={styles.formSelect}
                      >
                        <option value="admission_confirmation">Admission Approval Booklet</option>
                        <option value="document_reminder">Missing Credentials Transcripts Nudge</option>
                        <option value="event_invitation">Orientation Seminar Invite</option>
                      </select>
                    </div>
                  )}

                  {channels.whatsapp && (
                    <div className={styles.slotCard} style={{ borderLeft: '4px solid #25d366' }}>
                      <div className={styles.slotCardTitle}>
                        <MessageSquare size={14} style={{ color: '#25d366' }} />
                        <span>WhatsApp approved template</span>
                      </div>
                      <select 
                        value={whatsappTemplate} 
                        onChange={(e) => setWhatsappTemplate(e.target.value)}
                        className={styles.formSelect}
                      >
                        <option value="document_verification">Meta verification: outstanding documents request</option>
                        <option value="orientation_alert">Freshers Campus tour reservation</option>
                        <option value="fee_deadline">Seat lock deadline warning</option>
                      </select>
                    </div>
                  )}

                  {channels.sms && (
                    <div className={styles.slotCard} style={{ borderLeft: '4px solid var(--stage-purple-text)' }}>
                      <div className={styles.slotCardTitle}>
                        <Smartphone size={14} style={{ color: 'var(--stage-purple-text)' }} />
                        <span>Cellular SMS DLT Template</span>
                      </div>
                      <select 
                        value={smsTemplate} 
                        onChange={(e) => setSmsTemplate(e.target.value)}
                        className={styles.formSelect}
                      >
                        <option value="inquiry_welcome">DLT: Inquiry Welcome Counselor Hook</option>
                        <option value="doc_missing">DLT: Outstanding document files upload nudge</option>
                        <option value="deposit_alert">DLT: Tuition Deposit Due Booking reminder</option>
                      </select>
                    </div>
                  )}

                  {!channels.email && !channels.whatsapp && !channels.sms && (
                    <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--color-text-secondary)' }}>
                      <Layers size={32} style={{ opacity: 0.2, marginBottom: 'var(--space-2)' }} />
                      <p style={{ margin: 0, fontSize: 'var(--text-xs)' }}>Select at least one active communication channel to customize templates.</p>
                    </div>
                  )}

                </CardBody>
              </Card>
            </div>

          </div>
        )}

        {/* CASCADE WORKFLOWS TAB */}
        {activeTab === 'sequences' && (
          <div className={styles.dashboardContainer}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', color: 'var(--color-brown-dark)' }}>Cascade Multi-Step Loops</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: '2px 0 0' }}>Execute drip sequences based on delays and student replies</p>
              </div>
            </div>

            <div className={styles.cascadeList}>
              {sequences.map((seq) => (
                <div key={seq.id} className={styles.cascadeRow}>
                  <div className={styles.cascadeHeader}>
                    <div>
                      <h4>{seq.name}</h4>
                      <span className={styles.cascadeDesc}>Cohort: <strong>{seq.cohort}</strong></span>
                    </div>
                    <StageChip stage="green" label="Active Pipeline" />
                  </div>

                  <div className={styles.stepsTimeline}>
                    {seq.steps.map((step, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        
                        <div className={styles.timelineNode}>
                          <h5>{step.channel} step</h5>
                          <p>{step.template}</p>
                          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginTop: '6px' }}>
                            <select
                              value={step.delay}
                              onChange={(e) => handleUpdateStepDelay(seq.id, idx, e.target.value)}
                              className={styles.nodeSelect}
                              style={{ fontSize: '9px', padding: '2px 4px', width: 'auto' }}
                            >
                              <option>Instant</option>
                              <option>Wait 12 Hours</option>
                              <option>Wait 24 Hours</option>
                              <option>Wait 2 Days</option>
                              <option>Wait 3 Days</option>
                            </select>
                          </div>
                        </div>

                        {idx < seq.steps.length - 1 && (
                          <div className={styles.timelineConnector}>
                            <div className={styles.timelineConnectorArrow} />
                            <span className={styles.timelineConnectorText}>{seq.steps[idx + 1].delay}</span>
                          </div>
                        )}

                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}
      </div>

    </PageContainer>
  );
}
