import { useState, useMemo } from 'react';
import { PageContainer } from '../layouts';
import { Card, CardBody, CardHeader, Button } from '../components/ui';
import { useNotifications } from '../contexts/NotificationContext';
import {
  ChevronRight,
  ChevronLeft,
  Plus,
  X,
} from 'lucide-react';
import styles from './ProjectManagementPage.module.css';

interface Task {
  id: string;
  projectId: string;
  title: string;
  assignedTo: string;
  column: 'todo' | 'inprogress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  description: string;
}

interface Project {
  id: string;
  name: string;
  desc: string;
  status: 'planning' | 'active' | 'review' | 'delayed' | 'completed';
  completion: number; // percentage
  startDate: string;
  endDate: string;
}

interface Milestone {
  id: string;
  projectId: string;
  title: string;
  date: string;
  completed: boolean;
}

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'PRJ-101',
    name: 'UGC Accreditation Audit',
    desc: 'Self-Study Report drafting, physical facility assessments, and syllabus renewal compilations.',
    status: 'review',
    completion: 90,
    startDate: '2025-10-01',
    endDate: '2026-06-15',
  },
  {
    id: 'PRJ-102',
    name: 'TechFest College Festival',
    desc: 'National student hackathons, robotics challenges, sponsorship registry, and media marketing.',
    status: 'active',
    completion: 65,
    startDate: '2026-02-01',
    endDate: '2026-05-30',
  },
  {
    id: 'PRJ-103',
    name: 'Hostel Infrastructure Upgrades',
    desc: 'Installation of high-speed Wi-Fi access grids and digital dining hall sandboxes.',
    status: 'active',
    completion: 40,
    startDate: '2026-03-10',
    endDate: '2026-08-01',
  },
  {
    id: 'PRJ-104',
    name: 'National CSE Workshop',
    desc: 'Coordinating guest panels and academic keynotes for Deep Learning trajectory trends.',
    status: 'planning',
    completion: 10,
    startDate: '2026-05-01',
    endDate: '2026-09-10',
  },
  {
    id: 'PRJ-105',
    name: 'Alumni Meet FY26',
    desc: 'Comprehensive fundraising registry coordination, alumni dinners, and honors ceremonies.',
    status: 'completed',
    completion: 100,
    startDate: '2025-12-01',
    endDate: '2026-04-15',
  },
];

const INITIAL_TASKS: Task[] = [
  // UGC Audit Tasks
  {
    id: 'TSK-201',
    projectId: 'PRJ-101',
    title: 'Audit Student Accounts Ledger',
    assignedTo: 'Rohan Sharma',
    column: 'review',
    priority: 'high',
    dueDate: '2026-05-25',
    description: 'Verify reconciliation reports for Q1 balance sheets and student tuition refund logs.',
  },
  {
    id: 'TSK-202',
    projectId: 'PRJ-101',
    title: 'Collect Syllabus Indexing Reports',
    assignedTo: 'Prof. Amit Kulkarni',
    column: 'completed',
    priority: 'medium',
    dueDate: '2026-05-10',
    description: 'Compile discrete fields vector calculus and deep learning syllabi templates.',
  },
  {
    id: 'TSK-203',
    projectId: 'PRJ-101',
    title: 'Verify Lab Facilities Equipment',
    assignedTo: 'Anita Roy',
    column: 'inprogress',
    priority: 'high',
    dueDate: '2026-05-28',
    description: 'Check active robotics computer nodes, laser measurement tools, and Wi-Fi thresholds.',
  },

  // TechFest Tasks
  {
    id: 'TSK-211',
    projectId: 'PRJ-102',
    title: 'Approve Sponsor Contracts',
    assignedTo: 'Dr. Sarah Jenkins',
    column: 'inprogress',
    priority: 'high',
    dueDate: '2026-05-24',
    description: 'Confirm payouts registry bounds and sponsor brand placement in campus flyers.',
  },
  {
    id: 'TSK-212',
    projectId: 'PRJ-102',
    title: 'Design Hackathon Registration Forms',
    assignedTo: 'Meera Deshmukh',
    column: 'completed',
    priority: 'low',
    dueDate: '2026-05-05',
    description: 'Launch centralized ERP form builder page to collect student contestant entries.',
  },
  {
    id: 'TSK-213',
    projectId: 'PRJ-102',
    title: 'Setup Booking Calendar Slots',
    assignedTo: 'Anita Roy',
    column: 'todo',
    priority: 'medium',
    dueDate: '2026-05-29',
    description: 'Coordinate counseling calendar schedules for guest advisor panels.',
  },

  // Hostel upgrades
  {
    id: 'TSK-221',
    projectId: 'PRJ-103',
    title: 'Draft Cable Routing blueprints',
    assignedTo: 'Anita Roy',
    column: 'inprogress',
    priority: 'medium',
    dueDate: '2026-06-15',
    description: 'Map internal coaxial loops bounds to prevent interference patterns.',
  },
];

