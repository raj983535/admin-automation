import { useState, useMemo } from 'react';
import { PageContainer } from '../layouts';
import { Card, CardBody, CardHeader, Button } from '../components/ui';
import { useNotifications } from '../hooks/useNotifications';
import {
  Search,
  Plus,
  Shield,
  Activity,
  X,
  Check,
} from 'lucide-react';
import styles from './ManageStaffPage.module.css';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'management' | 'faculty' | 'finance' | 'support' | 'inactive';
  department: string;
  joined: string;
  responsibility: string;
  phone: string;
}

type StaffRole = StaffMember['role'];

interface Department {
  id: string;
  name: string;
  head: string;
  count: number;
}

interface ActivityLog {
  id: string;
  staffName: string;
  action: string;
  time: string;
}

const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'STF-501',
    name: 'Dr. Sarah Jenkins',
    email: 'sarah.jenkins@college.edu',
    role: 'management',
    department: 'Academic Affairs',
    joined: '2020-08-15',
    responsibility: 'Dean of Computer Sciences & Research Coordination',
    phone: '+1 (555) 019-2834',
  },
  {
    id: 'STF-502',
    name: 'Prof. Amit Kulkarni',
    email: 'amit.kulkarni@college.edu',
    role: 'faculty',
    department: 'Computer Science',
    joined: '2021-01-10',
    responsibility: 'Senior Lecturer, Discrete Mathematics & Vector Fields',
    phone: '+1 (555) 019-8821',
  },
  {
    id: 'STF-503',
    name: 'Meera Deshmukh',
    email: 'meera.deshmukh@college.edu',
    role: 'admin',
    department: 'Registrar Office',
    joined: '2019-05-12',
    responsibility: 'Chief Operations Officer & Enrollment Auditor',
    phone: '+1 (555) 019-3382',
  },
  {
    id: 'STF-504',
    name: 'Rohan Sharma',
    email: 'rohan.sharma@college.edu',
    role: 'finance',
    department: 'Accounts & Audits',
    joined: '2022-03-24',
    responsibility: 'Chief Accounts Officer & Merchant Reconciliation HOD',
    phone: '+1 (555) 019-4475',
  },
  {
    id: 'STF-505',
    name: 'Anita Roy',
    email: 'anita.roy@college.edu',
    role: 'support',
    department: 'Student Facilities',
    joined: '2023-09-01',
    responsibility: 'Support Supervisor, Counseling Overflow Logistics',
    phone: '+1 (555) 019-9911',
  },
  {
    id: 'STF-506',
    name: 'Karan Malhotra',
    email: 'karan.m@college.edu',
    role: 'inactive',
    department: 'Physical Education',
    joined: '2018-07-15',
    responsibility: 'Sports Coordinator (On Sabbatical Leaves)',
    phone: '+1 (555) 019-5562',
  },
  {
    id: 'STF-507',
    name: 'Swati Sen',
    email: 'swati.sen@college.edu',
    role: 'faculty',
    department: 'Biotechnology',
    joined: '2023-01-15',
    responsibility: 'Lecturer, Molecular Biology & Genomics Lab Coordinator',
    phone: '+91 98765 07823',
  },
  {
    id: 'STF-508',
    name: 'Dr. Ramesh Prasad',
    email: 'ramesh.prasad@college.edu',
    role: 'management',
    department: 'Library Sciences',
    joined: '2017-06-20',
    responsibility: 'Chief Librarian & Digital Repository Architect',
    phone: '+91 98765 08134',
  },
];

const INITIAL_DEPARTMENTS: Department[] = [
  { id: 'DEP-01', name: 'Computer Science', head: 'Dr. Sarah Jenkins', count: 18 },
  { id: 'DEP-02', name: 'Academic Affairs', head: 'Dr. Sarah Jenkins', count: 8 },
  { id: 'DEP-03', name: 'Accounts & Audits', head: 'Rohan Sharma', count: 5 },
  { id: 'DEP-04', name: 'Registrar Office', head: 'Meera Deshmukh', count: 12 },
  { id: 'DEP-05', name: 'Student Facilities', head: 'Anita Roy', count: 7 },
  { id: 'DEP-06', name: 'Biotechnology', head: 'Swati Sen', count: 9 },
];

