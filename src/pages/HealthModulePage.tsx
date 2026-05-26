import { useState, useMemo } from 'react';
import { PageContainer } from '../layouts';
import { Card, CardBody, CardHeader, Button } from '../components/ui';
import { useNotifications } from '../contexts/NotificationContext';
import { useMetricClick } from '../hooks/useMetricClick';
import {
  HeartPulse,
  Activity,
  Users,
  Calendar,
  AlertTriangle,
  Search,
  X,
  Clock,
  Clipboard,
  PlusCircle,
  Stethoscope,
} from 'lucide-react';
import styles from './HealthModulePage.module.css';

interface MedicalLog {
  id: string;
  title: string;
  content: string;
  time: string;
  type: 'prescription' | 'triage' | 'checkin' | 'clearance';
}

interface PatientRecord {
  patientId: string;
  name: string;
  age: number;
  gender: string;
  branch: string;
  symptoms: string;
  vitals: {
    bp: string;
    temp: string;
    pulse: number;
  };
  status: 'healthy' | 'scheduled' | 'pending' | 'urgent' | 'archived';
  doctor: string;
  timeline: MedicalLog[];
}

interface AppointmentSlot {
  id: string;
  time: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  symptoms: string;
  status: 'active' | 'completed';
}

const INITIAL_PATIENTS: PatientRecord[] = [
  {
    patientId: 'PAT-2023-01',
    name: 'Sahil Sharma',
    age: 21,
    gender: 'Male',
    branch: 'Computer Science',
    symptoms: 'Seasonal Allergy / Pollen Mild Wheezing',
    vitals: {
      bp: '118/78 mmHg',
      temp: '98.4°F',
      pulse: 72,
    },
    status: 'healthy',
    doctor: 'Dr. Anjali Mehta',
    timeline: [
      { id: 'LOG-101', title: 'Clearance Granted', content: 'Vital signs verified within normal ranges. Allergy managed with antihistamine.', time: '2 hours ago', type: 'clearance' },
      { id: 'LOG-102', title: 'Rx Dispensed', content: 'Montelukast 10mg - once daily for 10 days.', time: '1 day ago', type: 'prescription' },
      { id: 'LOG-103', title: 'Triage Check-in', content: 'Complained of mild respiratory wheezing on dry pollen exposure.', time: '1 day ago', type: 'triage' },
    ],
  },
  {
    patientId: 'PAT-2023-02',
    name: 'Ananya Iyer',
    age: 20,
    gender: 'Female',
    branch: 'Computer Science',
    symptoms: 'Migraine with Visual Aura',
    vitals: {
      bp: '122/80 mmHg',
      temp: '98.6°F',
      pulse: 78,
    },
    status: 'scheduled',
    doctor: 'Dr. Vikram Seth',
    timeline: [
      { id: 'LOG-201', title: 'Appointment Registered', content: 'Scheduled for detailed consultation with Dr. Vikram Seth.', time: '30 mins ago', type: 'checkin' },
      { id: 'LOG-202', title: 'Triage Check-in', content: 'Complained of throbbing left-sided headache and mild photophobia.', time: '3 hours ago', type: 'triage' },
    ],
  },
  {
    patientId: 'PAT-2024-15',
    name: 'Kabir Malhotra',
    age: 22,
    gender: 'Male',
    branch: 'Electronics',
    symptoms: 'Ankle Sprain (Right Joint)',
    vitals: {
      bp: '126/82 mmHg',
      temp: '98.2°F',
      pulse: 80,
    },
    status: 'pending',
    doctor: 'Dr. Anjali Mehta',
    timeline: [
      { id: 'LOG-301', title: 'Physiotherapist Referral', content: 'Referred for hot compression and crepe bandage stabilizer logs.', time: 'Yesterday', type: 'triage' },
      { id: 'LOG-302', title: 'Triage Admission', content: 'Admitted following sports injury on basketball court.', time: 'Yesterday', type: 'triage' },
    ],
  },
  {
    patientId: 'PAT-2025-88',
    name: 'Arjun Singhal',
    age: 19,
    gender: 'Male',
    branch: 'Mechanical',
    symptoms: 'High Grade Fever & Chills',
    vitals: {
      bp: '110/68 mmHg',
      temp: '102.4°F',
      pulse: 96,
    },
    status: 'urgent',
    doctor: 'Dr. Vikram Seth',
    timeline: [
      { id: 'LOG-401', title: 'Urgent Red Alert', content: 'Spiking core temperature (102.4F). Cold sponge compress initiated immediately.', time: '10 mins ago', type: 'triage' },
      { id: 'LOG-402', title: 'Rx Dispensed', content: 'Paracetamol 650mg - SOS for thermal spikes.', time: '20 mins ago', type: 'prescription' },
      { id: 'LOG-403', title: 'Triage Admission', content: 'Checked in with intense chills, cold sweats, and extreme lethargy.', time: '30 mins ago', type: 'triage' },
    ],
  },
  {
    patientId: 'PAT-2023-09',
    name: 'Priya Pillai',
    age: 21,
    gender: 'Female',
    branch: 'Computer Science',
    symptoms: 'Regular General Wellness Screening',
    vitals: {
      bp: '115/75 mmHg',
      temp: '98.0°F',
      pulse: 68,
    },
    status: 'healthy',
    doctor: 'Dr. Anjali Mehta',
    timeline: [
      { id: 'LOG-501', title: 'Annual Checkup Cleared', content: 'No systemic anomalies. Vitals and BMI logs are perfectly optimal.', time: '2 days ago', type: 'clearance' },
    ],
  },
  {
    patientId: 'PAT-2024-42',
    name: 'Sahil Sharma',
    age: 22,
    gender: 'Male',
    branch: 'Information Tech',
    symptoms: 'Dry Cough & Sore Throat Recovery',
    vitals: {
      bp: '120/80 mmHg',
      temp: '98.6°F',
      pulse: 72,
    },
    status: 'archived',
    doctor: 'Dr. Vikram Seth',
    timeline: [
      { id: 'LOG-601', title: 'Case Formally Archived', content: 'Cough resolved. 5-day course of expectorant completed.', time: '5 days ago', type: 'clearance' },
      { id: 'LOG-602', title: 'Rx Dispensed', content: 'Dextromethorphan syrup - 10ml thrice daily.', time: '10 days ago', type: 'prescription' },
    ],
  },
];

