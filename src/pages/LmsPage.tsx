import { useState, useMemo } from 'react';
import { PageContainer } from '../layouts';
import { Card, CardBody, CardHeader, Button, StageChip } from '../components/ui';
import { useNotifications } from '../hooks/useNotifications';
import {
  BookOpen,
  Play,
  Pause,
  Award,
  CheckCircle,
  FileText,
  Upload,
  Sparkles,
  Check,
  Download,
  AlertTriangle,
} from 'lucide-react';
import styles from './LmsPage.module.css';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
}

interface CourseRecord {
  id: string;
  title: string;
  department: string;
  instructor: string;
  lessons: Lesson[];
  quizCompleted: boolean;
  assignmentSubmitted: boolean;
  assignmentStatus: 'not started' | 'in progress' | 'submitted' | 'review' | 'completed';
}

const INITIAL_COURSES: CourseRecord[] = [
  {
    id: 'LMS-201',
    title: 'Deep Learning & Neural Networks',
    department: 'Computer Science & Engineering',
    instructor: 'Dr. Sarah Jenkins',
    quizCompleted: false,
    assignmentSubmitted: false,
    assignmentStatus: 'in progress',
    lessons: [
      { id: 'LES-01', title: 'Introduction to Backpropagation & Loss', duration: '12:40', completed: true },
      { id: 'LES-02', title: 'Gradient Descent Optimization Methods', duration: '18:15', completed: true },
      { id: 'LES-03', title: 'Convolutional Layer Mechanics & Filters', duration: '22:30', completed: false },
      { id: 'LES-04', title: 'Recurrent Architectures & LSTM Nodes', duration: '19:45', completed: false },
      { id: 'LES-05', title: 'Transformer Models & Attention Modules', duration: '28:10', completed: false }
    ]
  },
  {
    id: 'LMS-202',
    title: 'Advanced Vector Calculus & Spaces',
    department: 'Mathematics & General Science',
    instructor: 'Amit Kulkarni',
    quizCompleted: false,
    assignmentSubmitted: false,
    assignmentStatus: 'not started',
    lessons: [
      { id: 'LES-21', title: 'Double Integrals & Polar Coordinates', duration: '15:20', completed: true },
      { id: 'LES-22', title: 'Green\'s Theorem & Line Integral Bounds', duration: '20:10', completed: false },
      { id: 'LES-23', title: 'Stokes\' Theorem Vector Assertions', duration: '24:05', completed: false },
      { id: 'LES-24', title: 'Divergence Proofs in Three Dimensions', duration: '18:40', completed: false }
    ]
  },
  {
    id: 'LMS-203',
    title: 'Data Structures & Algorithmic Bounds',
    department: 'Information Technology',
    instructor: 'Swati Sen',
    quizCompleted: true,
    assignmentSubmitted: true,
    assignmentStatus: 'completed',
    lessons: [
      { id: 'LES-31', title: 'Asymptotic Analysis & Big-O Margins', duration: '14:50', completed: true },
      { id: 'LES-32', title: 'Red-Black Trees & Self Balancing Nodes', duration: '25:15', completed: true },
      { id: 'LES-33', title: 'Graph Traversal & Dijkstra Shortest Path', duration: '21:30', completed: true }
    ]
  },
  {
    id: 'LMS-204',
    title: 'Operating Systems & Process Models',
    department: 'Computer Science & Engineering',
    instructor: 'Prof. Amit Kulkarni',
    quizCompleted: false,
    assignmentSubmitted: false,
    assignmentStatus: 'in progress',
    lessons: [
      { id: 'LES-41', title: 'Process Scheduling & CPU Burst Cycles', duration: '16:20', completed: true },
      { id: 'LES-42', title: 'Deadlock Detection & Banker Algorithm', duration: '22:45', completed: true },
      { id: 'LES-43', title: 'Virtual Memory & Page Replacement Policies', duration: '19:10', completed: false },
      { id: 'LES-44', title: 'File Systems & Disk Scheduling Strategies', duration: '17:30', completed: false },
      { id: 'LES-45', title: 'Inter-Process Communication & Semaphores', duration: '24:15', completed: false }
    ]
  },
  {
    id: 'LMS-205',
    title: 'Database Management Systems & SQL',
    department: 'Information Technology',
    instructor: 'Swati Sen',
    quizCompleted: false,
    assignmentSubmitted: true,
    assignmentStatus: 'review',
    lessons: [
      { id: 'LES-51', title: 'ER Modeling & Relational Schema Design', duration: '18:40', completed: true },
      { id: 'LES-52', title: 'SQL Joins & Subquery Optimization', duration: '21:20', completed: true },
      { id: 'LES-53', title: 'Normalization Forms & Functional Dependencies', duration: '23:05', completed: true },
      { id: 'LES-54', title: 'Transaction Control & ACID Properties', duration: '15:50', completed: false }
    ]
  },
  {
    id: 'LMS-206',
    title: 'Software Engineering & Agile Models',
    department: 'Computer Science & Engineering',
    instructor: 'Dr. Sarah Jenkins',
    quizCompleted: true,
    assignmentSubmitted: false,
    assignmentStatus: 'not started',
    lessons: [
      { id: 'LES-61', title: 'SDLC Waterfall & Iterative Lifecycles', duration: '14:15', completed: true },
      { id: 'LES-62', title: 'Agile Scrum Sprints & Kanban Boards', duration: '20:30', completed: true },
      { id: 'LES-63', title: 'UML Class & Sequence Diagram Notation', duration: '18:45', completed: false },
      { id: 'LES-64', title: 'Software Testing & Quality Assurance Metrics', duration: '22:10', completed: false }
    ]
  }
];

