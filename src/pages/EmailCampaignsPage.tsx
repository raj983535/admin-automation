import { useState, useMemo } from 'react';
import { PageContainer, ModulePageHeader } from '../layouts';
import { Card, CardBody, CardHeader, Button, StageChip } from '../components/ui';
import { useNotifications } from '../contexts/NotificationContext';
import {
  Mail,
  Send,
  Calendar,
  Users,
  Plus,
  Clock,
  CheckCircle,
  TrendingUp,
  BarChart3,
  AlertCircle,
} from 'lucide-react';
import styles from './EmailCampaignsPage.module.css';

interface EmailTemplate {
  name: string;
  description: string;
  subject: string;
  body: string;
}

const TEMPLATES: Record<string, EmailTemplate> = {
  admission_confirmation: {
    name: 'Admission Confirmation',
    description: 'Send formal approval congratulations and next enrollment steps.',
    subject: 'Welcome to CollegeOS University! Admission Approved',
    body: 'Hi {first_name},\n\nWe are thrilled to inform you that your application to CollegeOS University has been formally approved for the upcoming Fall 2026 term! \n\nOur admissions panel was incredibly impressed by your academic record and passion. To reserve your seat, please review the attached enrollment booklet and submit your tuition deposit by next Friday.\n\nWe cannot wait to see you on campus!\n\nWarm regards,\nOffice of Admissions',
  },
  document_reminder: {
    name: 'Document Reminders',
    description: 'Remind applicants about pending transcript or signature files.',
    subject: 'Action Required: Missing Admission Documents',
    body: 'Dear {first_name},\n\nThank you for submitting your application to CollegeOS University. \n\nUpon reviewing your student profile, our counselors noted that your High School Transcripts are currently missing. To prevent any processing delays, please upload your official transcripts as a PDF as soon as possible.\n\nLet us know if you have any questions.\n\nBest,\nRegistrar Office',
  },
  event_invitation: {
    name: 'Event Invitation',
    description: 'Invite candidates to the campus open house, webinar, or Q&A.',
    subject: 'Invitation: CollegeOS Campus Open House & Lab Tour',
    body: 'Hello {first_name},\n\nReady to experience college life first-hand? Join us this Saturday at 10:00 AM for our Fall Campus Open House!\n\nWhat to expect:\n- Interactive tour of our state-of-the-art labs\n- Q&A panel with current students and faculty\n- One-on-one financial aid counseling\n\nSeats are filling up quickly. Click the link below to RSVP and secure your lunch pass!\n\nSee you there,\nEvents Cohort team',
  },
  fee_reminder: {
    name: 'Fee Reminders',
    description: 'Nudge candidates to complete registration deposit payments.',
    subject: 'Urgent: Admission Registration Deposit Overdue',
    body: 'Dear {first_name},\n\nThis is a friendly reminder that the seat reservation deposit for your enrollment is due. \n\nTo lock in your scholarship packages and finalize your freshman orientation schedule, please log into your Student Portal and complete the payment under the Billing tab.\n\nIf you have already paid, please ignore this notice.\n\nSincerely,\nStudent Accounts Office',
  },
};

interface Campaign {
  id: string;
  name: string;
  subject: string;
  cohort: string;
  sentCount: number;
  openRate: number;
  clickRate: number;
  status: 'Sent' | 'Scheduled' | 'Draft';
  date: string;
}

const INITIAL_CAMPAIGNS: Campaign[] = [
  { id: 'ec-1', name: 'Engineering Admissions Welcome Blast', subject: 'Welcome to CollegeOS University! Admission Approved', cohort: 'B.Tech Admitted List', sentCount: 1520, openRate: 68.4, clickRate: 42.1, status: 'Sent', date: '2026-05-18' },
  { id: 'ec-2', name: 'Scholarship RSVP Nudge', subject: 'Invitation: CollegeOS Campus Open House & Lab Tour', cohort: 'Inquiry Cohort', sentCount: 840, openRate: 52.1, clickRate: 18.9, status: 'Sent', date: '2026-05-20' },
  { id: 'ec-3', name: 'Overdue Transcripts Alert', subject: 'Action Required: Missing Admission Documents', cohort: 'Incomplete Dossiers', sentCount: 180, openRate: 0, clickRate: 0, status: 'Scheduled', date: '2026-05-25' },
];