const INITIAL_APPOINTMENTS: AppointmentSlot[] = [
  {
    id: 'APT-001',
    time: '09:30 AM - 10:00 AM',
    patientId: 'PAT-2023-02',
    patientName: 'Ananya Iyer',
    doctorName: 'Dr. Vikram Seth',
    symptoms: 'Migraine Aura',
    status: 'active',
  },
  {
    id: 'APT-002',
    time: '10:30 AM - 11:00 AM',
    patientId: 'PAT-2024-15',
    patientName: 'Kabir Malhotra',
    doctorName: 'Dr. Anjali Mehta',
    symptoms: 'Ankle Crepe Creasing',
    status: 'active',
  },
  {
    id: 'APT-003',
    time: '02:00 PM - 02:30 PM',
    patientId: 'PAT-2025-88',
    patientName: 'Arjun Singhal',
    doctorName: 'Dr. Vikram Seth',
    symptoms: 'Fever Diagnostic Check',
    status: 'active',
  },
];

export function HealthModulePage() {
  const { notify } = useNotifications();
  const metricClick = useMetricClick();

  // State Management
  const [patients, setPatients] = useState<PatientRecord[]>(INITIAL_PATIENTS);
  const [appointments, setAppointments] = useState<AppointmentSlot[]>(INITIAL_APPOINTMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Drawer Detail Overlay Selected Patient
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);

  // Form State: Appointment Booking
  const [bookPatientId, setBookPatientId] = useState('PAT-2023-02');
  const [bookDoctor, setBookDoctor] = useState('Dr. Vikram Seth');
  const [bookTime, setBookTime] = useState('11:30 AM - 12:00 PM');
  const [bookSymptoms, setBookSymptoms] = useState('');

  // Form State: Prescription Dispenser
  const [rxPatientId, setRxPatientId] = useState('PAT-2025-88');
  const [rxMedicine, setRxMedicine] = useState('');
  const [rxDosage, setRxDosage] = useState('');
  const [rxDuration, setRxDuration] = useState('');

  // Filtered Patients List
  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.symptoms.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'All' ? true : p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [patients, searchQuery, statusFilter]);

  // Active Triage Priority Queue (Urgent or Pending status)
  const activeTriageQueue = useMemo(() => {
    return patients.filter((p) => p.status === 'urgent' || p.status === 'pending');
  }, [patients]);

  // Dashboard Stats Calculations
  const stats = useMemo(() => {
    const totalTreated = patients.filter((p) => p.status === 'healthy' || p.status === 'archived').length + 38; // Mock historically treated base
    const activeQueue = activeTriageQueue.length;
    const urgentCount = patients.filter((p) => p.status === 'urgent').length;
    
    // Clinic Bed Occupancy percentage
    const occupancyPct = activeQueue > 0 ? Math.min(100, activeQueue * 25) : 15;

    return {
      totalTreated,
      activeQueue,
      urgentCount,
      occupancyPct,
    };
  }, [patients, activeTriageQueue]);

  // Book a New Appointment Slot
  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const patientObj = patients.find((p) => p.patientId === bookPatientId);
    if (!patientObj) return;

    // Create appointment slot
    const newApt: AppointmentSlot = {
      id: `APT-${Math.floor(100 + Math.random() * 900)}`,
      time: bookTime,
      patientId: bookPatientId,
      patientName: patientObj.name,
      doctorName: bookDoctor,
      symptoms: bookSymptoms || patientObj.symptoms,
      status: 'active',
    };

    setAppointments((prev) => [...prev, newApt]);

    // Shift student clearance status to scheduled & append timeline log
    setPatients((prev) =>
      prev.map((p) => {
        if (p.patientId === bookPatientId) {
          const newLog: MedicalLog = {
            id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
            title: 'Appointment Booked',
            content: `Registered slot for ${bookTime} with ${bookDoctor}. Symptoms logged: ${newApt.symptoms}.`,
            time: 'Just now',
            type: 'checkin',
          };
          return {
            ...p,
            status: 'scheduled',
            doctor: bookDoctor,
            timeline: [newLog, ...p.timeline],
          };
        }
        return p;
      })
    );

    // Reset Form
    setBookSymptoms('');
    
    notify({
      type: 'success',
      title: 'Appointment Scheduled',
      message: `Reservation confirmed for ${patientObj.name} at ${bookTime}.`,
      duration: 3500,
    });
  };

  // Dispense & Log Prescription
  const handleDispensePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rxMedicine.trim() || !rxDosage.trim()) return;

    const patientObj = patients.find((p) => p.patientId === rxPatientId);
    if (!patientObj) return;

    // Append prescription log to timeline & clear active warning signs if healthy
    setPatients((prev) =>
      prev.map((p) => {
        if (p.patientId === rxPatientId) {
          const newLog: MedicalLog = {
            id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
            title: 'Rx Dispensed & Loaded',
            content: `${rxMedicine} (${rxDosage}) for ${rxDuration || '3 days'}. Prescribing Physician: ${p.doctor || 'Dr. Mehta'}.`,
            time: 'Just now',
            type: 'prescription',
          };
          // If was urgent/pending, shift them to scheduled/healthy after receiving dosage
          const nextStatus = p.status === 'urgent' ? 'pending' : 'healthy';
          return {
            ...p,
            status: nextStatus,
            timeline: [newLog, ...p.timeline],
          };
        }
        return p;
      })
    );

    notify({
      type: 'success',
      title: 'Prescription Dispatched',
      message: `Rx successfully logged on ${patientObj.name} medical chart.`,
      duration: 3500,
    });

    // Reset Form
    setRxMedicine('');
    setRxDosage('');
    setRxDuration('');
  };

  // Admit / Discharge patient from triage queue to healthy
  const handleResolveTriage = (patientId: string) => {
    const patientObj = patients.find((p) => p.patientId === patientId);
    if (!patientObj) return;

    setPatients((prev) =>
      prev.map((p) => {
        if (p.patientId === patientId) {
          const newLog: MedicalLog = {
            id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
            title: 'Triage Discharged',
            content: 'Cleared from clinical active monitor. Released back to normal academic classes.',
            time: 'Just now',
            type: 'clearance',
          };
          return {
            ...p,
            status: 'healthy',
            timeline: [newLog, ...p.timeline],
          };
        }
        return p;
      })
    );

    notify({
      type: 'success',
      title: 'Patient Discharged',
      message: `${patientObj.name} was successfully cleared and marked Healthy.`,
      duration: 3000,
    });
  };

  return (
    <PageContainer breadcrumbs={[{ label: 'Administrative Registry' }, { label: 'Health & Clinic Cockpit' }]}>
      
      {/* Header bar */}
      <div className={styles.headerBar}>
        <div>
          <h2 className={styles.headerTitle}>Clinical Health & Wellness Cockpit</h2>
          <p className={styles.headerSubtitle}>
            Track active medical triage queues, audit student health charts, load prescription dosage timelines, and reserve physician appointments.
          </p>
        </div>
      </div>

      {/* Clinical KPI Metrics Row */}
      <div className={`${styles.kpiRow} ml-stats-grid`}>
        <button type="button" className={styles.kpiCard} onClick={() => metricClick('Historically Treated', `${stats.totalTreated} patients`)}>
          <div className={styles.kpiIcon}>
            <Users size={18} />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiValue}>{stats.totalTreated} Patients</span>
            <span className={styles.kpiLabel}>Historically Treated</span>
          </div>
        </button>
        <button type="button" className={styles.kpiCard} onClick={() => metricClick('Active Triage Roster', `${stats.activeQueue} in queue`)}>
          <div className={styles.kpiIcon}>
            <Activity size={18} style={{ color: stats.urgentCount > 0 ? 'var(--stage-orange-text)' : 'inherit' }} />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiValue}>{stats.activeQueue} In Queue</span>
            <span className={styles.kpiLabel}>Active Triage Roster</span>
          </div>
        </button>
        <button type="button" className={styles.kpiCard} onClick={() => metricClick('Clinic Occupancy Ratio', `${stats.occupancyPct}%`)}>
          <div className={styles.kpiIcon}>
            <HeartPulse size={18} style={{ color: 'var(--stage-green-text)' }} />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiValue}>{stats.occupancyPct}%</span>
            <span className={styles.kpiLabel}>Clinic Occupancy Ratio</span>
          </div>
        </button>
        <button type="button" className={styles.kpiCard} onClick={() => metricClick('Urgent Priority Feeds', `${stats.urgentCount} critical`)}>
          <div className={styles.kpiIcon}>
            <AlertTriangle size={18} style={{ color: stats.urgentCount > 0 ? 'var(--stage-orange-text)' : 'inherit' }} />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiValue}>{stats.urgentCount} Critical</span>
            <span className={styles.kpiLabel}>Urgent Priority Feeds</span>
          </div>
        </button>
      </div>

      {/* Main Two Column Workspace */}
      <div className={styles.clinicGrid}>
        
        {/* Left Hand: Central Database & Reservation Calendars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Roster Database Card */}
          <Card>
            <CardHeader
              title="Central Student Medical & Patient Database"
              subtitle="Audits clearance badges, vital measurements, and current physicians."
              action={
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: '1px solid var(--color-border)',
                    fontSize: '11px',
                    background: 'var(--color-bg-card)',
                    color: 'var(--color-text-primary)',
                    cursor: 'pointer',
                  }}
                >
                  <option value="All">All Health Statuses</option>
                  <option value="healthy">Healthy</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="pending">Pending</option>
                  <option value="urgent">Urgent</option>
                  <option value="archived">Archived</option>
                </select>
              }
            />
            <CardBody className={styles.noPadding}>
              
              <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                <div className={styles.searchWrapper}>
                  <Search size={14} className={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Search medical profile by name, symptoms, or pat-ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className={styles.patientTable}>
                  <thead>
                    <tr>
                      <th>Patient ID</th>
                      <th>Patient Name</th>
                      <th>Symptoms / Conditions</th>
                      <th>Vital Stats</th>
                      <th>Clearance Badge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--color-text-muted)', fontSize: '12px' }}>
                          No clinical records match the active filters.
                        </td>
                      </tr>
                    ) : (
                      filteredPatients.map((patient) => (
                        <tr
                          key={patient.patientId}
                          className={styles.patientRow}
                          onClick={() => setSelectedPatient(patient)}
                        >
                          <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{patient.patientId}</td>
                          <td style={{ fontWeight: '500' }}>{patient.name} ({patient.gender.charAt(0)})</td>
                          <td style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                            {patient.symptoms}
                          </td>
                          <td style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                            <span title="BP">{patient.vitals.bp.split(' ')[0]}</span> • <span title="Temperature">{patient.vitals.temp}</span>
                          </td>
                          <td>
                            <span className={`${styles.healthBadge} ${styles[`state-${patient.status}`]}`}>
                              {patient.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </CardBody>
          </Card>

          {/* Appointments Calendar */}
          <Card>
            <CardHeader
              title="Upcoming Reservation Calendar"
              subtitle="Registered slots for diagnostic checks and physician consultations."
            />
            <CardBody className={styles.noPadding}>
              <div style={{ padding: '16px' }}>
                <div className={styles.appointmentGrid}>
                  {appointments.map((slot) => (
                    <div key={slot.id} className={styles.appointmentSlot}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div className={styles.slotTime}>
                          <Clock size={12} />
                          {slot.time}
                        </div>
                        <div className={styles.slotInfo}>
                          <span className={styles.slotTitle}>
                            {slot.patientName} &rarr; <strong>{slot.doctorName}</strong>
                          </span>
                          <span className={styles.slotDetails}>Reason: {slot.symptoms}</span>
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: '9px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          color: 'var(--color-gold)',
                          fontWeight: 'bold',
                        }}
                      >
                        {slot.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>

        </div>

        {/* Right Hand: Priority Triage, Booking Form & Dispenser Loader */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Active Triage Queue Priority */}
          <Card>
            <CardHeader
              title="Active Triage Monitor Queue"
              subtitle="Urgent clinical priorities demanding immediate care."
            />
            <CardBody className={styles.noPadding}>
              <div style={{ padding: '16px' }}>
                <div className={styles.triageList}>
                  {activeTriageQueue.length === 0 ? (
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '16px',
                        color: 'var(--color-text-muted)',
                        fontSize: '12px',
                        backgroundColor: 'var(--color-bg-input)',
                        borderRadius: '6px',
                        border: '1px dashed var(--color-border)',
                      }}
                    >
                      No triage priorities listed. All clear!
                    </div>
                  ) : (
                    activeTriageQueue.map((patient) => (
                      <div
                        key={patient.patientId}
                        className={
                          patient.status === 'urgent'
                            ? styles.triageCardUrgent
                            : styles.triageCard
                        }
                      >
                        <div className={styles.triageInfo}>
                          <span className={styles.triagePatient}>
                            {patient.name} ({patient.patientId})
                          </span>
                          <span className={styles.triageSymptom}>
                            Vitals: Temp {patient.vitals.temp} • Pulse {patient.vitals.pulse} bpm
                          </span>
                          <span style={{ fontSize: '10px', color: 'var(--stage-orange-text)', fontWeight: '500', marginTop: '2px' }}>
                            Condition: {patient.symptoms}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          style={{ padding: '2px 8px', fontSize: '10px', height: '24px', whiteSpace: 'nowrap' }}
                          onClick={() => handleResolveTriage(patient.patientId)}
                        >
                          Resolve & Clear
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Interactive Form: Book Appointment */}
          <Card>
            <CardHeader
              title="Schedule Physician Consultation"
              subtitle="Secure diagnostic calendar bookings."
            />
            <CardBody className={styles.noPadding}>
              <form onSubmit={handleBookAppointment} style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                
                <label className={styles.formLabel}>
                  <span>Target Student Patient</span>
                  <select
                    value={bookPatientId}
                    onChange={(e) => setBookPatientId(e.target.value)}
                    className={styles.formSelect}
                  >
                    {patients.map((p) => (
                      <option key={p.patientId} value={p.patientId}>
                        {p.name} ({p.patientId})
                      </option>
                    ))}
                  </select>
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <label className={styles.formLabel}>
                    <span>Duty Physician</span>
                    <select
                      value={bookDoctor}
                      onChange={(e) => setBookDoctor(e.target.value)}
                      className={styles.formSelect}
                    >
                      <option value="Dr. Vikram Seth">Dr. Vikram Seth (General)</option>
                      <option value="Dr. Anjali Mehta">Dr. Anjali Mehta (Pediatrics)</option>
                      <option value="Dr. Sunil Rao">Dr. Sunil Rao (Ortho)</option>
                    </select>
                  </label>

                  <label className={styles.formLabel}>
                    <span>Available Slot</span>
                    <select
                      value={bookTime}
                      onChange={(e) => setBookTime(e.target.value)}
                      className={styles.formSelect}
                    >
                      <option value="11:30 AM - 12:00 PM">11:30 AM - 12:00 PM</option>
                      <option value="12:00 PM - 12:30 PM">12:00 PM - 12:30 PM</option>
                      <option value="03:00 PM - 03:30 PM">03:00 PM - 03:30 PM</option>
                      <option value="04:00 PM - 04:30 PM">04:00 PM - 04:30 PM</option>
                    </select>
                  </label>
                </div>

                <label className={styles.formLabel}>
                  <span>Symptoms / Diagnostic Scope</span>
                  <input
                    type="text"
                    required
                    placeholder="Describe active diagnostic targets..."
                    value={bookSymptoms}
                    onChange={(e) => setBookSymptoms(e.target.value)}
                    className={styles.formInput}
                  />
                </label>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <Button variant="gold" size="sm" type="submit" icon={<Calendar size={12} />}>
                    Confirm Reservation
                  </Button>
                </div>

              </form>
            </CardBody>
          </Card>

          {/* Interactive Form: Prescription Dispenser Loader */}
          <Card>
            <CardHeader
              title="Clinical Prescription Loader"
              subtitle="Write medication logs directly onto student dosage timelines."
            />
            <CardBody className={styles.noPadding}>
              <form onSubmit={handleDispensePrescription} style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                
                <label className={styles.formLabel}>
                  <span>Select Active Patient Chart</span>
                  <select
                    value={rxPatientId}
                    onChange={(e) => setRxPatientId(e.target.value)}
                    className={styles.formSelect}
                  >
                    {patients.map((p) => (
                      <option key={p.patientId} value={p.patientId}>
                        {p.name} ({p.patientId})
                      </option>
                    ))}
                  </select>
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                  <label className={styles.formLabel}>
                    <span>Prescribed Medicine (Rx)</span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Paracetamol 650mg"
                      value={rxMedicine}
                      onChange={(e) => setRxMedicine(e.target.value)}
                      className={styles.formInput}
                    />
                  </label>

                  <label className={styles.formLabel}>
                    <span>Dosage Frequency</span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 1 tab twice daily"
                      value={rxDosage}
                      onChange={(e) => setRxDosage(e.target.value)}
                      className={styles.formInput}
                    />
                  </label>
                </div>

                <label className={styles.formLabel}>
                  <span>Duration / Specialized Instructions</span>
                  <input
                    type="text"
                    placeholder="e.g. Take after meals for 5 days"
                    value={rxDuration}
                    onChange={(e) => setRxDuration(e.target.value)}
                    className={styles.formInput}
                  />
                </label>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <Button variant="gold" size="sm" type="submit" icon={<Clipboard size={12} />}>
                    Dispense & Log
                  </Button>
                </div>

              </form>
            </CardBody>
          </Card>

        </div>

      </div>

      {/* Patient Profile Detail Drawer */}
      {selectedPatient && (
        <div className={styles.drawerOverlay} onClick={() => setSelectedPatient(null)}>
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            
            <div className={styles.drawerHeader}>
              <span className={styles.drawerTitle}>Student Medical Dossier</span>
              <button type="button" className={styles.drawerClose} onClick={() => setSelectedPatient(null)}>
                <X size={16} />
              </button>
            </div>

            <div className={styles.drawerBody}>
              
              {/* Profile Summary Header inside Drawer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid var(--color-border-subtle)',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-soft-beige)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-brown-dark)',
                    fontSize: '16px',
                    fontWeight: 'bold',
                  }}
                >
                  {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--color-brown-dark)' }}>{selectedPatient.name}</strong>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                    Patient ID: {selectedPatient.patientId} • {selectedPatient.age} yrs • {selectedPatient.gender}
                  </span>
                </div>
              </div>

              {/* Vitals Dashboard */}
              <div>
                <span className={styles.drawerLabel}>Recorded Vital Signs</span>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '10px',
                    marginTop: '6px',
                  }}
                >
                  <div
                    style={{
                      background: 'var(--color-bg-input)',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid var(--color-border-subtle)',
                      textAlign: 'center',
                    }}
                  >
                    <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', display: 'block' }}>Blood Press</span>
                    <strong style={{ fontSize: '11px', color: 'var(--color-brown-dark)', fontFamily: 'monospace' }}>
                      {selectedPatient.vitals.bp.split(' ')[0]}
                    </strong>
                  </div>
                  <div
                    style={{
                      background: 'var(--color-bg-input)',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid var(--color-border-subtle)',
                      textAlign: 'center',
                    }}
                  >
                    <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', display: 'block' }}>Core Temp</span>
                    <strong
                      style={{
                        fontSize: '11px',
                        color: parseFloat(selectedPatient.vitals.temp) > 99.5 ? 'var(--stage-orange-text)' : 'var(--color-brown-dark)',
                        fontFamily: 'monospace',
                      }}
                    >
                      {selectedPatient.vitals.temp}
                    </strong>
                  </div>
                  <div
                    style={{
                      background: 'var(--color-bg-input)',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid var(--color-border-subtle)',
                      textAlign: 'center',
                    }}
                  >
                    <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', display: 'block' }}>Pulse rate</span>
                    <strong style={{ fontSize: '11px', color: 'var(--color-brown-dark)', fontFamily: 'monospace' }}>
                      {selectedPatient.vitals.pulse} bpm
                    </strong>
                  </div>
                </div>
              </div>

              {/* Demographics & symptoms */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <span className={styles.drawerLabel}>College Branch</span>
                  <div className={styles.drawerValue}>{selectedPatient.branch}</div>
                </div>
                <div>
                  <span className={styles.drawerLabel}>Clearance Status</span>
                  <div style={{ marginTop: '2px' }}>
                    <span className={`${styles.healthBadge} ${styles[`state-${selectedPatient.status}`]}`}>
                      {selectedPatient.status}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <span className={styles.drawerLabel}>Presenting Condition Symptoms</span>
                <div className={styles.drawerValue} style={{ fontSize: '12px', fontStyle: 'italic' }}>
                  "{selectedPatient.symptoms}"
                </div>
              </div>

              <div>
                <span className={styles.drawerLabel}>Primary Care Physician</span>
                <div className={styles.drawerValue} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Stethoscope size={13} style={{ color: 'var(--color-gold)' }} />
                  {selectedPatient.doctor || 'Unassigned'}
                </div>
              </div>

              {/* Drawer Timeline Section */}
              <div style={{ borderTop: '1px dashed var(--color-border-subtle)', paddingTop: '16px' }}>
                <span className={styles.drawerLabel} style={{ display: 'block', marginBottom: '12px' }}>
                  Clinical Treatment & Communication Timeline
                </span>
                
                <div className={styles.timeline}>
                  {selectedPatient.timeline.map((item) => (
                    <div key={item.id} className={styles.timelineItem}>
                      <div className={styles.timelineDot} />
                      <div className={styles.timelineHeader}>
                        <span className={styles.timelineTitle}>{item.title}</span>
                        <span className={styles.timelineTime}>{item.time}</span>
                      </div>
                      <p className={styles.timelineContent}>"{item.content}"</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons at bottom of Drawer */}
              <div style={{ borderTop: '1px dashed var(--color-border-subtle)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span className={styles.drawerLabel}>Immediate Clinical Actions</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    variant="gold"
                    size="sm"
                    fullWidth
                    icon={<Clipboard size={12} />}
                    onClick={() => {
                      setRxPatientId(selectedPatient.patientId);
                      setSelectedPatient(null);
                      notify({
                        type: 'info',
                        title: 'Prescription Focus Loaded',
                        message: `Dispenser remapped to target: ${selectedPatient.name}.`,
                      });
                    }}
                  >
                    Dispense Rx Medication
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    icon={<PlusCircle size={12} />}
                    onClick={() => {
                      // Queue for immediate Triage
                      setPatients((prev) =>
                        prev.map((p) => {
                          if (p.patientId === selectedPatient.patientId) {
                            const newLog: MedicalLog = {
                              id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
                              title: 'Triage Queue Priority Spiked',
                              content: 'Condition reassessed. Priority shifted to Urgent active triage monitoring.',
                              time: 'Just now',
                              type: 'triage',
                            };
                            return { ...p, status: 'urgent', timeline: [newLog, ...p.timeline] };
                          }
                          return p;
                        })
                      );
                      setSelectedPatient(null);
                      notify({
                        type: 'warning',
                        title: 'Triage Priority Escalated',
                        message: `${selectedPatient.name} moved to active queue.`,
                      });
                    }}
                  >
                    Queue Triage (Urgent)
                  </Button>
                </div>
              </div>

            </div>

            <div
              style={{
                padding: '16px',
                borderTop: '1px solid var(--color-border-subtle)',
                background: 'var(--color-bg-sidebar)',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <Button variant="ghost" size="sm" onClick={() => setSelectedPatient(null)}>
                Close Dossier
              </Button>
            </div>

          </div>
        </div>
      )}

    </PageContainer>
  );
}
