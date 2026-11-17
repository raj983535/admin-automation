import { useState } from 'react';
import { PageContainer } from '../layouts';
import { Card, CardBody, CardHeader, Button } from '../components/ui';
import { useNotifications } from '../hooks/useNotifications';
import {
  Plus,
  Trash2,
  Play,
  Settings,
} from 'lucide-react';
import styles from './WorkflowAutomationPage.module.css';

interface AutomationNode {
  id: string;
  stageColor: 'Inquiry Blue' | 'Contacted Purple' | 'Counselling Orange' | 'Pending Yellow' | 'Confirmed Green' | 'Inactive Gray';
  title: string;
  stageBadge: string;
  config: Record<string, string>;
}

type AutomationStageColor = AutomationNode['stageColor'];

const INITIAL_NODES: AutomationNode[] = [
  {
    id: 'flow-1',
    stageColor: 'Inquiry Blue',
    stageBadge: 'Inquiry',
    title: 'Lead Web Form Submitted',
    config: { source: 'Admission Inquiry Form 2026', triggerMode: 'Real-time Instant' },
  },
  {
    id: 'flow-2',
    stageColor: 'Contacted Purple',
    stageBadge: 'Contacted',
    title: 'Trigger Auto-Response Welcome',
    config: { messageType: 'WhatsApp Template + Email Brochure', fallback: 'Cellular SMS' },
  },
  {
    id: 'flow-3',
    stageColor: 'Pending Yellow',
    stageBadge: 'Pending',
    title: 'Keypad/Ring Delay Queue',
    config: { delayPeriod: 'Wait 24 Hours', condition: 'Check if form completed' },
  },
  {
    id: 'flow-4',
    stageColor: 'Counselling Orange',
    stageBadge: 'Counselling',
    title: 'Assign Counselor Cohort',
    config: { distribution: 'Round Robin distribution', targetTeam: 'B.Tech Admissions Desk A' },
  },
  {
    id: 'flow-5',
    stageColor: 'Confirmed Green',
    stageBadge: 'Confirmed',
    title: 'Goal: Deposit Paid Successfully',
    config: { conversionGoal: 'Verify seat reservation fee Rs. 10,000 in payment gateway' },
  },
];

interface AuditLog {
  id: string;
  student: string;
  stage: string;
  actionTaken: string;
  time: string;
}

const INITIAL_AUDITS: AuditLog[] = [
  { id: 'audit-1', student: 'Sahil Sharma', stage: 'Inquiry Blue', actionTaken: 'Admissions Form Submitted - assigned Lead #7842', time: '2m ago' },
  { id: 'audit-2', student: 'Ananya Iyer', stage: 'Contacted Purple', actionTaken: 'Dispatched automated welcome WhatsApp brochure nudge', time: '15m ago' },
  { id: 'audit-3', student: 'Kabir Malhotra', stage: 'Counselling Orange', actionTaken: 'Round-robin assigned to Counselor Swati Sen', time: '1h ago' },
  { id: 'audit-4', student: 'Priya Pillai', stage: 'Confirmed Green', actionTaken: 'Conversion completed: freshman tuition deposit locked', time: '3h ago' },
];

