import { useState, useMemo } from 'react';
import { PageContainer } from '../layouts';
import { Card, CardBody, CardHeader, Button, StageChip } from '../components/ui';
import { useNotifications } from '../hooks/useNotifications';
import { useMetricClick } from '../hooks/useMetricClick';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  User,
  BookOpen,
  CheckCircle,
  Bell,
} from 'lucide-react';
import styles from './CalendarBookingPage.module.css';

interface Appointment {
  id: string;
  studentName: string;
  course: string;
  counsellor: string;
  date: number; // Day of May 2026 (1 to 31)
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
}

interface CounsellorAvailability {
  name: string;
  specialization: string;
  status: 'Active' | 'Fully Booked' | 'Slots Open';
  slotsAvailable: number;
}

const INITIAL_APPOINTMENTS: Appointment[] = [
  { id: 'APP-101', studentName: 'Ananya Iyer', course: 'B.Tech CSE', counsellor: 'Swati Sen', date: 24, time: '10:00 AM', status: 'scheduled', notes: 'Interested in AI specializations and double-degree programs.' },
  { id: 'APP-102', studentName: 'Kabir Malhotra', course: 'MBA Marketing', counsellor: 'Dr. Sarah Jenkins', date: 22, time: '11:30 AM', status: 'scheduled', notes: 'Wants scholarship verification check details.' },
  { id: 'APP-103', studentName: 'Meera Deshmukh', course: 'B.Tech Biotechnology', counsellor: 'Swati Sen', date: 23, time: '02:00 PM', status: 'completed', notes: 'Alumni referral background reviewed.' },
  { id: 'APP-104', studentName: 'Rohan Verma', course: 'MBA Finance', counsellor: 'Dr. Sarah Jenkins', date: 26, time: '03:30 PM', status: 'scheduled', notes: 'Documents verification query resolution.' },
  { id: 'APP-105', studentName: 'Arjun Singhal', course: 'B.Tech IT', counsellor: 'Amit Kulkarni', date: 22, time: '09:30 AM', status: 'cancelled', notes: 'Candidate rescheduled callback window.' },
  { id: 'APP-106', studentName: 'Priya Pillai', course: 'B.Tech CSE', counsellor: 'Swati Sen', date: 25, time: '11:30 AM', status: 'scheduled', notes: 'Lateral entry eligibility from diploma — needs CSET guidance and credit transfer discussion.' },
  { id: 'APP-107', studentName: 'Sahil Sharma', course: 'B.Tech CSE', counsellor: 'Amit Kulkarni', date: 27, time: '09:00 AM', status: 'scheduled', notes: 'AI/ML specialization track selection and hostel booking confirmation.' },
  { id: 'APP-108', studentName: 'Sneha Rao', course: 'B.Tech Biotechnology', counsellor: 'Dr. Sarah Jenkins', date: 28, time: '04:30 PM', status: 'completed', notes: 'State board topper scholarship eligibility reviewed and confirmed at 50% waiver.' }
];

const COUNSELLORS: CounsellorAvailability[] = [
  { name: 'Swati Sen', specialization: 'Engineering Sector', status: 'Slots Open', slotsAvailable: 3 },
  { name: 'Dr. Sarah Jenkins', specialization: 'Management Sector', status: 'Active', slotsAvailable: 1 },
  { name: 'Amit Kulkarni', specialization: 'Biotech & General Science', status: 'Fully Booked', slotsAvailable: 0 },
  { name: 'Prof. Rajan Nair', specialization: 'Financial Aid & Scholarships', status: 'Slots Open', slotsAvailable: 4 }
];