const QUIZ_QUESTIONS: Record<string, { question: string; options: string[]; correctIdx: number }> = {
  'LMS-201': {
    question: 'Which of the following activation functions resolves the vanishing gradient problem in deep layers?',
    options: ['Sigmoid', 'Hyperbolic Tangent (Tanh)', 'Rectified Linear Unit (ReLU)', 'Linear Activation'],
    correctIdx: 2
  },
  'LMS-202': {
    question: 'Stokes\' Theorem connects which two mathematical operations?',
    options: ['Line integrals and Double integrals', 'Double integrals and Triple integrals', 'Line integrals and Triple integrals', 'Gradient vectors and Flux densities'],
    correctIdx: 0
  },
  'LMS-203': {
    question: 'What is the worst-case search complexity of a fully balanced Red-Black Tree?',
    options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
    correctIdx: 1
  },
  'LMS-204': {
    question: 'Which page replacement algorithm suffers from Belady\'s anomaly?',
    options: ['Optimal (OPT)', 'Least Recently Used (LRU)', 'First-In First-Out (FIFO)', 'Least Frequently Used (LFU)'],
    correctIdx: 2
  },
  'LMS-205': {
    question: 'Which normal form eliminates transitive functional dependencies?',
    options: ['First Normal Form (1NF)', 'Second Normal Form (2NF)', 'Third Normal Form (3NF)', 'Boyce-Codd Normal Form (BCNF)'],
    correctIdx: 2
  },
  'LMS-206': {
    question: 'In Agile Scrum methodology, what is a time-boxed iteration called?',
    options: ['Milestone', 'Sprint', 'Epoch', 'Release Cycle'],
    correctIdx: 1
  }
};