const INITIAL_MILESTONES: Milestone[] = [
  { id: 'MIL-401', projectId: 'PRJ-101', title: 'Self-Study Draft Approved', date: '2026-04-10', completed: true },
  { id: 'MIL-402', projectId: 'PRJ-101', title: 'Site Inspection Complete', date: '2026-05-30', completed: false },
  { id: 'MIL-403', projectId: 'PRJ-102', title: 'Sponsorship Target Reached ($10k)', date: '2026-05-15', completed: true },
  { id: 'MIL-404', projectId: 'PRJ-102', title: 'Contestant Registrations Closed', date: '2026-05-25', completed: false },
  { id: 'MIL-405', projectId: 'PRJ-103', title: 'Dining Hall Terminals Configured', date: '2026-07-01', completed: false },
];

export function ProjectManagementPage() {
  const { notify } = useNotifications();

  // State Management
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [selectedProjectId, setSelectedProjectId] = useState('PRJ-101');
  const [milestones, setMilestones] = useState<Milestone[]>(INITIAL_MILESTONES);
  
  // Selection drawer
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // New task form toggles
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAssigned, setNewAssigned] = useState('Prof. Amit Kulkarni');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newDueDate, setNewDueDate] = useState('2026-05-30');
  const [newDesc, setNewDesc] = useState('');

  // Find active project metadata
  const activeProject = useMemo(() => {
    return projects.find(p => p.id === selectedProjectId) ?? projects[0];
  }, [projects, selectedProjectId]);

  // Filter tasks belonging to selected project
  const projectTasks = useMemo(() => {
    return tasks.filter(t => t.projectId === selectedProjectId);
  }, [tasks, selectedProjectId]);

  // Group tasks into Kanban columns
  const kanbanColumns = useMemo(() => {
    const groups = {
      todo: projectTasks.filter(t => t.column === 'todo'),
      inprogress: projectTasks.filter(t => t.column === 'inprogress'),
      review: projectTasks.filter(t => t.column === 'review'),
      completed: projectTasks.filter(t => t.column === 'completed'),
    };
    return groups;
  }, [projectTasks]);

  // Filter milestones belonging to selected project
  const projectMilestones = useMemo(() => {
    return milestones.filter(m => m.projectId === selectedProjectId);
  }, [milestones, selectedProjectId]);

  // Calculate project completion percentage dynamically based on task states
  const recalculateProjectCompletion = (projId: string, currentTasks: Task[]) => {
    const projTasks = currentTasks.filter(t => t.projectId === projId);
    if (projTasks.length === 0) return;
    
    const completedTasks = projTasks.filter(t => t.column === 'completed').length;
    const completionPct = Math.round((completedTasks / projTasks.length) * 100);

    setProjects(prev =>
      prev.map(p => {
        if (p.id === projId) {
          let updatedStatus = p.status;
          if (completionPct === 100) updatedStatus = 'completed';
          else if (completionPct > 0 && p.status === 'planning') updatedStatus = 'active';
          
          return {
            ...p,
            completion: completionPct,
            status: updatedStatus,
          };
        }
        return p;
      })
    );
  };

  // Move task across columns
  const handleShiftTask = (taskId: string, direction: 'forward' | 'backward') => {
    const sequence: ('todo' | 'inprogress' | 'review' | 'completed')[] = ['todo', 'inprogress', 'review', 'completed'];
    let updatedTasks: Task[] = [];
    
    setTasks(prev => {
      updatedTasks = prev.map(t => {
        if (t.id === taskId) {
          const currentIndex = sequence.indexOf(t.column);
          let newIndex = currentIndex;
          if (direction === 'forward' && currentIndex < 3) newIndex += 1;
          if (direction === 'backward' && currentIndex > 0) newIndex -= 1;
          
          const updated = { ...t, column: sequence[newIndex] };
          if (selectedTask && selectedTask.id === taskId) {
            setSelectedTask(updated);
          }
          return updated;
        }
        return t;
      });
      return updatedTasks;
    });

    // Run dynamic progress adjustments
    const taskObj = tasks.find(t => t.id === taskId);
    if (taskObj) {
      setTimeout(() => {
        recalculateProjectCompletion(taskObj.projectId, updatedTasks);
      }, 50);
    }

    notify({
      type: 'success',
      title: 'Kanban Board Synchronized',
      message: `Task has been moved on the project board layout.`,
      duration: 2000
    });
  };

  // Assign Task to Faculty
  const handleAssignTask = (taskId: string, staffName: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const updated = { ...t, assignedTo: staffName };
          if (selectedTask && selectedTask.id === taskId) {
            setSelectedTask(updated);
          }
          return updated;
        }
        return t;
      })
    );

    notify({
      type: 'info',
      title: 'Personnel Assigned',
      message: `Task ownership remapped to ${staffName}.`,
    });
  };

  // Toggle milestone completion
  const handleToggleMilestone = (milestoneId: string) => {
    setMilestones(prev =>
      prev.map(m => m.id === milestoneId ? { ...m, completed: !m.completed } : m)
    );

    notify({
      type: 'success',
      title: 'Milestone Synchronized',
      message: 'Operational plan objectives updated.',
    });
  };

  // Create new task on Kanban
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      notify({ type: 'error', title: 'Task Rejected', message: 'Task description name is mandatory.' });
      return;
    }

    const newTask: Task = {
      id: `TSK-${Math.floor(230 + Math.random() * 70)}`,
      projectId: selectedProjectId,
      title: newTitle.trim(),
      assignedTo: newAssigned,
      column: 'todo',
      priority: newPriority,
      dueDate: newDueDate,
      description: newDesc.trim() || 'No additional summary registered.',
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    
    // Recalculate completion
    recalculateProjectCompletion(selectedProjectId, updatedTasks);

    // Reset Form
    setNewTitle('');
    setNewDesc('');
    setShowAddForm(false);

    notify({
      type: 'success',
      title: 'Project Card Created',
      message: `"${newTask.title}" added to To Do Kanban pipeline.`,
      duration: 3000
    });
  };

  return (
    <PageContainer breadcrumbs={[{ label: 'Operational Console' }, { label: 'Project Management' }]}>
      
      {/* Header title block */}
      <div className={styles.headerBar}>
        <div>
          <h2 className={styles.headerTitle}>Academic Project Hub & Kanban</h2>
          <p className={styles.headerSubtitle}>
            Track accreditation workflows, map college TechFest hackathons, review hostel infrastructure milestones, and assign duties to advisors.
          </p>
        </div>
        <div>
          <Button
            variant="gold"
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => setShowAddForm(prev => !prev)}
          >
            Create Task Card
          </Button>
        </div>
      </div>

      {/* Projects roster cards row */}
      <div className={styles.projectRoster}>
        {projects.map(proj => {
          const isActive = selectedProjectId === proj.id;
          return (
            <div
              key={proj.id}
              onClick={() => setSelectedProjectId(proj.id)}
              className={`${styles.projectCard} ${isActive ? styles.activeProjectCard : ''}`}
            >
              <div className={styles.projectHeader}>
                <span className={styles.projectTitle}>{proj.name}</span>
                <span className={`${styles.statusBadge} ${styles[`progress-${proj.status}`]}`}>
                  {proj.status}
                </span>
              </div>
              <div style={{ marginTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '4px' }}>
                  <span>Completion progress:</span>
                  <strong>{proj.completion}%</strong>
                </div>
                <div style={{ height: '5px', backgroundColor: 'var(--color-border)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${proj.completion}%`, backgroundColor: 'var(--color-gold)' }} />
                </div>
              </div>
              <div className={styles.projectMeta}>
                <span>Due: {proj.endDate}</span>
                <span style={{ fontFamily: 'monospace' }}>{proj.id}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Project details card with Kanban grid */}
      <Card>
        <CardHeader 
          title={`Board: ${activeProject.name}`} 
          subtitle={activeProject.desc}
          action={
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                Timeline: <strong>{activeProject.startDate}</strong> to <strong>{activeProject.endDate}</strong>
              </div>
              <span className={`${styles.statusBadge} ${styles[`progress-${activeProject.status}`]}`}>
                {activeProject.status.toUpperCase()}
              </span>
            </div>
          }
        />
        <CardBody className={styles.noPadding}>
          
          {/* Add Task Form overlay block */}
          {showAddForm && (
            <form onSubmit={handleAddTask} style={{ padding: '20px', backgroundColor: 'var(--color-bg-sidebar)', borderBottom: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '12px', color: 'var(--color-brown-dark)' }}>Create Task Entry</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <label className={styles.formLabel}>
                  <span>Task Title / Core Objective *</span>
                  <input type="text" required value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Schedule accreditation guest panel" className={styles.formInput} />
                </label>
                <label className={styles.formLabel}>
                  <span>Target Due Date *</span>
                  <input type="date" required value={newDueDate} onChange={e => setNewDueDate(e.target.value)} className={styles.formInput} />
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <label className={styles.formLabel}>
                  <span>Assign Responsibility *</span>
                  <select value={newAssigned} onChange={e => setNewAssigned(e.target.value)} className={styles.formSelect}>
                    <option value="Prof. Amit Kulkarni">Prof. Amit Kulkarni (Computer Science)</option>
                    <option value="Dr. Sarah Jenkins">Dr. Sarah Jenkins (Academic Affairs)</option>
                    <option value="Meera Deshmukh">Meera Deshmukh (Registrar Office)</option>
                    <option value="Rohan Sharma">Rohan Sharma (Accounts & Audits)</option>
                    <option value="Anita Roy">Anita Roy (Student Facilities)</option>
                  </select>
                </label>
                <label className={styles.formLabel}>
                  <span>Priority Severity *</span>
                  <select value={newPriority} onChange={e => setNewPriority(e.target.value as any)} className={styles.formSelect}>
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </label>
              </div>

              <label className={styles.formLabel}>
                <span>Detailed Task Explanation</span>
                <textarea rows={2} value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Provide specifications, metrics, coordinates..." className={styles.formInput} style={{ resize: 'vertical' }} />
              </label>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '6px' }}>
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowAddForm(false)}>Cancel</Button>
                <Button variant="gold" size="sm" type="submit">Push Task Card</Button>
              </div>
            </form>
          )}

          {/* Kanban columns grid */}
          <div style={{ padding: '16px' }}>
            <div className={styles.kanbanGrid}>
              
              {/* Columns map */}
              {(['todo', 'inprogress', 'review', 'completed'] as const).map(col => {
                const list = kanbanColumns[col];
                let colTitle = 'To Do';
                if (col === 'inprogress') colTitle = 'In Progress';
                else if (col === 'review') colTitle = 'In Review';
                else if (col === 'completed') colTitle = 'Completed';

                return (
                  <div key={col} className={styles.kanbanColumn}>
                    <div className={styles.columnHeader}>
                      <span className={styles.columnTitle}>{colTitle}</span>
                      <span className={styles.columnCount}>{list.length}</span>
                    </div>

                    {list.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '24px 0', border: '1px dashed var(--color-border)', borderRadius: '8px', fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        Drag / Shift cards here.
                      </div>
                    ) : (
                      list.map(task => (
                        <div 
                          key={task.id} 
                          className={styles.taskCard}
                          onClick={() => setSelectedTask(task)}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <span className={styles.taskTitle}>{task.title}</span>
                          </div>
                          
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <span style={{ 
                              fontSize: '8px', 
                              padding: '1px 4px', 
                              borderRadius: '2px', 
                              backgroundColor: task.priority === 'high' ? 'var(--stage-red-bg)' : task.priority === 'medium' ? '#faf3eb' : 'var(--stage-green-bg)',
                              color: task.priority === 'high' ? 'var(--stage-red-text)' : task.priority === 'medium' ? '#a66b3d' : 'var(--stage-green-text)',
                              fontWeight: 'bold',
                              textTransform: 'uppercase'
                            }}>
                              {task.priority}
                            </span>
                          </div>

                          <div className={styles.taskMetaRow}>
                            <span className={styles.taskAssigned}>Assignee: {task.assignedTo.split(' ').pop()}</span>
                            <span>Due: {task.dueDate.split('-').slice(1).join('/')}</span>
                          </div>

                          <div className={styles.taskControls} onClick={e => e.stopPropagation()}>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              style={{ padding: '2px', height: '20px' }}
                              disabled={col === 'todo'}
                              icon={<ChevronLeft size={10} />}
                              onClick={() => handleShiftTask(task.id, 'backward')}
                            />
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              style={{ padding: '2px', height: '20px' }}
                              disabled={col === 'completed'}
                              icon={<ChevronRight size={10} />}
                              onClick={() => handleShiftTask(task.id, 'forward')}
                            />
                          </div>

                        </div>
                      ))
                    )}

                  </div>
                );
              })}

            </div>
          </div>

        </CardBody>
      </Card>

      {/* Milestones timeline grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginTop: '24px', alignItems: 'start' }}>
        
        <Card>
          <CardHeader title="Gantt Plan Milestones" subtitle="Project target dates and completion tracks." />
          <CardBody className={styles.noPadding}>
            <div style={{ padding: '16px' }}>
              <div className={styles.milestonesList}>
                {projectMilestones.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '16px', color: 'var(--color-text-muted)', fontSize: '12px' }}>
                    No critical milestones logged for this active project.
                  </div>
                ) : (
                  projectMilestones.map(m => (
                    <div key={m.id} className={styles.milestoneItem}>
                      <div className={styles.milestoneLeft}>
                        <input
                          type="checkbox"
                          checked={m.completed}
                          onChange={() => handleToggleMilestone(m.id)}
                          style={{ accentColor: 'var(--color-gold)', cursor: 'pointer', width: '14px', height: '14px' }}
                        />
                        <span className={styles.milestoneText} style={{ textDecoration: m.completed ? 'line-through' : 'none', color: m.completed ? 'var(--color-text-muted)' : 'var(--color-text-primary)' }}>
                          {m.title}
                        </span>
                      </div>
                      <span className={styles.milestoneDate}>Target Date: {m.date}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Project metrics summary */}
        <Card>
          <CardHeader title="Overall Progress Metrology" subtitle="Sync indexes calculations." />
          <CardBody className={styles.noPadding}>
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--color-border-subtle)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Total assigned task cards:</span>
                <strong style={{ color: 'var(--color-brown-dark)', fontSize: '12px' }}>{projectTasks.length} cards</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--color-border-subtle)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Pending action tasks:</span>
                <strong style={{ color: 'var(--stage-orange-text)', fontSize: '12px' }}>
                  {projectTasks.filter(t => t.column !== 'completed').length} pending
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Reconciled milestones:</span>
                <strong style={{ color: 'var(--stage-green-text)', fontSize: '12px' }}>
                  {projectMilestones.filter(m => m.completed).length} / {projectMilestones.length} cleared
                </strong>
              </div>
            </div>
          </CardBody>
        </Card>

      </div>

      {/* Task Drawer Details Slideout Overlay */}
      {selectedTask && (
        <div className={styles.drawerOverlay} onClick={() => setSelectedTask(null)}>
          <div className={styles.drawer} onClick={e => e.stopPropagation()}>
            
            <div className={styles.drawerHeader}>
              <span className={styles.drawerTitle}>Kanban Task Dossier</span>
              <button type="button" className={styles.drawerClose} onClick={() => setSelectedTask(null)}>
                <X size={16} />
              </button>
            </div>

            <div className={styles.drawerBody}>
              
              <div style={{ paddingBottom: '16px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-text-secondary)' }}>TASK REF ID: {selectedTask.id}</span>
                <h4 style={{ fontSize: '14px', color: 'var(--color-brown-dark)', marginTop: '4px' }}>{selectedTask.title}</h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <span className={styles.drawerLabel}>Board Column State</span>
                  <div className={styles.drawerValue} style={{ textTransform: 'uppercase' }}>{selectedTask.column}</div>
                </div>
                <div>
                  <span className={styles.drawerLabel}>Priority Severity</span>
                  <div className={styles.drawerValue} style={{ textTransform: 'uppercase' }}>{selectedTask.priority}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <span className={styles.drawerLabel}>Target Due Date</span>
                  <div className={styles.drawerValue}>{selectedTask.dueDate}</div>
                </div>
                <div>
                  <span className={styles.drawerLabel}>Associated Project</span>
                  <div className={styles.drawerValue}>{activeProject.name}</div>
                </div>
              </div>

              {/* Adjust Assignee */}
              <label className={styles.formLabel} style={{ borderTop: '1px dashed var(--color-border-subtle)', paddingTop: '16px' }}>
                <span>Reassign Advisor Responsibility</span>
                <select
                  value={selectedTask.assignedTo}
                  onChange={e => handleAssignTask(selectedTask.id, e.target.value)}
                  className={styles.formSelect}
                >
                  <option value="Prof. Amit Kulkarni">Prof. Amit Kulkarni (Computer Science)</option>
                  <option value="Dr. Sarah Jenkins">Dr. Sarah Jenkins (Academic Affairs)</option>
                  <option value="Meera Deshmukh">Meera Deshmukh (Registrar Office)</option>
                  <option value="Rohan Sharma">Rohan Sharma (Accounts & Audits)</option>
                  <option value="Anita Roy">Anita Roy (Student Facilities)</option>
                </select>
              </label>

              <div style={{ borderTop: '1px dashed var(--color-border-subtle)', paddingTop: '16px' }}>
                <span className={styles.drawerLabel}>Task Objectives Description</span>
                <p style={{ fontSize: '12px', color: 'var(--color-text-primary)', marginTop: '4px', lineHeight: '1.4' }}>
                  {selectedTask.description}
                </p>
              </div>

              {/* Quick column shifting inside drawer */}
              <div style={{ borderTop: '1px dashed var(--color-border-subtle)', paddingTop: '16px' }}>
                <span className={styles.drawerLabel}>Transition Board State</span>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={selectedTask.column === 'todo'}
                    icon={<ChevronLeft size={14} />}
                    onClick={() => handleShiftTask(selectedTask.id, 'backward')}
                  >
                    Demote Column
                  </Button>
                  <Button
                    variant="gold"
                    size="sm"
                    disabled={selectedTask.column === 'completed'}
                    icon={<ChevronRight size={14} />}
                    onClick={() => handleShiftTask(selectedTask.id, 'forward')}
                  >
                    Promote Column
                  </Button>
                </div>
              </div>

            </div>

            <div style={{ padding: '16px', borderTop: '1px solid var(--color-border-subtle)', background: 'var(--color-bg-sidebar)', display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="ghost" size="sm" onClick={() => setSelectedTask(null)}>Close Drawer</Button>
            </div>

          </div>
        </div>
      )}

    </PageContainer>
  );
}
