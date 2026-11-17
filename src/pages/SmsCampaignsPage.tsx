import { useState, useMemo, useRef } from 'react';
import { PageContainer, ModulePageHeader } from '../layouts';
import { Card, CardBody, CardHeader, Button, StageChip } from '../components/ui';
import { useNotifications } from '../hooks/useNotifications';
import {
  Smartphone,
  Send,
  Calendar,
  Clock,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Database,
  RefreshCw,
} from 'lucide-react';
import styles from './SmsCampaignsPage.module.css';

interface SmsTemplate {
  name: string;
  description: string;
  body: string;
}

const SMS_TEMPLATES: Record<string, SmsTemplate> = {
  inquiry_welcome: {
    name: 'Inquiry Welcome',
    description: 'Auto-reply to admission inquiries with counselor booking details.',
    body: 'Hi {first_name}, thank you for your inquiry about B.Tech at CollegeOS. Our advisor will call you today! Or book a personalized slot: {booking_link}',
  },
  doc_missing: {
    name: 'Document Pending',
    description: 'Nudge candidates to upload high school transcripts.',
    body: 'Dear {first_name}, your application is pending outstanding transcripts. Please upload them by {due_date} at your dashboard: {portal_link}',
  },
  rsvp_nudge: {
    name: 'Orientation Ticket RSVP',
    description: 'Urge freshers to book tickets for the campus tour.',
    body: 'Hey {first_name}, secure your freshers orientation ticket by tonight. Event starts Saturday! RSVP immediately here: {rsvp_link}',
  },
  deposit_alert: {
    name: 'Deposit Overdue Alert',
    description: 'Payment reminders for tuition or seat reservation deposit fees.',
    body: 'Urgent: {first_name}, seat reservation fee of Rs 10,000 is due by {due_date} to finalize your admission. Pay now: {payment_link}',
  },
};

interface SmsCampaign {
  id: string;
  name: string;
  senderId: string;
  cohort: string;
  text: string;
  sentCount: number;
  deliveryRate: number;
  clickRate: number;
  status: 'Sent' | 'Scheduled' | 'Draft';
  date: string;
}

const INITIAL_CAMPAIGNS: SmsCampaign[] = [
  { id: 'sms-1', name: 'Freshmen Seat Reservation Alert', senderId: 'CLGOSN', cohort: 'B.Tech Admitted List', text: 'Urgent: {first_name}, seat reservation fee of Rs 10,000 is due by 25th May to finalize your admission.', sentCount: 1520, deliveryRate: 98.6, clickRate: 34.2, status: 'Sent', date: '2026-05-18' },
  { id: 'sms-2', name: 'Open House Lab Tour RSVP', senderId: 'ADMISS', cohort: 'Inquiry Cohort', text: 'Hey {first_name}, secure your freshers orientation ticket by tonight. RSVP immediately here: clgos.in/rsvp', sentCount: 4850, deliveryRate: 99.1, clickRate: 28.5, status: 'Sent', date: '2026-05-20' },
  { id: 'sms-3', name: 'Transcript Upload Nudge', senderId: 'ADMISS', cohort: 'Incomplete Dossiers', text: 'Dear {first_name}, your application is pending outstanding transcripts. Please upload them by 24th May: clgos.in/portal', sentCount: 240, deliveryRate: 0, clickRate: 0, status: 'Scheduled', date: '2026-05-25' },
  { id: 'sms-4', name: 'Scholarship Deadline Final Alert', senderId: 'CLGOSN', cohort: 'Scholarship Applicants', text: 'Reminder: {first_name}, merit scholarship applications close this Friday 5 PM. Submit your documents now: clgos.in/scholarship', sentCount: 680, deliveryRate: 97.8, clickRate: 41.6, status: 'Sent', date: '2026-05-17' },
  { id: 'sms-5', name: 'Hostel Booking Window SMS', senderId: 'STUACN', cohort: 'B.Tech Admitted List', text: 'Hi {first_name}, hostel room allotment opens Mon 9 AM. Book your preferred block early: clgos.in/hostel', sentCount: 1520, deliveryRate: 99.3, clickRate: 52.8, status: 'Sent', date: '2026-05-22' },
  { id: 'sms-6', name: 'Parent-Teacher Meet RSVP', senderId: 'ADMISS', cohort: 'B.Tech Admitted List', text: 'Dear parent of {first_name}, you are invited to the Pre-Admission Parent-Teacher Meet on June 1. RSVP here: clgos.in/ptm', sentCount: 1520, deliveryRate: 0, clickRate: 0, status: 'Scheduled', date: '2026-05-29' },
];