export function EmailCampaignsPage() {
  const { notify } = useNotifications();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'creator' | 'audiences'>('dashboard');
  
  // Database States
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [activeTemplateKey, setActiveTemplateKey] = useState<string>('admission_confirmation');

  // Creator Form Values
  const [campaignNameInput, setCampaignNameInput] = useState('');
  const [subjectInput, setSubjectInput] = useState(TEMPLATES.admission_confirmation.subject);
  const [bodyInput, setBodyInput] = useState(TEMPLATES.admission_confirmation.body);
  const [cohortSelect, setCohortSelect] = useState('B.Tech Admitted List');

  // Scheduling Modal States
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('2026-05-22');
  const [scheduleTime, setScheduleTime] = useState('10:00');

  // Pre-configured cohorts list
  const cohorts = [
    { name: 'B.Tech Admitted List', count: 1520, description: 'Students whose engineering admissions applications are formally approved.' },
    { name: 'Inquiry Cohort', count: 4850, description: 'Potential applicants who submitted web inquiries.' },
    { name: 'Incomplete Dossiers', count: 240, description: 'Candidates with submitted applications missing key documents.' },
    { name: 'Scholarship Applicants', count: 680, description: 'Candidates seeking need-based or merit financial aid.' },
  ];

  // Handle template selection
  const handleSelectTemplate = (key: string) => {
    setActiveTemplateKey(key);
    setSubjectInput(TEMPLATES[key].subject);
    setBodyInput(TEMPLATES[key].body);
    notify({
      type: 'info',
      title: 'Template Loaded',
      message: `Populated subject and body with "${TEMPLATES[key].name}" layout.`,
      duration: 1500,
    });
  };

  // Launch Campaign (Send Now)
  const handleSendNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignNameInput.trim()) {
      notify({ type: 'error', title: 'Campaign Name Required', message: 'Please enter an descriptive name for this email campaign.' });
      return;
    }

    const cohortData = cohorts.find(c => c.name === cohortSelect);
    const count = cohortData ? cohortData.count : 500;

    const newCampaign: Campaign = {
      id: `ec-${Date.now()}`,
      name: campaignNameInput.trim(),
      subject: subjectInput.trim(),
      cohort: cohortSelect,
      sentCount: count,
      openRate: 0,
      clickRate: 0,
      status: 'Sent',
      date: new Date().toISOString().split('T')[0],
    };

    setCampaigns(prev => [newCampaign, ...prev]);
    notify({
      type: 'success',
      title: 'Email Campaign Dispatched!',
      message: `"${newCampaign.name}" broadcasted to ${newCampaign.sentCount.toLocaleString()} candidates.`,
    });

    // Reset Form & Switch Tab
    setCampaignNameInput('');
    setActiveTab('dashboard');
  };

  // Schedule Campaign (Open modal first)
  const handleOpenScheduleModal = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!campaignNameInput.trim()) {
      notify({ type: 'error', title: 'Campaign Name Required', message: 'Please enter an descriptive name before scheduling.' });
      return;
    }
    setShowScheduleModal(true);
  };

  // Confirm schedule
  const handleConfirmSchedule = () => {
    const cohortData = cohorts.find(c => c.name === cohortSelect);
    const count = cohortData ? cohortData.count : 500;

    const newCampaign: Campaign = {
      id: `ec-${Date.now()}`,
      name: campaignNameInput.trim(),
      subject: subjectInput.trim(),
      cohort: cohortSelect,
      sentCount: count,
      openRate: 0,
      clickRate: 0,
      status: 'Scheduled',
      date: `${scheduleDate} ${scheduleTime}`,
    };

    setCampaigns(prev => [newCampaign, ...prev]);
    setShowScheduleModal(false);
    setCampaignNameInput('');
    setActiveTab('dashboard');

    notify({
      type: 'success',
      title: 'Email Scheduled',
      message: `"${newCampaign.name}" is scheduled for delivery on ${newCampaign.date}.`,
    });
  };

  // Dynamic Preview Rendering
  const renderedPreviewBody = useMemo(() => {
    return bodyInput
      .replace(/{first_name}/g, 'Aditya')
      .replace(/\n/g, '<br/>');
  }, [bodyInput]);

  return (
    <PageContainer breadcrumbs={[{ label: 'Marketing' }, { label: 'Email Campaigns' }]}>
      <ModulePageHeader
        title="Email Campaigns"
        subtitle="Create, schedule, and measure admission email cohorts tied to your CRM lists."
      />
      <nav className="ml-tabs">
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`ml-tab ${activeTab === 'dashboard' ? 'ml-tab-active' : ''}`}
        >
          <BarChart3 size={16} />
          <span>Dashboard Overview</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('creator')}
          className={`ml-tab ${activeTab === 'creator' ? 'ml-tab-active' : ''}`}
        >
          <Mail size={16} />
          <span>Campaign Creator</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('audiences')}
          className={`ml-tab ${activeTab === 'audiences' ? 'ml-tab-active' : ''}`}
        >
          <Users size={16} />
          <span>Audience Cohorts</span>
        </button>
      </nav>

      {/* Main Tab Area */}
      <div className={`ml-tab-panel ${styles.tabContent}`}>
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className={styles.dashboardContainer}>
            <div className={styles.statsGrid}>
              <Card padding="md" variant="default" className={styles.statBox}>
                <div className={styles.statHeader}>
                  <span>Average Open Rate</span>
                  <CheckCircle size={16} className={styles.greenText} />
                </div>
                <h3>60.2%</h3>
                <p>Industry baseline benchmark: 22.4%</p>
              </Card>

              <Card padding="md" variant="default" className={styles.statBox}>
                <div className={styles.statHeader}>
                  <span>Average Click Rate</span>
                  <TrendingUp size={16} className={styles.goldText} />
                </div>
                <h3>30.5%</h3>
                <p>Link click conversion across emails</p>
              </Card>

              <Card padding="md" variant="default" className={styles.statBox}>
                <div className={styles.statHeader}>
                  <span>Active Subscribers</span>
                  <Users size={16} className={styles.blueText} />
                </div>
                <h3>7,290</h3>
                <p>Across 4 synchronized CRM lists</p>
              </Card>

              <Card padding="md" variant="default" className={styles.statBox}>
                <div className={styles.statHeader}>
                  <span>Delivery Success</span>
                  <Mail size={16} className={styles.orangeText} />
                </div>
                <h3>99.8%</h3>
                <p>Hard/Soft bounces under 0.2%</p>
              </Card>
            </div>

            <div className={styles.dashboardLayoutSplit}>
              {/* Previous Campaigns table */}
              <div className={styles.chartColLeft}>
                <Card padding="md" variant="default">
                  <CardHeader title="Synchronized Campaigns Directory" subtitle="Review tracking statistics and open rate outcomes" />
                  <CardBody>
                    <table className={styles.recentCampaignsTable}>
                      <thead>
                        <tr>
                          <th>Campaign Title</th>
                          <th>Target List</th>
                          <th>Recipient Volume</th>
                          <th>Open Rate</th>
                          <th>Click Rate</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {campaigns.map((c) => (
                          <tr key={c.id}>
                            <td>
                              <strong>{c.name}</strong>
                              <p style={{ fontSize: '10px', color: 'var(--color-text-secondary)', margin: 0 }}>Subject: {c.subject}</p>
                            </td>
                            <td>{c.cohort}</td>
                            <td>{c.sentCount.toLocaleString()}</td>
                            <td>{c.status === 'Sent' ? `${c.openRate}%` : '—'}</td>
                            <td>{c.status === 'Sent' ? `${c.clickRate}%` : '—'}</td>
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

              {/* Delivery stats and optimizations advice */}
              <div className={styles.chartColRight}>
                <Card padding="md" variant="bordered">
                  <CardHeader title="AI Send Optimization Advice" subtitle="Calculated optimal engagement window parameters" />
                  <CardBody className={styles.gaugeContainer}>
                    <div className={styles.progressRow}>
                      <div className={styles.progressLabel}>
                        <span>Best Day: <strong>Thursday Blast</strong></span>
                        <strong>High Open Rate</strong>
                      </div>
                      <div className={styles.progressBarBg}>
                        <div className={styles.progressBarFill} style={{ width: '85%' }}></div>
                      </div>
                    </div>

                    <div className={styles.progressRow}>
                      <div className={styles.progressLabel}>
                        <span>Best Hour: <strong>10:00 AM - 11:30 AM</strong></span>
                        <strong>Maximum Click conversion</strong>
                      </div>
                      <div className={styles.progressBarBg}>
                        <div className={styles.progressBarFill} style={{ width: '92%', background: '#c4a574' }}></div>
                      </div>
                    </div>

                    <div style={{ marginTop: 'var(--space-2)', borderTop: '1px solid var(--color-border-subtle)', paddingTop: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
                      <div style={{ display: 'flex', gap: '8px', color: 'var(--stage-orange-text)', fontWeight: 'bold', marginBottom: '4px' }}>
                        <AlertCircle size={14} /> Optimization Tips:
                      </div>
                      <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.4' }}>
                        Emails sent to <strong>Incomplete Dossiers</strong> cohort achieve a 40% higher recovery rate when sent on Tuesday afternoons with subject lines emphasizing deadline thresholds.
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
            {/* Top preset templates selector */}
            <Card padding="md" variant="bordered" style={{ marginBottom: 'var(--space-4)' }}>
              <CardHeader title="Pick Baseline Admissions Layout" subtitle="Select to populate variables instantly" />
              <CardBody>
                <div className={styles.templateGrid}>
                  {Object.entries(TEMPLATES).map(([key, value]) => (
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
              {/* Campaign Inputs */}
              <div className={styles.chartColLeft}>
                <Card padding="lg" variant="default">
                  <CardHeader title="Draft Dynamic Campaign" subtitle="Insert custom tags and destination URL criteria" />
                  <CardBody>
                    <form onSubmit={handleSendNow} className={styles.launcherForm}>
                      <div className={styles.formRow}>
                        <label className={styles.formLabel}>
                          <span>Internal Campaign Descriptor</span>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Engineering Welcome Notification — Batch A"
                            value={campaignNameInput}
                            onChange={(e) => setCampaignNameInput(e.target.value)}
                            className={styles.formInput}
                          />
                        </label>

                        <label className={styles.formLabel}>
                          <span>Target List Cohort</span>
                          <select
                            value={cohortSelect}
                            onChange={(e) => setCohortSelect(e.target.value)}
                            className={styles.formSelect}
                          >
                            {cohorts.map((c) => (
                              <option key={c.name} value={c.name}>
                                {c.name} ({c.count.toLocaleString()} students)
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>

                      <label className={styles.formLabel}>
                        <span>Subject Line</span>
                        <input
                          type="text"
                          required
                          value={subjectInput}
                          onChange={(e) => setSubjectInput(e.target.value)}
                          placeholder="Welcome to our college..."
                          className={styles.formInput}
                        />
                      </label>

                      <label className={styles.formLabel}>
                        <span>Email HTML/Text Body (use tag: `&#123;first_name&#125;` for student first names)</span>
                        <textarea
                          required
                          rows={10}
                          value={bodyInput}
                          onChange={(e) => setBodyInput(e.target.value)}
                          placeholder="Dear applicant..."
                          className={styles.formTextarea}
                        />
                      </label>

                      <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                        <Button
                          variant="gold"
                          type="submit"
                          icon={<Send size={14} />}
                        >
                          Send Broadcast Now
                        </Button>
                        <Button
                          variant="secondary"
                          type="button"
                          icon={<Calendar size={14} />}
                          onClick={handleOpenScheduleModal}
                        >
                          Schedule Campaign
                        </Button>
                      </div>
                    </form>
                  </CardBody>
                </Card>
              </div>

              {/* Real-time preview */}
              <div className={styles.chartColRight}>
                <Card padding="md" variant="bordered" className={styles.previewSidebarCard}>
                  <CardHeader title="Real-Time Desktop Live Preview" subtitle="See how {first_name} variables populate dynamically" />
                  <CardBody>
                    <div className={styles.emailMockPreview}>
                      <div className={styles.emailHeaderBar}>
                        <div className={styles.emailHeaderRow}>
                          <strong>From:</strong> <span>Office of Admissions &lt;admissions@collegeos.edu&gt;</span>
                        </div>
                        <div className={styles.emailHeaderRow}>
                          <strong>To:</strong> <span>Aditya Sen &lt;aditya.sen@gmail.com&gt;</span>
                        </div>
                        <div className={styles.emailSubjectLine}>
                          Subject: {subjectInput || '(No Subject Line Written)'}
                        </div>
                      </div>

                      <div className={styles.emailContentBody}>
                        <div className={styles.emailBannerMock}>
                          CollegeOS University
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: renderedPreviewBody || 'Type in body editor to preview...' }} />
                        <div className={styles.emailSignOffMock}>
                          Disclaimer: You are receiving this official enrollment email because you submitted an inquiry or application to CollegeOS.
                          <br />
                          124 University Parkway, Suite 500.
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* AUDIENCES TAB */}
        {activeTab === 'audiences' && (
          <div className={styles.launcherContainer}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <div>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', color: 'var(--color-brown-dark)' }}>Student Segments Database</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: '2px 0 0' }}>Manage lists synced directly from CRM inquiry pipelines</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                icon={<Plus size={14} />}
                onClick={() => notify({ type: 'info', title: 'New List Creator', message: 'Redirecting to CRM segments builder console...' })}
              >
                Create Static List
              </Button>
            </div>

            <div className={styles.cohortList}>
              {cohorts.map((c) => (
                <div key={c.name} className={styles.cohortRowItem}>
                  <div className={styles.cohortMeta}>
                    <strong>{c.name}</strong>
                    <p>{c.description}</p>
                  </div>
                  <div className={styles.cohortCountTag}>
                    {c.count.toLocaleString()} Subscriber{c.count > 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Scheduler Modal */}
      {showScheduleModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Schedule Delivery</h3>
            <p className={styles.modalDesc}>Select preferred delivery date and localized timezone hour.</p>

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
                Confirm Broadcast Schedule
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
