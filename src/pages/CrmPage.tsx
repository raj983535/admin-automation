import { useState, useEffect, useMemo, useRef } from 'react';
import { PageContainer } from '../layouts';
import { Button, StageChip, MetricTile } from '../components/ui';
import { useMetricClick } from '../hooks/useMetricClick';
import { useNotifications } from '../contexts/NotificationContext';
import {
  Search,
  Plus,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Filter,
  Tag,
  UserCheck,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';
import styles from './CrmPage.module.css';

interface TimelineEvent {
  id: string;
  type: 'system' | 'counsellor' | 'communication';
  title: string;
  time: string;
  notes: string;
}

import type { StudentLead } from '../types/crm.types';

import { crmService } from '../services/crm.service';

export function CrmPage() {
  const { notify } = useNotifications();
  const metricClick = useMetricClick();

  // State Management
  const [leads, setLeads] = useState<StudentLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      const data = await crmService.getLeads();
      setLeads(data);
      setIsLoading(false);
    };
    fetchLeads();
  }, []);
  const [searchName, setSearchName] = useState('');
  const [filterSource, setFilterSource] = useState<string>('All');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  
  // Custom inputs inside Lead Drawer
  const [newNoteText, setNewNoteText] = useState('');
  const [newTagInput, setNewTagInput] = useState('');
  
  // New Lead Creator Modal State
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadCity, setNewLeadCity] = useState('');
  const [newLeadDegree, setNewLeadDegree] = useState('B.Tech CSE');
  const [newLeadSource, setNewLeadSource] = useState<'Meta Ads' | 'Google Search' | 'Referral' | 'Direct Traffic'>('Meta Ads');

  const drawerRef = useRef<HTMLDivElement>(null);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      const matchSearch = l.name.toLowerCase().includes(searchName.toLowerCase()) || 
                          l.degreeTarget.toLowerCase().includes(searchName.toLowerCase()) ||
                          l.city.toLowerCase().includes(searchName.toLowerCase());
      
      const matchSource = filterSource === 'All' ? true : l.source === filterSource;
      
      return matchSearch && matchSource;
    });
  }, [leads, searchName, filterSource]);

  // Selected Lead Helper
  const selectedLead = useMemo(() => {
    return leads.find(l => l.id === selectedLeadId) || null;
  }, [leads, selectedLeadId]);

  // Pipeline Stage Columns
  const pipelineStages: StudentLead['stage'][] = [
    'New Inquiry',
    'Contacted',
    'Counselling Scheduled',
    'Documents Pending',
    'Admission Confirmed',
    'Inactive'
  ];

  // Stage Colors Mapping
  const getStageColor = (stage: StudentLead['stage']): 'blue' | 'purple' | 'orange' | 'yellow' | 'green' | 'gray' => {
    switch (stage) {
      case 'New Inquiry': return 'blue';
      case 'Contacted': return 'purple';
      case 'Counselling Scheduled': return 'orange';
      case 'Documents Pending': return 'yellow';
      case 'Admission Confirmed': return 'green';
      case 'Inactive': return 'gray';
    }
  };

  // Drag-and-drop replacement: Stage transitions triggered by buttons
  const moveLeadStage = (leadId: string, nextStage: StudentLead['stage']) => {
    setLeads(prev =>
      prev.map(l => {
        if (l.id === leadId) {
          const newEvent: TimelineEvent = {
            id: `t-move-${Date.now()}`,
            type: 'system',
            title: `Stage Transferred to ${nextStage}`,
            time: 'Just Now',
            notes: `Moved programmatically by admissions coordinator.`
          };
          return {
            ...l,
            stage: nextStage,
            timeline: [...l.timeline, newEvent]
          };
        }
        return l;
      })
    );
    notify({
      type: 'success',
      title: 'Lead Stage Transitioned',
      message: `Lead has successfully been shifted to stage: ${nextStage}.`
    });
  };

  // Add Custom Note inside Lead Dossier
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !selectedLeadId) return;

    setLeads(prev =>
      prev.map(l => {
        if (l.id === selectedLeadId) {
          const newEvent: TimelineEvent = {
            id: `t-note-${Date.now()}`,
            type: 'counsellor',
            title: 'Advisor Note Appended',
            time: 'Just Now',
            notes: newNoteText.trim()
          };
          return {
            ...l,
            notes: [...l.notes, newNoteText.trim()],
            timeline: [...l.timeline, newEvent]
          };
        }
        return l;
      })
    );

    setNewNoteText('');
    notify({
      type: 'info',
      title: 'Advisor Note Saved',
      message: 'Note has been appended to student audit timelines.'
    });
  };

  // Assign Counsellor Dropdown
  const handleAssignCounsellor = (counsellorName: string) => {
    if (!selectedLeadId) return;

    setLeads(prev =>
      prev.map(l => {
        if (l.id === selectedLeadId) {
          const newEvent: TimelineEvent = {
            id: `t-assign-${Date.now()}`,
            type: 'system',
            title: 'Lead Reassigned',
            time: 'Just Now',
            notes: `Ownership transferred to admissions counsellor: ${counsellorName}`
          };
          return {
            ...l,
            counsellor: counsellorName,
            timeline: [...l.timeline, newEvent]
          };
        }
        return l;
      })
    );

    notify({
      type: 'success',
      title: 'Counsellor Assigned',
      message: `Thread successfully assigned to ${counsellorName}.`
    });
  };

  // Toggle Reminder Status
  const handleToggleReminder = (leadId: string) => {
    setLeads(prev =>
      prev.map(l => {
        if (l.id === leadId) {
          return { ...l, reminderChecked: !l.reminderChecked };
        }
        return l;
      })
    );
    notify({
      type: 'info',
      title: 'Task State Changed',
      message: 'Follow-up task checklist updated successfully.'
    });
  };

  // Add Custom Tag inside Drawer
  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagInput.trim() || !selectedLeadId) return;

    setLeads(prev =>
      prev.map(l => {
        if (l.id === selectedLeadId) {
          if (l.tags.includes(newTagInput.trim())) return l;
          return { ...l, tags: [...l.tags, newTagInput.trim()] };
        }
        return l;
      })
    );
    setNewTagInput('');
  };

  // Launch New Lead Creator Modal
  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName.trim() || !newLeadEmail.trim() || !newLeadPhone.trim()) {
      notify({ type: 'error', title: 'Fields Missing', message: 'Please input candidate name, email, and phone.' });
      return;
    }

    const newLead: StudentLead = {
      id: `lead-${Date.now()}`,
      name: newLeadName.trim(),
      email: newLeadEmail.trim(),
      phone: newLeadPhone.trim(),
      city: newLeadCity.trim() || 'Unknown',
      degreeTarget: newLeadDegree,
      stage: 'New Inquiry',
      source: newLeadSource,
      counsellor: 'Unassigned',
      tags: ['Freshman'],
      notes: [],
      timeline: [
        { id: `t-sim-${Date.now()}`, type: 'system', title: 'Lead Form Captured', time: 'Just Now', notes: 'Created via admin CRM workspace interface.' }
      ]
    };

    setLeads(prev => [newLead, ...prev]);
    setShowAddLeadModal(false);
    
    // Clear inputs
    setNewLeadName('');
    setNewLeadEmail('');
    setNewLeadPhone('');
    setNewLeadCity('');

    notify({
      type: 'success',
      title: 'Student Lead Created',
      message: `${newLead.name} successfully registered in admissions ledger.`,
      duration: 3500
    });
  };

  // Metrics calculators
  const analyticsMetrics = useMemo(() => {
    const totalLeads = leads.length;
    const confirmed = leads.filter(l => l.stage === 'Admission Confirmed').length;
    const conversionRate = totalLeads > 0 ? Math.round((confirmed / totalLeads) * 100) : 0;
    
    // Lead sources counter
    const sources = leads.reduce((acc, current) => {
      acc[current.source] = (acc[current.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { totalLeads, confirmed, conversionRate, sources };
  }, [leads]);

  return (
    <PageContainer breadcrumbs={[{ label: 'CRM & Sales' }, { label: 'Lead Operations Cockpit' }]}>
      
      {/* Upper header section */}
      <div className={styles.headerBar}>
        <div>
          <h2 className={styles.headerTitle}>Admissions CRM Dashboard</h2>
          <p className={styles.headerSubtitle}>
            Centralized lead tracking, interactive drag-stage pipelines, assigned counsellors logs, and dynamic timeline dossiers.
          </p>
        </div>
        <div>
          <Button 
            variant="gold" 
            size="sm" 
            icon={<Plus size={14} />} 
            onClick={() => setShowAddLeadModal(true)}
          >
            Add Candidate Lead
          </Button>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className={`${styles.analyticsStatsBar} ml-stats-grid`}>
        <MetricTile
          className={styles.statMiniBox}
          label="Active Admissions Pipeline"
          value={`${analyticsMetrics.totalLeads} Leads`}
          onClick={() => metricClick('Active Admissions Pipeline', `${analyticsMetrics.totalLeads} leads`)}
        />
        <MetricTile
          className={styles.statMiniBox}
          label="Seat Lock Conversion"
          value={<span style={{ color: 'var(--stage-green-text)' }}>{analyticsMetrics.conversionRate}% Rate</span>}
          onClick={() => metricClick('Seat Lock Conversion', `${analyticsMetrics.conversionRate}%`)}
        />
        <MetricTile
          className={styles.statMiniBox}
          label="Meta Ads Enrolment"
          value={<span style={{ color: 'var(--stage-blue-text)' }}>{analyticsMetrics.sources['Meta Ads'] || 0} Captured</span>}
          onClick={() => metricClick('Meta Ads Enrolment', String(analyticsMetrics.sources['Meta Ads'] || 0))}
        />
        <MetricTile
          className={styles.statMiniBox}
          label="Google Organic Leads"
          value={<span style={{ color: 'var(--stage-purple-text)' }}>{analyticsMetrics.sources['Google Search'] || 0} Search</span>}
          onClick={() => metricClick('Google Organic Leads', String(analyticsMetrics.sources['Google Search'] || 0))}
        />
      </div>

      {/* Control Filters Area */}
      <div className={styles.filtersBar}>
        <div className={styles.searchBox}>
          <Search size={14} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search leads by name, city, or degree..." 
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className={styles.filterSearchInput}
          />
        </div>
        
        <div className={styles.sourceSelectorGroup}>
          <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 'bold' }}>
            <Filter size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
            Lead Source:
          </span>
          {['All', 'Meta Ads', 'Google Search', 'Referral', 'Direct Traffic'].map(src => (
            <button type="button"
              key={src}
              onClick={() => setFilterSource(src)}
              className={`${styles.sourceTagButton} ${filterSource === src ? styles.sourceTagActive : ''}`}
            >
              {src}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Kanban Pipeline board */}
      <div className={styles.kanbanBoardViewport}>
        {pipelineStages.map(stage => {
          const stageLeads = filteredLeads.filter(l => l.stage === stage);
          const stageColor = getStageColor(stage);
          
          return (
            <div key={stage} className={styles.kanbanColumn}>
              <div 
                className={styles.columnHeader}
                style={{ borderTop: `3px solid var(--stage-${stageColor}-text)` }}
              >
                <div className={styles.titleRow}>
                  <h5>{stage}</h5>
                  <span className={styles.columnCount}>{stageLeads.length}</span>
                </div>
              </div>

              <div className={styles.cardContainerList}>
                {stageLeads.length === 0 ? (
                  <div className={styles.emptyColumnState}>
                    <span>No leads at this stage</span>
                  </div>
                ) : (
                  stageLeads.map(lead => (
                    <div 
                      key={lead.id}
                      className={`${styles.leadKanbanCard} ${selectedLeadId === lead.id ? styles.cardActiveSelection : ''}`}
                      onClick={() => setSelectedLeadId(lead.id)}
                    >
                      <div className={styles.cardHeaderArea}>
                        <strong className={styles.leadName}>{lead.name}</strong>
                        <span className={styles.leadDegree}>{lead.degreeTarget}</span>
                      </div>
                      
                      <div className={styles.cardMetadata}>
                        <span>{lead.city} • {lead.source}</span>
                      </div>

                      <div className={styles.cardCounsellorAssign}>
                        <span>Counsellor: {lead.counsellor}</span>
                      </div>

                      {/* Interactive arrows on card footer to simulate drag-drop moving */}
                      <div className={styles.pipelineMoveFooter} onClick={e => e.stopPropagation()}>
                        <button type="button"
                          disabled={pipelineStages.indexOf(stage) === 0}
                          onClick={() => moveLeadStage(lead.id, pipelineStages[pipelineStages.indexOf(stage) - 1])}
                          className={styles.moveBtn}
                          title="Move stage left"
                        >
                          <ArrowLeft size={10} />
                        </button>
                        <span style={{ fontSize: '9px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Shift Stage</span>
                        <button type="button"
                          disabled={pipelineStages.indexOf(stage) === pipelineStages.length - 1}
                          onClick={() => moveLeadStage(lead.id, pipelineStages[pipelineStages.indexOf(stage) + 1])}
                          className={styles.moveBtn}
                          title="Move stage right"
                        >
                          <ArrowRight size={10} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Slide-out lead profile drawer (Admissions Dossier) */}
      {selectedLead && (
        <div className={styles.drawerBackdrop} onClick={() => setSelectedLeadId(null)}>
          <div 
            ref={drawerRef}
            className={styles.studentDrawer}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.drawerHeader}>
              <div className={styles.drawerTitleMeta}>
                <h3>{selectedLead.name}</h3>
                <span className={styles.drawerCohort}>{selectedLead.degreeTarget} • ID: {selectedLead.id}</span>
              </div>
              <button type="button" 
                onClick={() => setSelectedLeadId(null)}
                className={styles.drawerCloseButton}
              >
                ×Close
              </button>
            </div>

            <div className={styles.drawerContentBody}>
              
              {/* Dossier quick actions */}
              <div className={styles.drawerMetricsBox}>
                <div className={styles.dossierItem}>
                  <span>Assigned Counsellor</span>
                  <strong>{selectedLead.counsellor}</strong>
                </div>
                <div className={styles.dossierItem}>
                  <span>Conversion Stage</span>
                  <StageChip stage={getStageColor(selectedLead.stage)} label={selectedLead.stage} />
                </div>
                <div className={styles.dossierItem}>
                  <span>Lead Ingestion Origin</span>
                  <strong>{selectedLead.source}</strong>
                </div>
              </div>

              {/* Grid detail overview */}
              <div className={styles.detailGridRow}>
                <div className={styles.contactCardInfo}>
                  <h4>Contact Registry</h4>
                  <div className={styles.registryField}><Mail size={12} /> <span>{selectedLead.email}</span></div>
                  <div className={styles.registryField}><Phone size={12} /> <span>{selectedLead.phone}</span></div>
                  <div className={styles.registryField}><MapPin size={12} /> <span>{selectedLead.city}</span></div>
                </div>

                <div className={styles.assignPanel}>
                  <h4>Counsellor Assignment</h4>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                    Route conversation control to advisors below:
                  </p>
                  <div className={styles.assignButtons}>
                    {['Swati Sen', 'Dr. Sarah Jenkins', 'Passives Autopilot'].map(advisor => (
                      <button type="button"
                        key={advisor}
                        onClick={() => handleAssignCounsellor(advisor)}
                        className={`${styles.advisorSelectorBtn} ${selectedLead.counsellor === advisor ? styles.advisorSelectedActive : ''}`}
                      >
                        <UserCheck size={11} style={{ display: 'inline', marginRight: '4px' }} />
                        {advisor}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tag and checklist details */}
              <div className={styles.detailGridRow} style={{ marginTop: 'var(--space-4)' }}>
                <div className={styles.tagsContainerCard}>
                  <h4>Candidate Qualifications</h4>
                  <div className={styles.tagsFlexList}>
                    {selectedLead.tags.map(t => (
                      <span key={t} className={styles.qualificationTag}><Tag size={10} /> {t}</span>
                    ))}
                  </div>
                  <form onSubmit={handleAddTag} className={styles.tagFormInput}>
                    <input 
                      type="text" 
                      placeholder="Add tag (e.g. Merit)"
                      value={newTagInput}
                      onChange={e => setNewTagInput(e.target.value)}
                      className={styles.drawerTextfield}
                    />
                    <Button variant="secondary" type="submit" size="sm">Add</Button>
                  </form>
                </div>

                <div className={styles.remindersCard}>
                  <h4>Follow-up Checklist</h4>
                  <div className={styles.followupCheckBlock}>
                    {selectedLead.reminderDate ? (
                      <label className={styles.reminderCheckboxLabel}>
                        <input 
                          type="checkbox"
                          checked={selectedLead.reminderChecked || false}
                          onChange={() => handleToggleReminder(selectedLead.id)}
                          className={styles.checkboxInput}
                        />
                        <div className={styles.checkboxReplacer}>
                          {selectedLead.reminderChecked && <CheckCircle size={10} style={{ color: 'white' }} />}
                        </div>
                        <span className={styles.reminderText}>
                          Task due on {selectedLead.reminderDate} (Admissions counselling follow-up callback)
                        </span>
                      </label>
                    ) : (
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                        No follow-up reminder date configured for this student.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes submission */}
              <div className={styles.notesBlockConsole} style={{ marginTop: 'var(--space-4)' }}>
                <h4>Advisor Verification Notes</h4>
                <form onSubmit={handleAddNote} className={styles.noteForm}>
                  <textarea
                    rows={2}
                    value={newNoteText}
                    onChange={e => setNewNoteText(e.target.value)}
                    placeholder="Append verification logs or meeting descriptions..."
                    className={styles.drawerTextarea}
                  />
                  <div style={{ textAlign: 'right', marginTop: '6px' }}>
                    <Button variant="gold" type="submit" size="sm">Submit Note</Button>
                  </div>
                </form>
              </div>

              {/* Operational Timeline */}
              <div className={styles.timelineDossierList} style={{ marginTop: 'var(--space-4)' }}>
                <h4>Lead Operations Activity Timeline</h4>
                <div className={styles.timelineTrack}>
                  {selectedLead.timeline.map(event => (
                    <div key={event.id} className={styles.timelineEventItem}>
                      <div className={styles.timelineDot} style={{
                        background: event.type === 'system' ? 'var(--stage-blue-text)' : event.type === 'counsellor' ? 'var(--stage-orange-text)' : 'var(--stage-purple-text)'
                      }}></div>
                      <div className={styles.eventContent}>
                        <div className={styles.eventHeading}>
                          <strong>{event.title}</strong>
                          <small>{event.time}</small>
                        </div>
                        <p>{event.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <div style={{ width: '30px', height: '30px', border: '3px solid var(--color-border)', borderTop: '3px solid var(--color-brown-dark)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : null}

      {/* Add Lead Creation Modal */}
      {showAddLeadModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h4>Add Candidate Admission Lead</h4>
              <button type="button" onClick={() => setShowAddLeadModal(false)} className={styles.closeBtn}>×</button>
            </div>
            <form onSubmit={handleCreateLead}>
              <div className={styles.modalBody}>
                <label className={styles.modalLabel}>
                  <span>Student Full Name</span>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Sahil Sharma" 
                    value={newLeadName}
                    onChange={e => setNewLeadName(e.target.value)}
                    className={styles.modalInput}
                  />
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <label className={styles.modalLabel}>
                    <span>Email Address</span>
                    <input 
                      type="email" 
                      required 
                      placeholder="sahil@example.com" 
                      value={newLeadEmail}
                      onChange={e => setNewLeadEmail(e.target.value)}
                      className={styles.modalInput}
                    />
                  </label>
                  <label className={styles.modalLabel}>
                    <span>Mobile Phone</span>
                    <input 
                      type="text" 
                      required 
                      placeholder="+91 98765..." 
                      value={newLeadPhone}
                      onChange={e => setNewLeadPhone(e.target.value)}
                      className={styles.modalInput}
                    />
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <label className={styles.modalLabel}>
                    <span>City</span>
                    <input 
                      type="text" 
                      placeholder="e.g. Mumbai" 
                      value={newLeadCity}
                      onChange={e => setNewLeadCity(e.target.value)}
                      className={styles.modalInput}
                    />
                  </label>
                  <label className={styles.modalLabel}>
                    <span>Degree Program</span>
                    <select
                      value={newLeadDegree}
                      onChange={e => setNewLeadDegree(e.target.value)}
                      className={styles.modalSelect}
                    >
                      <option value="B.Tech CSE">B.Tech CSE</option>
                      <option value="MBA Marketing">MBA Marketing</option>
                      <option value="MBA Finance">MBA Finance</option>
                      <option value="B.Tech Biotechnology">B.Tech Biotechnology</option>
                    </select>
                  </label>
                </div>

                <label className={styles.modalLabel}>
                  <span>Acquisition Source Channel</span>
                  <select
                    value={newLeadSource}
                    onChange={e => setNewLeadSource(e.target.value as any)}
                    className={styles.modalSelect}
                  >
                    <option value="Meta Ads">Meta Ads</option>
                    <option value="Google Search">Google Search</option>
                    <option value="Referral">Referral</option>
                    <option value="Direct Traffic">Direct Traffic</option>
                  </select>
                </label>
              </div>

              <div className={styles.modalFooter}>
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowAddLeadModal(false)}>Cancel</Button>
                <Button variant="gold" size="sm" type="submit">Ingest Lead</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </PageContainer>
  );
}