const INITIAL_PERMISSIONS: Record<string, string[]> = {
  admin: ['Enrollment Control', 'Financial Authorization', 'Scheduling Rights', 'Records Updates', 'Staff Onboarding', 'System Audits'],
  management: ['Enrollment Control', 'Scheduling Rights', 'Records Updates', 'Staff Onboarding'],
  faculty: ['Scheduling Rights', 'Records Updates'],
  finance: ['Financial Authorization', 'Records Updates'],
  support: ['Records Updates'],
  inactive: [],
};

const ALL_PERMISSION_KEYS = [
  'Enrollment Control',
  'Financial Authorization',
  'Scheduling Rights',
  'Records Updates',
  'Staff Onboarding',
  'System Audits',
];

export function ManageStaffPage() {
  const { notify } = useNotifications();

  // State
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [permissions, setPermissions] = useState<Record<string, string[]>>(INITIAL_PERMISSIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState<string | null>(null);
  
  // Selection / Drawer state
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  
  // Custom permissions matrix role context
  const [selectedMatrixRole, setSelectedMatrixRole] = useState<'admin' | 'management' | 'faculty' | 'finance' | 'support'>('management');

  // Logs state
  const [logs, setLogs] = useState<ActivityLog[]>([
    { id: 'LOG-881', staffName: 'Meera Deshmukh', action: 'Elevated Prof. Amit Kulkarni credentials to Faculty status', time: '10 mins ago' },
    { id: 'LOG-882', staffName: 'Dr. Sarah Jenkins', action: 'Updated Computer Science syllabus indexing privileges', time: '1 hour ago' },
    { id: 'LOG-883', staffName: 'Rohan Sharma', action: 'Approved Student Accounts merchant API reconciliation run', time: '2 hours ago' },
  ]);

  // Form input for staff onboarding
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<StaffRole>('faculty');
  const [newStaffDept, setNewStaffDept] = useState('Computer Science');
  const [newStaffResp, setNewStaffResp] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');

  // Filter staff list
  const filteredStaff = useMemo(() => {
    return staff.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = roleFilter === 'All' ? true : s.role === roleFilter;
      const matchDept = deptFilter ? s.department === deptFilter : true;
      return matchSearch && matchRole && matchDept;
    });
  }, [staff, searchQuery, roleFilter, deptFilter]);

  // Handle staff role update in drawer
  const handleUpdateStaffRole = (staffId: string, newRole: typeof INITIAL_STAFF[number]['role']) => {
    setStaff(prev => 
      prev.map(s => {
        if (s.id === staffId) {
          const updated = { ...s, role: newRole };
          if (selectedStaff && selectedStaff.id === staffId) {
            setSelectedStaff(updated);
          }
          return updated;
        }
        return s;
      })
    );

    // Append audit log
    const activeAuditor = 'Meera Deshmukh'; // Mock active user
    const newLog: ActivityLog = {
      id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
      staffName: activeAuditor,
      action: `Adjusted role of ${staff.find(s => s.id === staffId)?.name} to ${newRole.toUpperCase()}`,
      time: 'Just now',
    };
    setLogs(prev => [newLog, ...prev]);

    notify({
      type: 'success',
      title: 'Credential Authority Modified',
      message: `System successfully synchronized staff security status to ${newRole.toUpperCase()}.`,
      duration: 3000
    });
  };

  // Handle staff department update
  const handleUpdateStaffDept = (staffId: string, newDept: string) => {
    setStaff(prev =>
      prev.map(s => {
        if (s.id === staffId) {
          const updated = { ...s, department: newDept };
          if (selectedStaff && selectedStaff.id === staffId) {
            setSelectedStaff(updated);
          }
          return updated;
        }
        return s;
      })
    );

    notify({
      type: 'info',
      title: 'Department Transferred',
      message: 'Personnel file remapped under the new administrative node.',
    });
  };

  // Toggle Matrix Permission Checkbox
  const handleTogglePermission = (role: string, perm: string) => {
    setPermissions(prev => {
      const active = prev[role] ?? [];
      const updated = active.includes(perm)
        ? active.filter(p => p !== perm)
        : [...active, perm];
      return { ...prev, [role]: updated };
    });

    notify({
      type: 'success',
      title: 'Policy Matrix Synchronized',
      message: `Authorization key "${perm}" updated for ${role.toUpperCase()} operational role.`,
      duration: 2500
    });
  };

  // Register new staff member
  const handleOnboardStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffEmail.trim() || !newStaffPhone.trim()) {
      notify({ type: 'error', title: 'Onboarding Failed', message: 'Full name, email, and contact info are required.' });
      return;
    }

    const newMember: StaffMember = {
      id: `STF-${Math.floor(500 + Math.random() * 500)}`,
      name: newStaffName.trim(),
      email: newStaffEmail.trim(),
      role: newStaffRole,
      department: newStaffDept,
      joined: new Date().toISOString().split('T')[0],
      responsibility: newStaffResp.trim() || 'Assigned General Departmental Administration duties.',
      phone: newStaffPhone.trim(),
    };

    setStaff(prev => [...prev, newMember]);
    
    // Update department headcount
    setDepartments(prev => 
      prev.map(d => d.name === newStaffDept ? { ...d, count: d.count + 1 } : d)
    );

    // Add log
    const newLog: ActivityLog = {
      id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
      staffName: 'Meera Deshmukh',
      action: `Onboarded new staff member ${newMember.name} under ${newMember.department} department`,
      time: 'Just now',
    };
    setLogs(prev => [newLog, ...prev]);

    // Reset Form
    setNewStaffName('');
    setNewStaffEmail('');
    setNewStaffPhone('');
    setNewStaffResp('');
    setShowAddForm(false);

    notify({
      type: 'success',
      title: 'Staff Personnel Onboarded',
      message: `New profile card registered for ${newMember.name} and mapped to ${newStaffDept}.`,
      duration: 4000
    });
  };

  return (
    <PageContainer breadcrumbs={[{ label: 'Administrative Console' }, { label: 'Personnel & Security' }]}>
      
      {/* Header section */}
      <div className={styles.headerBar}>
        <div>
          <h2 className={styles.headerTitle}>Manage Staff & Access Control</h2>
          <p className={styles.headerSubtitle}>
            Configure organizational hierarchies, trace advisor activity trails, review authorization matrices, and adjust operational clearance policies.
          </p>
        </div>
        <div>
          <Button
            variant="gold"
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => setShowAddForm(prev => !prev)}
          >
            Onboard New Staff
          </Button>
        </div>
      </div>

      {/* Departments row cards */}
      <div className={styles.sectionHeaderRow}>
        <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-brown-dark)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Department Node Overview</h4>
      </div>
      <div className={styles.deptGrid}>
        {departments.map(dept => (
          <button
            key={dept.id}
            type="button"
            className={`${styles.deptCard} ${deptFilter === dept.name ? styles.deptCardActive : ''}`}
            onClick={() => {
              setDeptFilter((prev) => (prev === dept.name ? null : dept.name));
              notify({
                type: 'info',
                title: deptFilter === dept.name ? 'Filter cleared' : 'Department filter',
                message:
                  deptFilter === dept.name
                    ? 'Showing all departments.'
                    : `Showing staff in ${dept.name}.`,
              });
            }}
          >
            <div className={styles.deptHeader}>
              <span className={styles.deptTitle}>{dept.name}</span>
              <span className={styles.deptCount}>{dept.count} Members</span>
            </div>
            <div className={styles.deptMeta}>
              HOD: <strong>{dept.head}</strong>
            </div>
            <div style={{ fontSize: '9px', fontFamily: 'monospace', marginTop: '6px', color: 'var(--color-text-muted)' }}>
              NODE REF: {dept.id}
            </div>
          </button>
        ))}
      </div>

      {/* Main split grid */}
      <div className={styles.mainGrid}>
        
        {/* Left Side: Directory and Filters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          
          <Card>
            <CardHeader 
              title="Staff Directory Roster" 
              subtitle="Search and select staff records for access profiles and audits."
              action={
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select 
                    value={roleFilter}
                    onChange={e => setRoleFilter(e.target.value)}
                    style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '11px', background: 'var(--color-bg-card)', color: 'var(--color-text-primary)' }}
                  >
                    <option value="All">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="management">Management</option>
                    <option value="faculty">Faculty</option>
                    <option value="finance">Finance</option>
                    <option value="support">Support</option>
                    <option value="inactive">Inactive</option>
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
                    placeholder="Search personnel by name, email, or department..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
              </div>

              {/* Onboard New Staff Form Box */}
              {showAddForm && (
                <form onSubmit={handleOnboardStaff} style={{ padding: '20px', backgroundColor: 'var(--color-bg-sidebar)', borderBottom: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h4 style={{ fontSize: '12px', color: 'var(--color-brown-dark)' }}>Staff Onboarding Entry Form</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <label className={styles.formLabel}>
                      <span>Full Name *</span>
                      <input type="text" required value={newStaffName} onChange={e => setNewStaffName(e.target.value)} placeholder="e.g. Dr. Ramesh Prasad" className={styles.formInput} />
                    </label>
                    <label className={styles.formLabel}>
                      <span>Email *</span>
                      <input type="email" required value={newStaffEmail} onChange={e => setNewStaffEmail(e.target.value)} placeholder="ramesh@college.edu" className={styles.formInput} />
                    </label>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <label className={styles.formLabel}>
                      <span>Primary Role Group *</span>
                      <select value={newStaffRole} onChange={e => setNewStaffRole(e.target.value as StaffRole)} className={styles.formSelect}>
                        <option value="admin">Admin</option>
                        <option value="management">Management</option>
                        <option value="faculty">Faculty</option>
                        <option value="finance">Finance</option>
                        <option value="support">Support</option>
                      </select>
                    </label>
                    <label className={styles.formLabel}>
                      <span>Department Node *</span>
                      <select value={newStaffDept} onChange={e => setNewStaffDept(e.target.value)} className={styles.formSelect}>
                        {departments.map(d => (
                          <option key={d.id} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <label className={styles.formLabel}>
                      <span>Contact Phone *</span>
                      <input type="text" required value={newStaffPhone} onChange={e => setNewStaffPhone(e.target.value)} placeholder="+91 98765 43210" className={styles.formInput} />
                    </label>
                    <label className={styles.formLabel}>
                      <span>Assigned Responsibility</span>
                      <input type="text" value={newStaffResp} onChange={e => setNewStaffResp(e.target.value)} placeholder="e.g. Student grievance auditor" className={styles.formInput} />
                    </label>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '6px' }}>
                    <Button variant="ghost" size="sm" type="button" onClick={() => setShowAddForm(false)}>Cancel</Button>
                    <Button variant="gold" size="sm" type="submit">Complete Registry</Button>
                  </div>
                </form>
              )}

              <div style={{ padding: '16px' }}>
                <div className={styles.staffList}>
                  {filteredStaff.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--color-text-muted)', fontSize: '12px' }}>
                      No staff records match your filters.
                    </div>
                  ) : (
                    filteredStaff.map(s => (
                      <div 
                        key={s.id} 
                        className={styles.staffItem}
                        onClick={() => setSelectedStaff(s)}
                      >
                        <div className={styles.staffInfo}>
                          <div className={styles.staffAvatar}>
                            {s.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <div className={styles.staffDetails}>
                            <span className={styles.staffName}>{s.name}</span>
                            <span className={styles.staffSub}>{s.email} • {s.department}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className={`${styles.roleBadge} ${styles[`role-${s.role}`]}`}>
                            {s.role}
                          </span>
                          <span style={{ fontSize: '10px', fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>
                            {s.id}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </CardBody>
          </Card>

          {/* Role Permission Matrix Board */}
          <Card>
            <CardHeader 
              title="Operational Permission Matrix" 
              subtitle="Map access rights and authorizations to specific staffing group keys."
              action={
                <div style={{ display: 'flex', gap: '4px' }}>
                  {(['admin', 'management', 'faculty', 'finance', 'support'] as const).map(role => (
                    <button type="button"
                      key={role}
                      onClick={() => setSelectedMatrixRole(role)}
                      style={{
                        padding: '4px 8px',
                        fontSize: '10px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        borderRadius: '4px',
                        border: selectedMatrixRole === role ? '1px solid var(--color-gold)' : '1px solid var(--color-border)',
                        background: selectedMatrixRole === role ? 'var(--color-gold-soft)' : 'var(--color-bg-card)',
                        color: 'var(--color-brown-dark)',
                        cursor: 'pointer',
                      }}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              }
            />
            <CardBody className={styles.noPadding}>
              <div style={{ padding: '16px' }}>
                <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
                  Below represent global operational keys. Toggling toggles authorization policy maps across all users in <strong>{selectedMatrixRole.toUpperCase()}</strong> class.
                </p>
                <div className={styles.matrixScroll}>
                  <table className={styles.matrixTable}>
                    <thead>
                      <tr>
                        <th>Administrative Capability Key</th>
                        <th style={{ width: '120px', textAlign: 'center' }}>Clearance State</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ALL_PERMISSION_KEYS.map(key => {
                        const isAllowed = permissions[selectedMatrixRole]?.includes(key);
                        return (
                          <tr key={key}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Shield size={12} style={{ color: isAllowed ? 'var(--stage-green-text)' : 'var(--color-text-muted)' }} />
                                <strong>{key}</strong>
                              </div>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <input
                                type="checkbox"
                                checked={isAllowed}
                                onChange={() => handleTogglePermission(selectedMatrixRole, key)}
                                className={styles.matrixCheckbox}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardBody>
          </Card>

        </div>

        {/* Right Side: Security Logs & assigned responsibilities */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          
          <Card>
            <CardHeader title="Security & Activity Audit Trail" subtitle="Live stream of staff updates and elevations." />
            <CardBody className={styles.noPadding}>
              <div style={{ padding: '16px' }}>
                <div className={styles.activityTimeline}>
                  {logs.map(log => (
                    <div key={log.id} className={styles.activityItem}>
                      <div className={styles.activityIcon}>
                        <Activity size={12} />
                      </div>
                      <div className={styles.activityContent}>
                        <span className={styles.activityText}>
                          <strong>{log.staffName}</strong>: {log.action}
                        </span>
                        <span className={styles.activityMeta}>{log.time} • LOG REF: {log.id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Credential Assignment Metrics" subtitle="Active personnel distribution count." />
            <CardBody className={styles.noPadding}>
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(['admin', 'management', 'faculty', 'finance', 'support', 'inactive'] as const).map(role => {
                    const count = staff.filter(s => s.role === role).length;
                    const pct = (count / staff.length) * 100;
                    return (
                      <div key={role}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                          <span style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{role}</span>
                          <span>{count} staff ({Math.round(pct)}%)</span>
                        </div>
                        <div style={{ height: '6px', backgroundColor: 'var(--color-border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div 
                            style={{ 
                              height: '100%', 
                              width: `${pct}%`, 
                              backgroundColor: role === 'admin' ? 'var(--stage-red-text)' : 
                                               role === 'management' ? 'var(--stage-purple-text)' :
                                               role === 'faculty' ? 'var(--stage-blue-text)' :
                                               role === 'finance' ? 'var(--stage-green-text)' :
                                               role === 'support' ? 'var(--stage-orange-text)' : 'var(--stage-gray-text)'
                            }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardBody>
          </Card>

        </div>

      </div>

      {/* Staff Profile slideout drawer */}
      {selectedStaff && (
        <div className={styles.drawerOverlay} onClick={() => setSelectedStaff(null)}>
          <div className={styles.drawer} onClick={e => e.stopPropagation()}>
            
            <div className={styles.drawerHeader}>
              <span className={styles.drawerTitle}>Personnel Security Profile</span>
              <button type="button" className={styles.drawerClose} onClick={() => setSelectedStaff(null)}>
                <X size={16} />
              </button>
            </div>

            <div className={styles.drawerBody}>
              
              <div className={styles.drawerAvatarSection}>
                <div className={styles.drawerLargeAvatar}>
                  {selectedStaff.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className={styles.drawerMeta}>
                  <strong style={{ fontSize: '15px', color: 'var(--color-brown-dark)' }}>{selectedStaff.name}</strong>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{selectedStaff.email}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <span className={styles.drawerLabel}>Personnel ID</span>
                  <div className={styles.drawerValue} style={{ fontFamily: 'monospace' }}>{selectedStaff.id}</div>
                </div>
                <div>
                  <span className={styles.drawerLabel}>Joined Date</span>
                  <div className={styles.drawerValue}>{selectedStaff.joined}</div>
                </div>
              </div>

              <div>
                <span className={styles.drawerLabel}>Primary Contact Phone</span>
                <div className={styles.drawerValue}>{selectedStaff.phone}</div>
              </div>

              <div>
                <span className={styles.drawerLabel}>Core Role Group</span>
                <div style={{ marginTop: '4px' }}>
                  <span className={`${styles.roleBadge} ${styles[`role-${selectedStaff.role}`]}`}>
                    {selectedStaff.role}
                  </span>
                </div>
              </div>

              {/* Adjust Credential Selection */}
              <label className={styles.formLabel} style={{ borderTop: '1px dashed var(--color-border-subtle)', paddingTop: '16px' }}>
                <span>Modify Security Clearance Role</span>
                <select
                  value={selectedStaff.role}
                  onChange={e => handleUpdateStaffRole(selectedStaff.id, e.target.value as StaffRole)}
                  className={styles.formSelect}
                >
                  <option value="admin">Admin</option>
                  <option value="management">Management</option>
                  <option value="faculty">Faculty</option>
                  <option value="finance">Finance</option>
                  <option value="support">Support</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>

              {/* Adjust Department Selection */}
              <label className={styles.formLabel}>
                <span>Reassign Department Node</span>
                <select
                  value={selectedStaff.department}
                  onChange={e => handleUpdateStaffDept(selectedStaff.id, e.target.value)}
                  className={styles.formSelect}
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </label>

              <div style={{ borderTop: '1px dashed var(--color-border-subtle)', paddingTop: '16px' }}>
                <span className={styles.drawerLabel}>Active Duties & Responsibilities</span>
                <p style={{ fontSize: '12px', color: 'var(--color-text-primary)', marginTop: '4px', fontStyle: 'italic', lineHeight: '1.4' }}>
                  "{selectedStaff.responsibility}"
                </p>
              </div>

              <div>
                <span className={styles.drawerLabel}>Authorized Operations Policy Maps</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                  {permissions[selectedStaff.role]?.length === 0 ? (
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>No capabilities authorized.</span>
                  ) : (
                    permissions[selectedStaff.role]?.map(p => (
                      <span 
                        key={p} 
                        style={{
                          fontSize: '9px',
                          backgroundColor: 'var(--color-bg-sidebar)',
                          border: '1px solid var(--color-border)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                        }}
                      >
                        <Check size={8} style={{ color: 'var(--stage-green-text)' }} />
                        {p}
                      </span>
                    ))
                  )}
                </div>
              </div>

            </div>

            <div style={{ padding: '16px', borderTop: '1px solid var(--color-border-subtle)', background: 'var(--color-bg-sidebar)', display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="ghost" size="sm" onClick={() => setSelectedStaff(null)}>Close Profile</Button>
            </div>

          </div>
        </div>
      )}

    </PageContainer>
  );
}