export function WorkflowAutomationPage() {
  const { notify } = useNotifications();

  // Workflow steps database state
  const [nodes, setNodes] = useState<AutomationNode[]>(INITIAL_NODES);
  
  // Audits logs list
  const [audits, setAudits] = useState<AuditLog[]>(INITIAL_AUDITS);

  // Selector state for creating new step
  const [newStepType, setNewStepType] = useState<'Inquiry Blue' | 'Contacted Purple' | 'Counselling Orange' | 'Pending Yellow' | 'Confirmed Green' | 'Inactive Gray'>('Contacted Purple');

  const handleNodeConfigChange = (id: string, key: string, value: string) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          return {
            ...n,
            config: {
              ...n.config,
              [key]: value,
            },
          };
        }
        return n;
      })
    );
  };

  const handleDeleteNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    notify({
      type: 'info',
      title: 'Workflow Step Deleted',
      message: 'Workflow pipeline reflowed and updated successfully.',
    });
  };

  const handleAddStepNode = () => {
    const id = `flow-${Date.now()}`;
    let nodeTitle = '';
    let badge = '';
    let defaults: Record<string, string> = {};

    switch (newStepType) {
      case 'Inquiry Blue':
        nodeTitle = 'New Web Trigger';
        badge = 'Inquiry';
        defaults = { source: 'Inbound CRM lead capture hook', triggerMode: 'Instant' };
        break;
      case 'Contacted Purple':
        nodeTitle = 'Dispatch Alert Action';
        badge = 'Contacted';
        defaults = { messageType: 'Send SMS Broadcast Notification', fallback: 'Wait for response' };
        break;
      case 'Counselling Orange':
        nodeTitle = 'Apply Routing Rule';
        badge = 'Counselling';
        defaults = { distribution: 'Assign manually', targetTeam: 'Counselling Desk B' };
        break;
      case 'Pending Yellow':
        nodeTitle = 'Timer Delay Sequence';
        badge = 'Pending';
        defaults = { delayPeriod: 'Wait 3 Days', condition: 'Check document upload status' };
        break;
      case 'Confirmed Green':
        nodeTitle = 'End Goal Achieved';
        badge = 'Confirmed';
        defaults = { conversionGoal: 'Mark as application completed' };
        break;
      case 'Inactive Gray':
        nodeTitle = 'Exit Pipeline Condition';
        badge = 'Inactive';
        defaults = { exitReason: 'Student marked dormant / unresponsive' };
        break;
    }

    const newNode: AutomationNode = {
      id,
      stageColor: newStepType,
      stageBadge: badge,
      title: nodeTitle,
      config: defaults,
    };

    setNodes((prev) => [...prev, newNode]);
    notify({
      type: 'success',
      title: 'Step Added to Flow',
      message: `Successfully inserted "${newStepType}" stage step block.`,
    });
  };

  // Simulation handler: adds a random live log to execution outbox
  const handleSimulateLeadEvent = () => {
    const students = [
      'Adnan Khan',
      'Ishaan Malhotra',
      'Diya Sen',
      'Meera Nair',
      'Kabir Rawat',
      'Nisha Verma',
    ];
    const pickedStudent = students[Math.floor(Math.random() * students.length)];
    
    // Pick an active workflow block from the nodes to simulate
    const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
    
    let description = '';
    switch (randomNode.stageColor) {
      case 'Inquiry Blue':
        description = `Triggered inbound event via "${randomNode.config.source || 'Form'}"`;
        break;
      case 'Contacted Purple':
        description = `Completed communications: "${randomNode.config.messageType || 'Welcome notification'}"`;
        break;
      case 'Pending Yellow':
        description = `Waiting in queue interval: "${randomNode.config.delayPeriod || 'Wait'}"`;
        break;
      case 'Counselling Orange':
        description = `Assigned dynamically: "${randomNode.config.targetTeam || 'Counselors Pool'}"`;
        break;
      case 'Confirmed Green':
        description = `Met ultimate pipeline goal: "${randomNode.config.conversionGoal || 'Converted'}"`;
        break;
      case 'Inactive Gray':
        description = `Exited workflow loop: "${randomNode.config.exitReason || 'Dormant'}"`;
        break;
    }

    const newAudit: AuditLog = {
      id: `audit-${Date.now()}`,
      student: pickedStudent,
      stage: randomNode.stageColor,
      actionTaken: description,
      time: 'Just now',
    };

    setAudits((prev) => [newAudit, ...prev]);
    notify({
      type: 'info',
      title: `Live Trigger: ${pickedStudent}`,
      message: `Trigger executed successfully: ${randomNode.title}.`,
    });
  };

  const handleSaveWorkflow = () => {
    notify({
      type: 'success',
      title: 'Workflow Saved!',
      message: 'Active admissions drip sequence pipeline updated and synchronized with CRM modules.',
    });
  };

  return (
    <PageContainer breadcrumbs={[{ label: 'Marketing' }, { label: 'Workflow Automation' }]}>
      <div className={styles.workflowContainer}>
        <div className={styles.workflowLayoutSplit}>
          
          {/* Automation Node Builder Visual column */}
          <div className={styles.canvasColLeft}>
            <Card padding="md" className={styles.canvasCard}>
              <CardHeader
                title="Visual Admissions Drip Flowchart"
                subtitle="Map pipeline stages and custom event actions based on CRM triggers"
              />
              <CardBody>
                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  
                  {/* Visual toolbar selector */}
                  <div className={styles.canvasToolbar}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <span className={styles.toolbarTitle}>Add Pipeline Step:</span>
                      <select
                        value={newStepType}
                        onChange={(e) => setNewStepType(e.target.value as AutomationStageColor)}
                        className={styles.nodeSelect}
                        style={{ fontSize: '11px', padding: '3px 6px', width: 'auto' }}
                      >
                        <option value="Inquiry Blue">Inquiry Blue (Trigger)</option>
                        <option value="Contacted Purple">Contacted Purple (Action)</option>
                        <option value="Counselling Orange">Counselling Orange (Rule)</option>
                        <option value="Pending Yellow">Pending Yellow (Delay)</option>
                        <option value="Confirmed Green">Confirmed Green (Goal)</option>
                        <option value="Inactive Gray">Inactive Gray (Exit)</option>
                      </select>
                      <Button variant="ghost" size="sm" onClick={handleAddStepNode}>
                        <Plus size={12} /> Insert Step
                      </Button>
                    </div>
                    <Button variant="gold" size="sm" icon={<Settings size={12} />} onClick={handleSaveWorkflow}>
                      Publish Active Flow
                    </Button>
                  </div>

                {/* Main graphical diagram canvas viewport */}
                <div className={styles.viewportContainer}>
                  {nodes.map((node, index) => (
                    <div key={node.id} className={styles.nodeWrapper}>
                      
                      {/* Connected flowchart block node */}
                      <div className={`${styles.nodeCard} ${
                        node.stageColor === 'Inquiry Blue' ? styles.nodeInquiryBlue :
                        node.stageColor === 'Contacted Purple' ? styles.nodeContactedPurple :
                        node.stageColor === 'Counselling Orange' ? styles.nodeCounsellingOrange :
                        node.stageColor === 'Pending Yellow' ? styles.nodePendingYellow :
                        node.stageColor === 'Confirmed Green' ? styles.nodeConfirmedGreen :
                        styles.nodeInactiveGray
                      }`}>
                        
                        <div className={styles.nodeHeader}>
                          <div className={styles.nodeTitleRow}>
                            <span className={`${styles.nodeStageBadge} ${
                              node.stageColor === 'Inquiry Blue' ? styles.badgeInquiry :
                              node.stageColor === 'Contacted Purple' ? styles.badgeContacted :
                              node.stageColor === 'Counselling Orange' ? styles.badgeCounselling :
                              node.stageColor === 'Pending Yellow' ? styles.badgePending :
                              node.stageColor === 'Confirmed Green' ? styles.badgeConfirmed :
                              styles.badgeInactive
                            }`}>
                              {node.stageBadge}
                            </span>
                            <span className={styles.nodeHeaderTitle}>{node.title}</span>
                          </div>
                          {index > 0 && (
                            <button
                              type="button"
                              className={styles.nodeDeleteBtn}
                              onClick={() => handleDeleteNode(node.id)}
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>

                        <div className={styles.nodeBody}>
                          {node.stageColor === 'Inquiry Blue' && (
                            <div className={styles.nodeConfigItem}>
                              <span>Inbound Source Trigger</span>
                              <input
                                type="text"
                                value={node.config.source}
                                onChange={(e) => handleNodeConfigChange(node.id, 'source', e.target.value)}
                                className={styles.nodeInput}
                              />
                            </div>
                          )}

                          {node.stageColor === 'Contacted Purple' && (
                            <div className={styles.nodeConfigItem}>
                              <span>Active Notification Dispatch Action</span>
                              <select
                                value={node.config.messageType}
                                onChange={(e) => handleNodeConfigChange(node.id, 'messageType', e.target.value)}
                                className={styles.nodeSelect}
                              >
                                <option>WhatsApp Template + Email Brochure</option>
                                <option>Send SMS Broadcast Notification</option>
                                <option>Schedule Follow-up Email</option>
                              </select>
                            </div>
                          )}

                          {node.stageColor === 'Pending Yellow' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <div className={styles.nodeConfigItem}>
                                <span>Interval Duration Delay</span>
                                <select
                                  value={node.config.delayPeriod}
                                  onChange={(e) => handleNodeConfigChange(node.id, 'delayPeriod', e.target.value)}
                                  className={styles.nodeSelect}
                                >
                                  <option>Wait 12 Hours</option>
                                  <option>Wait 24 Hours</option>
                                  <option>Wait 2 Days</option>
                                  <option>Wait 3 Days</option>
                                </select>
                              </div>
                              <div className={styles.nodeConfigItem}>
                                <span>Conditional Branch evaluation</span>
                                <input
                                  type="text"
                                  value={node.config.condition}
                                  onChange={(e) => handleNodeConfigChange(node.id, 'condition', e.target.value)}
                                  className={styles.nodeInput}
                                />
                              </div>
                            </div>
                          )}

                          {node.stageColor === 'Counselling Orange' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <div className={styles.nodeConfigItem}>
                                <span>Admissions Lead Assignment Rule</span>
                                <input
                                  type="text"
                                  value={node.config.distribution}
                                  onChange={(e) => handleNodeConfigChange(node.id, 'distribution', e.target.value)}
                                  className={styles.nodeInput}
                                />
                              </div>
                              <div className={styles.nodeConfigItem}>
                                <span>Target Recipient counseling cohort</span>
                                <select
                                  value={node.config.targetTeam}
                                  onChange={(e) => handleNodeConfigChange(node.id, 'targetTeam', e.target.value)}
                                  className={styles.nodeSelect}
                                >
                                  <option>B.Tech Admissions Desk A</option>
                                  <option>MBA Counselor Pool</option>
                                  <option>Financial Aid Panel</option>
                                </select>
                              </div>
                            </div>
                          )}

                          {node.stageColor === 'Confirmed Green' && (
                            <div className={styles.nodeConfigItem}>
                              <span>Ultimate Conversion Goal criteria</span>
                              <input
                                type="text"
                                value={node.config.conversionGoal}
                                onChange={(e) => handleNodeConfigChange(node.id, 'conversionGoal', e.target.value)}
                                className={styles.nodeInput}
                              />
                            </div>
                          )}

                          {node.stageColor === 'Inactive Gray' && (
                            <div className={styles.nodeConfigItem}>
                              <span>Disqualification exit criteria reason</span>
                              <input
                                type="text"
                                value={node.config.exitReason}
                                onChange={(e) => handleNodeConfigChange(node.id, 'exitReason', e.target.value)}
                                className={styles.nodeInput}
                              />
                            </div>
                          )}
                        </div>

                      </div>

                      {/* Connection arrow linking steps */}
                      {index < nodes.length - 1 && (
                        <div className={styles.flowArrow}>
                          <div className={styles.flowArrowLine} />
                          <div className={styles.flowArrowTip} />
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
            </Card>
          </div>

          {/* CRM workflow simulation execution audit trail column */}
          <div className={styles.historyColRight}>
            <Card padding="md" variant="default">
              <CardHeader
                title="Admissions Live Event Audit Log"
                subtitle="Capture lead actions and verify executed workflow rule decisions"
              />
              <CardBody>
                
                {/* Simulator controls */}
                <div className={styles.auditToolbar}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 'bold' }}>
                    Real-time CRM Processing switch
                  </span>
                  <Button
                    variant="gold"
                    size="sm"
                    icon={<Play size={12} />}
                    onClick={handleSimulateLeadEvent}
                  >
                    Simulate Lead Event
                  </Button>
                </div>

                {/* Audit trail records */}
                <div className={styles.auditLogsList}>
                  {audits.map((a) => (
                    <div
                      key={a.id}
                      className={styles.auditLogItem}
                      style={{
                        borderLeftColor:
                          a.stage === 'Inquiry Blue' ? 'var(--stage-blue-text)' :
                          a.stage === 'Contacted Purple' ? 'var(--stage-purple-text)' :
                          a.stage === 'Counselling Orange' ? 'var(--stage-orange-text)' :
                          a.stage === 'Pending Yellow' ? 'var(--stage-yellow-text)' :
                          a.stage === 'Confirmed Green' ? 'var(--stage-green-text)' :
                          'var(--stage-gray-text)',
                      }}
                    >
                      <div className={styles.auditLogMeta}>
                        <strong>{a.student}</strong>
                        <span>{a.time}</span>
                      </div>
                      <p className={styles.auditLogDesc}>{a.actionTaken}</p>
                      
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2px' }}>
                        <span className={styles.auditLogBadge} style={{
                          background:
                            a.stage === 'Inquiry Blue' ? 'var(--stage-blue-bg)' :
                            a.stage === 'Contacted Purple' ? 'var(--stage-purple-bg)' :
                            a.stage === 'Counselling Orange' ? 'var(--stage-orange-bg)' :
                            a.stage === 'Pending Yellow' ? 'var(--stage-yellow-bg)' :
                            a.stage === 'Confirmed Green' ? 'var(--stage-green-bg)' :
                            'var(--stage-gray-bg)',
                          color:
                            a.stage === 'Inquiry Blue' ? 'var(--stage-blue-text)' :
                            a.stage === 'Contacted Purple' ? 'var(--stage-purple-text)' :
                            a.stage === 'Counselling Orange' ? 'var(--stage-orange-text)' :
                            a.stage === 'Pending Yellow' ? 'var(--stage-yellow-text)' :
                            a.stage === 'Confirmed Green' ? 'var(--stage-green-text)' :
                            'var(--stage-gray-text)',
                        }}>
                          {a.stage.split(' ')[0]}
                        </span>
                      </div>

                    </div>
                  ))}
                </div>

              </CardBody>
            </Card>
          </div>

        </div>
      </div>
    </PageContainer>
  );
}