export function CalendarBookingPage() {
  const { notify } = useNotifications();
  const metricClick = useMetricClick();

  // State Management
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [counsellorFilter, setCounsellorFilter] = useState('All');

  // Form Inputs
  const [formName, setFormName] = useState('');
  const [formCourse, setFormCourse] = useState('B.Tech CSE');
  const [formCounsellor, setFormCounsellor] = useState('Swati Sen');
  const [formDate, setFormDate] = useState(22);
  const [formTime, setFormTime] = useState('10:00 AM');
  const [formNotes, setFormNotes] = useState('');

  // May 2026 starts on Friday (Day 5 of week, where 0=Sunday, 1=Monday... 5=Friday)
  const START_DAY_OFFSET = 5;
  const TOTAL_DAYS = 31;
  const calendarCells = useMemo(() => {
    const cells = [];
    // Spacers for offset before Friday
    for (let i = 0; i < START_DAY_OFFSET; i++) {
      cells.push(null);
    }
    // Days of the month
    for (let d = 1; d <= TOTAL_DAYS; d++) {
      cells.push(d);
    }
    return cells;
  }, []);

  // Filtered Appointments list
  const filteredAppointments = useMemo(() => {
    return appointments.filter(app => {
      const matchCounsellor = counsellorFilter === 'All' ? true : app.counsellor === counsellorFilter;
      return matchCounsellor;
    });
  }, [appointments, counsellorFilter]);

  // Open scheduler modal pre-filling clicked calendar day
  const handleCellClick = (day: number) => {
    setFormDate(day);
    setShowBookingModal(true);
  };

  // Submit Booking reservation
  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      notify({ type: 'error', title: 'Fields Incomplete', message: 'Please input candidate name.' });
      return;
    }

    const newBooking: Appointment = {
      id: `APP-${Math.floor(100 + Math.random() * 900)}`,
      studentName: formName.trim(),
      course: formCourse,
      counsellor: formCounsellor,
      date: formDate,
      time: formTime,
      status: 'scheduled',
      notes: formNotes.trim() || 'No specific meeting brief.'
    };

    setAppointments(prev => [newBooking, ...prev]);
    setShowBookingModal(false);

    // Clear form inputs
    setFormName('');
    setFormNotes('');

    notify({
      type: 'success',
      title: 'Tuition slot Secured',
      message: `Reservation confirmed for ${newBooking.studentName} on May ${newBooking.date} at ${newBooking.time}.`,
      duration: 4000
    });
  };

  // Nudge Advisor reminder alerts simulator
  const handleNudgeCounsellor = (counsellorName: string) => {
    notify({
      type: 'info',
      title: 'Advisor Nudged',
      message: `Tuition slot overflow ping dispatched to ${counsellorName}'s mobile screen.`,
      duration: 3500
    });
  };

  // Counts for KPI boxes
  const metrics = useMemo(() => {
    const scheduled = appointments.filter(a => a.status === 'scheduled').length;
    const completed = appointments.filter(a => a.status === 'completed').length;
    const totalCount = appointments.length;

    return {
      activeSlots: scheduled,
      resolvedSessions: completed,
      totalCount,
    };
  }, [appointments]);

  return (
    <PageContainer breadcrumbs={[{ label: 'CRM & Sales' }, { label: 'Counselling Booking Ledger' }]}>
      
      {/* Upper header section */}
      <div className={styles.headerBar}>
        <div>
          <h2 className={styles.headerTitle}>Tuition Booking & Scheduling Calendar</h2>
          <p className={styles.headerSubtitle}>
            Interactive monthly day matric grids, active advisor slot allocations, instant reserve checkout forms, and counsellor overflows.
          </p>
        </div>
        <div>
          <Button 
            variant="gold" 
            size="sm" 
            icon={<Plus size={14} />} 
            onClick={() => {
              setFormDate(22);
              setShowBookingModal(true);
            }}
          >
            New Counselling Slot
          </Button>
        </div>
      </div>

      {/* Spacing metrics cards */}
      <div className={`${styles.kpiRow} ml-stats-grid`}>
        <button type="button" className={styles.calendarKpiCard} onClick={() => metricClick('Active Reservations', `${metrics.activeSlots} scheduled`)}>
          <div className={styles.kpiUpper}>
            <span>Active Reservations</span>
            <CalendarIcon size={16} style={{ color: 'var(--color-gold)' }} />
          </div>
          <strong>{metrics.activeSlots} Scheduled</strong>
          <span className={styles.kpiSubtext}> Tuitions mapped this month</span>
        </button>

        <button type="button" className={styles.calendarKpiCard} onClick={() => metricClick('Sessions Accomplished', `${metrics.resolvedSessions} completed`)}>
          <div className={styles.kpiUpper}>
            <span>Sessions Accomplished</span>
            <CheckCircle size={16} style={{ color: 'var(--stage-green-text, #15803d)' }} />
          </div>
          <strong>{metrics.resolvedSessions} Completed</strong>
          <span className={styles.kpiSubtext}>Tuition guides locked</span>
        </button>

        <button type="button" className={styles.calendarKpiCard} onClick={() => metricClick('Total Logged Ledgers', `${metrics.totalCount} registries`)}>
          <div className={styles.kpiUpper}>
            <span>Total Logged Ledgers</span>
            <BookOpen size={16} style={{ color: 'var(--stage-blue-text, #1e40af)' }} />
          </div>
          <strong>{metrics.totalCount} Registries</strong>
          <span className={styles.kpiSubtext}>Aggregate sessions count</span>
        </button>

        <button type="button" className={styles.calendarKpiCard} onClick={() => metricClick('Active Advising Roster', '3 counsel leads')}>
          <div className={styles.kpiUpper}>
            <span>Active Advising Roster</span>
            <User size={16} style={{ color: 'var(--color-gold)' }} />
          </div>
          <strong>3 Counsel Leads</strong>
          <span className={styles.kpiSubtext}>Available shifts</span>
        </button>
      </div>

      {/* Main split grid layout */}
      <div className={styles.calendarSplitGrid}>
        
        {/* Interactive Calendar Month Matrix Box */}
        <Card className={styles.calendarCardContainer}>
          <CardHeader
            title="May 2026"
            action={
              <div className={styles.calendarFilters}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 'bold' }}>
                  Filter Advisor slots:
                </span>
                <select
                  value={counsellorFilter}
                  onChange={e => setCounsellorFilter(e.target.value)}
                  className={styles.advisorFilterSelect}
                >
                  <option value="All">All Counsellors</option>
                  <option value="Swati Sen">Swati Sen</option>
                  <option value="Dr. Sarah Jenkins">Dr. Sarah Jenkins</option>
                  <option value="Amit Kulkarni">Amit Kulkarni</option>
                </select>
              </div>
            }
          />
          <CardBody>
            <div className={styles.calendarMatrixGrid}>
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className={styles.dayOfWeekHeader}>{day}</div>
              ))}
              
              {/* Days matching spacer cells */}
              {calendarCells.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} className={styles.emptyDayCell}></div>;
                }

                // Check for active appointments on this day
                const dayAppointments = filteredAppointments.filter(app => app.date === day);
                
                return (
                  <div 
                    key={`day-${day}`} 
                    className={`${styles.dayCell} ${dayAppointments.length > 0 ? styles.dayCellWithEvents : ''}`}
                    onClick={() => handleCellClick(day)}
                  >
                    <span className={styles.dayNumberLabel}>{day}</span>
                    
                    <div className={styles.dayEventBulletContainer}>
                      {dayAppointments.slice(0, 2).map(app => (
                        <div 
                          key={app.id} 
                          className={`${styles.eventBulletChip} ${styles[`bullet-${app.status}`]}`}
                          title={`${app.studentName} - ${app.time}`}
                        >
                          <span className={styles.bulletText}>{app.studentName.split(' ')[0]}</span>
                        </div>
                      ))}
                      {dayAppointments.length > 2 && (
                        <span className={styles.moreBulletCount}>+{dayAppointments.length - 2} more</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        {/* Sidebar panels containing Advisor list and Upcoming details */}
        <div className={styles.sidebarPanel}>
          
          {/* Counsellor Availability grid with alert nudge */}
          <Card className={styles.advisorRosterCard}>
            <CardHeader title="Counsellor Availability Grid" subtitle="Monitor active load capacities and alert advisor teams." />
            <CardBody className={styles.noPadding}>
              <div className={styles.advisorsList}>
                {COUNSELLORS.map(adv => (
                  <div key={adv.name} className={styles.advisorItem}>
                    <div className={styles.advisorUpperLine}>
                      <strong className={styles.advisorName}>{adv.name}</strong>
                      <span className={`${styles.statusLabel} ${adv.status === 'Fully Booked' ? styles.statusRed : adv.status === 'Slots Open' ? styles.statusGreen : styles.statusGray}`}>
                        {adv.status}
                      </span>
                    </div>
                    <span className={styles.advisorSpecialty}>{adv.specialization}</span>
                    
                    <div className={styles.advisorLowerLine}>
                      <span className={styles.slotsStatus}>{adv.slotsAvailable} Slots Available</span>
                      <button type="button"
                        onClick={() => handleNudgeCounsellor(adv.name)}
                        className={styles.nudgeBtn}
                      >
                        <Bell size={11} style={{ display: 'inline', marginRight: '4px' }} />
                        Nudge Advisor
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Upcoming counseling timeline list */}
          <Card className={styles.upcomingTimelineCard}>
            <CardHeader title="Upcoming Counselling Timeline" subtitle="Chronological log of confirmed callback schedules." />
            <CardBody className={styles.noPadding}>
              <div className={styles.timelineList}>
                {filteredAppointments.length === 0 ? (
                  <div className={styles.emptyTimelineState}>
                    <span>No upcoming counselling reservations.</span>
                  </div>
                ) : (
                  filteredAppointments.map(app => (
                    <div key={app.id} className={styles.timelineItem}>
                      <div className={styles.timelineUpper}>
                        <strong className={styles.studentTitleName}>{app.studentName}</strong>
                        <span className={styles.appRef}>{app.id}</span>
                      </div>
                      
                      <div className={styles.timelineMiddle}>
                        <span>{app.course} • Advisor: {app.counsellor}</span>
                      </div>

                      <div className={styles.timelineTimeSlotRow}>
                        <div className={styles.timeTag}>
                          <Clock size={11} style={{ color: 'var(--color-gold)' }} />
                          <span>May {app.date} at {app.time}</span>
                        </div>
                        <StageChip 
                          stage={app.status === 'scheduled' ? 'yellow' : app.status === 'completed' ? 'green' : 'orange'} 
                          label={app.status.toUpperCase()} 
                        />
                      </div>
                      
                      <p className={styles.timelineNotesText}>"{app.notes}"</p>
                    </div>
                  ))
                )}
              </div>
            </CardBody>
          </Card>

        </div>

      </div>

      {/* Booking Scheduler Modal popup */}
      {showBookingModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h4> Tuitions Counselling Reservation Scheduler</h4>
              <button type="button" onClick={() => setShowBookingModal(false)} className={styles.closeBtn}>×</button>
            </div>
            
            <form onSubmit={handleCreateBooking}>
              <div className={styles.modalBody}>
                <label className={styles.modalLabel}>
                  <span>Candidate Student Name</span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Iyer"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className={styles.modalInput}
                  />
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <label className={styles.modalLabel}>
                    <span>Program Preference</span>
                    <select
                      value={formCourse}
                      onChange={e => setFormCourse(e.target.value)}
                      className={styles.modalSelect}
                    >
                      <option value="B.Tech CSE">B.Tech CSE</option>
                      <option value="MBA Marketing">MBA Marketing</option>
                      <option value="MBA Finance">MBA Finance</option>
                      <option value="B.Tech Biotechnology">B.Tech Biotechnology</option>
                    </select>
                  </label>

                  <label className={styles.modalLabel}>
                    <span>Assigned Counsellor</span>
                    <select
                      value={formCounsellor}
                      onChange={e => setFormCounsellor(e.target.value)}
                      className={styles.modalSelect}
                    >
                      <option value="Swati Sen">Swati Sen</option>
                      <option value="Dr. Sarah Jenkins">Dr. Sarah Jenkins</option>
                      <option value="Amit Kulkarni">Amit Kulkarni</option>
                    </select>
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <label className={styles.modalLabel}>
                    <span>Date (May 2026)</span>
                    <input
                      type="number"
                      required
                      min={1}
                      max={31}
                      value={formDate}
                      onChange={e => setFormDate(parseInt(e.target.value))}
                      className={styles.modalInput}
                    />
                  </label>

                  <label className={styles.modalLabel}>
                    <span>Preferred Time Slot</span>
                    <select
                      value={formTime}
                      onChange={e => setFormTime(e.target.value)}
                      className={styles.modalSelect}
                    >
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="03:30 PM">03:30 PM</option>
                      <option value="04:30 PM">04:30 PM</option>
                    </select>
                  </label>
                </div>

                <label className={styles.modalLabel}>
                  <span>Interview / Counselling Notes</span>
                  <textarea
                    rows={3}
                    placeholder="Describe student motivations, questions, eligibility background..."
                    value={formNotes}
                    onChange={e => setFormNotes(e.target.value)}
                    className={styles.modalTextarea}
                  />
                </label>
              </div>

              <div className={styles.modalFooter}>
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowBookingModal(false)}>Cancel</Button>
                <Button variant="gold" size="sm" type="submit">Schedule Reservation</Button>
              </div>
            </form>

          </div>
        </div>
      )}

    </PageContainer>
  );
}
