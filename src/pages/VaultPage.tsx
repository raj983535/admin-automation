import { useState, useMemo } from 'react';
import { PageContainer } from '../layouts';
import { Card, CardBody, CardHeader, Button } from '../components/ui';
import { useNotifications } from '../hooks/useNotifications';
import {
  FolderOpen,
  FileText,
  Lock,
  Eye,
  Key,
  ShieldCheck,
  Search,
  Activity,
  Plus,
  X,
  Server,
  DownloadCloud,
} from 'lucide-react';
import styles from './VaultPage.module.css';

interface VaultFile {
  id: string;
  name: string;
  category: 'Student Documents' | 'Certificates' | 'Financial Records' | 'Legal Documents';
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  status: 'secure' | 'restricted' | 'shared' | 'pending' | 'archived';
  encryptionHash: string;
  downloadsCount: number;
  description: string;
}

type VaultCategory = VaultFile['category'];
type VaultStatus = VaultFile['status'];

interface AccessLog {
  id: string;
  fileName: string;
  actor: string;
  action: 'Accessed' | 'Downloaded' | 'Modified Clearance' | 'Decrypted';
  time: string;
}

const INITIAL_FILES: VaultFile[] = [
  // Student Documents
  {
    id: 'DOC-901',
    name: 'enrollment_dossier_sahil_sharma.pdf',
    category: 'Student Documents',
    size: '2.4 MB',
    uploadedBy: 'Meera Deshmukh',
    uploadedAt: '2026-02-18',
    status: 'secure',
    encryptionHash: 'SHA256:8b4f2c01...a8f2',
    downloadsCount: 3,
    description: 'Official student enrollment dossier, transcript records, and B.Tech entry credentials for Sahil Sharma.',
  },
  {
    id: 'DOC-902',
    name: 'scholarship_disbursement_verification.pdf',
    category: 'Student Documents',
    size: '1.8 MB',
    uploadedBy: 'Rohan Sharma',
    uploadedAt: '2026-03-05',
    status: 'shared',
    encryptionHash: 'SHA256:4c2a9f11...bb73',
    downloadsCount: 12,
    description: 'National scholarship support approvals, bank routing ledger details, and student compliance checklist reports.',
  },
  
  // Certificates
  {
    id: 'DOC-911',
    name: 'btech_degree_template_gold_embossed.eps',
    category: 'Certificates',
    size: '18.4 MB',
    uploadedBy: 'Dr. Sarah Jenkins',
    uploadedAt: '2025-11-12',
    status: 'restricted',
    encryptionHash: 'SHA256:9d8c7a6b...ee34',
    downloadsCount: 1,
    description: 'High-resolution vectors format for gold-embossed digital graduation certificates. Access tightly restricted.',
  },
  {
    id: 'DOC-912',
    name: 'accreditation_excellence_award_2025.pdf',
    category: 'Certificates',
    size: '4.2 MB',
    uploadedBy: 'Dr. Sarah Jenkins',
    uploadedAt: '2025-06-20',
    status: 'secure',
    encryptionHash: 'SHA256:1a2b3c4d...9f8e',
    downloadsCount: 8,
    description: 'State Academic Council Certificate of Operational Excellence awarded to CollegeOS central campus.',
  },

  // Financial Records
  {
    id: 'DOC-921',
    name: 'tuition_invoices_reconciliation_q1.xlsx',
    category: 'Financial Records',
    size: '8.1 MB',
    uploadedBy: 'Rohan Sharma',
    uploadedAt: '2026-04-01',
    status: 'secure',
    encryptionHash: 'SHA256:7f6e5d4c...3b2a',
    downloadsCount: 4,
    description: 'Master spreadsheet tracking UPI and Credit Card processed volume, refund clearances, and pending tuition dues.',
  },
  {
    id: 'DOC-922',
    name: 'audited_balance_sheet_fy2025.pdf',
    category: 'Financial Records',
    size: '12.4 MB',
    uploadedBy: 'Rohan Sharma',
    uploadedAt: '2026-01-15',
    status: 'restricted',
    encryptionHash: 'SHA256:ab89cd01...23ef',
    downloadsCount: 2,
    description: 'External financial audits sheet. Authorized for registrar and administrative board review only.',
  },

  // Legal Documents
  {
    id: 'DOC-931',
    name: 'ugc_accreditation_compliance_renewal.pdf',
    category: 'Legal Documents',
    size: '14.8 MB',
    uploadedBy: 'Meera Deshmukh',
    uploadedAt: '2025-12-01',
    status: 'restricted',
    encryptionHash: 'SHA256:ef45bc89...1234',
    downloadsCount: 5,
    description: 'Compliance matrix filings, regulatory proofs, and legal bounds submitted to university grants boards.',
  },
  {
    id: 'DOC-932',
    name: 'campus_lease_deed_amendment_2026.pdf',
    category: 'Legal Documents',
    size: '6.7 MB',
    uploadedBy: 'Meera Deshmukh',
    uploadedAt: '2026-02-10',
    status: 'pending',
    encryptionHash: 'SHA256:cd78ef12...5678',
    downloadsCount: 0,
    description: 'Pending legal deed registration details regarding campus expansion infrastructure coordinates.',
  },
  {
    id: 'DOC-933',
    name: 'archived_privacy_policy_2023.pdf',
    category: 'Legal Documents',
    size: '1.2 MB',
    uploadedBy: 'Meera Deshmukh',
    uploadedAt: '2023-08-14',
    status: 'archived',
    encryptionHash: 'SHA256:aa11bb22...ccee',
    downloadsCount: 20,
    description: 'Historical privacy policy and student handbook rules. Superseded by 2026 compliance guidelines.',
  },

  // Additional Student Documents
  {
    id: 'DOC-903',
    name: 'transcript_ananya_iyer_btech_cse.pdf',
    category: 'Student Documents',
    size: '3.6 MB',
    uploadedBy: 'Meera Deshmukh',
    uploadedAt: '2026-04-20',
    status: 'secure',
    encryptionHash: 'SHA256:f1e2d3c4...7a8b',
    downloadsCount: 2,
    description: 'Official academic transcript for Ananya Iyer — B.Tech CSE Semesters 1-4 with CGPA 9.12 and distinction marks.',
  },
  {
    id: 'DOC-904',
    name: 'hostel_allotment_letter_fall_2026.pdf',
    category: 'Student Documents',
    size: '890 KB',
    uploadedBy: 'Karan Malhotra',
    uploadedAt: '2026-05-15',
    status: 'shared',
    encryptionHash: 'SHA256:c8d9e0f1...2345',
    downloadsCount: 14,
    description: 'Batch hostel room allotment letters for 120 incoming freshers — double-sharing wing assignments for Block C and D.',
  },

  // Additional Certificates
  {
    id: 'DOC-913',
    name: 'naac_a_plus_grading_certificate.pdf',
    category: 'Certificates',
    size: '2.8 MB',
    uploadedBy: 'Dr. Sarah Jenkins',
    uploadedAt: '2026-01-28',
    status: 'secure',
    encryptionHash: 'SHA256:5b6a7c8d...ef01',
    downloadsCount: 6,
    description: 'National Assessment and Accreditation Council (NAAC) A+ Grade certificate valid until 2031.',
  },
];

