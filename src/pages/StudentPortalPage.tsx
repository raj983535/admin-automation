import { useState, useMemo } from 'react';
import { PageContainer } from '../layouts';
import { Card, CardBody, CardHeader, Button, StageChip } from '../components/ui';
import { useNotifications } from '../hooks/useNotifications';
import {
  GraduationCap,
  Bell,
  CheckCircle,
  Edit2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import styles from './StudentPortalPage.module.css';

interface StudentProfile {
  name: string;
  enrollmentId: string;
  email: string;
  mobile: string;
  semester: string;
  gpa: number;
  cgpa: number;
  batch: string;
}

interface ClassSlot {
  time: string;
  subject: string;
  instructor: string;
  room: string;
}

interface Notice {
  id: string;
  date: string;
  title: string;
  snippet: string;
  type: 'academic' | 'placements' | 'sports' | 'general';
}

interface FeeDetails {
  total: number;
  paid: number;
  dues: number;
}

interface StudentAssignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
}

const SGPA_HISTORY = [
  { sem: '1st Sem', gpa: 8.6 },
  { sem: '2nd Sem', gpa: 8.9 },
  { sem: '3rd Sem', gpa: 9.1 },
  { sem: '4th Sem', gpa: 8.7 },
  { sem: '5th Sem', gpa: 9.3 }
];

const SUBJECTS_ATTENDANCE = [
  { title: 'Deep Learning & Neural Nets', attended: 22, total: 25, pct: 88, status: 'green' },
  { title: 'Advanced Vector Calculus', attended: 14, total: 20, pct: 70, status: 'orange' },
  { title: 'Data Structures & Algorithms', attended: 23, total: 25, pct: 92, status: 'green' }
];

