import { useState, useMemo, useRef, useEffect } from 'react';
import { PageContainer, ModulePageHeader } from '../layouts';
import { Card, CardBody, CardHeader, Button, StageChip } from '../components/ui';
import { useNotifications } from '../contexts/NotificationContext';
import {
  MessageCircle,
  Send,
  Plus,
  CheckCheck,
  PhoneCall,
  Users,
  Smartphone,
  BarChart3,
  ChevronLeft,
} from 'lucide-react';
import styles from './WhatsappSenderPage.module.css';

interface Message {
  id: string;
  sender: 'student' | 'admin';
  text: string;
  time: string;
}

interface StudentChat {
  id: string;
  name: string;
  phone: string;
  cohort: string;
  unreadCount: number;
  lastMessageTime: string;
  messages: Message[];
}

const INITIAL_CHATS: StudentChat[] = [
  {
    id: 'wc-1',
    name: 'Sahil Sharma',
    phone: '+91 98765 43210',
    cohort: 'B.Tech CS Applicants',
    unreadCount: 2,
    lastMessageTime: '12:45 PM',
    messages: [
      { id: 'm-1', sender: 'student', text: 'Hello, I submitted my JEE score transcripts yesterday. Can you please check if my application is updated?', time: '11:20 AM' },
      { id: 'm-2', sender: 'admin', text: 'Hi Sahil! Thanks for reaching out. Yes, we received your score transcript. It is currently under review by our department panel.', time: '11:40 AM' },
      { id: 'm-3', sender: 'student', text: 'Excellent, thank you. Approximately how long does the verification approval usually take?', time: '12:42 PM' },
      { id: 'm-4', sender: 'student', text: 'Also, is there any other document required for the scholarship category?', time: '12:45 PM' },
    ],
  },
  {
    id: 'wc-2',
    name: 'Ananya Iyer',
    phone: '+1 (505) 401-2231',
    cohort: 'Executive MBA Fall',
    unreadCount: 0,
    lastMessageTime: 'Yesterday',
    messages: [
      { id: 'm-5', sender: 'admin', text: 'Hello Emma, this is Dr. Jenkins. Just checking if you were able to complete your corporate reference verification form?', time: 'Yesterday 3:10 PM' },
      { id: 'm-6', sender: 'student', text: 'Yes Dr. Jenkins, I uploaded both reference letters to the portal this morning.', time: 'Yesterday 4:05 PM' },
      { id: 'm-7', sender: 'admin', text: 'Perfect. Your dossier is now 100% complete. We will release final decision letters next Tuesday.', time: 'Yesterday 4:15 PM' },
    ],
  },
  {
    id: 'wc-3',
    name: 'Arjun Singhal',
    phone: '+1 (650) 302-4432',
    cohort: 'Scholarship Seekers',
    unreadCount: 1,
    lastMessageTime: '10:15 AM',
    messages: [
      { id: 'm-8', sender: 'admin', text: 'Hi John, please complete your income proof statement to process your merit-based financial aid request.', time: 'Yesterday 10:00 AM' },
      { id: 'm-9', sender: 'student', text: 'Okay, I will gather the statement sheets from my father and upload them by this afternoon.', time: '10:15 AM' },
    ],
  },
];

interface BroadcastCampaign {
  id: string;
  name: string;
  templateName: string;
  cohort: string;
  sentCount: number;
  readRate: number;
  repliedRate: number;
  status: 'Sent' | 'Scheduled';
  date: string;
}

const INITIAL_BROADCASTS: BroadcastCampaign[] = [
  { id: 'wb-1', name: 'CS Orientation Checklist Nudge', templateName: 'Freshman Orientation Guide', cohort: 'B.Tech CS Applicants', sentCount: 450, readRate: 94.2, repliedRate: 48.1, status: 'Sent', date: '2026-05-18' },
  { id: 'wb-2', name: 'MBA Reference Form Blast', templateName: 'Reference Letter Link', cohort: 'Executive MBA Fall', sentCount: 120, readRate: 88.5, repliedRate: 62.4, status: 'Sent', date: '2026-05-20' },
];

