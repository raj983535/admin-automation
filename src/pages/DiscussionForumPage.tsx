import { useState, useMemo } from 'react';
import { PageContainer } from '../layouts';
import { Card, CardBody, CardHeader, Button, StageChip } from '../components/ui';
import { useNotifications } from '../contexts/NotificationContext';
import {
  Search,
  Plus,
  ThumbsUp,
  Award,
  CheckCircle,
  Send,
} from 'lucide-react';
import styles from './DiscussionForumPage.module.css';

interface ForumReply {
  id: string;
  author: string;
  role: 'student' | 'faculty';
  content: string;
  time: string;
  likes: number;
}

interface ForumQuestion {
  id: string;
  title: string;
  explanation: string;
  author: string;
  category: 'Computer Science' | 'Mathematics' | 'Physics' | 'Chemistry';
  status: 'unanswered' | 'answered' | 'faculty verified' | 'trending' | 'closed';
  tags: string[];
  date: string;
  likes: number;
  replies: ForumReply[];
  hasUpvoted?: boolean;
}

export function DiscussionForumPage() {
  const { notify } = useNotifications();

  // State Management
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAskForm, setShowAskForm] = useState(false);

  // Ask question form state
  const [askTitle, setAskTitle] = useState('');
  const [askExplanation, setAskExplanation] = useState('');
  const [askCategory, setAskCategory] = useState<'Computer Science' | 'Mathematics' | 'Physics' | 'Chemistry'>('Computer Science');
  const [askTagsText, setAskTagsText] = useState('neural, optimize');

  // Inline reply form state
  const [replyInputText, setReplyInputText] = useState<Record<string, string>>({});

  const [questions, setQuestions] = useState<ForumQuestion[]>([
    {
      id: 'QNA-701',
      title: 'Why does the gradient vanish in deep Recurrent Neural Networks compared to LSTMs?',
      explanation: 'I am training a standard RNN with 6 hidden tanh layers for coordinate trajectory sequencing. The network performance diverges and weights don\'t update. Why does this vanish and how does LSTM architecture solve it?',
      author: 'Sahil Sharma (6th Sem)',
      category: 'Computer Science',
      status: 'faculty verified',
      tags: ['deep learning', 'rnn', 'gradients'],
      date: '2 hours ago',
      likes: 15,
      replies: [
        {
          id: 'REP-7011',
          author: 'Meera Deshmukh (3rd Year)',
          role: 'student',
          content: 'I had similar vanishing patterns in B.Tech Project 1. The cumulative products of weight matrices in backpropagation through time (BPTT) cause exponential decay when tanh gradients are fraction decimal bounds (< 1.0).',
          time: '1 hour ago',
          likes: 4
        },
        {
          id: 'REP-7012',
          author: 'Dr. Sarah Jenkins',
          role: 'faculty',
          content: 'Excellent observation, Meera. To expand, LSTMs resolve this decay by incorporating an additive "cell state" pathway. The cell state acts as a gradient conveyor belt, regulated by input, forget, and output gates. Because the forget gate can pass gradients directly through addition rather than continuous multiplication, it ensures stable backpropagation coefficients over hundreds of timesteps.',
          time: '30 mins ago',
          likes: 12
        }
      ]
    },
    {
      id: 'QNA-702',
      title: 'Simplifying boundary bounds for Stokes\' Theorem triple flux coordinates',
      explanation: 'In the latest vector calculus homework set, we need to prove Stokes Theorem bounds for an open hemisphere. I am confused about aligning the orientation of the bounding boundary loop with the normal vector.',
      author: 'Ananya Iyer (3rd Year)',
      category: 'Mathematics',
      status: 'answered',
      tags: ['calculus', 'vectors', 'stokes'],
      date: '4 hours ago',
      likes: 8,
      replies: [
        {
          id: 'REP-7021',
          author: 'Amit Kulkarni',
          role: 'faculty',
          content: 'Recall the right-hand rule for surface orientations. If you walk along the boundary curve with your head pointing in the direction of the surface normal vector, the surface interior must always lie to your left. This ensures the line integral aligns perfectly with the flux curl direction.',
          time: '2 hours ago',
          likes: 9
        }
      ]
    },
    {
      id: 'QNA-703',
      title: 'How does self-inductance vary in coaxial cable loops?',
      explanation: 'Could anyone outline the derivation steps for computing internal versus external self-inductance in a coaxial transmission line of radius a and b?',
      author: 'Rahul Sen (3rd Year)',
      category: 'Physics',
      status: 'unanswered',
      tags: ['electromagnetism', 'coaxial', 'inductance'],
      date: '5 hours ago',
      likes: 3,
      replies: []
    }
  ]);

  // Dynamic filter logic
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchCategory = activeCategory === 'All' ? true : q.category === activeCategory;
      const matchSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          q.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [questions, activeCategory, searchQuery]);

  // Overall Board Statistics
  const statistics = useMemo(() => {
    const totalCount = questions.length;
    const unansweredCount = questions.filter(q => q.status === 'unanswered').length;
    const verifiedCount = questions.filter(q => q.status === 'faculty verified').length;
    
    return {
      totalCount,
      unansweredCount,
      verifiedCount
    };
  }, [questions]);

  // Categories list sidebar
  const categories = [
    { name: 'All Subjects', label: 'All', count: questions.length },
    { name: 'Computer Science', label: 'Computer Science', count: questions.filter(q => q.category === 'Computer Science').length },
    { name: 'Mathematics', label: 'Mathematics', count: questions.filter(q => q.category === 'Mathematics').length },
    { name: 'Physics', label: 'Physics', count: questions.filter(q => q.category === 'Physics').length },
    { name: 'Chemistry', label: 'Chemistry', count: questions.filter(q => q.category === 'Chemistry').length }
  ];

  // Upvote Question
  const handleUpvoteQuestion = (qId: string) => {
    setQuestions(prev =>
      prev.map(q => {
        if (q.id === qId) {
          const hasUpvoted = !q.hasUpvoted;
          return {
            ...q,
            hasUpvoted,
            likes: hasUpvoted ? q.likes + 1 : q.likes - 1
          };
        }
        return q;
      })
    );
  };

  // Submit new doubt
  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!askTitle.trim() || !askExplanation.trim()) {
      notify({ type: 'error', title: 'Fields Incomplete', message: 'Please provide both question title and description.' });
      return;
    }

    const newTags = askTagsText
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const newQuestion: ForumQuestion = {
      id: `QNA-${Math.floor(100 + Math.random() * 900)}`,
      title: askTitle.trim(),
      explanation: askExplanation.trim(),
      author: 'Sahil Sharma (6th Sem)',
      category: askCategory,
      status: 'unanswered',
      tags: newTags,
      date: 'Just now',
      likes: 0,
      replies: []
    };

    setQuestions(prev => [newQuestion, ...prev]);
    setAskTitle('');
    setAskExplanation('');
    setShowAskForm(false);

    notify({
      type: 'success',
      title: 'Academic Question Published',
      message: `Your doubt in ${askCategory} is successfully listed in search indexes.`,
      duration: 4000
    });
  };

  // Inline submit nested reply/answer
  const handleAddReply = (qId: string) => {
    const text = replyInputText[qId] ?? '';
    if (!text.trim()) return;

    const newReply: ForumReply = {
      id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
      author: 'Sahil Sharma (6th Sem)',
      role: 'student',
      content: text.trim(),
      time: 'Just now',
      likes: 0
    };

    setQuestions(prev =>
      prev.map(q => {
        if (q.id === qId) {
          const updatedReplies = [...q.replies, newReply];
          return {
            ...q,
            replies: updatedReplies,
            status: q.status === 'unanswered' ? 'answered' : q.status
          };
        }
        return q;
      })
    );

    // Clear input
    setReplyInputText(prev => ({ ...prev, [qId]: '' }));

    notify({
      type: 'success',
      title: 'Reply Submitted Successfully',
      message: 'Your answer has been appended to the threaded doubt discussion.',
      duration: 3000
    });
  };

  return (
    <PageContainer breadcrumbs={[{ label: 'Discussion Board' }, { label: 'Academic Q&A' }]}>
      
      {/* Upper header section */}
      <div className={styles.headerBar}>
        <div>
          <h2 className={styles.headerTitle}>Academic Q&A Discussion Forum</h2>
          <p className={styles.headerSubtitle}>
            Solve complex coding limits, inspect Stokes integrals orientations, query vector indices, and read certified faculty answers.
          </p>
        </div>
        <div>
          <Button
            variant="gold"
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => setShowAskForm(prev => !prev)}
          >
            Ask a Doubt
          </Button>
        </div>
      </div>

      {/* Forum Split layout grid */}
      <div className={styles.forumSplitGrid}>
        
        {/* Left column sidebar: Categories */}
        <div className={styles.categoriesRoster}>
          <Card>
            <CardHeader title="Subject Curations" subtitle="Browse by academic fields." />
            <CardBody className={styles.noPadding}>
              <div className={styles.categoriesRoster} style={{ padding: '12px' }}>
                {categories.map(cat => {
                  const isActive = cat.label === activeCategory;
                  
                  return (
                    <div
                      key={cat.name}
                      onClick={() => setActiveCategory(cat.label)}
                      className={`${styles.categoryItem} ${isActive ? styles.activeCategoryItem : ''}`}
                    >
                      <span className={styles.categoryTitleText}>{cat.name}</span>
                      <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', background: 'var(--color-bg-card)', padding: '1px 6px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)' }}>
                        {cat.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Central main workspace feed */}
        <div className={styles.feedWorkspace}>
          
          {/* Search bar input row */}
          <div className={styles.searchHeaderRow}>
            <div className={styles.searchWrapper}>
              <Search size={14} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search academic questions, doubt codes, or keywords..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>

          {/* Ask Question Console dropdown form */}
          {showAskForm && (
            <Card>
              <CardHeader title="Submit an Academic Doubt" subtitle="Fill details to list your question in student pipelines." />
              <CardBody className={styles.noPadding}>
                <form onSubmit={handleCreateQuestion} className={styles.askFormBox}>
                  <label className={styles.askLabel}>
                    <span>Doubt Title / Core Question</span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Proving vanishing gradients in RNNs"
                      value={askTitle}
                      onChange={e => setAskTitle(e.target.value)}
                      className={styles.askInput}
                    />
                  </label>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                    <label className={styles.askLabel}>
                      <span>Target Subject</span>
                      <select
                        value={askCategory}
                        onChange={e => setAskCategory(e.target.value as any)}
                        className={styles.askSelect}
                      >
                        <option value="Computer Science">Computer Science</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                      </select>
                    </label>

                    <label className={styles.askLabel}>
                      <span>Topic tags (Comma separated)</span>
                      <input
                        type="text"
                        placeholder="e.g. neural, vectors, calculation"
                        value={askTagsText}
                        onChange={e => setAskTagsText(e.target.value)}
                        className={styles.askInput}
                      />
                    </label>
                  </div>

                  <label className={styles.askLabel}>
                    <span>Detailed explanation / Problem brief</span>
                    <textarea
                      rows={4}
                      required
                      placeholder="Explain what steps you tried, what compiler logs you get, or vector formulas..."
                      value={askExplanation}
                      onChange={e => setAskExplanation(e.target.value)}
                      className={styles.askInput}
                      style={{ resize: 'vertical' }}
                    />
                  </label>

                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '6px' }}>
                    <Button variant="ghost" size="sm" type="button" onClick={() => setShowAskForm(false)}>Cancel</Button>
                    <Button variant="gold" size="sm" type="submit">Submit Doubt</Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          )}

          {/* Q&A Doubt Feed List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredQuestions.length === 0 ? (
              <Card>
                <CardBody>
                  <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--color-text-muted)' }}>
                    <span>No academic doubts match your active query. Start by asking a question!</span>
                  </div>
                </CardBody>
              </Card>
            ) : (
              filteredQuestions.map(q => (
                <Card key={q.id} className={styles.qaCard}>
                  
                  {/* Card upper info row */}
                  <div className={styles.qaHeaderRow}>
                    <div className={styles.qaMetaLeft}>
                      <span className={styles.qaAuthorName}>{q.author}</span>
                      <span className={styles.qaDateSub}>{q.date} • Subject: <strong>{q.category}</strong></span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <StageChip
                        stage={q.status === 'faculty verified' ? 'green' : q.status === 'answered' ? 'blue' : q.status === 'unanswered' ? 'yellow' : 'gray'}
                        label={q.status.toUpperCase()}
                      />
                    </div>
                  </div>

                  {/* Question details body */}
                  <div className={styles.qaBodyContent}>
                    <h4 className={styles.qaQuestionTitle}>{q.title}</h4>
                    <p className={styles.qaQuestionExplanation}>{q.explanation}</p>
                    
                    <div className={styles.qaTagsList}>
                      {q.tags.map(tag => (
                        <span key={tag} className={styles.tagChip}>#{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* Threaded answers / replies list */}
                  {q.replies.length > 0 && (
                    <div>
                      <div className={styles.repliesContainerTitle}>Threaded Answers ({q.replies.length})</div>
                      <div className={styles.repliesList}>
                        {q.replies.map(reply => {
                          const isFaculty = reply.role === 'faculty';
                          
                          return (
                            <div key={reply.id} className={isFaculty ? styles.facultyVerifiedCard : styles.replyItemCard}>
                              {isFaculty && (
                                <div className={styles.facultyBadgeRow}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-gold)' }}>
                                    <Award size={14} />
                                    <strong style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>FACULTY VERIFIED ANSWER</strong>
                                  </div>
                                  <CheckCircle size={14} style={{ color: 'var(--stage-green-text)' }} />
                                </div>
                              )}

                              <strong className={styles.facultyAuthor}>
                                {reply.author} {isFaculty && '(Academic Dean)'}
                              </strong>
                              <p className={styles.replyBodyText}>{reply.content}</p>
                              
                              <div className={styles.replyMetaFooter}>
                                <span>{reply.time}</span>
                                <span style={{ fontFamily: 'monospace' }}>REPLY ID: {reply.id}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Inline reply forms */}
                  <div className={styles.qaQuickReplyForm}>
                    <div className={styles.qaReplyInputRow}>
                      <input
                        type="text"
                        placeholder="Write a helpful explanation or answer..."
                        value={replyInputText[q.id] ?? ''}
                        onChange={e => setReplyInputText(prev => ({ ...prev, [q.id]: e.target.value }))}
                        className={styles.askInput}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            handleAddReply(q.id);
                          }
                        }}
                      />
                      
                      <Button
                        variant="gold"
                        size="sm"
                        icon={<Send size={12} />}
                        onClick={() => handleAddReply(q.id)}
                        disabled={!(replyInputText[q.id] ?? '').trim()}
                      >
                        Reply
                      </Button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '8px', borderTop: '1px dashed var(--color-border-subtle)' }}>
                      <button type="button"
                        onClick={() => handleUpvoteQuestion(q.id)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: q.hasUpvoted ? 'var(--stage-orange-text)' : 'var(--color-text-secondary)' }}
                      >
                        <ThumbsUp size={12} />
                        <strong style={{ fontSize: '11px' }}>{q.likes} Thumbs Up</strong>
                      </button>
                      <span style={{ fontSize: '9px', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>QID: {q.id}</span>
                    </div>
                  </div>

                </Card>
              ))
            )}
          </div>

        </div>

        {/* Right column sidebar: Statistics & trending discussions */}
        <div className={styles.rightSidebar}>
          
          {/* Forum metrics card */}
          <Card>
            <CardHeader title="Academic Board Statistics" subtitle="Query resolution ratios." />
            <CardBody className={styles.noPadding}>
              <div className={styles.repliesList} style={{ gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--color-border-subtle)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Total Doubts Registered:</span>
                  <strong style={{ fontSize: '12px', color: 'var(--color-brown-dark)' }}>{statistics.totalCount} Questions</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--color-border-subtle)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Pending Responses:</span>
                  <strong style={{ fontSize: '12px', color: 'var(--color-gold)' }}>{statistics.unansweredCount} unanswered</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Faculty Certified:</span>
                  <strong style={{ color: 'var(--stage-green-text)', fontSize: '12px' }}>{statistics.verifiedCount} verified</strong>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Subject curation trends list */}
          <Card>
            <CardHeader title="Subject Trending boards" subtitle="Tough doubts in circulation." />
            <CardBody className={styles.noPadding}>
              <div className={styles.repliesList}>
                <div className={styles.sidebarListItem}>
                  <strong className={styles.sidebarListTitle}>Stokes Theorem normal vector line bounds alignment</strong>
                  <span className={styles.sidebarListStats}>15 responses • Mathematics</span>
                </div>
                <div className={styles.sidebarListItem}>
                  <strong className={styles.sidebarListTitle}>Vanishing gradient decay factors in 6-layer RNNs</strong>
                  <span className={styles.sidebarListStats}>12 responses • Computer Science</span>
                </div>
                <div className={styles.sidebarListItem}>
                  <strong className={styles.sidebarListTitle}>Internal vs external self-inductance formulas</strong>
                  <span className={styles.sidebarListStats}>3 responses • Physics</span>
                </div>
              </div>
            </CardBody>
          </Card>

        </div>

      </div>

    </PageContainer>
  );
}
