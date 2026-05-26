import { useState, useMemo, useRef, useEffect } from 'react';
import { PageContainer } from '../layouts';
import { Card, CardBody, CardHeader, Button, StageChip } from '../components/ui';
import { useNotifications } from '../contexts/NotificationContext';
import {
  Inbox,
  Send,
  Sparkles,
  User,
  RotateCw,
  Search,
  Check,
  Edit2,
  AlertCircle,
  ChevronLeft,
} from 'lucide-react';
import styles from './AiAgentInboxPage.module.css';

interface Message {
  id: string;
  sender: 'student' | 'ai' | 'agent';
  text: string;
  time: string;
}

interface StudentInquiry {
  id: string;
  studentName: string;
  applicationId: string;
  targetDegree: string;
  subject: string;
  status: 'new inquiry' | 'AI handled' | 'human escalation' | 'pending' | 'resolved' | 'inactive';
  lastMessageTime: string;
  messages: Message[];
  aiDraftReply?: string;
  qualificationScore: number;
  tags: string[];
}

const INITIAL_INQUIRIES: StudentInquiry[] = [
  {
    id: 'inq-1',
    studentName: 'Aarav Mehta',
    applicationId: 'APP-2026-981',
    targetDegree: 'B.Tech Computer Science',
    subject: 'Eligibility with 59% in Physics/Maths',
    status: 'new inquiry',
    lastMessageTime: '02:14 PM',
    qualificationScore: 65,
    tags: ['Maths Inquiry', 'Freshman'],
    messages: [
      { id: 'm1', sender: 'student', text: 'Hi, I got 59.4% in my physics and maths aggregate. Am I strictly ineligible for B.Tech CSE? Your brochure says 60% standard.', time: '02:14 PM' }
    ],
    aiDraftReply: 'Based on the B.Tech Admissions Policy 2026, the 60% aggregate requirement in PCM is strict. However, students with >55% with exceptional JEE Main percentiles (>92) are occasionally escalated for discretionary review. Do you have a JEE scorecard?'
  },
  {
    id: 'inq-2',
    studentName: 'Kriti Sharma',
    applicationId: 'APP-2026-104',
    targetDegree: 'MBA Finance',
    subject: 'First Installment Payment Extension',
    status: 'human escalation',
    lastMessageTime: '01:50 PM',
    qualificationScore: 85,
    tags: ['Scholarship Eligible', 'Document Verified'],
    messages: [
      { id: 'm2-1', sender: 'student', text: 'Good morning, my father’s salary transfer is delayed. Can I pay the MBA first semester deposit on July 25th instead of July 15th?', time: '09:30 AM' },
      { id: 'm2-2', sender: 'ai', text: 'I am fetching MBA installment criteria... Tuition structure mandates seat reservation fee payment by July 15. I will escalate this to our financial administrator.', time: '09:31 AM' },
      { id: 'm2-3', sender: 'student', text: 'Thank you! Yes, please verify. I already uploaded my category and mark sheets.', time: '01:50 PM' }
    ],
    aiDraftReply: 'Hello Kriti, I have logged an formal counseling ticket for fee extensions. Admissions Head Swati Sen is reviewing your uploaded financial proof.'
  },
  {
    id: 'inq-3',
    studentName: 'Ishaan Verma',
    applicationId: 'APP-2026-440',
    targetDegree: 'B.Tech Electronics & Comm.',
    subject: 'Hostel Booking & Mess Fees',
    status: 'AI handled',
    lastMessageTime: '11:24 AM',
    qualificationScore: 70,
    tags: ['Hostel Required', 'Ready to Apply'],
    messages: [
      { id: 'm3-1', sender: 'student', text: 'Is the laundry fee included in the premium double-sharing hostel charges?', time: '11:20 AM' },
      { id: 'm3-2', sender: 'ai', text: 'Yes! Double-sharing hostel fees (Rs. 1,10,000/yr) include laundry service, standard mess charges, and high-speed Wi-Fi pings.', time: '11:24 AM' }
    ]
  },
  {
    id: 'inq-4',
    studentName: 'Sneha Rao',
    applicationId: 'APP-2026-702',
    targetDegree: 'B.Tech Biotechnology',
    subject: 'Scholarship quotas for State Boards',
    status: 'pending',
    lastMessageTime: '10:05 AM',
    qualificationScore: 50,
    tags: ['State Topper', 'Scholarship Eligible'],
    messages: [
      { id: 'm4-1', sender: 'student', text: 'Does the 50% tuition fee waiver apply to state board toppers, or is it exclusively for CBSE/ICSE aggregates?', time: '10:05 AM' }
    ],
    aiDraftReply: 'Admissions merit scholarships are board-agnostic. Any student scoring >90% aggregate (or equivalent percentile rank in State boards) is highly eligible for the 50% waiver in Semester 1.'
  },
  {
    id: 'inq-5',
    studentName: 'Rahul Das',
    applicationId: 'APP-2026-056',
    targetDegree: 'MBA Marketing',
    subject: 'CAT Cutoffs & Interview Schedule',
    status: 'resolved',
    lastMessageTime: 'Yesterday',
    qualificationScore: 90,
    tags: ['High Intent', 'Ready to Apply', 'Interview Done'],
    messages: [
      { id: 'm5-1', sender: 'student', text: 'What was the CAT cutoff for general category interviews last year?', time: 'Yesterday' },
      { id: 'm5-2', sender: 'agent', text: 'The CAT percentile cutoff for general MBA was 78 percentile. Your CAT scorecard of 81.2 meets the threshold. I have confirmed your panel interview slot for May 25.', time: 'Yesterday' },
      { id: 'm5-3', sender: 'student', text: 'Perfect, got the invitation! Thanks so much.', time: 'Yesterday' }
    ]
  },
  {
    id: 'inq-6',
    studentName: 'Rohan Gupta',
    applicationId: 'APP-2026-339',
    targetDegree: 'B.Tech IT',
    subject: 'Direct Admission via Management Quota',
    status: 'inactive',
    lastMessageTime: '3 days ago',
    qualificationScore: 30,
    tags: ['Low Engagement'],
    messages: [
      { id: 'm6-1', sender: 'student', text: 'Can I get direct admission in B.Tech IT without JEE scores?', time: '3 days ago' },
      { id: 'm6-2', sender: 'ai', text: 'All direct admissions are subject to qualifying exam marks. Candidates without JEE score must appear for the College Scholastic Entrance Test (CSET).', time: '3 days ago' }
    ]
  }
];

