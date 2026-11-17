import { useState, useMemo } from 'react';
import { PageContainer, ModulePageHeader } from '../layouts';
import { Card, CardBody, CardHeader, Button, StageChip } from '../components/ui';
import { useNotifications } from '../hooks/useNotifications';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  Settings,
  Database,
  BarChart3,
  Sparkles,
  CheckCircle,
  CreditCard,
  Link,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
} from 'lucide-react';
import styles from './FormBuilderPage.module.css';

// Form field type definition
interface FormField {
  id: string;
  type:
    | 'text'
    | 'email'
    | 'number'
    | 'textarea'
    | 'dropdown'
    | 'radio'
    | 'file'
    | 'payment'
    | 'step_divider'
    | 'signature';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // for dropdown, radio
  paymentAmount?: number; // for payment field
  // Conditional logic: "Show this field IF field with id showIfFieldId is equal to showIfValue"
  showIfFieldId?: string;
  showIfValue?: string;
}

type FormValue = string | number | null;
type SubmissionRecord = Record<string, FormValue>;

// Initial templates
const TEMPLATES: Record<string, { name: string; description: string; fields: FormField[] }> = {
  admission_inquiry: {
    name: 'Admission Inquiry',
    description: 'Collect potential student queries, basic information, and program interests.',
    fields: [
      { id: 'f-name', type: 'text', label: 'Full Name', placeholder: 'Enter your full name', required: true },
      { id: 'f-email', type: 'email', label: 'Email Address', placeholder: 'name@example.com', required: true },
      { id: 'f-phone', type: 'text', label: 'Phone Number', placeholder: '+1 (555) 000-0000', required: true },
      { id: 'f-program', type: 'dropdown', label: 'Program of Interest', required: true, options: ['Computer Science', 'Business Administration', 'Mechanical Engineering', 'Nursing'] },
      { id: 'f-term', type: 'radio', label: 'Preferred Intake Term', required: true, options: ['Fall 2026', 'Spring 2027', 'Summer 2027'] },
      { id: 'f-comments', type: 'textarea', label: 'Questions or Comments', placeholder: 'Ask us anything...', required: false },
    ],
  },
  scholarship_form: {
    name: 'Scholarship Application',
    description: 'A detailed application including academic details, essay upload, and eligibility checks.',
    fields: [
      { id: 's-name', type: 'text', label: 'Applicant Name', placeholder: 'Enter your full name', required: true },
      { id: 's-email', type: 'email', label: 'Email Address', placeholder: 'name@example.com', required: true },
      { id: 's-gpa', type: 'number', label: 'Current GPA', placeholder: 'e.g. 3.85', required: true },
      { id: 's-need', type: 'radio', label: 'Are you applying for Need-Based Financial Aid?', required: true, options: ['Yes', 'No'] },
      // Conditional fields
      {
        id: 's-income',
        type: 'number',
        label: 'Annual Family Income (USD)',
        placeholder: 'e.g. 45000',
        required: true,
        showIfFieldId: 's-need',
        showIfValue: 'Yes',
      },
      { id: 's-divider', type: 'step_divider', label: 'Next Page: Supporting Documents', required: false },
      { id: 's-essay', type: 'textarea', label: 'Statement of Purpose (300 words)', placeholder: 'Why do you deserve this scholarship?', required: true },
      { id: 's-transcript', type: 'file', label: 'Upload High School Transcripts', required: true },
      { id: 's-signature', type: 'signature', label: 'Applicant Signature confirmation', required: true },
    ],
  },
  event_registration: {
    name: 'Campus Open House Registration',
    description: 'Event signup with guest count, workshop selections, and ticket payment.',
    fields: [
      { id: 'e-name', type: 'text', label: 'Attendee Name', placeholder: 'Enter your name', required: true },
      { id: 'e-email', type: 'email', label: 'Email Address', required: true },
      { id: 'e-guests', type: 'dropdown', label: 'Number of Guests', required: true, options: ['0', '1', '2', '3+'] },
      { id: 'e-workshop', type: 'radio', label: 'Select Morning Workshop Track', required: true, options: ['Campus Tour & Lab Demo', 'Admissions Q&A Panel', 'Financial Aid Masterclass'] },
      { id: 'e-fee', type: 'payment', label: 'Open House Ticket & Lunch Buffet Package', required: true, paymentAmount: 25 },
    ],
  },
  student_feedback: {
    name: 'Course & Instructor Feedback',
    description: 'Term-end feedback regarding teaching quality, materials, and support.',
    fields: [
      { id: 'fb-course', type: 'dropdown', label: 'Select Course', required: true, options: ['CS-101 Introduction to Programming', 'BUS-210 Marketing Principles', 'MAT-150 Calculus I'] },
      { id: 'fb-instructor', type: 'text', label: 'Instructor Name', placeholder: 'e.g. Dr. Sarah Jenkins', required: true },
      { id: 'fb-rating', type: 'radio', label: 'Overall Instruction Quality', required: true, options: ['Excellent', 'Good', 'Average', 'Poor'] },
      { id: 'fb-pace', type: 'radio', label: 'Course Pace Assessment', required: true, options: ['Too Fast', 'Just Right', 'Too Slow'] },
      { id: 'fb-comments', type: 'textarea', label: 'Elaborate on your feedback', placeholder: 'What went well? What could be improved?', required: false },
    ],
  },
};