export function LmsPage() {
  const { notify } = useNotifications();

  // State Management
  const [courses, setCourses] = useState<CourseRecord[]>(INITIAL_COURSES);
  const [activeCourseId, setActiveCourseId] = useState('LMS-201');
  const [activeLessonId, setActiveLessonId] = useState('LES-03');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [selectedQuizOpt, setSelectedQuizOpt] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  // Faculty form state
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonDuration, setNewLessonDuration] = useState('15:00');

  // Currently active course & lesson bindings
  const activeCourse = useMemo(() => {
    return courses.find(c => c.id === activeCourseId) ?? courses[0];
  }, [courses, activeCourseId]);

  const activeLesson = useMemo(() => {
    return activeCourse.lessons.find(l => l.id === activeLessonId) ?? activeCourse.lessons[0];
  }, [activeCourse, activeLessonId]);

  // Recalculate Course progress percentage
  // Progress weights: (completed lessons count / total lessons) * 0.70 + (quiz completed * 0.15) + (assignment submitted * 0.15)
  const courseProgress = useMemo(() => {
    const map: Record<string, number> = {};
    courses.forEach(c => {
      const completedCount = c.lessons.filter(l => l.completed).length;
      const lessonRatio = completedCount / c.lessons.length;
      
      const quizBonus = c.quizCompleted ? 15 : 0;
      const assignBonus = c.assignmentSubmitted ? 15 : 0;
      
      const pct = Math.min(100, Math.round((lessonRatio * 70) + quizBonus + assignBonus));
      map[c.id] = pct;
    });
    return map;
  }, [courses]);

  // Aggregate student learning analytics
  const analytics = useMemo(() => {
    const totalCreditHrs = courses.length * 4;
    const completedLessons = courses.flatMap(c => c.lessons).filter(l => l.completed).length;
    const certsCount = Object.values(courseProgress).filter(p => p === 100).length;
    
    return {
      totalCreditHrs,
      completedLessons,
      certsCount,
      averageScore: 92
    };
  }, [courses, courseProgress]);

  // Toggle play/pause mock scrubbing
  const handleTogglePlay = () => {
    setIsVideoPlaying(prev => !prev);
    notify({
      type: 'info',
      title: isVideoPlaying ? 'Video Paused' : 'Playing Lesson Video',
      message: `Scrubbing streaming connection at 1080p.`,
      duration: 1500
    });
  };

  // Mark lesson as completed
  const handleMarkLessonComplete = (lessonId: string) => {
    setCourses(prev =>
      prev.map(c => {
        if (c.id === activeCourseId) {
          const updatedLessons = c.lessons.map(l =>
            l.id === lessonId ? { ...l, completed: true } : l
          );
          return { ...c, lessons: updatedLessons };
        }
        return c;
      })
    );

    notify({
      type: 'success',
      title: 'Lesson Progress Logged',
      message: 'Course syllabus registry updated and synced to student record.',
      duration: 3000
    });
  };

  // Submit quiz answer logic
  const handleSubmitQuiz = () => {
    if (selectedQuizOpt === null) {
      notify({ type: 'error', title: 'No Option Selected', message: 'Please select one multiple-choice option to submit.' });
      return;
    }

    const correctIndex = QUIZ_QUESTIONS[activeCourseId]?.correctIdx ?? 0;
    if (selectedQuizOpt === correctIndex) {
      setCourses(prev =>
        prev.map(c => (c.id === activeCourseId ? { ...c, quizCompleted: true } : c))
      );
      setQuizFeedback('Correct Answer! 100% Score recorded in learning index.');
      notify({
        type: 'success',
        title: 'Quiz Passed!',
        message: 'Calculated yield updated. 15% bonus added to course metrics.',
        duration: 4000
      });
    } else {
      setQuizFeedback('Incorrect choice. Please review neural weights and try again.');
      notify({
        type: 'info',
        title: 'Quiz Attempt Failed',
        message: 'Grading failed. Tutors suggest revising course literature.',
        duration: 3500
      });
    }
  };

  // Submit mock student essay assignment
  const handleUploadAssignment = () => {
    setCourses(prev =>
      prev.map(c => (c.id === activeCourseId ? {
        ...c,
        assignmentSubmitted: true,
        assignmentStatus: 'submitted'
      } : c))
    );

    notify({
      type: 'success',
      title: 'Assignment Submitted',
      message: 'Calculus/Neural proof files transmitted to faculty reviewer panel.',
      duration: 4000
    });

    // Simulate faculty review shifting status to Completed after 3 seconds
    setTimeout(() => {
      setCourses(prev =>
        prev.map(c => (c.id === activeCourseId ? {
          ...c,
          assignmentStatus: 'completed'
        } : c))
      );
      notify({
        type: 'success',
        title: 'Assignment Graded',
        message: `Instructor verified work for ${activeCourse.title}. Grade: Excellent (A+).`,
        duration: 4500
      });
    }, 4500);
  };

  // Faculty appends a new lesson
  const handlePublishLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle.trim()) {
      notify({ type: 'error', title: 'Missing Title', message: 'Please write a descriptive title for the new course lecture.' });
      return;
    }

    const newLessonObj: Lesson = {
      id: `LES-${Math.floor(100 + Math.random() * 900)}`,
      title: newLessonTitle.trim(),
      duration: newLessonDuration,
      completed: false
    };

    setCourses(prev =>
      prev.map(c => {
        if (c.id === activeCourseId) {
          return { ...c, lessons: [...c.lessons, newLessonObj] };
        }
        return c;
      })
    );

    setNewLessonTitle('');
    notify({
      type: 'success',
      title: 'Course Syllabus Modified',
      message: `"${newLessonObj.title}" published successfully. Active students notified.`,
      duration: 4000
    });
  };

  return (
    <PageContainer breadcrumbs={[{ label: 'LMS Platform' }, { label: 'Course Playground' }]}>
      
      {/* Upper header section */}
      <div className={styles.headerBar}>
        <div>
          <h2 className={styles.headerTitle}>Academic LMS & Course Player</h2>
          <p className={styles.headerSubtitle}>
            Review syllabus milestones, complete high-fidelity video training lectures, secure credentials, and complete interactive assignments.
          </p>
        </div>
      </div>

      {/* KPI Stats Analytics Grid */}
      <div className={styles.analyticsRow}>
        <div className={styles.analyticsCard}>
          <div className={styles.analyticsCardTitleRow}>
            <span>Enrolled Course load</span>
            <BookOpen size={16} style={{ color: 'var(--color-gold)' }} />
          </div>
          <strong>{courses.length} Active Courses</strong>
          <span className={styles.analyticsSubtext}>12 Credit hours load</span>
        </div>

        <div className={styles.analyticsCard}>
          <div className={styles.analyticsCardTitleRow}>
            <span>Finished Lectures</span>
            <CheckCircle size={16} style={{ color: 'var(--stage-green-text, #15803d)' }} />
          </div>
          <strong>{analytics.completedLessons} Modules Logged</strong>
          <span className={styles.analyticsSubtext}>Cumulative study progress</span>
        </div>

        <div className={styles.analyticsCard}>
          <div className={styles.analyticsCardTitleRow}>
            <span>Academic Certificates</span>
            <Award size={16} style={{ color: 'var(--color-gold)' }} />
          </div>
          <strong>{analytics.certsCount} Secured</strong>
          <span className={styles.analyticsSubtext}>Progressed to 100% completion</span>
        </div>

        <div className={styles.analyticsCard}>
          <div className={styles.analyticsCardTitleRow}>
            <span>Calculated Score GPA</span>
            <Sparkles size={16} style={{ color: 'var(--stage-blue-text, #1e40af)' }} />
          </div>
          <strong>{analytics.averageScore}% Grade Index</strong>
          <span className={styles.analyticsSubtext}>Across active quizzes</span>
        </div>
      </div>

      {/* LMS Central Split Layout */}
      <div className={styles.lmsSplitLayout}>
        
        {/* Sidebar Active Courses selection list */}
        <div className={styles.coursesSidebar}>
          <Card>
            <CardHeader title="Syllabus Registry" subtitle="Select active academic coursework." />
            <CardBody className={styles.noPadding}>
              <div className={styles.coursesList}>
                {courses.map(course => {
                  const pct = courseProgress[course.id] || 0;
                  const isActive = course.id === activeCourseId;
                  
                  return (
                    <div
                      key={course.id}
                      onClick={() => {
                        setActiveCourseId(course.id);
                        setSelectedQuizOpt(null);
                        setQuizFeedback(null);
                        const firstUncompleted = course.lessons.find(l => !l.completed) || course.lessons[0];
                        if (firstUncompleted) {
                          setActiveLessonId(firstUncompleted.id);
                        }
                      }}
                      className={`${styles.courseItemCard} ${isActive ? styles.activeCourseCard : ''}`}
                    >
                      <div className={styles.courseHeader}>
                        <div>
                          <strong className={styles.courseTitle}>{course.title}</strong>
                          <span className={styles.courseDept}>{course.department}</span>
                        </div>
                      </div>

                      <div className={styles.courseProgressLine}>
                        <div className={styles.progressBarBackground}>
                          <div className={styles.progressBarFill} style={{ width: `${pct}%` }}></div>
                        </div>
                        <div className={styles.progressLabelRow}>
                          <span>Progress</span>
                          <strong>{pct}%</strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Lesson player & Interactive Playgrounds Workspace */}
        <div className={styles.lmsContentArea}>
          
          {/* Main player display box */}
          <Card className={styles.lessonPlayerCard}>
            <CardHeader
              title={activeCourse.title}
              subtitle={`Instructor: ${activeCourse.instructor} • Course Code: ${activeCourse.id}`}
            />
            <CardBody className={styles.noPadding}>
              <div className={styles.playerGrid}>
                
                {/* Mock Video Playing display */}
                <div className={styles.mockVideoWorkspace}>
                  <div className={styles.videoOverlayTop}>
                    <h5 className={styles.videoTitle}>{activeLesson?.title || 'Lecture Stream'}</h5>
                    <span className={styles.videoBadge}>LECTURE PLAYBACK</span>
                  </div>

                  <div className={styles.videoCentralScreen}>
                    <div onClick={handleTogglePlay} className={styles.playPauseIcon}>
                      {isVideoPlaying ? <Pause size={24} /> : <Play size={24} style={{ marginLeft: '4px' }} />}
                    </div>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>
                      {isVideoPlaying ? 'Streaming Lesson Context...' : 'Lecture Stream Paused'}
                    </span>
                  </div>

                  <div className={styles.scrubbingBarRow}>
                    <div className={styles.videoScrubberContainer}>
                      <div className={styles.videoScrubberFill} style={{ width: isVideoPlaying ? '48%' : '20%' }}></div>
                    </div>
                    <div className={styles.videoDurationLabels}>
                      <span>{isVideoPlaying ? '06:14' : '02:30'}</span>
                      <span>{activeLesson?.duration || '15:00'}</span>
                    </div>
                  </div>
                </div>

                {/* Lesson syllabus index lists */}
                <div className={styles.lessonsSidebarMenu}>
                  <div className={styles.lessonMenuTitle}>Syllabus Lecture Index</div>
                  {activeCourse.lessons.map(lesson => {
                    const isActive = lesson.id === activeLessonId;
                    
                    return (
                      <div
                        key={lesson.id}
                        onClick={() => {
                          setActiveLessonId(lesson.id);
                          setIsVideoPlaying(false);
                        }}
                        className={`${styles.lessonMenuItem} ${isActive ? styles.activeLessonItem : ''}`}
                      >
                        <div className={styles.lessonLeftMeta}>
                          {lesson.completed ? (
                            <CheckCircle size={14} style={{ color: 'var(--stage-green-text)', marginTop: '2px' }} />
                          ) : (
                            <Play size={12} style={{ color: 'var(--color-text-muted)', marginTop: '3px' }} />
                          )}
                          <div className={styles.lessonDetails}>
                            <span className={styles.lessonLabelTitle}>{lesson.title}</span>
                            <span className={styles.lessonDurationText}>{lesson.duration}</span>
                          </div>
                        </div>
                        
                        {!lesson.completed && isActive && (
                          <Button
                            variant="gold"
                            size="sm"
                            style={{ padding: '2px 8px', fontSize: '9px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkLessonComplete(lesson.id);
                            }}
                          >
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>
            </CardBody>
          </Card>

          {/* Secondary Interactivity grid for Quizzes, Homework & Certificates */}
          <div className={styles.lmsInteractivityGrid}>
            
            {/* Interactive Course Quiz Box */}
            <Card>
              <CardHeader title="Module Knowledge Check" subtitle="Secure credit bonuses by passing current chapter evaluation." />
              <CardBody>
                {activeCourse.quizCompleted ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 0', gap: '8px', textAlign: 'center' }}>
                    <CheckCircle size={36} style={{ color: 'var(--stage-green-text)' }} />
                    <strong style={{ color: 'var(--color-brown-dark)', fontSize: '14px' }}>Evaluation Passed Successfully!</strong>
                    <p style={{ fontStyle: 'italic', fontSize: '11px', color: 'var(--color-text-secondary)', maxWidth: '220px', margin: 0 }}>
                      You secured 100% on this topic. Lesson metrics successfully uploaded to transcript databases.
                    </p>
                  </div>
                ) : (
                  <div className={styles.quizContent}>
                    <h5 className={styles.quizQuestionText}>
                      {QUIZ_QUESTIONS[activeCourseId]?.question || 'Revision doubt query loading...'}
                    </h5>
                    
                    <div className={styles.quizOptionsList}>
                      {QUIZ_QUESTIONS[activeCourseId]?.options.map((opt, idx) => (
                        <button type="button"
                          key={idx}
                          onClick={() => setSelectedQuizOpt(idx)}
                          className={`${styles.quizOptionBtn} ${selectedQuizOpt === idx ? styles.quizOptionSelected : ''}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    {quizFeedback && (
                      <div className={`${styles.quizFeedbackRow} ${activeCourse.quizCompleted ? styles.quizSuccessFeedback : styles.quizSuccessFeedback}`}>
                        <span>{quizFeedback}</span>
                      </div>
                    )}

                    <div style={{ marginTop: '8px' }}>
                      <Button
                        variant="gold"
                        size="sm"
                        disabled={selectedQuizOpt === null}
                        onClick={handleSubmitQuiz}
                        style={{ width: '100%' }}
                      >
                        Submit MCQ Answer
                      </Button>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Interactive Homework Assignment Dropzone Box */}
            <Card>
              <CardHeader title="Interactive Homework Submissions" subtitle="Deliver coursework proof files to tutor panels." />
              <CardBody>
                <div className={styles.homeworkBox}>
                  <p className={styles.assignmentInstruction}>
                    Upload backpropagation proofs or differential calculus coordinates sheets matching <strong>{activeCourse.title}</strong> syllabus models.
                  </p>

                  {activeCourse.assignmentSubmitted ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div className={styles.uploadedFileRow}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <FileText size={16} style={{ color: 'var(--color-brown-dark)' }} />
                          <span className={styles.uploadedFileName}>proof_submission_{activeCourse.id.toLowerCase()}.pdf</span>
                        </div>
                        <Check size={14} style={{ color: 'var(--stage-green-text)' }} />
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Review Grade Status:</span>
                        <StageChip stage={activeCourse.assignmentStatus === 'completed' ? 'green' : 'purple'} label={activeCourse.assignmentStatus.toUpperCase()} />
                      </div>
                    </div>
                  ) : (
                    <div onClick={handleUploadAssignment} className={styles.mockDropzone}>
                      <Upload size={22} style={{ color: 'var(--color-gold)', marginBottom: '4px' }} />
                      <span className={styles.dropzoneTitle}>Upload Sample Assignment File</span>
                      <span className={styles.dropzoneSub}>Supports PDF, JPG, or Markdown up to 8MB</span>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>

          </div>

          {/* Tertiary Interactivity Row for Certificates and Faculty Additions */}
          <div className={styles.lmsInteractivityGrid}>
            
            {/* Faculty Lesson publisher form */}
            <Card>
              <CardHeader title="Faculty Lesson Publisher" subtitle="Instructors panel to append new modules to syllabus." />
              <CardBody>
                <form onSubmit={handlePublishLesson} className={styles.uploadForm}>
                  <label className={styles.formLabel}>
                    <span>Syllabus Lecture Title</span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Backpropagation Optimization proof"
                      value={newLessonTitle}
                      onChange={e => setNewLessonTitle(e.target.value)}
                      className={styles.formInput}
                    />
                  </label>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                    <label className={styles.formLabel}>
                      <span>Target Course</span>
                      <select className={styles.formSelect} value={activeCourseId} disabled>
                        <option value={activeCourseId}>{activeCourse.title}</option>
                      </select>
                    </label>

                    <label className={styles.formLabel}>
                      <span>Estimated Stream Duration</span>
                      <select
                        value={newLessonDuration}
                        onChange={e => setNewLessonDuration(e.target.value)}
                        className={styles.formSelect}
                      >
                        <option value="12:00">12:00 mins</option>
                        <option value="15:00">15:00 mins</option>
                        <option value="18:30">18:30 mins</option>
                        <option value="25:00">25:00 mins</option>
                      </select>
                    </label>
                  </div>

                  <div style={{ marginTop: '6px' }}>
                    <Button variant="gold" size="sm" type="submit" style={{ width: '100%' }}>
                      Publish Course Lesson
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>

            {/* Gold foil graduation credential review */}
            <Card>
              <CardHeader title="Gold-Embossed Certificates" subtitle="Authorized digital diploma unlocked upon 100% completion." />
              <CardBody>
                <div className={styles.certificatePreviewBody}>
                  {courseProgress[activeCourseId] !== 100 ? (
                    <div className={styles.certificateLockedState}>
                      <AlertTriangle size={32} style={{ color: 'var(--color-gold)' }} />
                      <span>Certificate Locked</span>
                      <p style={{ fontSize: '10px', color: 'var(--color-text-secondary)', maxWidth: '240px', margin: 0 }}>
                        Current completion is <strong>{courseProgress[activeCourseId]}%</strong>. Mark all lectures as completed, pass the MCQ quiz, and submit the homework assignment to unlock.
                      </p>
                    </div>
                  ) : (
                    <div style={{ width: '100%' }}>
                      <div className={styles.certificateParchmentFrame}>
                        <div className={styles.goldSealContainer}>
                          <Award size={36} className={styles.goldSeal} />
                        </div>
                        <h5 className={styles.certHeader}>CollegeOS Academy</h5>
                        <span className={styles.certTitle}>Certificate of Course Accomplishment</span>
                        
                        <div>
                          <span style={{ fontSize: '9px', color: 'var(--color-text-muted)' }}>AWARDED TO MASTER</span>
                          <br />
                          <strong className={styles.certRecipient}>Sahil Sharma</strong>
                        </div>

                        <p className={styles.certBrief}>
                          for successfully unlocking all syllabus modules, passing evaluations, and demonstrating mastery in <strong className={styles.certCourseTitle}>{activeCourse.title}</strong>.
                        </p>

                        <div className={styles.certFooterRow}>
                          <div className={styles.certSigBlock}>
                            <span className={styles.certSigLine}>Dr. Sarah Jenkins</span>
                            <span className={styles.certSigLabel}>Lead Dean</span>
                          </div>

                          <div className={styles.certSigBlock}>
                            <span className={styles.certSigLine}>Amit Kulkarni</span>
                            <span className={styles.certSigLabel}>Academic Registrar</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ marginTop: '12px' }}>
                        <Button
                          variant="gold"
                          size="sm"
                          icon={<Download size={12} />}
                          style={{ width: '100%' }}
                          onClick={() => notify({
                            type: 'success',
                            title: 'Digital PDF Generated',
                            message: 'Embarkation clearance files cleared. Document sent to download registers.',
                            duration: 3500
                          })}
                        >
                          Download Secure PDF Credential
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>

          </div>

        </div>

      </div>

    </PageContainer>
  );
}