export function AiAgentInboxPage() {
  const { notify } = useNotifications();

  // Primary list state
  const [inquiries, setInquiries] = useState<StudentInquiry[]>(INITIAL_INQUIRIES);
  const [selectedId, setSelectedId] = useState<string>('inq-1');
  const [inboxFilter, setInboxFilter] = useState<string>('All');
  const [searchName, setSearchName] = useState('');
  
  // Mobile responsive panels toggle state
  const [activeMobileView, setActiveMobileView] = useState<'list' | 'chat'>('list');

  // Editing state for AI Draft reply
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [draftEditorText, setDraftEditorText] = useState('');
  
  // Custom manual reply state
  const [manualReplyText, setManualReplyText] = useState('');
  
  // Active queue simulation refresh
  const [isQueueRefreshing, setIsQueueRefreshing] = useState(false);

  const messagesViewportRef = useRef<HTMLDivElement>(null);

  // Active selected inquiry helper
  const activeInq = useMemo(() => {
    return inquiries.find(i => i.id === selectedId) || inquiries[0];
  }, [inquiries, selectedId]);

  // Load active AI draft to editor when selected inquiry changes
  useEffect(() => {
    if (activeInq && activeInq.aiDraftReply) {
      setDraftEditorText(activeInq.aiDraftReply);
    } else {
      setDraftEditorText('');
    }
    setIsEditingDraft(false);
    setManualReplyText('');
    
    // Smooth scroll local panel viewport instead of whole window
    if (messagesViewportRef.current) {
      messagesViewportRef.current.scrollTop = messagesViewportRef.current.scrollHeight;
    }
  }, [selectedId, activeInq]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesViewportRef.current) {
      messagesViewportRef.current.scrollTop = messagesViewportRef.current.scrollHeight;
    }
  }, [activeInq?.messages]);

  // Filtered inquiries list
  const filteredInquiries = useMemo(() => {
    return inquiries.filter(i => {
      // Filter by Search Name
      const matchSearch = i.studentName.toLowerCase().includes(searchName.toLowerCase()) || 
                          i.subject.toLowerCase().includes(searchName.toLowerCase());
      
      if (!matchSearch) return false;

      // Filter by Status Tab
      if (inboxFilter === 'All') return true;
      if (inboxFilter === 'new inquiry') return i.status === 'new inquiry';
      if (inboxFilter === 'AI handled') return i.status === 'AI handled';
      if (inboxFilter === 'human escalation') return i.status === 'human escalation';
      if (inboxFilter === 'pending') return i.status === 'pending';
      
      return true;
    });
  }, [inquiries, inboxFilter, searchName]);

  // Helper to map status to standard design system stage colors
  const getStatusChipProps = (status: StudentInquiry['status']): { stage: 'blue' | 'purple' | 'orange' | 'yellow' | 'green' | 'gray'; label: string } => {
    switch (status) {
      case 'new inquiry': return { stage: 'blue', label: 'New Inquiry' };
      case 'AI handled': return { stage: 'purple', label: 'AI Handled' };
      case 'human escalation': return { stage: 'orange', label: 'Escalated' };
      case 'pending': return { stage: 'yellow', label: 'Pending AI' };
      case 'resolved': return { stage: 'green', label: 'Resolved' };
      case 'inactive': return { stage: 'gray', label: 'Inactive' };
    }
  };

  // 1. Action: Approve AI Suggested Response
  const handleApproveDraft = () => {
    if (!activeInq.aiDraftReply) return;

    const approvedText = isEditingDraft ? draftEditorText : activeInq.aiDraftReply;
    if (!approvedText.trim()) return;

    const newMsg: Message = {
      id: `m-agent-${Date.now()}`,
      sender: 'ai', // Mark as sent by AI autopilot, approved by human
      text: approvedText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setInquiries(prev =>
      prev.map(inq => {
        if (inq.id === activeInq.id) {
          return {
            ...inq,
            status: 'AI handled',
            messages: [...inq.messages, newMsg],
            aiDraftReply: undefined
          };
        }
        return inq;
      })
    );

    notify({
      type: 'success',
      title: 'AI Draft Approved & Sent',
      message: `Message sent to ${activeInq.studentName} via Meta channel.`,
    });
    
    setIsEditingDraft(false);
  };

  // 2. Action: Intercept and send custom manual reply
  const handleSendManualReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualReplyText.trim()) return;

    const newMsg: Message = {
      id: `m-agent-${Date.now()}`,
      sender: 'agent',
      text: manualReplyText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setInquiries(prev =>
      prev.map(inq => {
        if (inq.id === activeInq.id) {
          return {
            ...inq,
            status: 'resolved',
            messages: [...inq.messages, newMsg],
            aiDraftReply: undefined
          };
        }
        return inq;
      })
    );

    notify({
      type: 'success',
      title: 'Manual Reply Dispatched',
      message: `Ticket successfully resolved and marked manual.`,
    });
    setManualReplyText('');
  };

  // 3. Action: Escalate conversation manually
  const handleTriggerEscalation = () => {
    setInquiries(prev =>
      prev.map(inq => {
        if (inq.id === activeInq.id) {
          return {
            ...inq,
            status: 'human escalation'
          };
        }
        return inq;
      })
    );

    notify({
      type: 'warning',
      title: 'Routed to Escalation Queue',
      message: `Thread for ${activeInq.studentName} flagged for Swati Sen desk.`,
    });
  };

  // 4. Action: Toggle specific checklist qualification tag
  const handleToggleTag = (tag: string) => {
    setInquiries(prev =>
      prev.map(inq => {
        if (inq.id === activeInq.id) {
          const hasTag = inq.tags.includes(tag);
          const nextTags = hasTag ? inq.tags.filter(t => t !== tag) : [...inq.tags, tag];
          
          // Dynamically adjust score based on tags count
          const nextScore = Math.min(100, Math.max(10, nextTags.length * 20 + 20));

          return {
            ...inq,
            tags: nextTags,
            qualificationScore: nextScore
          };
        }
        return inq;
      })
    );
  };

  // 5. Action: Refresh inbox queues
  const handleRefreshQueues = () => {
    setIsQueueRefreshing(true);
    setTimeout(() => {
      setIsQueueRefreshing(false);
      
      // Simulate receiving a new candidate inquiry
      const alreadyHasNew = inquiries.some(i => i.id === 'inq-simulated');
      if (alreadyHasNew) {
        notify({
          type: 'info',
          title: 'Queues Polled Successfully',
          message: 'Inbox records are completely up to date.',
        });
        return;
      }

      const simulatedInq: StudentInquiry = {
        id: 'inq-simulated',
        studentName: 'Vikram Aditya',
        applicationId: 'APP-2026-612',
        targetDegree: 'B.Tech CSE',
        subject: 'CSET scholarship syllabus',
        status: 'new inquiry',
        lastMessageTime: 'Just Now',
        qualificationScore: 40,
        tags: ['Maths Inquiry'],
        messages: [
          { id: 'm-sim', sender: 'student', text: 'Can you provide the sample questions or syllabus for the CSET scholarship exam?', time: 'Just Now' }
        ],
        aiDraftReply: 'The CSET scholarship test comprises 90 Multiple Choice Questions testing Physics, Mathematics, and Analytical Reasoning. I am pulling the official PDF syllabus sheet for you...'
      };

      setInquiries(prev => [simulatedInq, ...prev]);
      notify({
        type: 'info',
        title: 'New Student Message Received!',
        message: 'Vikram Aditya sent an inquiry regarding CSET syllabus.',
        duration: 3500,
      });

    }, 800);
  };

  // Metrics calculators
  const inboxMetrics = useMemo(() => {
    const total = inquiries.length;
    const resolved = inquiries.filter(i => i.status === 'resolved').length;
    const escalated = inquiries.filter(i => i.status === 'human escalation').length;
    const pendingAI = inquiries.filter(i => i.status === 'pending' || i.status === 'new inquiry').length;

    return { total, resolved, escalated, pendingAI };
  }, [inquiries]);

  return (
    <PageContainer breadcrumbs={[{ label: 'AI Suite' }, { label: 'AI Agent Inbox' }]}>
      
      {/* Upper header row */}
      <div className={styles.headerBar}>
        <div>
          <h2 className={styles.headerTitle}>AI Agent Unified Messaging Cockpit</h2>
          <p className={styles.headerSubtitle}>
            Review multi-channel student inquiries, approve automated AI drafts, and manage advisor priority escalations.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button 
            variant="secondary" 
            size="sm" 
            icon={<RotateCw size={14} className={isQueueRefreshing ? 'spin-animation' : ''} />}
            onClick={handleRefreshQueues}
            disabled={isQueueRefreshing}
          >
            {isQueueRefreshing ? 'Polling WhatsApp...' : 'Sync Active Channels'}
          </Button>
        </div>
      </div>

      {/* Analytics Mini-Grid */}
      <div className={styles.miniStatsGrid}>
        <div className={styles.statsCard}>
          <span>Active Connections</span>
          <strong>{inboxMetrics.total} Inquiries</strong>
        </div>
        <div className={styles.statsCard}>
          <span>Need Human Review</span>
          <strong style={{ color: 'var(--stage-orange-text)' }}>{inboxMetrics.escalated} Escalated</strong>
        </div>
        <div className={styles.statsCard}>
          <span>Autopilot Pending Action</span>
          <strong style={{ color: 'var(--stage-purple-text)' }}>{inboxMetrics.pendingAI} Drafts</strong>
        </div>
        <div className={styles.statsCard}>
          <span>Resolved Admissions</span>
          <strong style={{ color: 'var(--stage-green-text)' }}>{inboxMetrics.resolved} Closed</strong>
        </div>
      </div>

      {/* Messaging Dashboard Grid */}
      <div className={`${styles.inboxLayoutGrid} ${activeMobileView === 'chat' ? styles.showChatView : styles.showListView}`}>
        
        {/* COLUMN 1: Conversations List Panel */}
        <div className={styles.leftQueuePanel}>
          
          <div className={styles.panelHeaderBlock}>
            <div className={styles.searchContainer}>
              <Search size={14} className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Search candidates name..." 
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className={styles.queueSearchInput}
              />
            </div>
            
            {/* Filter Tabs */}
            <div className={styles.queueFilters}>
              {['All', 'new inquiry', 'pending', 'human escalation', 'AI handled'].map(filter => (
                <button type="button"
                  key={filter}
                  onClick={() => setInboxFilter(filter)}
                  className={`${styles.filterBtn} ${inboxFilter === filter ? styles.filterBtnActive : ''}`}
                >
                  {filter === 'All' ? 'All Inquiries' : filter === 'new inquiry' ? 'New' : filter === 'pending' ? 'Pending AI' : filter === 'human escalation' ? 'Escalations' : 'AI Handled'}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.conversationsList}>
            {filteredInquiries.length === 0 ? (
              <div className={styles.emptyInboxList}>
                <Inbox size={24} style={{ opacity: 0.3, color: 'var(--color-text-secondary)' }} />
                <span>No active inquiries match the selected criteria.</span>
              </div>
            ) : (
              filteredInquiries.map(inq => {
                const isSelected = inq.id === activeInq.id;
                const statusProps = getStatusChipProps(inq.status);
                
                return (
                  <div 
                    key={inq.id}
                    onClick={() => {
                      setSelectedId(inq.id);
                      setActiveMobileView('chat');
                    }}
                    className={`${styles.inquiryListItem} ${isSelected ? styles.inquirySelected : ''}`}
                    style={{ borderLeftColor: `var(--stage-${statusProps.stage}-text)` }}
                  >
                    <div className={styles.inquiryHeader}>
                      <span className={styles.studentName}>{inq.studentName}</span>
                      <span className={styles.lastMsgTime}>{inq.lastMessageTime}</span>
                    </div>
                    <p className={styles.inquirySubject}>{inq.subject}</p>
                    <div className={styles.inquiryFooter}>
                      <span className={styles.degreeTag}>{inq.targetDegree}</span>
                      <StageChip stage={statusProps.stage} label={statusProps.label} />
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* COLUMN 2: Message Stream & Live AI Copilot Console */}
        <div className={styles.centerChatPanel}>
          
          {/* Chat Panel Header */}
          <div className={styles.chatHeader}>
            <button type="button" 
              className={styles.mobileBackBtn} 
              onClick={() => setActiveMobileView('list')}
              aria-label="Back to Inquiries list"
            >
              <ChevronLeft size={16} />
              <span>Back</span>
            </button>
            <div className={styles.studentTitleMeta}>
              <div className={styles.avatarIcon}>
                <User size={16} />
              </div>
              <div>
                <h4>{activeInq.studentName}</h4>
                <span>{activeInq.targetDegree} • ID: {activeInq.applicationId}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <StageChip 
                stage={getStatusChipProps(activeInq.status).stage} 
                label={getStatusChipProps(activeInq.status).label} 
              />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleTriggerEscalation}
                disabled={activeInq.status === 'human escalation'}
              >
                Escalate
              </Button>
            </div>
          </div>

          {/* Unified message stream viewport */}
          <div ref={messagesViewportRef} className={styles.messagesViewport}>
            {activeInq.messages.map(msg => {
              const isStudent = msg.sender === 'student';
              const isAi = msg.sender === 'ai';
              
              return (
                <div 
                  key={msg.id}
                  className={`${styles.chatBubbleRow} ${
                    isStudent ? styles.bubbleStudentRow : isAi ? styles.bubbleAiRow : styles.bubbleAgentRow
                  }`}
                >
                  <div className={styles.chatBubble}>
                    <div className={styles.bubbleHeader}>
                      <span className={styles.senderLabel}>
                        {isStudent ? activeInq.studentName : isAi ? 'AI Autopilot' : 'Admissions Advisor'}
                      </span>
                      <span className={styles.msgTime}>{msg.time}</span>
                    </div>
                    <p className={styles.bubbleText}>{msg.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Autopilot Draft Panel (Interactive Copilot Console) */}
          {activeInq.aiDraftReply && (
            <div className={styles.aiCopilotConsole}>
              <div className={styles.copilotHeader}>
                <div className={styles.copilotTitle}>
                  <Sparkles size={14} className={styles.goldSparkle} />
                  <span>AI Autopilot Suggested Draft</span>
                </div>
                {!isEditingDraft ? (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    icon={<Edit2 size={11} />}
                    onClick={() => {
                      setIsEditingDraft(true);
                      setDraftEditorText(activeInq.aiDraftReply || '');
                    }}
                  >
                    Refine
                  </Button>
                ) : (
                  <span className={styles.editingBadge}>Editing Mode</span>
                )}
              </div>

              <div className={styles.copilotBody}>
                {!isEditingDraft ? (
                  <p className={styles.draftText}>{activeInq.aiDraftReply}</p>
                ) : (
                  <textarea
                    rows={3}
                    value={draftEditorText}
                    onChange={(e) => setDraftEditorText(e.target.value)}
                    className={styles.draftTextarea}
                  />
                )}
              </div>

              <div className={styles.copilotFooter}>
                <div className={styles.copilotConfidenceInfo}>
                  <AlertCircle size={12} className={styles.purpleText} />
                  <span>92% response alignment metrics index.</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {isEditingDraft && (
                    <Button variant="ghost" size="sm" onClick={() => setIsEditingDraft(false)}>
                      Reset
                    </Button>
                  )}
                  <Button 
                    variant="gold" 
                    size="sm" 
                    icon={<Check size={12} />}
                    onClick={handleApproveDraft}
                  >
                    Approve & Dispatch
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Manual Input Reply Bar */}
          <form onSubmit={handleSendManualReply} className={styles.manualReplyBar}>
            <input 
              type="text" 
              placeholder={`Manually send message to ${activeInq.studentName}...`}
              value={manualReplyText}
              onChange={(e) => setManualReplyText(e.target.value)}
              className={styles.replyInputField}
            />
            <Button 
              variant="secondary" 
              type="submit"
              size="sm"
              icon={<Send size={12} />}
              disabled={!manualReplyText.trim()}
            >
              Send
            </Button>
          </form>

        </div>

        {/* COLUMN 3: Student Profile Sidebar & Live Intent Checklist */}
        <div className={styles.rightProfileDrawer}>
          
          {/* Card: Student Profile Header */}
          <Card padding="md" variant="default" className={styles.profileCard}>
            <CardHeader title="Student Dossier" subtitle="Application scoring and file status indicators" />
            <CardBody>
              
              <div className={styles.profileProgressSegment}>
                <div className={styles.scoreRow}>
                  <span>Lead Intent Index</span>
                  <strong>{activeInq.qualificationScore}%</strong>
                </div>
                <div className={styles.scoreBarBg}>
                  <div 
                    className={styles.scoreBarFill} 
                    style={{ 
                      width: `${activeInq.qualificationScore}%`,
                      backgroundColor: activeInq.qualificationScore > 75 ? 'var(--stage-green-text)' : 'var(--color-gold)'
                    }}
                  ></div>
                </div>
              </div>

              <div className={styles.dossierGrid}>
                
                <div className={styles.dossierItem}>
                  <span>Degree Target</span>
                  <strong>{activeInq.targetDegree}</strong>
                </div>

                <div className={styles.dossierItem}>
                  <span>Application ID</span>
                  <strong>{activeInq.applicationId}</strong>
                </div>

                <div className={styles.dossierItem}>
                  <span>Channel Origin</span>
                  <strong>WhatsApp Sandbox</strong>
                </div>

                <div className={styles.dossierItem}>
                  <span>Last Active Log</span>
                  <strong>{activeInq.lastMessageTime}</strong>
                </div>

              </div>

            </CardBody>
          </Card>

          {/* Card: Qualification Flags Checklist */}
          <Card padding="md" variant="default" style={{ marginTop: 'var(--space-4)' }} className={styles.profileCard}>
            <CardHeader 
              title="Qualification Checklist" 
              subtitle="Select intent flags to manually score candidate eligibility parameters" 
            />
            <CardBody>
              <div className={styles.checklistGrid}>
                
                {[
                  'Maths Inquiry',
                  'Freshman',
                  'Scholarship Eligible',
                  'Document Verified',
                  'Hostel Required',
                  'Ready to Apply',
                  'Interview Done',
                  'High Intent'
                ].map(tag => {
                  const isActive = activeInq.tags.includes(tag);
                  
                  return (
                    <label 
                      key={tag} 
                      className={`${styles.checkTagLabel} ${isActive ? styles.checkTagActive : ''}`}
                    >
                      <input 
                        type="checkbox" 
                        checked={isActive}
                        onChange={() => handleToggleTag(tag)}
                        className="sr-only"
                      />
                      <div className={styles.checkSquare}>
                        {isActive && <Check size={10} style={{ color: 'white' }} />}
                      </div>
                      <span>{tag}</span>
                    </label>
                  );
                })}

              </div>
            </CardBody>
          </Card>

          {/* Card: Verification History Logs Timeline */}
          <Card padding="md" variant="bordered" style={{ marginTop: 'var(--space-4)' }} className={styles.profileCard}>
            <CardHeader title="Student Operational Logs" subtitle="Chronological history of webhook events" />
            <CardBody>
              <div className={styles.logsTimeline}>
                
                <div className={styles.logItem}>
                  <div className={styles.logDot} style={{ background: 'var(--stage-blue-text)' }}></div>
                  <div className={styles.logContent}>
                    <span>Webhook Trigger: Lead Ingested</span>
                    <small>System • Origin: Ad Launcher Form</small>
                  </div>
                </div>

                <div className={styles.logItem}>
                  <div className={styles.logDot} style={{ background: 'var(--stage-purple-text)' }}></div>
                  <div className={styles.logContent}>
                    <span>Autopilot Active Conversation Routing</span>
                    <small>LLM Routing Engine • 100% confidence</small>
                  </div>
                </div>

                {activeInq.status === 'human escalation' && (
                  <div className={styles.logItem}>
                    <div className={styles.logDot} style={{ background: 'var(--stage-orange-text)' }}></div>
                    <div className={styles.logContent}>
                      <strong>Escalated to Swati Sen Desk</strong>
                      <small>Agent Intercept • Intent mismatch flag</small>
                    </div>
                  </div>
                )}

              </div>
            </CardBody>
          </Card>

        </div>

      </div>

    </PageContainer>
  );
}