export function FormBuilderPage() {
  const { notify } = useNotifications();
  const [activeTab, setActiveTab] = useState<'builder' | 'preview' | 'crm' | 'analytics'>('builder');
  const [fields, setFields] = useState<FormField[]>(TEMPLATES.admission_inquiry.fields);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(fields[0]?.id || null);
  const [formName, setFormName] = useState('Admission Inquiry');

  // Preview form values & state
  const [previewValues, setPreviewValues] = useState<Record<string, FormValue>>({});
  const [previewStepIndex, setPreviewStepIndex] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [submittingPreview, setSubmittingPreview] = useState(false);
  const [recentSubmissions, setRecentSubmissions] = useState<Array<{ id: string; date: string; data: SubmissionRecord }>>([
    { id: 'sub-1', date: '2026-05-21 11:30', data: { 'Full Name': 'Sahil Sharma', 'Email Address': 'sahil@gmail.com', 'Phone Number': '+91 9876543210', 'Program of Interest': 'Computer Science', 'Preferred Intake Term': 'Fall 2026' } },
    { id: 'sub-2', date: '2026-05-21 09:15', data: { 'Full Name': 'Ananya Iyer', 'Email Address': 'emma@oxford.edu', 'Phone Number': '+1 505 401 2231', 'Program of Interest': 'Business Administration', 'Preferred Intake Term': 'Spring 2027' } },
  ]);

  // CRM settings mapping
  const [crmMappings, setCrmMappings] = useState<Record<string, string>>({
    'f-name': 'lead_first_name',
    'f-email': 'lead_email',
    'f-phone': 'lead_phone_number',
    'f-program': 'custom_interest_program',
  });

  // Workflow trigger configs
  const [workflows, setWorkflows] = useState({
    sendAutoresponse: true,
    notifyAdmissions: true,
    addToFunnel: 'admissions-general',
    leadTag: 'Inquiry',
  });

  // Pre-load a template
  const handleLoadTemplate = (templateKey: keyof typeof TEMPLATES) => {
    const template = TEMPLATES[templateKey];
    setFields(template.fields);
    setFormName(template.name);
    setSelectedFieldId(template.fields[0]?.id || null);
    setPreviewValues({});
    setPreviewStepIndex(0);
    notify({
      type: 'success',
      title: 'Template Loaded',
      message: `Loaded template "${template.name}" successfully.`,
    });
  };

  // Add field to canvas
  const handleAddField = (type: FormField['type']) => {
    const newId = `field-${Date.now()}`;
    const newField: FormField = {
      id: newId,
      type,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      placeholder: type === 'text' || type === 'email' || type === 'number' || type === 'textarea' ? 'Enter value...' : undefined,
    };

    if (type === 'dropdown' || type === 'radio') {
      newField.options = ['Option 1', 'Option 2', 'Option 3'];
    }

    if (type === 'payment') {
      newField.paymentAmount = 50;
      newField.label = 'Application & Processing Fee';
    }

    setFields((prev) => [...prev, newField]);
    setSelectedFieldId(newId);
    notify({
      type: 'info',
      title: 'Field Added',
      message: `A new ${type} field has been added to the canvas.`,
    });
  };

  // Delete field from canvas
  const handleDeleteField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
    if (selectedFieldId === id) {
      setSelectedFieldId(null);
    }
  };

  // Move field order
  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= fields.length) return;

    setFields((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[newIndex];
      copy[newIndex] = temp;
      return copy;
    });
  };

  // Update selected field settings
  const handleUpdateField = (id: string, updates: Partial<FormField>) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const selectedField = useMemo(() => {
    return fields.find((f) => f.id === selectedFieldId) || null;
  }, [fields, selectedFieldId]);

  // Preview form pagination / step breakdown
  const previewPages = useMemo(() => {
    const pages: FormField[][] = [[]];
    let pageIdx = 0;
    fields.forEach((field) => {
      if (field.type === 'step_divider') {
        pageIdx++;
        pages[pageIdx] = [];
      } else {
        pages[pageIdx].push(field);
      }
    });
    return pages;
  }, [fields]);

  const activePageFields = useMemo(() => {
    return previewPages[previewStepIndex] || [];
  }, [previewPages, previewStepIndex]);

  // Determine if a field is visible based on conditional rules in preview
  const isFieldVisible = (field: FormField) => {
    if (!field.showIfFieldId) return true;
    const triggerValue = previewValues[field.showIfFieldId];
    return triggerValue === field.showIfValue;
  };

  // Preview submit handler
  const handlePreviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if there is a payment field visible
    const visibleFields = fields.filter((f) => isFieldVisible(f));
    const hasPayment = visibleFields.some((f) => f.type === 'payment');

    if (hasPayment) {
      setShowPaymentModal(true);
    } else {
      processFormSubmission();
    }
  };

  const processFormSubmission = () => {
    setSubmittingPreview(true);
    setTimeout(() => {
      // Create readable submission entry
      const submissionData: SubmissionRecord = {};
      fields.forEach((field) => {
        if (isFieldVisible(field) && field.type !== 'step_divider' && field.type !== 'payment') {
          submissionData[field.label] = previewValues[field.id] || '(Blank)';
        }
        if (field.type === 'payment' && isFieldVisible(field)) {
          submissionData[field.label] = `Paid ₹${field.paymentAmount} via Card`;
        }
      });

      const newSub = {
        id: `sub-${Date.now()}`,
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        data: submissionData,
      };

      setRecentSubmissions((prev) => [newSub, ...prev]);
      setSubmittingPreview(false);
      setShowPaymentModal(false);
      setPreviewValues({});
      setPreviewStepIndex(0);

      notify({
        type: 'success',
        title: 'Form Submitted Successfully',
        message: 'Your preview response has been registered and added to the analytics log.',
      });
    }, 1500);
  };

  // Render breadcrumbs
  const breadcrumbs = [
    { label: 'Builders', path: '/builders/website-builder' },
    { label: 'Form Builder' },
  ];

  return (
    <PageContainer breadcrumbs={breadcrumbs}>
      <ModulePageHeader
        title="Form Builder"
        subtitle="Design admission forms and publish embeddable flows."
      />
      <section className={styles.templatesPanel}>
        <div className={styles.sectionHeader}>
          <div className={styles.headingTitle}>
            <Sparkles size={16} className={styles.goldIcon} />
            <h2>Pre-built College Templates</h2>
          </div>
          <p>Quickly load a functional college administrative form as a baseline:</p>
        </div>
        <div className={styles.templateGrid}>
          {Object.entries(TEMPLATES).map(([key, t]) => (
            <button type="button"
              key={key}
              onClick={() => handleLoadTemplate(key)}
              className={`${styles.templateBtn} ${formName === t.name ? styles.templateBtnActive : ''}`}
            >
              <h4>{t.name}</h4>
              <p>{t.description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Tabs Menu */}
      <nav className="ml-tabs">
        <button type="button"
          onClick={() => setActiveTab('builder')}
          className={`ml-tab ${activeTab === 'builder' ? 'ml-tab-active' : ''}`}
        >
          <Settings size={16} />
          <span>Form Canvas Builder</span>
        </button>
        <button type="button"
          onClick={() => setActiveTab('preview')}
          className={`ml-tab ${activeTab === 'preview' ? 'ml-tab-active' : ''}`}
        >
          <Eye size={16} />
          <span>Interactive Preview</span>
        </button>
        <button type="button"
          onClick={() => setActiveTab('crm')}
          className={`ml-tab ${activeTab === 'crm' ? 'ml-tab-active' : ''}`}
        >
          <Database size={16} />
          <span>CRM & Workflow Triggers</span>
        </button>
        <button type="button"
          onClick={() => setActiveTab('analytics')}
          className={`ml-tab ${activeTab === 'analytics' ? 'ml-tab-active' : ''}`}
        >
          <BarChart3 size={16} />
          <span>Submissions & Analytics</span>
        </button>
      </nav>

      {/* Main Tab Area */}
      <div className={`ml-tab-panel ${styles.tabContent}`}>
        {activeTab === 'builder' && (
          <div className={styles.builderLayout}>
            {/* Left Toolbar */}
            <div className={styles.toolbar}>
              <Card padding="md" variant="bordered">
                <CardHeader title="Add Form Fields" subtitle="Click to place on the canvas" />
                <CardBody className={styles.toolbarButtons}>
                  <Button variant="secondary" size="sm" icon={<Plus size={14} />} onClick={() => handleAddField('text')}>
                    Text Input
                  </Button>
                  <Button variant="secondary" size="sm" icon={<Plus size={14} />} onClick={() => handleAddField('email')}>
                    Email Input
                  </Button>
                  <Button variant="secondary" size="sm" icon={<Plus size={14} />} onClick={() => handleAddField('number')}>
                    Number Input
                  </Button>
                  <Button variant="secondary" size="sm" icon={<Plus size={14} />} onClick={() => handleAddField('textarea')}>
                    Text Area
                  </Button>
                  <Button variant="secondary" size="sm" icon={<Plus size={14} />} onClick={() => handleAddField('dropdown')}>
                    Dropdown List
                  </Button>
                  <Button variant="secondary" size="sm" icon={<Plus size={14} />} onClick={() => handleAddField('radio')}>
                    Radio Options
                  </Button>
                  <Button variant="secondary" size="sm" icon={<Plus size={14} />} onClick={() => handleAddField('file')}>
                    File Upload
                  </Button>
                  <Button variant="secondary" size="sm" icon={<Plus size={14} />} onClick={() => handleAddField('payment')}>
                    Payment Gateway
                  </Button>
                  <Button variant="secondary" size="sm" icon={<Plus size={14} />} onClick={() => handleAddField('step_divider')}>
                    Step Divider
                  </Button>
                  <Button variant="secondary" size="sm" icon={<Plus size={14} />} onClick={() => handleAddField('signature')}>
                    Digital Signature
                  </Button>
                </CardBody>
              </Card>
            </div>

            {/* Canvas */}
            <div className={styles.canvasContainer}>
              <Card padding="md" variant="default" className={styles.canvasCard}>
                <div className={styles.canvasHeader}>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className={styles.formNameInput}
                    placeholder="Enter form title..."
                  />
                  <StageChip stage="blue" label="Draft mode" />
                </div>
                <div className={styles.canvasBody}>
                  {fields.length === 0 ? (
                    <div className={styles.emptyCanvas}>
                      <p>Your form has no fields yet. Click fields in the sidebar to build your form!</p>
                    </div>
                  ) : (
                    fields.map((field, idx) => {
                      const isSelected = field.id === selectedFieldId;
                      return (
                        <div
                          key={field.id}
                          className={`${styles.canvasFieldRow} ${isSelected ? styles.canvasFieldRowSelected : ''}`}
                          onClick={() => setSelectedFieldId(field.id)}
                        >
                          <div className={styles.fieldMetadata}>
                            <span className={styles.fieldTypeTag}>{field.type.toUpperCase()}</span>
                            {field.required && <span className={styles.requiredStar}>*</span>}
                          </div>
                          <div className={styles.fieldLabelArea}>
                            <span className={styles.fieldLabelText}>{field.label}</span>
                            {field.showIfFieldId && (
                              <div className={styles.conditionalTag}>
                                <Link size={10} /> Show if field '{fields.find((f) => f.id === field.showIfFieldId)?.label}' is '{field.showIfValue}'
                              </div>
                            )}
                          </div>
                          <div className={styles.fieldActions} onClick={(e) => e.stopPropagation()}>
                            <button type="button"
                              onClick={() => handleMoveField(idx, 'up')}
                              disabled={idx === 0}
                              className={styles.actionBtn}
                              title="Move Up"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button type="button"
                              onClick={() => handleMoveField(idx, 'down')}
                              disabled={idx === fields.length - 1}
                              className={styles.actionBtn}
                              title="Move Down"
                            >
                              <ArrowDown size={14} />
                            </button>
                            <button type="button"
                              onClick={() => handleDeleteField(field.id)}
                              className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                              title="Delete Field"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </Card>
            </div>

            {/* Field Settings Sidebar */}
            <div className={styles.settingsSidebar}>
              <Card padding="md" variant="bordered">
                <CardHeader title="Field Settings" subtitle={selectedField ? `Modify selected: ${selectedField.type}` : 'No field selected'} />
                <CardBody>
                  {selectedField ? (
                    <div className={styles.settingsForm}>
                      <label className={styles.settingLabel}>
                        <span>Field Label</span>
                        <input
                          type="text"
                          value={selectedField.label}
                          onChange={(e) => handleUpdateField(selectedField.id, { label: e.target.value })}
                          className={styles.settingInput}
                        />
                      </label>

                      {selectedField.type !== 'step_divider' && selectedField.type !== 'payment' && selectedField.type !== 'signature' && selectedField.type !== 'file' && (
                        <label className={styles.settingLabel}>
                          <span>Placeholder Hint</span>
                          <input
                            type="text"
                            value={selectedField.placeholder || ''}
                            onChange={(e) => handleUpdateField(selectedField.id, { placeholder: e.target.value })}
                            className={styles.settingInput}
                          />
                        </label>
                      )}

                      {selectedField.type === 'payment' && (
                        <label className={styles.settingLabel}>
                          <span>Payment Amount (₹)</span>
                          <input
                            type="number"
                            value={selectedField.paymentAmount || 0}
                            onChange={(e) => handleUpdateField(selectedField.id, { paymentAmount: Number(e.target.value) })}
                            className={styles.settingInput}
                          />
                        </label>
                      )}

                      {(selectedField.type === 'dropdown' || selectedField.type === 'radio') && (
                        <div className={styles.settingLabel}>
                          <span>Options List (comma-separated)</span>
                          <textarea
                            value={selectedField.options?.join(', ') || ''}
                            onChange={(e) =>
                              handleUpdateField(selectedField.id, {
                                options: e.target.value.split(',').map((o) => o.trim()).filter(Boolean),
                              })
                            }
                            className={styles.settingTextarea}
                            rows={3}
                          />
                        </div>
                      )}

                      <div className={styles.settingRowCheckbox}>
                        <input
                          type="checkbox"
                          id="required-chk"
                          checked={selectedField.required}
                          onChange={(e) => handleUpdateField(selectedField.id, { required: e.target.checked })}
                        />
                        <label htmlFor="required-chk">Mark as Required Field</label>
                      </div>

                      {/* Conditional logic configuration */}
                      <div className={styles.conditionalConfig}>
                        <h4>Visibility Conditional Logic</h4>
                        <label className={styles.settingLabel}>
                          <span>Show this field only if:</span>
                          <select
                            value={selectedField.showIfFieldId || ''}
                            onChange={(e) =>
                              handleUpdateField(selectedField.id, {
                                showIfFieldId: e.target.value || undefined,
                                showIfValue: e.target.value ? '' : undefined,
                              })
                            }
                            className={styles.settingSelect}
                          >
                            <option value="">(Always Show)</option>
                            {fields
                              .filter((f) => f.id !== selectedField.id && (f.type === 'radio' || f.type === 'dropdown'))
                              .map((f) => (
                                <option key={f.id} value={f.id}>
                                  {f.label}
                                </option>
                              ))}
                          </select>
                        </label>

                        {selectedField.showIfFieldId && (
                          <label className={styles.settingLabel}>
                            <span>Equals Value:</span>
                            <select
                              value={selectedField.showIfValue || ''}
                              onChange={(e) => handleUpdateField(selectedField.id, { showIfValue: e.target.value })}
                              className={styles.settingSelect}
                            >
                              <option value="">-- Choose Option --</option>
                              {(fields.find((f) => f.id === selectedField.showIfFieldId)?.options || []).map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          </label>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className={styles.noSelectedMsg}>Click any field row on the canvas to configure labels, validation, and branching rules.</p>
                  )}
                </CardBody>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className={styles.previewContainer}>
            <div className={styles.previewAlert}>
              <Eye size={16} />
              <span>Interactive Live Preview. Check step transitions, conditional logic rules, and validation.</span>
            </div>

            <Card padding="lg" variant="elevated" className={styles.previewCard}>
              <h2 className={styles.previewFormTitle}>{formName}</h2>
              {fields.length === 0 ? (
                <p className={styles.noFieldsText}>No fields have been configured. Build something first!</p>
              ) : (
                <form onSubmit={handlePreviewSubmit} className={styles.previewForm}>
                  {/* Multi-step pagination Indicator */}
                  {previewPages.length > 1 && (
                    <div className={styles.wizardSteps}>
                      {previewPages.map((_, index) => (
                        <div
                          key={index}
                          className={`${styles.wizardStepDot} ${index === previewStepIndex ? styles.wizardStepDotActive : ''} ${index < previewStepIndex ? styles.wizardStepDotDone : ''}`}
                        >
                          Step {index + 1}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Render only fields of active page index */}
                  <div className={styles.previewFormFields}>
                    {activePageFields.map((field) => {
                      if (!isFieldVisible(field)) return null;

                      return (
                        <div key={field.id} className={styles.previewFieldGroup}>
                          <label className={styles.previewLabel}>
                            <span>
                              {field.label} {field.required && <span className={styles.requiredStar}>*</span>}
                            </span>

                            {field.type === 'text' && (
                              <input
                                type="text"
                                placeholder={field.placeholder}
                                required={field.required}
                                className={styles.previewInput}
                                value={previewValues[field.id] || ''}
                                onChange={(e) => setPreviewValues({ ...previewValues, [field.id]: e.target.value })}
                              />
                            )}

                            {field.type === 'email' && (
                              <input
                                type="email"
                                placeholder={field.placeholder}
                                required={field.required}
                                className={styles.previewInput}
                                value={previewValues[field.id] || ''}
                                onChange={(e) => setPreviewValues({ ...previewValues, [field.id]: e.target.value })}
                              />
                            )}

                            {field.type === 'number' && (
                              <input
                                type="number"
                                placeholder={field.placeholder}
                                required={field.required}
                                className={styles.previewInput}
                                value={previewValues[field.id] || ''}
                                onChange={(e) => setPreviewValues({ ...previewValues, [field.id]: e.target.value })}
                              />
                            )}

                            {field.type === 'textarea' && (
                              <textarea
                                placeholder={field.placeholder}
                                required={field.required}
                                rows={4}
                                className={styles.previewTextarea}
                                value={previewValues[field.id] || ''}
                                onChange={(e) => setPreviewValues({ ...previewValues, [field.id]: e.target.value })}
                              />
                            )}

                            {field.type === 'dropdown' && (
                              <select
                                required={field.required}
                                className={styles.previewSelect}
                                value={previewValues[field.id] || ''}
                                onChange={(e) => setPreviewValues({ ...previewValues, [field.id]: e.target.value })}
                              >
                                <option value="">-- Choose Option --</option>
                                {(field.options || []).map((o) => (
                                  <option key={o} value={o}>
                                    {o}
                                  </option>
                                ))}
                              </select>
                            )}

                            {field.type === 'radio' && (
                              <div className={styles.previewRadioList}>
                                {(field.options || []).map((o) => (
                                  <label key={o} className={styles.previewRadioOption}>
                                    <input
                                      type="radio"
                                      name={field.id}
                                      value={o}
                                      checked={previewValues[field.id] === o}
                                      required={field.required && !previewValues[field.id]}
                                      onChange={() => setPreviewValues({ ...previewValues, [field.id]: o })}
                                    />
                                    <span>{o}</span>
                                  </label>
                                ))}
                              </div>
                            )}

                            {field.type === 'file' && (
                              <div className={styles.previewFileInputWrapper}>
                                <input
                                  type="file"
                                  required={field.required}
                                  className={styles.previewFileInput}
                                  onChange={(e) => {
                                    const fileName = e.target.files?.[0]?.name || '';
                                    setPreviewValues({ ...previewValues, [field.id]: fileName });
                                  }}
                                />
                                <div className={styles.fileMockDisplay}>
                                  {previewValues[field.id] ? `Selected: ${previewValues[field.id]}` : 'Click to select / upload document'}
                                </div>
                              </div>
                            )}

                            {field.type === 'signature' && (
                              <div className={styles.previewSignaturePad}>
                                <input
                                  type="text"
                                  placeholder="Type your name here to sign"
                                  required={field.required}
                                  className={styles.previewInput}
                                  value={previewValues[field.id] || ''}
                                  onChange={(e) => setPreviewValues({ ...previewValues, [field.id]: e.target.value })}
                                />
                                <div className={styles.signatureScript}>
                                  {previewValues[field.id] ? previewValues[field.id] : 'Digital Signature Preview'}
                                </div>
                              </div>
                            )}

                            {field.type === 'payment' && (
                              <div className={styles.previewPaymentBadge}>
                                <CreditCard size={18} />
                                <span>
                                  Payment Due: <strong>₹{(field.paymentAmount || 0).toLocaleString('en-IN')}</strong> (Simulated on submit)
                                </span>
                              </div>
                            )}
                          </label>
                        </div>
                      );
                    })}
                  </div>

                  {/* Navigation controls */}
                  <div className={styles.previewFormFooter}>
                    {previewStepIndex > 0 && (
                      <Button
                        variant="secondary"
                        icon={<ChevronLeft size={16} />}
                        onClick={() => setPreviewStepIndex(previewStepIndex - 1)}
                      >
                        Previous Step
                      </Button>
                    )}

                    {previewStepIndex < previewPages.length - 1 ? (
                      <Button
                        variant="primary"
                        icon={<ChevronRight size={16} />}
                        iconPosition="right"
                        onClick={() => setPreviewStepIndex(previewStepIndex + 1)}
                        className={styles.btnNext}
                      >
                        Next Step
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        variant="gold"
                        icon={<CheckCircle size={16} />}
                        disabled={submittingPreview}
                      >
                        {submittingPreview ? 'Submitting Form...' : 'Submit Application'}
                      </Button>
                    )}
                  </div>
                </form>
              )}
            </Card>

            {/* Payment Modal */}
            {showPaymentModal && (
              <div className={styles.modalOverlay}>
                <div className={styles.creditCardModal}>
                  <h3>CollegeOS Payment Gateway</h3>
                  <p className={styles.modalDesc}>Complete transaction fee to finish submission.</p>

                  <div className={styles.paymentSum}>
                    <span>Total Amount Due:</span>
                    <strong>₹{(fields.find((f) => f.type === 'payment')?.paymentAmount || 0).toLocaleString('en-IN')}</strong>
                  </div>

                  <div className={styles.ccForm}>
                    <label>
                      <span>Card Number</span>
                      <input type="text" placeholder="4111 2222 3333 4444" className={styles.modalInput} />
                    </label>
                    <div className={styles.ccRow}>
                      <label>
                        <span>Expiration</span>
                        <input type="text" placeholder="MM/YY" className={styles.modalInput} />
                      </label>
                      <label>
                        <span>CVV</span>
                        <input type="password" placeholder="123" className={styles.modalInput} />
                      </label>
                    </div>
                  </div>

                  <div className={styles.modalFooter}>
                    <Button variant="ghost" onClick={() => setShowPaymentModal(false)}>
                      Cancel
                    </Button>
                    <Button variant="gold" icon={<CreditCard size={14} />} onClick={processFormSubmission}>
                      Confirm & Pay
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'crm' && (
          <div className={styles.crmContainer}>
            <div className={styles.row}>
              {/* Mapping */}
              <div className={styles.columnLeft}>
                <Card padding="md" variant="default">
                  <CardHeader title="CRM Attribute Mapping" subtitle="Automatically sync form inputs into student records" />
                  <CardBody>
                    <div className={styles.mappingList}>
                      {fields
                        .filter((f) => f.type !== 'step_divider' && f.type !== 'payment')
                        .map((field) => (
                          <div key={field.id} className={styles.mappingRow}>
                            <div className={styles.mappingFormLabel}>
                              <strong>{field.label}</strong>
                              <span>Type: {field.type}</span>
                            </div>
                            <span className={styles.arrowIcon}>➔</span>
                            <select
                              value={crmMappings[field.id] || ''}
                              onChange={(e) => setCrmMappings({ ...crmMappings, [field.id]: e.target.value })}
                              className={styles.mappingSelect}
                            >
                              <option value="">(Ignore / Sync Off)</option>
                              <option value="lead_first_name">Lead: First Name</option>
                              <option value="lead_last_name">Lead: Last Name</option>
                              <option value="lead_email">Lead: Email</option>
                              <option value="lead_phone_number">Lead: Phone</option>
                              <option value="custom_interest_program">Custom: Academic Program</option>
                              <option value="financial_aid_interest">Custom: FinAid Needed</option>
                              <option value="annual_family_income">Custom: Family Income</option>
                              <option value="essay_body">Custom: Essay Transcript</option>
                            </select>
                          </div>
                        ))}
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Workflows */}
              <div className={styles.columnRight}>
                <Card padding="md" variant="bordered">
                  <CardHeader title="Workflow Triggers" subtitle="Actions to perform instantly upon student submission" />
                  <CardBody className={styles.workflowOptions}>
                    <label className={styles.workflowCheckRow}>
                      <input
                        type="checkbox"
                        checked={workflows.sendAutoresponse}
                        onChange={(e) => setWorkflows({ ...workflows, sendAutoresponse: e.target.checked })}
                      />
                      <div>
                        <strong>Send Email Autoresponder</strong>
                        <p>Emails a carbon-copy receipt to the student immediately.</p>
                      </div>
                    </label>

                    <label className={styles.workflowCheckRow}>
                      <input
                        type="checkbox"
                        checked={workflows.notifyAdmissions}
                        onChange={(e) => setWorkflows({ ...workflows, notifyAdmissions: e.target.checked })}
                      />
                      <div>
                        <strong>Alert Admissions Officer</strong>
                        <p>Sends Slack/Email alert to administrators for review.</p>
                      </div>
                    </label>

                    <label className={styles.workflowLabel}>
                      <span>Enroll in Admissions Pipeline Stage</span>
                      <select
                        value={workflows.addToFunnel}
                        onChange={(e) => setWorkflows({ ...workflows, addToFunnel: e.target.value })}
                        className={styles.settingSelect}
                      >
                        <option value="admissions-general">General Intake Pipeline</option>
                        <option value="scholarship-evaluation">Scholarship Evaluation Board</option>
                        <option value="events-rsvp">RSVP Open-House Guest List</option>
                        <option value="course-feedback-pool">Academic Review Pool</option>
                      </select>
                    </label>

                    <label className={styles.workflowLabel}>
                      <span>Apply Contact Tag</span>
                      <input
                        type="text"
                        value={workflows.leadTag}
                        onChange={(e) => setWorkflows({ ...workflows, leadTag: e.target.value })}
                        className={styles.settingInput}
                        placeholder="e.g. Lead, Inquirer, Scholarship"
                      />
                    </label>

                    <Button
                      variant="primary"
                      onClick={() =>
                        notify({
                          type: 'success',
                          title: 'Settings Saved',
                          message: 'CRM bindings and automated workflows saved successfully.',
                        })
                      }
                    >
                      Save Workflow Settings
                    </Button>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className={styles.analyticsContainer}>
            <div className={styles.analyticsStatsGrid}>
              <div className={styles.statBox}>
                <span>Views (Visits)</span>
                <h3>4,850</h3>
                <span className={styles.subtext}>+12% vs last week</span>
              </div>
              <div className={styles.statBox}>
                <span>Submissions</span>
                <h3>1,204</h3>
                <span className={styles.subtext}>+8% conversion success</span>
              </div>
              <div className={styles.statBox}>
                <span>Conversion Rate</span>
                <h3>24.8%</h3>
                <span className={styles.subtext}>Warm lead quality</span>
              </div>
              <div className={styles.statBox}>
                <span>Avg. Submission Time</span>
                <h3>2m 45s</h3>
                <span className={styles.subtext}>Low form fatigue</span>
              </div>
            </div>

            {/* Submissions Log */}
            <Card padding="md" variant="default">
              <div className={styles.cardHeaderWithAction}>
                <CardHeader title="Form Submissions Log" subtitle="Real-time list of student applications submitted" />
                <Button variant="ghost" size="sm" icon={<RefreshCw size={12} />} onClick={() => notify({ type: 'info', title: 'Refreshed Logs', message: 'Logs synced up to date.' })}>
                  Sync Logs
                </Button>
              </div>
              <CardBody>
                <div className={styles.tableWrapper}>
                  <table className={styles.submissionsTable}>
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Submitted Content Snippet</th>
                        <th>Submission ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentSubmissions.map((sub) => (
                        <tr key={sub.id}>
                          <td className={styles.dateCell}>{sub.date}</td>
                          <td>
                            <div className={styles.snippetGrid}>
                              {Object.entries(sub.data).map(([key, val]) => (
                                <span key={key} className={styles.snippetBadge}>
                                  <strong>{key}:</strong> {String(val)}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className={styles.idCell}>{sub.id}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
