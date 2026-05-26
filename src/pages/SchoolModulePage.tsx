import { useState, useMemo } from 'react';
import { PageContainer } from '../layouts';
import { Card, CardBody, CardHeader, Button } from '../components/ui';
import { useNotifications } from '../contexts/NotificationContext';
import {
  Users,
  AlertTriangle,
  Search,
  MessageSquare,
  X,
  Clock,
  Send,
  Building,
} from 'lucide-react';
import styles from './SchoolModulePage.module.css';

interface StudentRecord {
  enrollmentId: string;
  name: string;
  branch: string;
  semester: string;
  attendancePct: number;
  cgpa: string;
  status: 'active' | 'warning' | 'pending' | 'inactive' | 'scheduled' | 'critical';
  parentContact: string;
}

interface TimetableSlot {
  id: string;
  time: string;
  subject: string;
  teacher: string;
  classroom: string;
}

interface ExamSchedule {
  id: string;
  name: string;
  date: string;
  branch: string;
  scheduled: boolean;
}

const INITIAL_STUDENTS: StudentRecord[] = [
  {
    enrollmentId: 'ENR-2023-01',
    name: 'Sahil Sharma',
    branch: 'Computer Science',
    semester: '6th Sem',
    attendancePct: 88.4,
    cgpa: '8.92',
    status: 'active',
    parentContact: '+91 98765 01928',
  },
  {
    enrollmentId: 'ENR-2023-02',
    name: 'Ananya Iyer',
    branch: 'Computer Science',
    semester: '6th Sem',
    attendancePct: 92.1,
    cgpa: '9.45',
    status: 'active',
    parentContact: '+91 98765 01988',
  },
  {
    enrollmentId: 'ENR-2024-15',
    name: 'Kabir Malhotra',
    branch: 'Electronics',
    semester: '4th Sem',
    attendancePct: 71.5,
    cgpa: '7.12',
    status: 'warning',
    parentContact: '+91 98765 03382',
  },
  {
    enrollmentId: 'ENR-2025-88',
    name: 'Arjun Singhal',
    branch: 'Mechanical',
    semester: '2nd Sem',
    attendancePct: 62.8,
    cgpa: '6.40',
    status: 'critical',
    parentContact: '+91 98765 04475',
  },
  {
    enrollmentId: 'ENR-2023-09',
    name: 'Priya Pillai',
    branch: 'Computer Science',
    semester: '6th Sem',
    attendancePct: 95.0,
    cgpa: '9.15',
    status: 'active',
    parentContact: '+91 98765 09911',
  },
  {
    enrollmentId: 'ENR-2024-42',
    name: 'Sahil Sharma',
    branch: 'Information Tech',
    semester: '4th Sem',
    attendancePct: 0.0,
    cgpa: '0.00',
    status: 'pending',
    parentContact: '+91 98765 05562',
  },
];

const INITIAL_TIMETABLE: TimetableSlot[] = [
  { id: 'SLT-01', time: '09:00 AM - 10:30 AM', subject: 'Discrete Mathematics', teacher: 'Prof. Amit Kulkarni', classroom: 'L-201' },
  { id: 'SLT-02', time: '10:45 AM - 12:15 PM', subject: 'Deep Learning Trajectories', teacher: 'Dr. Sarah Jenkins', classroom: 'Lab-A' },
  { id: 'SLT-03', time: '01:30 PM - 03:00 PM', subject: 'Vector Fields & Curl Proofs', teacher: 'Prof. Amit Kulkarni', classroom: 'L-304' },
];

const INITIAL_EXAMS: ExamSchedule[] = [
  { id: 'EXM-701', name: 'Mid-Term Discrete Fields', date: '2026-06-02', branch: 'Computer Science', scheduled: true },
  { id: 'EXM-702', name: 'Deep Learning Practicals', date: '2026-06-08', branch: 'Information Tech', scheduled: false },
  { id: 'EXM-703', name: 'Fluid Mechanics End-Sem', date: '2026-06-12', branch: 'Mechanical', scheduled: false },
];

