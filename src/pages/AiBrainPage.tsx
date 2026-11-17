import { useState, useMemo, useRef, useEffect } from 'react';
import { PageContainer } from '../layouts';
import { Card, CardBody, CardHeader, Button, StageChip } from '../components/ui';
import { useNotifications } from '../hooks/useNotifications';
import {
  Send,
  Upload,
  Plus,
  Search,
  BookOpen,
  FileText,
  HelpCircle,
  Trash2,
  AlertCircle,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import styles from './AiBrainPage.module.css';

interface KnowledgeItem {
  id: string;
  name: string;
  category: 'Brochure' | 'FAQ' | 'Course Catalog' | 'Fee Structure' | 'Eligibility';
  size: string;
  status: 'Trained' | 'Processing';
  tokens: string;
  dateAdded: string;
}

type KnowledgeCategory = KnowledgeItem['category'];

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  confidence?: number;
  time: string;
}

const INITIAL_KNOWLEDGE: KnowledgeItem[] = [
  { id: 'kn-1', name: 'B.Tech Admissions Brochure 2026.pdf', category: 'Brochure', size: '4.8 MB', status: 'Trained', tokens: '142K tokens', dateAdded: '2026-05-10' },
  { id: 'kn-2', name: 'MBA Fee & Installment Structure.xlsx', category: 'Fee Structure', size: '1.2 MB', status: 'Trained', tokens: '38K tokens', dateAdded: '2026-05-12' },
  { id: 'kn-3', name: 'Undergraduate Course Catalog.pdf', category: 'Course Catalog', size: '8.4 MB', status: 'Trained', tokens: '290K tokens', dateAdded: '2026-05-15' },
  { id: 'kn-4', name: 'Admissions FAQs & Eligibility Criteria.txt', category: 'FAQ', size: '240 KB', status: 'Trained', tokens: '18K tokens', dateAdded: '2026-05-18' },
  { id: 'kn-5', name: 'Hostel Rules & Accommodation Policy 2026.pdf', category: 'Brochure', size: '3.1 MB', status: 'Trained', tokens: '86K tokens', dateAdded: '2026-05-20' },
  { id: 'kn-6', name: 'B.Tech Biotech Eligibility Matrix.pdf', category: 'Eligibility', size: '1.6 MB', status: 'Trained', tokens: '52K tokens', dateAdded: '2026-05-22' },
  { id: 'kn-7', name: 'Postgraduate Research Fellowship Guide.pdf', category: 'Course Catalog', size: '5.9 MB', status: 'Trained', tokens: '178K tokens', dateAdded: '2026-05-25' },
];

const PRELOADED_FAQ_PAIRS = [
  { q: 'What are the eligibility criteria for B.Tech CSE?', a: 'Candidates must have passed 10+2 with Physics, Mathematics, and Chemistry with a minimum aggregate of 60% marks.' },
  { q: 'What is the annual fee for the MBA program?', a: 'The annual tuition fee for MBA is Rs 2,50,000, payable in two installments (July and December).' },
  { q: 'What documents are required during physical counseling?', a: 'Required: 10th & 12th mark sheets, JEE Main scorecard, category certificate, migration transfer certificate, and 4 passport-size photographs.' },
  { q: 'Is hostel accommodation mandatory for outstation students?', a: 'Hostel is not mandatory. However, outstation students are strongly recommended to opt for campus housing. Double-sharing rooms cost Rs 1,10,000/year inclusive of mess and laundry.' },
  { q: 'What is the last date for admission applications?', a: 'The final deadline for Fall 2026 applications is July 31, 2026. Late applications are accepted until August 10 with a Rs 500 late fee surcharge.' },
  { q: 'Can lateral entry students apply for B.Tech third year?', a: 'Yes, diploma holders with 60% aggregate can apply for lateral entry into 3rd semester B.Tech programs via the CSET Lateral Entry examination held in June.' },
];