export function WhatsappSenderPage() {
  const { notify } = useNotifications();
  const [activeTab, setActiveTab] = useState<'chats' | 'dashboard' | 'broadcast'>('chats');

  // Database States
  const [chats, setChats] = useState<StudentChat[]>(INITIAL_CHATS);
  const [broadcasts, setBroadcasts] = useState<BroadcastCampaign[]>(INITIAL_BROADCASTS);
  const [selectedChatId, setSelectedChatId] = useState<string>(chats[0]?.id || '');

  // Conversational Chat Input
  const [chatInputText, setChatInputText] = useState('');
  
  // Mobile responsive panels toggle state
  const [activeMobileView, setActiveMobileView] = useState<'list' | 'chat'>('list');

  // Broadcast Form Input
  const [broadcastName, setBroadcastName] = useState('');
  const [selectedCohort, setSelectedCohort] = useState('B.Tech CS Applicants');
  const [selectedTemplateText, setSelectedTemplateText] = useState('portal_link');

  const chatLogBodyRef = useRef<HTMLDivElement>(null);

  // Pre-configured dynamic Quick Templates
  const QUICK_TEMPLATES = [
    { id: 'portal_link', label: 'Portal Link', text: 'Hi {name}, here is your secure CollegeOS Admissions Application Portal URL link: https://uos.edu/portal' },
    { id: 'fee_notice', label: 'Fee Reminder', text: 'Dear {name}, this is a reminder that your seat enrollment confirmation fee payment is due. Complete it here: https://uos.edu/billing' },
    { id: 'counselor_check', label: 'Counselor Booking', text: 'Hello {name}! Dr. Sarah Jenkins here. Let me know when you are free for a quick 10-minute counselors booking call!' },
  ];

  // Auto Scroll Chat Log locally instead of jumping the whole window
  useEffect(() => {
    if (chatLogBodyRef.current) {
      chatLogBodyRef.current.scrollTop = chatLogBodyRef.current.scrollHeight;
    }
  }, [chats, selectedChatId]);

  const activeChat = useMemo(() => {
    return chats.find((c) => c.id === selectedChatId) || chats[0];
  }, [chats, selectedChatId]);

  // Mark Active Chat as Read
  useEffect(() => {
    if (activeChat && activeChat.unreadCount > 0) {
      setChats(prev =>
        prev.map(c => (c.id === activeChat.id ? { ...c, unreadCount: 0 } : c))
      );
    }
  }, [selectedChatId]);

  // Send Message in Active Conversation
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputText.trim()) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'admin',
      text: chatInputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChats(prev =>
      prev.map(c => {
        if (c.id === selectedChatId) {
          return {
            ...c,
            lastMessageTime: newMsg.time,
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    setChatInputText('');

    // Trigger instant mock student response after 1.5 seconds!
    setTimeout(() => {
      const studentReply: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'student',
        text: 'Thanks for the quick response. I appreciate your assistance!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChats(prev =>
        prev.map(c => {
          if (c.id === selectedChatId) {
            return {
              ...c,
              lastMessageTime: studentReply.time,
              messages: [...c.messages, studentReply],
            };
          }
          return c;
        })
      );

      notify({
        type: 'info',
        title: 'New WhatsApp Message',
        message: `From ${activeChat.name}: "${studentReply.text}"`,
      });
    }, 1500);
  };

  // Click Template Chip inside Conversation Input Area
  const handleApplyTemplateChip = (templateText: string) => {
    const formatted = templateText.replace(/{name}/g, activeChat.name.split(' ')[0]);
    setChatInputText(formatted);
  };

  // Launch Broadcast Campaign
  const handleLaunchBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastName.trim()) {
      notify({ type: 'error', title: 'Broadcast Name Missing', message: 'Please give your WhatsApp broadcast campaign a name.' });
      return;
    }

    const templateObj = QUICK_TEMPLATES.find(t => t.id === selectedTemplateText);
    const templateLabel = templateObj ? templateObj.label : 'Admissions Portal Link';

    const newBroadcast: BroadcastCampaign = {
      id: `wb-${Date.now()}`,
      name: broadcastName.trim(),
      templateName: templateLabel,
      cohort: selectedCohort,
      sentCount: selectedCohort === 'B.Tech CS Applicants' ? 450 : 120,
      readRate: 0,
      repliedRate: 0,
      status: 'Sent',
      date: new Date().toISOString().split('T')[0],
    };

    setBroadcasts(prev => [newBroadcast, ...prev]);
    setBroadcastName('');
    setActiveTab('dashboard');

    notify({
      type: 'success',
      title: 'WhatsApp Broadcast Sent!',
      message: `"${newBroadcast.name}" successfully sent to ${newBroadcast.sentCount} students.`,
    });
  };

  return (
    <PageContainer breadcrumbs={[{ label: 'Marketing' }, { label: 'WhatsApp Sender' }]}>
      <ModulePageHeader
        title="WhatsApp Sender"
        subtitle="Run counsellor chat workflows and bulk WhatsApp outreach."
      />
      <nav className="ml-tabs">
        <button type="button"
          onClick={() => setActiveTab('chats')}
          className={`ml-tab ${activeTab === 'chats' ? 'ml-tab-active' : ''}`}
        >
          <MessageCircle size={16} />
          <span>Interactive Student Chats</span>
        </button>
        <button type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`ml-tab ${activeTab === 'dashboard' ? 'ml-tab-active' : ''}`}
        >
          <BarChart3 size={16} />
          <span>Broadcast Campaigns</span>
        </button>
        <button type="button"
          onClick={() => setActiveTab('broadcast')}
          className={`ml-tab ${activeTab === 'broadcast' ? 'ml-tab-active' : ''}`}
        >
          <Plus size={16} />
          <span>Send Broadcast</span>
        </button>
      </nav>

      {/* Main Container Area */}
      <div className={`ml-tab-panel ${styles.tabContent}`}>
        {/* INTERACTIVE CHATS TAB */}
        {activeTab === 'chats' && (
          <div className={`${styles.chatLayoutGrid} ${activeMobileView === 'chat' ? styles.showChatView : styles.showListView}`}>
            {/* Left Chat Selection List */}
            <div className={styles.chatSidebar}>
              <div className={styles.sidebarHeader}>Active Student Chats</div>
              <div className={styles.studentList}>
                {chats.map((c) => {
                  const isActive = c.id === selectedChatId;
                  const lastMsgObj = c.messages[c.messages.length - 1];
                  const lastMsgSnippet = lastMsgObj ? lastMsgObj.text : 'No messages yet';

                  return (
                    <button type="button"
                      key={c.id}
                      onClick={() => {
                        setSelectedChatId(c.id);
                        setActiveMobileView('chat');
                      }}
                      className={`${styles.studentItem} ${isActive ? styles.studentItemActive : ''}`}
                    >
                      <div className={styles.avatarMock}>
                        {c.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className={styles.studentDetails}>
                        <div className={styles.studentNameRow}>
                          <strong>{c.name}</strong>
                          <span>{c.lastMessageTime}</span>
                        </div>
                        <p className={styles.lastMsg}>{lastMsgSnippet}</p>
                      </div>
                      {c.unreadCount > 0 && (
                        <div className={styles.unreadBadge}>{c.unreadCount}</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Chat Conversations Box */}
            {activeChat ? (
              <div className={styles.chatWindow}>
                {/* Header */}
                <div className={styles.chatWindowHeader}>
                  <button type="button" 
                    className={styles.mobileBackBtn} 
                    onClick={() => setActiveMobileView('list')}
                    aria-label="Back to active chats list"
                  >
                    <ChevronLeft size={16} />
                    <span>Back</span>
                  </button>
                  <div className={styles.headerTitle}>
                    <div className={styles.avatarMock}>
                      {activeChat.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className={styles.headerInfo}>
                      <h4>{activeChat.name} <StageChip stage="green" label="Verified WABA" /></h4>
                      <p>{activeChat.phone} • {activeChat.cohort}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<PhoneCall size={14} />}
                    onClick={() => notify({ type: 'info', title: 'Initiating Call', message: `Contacting ${activeChat.name} via official voice bridge...` })}
                  >
                    Call
                  </Button>
                </div>

                {/* Messages Log */}
                <div ref={chatLogBodyRef} className={styles.chatLogBody}>
                  {activeChat.messages.map((m) => {
                    const isOutgoing = m.sender === 'admin';
                    return (
                      <div
                        key={m.id}
                        className={`${styles.bubbleRow} ${isOutgoing ? styles.bubbleOutgoing : styles.bubbleIncoming}`}
                      >
                        <div className={styles.msgBubble}>
                          <p>{m.text}</p>
                          <span className={styles.msgTime}>
                            {m.time} {isOutgoing && <CheckCheck size={10} style={{ display: 'inline', marginLeft: '2px', color: 'var(--color-gold)' }} />}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Input Area */}
                <div className={styles.chatInputArea}>
                  {/* Preset quick templates chip selectors */}
                  <div className={styles.templateQuickChips}>
                    {QUICK_TEMPLATES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleApplyTemplateChip(t.text)}
                        className={styles.quickChip}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className={styles.inputForm}>
                    <input
                      type="text"
                      placeholder="Type a WhatsApp message or select quick template..."
                      value={chatInputText}
                      onChange={(e) => setChatInputText(e.target.value)}
                      className={styles.chatTextInput}
                    />
                    <Button variant="gold" type="submit" icon={<Send size={14} />}>
                      Send
                    </Button>
                  </form>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--color-text-secondary)' }}>
                Select an active student conversation to display message history.
              </div>
            )}
          </div>
        )}

        {/* BROADCASTS DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div>
            <div className={styles.statsGrid}>
              <Card padding="md" variant="default" className={styles.statCard}>
                <div className={styles.statHeader}>
                  <span>Total Broadcasts Sent</span>
                  <Users size={16} className={styles.blueText} />
                </div>
                <h3>570</h3>
                <p>Delivered using Verified Profile</p>
              </Card>

              <Card padding="md" variant="default" className={styles.statCard}>
                <div className={styles.statHeader}>
                  <span>Delivery Success Rate</span>
                  <Smartphone size={16} className={styles.greenText} />
                </div>
                <h3>99.4%</h3>
                <p>Carrier dropouts: under 0.6%</p>
              </Card>

              <Card padding="md" variant="default" className={styles.statCard}>
                <div className={styles.statHeader}>
                  <span>Template Read Rate</span>
                  <MessageCircle size={16} className={styles.goldText} />
                </div>
                <h3>91.5%</h3>
                <p>Open rates double that of email</p>
              </Card>

              <Card padding="md" variant="default" className={styles.statCard}>
                <div className={styles.statHeader}>
                  <span>Conversational Reply Rate</span>
                  <CheckCheck size={16} className={styles.purpleText} />
                </div>
                <h3>55.2%</h3>
                <p>Dynamic direct inquiry conversions</p>
              </Card>
            </div>

            <Card padding="md" variant="default">
              <CardHeader title="WhatsApp Broadcast Logs" subtitle="Delivered campaign history metrics report" />
              <CardBody>
                <table className={styles.broadcastTable}>
                  <thead>
                    <tr>
                      <th>Broadcast Campaign Name</th>
                      <th>Applied WABA Template</th>
                      <th>Target List</th>
                      <th>Sent Quantity</th>
                      <th>Read Rate</th>
                      <th>Reply Rate</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {broadcasts.map((b) => (
                      <tr key={b.id}>
                        <td>
                          <strong>{b.name}</strong>
                          <p style={{ fontSize: '10px', color: 'var(--color-text-muted)', margin: 0 }}>Date: {b.date}</p>
                        </td>
                        <td>{b.templateName}</td>
                        <td>{b.cohort}</td>
                        <td>{b.sentCount}</td>
                        <td>{b.status === 'Sent' ? `${b.readRate}%` : '—'}</td>
                        <td>{b.status === 'Sent' ? `${b.repliedRate}%` : '—'}</td>
                        <td>
                          <StageChip stage={b.status === 'Sent' ? 'green' : 'yellow'} label={b.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </div>
        )}

        {/* BROADCAST FORM SENDER */}
        {activeTab === 'broadcast' && (
          <Card padding="lg" variant="default" className={styles.broadcastFormCard}>
            <CardHeader title="Deploy WhatsApp Broadcast" subtitle="Launch official templates to target student lists" />
            <CardBody>
              <form onSubmit={handleLaunchBroadcast} className={styles.broadcastForm}>
                <label className={styles.formLabel}>
                  <span>Broadcast Campaign Identifier</span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS Seat Deposit Deadline Reminder"
                    value={broadcastName}
                    onChange={(e) => setBroadcastName(e.target.value)}
                    className={styles.formInput}
                  />
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                  <label className={styles.formLabel}>
                    <span>Target Cohort List</span>
                    <select
                      value={selectedCohort}
                      onChange={(e) => setSelectedCohort(e.target.value)}
                      className={styles.formSelect}
                    >
                      <option value="B.Tech CS Applicants">B.Tech CS Applicants (450 students)</option>
                      <option value="Executive MBA Fall">Executive MBA Fall (120 students)</option>
                    </select>
                  </label>

                  <label className={styles.formLabel}>
                    <span>Pre-Approved WABA Template</span>
                    <select
                      value={selectedTemplateText}
                      onChange={(e) => setSelectedTemplateText(e.target.value)}
                      className={styles.formSelect}
                    >
                      {QUICK_TEMPLATES.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div style={{ padding: 'var(--space-3)', background: 'var(--color-bg-sidebar)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', marginTop: 'var(--space-2)' }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', color: 'var(--color-brown-dark)', marginBottom: '4px' }}>
                    Live Template Body Preview:
                  </span>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.4' }}>
                    {QUICK_TEMPLATES.find(t => t.id === selectedTemplateText)?.text.replace(/{name}/g, 'StudentName')}
                  </p>
                </div>

                <div style={{ marginTop: 'var(--space-3)' }}>
                  <Button variant="gold" type="submit" icon={<Send size={14} />}>
                    Send Broadcast Campaign
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