export function VaultPage() {
  const { notify } = useNotifications();

  // State Management
  const [files, setFiles] = useState<VaultFile[]>(INITIAL_FILES);
  const [activeCategory, setActiveCategory] = useState<'Student Documents' | 'Certificates' | 'Financial Records' | 'Legal Documents'>('Student Documents');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<VaultFile | null>(null);

  // Security Audit Simulator state
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [auditLogs, setAuditLogs] = useState<string[]>([
    'System audit logs initialized...',
    'Integrity verification complete for Q1 finance files.',
  ]);

  // Access Logs Registry
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([
    { id: 'LOG-301', fileName: 'enrollment_dossier_sahil_sharma.pdf', actor: 'Meera Deshmukh', action: 'Accessed', time: '5 mins ago' },
    { id: 'LOG-302', fileName: 'tuition_invoices_reconciliation_q1.xlsx', actor: 'Rohan Sharma', action: 'Modified Clearance', time: '30 mins ago' },
    { id: 'LOG-303', fileName: 'btech_degree_template_gold_embossed.eps', actor: 'Dr. Sarah Jenkins', action: 'Decrypted', time: '1 hour ago' },
    { id: 'LOG-304', fileName: 'transcript_ananya_iyer_btech_cse.pdf', actor: 'Meera Deshmukh', action: 'Downloaded', time: '2 hours ago' },
    { id: 'LOG-305', fileName: 'naac_a_plus_grading_certificate.pdf', actor: 'Dr. Sarah Jenkins', action: 'Accessed', time: '3 hours ago' },
    { id: 'LOG-306', fileName: 'hostel_allotment_letter_fall_2026.pdf', actor: 'Karan Malhotra', action: 'Modified Clearance', time: '4 hours ago' },
  ]);

  // Custom document addition
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileCategory, setNewFileCategory] = useState<VaultFile['category']>('Student Documents');
  const [newFileSize, setNewFileSize] = useState('1.5 MB');
  const [newFileStatus, setNewFileStatus] = useState<VaultFile['status']>('secure');
  const [newFileDesc, setNewFileDesc] = useState('');

  // Dynamically calculate sidebar categories file count
  const folderCounts = useMemo(() => {
    return {
      'Student Documents': files.filter(f => f.category === 'Student Documents').length,
      'Certificates': files.filter(f => f.category === 'Certificates').length,
      'Financial Records': files.filter(f => f.category === 'Financial Records').length,
      'Legal Documents': files.filter(f => f.category === 'Legal Documents').length,
    };
  }, [files]);

  // Overall analytics variables
  const analytics = useMemo(() => {
    const totalFiles = files.length;
    const secureFiles = files.filter(f => f.status === 'secure').length;
    const restrictedFiles = files.filter(f => f.status === 'restricted').length;
    
    // Simulate total size (mock calculation)
    const totalSize = files.reduce((acc, curr) => acc + parseFloat(curr.size), 0).toFixed(1);
    
    return {
      totalFiles,
      secureFiles,
      restrictedFiles,
      totalSize,
    };
  }, [files]);

  // Active filter logic
  const filteredFiles = useMemo(() => {
    return files.filter(f => {
      const matchCat = f.category === activeCategory;
      const matchQuery = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         f.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         f.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [files, activeCategory, searchQuery]);

  // Modify document clearance level
  const handleUpdateClearance = (fileId: string, newStatus: VaultFile['status']) => {
    setFiles(prev =>
      prev.map(f => {
        if (f.id === fileId) {
          const updated = { ...f, status: newStatus };
          if (selectedFile && selectedFile.id === fileId) {
            setSelectedFile(updated);
          }
          return updated;
        }
        return f;
      })
    );

    // Append access logs
    const activeUser = 'Meera Deshmukh'; // Mock active session user
    const targetName = files.find(f => f.id === fileId)?.name ?? 'Document';
    const newLog: AccessLog = {
      id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
      fileName: targetName,
      actor: activeUser,
      action: 'Modified Clearance',
      time: 'Just now',
    };
    setAccessLogs(prev => [newLog, ...prev]);

    notify({
      type: 'success',
      title: 'Classification Status Changed',
      message: `Safety clearance level is now set to ${newStatus.toUpperCase()}.`,
      duration: 3000
    });
  };

  // Simulating document download
  const handleDownloadFile = (fileId: string) => {
    setFiles(prev =>
      prev.map(f => {
        if (f.id === fileId) {
          const updated = { ...f, downloadsCount: f.downloadsCount + 1 };
          if (selectedFile && selectedFile.id === fileId) {
            setSelectedFile(updated);
          }
          return updated;
        }
        return f;
      })
    );

    // Append access log
    const targetFile = files.find(f => f.id === fileId);
    const newLog: AccessLog = {
      id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
      fileName: targetFile?.name ?? 'file',
      actor: 'Meera Deshmukh',
      action: 'Downloaded',
      time: 'Just now',
    };
    setAccessLogs(prev => [newLog, ...prev]);

    notify({
      type: 'success',
      title: 'Document Key Exported',
      message: `Downloaded local copy of "${targetFile?.name}". Access has been verified and logged.`,
      duration: 3500
    });
  };

  // Trigger Mock Security Audit Scanner
  const handleTriggerSecurityAudit = () => {
    if (isAuditing) return;
    
    setIsAuditing(true);
    setAuditProgress(10);
    setAuditLogs(prev => ['Initializing cryptographical audit scans...', ...prev]);

    const intervals = [30, 60, 85, 100];
    
    intervals.forEach((prog, index) => {
      setTimeout(() => {
        setAuditProgress(prog);
        if (prog === 30) {
          setAuditLogs(prev => ['Scanning SHA256 integrity signatures...', ...prev]);
        } else if (prog === 60) {
          setAuditLogs(prev => ['Verifying secure access role bounds...', ...prev]);
        } else if (prog === 85) {
          setAuditLogs(prev => ['Checking for active download session leakage...', ...prev]);
        } else if (prog === 100) {
          setIsAuditing(false);
          setAuditLogs(prev => [
            `Audit check complete. Verified ${files.length} active documents. Security rating is 100%.`,
            ...prev
          ]);
          notify({
            type: 'success',
            title: 'Audit Complete',
            message: 'All SHA256 hashes successfully reconciled. No leakage detected.',
            duration: 4000
          });
        }
      }, (index + 1) * 800);
    });
  };

  // Upload Custom Document
  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) {
      notify({ type: 'error', title: 'File Creation Failed', message: 'Please specify a document filename.' });
      return;
    }

    // Ensure extension
    let finalName = newFileName.trim().toLowerCase().replace(/\s+/g, '_');
    if (!finalName.endsWith('.pdf') && !finalName.endsWith('.xlsx') && !finalName.endsWith('.docx') && !finalName.endsWith('.eps')) {
      finalName += '.pdf';
    }

    const newDoc: VaultFile = {
      id: `DOC-${Math.floor(940 + Math.random() * 50)}`,
      name: finalName,
      category: newFileCategory,
      size: newFileSize,
      uploadedBy: 'Meera Deshmukh',
      uploadedAt: new Date().toISOString().split('T')[0],
      status: newFileStatus,
      encryptionHash: `SHA256:${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
      downloadsCount: 0,
      description: newFileDesc.trim() || 'Custom uploaded compliance or institutional record.',
    };

    setFiles(prev => [newDoc, ...prev]);
    
    // Add access log
    const newLog: AccessLog = {
      id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
      fileName: newDoc.name,
      actor: 'Meera Deshmukh',
      action: 'Accessed',
      time: 'Just now',
    };
    setAccessLogs(prev => [newLog, ...prev]);

    // Reset Form
    setNewFileName('');
    setNewFileDesc('');
    setShowAddForm(false);

    notify({
      type: 'success',
      title: 'Record Securely Vaulted',
      message: `"${newDoc.name}" has been encrypted under SHA-256 and pushed to ${newDoc.category} partition.`,
      duration: 4000
    });
  };

  return (
    <PageContainer breadcrumbs={[{ label: 'Operations & Registry' }, { label: 'Secure Storage Vault' }]}>
      
      {/* Upper header title row */}
      <div className={styles.headerBar}>
        <div>
          <h2 className={styles.headerTitle}>Institutional Storage Vault</h2>
          <p className={styles.headerSubtitle}>
            Secure student enrollment files, legal transcripts, accredited balance sheets, and gold-embossed graduation templates.
          </p>
        </div>
        <div>
          <Button
            variant="gold"
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => setShowAddForm(prev => !prev)}
          >
            Vault New File
          </Button>
        </div>
      </div>

      {/* Analytics widgets row */}
      <div className={styles.analyticsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Server size={18} /></div>
          <div className={styles.statInfo}>
            <span className={styles.statVal}>{analytics.totalSize} MB</span>
            <span className={styles.statLabel}>Encrypted Storage Used</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Lock size={18} style={{ color: 'var(--stage-green-text)' }} /></div>
          <div className={styles.statInfo}>
            <span className={styles.statVal}>{analytics.secureFiles} Files</span>
            <span className={styles.statLabel}>Highly Secure Clearance</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><ShieldCheck size={18} style={{ color: 'var(--stage-purple-text)' }} /></div>
          <div className={styles.statInfo}>
            <span className={styles.statVal}>{analytics.restrictedFiles} Files</span>
            <span className={styles.statLabel}>Strict Restricted Access</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Activity size={18} /></div>
          <div className={styles.statInfo}>
            <span className={styles.statVal}>{analytics.totalFiles} Total</span>
            <span className={styles.statLabel}>Institutional Documents</span>
          </div>
        </div>
      </div>

      {/* Vault folder layout split grid */}
      <div className={styles.vaultGrid}>
        
        {/* Left Side: Folder Hierarchy tree */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <Card>
            <CardHeader title="Vault Partitions" subtitle="File organization folders." />
            <CardBody className={styles.noPadding}>
              <div style={{ padding: '12px' }}>
                <div className={styles.folderList}>
                  {(['Student Documents', 'Certificates', 'Financial Records', 'Legal Documents'] as const).map(cat => {
                    const isActive = activeCategory === cat;
                    return (
                      <div
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`${styles.folderItem} ${isActive ? styles.activeFolderItem : ''}`}
                      >
                        <div className={styles.folderLeft}>
                          <FolderOpen size={14} style={{ color: isActive ? 'var(--color-gold)' : 'var(--color-text-secondary)' }} />
                          <span style={{ fontSize: '12px' }}>{cat}</span>
                        </div>
                        <span className={styles.folderCount}>{folderCounts[cat]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Secure Audit Board */}
          <Card>
            <CardHeader title="Security Scan & Audit" subtitle="Verification logs." />
            <CardBody className={styles.noPadding}>
              <div style={{ padding: '16px' }}>
                <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                  Validate all cryptographical hashes, scan file signatures, and check clearance access tokens.
                </p>
                <div className={styles.auditBox}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                    <strong>System Integrity:</strong>
                    <span style={{ color: 'var(--stage-green-text)', fontWeight: 'bold' }}>100% SECURE</span>
                  </div>
                  
                  {isAuditing && (
                    <div className={styles.progressContainer}>
                      <div className={styles.progressBar} style={{ width: `${auditProgress}%` }} />
                    </div>
                  )}

                  <div style={{ marginTop: '12px' }}>
                    <Button 
                      variant="gold" 
                      size="sm" 
                      fullWidth 
                      disabled={isAuditing}
                      onClick={handleTriggerSecurityAudit}
                    >
                      {isAuditing ? `Auditing (${auditProgress}%)` : 'Verify SHA256 Hashes'}
                    </Button>
                  </div>
                </div>

                <div className={styles.auditLogList}>
                  {auditLogs.map((log, i) => (
                    <div key={i} className={styles.auditLogItem}>
                      ➜ {log}
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>

        </div>

        {/* Right Side: File List & Logs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <Card>
            <CardHeader 
              title={`${activeCategory}`} 
              subtitle={`Detailed view of archived documents under ${activeCategory} partition.`}
              action={
                <div className={styles.searchWrapper} style={{ maxWidth: '280px' }}>
                  <Search size={12} className={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Filter file by name..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                    style={{ padding: '6px 10px 6px 30px', fontSize: '12px' }}
                  />
                </div>
              }
            />
            <CardBody className={styles.noPadding}>
              
              {/* Add Custom Document Form dropdown */}
              {showAddForm && (
                <form onSubmit={handleCreateDocument} style={{ padding: '20px', backgroundColor: 'var(--color-bg-sidebar)', borderBottom: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h4 style={{ fontSize: '12px', color: 'var(--color-brown-dark)' }}>Upload Document Profile</h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                    <label className={styles.formLabel}>
                      <span>Document Title / Name *</span>
                      <input type="text" required value={newFileName} onChange={e => setNewFileName(e.target.value)} placeholder="e.g. syllabus_compliance_2026" className={styles.formInput} />
                    </label>
                    <label className={styles.formLabel}>
                      <span>Mock File Size</span>
                      <input type="text" required value={newFileSize} onChange={e => setNewFileSize(e.target.value)} placeholder="e.g. 3.4 MB" className={styles.formInput} />
                    </label>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <label className={styles.formLabel}>
                      <span>Partition Category *</span>
                      <select value={newFileCategory} onChange={e => setNewFileCategory(e.target.value as VaultCategory)} className={styles.formSelect}>
                        <option value="Student Documents">Student Documents</option>
                        <option value="Certificates">Certificates</option>
                        <option value="Financial Records">Financial Records</option>
                        <option value="Legal Documents">Legal Documents</option>
                      </select>
                    </label>
                    <label className={styles.formLabel}>
                      <span>Clearance Classification *</span>
                      <select value={newFileStatus} onChange={e => setNewFileStatus(e.target.value as VaultStatus)} className={styles.formSelect}>
                        <option value="secure">Secure</option>
                        <option value="restricted">Restricted</option>
                        <option value="shared">Shared</option>
                        <option value="pending">Pending</option>
                      </select>
                    </label>
                  </div>

                  <label className={styles.formLabel}>
                    <span>Document Summary / Details</span>
                    <textarea rows={2} value={newFileDesc} onChange={e => setNewFileDesc(e.target.value)} placeholder="Provide information regarding purpose, auditing parameters..." className={styles.formInput} style={{ resize: 'vertical' }} />
                  </label>

                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '6px' }}>
                    <Button variant="ghost" size="sm" type="button" onClick={() => setShowAddForm(false)}>Cancel</Button>
                    <Button variant="gold" size="sm" type="submit">Encrypt & Push to Vault</Button>
                  </div>
                </form>
              )}

              <table className={styles.fileTable}>
                <thead>
                  <tr>
                    <th>Filename</th>
                    <th>Size</th>
                    <th>Uploaded</th>
                    <th>Access Level</th>
                    <th style={{ width: '80px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)', fontSize: '12px' }}>
                        No vaulted documents matching query registered here.
                      </td>
                    </tr>
                  ) : (
                    filteredFiles.map(f => (
                      <tr 
                        key={f.id} 
                        className={styles.fileRow}
                        onClick={() => setSelectedFile(f)}
                      >
                        <td>
                          <div className={styles.fileNameCol}>
                            <FileText size={14} style={{ color: 'var(--color-gold)' }} />
                            <span>{f.name}</span>
                          </div>
                        </td>
                        <td style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>{f.size}</td>
                        <td style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>{f.uploadedAt}</td>
                        <td>
                          <span className={`${styles.docBadge} ${styles[`status-${f.status}`]}`}>
                            {f.status}
                          </span>
                        </td>
                        <td onClick={e => e.stopPropagation()}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            style={{ padding: '4px' }}
                            icon={<Eye size={12} />}
                            onClick={() => setSelectedFile(f)}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

            </CardBody>
          </Card>

          {/* Access Logs Board */}
          <Card>
            <CardHeader title="Vault Download & Clearance Logs" subtitle="Continuous audits on registry document checks." />
            <CardBody className={styles.noPadding}>
              <div style={{ padding: '16px' }}>
                <table className={styles.fileTable}>
                  <thead>
                    <tr>
                      <th>Document</th>
                      <th>User</th>
                      <th>Activity Type</th>
                      <th>Log Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accessLogs.map(log => (
                      <tr key={log.id}>
                        <td style={{ fontSize: '12px', fontWeight: '500' }}>{log.fileName}</td>
                        <td style={{ fontSize: '12px', color: 'var(--color-text-primary)' }}>{log.actor}</td>
                        <td>
                          <span style={{ 
                            fontSize: '9px', 
                            padding: '2px 6px', 
                            borderRadius: '4px',
                            backgroundColor: log.action === 'Accessed' ? 'var(--stage-purple-bg)' : 
                                            log.action === 'Decrypted' ? 'var(--stage-red-bg)' : 
                                            log.action === 'Downloaded' ? 'var(--stage-green-bg)' : 'var(--stage-blue-bg)',
                            color: log.action === 'Accessed' ? 'var(--stage-purple-text)' : 
                                   log.action === 'Decrypted' ? 'var(--stage-red-text)' : 
                                   log.action === 'Downloaded' ? 'var(--stage-green-text)' : 'var(--stage-blue-text)',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                          }}>
                            {log.action}
                          </span>
                        </td>
                        <td style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{log.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>

        </div>

      </div>

      {/* File Drawer details overlay */}
      {selectedFile && (
        <div className={styles.drawerOverlay} onClick={() => setSelectedFile(null)}>
          <div className={styles.drawer} onClick={e => e.stopPropagation()}>
            
            <div className={styles.drawerHeader}>
              <span className={styles.drawerTitle}>Document Audit Details</span>
              <button type="button" className={styles.drawerClose} onClick={() => setSelectedFile(null)}>
                <X size={16} />
              </button>
            </div>

            <div className={styles.drawerBody}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: 'var(--color-gold-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold)' }}>
                  <FileText size={24} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <strong style={{ fontSize: '13px', color: 'var(--color-brown-dark)', wordBreak: 'break-all' }}>{selectedFile.name}</strong>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Partition: {selectedFile.category}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <span className={styles.drawerLabel}>Document Reference ID</span>
                  <div className={styles.drawerValue} style={{ fontFamily: 'monospace' }}>{selectedFile.id}</div>
                </div>
                <div>
                  <span className={styles.drawerLabel}>File size</span>
                  <div className={styles.drawerValue}>{selectedFile.size}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <span className={styles.drawerLabel}>Uploaded By</span>
                  <div className={styles.drawerValue}>{selectedFile.uploadedBy}</div>
                </div>
                <div>
                  <span className={styles.drawerLabel}>Uploaded At</span>
                  <div className={styles.drawerValue}>{selectedFile.uploadedAt}</div>
                </div>
              </div>

              <div>
                <span className={styles.drawerLabel}>SHA-256 SHA Cryptographical Hash</span>
                <div 
                  className={styles.drawerValue} 
                  style={{ 
                    fontFamily: 'monospace', 
                    fontSize: '11px', 
                    backgroundColor: 'var(--color-bg-sidebar)', 
                    border: '1px solid var(--color-border)', 
                    padding: '6px 10px', 
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '4px',
                  }}
                >
                  <Key size={10} style={{ color: 'var(--color-gold)' }} />
                  {selectedFile.encryptionHash}
                </div>
              </div>

              <div>
                <span className={styles.drawerLabel}>Current Clearance level</span>
                <div style={{ marginTop: '4px' }}>
                  <span className={`${styles.docBadge} ${styles[`status-${selectedFile.status}`]}`}>
                    {selectedFile.status}
                  </span>
                </div>
              </div>

              {/* Adjust Clearance drop levels */}
              <label className={styles.formLabel} style={{ borderTop: '1px dashed var(--color-border-subtle)', paddingTop: '16px' }}>
                <span>Modify Security Classification Map</span>
                <select
                  value={selectedFile.status}
                  onChange={e => handleUpdateClearance(selectedFile.id, e.target.value as VaultStatus)}
                  className={styles.formSelect}
                >
                  <option value="secure">Secure</option>
                  <option value="restricted">Restricted</option>
                  <option value="shared">Shared</option>
                  <option value="pending">Pending</option>
                  <option value="archived">Archived</option>
                </select>
              </label>

              <div style={{ borderTop: '1px dashed var(--color-border-subtle)', paddingTop: '16px' }}>
                <span className={styles.drawerLabel}>Document Summary & Details</span>
                <p style={{ fontSize: '12px', color: 'var(--color-text-primary)', marginTop: '4px', lineHeight: '1.4' }}>
                  {selectedFile.description}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '16px' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                  Total system exports: <strong>{selectedFile.downloadsCount} downloads</strong>
                </span>
                <Button 
                  variant="gold" 
                  size="sm" 
                  icon={<DownloadCloud size={14} />}
                  onClick={() => handleDownloadFile(selectedFile.id)}
                >
                  Download File
                </Button>
              </div>

            </div>

            <div style={{ padding: '16px', borderTop: '1px solid var(--color-border-subtle)', background: 'var(--color-bg-sidebar)', display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="ghost" size="sm" onClick={() => setSelectedFile(null)}>Close Drawer</Button>
            </div>

          </div>
        </div>
      )}

    </PageContainer>
  );
}