export function SchoolModulePage() {
  const { notify } = useNotifications();

  // State Management
  const [students, setStudents] = useState<StudentRecord[]>(INITIAL_STUDENTS);
  const [timetable, setTimetable] = useState<TimetableSlot[]>(INITIAL_TIMETABLE);
  const [exams, setExams] = useState<ExamSchedule[]>(INITIAL_EXAMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('All');
  
  // Student detail Drawer
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);

  // Leave / Parent SMS communicator
  const [parentMsgStudentId, setParentMsgStudentId] = useState('ENR-2023-01');
  const [parentMsgText, setParentMsgText] = useState('Please note Sahil Sharma has successfully logged 88% attendance.');
  const [msgLogs, setMsgLogs] = useState([
    { id: 'MSG-001', parent: '+91 98765 04475', text: 'URGENT ATTENDANCE WARNING: Raj Singh current logs indicate 62.8% cutoff leakage.', time: '10 mins ago' },
    { id: 'MSG-002', parent: '+91 98765 03382', text: 'Advisory notice: Amit Verma credentials mapped to End-Sem finals.', time: '1 hour ago' },
  ]);

  // Overall Statistics
  const erpMetrics = useMemo(() => {
    const totalEnrolled = students.length;
    const warningCount = students.filter(s => s.status === 'warning' || s.status === 'critical').length;
    
    // Average attendance
    const activeAttendance = students.filter(s => s.attendancePct > 0);
    const avgAttendance = activeAttendance.reduce((acc, curr) => acc + curr.attendancePct, 0) / activeAttendance.length;

    return {
      totalEnrolled,
      warningCount,
      avgAttendance: avgAttendance.toFixed(1),
    };
  }, [students]);

  // Filter students list
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.enrollmentId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchBranch = branchFilter === 'All' ? true : s.branch === branchFilter;
      return matchSearch && matchBranch;
    });
  }, [students, searchQuery, branchFilter]);

  // Reassign Timetable Faculty Slot
  const handleReassignSlotFaculty = (slotId: string, newFacultyName: string) => {
    setTimetable(prev =>
      prev.map(s => s.id === slotId ? { ...s, teacher: newFacultyName } : s)
    );

    notify({
      type: 'success',
      title: 'Timetable Faculty Reassigned',
      message: `Faculty remapped for current daily slot.`,
      duration: 2500
    });
  };

  // Schedule / Shift exam status
  const handleToggleExamScheduled = (examId: string) => {
    let updatedExams: ExamSchedule[] = [];
    setExams(prev => {
      updatedExams = prev.map(e => e.id === examId ? { ...e, scheduled: !e.scheduled } : e);
      return updatedExams;
    });

    const examObj = exams.find(e => e.id === examId);
    if (examObj) {
      const isSched = !examObj.scheduled;
      
      // If computer science exam is scheduled, shift computer science students status to scheduled
      if (examObj.branch === 'Computer Science') {
        setStudents(prev =>
          prev.map(s => {
            if (s.branch === 'Computer Science' && s.status === 'active') {
              return { ...s, status: isSched ? 'scheduled' : 'active' };
            }
            return s;
          })
        );
      }

      notify({
        type: 'success',
        title: isSched ? 'Exam Schedule Published' : 'Exam Schedule Cancelled',
        message: `Schedules synced across student directories.`,
        duration: 3000
      });
    }
  };

  // Dispatch parent SMS alert logs
  const handleSendParentSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentMsgText.trim()) return;

    const studentObj = students.find(s => s.enrollmentId === parentMsgStudentId);
    if (!studentObj) return;

    const newMsg = {
      id: `MSG-${Math.floor(100 + Math.random() * 900)}`,
      parent: studentObj.parentContact,
      text: parentMsgText.trim(),
      time: 'Just now',
    };

    setMsgLogs(prev => [newMsg, ...prev]);
    setParentMsgText('');

    notify({
      type: 'success',
      title: 'ERP Parent Alert Dispatched',
      message: `SMS notification routed successfully to ${studentObj.parentContact}.`,
      duration: 3500
    });
  };

  return (
    <PageContainer breadcrumbs={[{ label: 'Administrative Registry' }, { label: 'School ERP Cockpit' }]}>
      
      {/* Upper header section */}
      <div className={styles.headerBar}>
        <div>
          <h2 className={styles.headerTitle}>Next-Gen Institutional ERP Dashboard</h2>
          <p className={styles.headerSubtitle}>
            Manage student directories, trace academic profiles, reassign class slot faculties, schedule End-Sem exams, and dispatch parent alerts.
          </p>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className={styles.erpKpiRow}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}><Users size={18} /></div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiValue}>{erpMetrics.totalEnrolled} Students</span>
            <span className={styles.kpiLabel}>Total Enrolled Registry</span>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}><Clock size={18} style={{ color: 'var(--stage-green-text)' }} /></div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiValue}>{erpMetrics.avgAttendance}%</span>
            <span className={styles.kpiLabel}>Campus Daily Attendance</span>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}><AlertTriangle size={18} style={{ color: 'var(--stage-orange-text)' }} /></div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiValue}>{erpMetrics.warningCount} Alerts</span>
            <span className={styles.kpiLabel}>Attendance Cutoff Leakage</span>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}><Building size={18} /></div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiValue}>98.2%</span>
            <span className={styles.kpiLabel}>Class Occupancy Ratio</span>
          </div>
        </div>
      </div>

      {/* Main ERP Split Layout Grid */}
      <div className={styles.erpGrid}>
        
        {/* Left column: Student Records Database */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <Card>
            <CardHeader 
              title="Central Searchable Student Dossiers" 
              subtitle="Audits academic records, CGPA sheets, and attendance bounds."
              action={
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select 
                    value={branchFilter}
                    onChange={e => setBranchFilter(e.target.value)}
                    style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '11px', background: 'var(--color-bg-card)', color: 'var(--color-text-primary)' }}
                  >
                    <option value="All">All Branches</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Information Tech">Information Tech</option>
                  </select>
                </div>
              }
            />
            <CardBody className={styles.noPadding}>
              
              <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                <div className={styles.searchWrapper}>
                  <Search size={14} className={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Search student profile by name or enrollment ID..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
              </div>

              <table className={styles.studentTable}>
                <thead>
                  <tr>
                    <th>Enrollment ID</th>
                    <th>Full Name</th>
                    <th>Semester/Branch</th>
                    <th>Attendance</th>
                    <th>Clearance</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--color-text-muted)', fontSize: '12px' }}>
                        No records match the active query.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map(student => (
                      <tr 
                        key={student.enrollmentId} 
                        className={styles.studentRow}
                        onClick={() => setSelectedStudent(student)}
                      >
                        <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{student.enrollmentId}</td>
                        <td style={{ fontWeight: '500' }}>{student.name}</td>
                        <td style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{student.semester} {student.branch.split(' ').pop()}</td>
                        <td style={{ fontWeight: 'bold', color: student.attendancePct < 75 ? 'var(--stage-orange-text)' : 'var(--stage-green-text)' }}>
                          {student.attendancePct}%
                        </td>
                        <td>
                          <span className={`${styles.academicBadge} ${styles[`state-${student.status}`]}`}>
                            {student.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

            </CardBody>
          </Card>

          {/* Timetable Editor Grid */}
          <Card>
            <CardHeader title="Timetable & Lecture Slot Management" subtitle="Dynamic reassignments of faculty slots." />
            <CardBody className={styles.noPadding}>
              <div style={{ padding: '16px' }}>
                <div className={styles.timetableGrid}>
                  {timetable.map(slot => (
                    <div key={slot.id} className={styles.timetableSlot}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div className={styles.slotTime}>
                          <Clock size={12} style={{ marginRight: '4px', display: 'inline' }} />
                          {slot.time}
                        </div>
                        <div className={styles.slotInfo}>
                          <span className={styles.slotTitle}>{slot.subject} ({slot.classroom})</span>
                          <span className={styles.slotTeacher}>Faculty: <strong>{slot.teacher}</strong></span>
                        </div>
                      </div>

                      {/* Dropdown to reassign faculty */}
                      <div onClick={e => e.stopPropagation()}>
                        <select
                          value={slot.teacher}
                          onChange={e => handleReassignSlotFaculty(slot.id, e.target.value)}
                          style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '11px', background: 'var(--color-bg-card)', color: 'var(--color-text-primary)', cursor: 'pointer' }}
                        >
                          <option value="Prof. Amit Kulkarni">Prof. Amit Kulkarni</option>
                          <option value="Dr. Sarah Jenkins">Dr. Sarah Jenkins</option>
                          <option value="Dr. Ramesh Prasad">Dr. Ramesh Prasad</option>
                        </select>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>

        </div>

        {/* Right column: Exams & Parent messenger */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Exam schedules */}
          <Card>
            <CardHeader title="Exam & End-Sem Registry" subtitle="Shift scheduled parameters." />
            <CardBody className={styles.noPadding}>
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {exams.map(exam => (
                    <div key={exam.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--color-border-subtle)', paddingBottom: '8px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <strong style={{ fontSize: '12px', color: 'var(--color-brown-dark)' }}>{exam.name}</strong>
                        <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Target Date: {exam.date} • {exam.branch}</span>
                      </div>
                      <Button
                        variant={exam.scheduled ? 'ghost' : 'gold'}
                        size="sm"
                        style={{ padding: '2px 8px', fontSize: '10px', height: '24px' }}
                        onClick={() => handleToggleExamScheduled(exam.id)}
                      >
                        {exam.scheduled ? 'Cancel' : 'Schedule'}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Parent sms messenger */}
          <Card>
            <CardHeader title="ERP Parent Communication Notifier" subtitle="Dispatches alerts log regarding student clearances." />
            <CardBody className={styles.noPadding}>
              <form onSubmit={handleSendParentSms} style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                
                <label className={styles.formLabel}>
                  <span>Target Student Profile Dossier</span>
                  <select
                    value={parentMsgStudentId}
                    onChange={e => {
                      setParentMsgStudentId(e.target.value);
                      const std = students.find(s => s.enrollmentId === e.target.value);
                      if (std) setParentMsgText(`Advisory notice regarding ${std.name}: current attendance is registered at ${std.attendancePct}%.`);
                    }}
                    className={styles.formSelect}
                  >
                    {students.map(s => (
                      <option key={s.enrollmentId} value={s.enrollmentId}>{s.name} ({s.enrollmentId})</option>
                    ))}
                  </select>
                </label>

                <label className={styles.formLabel}>
                  <span>SMS Warning Alert Content</span>
                  <textarea
                    rows={3}
                    required
                    value={parentMsgText}
                    onChange={e => setParentMsgText(e.target.value)}
                    className={styles.formInput}
                    style={{ resize: 'vertical' }}
                  />
                </label>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="gold" size="sm" type="submit" icon={<Send size={12} />}>Dispatch Notifier</Button>
                </div>

              </form>

              <div style={{ borderTop: '1px solid var(--color-border-subtle)', padding: '16px' }}>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-text-secondary)' }}>Log history list:</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px', maxHeight: '150px', overflowY: 'auto' }}>
                  {msgLogs.map(msg => (
                    <div key={msg.id} style={{ fontSize: '11px', backgroundColor: 'var(--color-bg-input)', padding: '6px 8px', borderRadius: '4px', border: '1px solid var(--color-border-subtle)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: 'var(--color-brown-dark)', marginBottom: '2px' }}>
                        <span>Parent contact: {msg.parent}</span>
                        <span style={{ fontSize: '9px', fontWeight: 'normal', color: 'var(--color-text-muted)' }}>{msg.time}</span>
                      </div>
                      <p style={{ color: 'var(--color-text-primary)' }}>"{msg.text}"</p>
                    </div>
                  ))}
                </div>
              </div>

            </CardBody>
          </Card>

        </div>

      </div>

      {/* Student Dossier Drawer details */}
      {selectedStudent && (
        <div className={styles.drawerOverlay} onClick={() => setSelectedStudent(null)}>
          <div className={styles.drawer} onClick={e => e.stopPropagation()}>
            
            <div className={styles.drawerHeader}>
              <span className={styles.drawerTitle}>Student ERP Dossier</span>
              <button type="button" className={styles.drawerClose} onClick={() => setSelectedStudent(null)}>
                <X size={16} />
              </button>
            </div>

            <div className={styles.drawerBody}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-soft-beige)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-brown-dark)', fontSize: '16px', fontWeight: 'bold' }}>
                  {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--color-brown-dark)' }}>{selectedStudent.name}</strong>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Enrollment ID: {selectedStudent.enrollmentId}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <span className={styles.drawerLabel}>Target Branch</span>
                  <div className={styles.drawerValue}>{selectedStudent.branch}</div>
                </div>
                <div>
                  <span className={styles.drawerLabel}>Semester Year</span>
                  <div className={styles.drawerValue}>{selectedStudent.semester}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <span className={styles.drawerLabel}>Overall CGPA Score</span>
                  <div className={styles.drawerValue} style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{selectedStudent.cgpa} / 10.0</div>
                </div>
                <div>
                  <span className={styles.drawerLabel}>Attendance Ratio</span>
                  <div className={styles.drawerValue} style={{ color: selectedStudent.attendancePct < 75 ? 'var(--stage-orange-text)' : 'var(--stage-green-text)', fontWeight: 'bold' }}>
                    {selectedStudent.attendancePct}%
                  </div>
                </div>
              </div>

              <div>
                <span className={styles.drawerLabel}>Parent Contact Phone</span>
                <div className={styles.drawerValue}>{selectedStudent.parentContact}</div>
              </div>

              <div>
                <span className={styles.drawerLabel}>Academic ERP Status</span>
                <div style={{ marginTop: '4px' }}>
                  <span className={`${styles.academicBadge} ${styles[`state-${selectedStudent.status}`]}`}>
                    {selectedStudent.status}
                  </span>
                </div>
              </div>

              <div style={{ borderTop: '1px dashed var(--color-border-subtle)', paddingTop: '16px' }}>
                <span className={styles.drawerLabel}>Quick Parent Notification Dispatch</span>
                <Button 
                  variant="gold" 
                  size="sm" 
                  fullWidth
                  style={{ marginTop: '6px' }}
                  icon={<MessageSquare size={14} />}
                  onClick={() => {
                    setParentMsgStudentId(selectedStudent.enrollmentId);
                    setParentMsgText(`Urgent Advisory notice regarding ${selectedStudent.name}: overall attendance is registered at ${selectedStudent.attendancePct}%.`);
                    setSelectedStudent(null);
                    notify({ type: 'info', title: 'Remapped Notifier', message: 'SMS composer remapped to current student parent. Verify and click Dispatch.' });
                  }}
                >
                  Load SMS Notifier Composer
                </Button>
              </div>

            </div>

            <div style={{ padding: '16px', borderTop: '1px solid var(--color-border-subtle)', background: 'var(--color-bg-sidebar)', display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="ghost" size="sm" onClick={() => setSelectedStudent(null)}>Close Dossier</Button>
            </div>

          </div>
        </div>
      )}

    </PageContainer>
  );
}
