import { useState, useMemo, useEffect } from 'react';
import { PageContainer } from '../layouts';
import { Card, CardBody, CardHeader, Button, StageChip } from '../components/ui';
import { useNotifications } from '../contexts/NotificationContext';
import {
  Target,
  CheckCircle,
  Plus,
  Flame,
  Code,
  BookOpen,
  Trophy,
  Activity,
  Check,
} from 'lucide-react';
import styles from './SuccessHabitsPage.module.css';

interface Habit {
  id: string;
  title: string;
  category: 'Computer Science' | 'Mathematics' | 'Physics' | 'Career' | 'General';
  frequency: string;
  completed: boolean;
  streak: number;
  status: 'gray' | 'blue' | 'purple' | 'orange' | 'green';
}

interface Milestone {
  id: string;
  title: string;
  target: number;
  current: number;
  completed: boolean;
  unit: string;
  associatedMedal: string;
}

interface Achievement {
  id: string;
  title: string;
  desc: string;
  criteria: string;
  unlocked: boolean;
  category: string;
}

const INITIAL_HABITS: Habit[] = [
  {
    id: 'HAB-101',
    title: '3 Hours Coding Practice',
    category: 'Computer Science',
    frequency: 'Daily',
    completed: false,
    streak: 2,
    status: 'blue',
  },
  {
    id: 'HAB-102',
    title: 'Revise Coordinate Integrals & Proofs',
    category: 'Mathematics',
    frequency: 'Daily',
    completed: false,
    streak: 1,
    status: 'purple',
  },
  {
    id: 'HAB-103',
    title: 'Log 1 Hour Placement Prep',
    category: 'Career',
    frequency: 'Daily',
    completed: true,
    streak: 5,
    status: 'green',
  },
  {
    id: 'HAB-104',
    title: 'Review Peer Discussion Forum Q&As',
    category: 'General',
    frequency: 'Daily',
    completed: false,
    streak: 0,
    status: 'gray',
  },
];

const INITIAL_MILESTONES: Milestone[] = [
  {
    id: 'MIL-301',
    title: 'Resolve Spherical Boundary Coordinate Systems',
    target: 30,
    current: 18,
    completed: false,
    unit: 'problems solved',
    associatedMedal: 'Math Genius',
  },
  {
    id: 'MIL-302',
    title: 'Solve DSA LeetCode Array Lists',
    target: 25,
    current: 12,
    completed: false,
    unit: 'challenges passed',
    associatedMedal: 'Algorithm Specialist',
  },
];

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ACH-501',
    title: 'Code Warrior',
    desc: 'Maintain a coding practice streak of 3 or more consecutive days.',
    criteria: '3 Hours Coding Practice streak >= 3',
    unlocked: false,
    category: 'Computer Science',
  },
  {
    id: 'ACH-502',
    title: 'Math Genius',
    desc: 'Solve 30 coordinate systems problems and claim the milestone reward.',
    criteria: 'Coordinate systems milestone completed',
    unlocked: false,
    category: 'Mathematics',
  },
  {
    id: 'ACH-503',
    title: 'Perfect Attendance',
    desc: 'Exceed the standard attendance thresholds in student portal registry.',
    criteria: 'Attendance index > 85%',
    unlocked: true,
    category: 'General',
  },
  {
    id: 'ACH-504',
    title: 'Algorithm Specialist',
    desc: 'Successfully resolve 25 data structure algorithms under active milestones.',
    criteria: 'LeetCode challenges completed',
    unlocked: false,
    category: 'Career',
  },
];

const WEEKDAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function SuccessHabitsPage() {
  const { notify } = useNotifications();

  // State Management
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [milestones, setMilestones] = useState<Milestone[]>(INITIAL_MILESTONES);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [currentStreak, setCurrentStreak] = useState(12); // Starting academic streak

  // Add habit form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<Habit['category']>('Computer Science');
  const [newFrequency, setNewFrequency] = useState('Daily');
  const [showAddForm, setShowAddForm] = useState(false);

  // Track weekly habit completions based on checkboxes
  const weeklyCompletionMap = useMemo(() => {
    // Let's assume Mon, Tue, Wed are past completed days (true)
    // Thu is today, depends on if today's habits are checked (at least one)
    // Fri, Sat, Sun are upcoming
    const todayCompleted = habits.some(h => h.completed);
    return [true, true, true, todayCompleted, false, false, false];
  }, [habits]);

  // Aggregate completion status
  const habitsStats = useMemo(() => {
    const total = habits.length;
    const completed = habits.filter(h => h.completed).length;
    const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0;
    const activeHabitsCount = habits.filter(h => h.streak > 0).length;

    return {
      total,
      completed,
      completionPct,
      activeHabitsCount,
    };
  }, [habits]);

  // Handle checking/unchecking a habit
  const handleToggleHabit = (habitId: string) => {
    setHabits(prev =>
      prev.map(h => {
        if (h.id === habitId) {
          const nextCompleted = !h.completed;
          const nextStreak = nextCompleted ? h.streak + 1 : Math.max(0, h.streak - 1);
          
          // Determine stage color: 
          // Completed -> green
          // Active (streak > 0 but not done today) -> blue
          // Improving (streak >= 3) -> purple
          // Inactive -> gray
          let nextStatus: Habit['status'] = 'gray';
          if (nextCompleted) {
            nextStatus = 'green';
          } else if (nextStreak >= 3) {
            nextStatus = 'purple';
          } else if (nextStreak > 0) {
            nextStatus = 'blue';
          }

          notify({
            type: nextCompleted ? 'success' : 'info',
            title: nextCompleted ? 'Habit Logged!' : 'Habit Unchecked',
            message: nextCompleted
              ? `"${h.title}" completed. Streak advanced to ${nextStreak} days!`
              : `"${h.title}" progress reversed.`,
            duration: 3000,
          });

          return {
            ...h,
            completed: nextCompleted,
            streak: nextStreak,
            status: nextStatus,
          };
        }
        return h;
      })
    );
  };

  // Check achievements requirements after state change
  useEffect(() => {
    // 1. Code Warrior -> Coding streak >= 3
    const codeHabit = habits.find(h => h.title.includes('Coding Practice'));
    const shouldUnlockCodeWarrior = codeHabit ? codeHabit.streak >= 3 : false;

    // Check if we need to update achievement
    setAchievements(prev =>
      prev.map(ach => {
        if (ach.id === 'ACH-501' && !ach.unlocked && shouldUnlockCodeWarrior) {
          notify({
            type: 'success',
            title: '🏅 Medal Unlocked: Code Warrior!',
            message: 'You have sustained code practice for 3 days. Premium gold border unlocked.',
            duration: 5000,
          });
          return { ...ach, unlocked: true };
        }
        return ach;
      })
    );
  }, [habits, notify]);

  // Submit custom student habit
  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      notify({ type: 'error', title: 'Invalid Title', message: 'Please write a descriptive habit target.' });
      return;
    }

    const newHabitObj: Habit = {
      id: `HAB-${Math.floor(100 + Math.random() * 900)}`,
      title: newTitle.trim(),
      category: newCategory,
      frequency: newFrequency,
      completed: false,
      streak: 0,
      status: 'gray',
    };

    setHabits(prev => [...prev, newHabitObj]);
    setNewTitle('');
    setShowAddForm(false);

    notify({
      type: 'success',
      title: 'Success Habit Configured',
      message: `"${newHabitObj.title}" successfully added to academic curriculum trackers.`,
      duration: 3500,
    });
  };

  // Adjust sliders
  const handleSliderChange = (milestoneId: string, value: number) => {
    setMilestones(prev =>
      prev.map(m => (m.id === milestoneId ? { ...m, current: value } : m))
    );
  };

  // Claim milestone rewards
  const handleClaimReward = (milestoneId: string) => {
    const milestone = milestones.find(m => m.id === milestoneId);
    if (!milestone) return;

    if (milestone.current < milestone.target) {
      notify({
        type: 'error',
        title: 'Goal Not Yet Met',
        message: `Please complete ${milestone.target} ${milestone.unit} to claim rewards.`,
      });
      return;
    }

    // Mark milestone as completed
    setMilestones(prev =>
      prev.map(m => (m.id === milestoneId ? { ...m, completed: true } : m))
    );

    // Unlock corresponding medal
    setAchievements(prev =>
      prev.map(ach => {
        if (ach.title === milestone.associatedMedal && !ach.unlocked) {
          notify({
            type: 'success',
            title: `🏅 Milestone Claimed: ${milestone.associatedMedal}!`,
            message: `Double integrals and DSA algorithm indices upgraded. Premium certificate unlocks validated.`,
            duration: 6000,
          });
          return { ...ach, unlocked: true };
        }
        return ach;
      })
    );

    // Increment overall streak as bonus
    setCurrentStreak(prev => prev + 2);
  };

  // Simulate logging study hours manually
  const handleLogStudySession = () => {
    setCurrentStreak(prev => prev + 1);
    notify({
      type: 'success',
      title: 'Study Session Synced',
      message: 'Logged 45 mins learning ledger. Overall streak increased to ' + (currentStreak + 1) + ' days!',
      duration: 4000,
    });
  };

  // Categories helper icons
  const getCategoryIcon = (category: Habit['category']) => {
    switch (category) {
      case 'Computer Science':
        return <Code size={14} style={{ color: 'var(--stage-blue-text, #1e40af)' }} />;
      case 'Mathematics':
        return <BookOpen size={14} style={{ color: 'var(--stage-purple-text, #6b21a8)' }} />;
      case 'Career':
        return <Target size={14} style={{ color: 'var(--stage-orange-text, #c2410c)' }} />;
      default:
        return <Activity size={14} style={{ color: 'var(--color-text-secondary)' }} />;
    }
  };

  return (
    <PageContainer breadcrumbs={[{ label: 'Student Center' }, { label: 'Success Habits' }]}>
      
      {/* Upper header section */}
      <div className={styles.headerBar}>
        <div>
          <h2 className={styles.headerTitle}>Academic Habits & Streaks Ledger</h2>
          <p className={styles.headerSubtitle}>
            Maintain daily coding streaks, configure study milestones, unlock digital parchment medals, and sync progress metrics.
          </p>
        </div>
        <div>
          <Button
            variant="gold"
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => setShowAddForm(prev => !prev)}
          >
            Create Custom Habit
          </Button>
        </div>
      </div>

      {/* KPI Stats Analytics Grid */}
      <div className={styles.analyticsRow}>
        <div className={styles.analyticsCard}>
          <div className={styles.analyticsCardTitleRow}>
            <span>Active Habits Ledger</span>
            <Activity size={16} style={{ color: 'var(--color-gold)' }} />
          </div>
          <strong>{habitsStats.total} Configured</strong>
          <span className={styles.analyticsSubtext}>{habitsStats.activeHabitsCount} with active streaks</span>
        </div>

        <div className={styles.analyticsCard}>
          <div className={styles.analyticsCardTitleRow}>
            <span>Today's Completion</span>
            <CheckCircle size={16} style={{ color: 'var(--stage-green-text, #15803d)' }} />
          </div>
          <strong>{habitsStats.completed} Finished</strong>
          <span className={styles.analyticsSubtext}>{habitsStats.completionPct}% ratio completed today</span>
        </div>

        <div className={styles.analyticsCard}>
          <div className={styles.analyticsCardTitleRow}>
            <span>Continuous Streak</span>
            <Flame size={16} style={{ color: 'var(--stage-orange-text, #c2410c)' }} />
          </div>
          <strong>{currentStreak} Days Active</strong>
          <span className={styles.analyticsSubtext}>Longest streak: 30 days</span>
        </div>

        <div className={styles.analyticsCard}>
          <div className={styles.analyticsCardTitleRow}>
            <span>Earned Achievements</span>
            <Trophy size={16} style={{ color: 'var(--color-gold)' }} />
          </div>
          <strong>{achievements.filter(a => a.unlocked).length} Medals Unlocked</strong>
          <span className={styles.analyticsSubtext}>Out of {achievements.length} possible credentials</span>
        </div>
      </div>

      {/* Success Habits Central split layout */}
      <div className={styles.splitLayout}>
        
        {/* Left Column: Habits lists & Milestone sliders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Add Habit overlay form */}
          {showAddForm && (
            <Card>
              <CardHeader title="Add New Success Habit" subtitle="Set daily academic routines to maintain performance." />
              <CardBody className={styles.noPadding}>
                <form onSubmit={handleAddHabit} className={styles.addHabitForm}>
                  <label className={styles.formLabel}>
                    <span>Habit Action Title</span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Solve 3 LeetCode problems, read research paper..."
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      className={styles.formInput}
                    />
                  </label>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                    <label className={styles.formLabel}>
                      <span>Core Discipline</span>
                      <select
                        value={newCategory}
                        onChange={e => setNewCategory(e.target.value as any)}
                        className={styles.formSelect}
                      >
                        <option value="Computer Science">Computer Science</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Physics">Physics</option>
                        <option value="Career">Career Prep</option>
                        <option value="General">General Routine</option>
                      </select>
                    </label>

                    <label className={styles.formLabel}>
                      <span>Tracking Cadence</span>
                      <select
                        value={newFrequency}
                        onChange={e => setNewFrequency(e.target.value)}
                        className={styles.formSelect}
                      >
                        <option value="Daily">Daily Routine</option>
                        <option value="Weekly">Weekly Goal</option>
                      </select>
                    </label>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '6px' }}>
                    <Button variant="ghost" size="sm" type="button" onClick={() => setShowAddForm(false)}>Cancel</Button>
                    <Button variant="gold" size="sm" type="submit">Log Goal</Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          )}

          {/* Daily Habits Checklist Card */}
          <Card>
            <CardHeader
              title="Daily Routine Checklist"
              subtitle="Tick completed habits to record streaks and trigger achievement gold medals."
            />
            <CardBody className={styles.noPadding}>
              <div className={styles.habitsContainer}>
                {habits.map(habit => (
                  <div
                    key={habit.id}
                    className={`${styles.habitItem} ${habit.completed ? styles.habitCompletedItem : ''}`}
                  >
                    <div className={styles.habitLeft}>
                      <div
                        onClick={() => handleToggleHabit(habit.id)}
                        className={`${styles.checkboxWrapper} ${habit.completed ? styles.checkboxChecked : ''}`}
                      >
                        {habit.completed && <Check size={12} strokeWidth={3} />}
                      </div>
                      
                      <div className={styles.habitDetails}>
                        <span className={`${styles.habitTitle} ${habit.completed ? styles.habitTitleCompleted : ''}`}>
                          {habit.title}
                        </span>
                        <div className={styles.habitMeta}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {getCategoryIcon(habit.category)}
                            <strong>{habit.category}</strong>
                          </span>
                          <span>•</span>
                          <span>{habit.frequency}</span>
                          <span>•</span>
                          <span style={{ fontFamily: 'monospace' }}>ID: {habit.id}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.habitRight}>
                      {habit.streak > 0 && (
                        <div className={styles.streakBadge}>
                          <Flame size={10} fill="currentColor" />
                          <span>{habit.streak}d streak</span>
                        </div>
                      )}
                      
                      <StageChip
                        stage={habit.completed ? 'green' : habit.streak >= 3 ? 'purple' : habit.streak > 0 ? 'blue' : 'gray'}
                        label={habit.completed ? 'COMPLETED' : habit.streak >= 3 ? 'IMPROVING' : habit.streak > 0 ? 'ACTIVE' : 'INACTIVE'}
                        size="sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Goals and Milestones Sliders Card */}
          <Card>
            <CardHeader title="Curriculum Target Milestones" subtitle="Adjust sliders to log progress and claim golden medals." />
            <CardBody className={styles.noPadding}>
              <div className={styles.milestonesContainer}>
                {milestones.map(milestone => {
                  return (
                    <div key={milestone.id} className={styles.milestoneBox}>
                      <div className={styles.milestoneHeader}>
                        <div>
                          <strong className={styles.milestoneTitle}>{milestone.title}</strong>
                          <p className={styles.milestoneInstruction}>
                            Adjust slider values to reflect problem completion sets. Claim requires{' '}
                            <strong>{milestone.target} {milestone.unit}</strong>.
                          </p>
                        </div>
                        <StageChip
                          stage={milestone.completed ? 'green' : milestone.current >= milestone.target ? 'orange' : 'blue'}
                          label={milestone.completed ? 'CLAIMED' : milestone.current >= milestone.target ? 'MILESTONE MET' : 'IN PROGRESS'}
                          size="sm"
                        />
                      </div>

                      <div className={styles.sliderWrapper}>
                        <div className={styles.sliderRow}>
                          <input
                            type="range"
                            min="0"
                            max={milestone.target * 1.5}
                            value={milestone.current}
                            disabled={milestone.completed}
                            onChange={e => handleSliderChange(milestone.id, parseInt(e.target.value))}
                            className={styles.sliderInput}
                          />
                          <span className={styles.sliderValueLabel}>
                            {milestone.current} / {milestone.target}
                          </span>
                        </div>

                        <div className={styles.rewardClaimRow}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>
                              Associated Credential: <strong>🏅 {milestone.associatedMedal}</strong>
                            </span>
                          </div>

                          {!milestone.completed ? (
                            <Button
                              variant="gold"
                              size="sm"
                              disabled={milestone.current < milestone.target}
                              onClick={() => handleClaimReward(milestone.id)}
                              style={{ padding: '2px 10px', fontSize: '10px' }}
                            >
                              Claim Reward Medal
                            </Button>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--stage-green-text)', fontSize: '11px', fontWeight: 'bold' }}>
                              <CheckCircle size={12} />
                              <span>Bonus Streaks Awarded!</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>

        </div>

        {/* Right Column: Glowing streaks, Week ledger and Medal unlocks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Continuous learning streaks visualizer */}
          <Card>
            <CardHeader title="Learning Streaks Ledger" subtitle="Daily calendar checkpoint synchronizer." />
            <CardBody className={styles.noPadding}>
              <div className={styles.streaksCardBody}>
                <div className={styles.glowingStreakWidget}>
                  <div className={styles.streakWidgetLeft}>
                    <span className={styles.streakGlowTitle}>Continuous Active Week</span>
                    <strong className={styles.streakCountText}>
                      {currentStreak} <span>consecutive days</span>
                    </strong>
                  </div>
                  <Flame size={44} style={{ color: 'var(--stage-orange-text, #c2410c)', filter: 'drop-shadow(0 0 6px rgba(194,65,12,0.3))' }} />
                </div>

                <div>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
                    Weekly Calendar Ledger
                  </span>
                  
                  <div className={styles.weeklyGrid}>
                    {WEEKDAY_NAMES.map((day, idx) => {
                      const completed = weeklyCompletionMap[idx];
                      const isToday = idx === 3; // Thu
                      
                      return (
                        <div key={day} className={styles.weekDay} style={isToday ? { borderColor: 'var(--color-gold)', background: '#fffbeb' } : {}}>
                          <span className={styles.weekDayName}>{day}</span>
                          <div className={`${styles.weekDayDot} ${completed ? styles.weekDayDotCompleted : ''}`} />
                          {isToday && <span style={{ fontSize: '7px', color: 'var(--color-gold)', fontWeight: 'bold', textTransform: 'uppercase' }}>Today</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={{ borderTop: '1px dashed var(--color-border-subtle)', paddingTop: '12px', marginTop: '4px' }}>
                  <Button
                    variant="gold"
                    size="sm"
                    style={{ width: '100%' }}
                    onClick={handleLogStudySession}
                  >
                    Log Active Study Session
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Unlocked medals & Achievements dashboard */}
          <Card>
            <CardHeader title="Digital Credentials & Medals" subtitle="Digital achievements authorized by college deans." />
            <CardBody>
              <div className={styles.medalsList}>
                {achievements.map(ach => (
                  <div
                    key={ach.id}
                    className={`${styles.medalCard} ${ach.unlocked ? styles.medalUnlocked : ''}`}
                  >
                    <div className={`${styles.medalIconFrame} ${ach.unlocked ? styles.medalIconFrameUnlocked : ''}`}>
                      <Trophy size={20} />
                    </div>

                    <div className={styles.medalMeta}>
                      <strong className={styles.medalTitle}>
                        {ach.title} {ach.unlocked ? '🏅' : '🔒'}
                      </strong>
                      <span className={styles.medalDesc}>{ach.desc}</span>
                      
                      <div className={styles.medalStatusRow}>
                        <span style={{ fontSize: '8px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                          Target: {ach.criteria}
                        </span>
                        
                        <StageChip
                          stage={ach.unlocked ? 'green' : 'gray'}
                          label={ach.unlocked ? 'UNLOCKED' : 'LOCKED'}
                          size="sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* simulated force unlock trigger for user testing */}
              <div style={{ marginTop: '16px', borderTop: '1px dashed var(--color-border-subtle)', paddingTop: '12px', textAlign: 'center' }}>
                <button type="button"
                  onClick={() => {
                    const firstLocked = achievements.find(a => !a.unlocked);
                    if (firstLocked) {
                      setAchievements(prev =>
                        prev.map(a => (a.id === firstLocked.id ? { ...a, unlocked: true } : a))
                      );
                      notify({
                        type: 'success',
                        title: `🏆 Medal Claimed: ${firstLocked.title}!`,
                        message: `Dean authenticated milestone metrics. Grade credentials logged on ledger.`,
                        duration: 5000,
                      });
                    } else {
                      notify({
                        type: 'info',
                        title: 'All Credentials Unlocked!',
                        message: 'Excellent study status. You are highly synchronized.',
                      });
                    }
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--color-gold)', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Simulate Manual Credentials Review
                </button>
              </div>
            </CardBody>
          </Card>

        </div>

      </div>

    </PageContainer>
  );
}