const SMS_COHORTS = [
  { name: 'B.Tech Admitted List', count: 1520 },
  { name: 'Inquiry Cohort', count: 4850 },
  { name: 'Incomplete Dossiers', count: 240 },
  { name: 'Scholarship Applicants', count: 680 },
];

export function SmsCampaignsPage() {
  const { notify } = useNotifications();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'creator'>('dashboard');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Core State
  const [campaigns, setCampaigns] = useState<SmsCampaign[]>(INITIAL_CAMPAIGNS);
  const [activeTemplateKey, setActiveTemplateKey] = useState<string>('inquiry_welcome');
  
  // Composer Form
  const [campaignName, setCampaignName] = useState('');
  const [senderId, setSenderId] = useState('CLGOSN');
  const [cohortSelect, setCohortSelect] = useState('B.Tech Admitted List');
  const [smsBody, setSmsBody] = useState(SMS_TEMPLATES.inquiry_welcome.body);

  // Scheduling Modal
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('2026-05-23');
  const [scheduleTime, setScheduleTime] = useState('11:00');

  // Recharge credits simulation
  const [credits, setCredits] = useState(48120);
  const [isRecharging, setIsRecharging] = useState(false);

  // SMS Calculations
  const smsMetrics = useMemo(() => {
    const len = smsBody.length;
    let parts = 1;
    if (len > 160) {
      parts = Math.ceil(len / 153);
    }
    const cohortData = SMS_COHORTS.find(c => c.name === cohortSelect);
    const volume = cohortData ? cohortData.count : 500;
    const estCost = parts * volume * 0.15; // Rs. 0.15 per SMS credit
    return {
      length: len,
      parts,
      estCost,
      volume,
    };
  }, [smsBody, cohortSelect]);

  const handleSelectTemplate = (key: string) => {
    setActiveTemplateKey(key);
    setSmsBody(SMS_TEMPLATES[key].body);
    notify({
      type: 'info',
      title: 'SMS Template Loaded',
      message: `Populated composer with "${SMS_TEMPLATES[key].name}" SMS layout.`,
      duration: 1500,
    });
  };

  const handleInjectTag = (tag: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setSmsBody(prev => prev + tag);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);

    setSmsBody(before + tag + after);
    
    // Maintain focus and set selection after injected tag
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tag.length, start + tag.length);
    }, 50);
  };

  const handleRecharge = () => {
    setIsRecharging(true);
    setTimeout(() => {
      setCredits(prev => prev + 50000);
      setIsRecharging(false);
      notify({
        type: 'success',
        title: 'Credits Recharged!',
        message: 'Successfully topped up account with 50,000 DLT SMS Credits.',
      });
    }, 1200);
  };

  const handleSendNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName.trim()) {
      notify({ type: 'error', title: 'Campaign Descriptor Needed', message: 'Please describe this SMS campaign.' });
      return;
    }
    if (credits < smsMetrics.parts * smsMetrics.volume) {
      notify({
        type: 'error',
        title: 'Insufficient DLT Credits',
        message: `Your campaign requires ${smsMetrics.parts * smsMetrics.volume} credits, but you only have ${credits.toLocaleString()} credits.`,
      });
      return;
    }

    const newCampaign: SmsCampaign = {
      id: `sms-${Date.now()}`,
      name: campaignName.trim(),
      senderId,
      cohort: cohortSelect,
      text: smsBody.trim(),
      sentCount: smsMetrics.volume,
      deliveryRate: 0,
      clickRate: 0,
      status: 'Sent',
      date: new Date().toISOString().split('T')[0],
    };

    setCampaigns(prev => [newCampaign, ...prev]);
    setCredits(prev => prev - (smsMetrics.parts * smsMetrics.volume));
    notify({
      type: 'success',
      title: 'SMS Campaign Dispatched!',
      message: `"${newCampaign.name}" broadcasted to ${newCampaign.sentCount.toLocaleString()} candidates via ${senderId}.`,
    });

    setCampaignName('');
    setActiveTab('dashboard');
  };

  const handleOpenScheduleModal = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!campaignName.trim()) {
      notify({ type: 'error', title: 'Campaign Descriptor Needed', message: 'Please write a name before scheduling.' });
      return;
    }
    setShowScheduleModal(true);
  };

  const handleConfirmSchedule = () => {
    const newCampaign: SmsCampaign = {
      id: `sms-${Date.now()}`,
      name: campaignName.trim(),
      senderId,
      cohort: cohortSelect,
      text: smsBody.trim(),
      sentCount: smsMetrics.volume,
      deliveryRate: 0,
      clickRate: 0,
      status: 'Scheduled',
      date: `${scheduleDate} ${scheduleTime}`,
    };

    setCampaigns(prev => [newCampaign, ...prev]);
    setCredits(prev => prev - (smsMetrics.parts * smsMetrics.volume));
    setShowScheduleModal(false);
    setCampaignName('');
    setActiveTab('dashboard');

    notify({
      type: 'success',
      title: 'SMS Campaign Scheduled',
      message: `"${newCampaign.name}" queued for queue delivery on ${newCampaign.date}.`,
    });
  };

  // Mock substitution for preview rendering
  const substitutedSmsPreview = useMemo(() => {
    return smsBody
      .replace(/{first_name}/g, 'Rahul')
      .replace(/{booking_link}/g, 'clgos.in/rahul-counsel')
      .replace(/{portal_link}/g, 'clgos.in/portal-login')
      .replace(/{rsvp_link}/g, 'clgos.in/freshers-rsvp')
      .replace(/{payment_link}/g, 'clgos.in/pay-deposit')
      .replace(/{due_date}/g, '25th May');
  }, [smsBody]);

  return (
    <PageContainer breadcrumbs={[{ label: 'Marketing' }, { label: 'SMS Campaigns' }]}>
      <ModulePageHeader
        title="SMS Campaigns"
        subtitle="Broadcast DLT-compliant SMS to admission cohorts and track delivery."
      />
      <nav className="ml-tabs">
        <button type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`ml-tab ${activeTab === 'dashboard' ? 'ml-tab-active' : ''}`}
        >
          <TrendingUp size={16} />
          <span>SMS Dashboard</span>
        </button>
        <button type="button"
          onClick={() => setActiveTab('creator')}
          className={`ml-tab ${activeTab === 'creator' ? 'ml-tab-active' : ''}`}
        >
          <Smartphone size={16} />
          <span>SMS Broadcaster</span>
        </button>
      </nav>

      <div className={`ml-tab-panel ${styles.tabContent}`}>
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className={styles.dashboardContainer}>
            <div className={styles.statsGrid}>
              <Card padding="md" variant="default" className={styles.statBox}>
                <div className={styles.statHeader}>
                  <span>DLT Credits Remaining</span>
                  <Database size={16} className={styles.goldText} />
                </div>
                <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>{credits.toLocaleString()}</span>
                  <Button variant="ghost" size="sm" onClick={handleRecharge} disabled={isRecharging}>
                    <RefreshCw size={12} className={isRecharging ? 'spin-animation' : ''} />
                    <span>Top-up</span>
                  </Button>
                </h3>
                <p>Transactional SMS quota balance. DLT ID Active.</p>
              </Card>

              <Card padding="md" variant="default" className={styles.statBox}>
                <div className={styles.statHeader}>
                  <span>Average Delivery Success</span>
                  <CheckCircle size={16} className={styles.greenText} />
                </div>
                <h3>98.9%</h3>
                <p>Calculated across Airtel, Jio, and Vi gateways</p>
              </Card>

              <Card padding="md" variant="default" className={styles.statBox}>
                <div className={styles.statHeader}>
                  <span>SMS Conversion Rate</span>
                  <TrendingUp size={16} className={styles.blueText} />
                </div>
                <h3>31.3%</h3>
                <p>Candidates clicking dynamic portal and pay links</p>
              </Card>

              <Card padding="md" variant="default" className={styles.statBox}>
                <div className={styles.statHeader}>
                  <span>Cost per SMS Unit</span>
                  <span className={styles.orangeText}>Rs 0.15</span>
                </div>
                <h3>DLT Tier A</h3>
                <p>Approved sender pricing tier</p>
              </Card>
            </div>

            <div className={styles.dashboardLayoutSplit}>
              {/* Campaign Table Directory */}
              <div className={styles.chartColLeft}>
                <Card padding="md" variant="default">
                  <CardHeader title="SMS Outbox Directory" subtitle="Inspect scheduled and dispatched bulk text logs" />
                  <CardBody>
                    <table className={styles.smsCampaignsTable}>
                      <thead>
                        <tr>
                          <th>Campaign Name</th>
                          <th>Sender</th>
                          <th>Target List</th>
                          <th>Recipients</th>
                          <th>Delivery Rate</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {campaigns.map((c) => (
                          <tr key={c.id}>
                            <td>
                              <strong>{c.name}</strong>
                              <p style={{ fontSize: '10px', color: 'var(--color-text-secondary)', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '240px' }}>{c.text}</p>
                            </td>
                            <td><code style={{ background: 'var(--color-bg-sidebar)', padding: '2px 4px', borderRadius: '2px', fontSize: '11px' }}>{c.senderId}</code></td>
                            <td>{c.cohort}</td>
                            <td>{c.sentCount.toLocaleString()}</td>
                            <td>{c.status === 'Sent' ? `${c.deliveryRate}%` : '—'}</td>
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

              {/* Sparklines / cellular provider trends */}
              <div className={styles.chartColRight}>
                <Card padding="md" variant="bordered">
                  <CardHeader title="Gateway Route Health" subtitle="Real-time delivery trends across major carriers" />
                  <CardBody className={styles.providerTrendsList}>
                    
                    <div className={styles.providerTrendRow}>
                      <div className={styles.providerMeta}>
                        <span>Bharti Airtel Gateway</span>
                        <StageChip stage="green" label="99.8% Active" />
                      </div>
                      <div className={styles.sparklineWrapper}>
                        <div className={`${styles.sparkBar} ${styles.sparkBarHigh}`} style={{ height: '80%' }}></div>
                        <div className={`${styles.sparkBar} ${styles.sparkBarHigh}`} style={{ height: '90%' }}></div>
                        <div className={`${styles.sparkBar} ${styles.sparkBarHigh}`} style={{ height: '98%' }}></div>
                        <div className={`${styles.sparkBar} ${styles.sparkBarHigh}`} style={{ height: '95%' }}></div>
                        <div className={`${styles.sparkBar} ${styles.sparkBarHigh}`} style={{ height: '99%' }}></div>
                        <div className={`${styles.sparkBar} ${styles.sparkBarHigh}`} style={{ height: '100%' }}></div>
                      </div>
                    </div>

                    <div className={styles.providerTrendRow}>
                      <div className={styles.providerMeta}>
                        <span>Reliance Jio Gateway</span>
                        <StageChip stage="green" label="99.2% Active" />
                      </div>
                      <div className={styles.sparklineWrapper}>
                        <div className={`${styles.sparkBar} ${styles.sparkBarHigh}`} style={{ height: '85%' }}></div>
                        <div className={`${styles.sparkBar} ${styles.sparkBarHigh}`} style={{ height: '82%' }}></div>
                        <div className={`${styles.sparkBar} ${styles.sparkBarHigh}`} style={{ height: '90%' }}></div>
                        <div className={`${styles.sparkBar} ${styles.sparkBarHigh}`} style={{ height: '91%' }}></div>
                        <div className={`${styles.sparkBar} ${styles.sparkBarHigh}`} style={{ height: '95%' }}></div>
                        <div className={`${styles.sparkBar} ${styles.sparkBarHigh}`} style={{ height: '99%' }}></div>
                      </div>
                    </div>

                    <div className={styles.providerTrendRow}>
                      <div className={styles.providerMeta}>
                        <span>Vodafone Idea Gateway</span>
                        <StageChip stage="yellow" label="94.5% Congestion" />
                      </div>
                      <div className={styles.sparklineWrapper}>
                        <div className={`${styles.sparkBar} ${styles.sparkBarHigh}`} style={{ height: '90%' }}></div>
                        <div className={`${styles.sparkBar} ${styles.sparkBarHigh}`} style={{ height: '88%' }}></div>
                        <div className={`${styles.sparkBar} ${styles.sparkBarWarning}`} style={{ height: '50%' }}></div>
                        <div className={`${styles.sparkBar} ${styles.sparkBarWarning}`} style={{ height: '65%' }}></div>
                        <div className={`${styles.sparkBar} ${styles.sparkBarHigh}`} style={{ height: '85%' }}></div>
                        <div className={`${styles.sparkBar} ${styles.sparkBarHigh}`} style={{ height: '94%' }}></div>
                      </div>
                    </div>

                    <div style={{ marginTop: 'var(--space-1)', padding: 'var(--space-2)', background: 'var(--color-gold-soft)', border: '1px solid var(--color-gold)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)' }}>
                      <div style={{ display: 'flex', gap: '6px', fontWeight: 'bold', color: 'var(--color-brown-dark)', marginBottom: '2px' }}>
                        <AlertTriangle size={12} /> Optimization Recommendation:
                      </div>
                      <p style={{ margin: 0, color: 'var(--color-text-primary)' }}>
                        Vodafone Idea gateway experiencing minor routing delays in north region. Smart Routing automatically utilizing Bharti Airtel gateway for queued SMS transactions.
                      </p>
                    </div>

                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* CREATOR TAB */}
        {activeTab === 'creator' && (
          <div className={styles.launcherContainer}>
            {/* Top Baseline DLT Templates Picker */}
            <Card padding="md" variant="bordered" style={{ marginBottom: 'var(--space-4)' }}>
              <CardHeader title="Pick Approved DLT SMS Template" subtitle="Select standard template to bypass regulatory checks instantly" />
              <CardBody>
                <div className={styles.templateGrid}>
                  {Object.entries(SMS_TEMPLATES).map(([key, value]) => (
                    <button type="button"
                      key={key}
                      onClick={() => handleSelectTemplate(key)}
                      className={`${styles.templateBtn} ${activeTemplateKey === key ? styles.templateBtnActive : ''}`}
                    >
                      <h4>{value.name}</h4>
                      <p>{value.description}</p>
                    </button>
                  ))}
                </div>
              </CardBody>
            </Card>

            <div className={styles.launcherColumns}>
              {/* Form Input Column */}
              <div className={styles.chartColLeft}>
                <Card padding="lg" variant="default">
                  <CardHeader title="Compose Smart SMS Campaign" subtitle="Define campaign parameters and merge variables" />
                  <CardBody>
                    <form onSubmit={handleSendNow} className={styles.launcherForm}>
                      <div className={styles.formRow}>
                        <label className={styles.formLabel}>
                          <span>Internal Campaign Descriptor</span>
                          <input
                            type="text"
                            required
                            placeholder="e.g. B.Tech Seat Payment Reminder"
                            value={campaignName}
                            onChange={(e) => setCampaignName(e.target.value)}
                            className={styles.formInput}
                          />
                        </label>

                        <label className={styles.formLabel}>
                          <span>DLT Sender ID (6-char)</span>
                          <select
                            value={senderId}
                            onChange={(e) => setSenderId(e.target.value)}
                            className={styles.formSelect}
                          >
                            <option value="CLGOSN">CLGOSN (General Transactional)</option>
                            <option value="ADMISS">ADMISS (Admissions Desk)</option>
                            <option value="STUACN">STUACN (Student Accounts)</option>
                          </select>
                        </label>
                      </div>

                      <div className={styles.formRow}>
                        <label className={styles.formLabel}>
                          <span>Destination Segment List</span>
                          <select
                            value={cohortSelect}
                            onChange={(e) => setCohortSelect(e.target.value)}
                            className={styles.formSelect}
                          >
                            {SMS_COHORTS.map((c) => (
                              <option key={c.name} value={c.name}>
                                {c.name} ({c.count.toLocaleString()} students)
                              </option>
                            ))}
                          </select>
                        </label>

                        <div className={styles.formLabel}>
                          <span>Inject Dynamic Tags</span>
                          <div className={styles.tagsWrapper}>
                            <button type="button" onClick={() => handleInjectTag('{first_name}')} className={styles.tagInjectBtn}>
                              First Name
                            </button>
                            <button type="button" onClick={() => handleInjectTag('{booking_link}')} className={styles.tagInjectBtn}>
                              Booking URL
                            </button>
                            <button type="button" onClick={() => handleInjectTag('{due_date}')} className={styles.tagInjectBtn}>
                              Due Date
                            </button>
                            <button type="button" onClick={() => handleInjectTag('{portal_link}')} className={styles.tagInjectBtn}>
                              Portal URL
                            </button>
                            <button type="button" onClick={() => handleInjectTag('{payment_link}')} className={styles.tagInjectBtn}>
                              Payment URL
                            </button>
                          </div>
                        </div>
                      </div>

                      <label className={styles.formLabel}>
                        <span>SMS Campaign Copy (DLT Registered Format)</span>
                        <textarea
                          ref={textareaRef}
                          required
                          rows={6}
                          value={smsBody}
                          onChange={(e) => setSmsBody(e.target.value)}
                          placeholder="Compose SMS text copy..."
                          className={styles.formTextarea}
                        />
                      </label>

                      {/* Character and Segments display */}
                      <div className={styles.counterFooter}>
                        <span>
                          Characters: <strong>{smsMetrics.length}</strong> / 160 (Standard)
                        </span>
                        <span>
                          SMS Parts: <strong className={smsMetrics.parts > 1 ? styles.counterAlert : ''}>{smsMetrics.parts} segment{smsMetrics.parts > 1 ? 's' : ''}</strong>
                        </span>
                        <span>
                          Estimated Cost: <strong>Rs {(smsMetrics.estCost).toFixed(2)}</strong> ({smsMetrics.volume} students @ Rs 0.15)
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
                        <Button
                          variant="gold"
                          type="submit"
                          icon={<Send size={14} />}
                        >
                          Send SMS Broadcast
                        </Button>
                        <Button
                          variant="secondary"
                          type="button"
                          icon={<Calendar size={14} />}
                          onClick={handleOpenScheduleModal}
                        >
                          Schedule SMS
                        </Button>
                      </div>
                    </form>
                  </CardBody>
                </Card>
              </div>

              {/* Real-time Cellphone Mockup Column */}
              <div className={styles.chartColRight}>
                <Card padding="md" variant="bordered" className={styles.previewSidebarCard}>
                  <CardHeader title="SMS Live Phone Preview" subtitle="Simulated SMS layout rendering on recipient handset" />
                  <CardBody className={styles.phoneMockWrapper}>
                    
                    <div className={styles.phoneChassis}>
                      <div className={styles.phoneNotch}>
                        <div className={styles.phoneSpeaker} />
                      </div>
                      
                      <div className={styles.phoneScreen}>
                        <div className={styles.phoneStatusBar}>
                          <span>10:42 AM</span>
                          <span>LTE 🔋 98%</span>
                        </div>

                        <div className={styles.phoneHeader}>
                          <div className={styles.phoneAvatar}>
                            {senderId.substring(0, 2)}
                          </div>
                          <span className={styles.phoneSenderId}>{senderId}</span>
                          <span className={styles.phoneNetworkStatus}>● Verified Transactional</span>
                        </div>

                        <div className={styles.phoneChatContainer}>
                          <div className={styles.smsBubble}>
                            {substitutedSmsPreview || '(Enter SMS body text in composer to preview)'}
                            <span className={styles.smsBubbleTime}>Admissions 10:42 AM</span>
                          </div>
                        </div>

                        <div className={styles.phoneInputMock}>
                          <div className={styles.phoneInputBox}>Text Message</div>
                          <div className={styles.phoneSendBtnMock}>
                            <ArrowRight size={10} />
                          </div>
                        </div>
                      </div>
                    </div>

                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Scheduler Modal */}
      {showScheduleModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Schedule SMS Broadcast</h3>
            <p className={styles.modalDesc}>Specify target launch date and localized carrier dispatch window.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <label className={styles.formLabel}>
                <span>Select Target Send Date</span>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className={styles.formInput}
                />
              </label>

              <label className={styles.formLabel}>
                <span>Select Time (24h)</span>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className={styles.formInput}
                />
              </label>
            </div>

            <div className={styles.modalFooter}>
              <Button variant="ghost" onClick={() => setShowScheduleModal(false)}>
                Cancel
              </Button>
              <Button variant="gold" icon={<Clock size={14} />} onClick={handleConfirmSchedule}>
                Queue Broadcast
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