export function StudentPortalPage() {
  const { notify } = useNotifications();

  // State Management
  const [profile, setProfile] = useState<StudentProfile>({
    name: 'Sahil Sharma',
    enrollmentId: '22CSE809',
    email: 'sahil.sharma@collegeos.edu',
    mobile: '+91 98765 43210',
    semester: '6th Semester',
    gpa: 9.3,
    cgpa: 8.92,
    batch: 'B.Tech CSE (2023-2027)'
  });

  const [fee, setFee] = useState<FeeDetails>({
    total: 120000,
    paid: 90000,
    dues: 30000
  });

  const [assignments, setAssignments] = useState<StudentAssignment[]>([
    { id: 'ASN-401', title: 'Convolutional Layer Mechanics', subject: 'Deep Learning', dueDate: 'May 24, 2026', status: 'pending' },
    { id: 'ASN-402', title: 'Stokes\' Calculus Proofs Set 2', subject: 'Vector Calculus', dueDate: 'May 22, 2026', status: 'pending' },
    { id: 'ASN-403', title: 'Red-Black Self Balancing tree codes', subject: 'Data Structures', dueDate: 'May 18, 2026', status: 'completed' },
    { id: 'ASN-404', title: 'Big-O Asymptotic limits proof', subject: 'Data Structures', dueDate: 'May 12, 2026', status: 'completed' },
    { id: 'ASN-405', title: 'Banker\'s Algorithm Deadlock Analysis', subject: 'Operating Systems', dueDate: 'May 28, 2026', status: 'pending' },
    { id: 'ASN-406', title: 'ER Diagram for Library Management', subject: 'DBMS', dueDate: 'May 26, 2026', status: 'pending' },
    { id: 'ASN-407', title: 'Agile Sprint Retrospective Report', subject: 'Software Engineering', dueDate: 'May 15, 2026', status: 'completed' }
  ]);

  const [notices] = useState<Notice[]>([
    { id: 'NOT-101', date: '2026-05-20', title: 'End-Term Syllabus Lock Updates', snippet: 'All courses end-term theory evaluations scheduled from June 5, 2026. Hall tickets released next week.', type: 'academic' },
    { id: 'NOT-102', date: '2026-05-18', title: 'Volunteers for TechFest 2026 Hackathon', snippet: 'Robotics and Coding societies are hiring organizers. Place registration trunk logs by May 25.', type: 'general' },
    { id: 'NOT-103', date: '2026-05-15', title: 'Google placement drives schedule', snippet: 'Software Engineering internship briefing for 3rd year B.Tech. CSE batches on May 23 in Seminar Room 2.', type: 'placements' }
  ]);

  const [timetable] = useState<ClassSlot[]>([
    { time: '09:00 AM - 10:30 AM', subject: 'Deep Learning (DL)', instructor: 'Dr. Sarah Jenkins', room: 'Lab 4' },
    { time: '11:00 AM - 12:30 PM', subject: 'Vector Calculus (VC)', instructor: 'Amit Kulkarni', room: 'LHC-101' },
    { time: '01:30 PM - 03:00 PM', subject: 'Data Structures (DS)', instructor: 'Swati Sen', room: 'Lab 2' },
    { time: '03:15 PM - 04:45 PM', subject: 'Operating Systems (OS)', instructor: 'Prof. Amit Kulkarni', room: 'LHC-203' },
    { time: '05:00 PM - 06:00 PM', subject: 'DBMS Lab (Practical)', instructor: 'Swati Sen', room: 'Lab 6' },
    { time: '10:00 AM - 11:30 AM', subject: 'Software Engineering (SE)', instructor: 'Dr. Sarah Jenkins', room: 'LHC-105' }
  ]);

  // Modal displays
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showFeePaymentModal, setShowFeePaymentModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // Profile Form state
  const [tempMobile, setTempMobile] = useState(profile.mobile);
  const [tempEmail, setTempEmail] = useState(profile.email);

  // Exemption form state
  const [leaveReason, setLeaveReason] = useState('Medical Checkup');

  // Overall attendance calculation
  const overallAttendance = useMemo(() => {
    const totalAttended = SUBJECTS_ATTENDANCE.reduce((sum, s) => sum + s.attended, 0);
    const totalHeld = SUBJECTS_ATTENDANCE.reduce((sum, s) => sum + s.total, 0);
    return Math.round((totalAttended / totalHeld) * 100);
  }, []);

  // Update profile handler
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(prev => ({
      ...prev,
      mobile: tempMobile,
      email: tempEmail
    }));
    setShowProfileModal(false);
    notify({
      type: 'success',
      title: 'Profile Synchronized',
      message: 'Student registry details updated and synced to primary office.',
      duration: 3500
    });
  };

  // Fee sandbox payment clearance
  const handleClearOutstandingFees = (e: React.FormEvent) => {
    e.preventDefault();
    setFee(prev => ({
      ...prev,
      paid: prev.total,
      dues: 0
    }));
    setShowFeePaymentModal(false);
    notify({
      type: 'success',
      title: 'Tuition Fees Paid',
      message: `INR ${fee.dues.toLocaleString()} successfully cleared via Sandbox checkout gateway! No outstanding dues.`,
      duration: 5000
    });
  };

  // File attendance leave request
  const handleFileLeaveRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setShowLeaveModal(false);
    notify({
      type: 'info',
      title: 'Leave Request Received',
      message: `Absence permission requested for "${leaveReason}". Forwarded to Academic Dean trunk.`,
      duration: 4000
    });
  };

  // Click homework action
  const handleQuickSubmitHomework = (asnId: string) => {
    setAssignments(prev =>
      prev.map(a => (a.id === asnId ? { ...a, status: 'completed' } : a))
    );
    notify({
      type: 'success',
      title: 'Coursework Submitted',
      message: `Homework file successfully routed. Synced to LMS record.`,
      duration: 3500
    });
  };

  return (
    <PageContainer breadcrumbs={[{ label: 'Student Workspace' }, { label: 'Portal Cockpit' }]}>
      
      {/* Upper header section */}
      <div className={styles.headerBar}>
        <div>
          <h2 className={styles.headerTitle}>Student Central Portal Cockpit</h2>
          <p className={styles.headerSubtitle}>
            Access hour-by-hour timetables, review circular notices, inspect attendance scores, and settle semester fees registries.
          </p>
        </div>
      </div>

      {/* Main split grid */}
      <div className={styles.portalSplitGrid}>
        
        {/* Left Column Profile Sidebar */}
        <div className={styles.sidebarPanel}>
          <Card className={styles.profileCard}>
            <div className={styles.profileHero}>
              <div className={styles.profileAvatar}>
                {profile.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h4 className={styles.studentName}>{profile.name}</h4>
              <span className={styles.studentDegree}>{profile.batch}</span>
              <span className={styles.studentEnroll}>ENROLL ID: {profile.enrollmentId}</span>
            </div>
            
            <CardBody className={styles.noPadding}>
              <div className={styles.profileMetadataBlock}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Academic Term</span>
                  <span className={styles.metaVal}>{profile.semester}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Registered Email</span>
                  <span className={styles.metaVal}>{profile.email}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Mobile Contact</span>
                  <span className={styles.metaVal}>{profile.mobile}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Cumulative CGPA</span>
                  <span className={styles.metaVal} style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}>
                    {profile.cgpa} / 10.0
                  </span>
                </div>

                <div style={{ marginTop: '8px' }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Edit2 size={12} />}
                    onClick={() => {
                      setTempEmail(profile.email);
                      setTempMobile(profile.mobile);
                      setShowProfileModal(true);
                    }}
                    style={{ width: '100%' }}
                  >
                    Edit Contact Profile
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Primary widgets workspace */}
        <div className={styles.portalWorkspacesGrid}>
          
          {/* Key metrics visualizers at a glance */}
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}>
              <div className={styles.kpiIconWrapper}>
                <GraduationCap size={18} />
              </div>
              <div className={styles.kpiTextStack}>
                <span>Semester GPA</span>
                <strong>{profile.gpa} / 10.0</strong>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiIconWrapper} style={{ color: 'var(--stage-green-text)', background: 'rgba(21, 128, 61, 0.08)' }}>
                <CheckCircle size={18} />
              </div>
              <div className={styles.kpiTextStack}>
                <span>Completed Credits</span>
                <strong>68 / 120 credits</strong>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiIconWrapper} style={{ color: 'var(--stage-blue-text)', background: 'rgba(30, 64, 175, 0.08)' }}>
                <Bell size={18} />
              </div>
              <div className={styles.kpiTextStack}>
                <span>Active Broadcasts</span>
                <strong>3 Circular notices</strong>
              </div>
            </div>
          </div>

          {/* Attendance Overview Gauge and Subject level display */}
          <div className={styles.attendanceSplitGrid}>
            <Card>
              <CardHeader title="Attendance Overview" subtitle="Circular metrics ledger." />
              <CardBody>
                <div className={styles.radialGaugeWrapper}>
                  <div className={`${styles.gaugeCircle}`} style={{ borderColor: overallAttendance >= 75 ? 'var(--stage-green-text, #15803d)' : 'var(--stage-orange-text, #c2410c)' }}>
                    <span className={styles.gaugePercent}>{overallAttendance}%</span>
                    <span className={styles.gaugeLabel}>Overall Ratio</span>
                  </div>
                  
                  {overallAttendance >= 75 ? (
                    <span style={{ fontSize: '11px', color: 'var(--stage-green-text)', fontWeight: 'bold' }}>
                      Attendance status satisfies university bounds.
                    </span>
                  ) : (
                    <span style={{ fontSize: '11px', color: 'var(--stage-orange-text)', fontWeight: 'bold' }}>
                      Attention: Attendance ratio below 75%!
                    </span>
                  )}

                  <div style={{ marginTop: '12px', width: '100%' }}>
                    <Button
                      variant="gold"
                      size="sm"
                      onClick={() => setShowLeaveModal(true)}
                      style={{ width: '100%' }}
                    >
                      File Exemption Claim
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Subject Attendance Breakdown" subtitle="Department evaluations." />
              <CardBody className={styles.noPadding}>
                <div className={styles.subjectAttendanceList}>
                  {SUBJECTS_ATTENDANCE.map(subj => (
                    <div key={subj.title} className={styles.subjectRow}>
                      <div>
                        <strong className={styles.subjTitle}>{subj.title}</strong>
                        <div className={styles.subjDetail}>
                          {subj.attended} attended out of {subj.total} lectures held
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ fontSize: '12px', color: 'var(--color-brown-dark)' }}>{subj.pct}%</strong>
                        <StageChip stage={subj.status === 'green' ? 'green' : 'orange'} label={subj.pct >= 75 ? 'ATTENDANCE' : 'LOW ATTENDANCE'} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Academic SGPA chart blocks */}
          <Card>
            <CardHeader title="Academic Progress Trajectory" subtitle="Historical Semester Grade Trajectory." />
            <CardBody className={styles.noPadding}>
              <div className={styles.transcriptList}>
                <div className={styles.semGrid}>
                  {SGPA_HISTORY.map(hist => (
                    <div key={hist.sem} className={styles.semBlock}>
                      <span className={styles.semTitle}>{hist.sem}</span>
                      <div className={styles.semGpa}>{hist.gpa} SGPA</div>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '12px', fontSize: '11px', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Info size={14} style={{ color: 'var(--color-gold)' }} />
                  <span>CGPA metrics represent consistent performance above the department top quartile margin.</span>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Timetable Slots and Active Assignments split */}
          <div className={styles.timetableSplitGrid}>
            <Card>
              <CardHeader title="Upcoming Classes Timetable" subtitle="Schedule grids for May 2026." />
              <CardBody className={styles.noPadding}>
                <div className={styles.timetableRoster}>
                  {timetable.map(slot => (
                    <div key={slot.subject} className={styles.timetableSlot}>
                      <div>
                        <span className={styles.timetableTime}>{slot.time}</span>
                        <h5 className={styles.timetableCourse}>{slot.subject}</h5>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className={styles.timetableRoom}>{slot.room}</span>
                        <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{slot.instructor}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Pending Homework & Assignments" subtitle="Synchronized tasks connected to LMS modules." />
              <CardBody className={styles.noPadding}>
                <div className={styles.timetableRoster}>
                  {assignments.map(asn => (
                    <div key={asn.id} className={styles.timetableSlot} style={{ borderLeftColor: asn.status === 'pending' ? 'var(--color-gold)' : 'var(--stage-green-text)' }}>
                      <div>
                        <span className={styles.timetableTime}>Due date: {asn.dueDate}</span>
                        <h5 className={styles.timetableCourse}>{asn.title}</h5>
                        <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{asn.subject}</div>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                        <StageChip stage={asn.status === 'pending' ? 'yellow' : 'green'} label={asn.status.toUpperCase()} />
                        {asn.status === 'pending' && (
                          <Button
                            variant="gold"
                            size="sm"
                            style={{ padding: '2px 8px', fontSize: '9px' }}
                            onClick={() => handleQuickSubmitHomework(asn.id)}
                          >
                            Submit Now
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Fee Overview & Payment Sandbox Ledger */}
          <Card>
            <CardHeader title="Fee Summary & Payments Station" subtitle="Verify and settle outstanding campus fee balances." />
            <CardBody className={styles.noPadding}>
              <div className={styles.feeOperationsContent}>
                <div className={styles.feeLedgerDetails}>
                  <div className={styles.feeLedgerItem}>
                    <span>Aggregate Fee Amount</span>
                    <strong>INR {fee.total.toLocaleString()}</strong>
                  </div>
                  <div className={styles.feeLedgerItem}>
                    <span>Sessional Fees Settled</span>
                    <strong style={{ color: 'var(--stage-green-text)' }}>INR {fee.paid.toLocaleString()}</strong>
                  </div>
                  <div className={styles.feeLedgerItem}>
                    <span>Outstanding Dues Balance</span>
                    <strong style={{ color: fee.dues > 0 ? 'var(--stage-orange-text)' : 'var(--stage-green-text)' }}>
                      INR {fee.dues.toLocaleString()}
                    </strong>
                  </div>
                </div>

                {fee.dues > 0 ? (
                  <Button
                    variant="gold"
                    size="sm"
                    onClick={() => {
                      setShowFeePaymentModal(true);
                    }}
                  >
                    Pay Tuition Dues
                  </Button>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--stage-green-text)', fontSize: '12px', fontWeight: 'bold' }}>
                    <CheckCircle size={16} />
                    <span>Dues Balance Cleared</span>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Notices & Announcements bulletin board */}
          <Card>
            <CardHeader title="Official Bulletins Notices" subtitle="Academic notices and administrative boards." />
            <CardBody className={styles.noPadding}>
              <div className={styles.noticesList}>
                {notices.map(not => (
                  <div key={not.id} className={styles.noticeItem}>
                    <div className={styles.noticeHeaderRow}>
                      <span className={styles.noticeDate}>{not.date}</span>
                      <StageChip stage={not.type === 'academic' ? 'blue' : not.type === 'placements' ? 'purple' : 'gray'} label={not.type.toUpperCase()} />
                    </div>
                    <strong className={styles.noticeTitle}>{not.title}</strong>
                    <p className={styles.noticeSnippet}>"{not.snippet}"</p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

        </div>

      </div>

      {/* Edit Profile Modal backdrop */}
      {showProfileModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h4>Edit Profile Contact details</h4>
              <button type="button" onClick={() => setShowProfileModal(false)} className={styles.closeBtn}>×</button>
            </div>
            
            <form onSubmit={handleSaveProfile}>
              <div className={styles.modalBody}>
                <label className={styles.modalLabel}>
                  <span>Student Name (Read Only)</span>
                  <input type="text" disabled value={profile.name} className={styles.modalInput} />
                </label>

                <label className={styles.modalLabel}>
                  <span>Mobile Phone Number</span>
                  <input
                    type="text"
                    required
                    value={tempMobile}
                    onChange={e => setTempMobile(e.target.value)}
                    className={styles.modalInput}
                  />
                </label>

                <label className={styles.modalLabel}>
                  <span>Email Registration</span>
                  <input
                    type="email"
                    required
                    value={tempEmail}
                    onChange={e => setTempEmail(e.target.value)}
                    className={styles.modalInput}
                  />
                </label>
              </div>

              <div className={styles.modalFooter}>
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowProfileModal(false)}>Cancel</Button>
                <Button variant="gold" size="sm" type="submit">Synchronize Profile</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fee Sandbox checkout modal */}
      {showFeePaymentModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h4>Tuition Settlement Gateway Sandbox</h4>
              <button type="button" onClick={() => setShowFeePaymentModal(false)} className={styles.closeBtn}>×</button>
            </div>
            
            <form onSubmit={handleClearOutstandingFees}>
              <div className={styles.modalBody} style={{ gap: '16px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', background: 'var(--color-gold-soft)', padding: '12px', borderRadius: '4px', border: '1px solid var(--color-gold)' }}>
                  <AlertTriangle size={18} style={{ color: 'var(--color-gold)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '11px', color: 'var(--color-brown-dark)' }}>Sandbox Checkout Simulation</strong>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                      Clearing this sandbox ledger simulates UPI merchant callbacks. Your local tuition credit indices will update instantly!
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Outstanding Tuition Balance:</span>
                  <strong style={{ fontSize: '13px', color: 'var(--color-brown-dark)' }}>INR {fee.dues.toLocaleString()}</strong>
                </div>

                <label className={styles.modalLabel}>
                  <span>Mock Merchant Payment Method</span>
                  <select className={styles.modalInput}>
                    <option value="upi">UPI App clearance (GooglePay/PhonePe)</option>
                    <option value="card">Registered credit/Debit cards</option>
                  </select>
                </label>
              </div>

              <div className={styles.modalFooter}>
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowFeePaymentModal(false)}>Cancel</Button>
                <Button variant="gold" size="sm" type="submit">Verify Mock Checkout</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attendance Exemption Modal */}
      {showLeaveModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h4>Apply for Leave Absence Exemption</h4>
              <button type="button" onClick={() => setShowLeaveModal(false)} className={styles.closeBtn}>×</button>
            </div>
            
            <form onSubmit={handleFileLeaveRequest}>
              <div className={styles.modalBody}>
                <label className={styles.modalLabel}>
                  <span>Select Absence Reason</span>
                  <select
                    value={leaveReason}
                    onChange={e => setLeaveReason(e.target.value)}
                    className={styles.modalInput}
                  >
                    <option value="Medical Checkup">Medical Checkup / Illness</option>
                    <option value="Placement Interview">Placement Drive off-campus interview</option>
                    <option value="Family Ceremony">Family Ceremony commitment</option>
                  </select>
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <label className={styles.modalLabel}>
                    <span>Leave Start Date</span>
                    <input type="date" required defaultValue="2026-05-22" className={styles.modalInput} />
                  </label>
                  <label className={styles.modalLabel}>
                    <span>Leave End Date</span>
                    <input type="date" required defaultValue="2026-05-23" className={styles.modalInput} />
                  </label>
                </div>

                <label className={styles.modalLabel}>
                  <span>Detailed Exemption Explanation</span>
                  <textarea rows={3} placeholder="Please explain leave details..." className={styles.modalInput} style={{ resize: 'vertical' }} />
                </label>
              </div>

              <div className={styles.modalFooter}>
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowLeaveModal(false)}>Cancel</Button>
                <Button variant="gold" size="sm" type="submit">Submit Exemption Request</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </PageContainer>
  );
}
