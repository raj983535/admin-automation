import { useState } from 'react';
import { PageContainer, ModulePageHeader } from '../layouts';
import { Card, CardBody, CardHeader, Button, StageChip } from '../components/ui';
import { useNotifications } from '../contexts/NotificationContext';
import {
  ShieldCheck,
  Plus,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import styles from './WabaPage.module.css';

interface WabaTemplate {
  id: string;
  name: string;
  category: 'Marketing' | 'Utility' | 'Authentication';
  language: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  text: string;
}

const INITIAL_TEMPLATES: WabaTemplate[] = [
  { id: 'wt-1', name: 'admission_orientation_welcome', category: 'Marketing', language: 'English (US)', status: 'Approved', text: 'Welcome to CollegeOS, {1}! Your orientation checklist guide is available at {2}.' },
  { id: 'wt-2', name: 'document_submission_alert', category: 'Utility', language: 'English (US)', status: 'Approved', text: 'Hi {1}, your transcripts verification is pending. Upload PDF to {2} to proceed.' },
  { id: 'wt-3', name: 'tuition_deposit_warning', category: 'Utility', language: 'English (US)', status: 'Approved', text: 'URGENT: Seat registration fee deposit of INR {1} is due by {2}. Pay via {3}.' },
  { id: 'wt-4', name: 'counselor_appointment_confirmation', category: 'Utility', language: 'English (US)', status: 'Approved', text: 'Hi {1}, your query counselor call session is scheduled with {2} at {3}.' },
];

export function WabaPage() {
  const { notify } = useNotifications();
  const [templates, setTemplates] = useState<WabaTemplate[]>(INITIAL_TEMPLATES);
  const [showModal, setShowModal] = useState(false);

  // Form Fields
  const [templateName, setTemplateName] = useState('');
  const [templateCat, setTemplateCat] = useState<'Marketing' | 'Utility'>('Utility');
  const [templateLang, setTemplateLang] = useState('English (US)');
  const [templateText, setTemplateText] = useState('');

  // Cost Stats
  const costMetrics = {
    totalConversations: 2520,
    userInitiated: 1680,
    businessInitiated: 840,
    userCost: 4850, // simulated cost mapping in INR
    businessCost: 7920,
  };

  // Submit Template simulated flow
  const handleSubmitTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName.trim() || !templateText.trim()) return;

    // Normalize name to lowercase snake case
    const normalizedName = templateName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '_');

    const newTemplate: WabaTemplate = {
      id: `wt-${Date.now()}`,
      name: normalizedName,
      category: templateCat,
      language: templateLang,
      status: 'Pending',
      text: templateText,
    };

    setTemplates((prev) => [newTemplate, ...prev]);
    setShowModal(false);
    
    // Reset Form fields
    setTemplateName('');
    setTemplateText('');

    notify({
      type: 'info',
      title: 'Template Submitted',
      message: `"${normalizedName}" sent to Meta automated checking engine. Status: Pending.`,
    });

    // Simulating Meta's automated template check and approval!
    setTimeout(() => {
      setTemplates((current) =>
        current.map((t) => (t.id === newTemplate.id ? { ...t, status: 'Approved' } : t))
      );

      notify({
        type: 'success',
        title: 'Meta Approved Template!',
        message: `Template "${normalizedName}" has been successfully approved and is ready to send.`,
        duration: 4000,
      });
    }, 4000);
  };

  return (
    <PageContainer breadcrumbs={[{ label: 'Marketing' }, { label: 'WABA API Portal' }]}>
      <ModulePageHeader
        title="WABA API Portal"
        subtitle="Manage WhatsApp Business API templates, verification, and conversation billing."
      />
      <div className={styles.dashboardGrid}>
        {/* Verification Status Card */}
        <Card padding="md" variant="default" className={styles.statusCard}>
          <CardHeader
            title="Meta Business Status Credentials"
            subtitle="Verified official corporate WABA identifiers"
          />
          <CardBody className={styles.metadataList}>
            <div className={styles.metaItem}>
              <span>WABA Status</span>
              <strong style={{ color: 'var(--stage-green-text)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={14} /> Verified Business (Green Tick)
              </strong>
            </div>

            <div className={styles.metaItem}>
              <span>Messaging Limit Tier</span>
              <strong>Tier 3 (100,000 unique candidates / 24h)</strong>
            </div>

            <div className={styles.metaItem}>
              <span>WABA Phone Number ID</span>
              <strong>phone_id_9901428573</strong>
            </div>

            <div className={styles.metaItem}>
              <span>WhatsApp Business Account ID</span>
              <strong>waba_acc_55021948301</strong>
            </div>
          </CardBody>
        </Card>

        {/* API Health monitoring Widget */}
        <Card padding="md" variant="default" className={styles.statusCard}>
          <CardHeader
            title="API Uptime & Webhook Status"
            subtitle="Real-time meta cloud network performance logs"
          />
          <CardBody className={styles.apiHealthBox}>
            <div className={styles.healthRow}>
              <div className={styles.healthLabel}>
                <div className={styles.dotGreen} />
                <span>Meta API Server Connect</span>
              </div>
              <div className={styles.healthValue}>Connected (99.98% Uptime)</div>
            </div>

            <div className={styles.healthRow}>
              <div className={styles.healthLabel}>
                <div className={styles.dotGreen} />
                <span>Webhooks Handshake Status</span>
              </div>
              <div className={styles.healthValue}>Listening on port :443</div>
            </div>

            <div className={styles.healthRow}>
              <div className={styles.healthLabel}>
                <div className={styles.dotBlue} />
                <span>Average API Response Latency</span>
              </div>
              <div className={styles.healthValue}>84ms (Excellent)</div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Cost Splitting Analytics */}
      <div className={styles.dashboardGrid}>
        <Card padding="md" variant="default">
          <CardHeader title="Conversational Cost Split Reports" subtitle="Monthly tracking metrics based on Meta conversation categories" />
          <CardBody>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: 'var(--space-2)' }}>
              <span>Total Conversations (Billing Period)</span>
              <strong>{costMetrics.totalConversations} Sessions</strong>
            </div>

            <div className={styles.costSplitRow}>
              <div className={styles.costCol}>
                <span>User-Initiated (Utility Support)</span>
                <h4>{costMetrics.userInitiated} sessions</h4>
                <p style={{ margin: '4px 0 0', fontSize: '12px', fontWeight: 'bold', color: 'var(--stage-blue-text)' }}>
                  Cost: ₹{costMetrics.userCost.toLocaleString('en-IN')}
                </p>
              </div>

              <div className={styles.costCol}>
                <span>Business-Initiated (Marketing templates)</span>
                <h4>{costMetrics.businessInitiated} sessions</h4>
                <p style={{ margin: '4px 0 0', fontSize: '12px', fontWeight: 'bold', color: 'var(--stage-orange-text)' }}>
                  Cost: ₹{costMetrics.businessCost.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* AI Recommendations */}
        <Card padding="md" variant="bordered">
          <CardHeader title="Verified Template Best Practices" subtitle="Compliance requirements for quick Meta approval" />
          <CardBody>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
              <div style={{ display: 'flex', gap: '8px', color: 'var(--color-gold)', fontWeight: 'bold', marginBottom: '8px' }}>
                <Sparkles size={16} /> Compliance checklist:
              </div>
              <ul style={{ paddingLeft: 'var(--space-4)', margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                <li>Ensure variables are formatted as <code>&#123;1&#125;</code>, <code>&#123;2&#125;</code> and not text.</li>
                <li>Provide clear context for transactional triggers in the Utility category.</li>
                <li>Do not include promotional spam terms, otherwise the meta engine will auto-reject.</li>
              </ul>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Templates Board */}
      <Card padding="md" variant="default">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)' }}>
          <div>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', color: 'var(--color-brown-dark)' }}>Verified WABA Message Templates</h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: '2px 0 0' }}>Approved layouts registered with Meta for broadcast</p>
          </div>
          <Button
            variant="gold"
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => setShowModal(true)}
          >
            Register Message Template
          </Button>
        </div>

        <CardBody>
          <table className={styles.templateTable}>
            <thead>
              <tr>
                <th>Template API Identifier</th>
                <th>Category</th>
                <th>Language</th>
                <th>Template Message Body Layout</th>
                <th>Approval Status</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((t) => (
                <tr key={t.id}>
                  <td>
                    <code>{t.name}</code>
                  </td>
                  <td>
                    <StageChip
                      stage={t.category === 'Marketing' ? 'purple' : 'blue'}
                      label={t.category}
                    />
                  </td>
                  <td>{t.language}</td>
                  <td style={{ maxWidth: '350px', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                    {t.text}
                  </td>
                  <td>
                    <StageChip
                      stage={t.status === 'Approved' ? 'green' : t.status === 'Pending' ? 'yellow' : 'gray'}
                      label={t.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* Register Template Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <form onSubmit={handleSubmitTemplate} className={styles.modalContent}>
            <h3>Submit New WhatsApp Template</h3>
            <p className={styles.modalDesc}>Define layout variables for Meta approval compliance checks.</p>

            <div className={styles.modalForm}>
              <label className={styles.formLabel}>
                <span>Template Identifier Name (lowercase with underscores)</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. application_fee_successful"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className={styles.formInput}
                />
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <label className={styles.formLabel}>
                  <span>Message Category</span>
                  <select
                    value={templateCat}
                    onChange={(e) => setTemplateCat(e.target.value as any)}
                    className={styles.formSelect}
                  >
                    <option value="Utility">Utility (Transactional notices)</option>
                    <option value="Marketing">Marketing (Promotional notices)</option>
                  </select>
                </label>

                <label className={styles.formLabel}>
                  <span>Language Locale</span>
                  <select
                    value={templateLang}
                    onChange={(e) => setTemplateLang(e.target.value)}
                    className={styles.formSelect}
                  >
                    <option value="English (US)">English (US)</option>
                    <option value="Hindi (IN)">Hindi (IN)</option>
                  </select>
                </label>
              </div>

              <label className={styles.formLabel}>
                <span>Message Text Body (use curly braces numbers like: `&#123;1&#125;` for variables)</span>
                <textarea
                  required
                  rows={4}
                  placeholder="e.g. Hi {1}, your admissions interview slot has been booked for {2}."
                  value={templateText}
                  onChange={(e) => setTemplateText(e.target.value)}
                  className={styles.formTextarea}
                />
              </label>
            </div>

            <div className={styles.modalFooter}>
              <Button variant="ghost" onClick={() => setShowModal(false)} type="button">
                Cancel
              </Button>
              <Button variant="gold" type="submit" icon={<RefreshCw size={12} />}>
                Submit to Meta Engine
              </Button>
            </div>
          </form>
        </div>
      )}
    </PageContainer>
  );
}