export function AiBrainPage() {
  const { notify } = useNotifications();
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>(INITIAL_KNOWLEDGE);
  const [faqs, setFaqs] = useState(PRELOADED_FAQ_PAIRS);

  // Chat window state
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'msg-1', sender: 'ai', text: 'Hello! I am the CollegeOS AI Assistant. I have been trained on B.Tech & MBA Brochures, Fees Lists, and Eligibility FAQs. How can I guide you today?', confidence: 99, time: '10:40 AM' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatViewportRef = useRef<HTMLDivElement>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'catalog' | 'faqs'>('upload');

  // Input states for FAQ creator
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  // Knowledge uploads simulation state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadCategory, setUploadCategory] = useState<'Brochure' | 'FAQ' | 'Course Catalog' | 'Fee Structure' | 'Eligibility'>('Brochure');

  // Counselor escalation modal
  const [showEscalationModal, setShowEscalationModal] = useState(false);
  const [escalationNotes, setEscalationNotes] = useState('');

  useEffect(() => {
    if (chatViewportRef.current) {
      chatViewportRef.current.scrollTop = chatViewportRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const searchableKnowledge = useMemo(() => {
    return knowledge.filter(k => 
      k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [knowledge, searchQuery]);

  // AI response engine containing realistic brochure answers
  const handleQueryResponse = (query: string): { text: string; confidence: number } => {
    const qLower = query.toLowerCase();

    if (qLower.includes('b.tech') || qLower.includes('computer') || qLower.includes('cse') || qLower.includes('eligibility')) {
      return {
        text: 'According to the B.Tech Admissions Brochure 2026 (Section 2.1), candidates must secure a minimum of 60% marks in PCM in 10+2. A valid JEE Main percentile is required for allocation branches.',
        confidence: 96.8,
      };
    }
    if (qLower.includes('mba') || qLower.includes('fee') || qLower.includes('installment') || qLower.includes('tuition')) {
      return {
        text: 'Based on the MBA Fee & Installment Structure datasheet, the total tuition fee is Rs. 2,50,000 per year. Payment installment 1 (Rs. 1,25,000) is due by July 15, and installment 2 is due by December 15.',
        confidence: 98.2,
      };
    }
    if (qLower.includes('document') || qLower.includes('counseling') || qLower.includes('physical') || qLower.includes('require')) {
      return {
        text: 'Admissions FAQ section mandates bringing: (1) 10th & 12th Class mark sheets, (2) JEE Main or CAT Scorecard, (3) Migration/Transfer certificate, (4) Category Proof (if applicable), and (5) 4 passport photos.',
        confidence: 95.4,
      };
    }
    if (qLower.includes('scholarship') || qLower.includes('financial') || qLower.includes('aid')) {
      return {
        text: 'Merit-based scholarships are active. Students achieving >90% in 10+2 qualify for 50% tuition waiver in Semester 1. Sports and category concessions are detailed in Brochure page 14.',
        confidence: 91.2,
      };
    }

    // Default matching FAQ Q&A
    for (const faq of faqs) {
      if (qLower.includes(faq.q.toLowerCase()) || faq.q.toLowerCase().includes(qLower)) {
        return { text: faq.a, confidence: 97.5 };
      }
    }

    return {
      text: 'Query not fully indexed in knowledge brochures. We suggest triggering an escalation to human counselor Swati Sen at admissions trunk line.',
      confidence: 62.4,
    };
  };

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = handleQueryResponse(textToSend);
      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: response.text,
        confidence: response.confidence,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);

      if (response.confidence < 75) {
        notify({
          type: 'warning',
          title: 'Low Confidence Response',
          message: 'AI matched query with low precision. Escalation trigger proposed.',
          duration: 3500,
        });
      }
    }, 900);
  };

  const handleTriggerUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim()) {
      notify({ type: 'error', title: 'File Name Required', message: 'Please describe the uploaded context document.' });
      return;
    }

    setIsUploading(true);
    setTimeout(() => {
      const newKn: KnowledgeItem = {
        id: `kn-${Date.now()}`,
        name: uploadFileName.endsWith('.pdf') || uploadFileName.endsWith('.txt') ? uploadFileName : `${uploadFileName}.pdf`,
        category: uploadCategory,
        size: '1.4 MB',
        status: 'Trained',
        tokens: '45K tokens',
        dateAdded: new Date().toISOString().split('T')[0],
      };

      setKnowledge(prev => [newKn, ...prev]);
      setIsUploading(false);
      setUploadFileName('');
      notify({
        type: 'success',
        title: 'Knowledge Index Synchronized!',
        message: `Successfully uploaded and trained AI Brain on "${newKn.name}".`,
      });
    }, 1500);
  };

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) {
      notify({ type: 'error', title: 'Fields Blank', message: 'Both question and answer are required.' });
      return;
    }

    const newPair = { q: newQuestion.trim(), a: newAnswer.trim() };
    setFaqs(prev => [newPair, ...prev]);

    // Also add to knowledge item log
    const newKn: KnowledgeItem = {
      id: `kn-${Date.now()}`,
      name: `Q&A: ${newQuestion.substring(0, 30)}...`,
      category: 'FAQ',
      size: '2 KB',
      status: 'Trained',
      tokens: '350 tokens',
      dateAdded: new Date().toISOString().split('T')[0],
    };
    setKnowledge(prev => [newKn, ...prev]);

    setNewQuestion('');
    setNewAnswer('');
    notify({
      type: 'success',
      title: 'FAQ Trainee Saved',
      message: 'New structured query trained successfully in the AI Brain.',
    });
  };

  const handleDeleteKnowledge = (id: string, name: string) => {
    setKnowledge(prev => prev.filter(k => k.id !== id));
    notify({
      type: 'info',
      title: 'Knowledge Deleted',
      message: `Removed "${name}" from indexed databases. AI Brain context updated.`,
    });
  };

  const handleTriggerEscalation = () => {
    setShowEscalationModal(false);
    setEscalationNotes('');
    notify({
      type: 'success',
      title: 'Routed to Counselor',
      message: 'Active conversation ticket successfully escalated to Swati Sen (Admissions Head).',
    });
  };

  return (
    <PageContainer breadcrumbs={[{ label: 'AI Suite' }, { label: 'AI Brain' }]}>
      
      <div className={styles.brainHeaderRow}>
        <div>
          <h2 className={styles.brainTitle}>CollegeOS AI Knowledge Hub & Brain</h2>
          <p className={styles.brainSubtitle}>Upload brochures, catalogs, and tuition files to train student-facing LLM auto-responders.</p>
        </div>
      </div>

      <div className={styles.brainSplitLayout}>
        
        {/* LEFT COLUMN: Upload, searchable knowledge list, Brochures tabs */}
        <div className={styles.leftColumn}>
          
          {/* Navigation Sub-Tabs */}
          <nav className={styles.subTabs}>
            <button type="button" 
              onClick={() => setActiveTab('upload')} 
              className={`${styles.tabBtn} ${activeTab === 'upload' ? styles.tabBtnActive : ''}`}
            >
              <Upload size={14} />
              <span>Training Documents</span>
            </button>
            <button type="button" 
              onClick={() => setActiveTab('faqs')} 
              className={`${styles.tabBtn} ${activeTab === 'faqs' ? styles.tabBtnActive : ''}`}
            >
              <HelpCircle size={14} />
              <span>FAQ Trainer</span>
            </button>
            <button type="button" 
              onClick={() => setActiveTab('catalog')} 
              className={`${styles.tabBtn} ${activeTab === 'catalog' ? styles.tabBtnActive : ''}`}
            >
              <BookOpen size={14} />
              <span>Brochure Catalogs</span>
            </button>
          </nav>

          <div className={styles.tabContentArea}>
            
            {/* UPLOAD & TRAIN TAB */}
            {activeTab === 'upload' && (
              <Card padding="md" variant="default" className={styles.flatCard}>
                <CardHeader title="Index New Training Brochure" subtitle="Drag, drop, or specify files to inject context vectors" />
                <CardBody>
                  <form onSubmit={handleTriggerUpload} className={styles.uploadForm}>
                    <div className={styles.uploadDropzone}>
                      <Upload size={32} className={styles.uploadCloudIcon} />
                      <p style={{ margin: '4px 0', fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                        Drag admissions brochure PDF files or catalog Excel documents here
                      </p>
                      <input 
                        type="text" 
                        required
                        placeholder="Or write document name (e.g. Hostels_Rules_2026.pdf)"
                        value={uploadFileName}
                        onChange={(e) => setUploadFileName(e.target.value)}
                        className={styles.uploadNameInput}
                      />
                    </div>

                    <div className={styles.uploadControlsRow}>
                      <label className={styles.controlLabel}>
                        <span>Document Category</span>
                        <select 
                          value={uploadCategory} 
                          onChange={(e) => setUploadCategory(e.target.value as KnowledgeCategory)}
                          className={styles.controlSelect}
                        >
                          <option value="Brochure">Brochure Catalog</option>
                          <option value="Fee Structure">Fee Structure</option>
                          <option value="Eligibility">Eligibility Criteria</option>
                          <option value="FAQ">Admission FAQ list</option>
                        </select>
                      </label>
                      <Button 
                        variant="gold" 
                        type="submit" 
                        icon={<Plus size={14} />}
                        disabled={isUploading}
                      >
                        {isUploading ? 'Ingesting Vectors...' : 'Train AI Brain'}
                      </Button>
                    </div>
                  </form>
                </CardBody>
              </Card>
            )}

            {/* FAQ TRAINER TAB */}
            {activeTab === 'faqs' && (
              <Card padding="md" variant="default" className={styles.flatCard}>
                <CardHeader title="FAQ Management Console" subtitle="Feed custom structured questions directly to LLM context" />
                <CardBody>
                  <form onSubmit={handleAddFaq} className={styles.faqForm}>
                    <label className={styles.controlLabel}>
                      <span>Student Question Pattern</span>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Can I pay fees in installments?"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        className={styles.faqInput}
                      />
                    </label>
                    <label className={styles.controlLabel} style={{ marginTop: '8px' }}>
                      <span>AI Model Response Copy</span>
                      <textarea 
                        required
                        rows={3}
                        placeholder="e.g. Yes, MBA fee of Rs. 2,50,000 can be paid in two equal installments..."
                        value={newAnswer}
                        onChange={(e) => setNewAnswer(e.target.value)}
                        className={styles.faqTextarea}
                      />
                    </label>
                    <div style={{ marginTop: '8px', textAlign: 'right' }}>
                      <Button variant="gold" size="sm" type="submit" icon={<Plus size={12} />}>
                        Save FAQ to Brain
                      </Button>
                    </div>
                  </form>
                </CardBody>
              </Card>
            )}

            {/* CATALOG CONTEXT TAB */}
            {activeTab === 'catalog' && (
              <Card padding="md" variant="default" className={styles.flatCard}>
                <CardHeader title="Course & Admission Catalogs" subtitle="Index of brochures trained in current environment" />
                <CardBody>
                  <div className={styles.preloadedCatalogList}>
                    
                    <div className={styles.catalogItem}>
                      <div className={styles.catalogHeader}>
                        <strong>B.Tech Syllabus & Requirements</strong>
                        <StageChip stage="green" label="Trained" />
                      </div>
                      <p>Full 4-year curricula index, branches lists, and eligibility (PCM aggregate &gt;60%).</p>
                    </div>

                    <div className={styles.catalogItem}>
                      <div className={styles.catalogHeader}>
                        <strong>MBA Master Catalog</strong>
                        <StageChip stage="green" label="Trained" />
                      </div>
                      <p>CAT/MAT threshold lists, dynamic counseling requirements, and refund processes.</p>
                    </div>

                    <div className={styles.catalogItem}>
                      <div className={styles.catalogHeader}>
                        <strong>Tuition Scholarship Schemes</strong>
                        <StageChip stage="green" label="Active" />
                      </div>
                      <p>Fee concessions based on JEE scores, sports quotas, and financial constraints.</p>
                    </div>

                  </div>
                </CardBody>
              </Card>
            )}

          </div>

          {/* Searchable Uploaded Knowledge Base */}
          <Card padding="md" variant="default" style={{ marginTop: 'var(--space-4)' }}>
            <CardHeader title="Searchable Knowledge Directory" subtitle="Inspect trained brochures and parsed databases" />
            <CardBody>
              <div className={styles.searchBarContainer}>
                <Search size={14} className={styles.searchIcon} />
                <input 
                  type="text" 
                  placeholder="Search file name or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInputField}
                />
              </div>

              <div className={styles.knowledgeDirectory}>
                {searchableKnowledge.length === 0 ? (
                  <p className={styles.emptyText}>No trained knowledge assets matched query.</p>
                ) : (
                  searchableKnowledge.map(k => (
                    <div key={k.id} className={styles.knRow}>
                      <div className={styles.knMeta}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FileText size={14} className={styles.goldText} />
                          <strong>{k.name}</strong>
                        </div>
                        <span className={styles.knSubText}>
                          {k.category} • {k.size} • {k.tokens} • Added: {k.dateAdded}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <StageChip stage={k.status === 'Trained' ? 'green' : 'yellow'} label={k.status} />
                        <button 
                          type="button" 
                          onClick={() => handleDeleteKnowledge(k.id, k.name)}
                          className={styles.knDeleteBtn}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardBody>
          </Card>

        </div>

        {/* RIGHT COLUMN: AI Chat Playground & Live Confidence Tracker */}
        <div className={styles.rightColumn}>
          
          <Card padding="md" variant="default" className={styles.chatCardPlayground}>
            
            <CardHeader 
              title="AI Chat Playground Sandbox" 
              subtitle="Test and evaluate AI responses based on uploaded knowledge indexes"
            />
            
            <CardBody className={styles.playgroundBodyWrapper}>
              
              {/* Messages viewport */}
              <div ref={chatViewportRef} className={styles.chatViewport}>
                {messages.map(m => (
                  <div 
                    key={m.id} 
                    className={`${styles.chatMessageBubble} ${
                      m.sender === 'user' ? styles.bubbleUser : styles.bubbleAi
                    }`}
                  >
                    <div className={styles.bubbleTextContent}>
                      {m.text}
                    </div>
                    <div className={styles.bubbleMetadataRow}>
                      {m.confidence !== undefined && (
                        <span className={styles.confidenceChip} style={{
                          background: m.confidence > 90 ? 'var(--stage-green-bg)' : 'var(--stage-orange-bg)',
                          color: m.confidence > 90 ? 'var(--stage-green-text)' : 'var(--stage-orange-text)'
                        }}>
                          Confidence: {m.confidence}%
                        </span>
                      )}
                      <span className={styles.bubbleTime}>{m.time}</span>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className={`${styles.chatMessageBubble} ${styles.bubbleAi}`}>
                    <div className={styles.typingIndicator}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Quick Prompt Tags */}
              <div className={styles.promptTagsRow}>
                <span className={styles.promptTagLabel}>Test Queries:</span>
                <button type="button" className={styles.promptTagBtn} onClick={() => handleSendMessage('What is B.Tech Eligibility?')}>
                  B.Tech Eligibility
                </button>
                <button type="button" className={styles.promptTagBtn} onClick={() => handleSendMessage('Show MBA Fee Structure')}>
                  MBA Fees
                </button>
                <button type="button" className={styles.promptTagBtn} onClick={() => handleSendMessage('Physical counseling documents required')}>
                  Counseling Docs
                </button>
                <button type="button" className={styles.promptTagBtn} onClick={() => handleSendMessage('Are scholarships available?')}>
                  Scholarships
                </button>
              </div>

              {/* Chat Send Input Box */}
              <div className={styles.chatControlsContainer}>
                <input 
                  type="text" 
                  placeholder="Type a query to evaluate AI training..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(chatInput)}
                  className={styles.chatInputField}
                />
                <Button 
                  variant="gold" 
                  size="sm" 
                  onClick={() => handleSendMessage(chatInput)}
                  icon={<Send size={12} />}
                >
                  Query
                </Button>
              </div>

              {/* AI Confidence Tracker and Escalation trigger */}
              <div className={styles.confidenceTrackingPanel}>
                <div className={styles.confidenceMetricsRow}>
                  <div className={styles.metricItem}>
                    <span>Average System Accuracy</span>
                    <strong>96.8%</strong>
                  </div>
                  <div className={styles.metricItem}>
                    <span>Retrieved Knowledge Blocks</span>
                    <strong>1,420 vectors</strong>
                  </div>
                </div>

                <div className={styles.confidenceFooterAction}>
                  <div className={styles.fallbackNotice}>
                    <AlertCircle size={12} className={styles.orangeText} />
                    <span>Inquiries below 75% confidence automatically flagged.</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    icon={<Sparkles size={12} />}
                    onClick={() => setShowEscalationModal(true)}
                  >
                    Escalate to Counselor
                  </Button>
                </div>
              </div>

            </CardBody>
          </Card>

        </div>

      </div>

      {/* Escalation Modal */}
      {showEscalationModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Escalate Active Session to Counselor</h3>
            <p className={styles.modalDesc}>Handover LLM query stream to a physical counselor trunk desk immediately.</p>
            
            <label className={styles.controlLabel}>
              <span>Handover Priority Notes</span>
              <textarea 
                rows={3}
                placeholder="e.g. Student inquiring about complex visa/hostel regulations outside current brochure..."
                value={escalationNotes}
                onChange={(e) => setEscalationNotes(e.target.value)}
                className={styles.modalTextarea}
              />
            </label>

            <div className={styles.modalFooter}>
              <Button variant="ghost" size="sm" onClick={() => setShowEscalationModal(false)}>
                Cancel
              </Button>
              <Button variant="gold" size="sm" onClick={handleTriggerEscalation} icon={<CheckCircle size={12} />}>
                Execute Transfer
              </Button>
            </div>
          </div>
        </div>
      )}

    </PageContainer>
  );
}
