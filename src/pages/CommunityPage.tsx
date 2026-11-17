import { useState, useMemo } from 'react';
import { PageContainer } from '../layouts';
import { Card, CardBody, CardHeader, Button, StageChip } from '../components/ui';
import { useNotifications } from '../hooks/useNotifications';
import {
  Heart,
  MessageSquare,
  AlertOctagon,
  Check,
  Trash2,
  Send,
  CheckCircle,
} from 'lucide-react';
import styles from './CommunityPage.module.css';

interface CommunityPost {
  id: string;
  author: string;
  group: string;
  time: string;
  content: string;
  likes: number;
  commentsCount: number;
  flagged: boolean;
  flagReason?: string;
  hasLiked?: boolean;
}

interface StudentGroup {
  id: string;
  name: string;
  membersCount: number;
}

export function CommunityPage() {
  const { notify } = useNotifications();

  // State Management
  const [activeGroup, setActiveGroup] = useState('All');
  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: 'PST-001',
      author: 'Aishwarya Iyer (3rd Year)',
      group: 'Robotics Society',
      time: '15 mins ago',
      content: 'We just synchronized our central ROS controllers with the navigation bounds of the autonomous wheelchair project. Huge thanks to everyone who spent late hours in Lab 4!',
      likes: 24,
      commentsCount: 6,
      flagged: false
    },
    {
      id: 'PST-002',
      author: 'Rohit Sen (Dean Liaison)',
      group: 'Placement Cell',
      time: '1 hour ago',
      content: 'Important notice for SE internships: Google registration link closes tonight at 11:59 PM. Please verify your SGPA transcript uploads in the portal before locking.',
      likes: 42,
      commentsCount: 15,
      flagged: false
    },
    {
      id: 'PST-003',
      author: 'Unknown Student',
      group: 'General',
      time: '2 hours ago',
      content: 'Is anyone else finding the advanced vector calculus Stokes integrals sets excessively long? Dr. Kulkarni said it takes 15 mins but it took me 3 hours.',
      likes: 12,
      commentsCount: 9,
      flagged: true,
      flagReason: 'Excessive spam reports'
    },
    {
      id: 'PST-004',
      author: 'Kabir Malhotra (Sports Capt.)',
      group: 'Sports Council',
      time: '3 hours ago',
      content: 'Registrations are open for the annual inter-college badminton league! Trophies and credit rewards points for players who qualify for top brackets.',
      likes: 18,
      commentsCount: 4,
      flagged: false
    },
    {
      id: 'PST-005',
      author: 'Priya Pillai (4th Year)',
      group: 'Coding Club',
      time: '4 hours ago',
      content: 'Just finished a 6-hour competitive programming marathon! Solved 14 out of 18 problems on Codeforces Div 2. Anyone else prepping for ICPC regionals this December?',
      likes: 31,
      commentsCount: 11,
      flagged: false
    },
    {
      id: 'PST-006',
      author: 'Arjun Singhal (2nd Year)',
      group: 'Entrepreneurship Cell',
      time: '5 hours ago',
      content: 'Our startup pitch "GreenRoute" won 2nd place at the IIT-Delhi E-Summit! Thanks to the E-Cell mentors for the mock pitch sessions. Presentation slides available on the shared drive.',
      likes: 55,
      commentsCount: 18,
      flagged: false
    },
    {
      id: 'PST-007',
      author: 'Dr. Sarah Jenkins (Faculty)',
      group: 'General',
      time: '6 hours ago',
      content: 'Reminder: Deep Learning project proposals are due by Friday 5 PM. Teams of 3-4 students. Topics include GANs, transformers, or reinforcement learning agents. Office hours available Thursday 2-4 PM.',
      likes: 38,
      commentsCount: 7,
      flagged: false
    }
  ]);

  const [groups] = useState<StudentGroup[]>([
    { id: 'all', name: 'All Groups', membersCount: 1240 },
    { id: 'robotics', name: 'Robotics Society', membersCount: 180 },
    { id: 'placements', name: 'Placement Cell', membersCount: 420 },
    { id: 'sports', name: 'Sports Council', membersCount: 220 },
    { id: 'arts', name: 'Fine Arts Club', membersCount: 110 },
    { id: 'coding', name: 'Coding Club', membersCount: 310 },
    { id: 'literary', name: 'Literary Society', membersCount: 95 },
    { id: 'ecell', name: 'Entrepreneurship Cell', membersCount: 175 }
  ]);

  // Feed Publisher inputs
  const [newPostText, setNewPostText] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('General');

  // Filtered posts based on active group tag
  const filteredPosts = useMemo(() => {
    return posts.filter(p => {
      if (activeGroup === 'All') return true;
      return p.group === activeGroup;
    });
  }, [posts, activeGroup]);

  // Engagement KPIs calculated dynamically
  const metrics = useMemo(() => {
    const totalLikes = posts.reduce((sum, p) => sum + p.likes, 0);
    const activePostsCount = posts.filter(p => !p.flagged).length;
    const moderationQueueCount = posts.filter(p => p.flagged).length;
    return {
      totalLikes,
      activePostsCount,
      moderationQueueCount
    };
  }, [posts]);

  // Upvote / Like toggler
  const handleLikePost = (postId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const hasLiked = !p.hasLiked;
          return {
            ...p,
            hasLiked,
            likes: hasLiked ? p.likes + 1 : p.likes - 1
          };
        }
        return p;
      })
    );
  };

  // Publish a new post
  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) {
      notify({ type: 'error', title: 'Content Empty', message: 'Please write some text before publishing to the campus feed.' });
      return;
    }

    const newPost: CommunityPost = {
      id: `PST-${Math.floor(100 + Math.random() * 900)}`,
      author: 'Sahil Sharma (6th Sem)',
      group: selectedGroup,
      time: 'Just now',
      content: newPostText.trim(),
      likes: 0,
      commentsCount: 0,
      flagged: false
    };

    setPosts(prev => [newPost, ...prev]);
    setNewPostText('');
    notify({
      type: 'success',
      title: 'Community Note Published',
      message: `Successfully published to "${selectedGroup}" group feed.`,
      duration: 3500
    });
  };

  // Moderation: Approve reported comment
  const handleApproveContent = (postId: string) => {
    setPosts(prev =>
      prev.map(p => (p.id === postId ? { ...p, flagged: false, flagReason: undefined } : p))
    );
    notify({
      type: 'success',
      title: 'Content Cleared',
      message: 'Moderator approved the post. Flagged warning removed.',
      duration: 3000
    });
  };

  // Moderation: Delete reported comment
  const handleRemoveContent = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    notify({
      type: 'info',
      title: 'Content Removed',
      message: 'Moderator deleted flagged comment from all campus database registries.',
      duration: 3500
    });
  };

  return (
    <PageContainer breadcrumbs={[{ label: 'LMS & Community' }, { label: 'Community Feed' }]}>
      
      {/* Upper header section */}
      <div className={styles.headerBar}>
        <div>
          <h2 className={styles.headerTitle}>Campus Community Feed & Interactions</h2>
          <p className={styles.headerSubtitle}>
            Broadcast placements updates, check robotics modules status, participate in sports guilds, and manage discussion moderation queues.
          </p>
        </div>
      </div>

      {/* Primary 3-column Layout */}
      <div className={styles.communitySplitGrid}>
        
        {/* Left column sidebar for Groups */}
        <div className={styles.sidebarGroups}>
          <Card>
            <CardHeader title="Student Chapters" subtitle="Filter feed by societies." />
            <CardBody className={styles.noPadding}>
              <div className={styles.groupsList}>
                {groups.map(grp => {
                  const label = grp.name === 'All Groups' ? 'All' : grp.name;
                  const isActive = label === activeGroup;
                  
                  return (
                    <div
                      key={grp.id}
                      onClick={() => setActiveGroup(label)}
                      className={`${styles.groupItem} ${isActive ? styles.activeGroupItem : ''}`}
                    >
                      <span className={styles.groupTitle}>{grp.name}</span>
                      <span className={styles.groupCount}>{grp.membersCount}</span>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Central main feed section */}
        <div className={styles.feedContainer}>
          
          {/* Post Publisher card at the top */}
          <Card>
            <CardHeader title="Share a Campus Update" subtitle="Publish announcements to registered student chapters." />
            <CardBody className={styles.noPadding}>
              <form onSubmit={handlePublishPost} className={styles.publisherBox}>
                <textarea
                  rows={3}
                  required
                  placeholder="What is happening on campus today? Announce hackathons, share coding notes, or review vector bounds..."
                  value={newPostText}
                  onChange={e => setNewPostText(e.target.value)}
                  className={styles.publisherTextarea}
                />
                
                <div className={styles.publisherFooterRow}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Target Group:</span>
                    <select
                      value={selectedGroup}
                      onChange={e => setSelectedGroup(e.target.value)}
                      className={styles.publisherSelect}
                    >
                      <option value="General">General / All</option>
                      <option value="Robotics Society">Robotics Society</option>
                      <option value="Placement Cell">Placement Cell</option>
                      <option value="Sports Council">Sports Council</option>
                      <option value="Coding Club">Coding Club</option>
                      <option value="Entrepreneurship Cell">Entrepreneurship Cell</option>
                    </select>
                  </label>

                  <Button variant="gold" size="sm" type="submit" icon={<Send size={12} />}>
                    Publish post
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>

          {/* Dynamic Feed Posts Roster */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredPosts.length === 0 ? (
              <Card>
                <CardBody>
                  <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--color-text-muted)' }}>
                    <span>No community updates in this category yet. Be the first to post!</span>
                  </div>
                </CardBody>
              </Card>
            ) : (
              filteredPosts.map(post => (
                <Card key={post.id} className={styles.postCard}>
                  {post.flagged && (
                    <div className={styles.postFlaggedAlert}>
                      <AlertOctagon size={14} />
                      <span>Warning: Flagged by moderator system. Reason: {post.flagReason}</span>
                    </div>
                  )}

                  <div className={styles.postHeader}>
                    <div className={styles.postMetaLeft}>
                      <span className={styles.postAuthorName}>{post.author}</span>
                      <span className={styles.postGroupTag}>{post.time} • Group: <strong>{post.group}</strong></span>
                    </div>
                    <StageChip
                      stage={post.group === 'Placement Cell' ? 'purple' : post.group === 'Robotics Society' ? 'blue' : 'gray'}
                      label={post.group.toUpperCase()}
                    />
                  </div>

                  <CardBody className={styles.noPadding}>
                    <p className={styles.postBodyText}>{post.content}</p>
                  </CardBody>

                  <div className={styles.postFooter}>
                    <div className={styles.interactionRow}>
                      <button type="button"
                        onClick={() => handleLikePost(post.id)}
                        className={styles.interBtn}
                        style={{ color: post.hasLiked ? 'var(--stage-orange-text)' : 'inherit' }}
                      >
                        <Heart size={14} fill={post.hasLiked ? 'currentColor' : 'none'} />
                        <strong>{post.likes} Upvotes</strong>
                      </button>

                      <button
                        type="button"
                        className={styles.interBtn}
                        onClick={() =>
                          notify({
                            type: 'info',
                            title: 'Comments',
                            message: `${post.commentsCount} comments on this post (demo thread).`,
                          })
                        }
                      >
                        <MessageSquare size={14} />
                        <span>{post.commentsCount} Comments</span>
                      </button>
                    </div>
                    
                    <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                      POST ID: {post.id}
                    </span>
                  </div>
                </Card>
              ))
            )}
          </div>

        </div>

        {/* Right column sidebar for Moderation and analytics */}
        <div className={styles.rightSidebar}>
          
          {/* Community KPI Metrics Card */}
          <Card>
            <CardHeader title="Engagement Metrics" subtitle="Active traffic ratios." />
            <CardBody className={styles.noPadding}>
              <div className={styles.popularDiscussionsList} style={{ gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--color-border-subtle)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Total Feed Upvotes:</span>
                  <strong style={{ fontSize: '12px', color: 'var(--color-brown-dark)' }}>{metrics.totalLikes} Hearts</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--color-border-subtle)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Active Publications:</span>
                  <strong style={{ fontSize: '12px', color: 'var(--color-brown-dark)' }}>{metrics.activePostsCount} posts</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Flagged Reports:</span>
                  <strong style={{ fontSize: '12px', color: 'var(--stage-orange-text)' }}>{metrics.moderationQueueCount} flagged</strong>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Moderation queue supervisor cockpit */}
          <Card>
            <CardHeader title="Ambassador Mod Queue" subtitle="Verify reported student comments." />
            <CardBody className={styles.noPadding}>
              <div className={styles.moderationQueue}>
                {posts.filter(p => p.flagged).length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--color-text-muted)', fontSize: '11px', fontStyle: 'italic' }}>
                    <CheckCircle size={22} style={{ color: 'var(--stage-green-text)', display: 'block', margin: '0 auto 6px' }} />
                    <span>All reported posts successfully cleared! Queue is clean.</span>
                  </div>
                ) : (
                  posts.filter(p => p.flagged).map(post => (
                    <div key={post.id} className={styles.modItem}>
                      <div className={styles.modHeader}>
                        <strong>{post.author}</strong>
                        <span>{post.id}</span>
                      </div>
                      <p className={styles.modSnippet}>"{post.content}"</p>
                      <span className={styles.modReason}>REPORT: {post.flagReason}</span>
                      
                      <div className={styles.modActionsRow}>
                        <Button
                          variant="gold"
                          size="sm"
                          style={{ padding: '3px 8px', fontSize: '9px', flexGrow: 1 }}
                          icon={<Check size={10} />}
                          onClick={() => handleApproveContent(post.id)}
                        >
                          Clear Flag
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          style={{ padding: '3px 8px', fontSize: '9px', flexGrow: 1 }}
                          icon={<Trash2 size={10} />}
                          onClick={() => handleRemoveContent(post.id)}
                        >
                          Remove Post
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardBody>
          </Card>

          {/* Campus Hot discussions */}
          <Card>
            <CardHeader title="Popular Conversations" subtitle="Highly tracked announcements." />
            <CardBody className={styles.noPadding}>
              <div className={styles.popularDiscussionsList}>
                <div className={styles.discItem}>
                  <strong className={styles.discTitle}>Badminton Inter-College Tournaments Registrations</strong>
                  <span className={styles.discStats}>220 views • Sports Council</span>
                </div>
                <div className={styles.discItem}>
                  <strong className={styles.discTitle}>Deep Learning Backpropagation and ROS parameters</strong>
                  <span className={styles.discStats}>180 views • Robotics Society</span>
                </div>
                <div className={styles.discItem}>
                  <strong className={styles.discTitle}>Google placement requirements briefing sessions</strong>
                  <span className={styles.discStats}>420 views • Placement Cell</span>
                </div>
              </div>
            </CardBody>
          </Card>

        </div>

      </div>

    </PageContainer>
  );
}
