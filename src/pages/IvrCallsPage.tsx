import { useState, useEffect } from 'react';
import { PageContainer } from '../layouts';
import { Card, CardBody, CardHeader, Button } from '../components/ui';
import { useNotifications } from '../hooks/useNotifications';
import {
  Phone,
  Plus,
  Trash2,
  Play,
  Pause,
  Sliders,
  Volume2,
  Clock,
} from 'lucide-react';
import styles from './IvrCallsPage.module.css';

interface IvrNode {
  id: string;
  type: 'trigger' | 'playback' | 'menu' | 'transfer' | 'voicemail';
  title: string;
  config: Record<string, string>;
  options?: string[]; // for menu options
}

const INITIAL_NODES: IvrNode[] = [
  {
    id: 'node-1',
    type: 'trigger',
    title: 'Call Starts',
    config: { triggerSource: 'Admissions Inquiry Number (+91 80 6000 1200)' },
  },
  {
    id: 'node-2',
    type: 'playback',
    title: 'Welcome Announcement',
    config: { 
      mode: 'TTS (Text-to-Speech)', 
      text: 'Thank you for calling CollegeOS University. Your future starts here. Please listen carefully to the routing options.',
      voice: 'Female Accent - English US'
    },
  },
  {
    id: 'node-3',
    type: 'menu',
    title: 'IVR Router Menu',
    config: { 
      prompt: 'Press 1 for Admissions, Press 2 for Scholar/Accounts, Press 3 for Academic Registry.',
      timeout: '5 seconds'
    },
    options: ['1: Admissions', '2: Accounts', '3: Registry'],
  },
  {
    id: 'node-4',
    type: 'transfer',
    title: 'Route to Counselors',
    config: { 
      queue: 'Admissions Desk Queue',
      fallback: 'Voicemail Box',
      timeout: '20 seconds'
    },
  },
];

interface CallRecording {
  id: string;
  student: string;
  phone: string;
  intent: string;
  duration: string;
  time: string;
}

const RECORDINGS: CallRecording[] = [
  { id: 'rec-1', student: 'Rohan Sharma', phone: '+91 98765 43210', intent: 'Admissions Inquiry (B.Tech)', duration: '01:24', time: '10m ago' },
  { id: 'rec-2', student: 'Priya Patel', phone: '+91 87654 32109', intent: 'Scholarship Eligibility', duration: '02:15', time: '2h ago' },
  { id: 'rec-3', student: 'Kabir Singh', phone: '+91 76543 21098', intent: 'Hostel Booking & Fees', duration: '00:48', time: '5h ago' },
  { id: 'rec-4', student: 'Ananya Rao', phone: '+91 91234 56789', intent: 'Admission Inquiry (MBA)', duration: '01:10', time: '1d ago' },
];

const parseDuration = (dur: string) => {
  const parts = dur.split(':');
  return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
};

const formatPlaybackTime = (sec: number) => {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

export function IvrCallsPage() {
  const { notify } = useNotifications();

  // Nodes database state
  const [nodes, setNodes] = useState<IvrNode[]>(INITIAL_NODES);

  // Audio simulation state
  const [activeRecording, setActiveRecording] = useState<CallRecording | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSeconds, setPlaybackSeconds] = useState(0);

  // Active audio simulated progress countdown
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isPlaying && activeRecording) {
      interval = setInterval(() => {
        setPlaybackSeconds((prev) => {
          const maxSec = parseDuration(activeRecording.duration);
          if (prev >= maxSec) {
            setIsPlaying(false);
            notify({
              type: 'info',
              title: 'Playback Finished',
              message: `Finished listening to call log of ${activeRecording.student}.`,
            });
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, activeRecording, notify]);

  // Node editing state
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

  // Node menu option editing state
  const handleMenuOptionChange = (id: string, index: number, value: string) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === id && n.options) {
          const updated = [...n.options];
          updated[index] = value;
          return {
            ...n,
            options: updated,
          };
        }
        return n;
      })
    );
  };

  // Node deletion
  const handleDeleteNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    notify({
      type: 'info',
      title: 'Node Removed',
      message: 'Node deleted from call flow. Connections updated.',
    });
  };

  // Add node toolbar click
  const handleAddNode = (type: 'playback' | 'menu' | 'transfer' | 'voicemail') => {
    let newNode: IvrNode;
    const id = `node-${Date.now()}`;

    switch (type) {
      case 'playback':
        newNode = {
          id,
          type: 'playback',
          title: `Announcement Node #${nodes.length}`,
          config: {
            mode: 'TTS (Text-to-Speech)',
            text: 'Press a digit key or remain on the line.',
            voice: 'Male Accent - English IN',
          },
        };
        break;
      case 'menu':
        newNode = {
          id,
          type: 'menu',
          title: `Router Menu #${nodes.length}`,
          config: {
            prompt: 'Please enter option code.',
            timeout: '8 seconds',
          },
          options: ['1: Sales', '2: Support'],
        };
        break;
      case 'transfer':
        newNode = {
          id,
          type: 'transfer',
          title: `Queue Transfer #${nodes.length}`,
          config: {
            queue: 'General Helpdesk Queue',
            fallback: 'Hang Up Call',
            timeout: '15 seconds',
          },
        };
        break;
      case 'voicemail':
        newNode = {
          id,
          type: 'voicemail',
          title: `Voicemail Recorder`,
          config: {
            beep: 'Enable Beep sound',
            maxDuration: '60 seconds',
          },
        };
        break;
    }

    setNodes((prev) => [...prev, newNode]);
    notify({
      type: 'success',
      title: 'Node Created',
      message: `Added new "${type.toUpperCase()}" node blocks to canvas.`,
    });
  };

  const handlePublishFlow = () => {
    notify({
      type: 'success',
      title: 'IVR Call Flow Published!',
      message: 'Active IVR configurations successfully compiled and uploaded to transactional cloud switches.',
    });
  };

  const handlePlayRecording = (rec: CallRecording) => {
    setActiveRecording(rec);
    setPlaybackSeconds(0);
    setIsPlaying(true);
    notify({
      type: 'info',
      title: 'Streaming Call Audio',
      message: `Playing voice record file for applicant "${rec.student}"...`,
    });
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <PageContainer breadcrumbs={[{ label: 'Marketing' }, { label: 'IVR Calls' }]}>
      <div className={styles.ivrContainer}>
        <div className={styles.ivrLayoutSplit}>
          
          {/* Node-based Interactive Canvas column */}
          <div className={styles.canvasColLeft}>
            <Card padding="md" className={styles.canvasCard}>
              <CardHeader 
                title="IVR Drag & Edit Flow Canvas" 
                subtitle="Design dynamic dial plans and telephone keypad navigation maps"
              />
              <CardBody>
                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  
                  {/* Canvas Toolbar buttons */}
                  <div className={styles.canvasToolbar}>
                    <div className={styles.toolbarButtons}>
                      <Button variant="ghost" size="sm" onClick={() => handleAddNode('playback')}>
                        <Plus size={12} /> Play Node
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleAddNode('menu')}>
                        <Plus size={12} /> Menu Node
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleAddNode('transfer')}>
                        <Plus size={12} /> Route Node
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleAddNode('voicemail')}>
                        <Plus size={12} /> Voice Mail
                      </Button>
                    </div>
                    <Button variant="gold" size="sm" icon={<Sliders size={12} />} onClick={handlePublishFlow}>
                      Publish Active Dial Plan
                    </Button>
                  </div>

                {/* Main grid blueprint canvas */}
                <div className={styles.canvasViewport}>
                  {nodes.map((node, index) => (
                    <div key={node.id} className={styles.nodeWrapper}>
                      
                      {/* Node Box */}
                      <div className={`${styles.nodeCard} ${
                        node.type === 'trigger' ? styles.nodeCardTrigger :
                        node.type === 'playback' ? styles.nodeCardPlayback :
                        node.type === 'menu' ? styles.nodeCardMenu :
                        node.type === 'transfer' ? styles.nodeCardTransfer :
                        styles.nodeCardVoicemail
                      }`}>
                        
                        <div className={styles.nodeHeader}>
                          <span className={styles.nodeTitle}>
                            <Phone size={12} style={{ color: 'var(--color-gold)' }} />
                            {node.title}
                          </span>
                          {node.type !== 'trigger' && (
                            <div className={styles.nodeActions}>
                              <button 
                                type="button" 
                                className={styles.nodeActionBtn}
                                onClick={() => handleDeleteNode(node.id)}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          )}
                        </div>

                        <div className={styles.nodeBody}>
                          {node.type === 'trigger' && (
                            <div className={styles.nodeConfigRow}>
                              <span>Inbound Source Virtual Phone Number</span>
                              <input 
                                type="text" 
                                value={node.config.triggerSource} 
                                onChange={(e) => handleNodeConfigChange(node.id, 'triggerSource', e.target.value)}
                                className={styles.nodeInput} 
                              />
                            </div>
                          )}

                          {node.type === 'playback' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <div className={styles.nodeConfigRow}>
                                <span>Voice Accent Generator</span>
                                <select 
                                  value={node.config.voice}
                                  onChange={(e) => handleNodeConfigChange(node.id, 'voice', e.target.value)}
                                  className={styles.nodeSelect}
                                >
                                  <option>Female Accent - English US</option>
                                  <option>Male Accent - English IN</option>
                                  <option>Hindi Male TTS Voice</option>
                                </select>
                              </div>
                              <div className={styles.nodeConfigRow}>
                                <span>Spoken Welcome Script Copy</span>
                                <textarea 
                                  rows={3}
                                  value={node.config.text}
                                  onChange={(e) => handleNodeConfigChange(node.id, 'text', e.target.value)}
                                  className={styles.nodeTextarea}
                                />
                              </div>
                            </div>
                          )}

                          {node.type === 'menu' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <div className={styles.nodeConfigRow}>
                                <span>Keypad Prompt TTS instructions</span>
                                <input 
                                  type="text" 
                                  value={node.config.prompt}
                                  onChange={(e) => handleNodeConfigChange(node.id, 'prompt', e.target.value)}
                                  className={styles.nodeInput}
                                />
                              </div>
                              <div className={styles.nodeConfigRow}>
                                <span>Keypad Routing Actions</span>
                                <div className={styles.menuOptionsGrid}>
                                  {node.options?.map((opt, optIdx) => (
                                    <input
                                      key={optIdx}
                                      type="text"
                                      value={opt}
                                      onChange={(e) => handleMenuOptionChange(node.id, optIdx, e.target.value)}
                                      className={styles.nodeInput}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {node.type === 'transfer' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <div className={styles.nodeConfigRow}>
                                <span>Target Counselor Trunk Line Queue</span>
                                <select 
                                  value={node.config.queue}
                                  onChange={(e) => handleNodeConfigChange(node.id, 'queue', e.target.value)}
                                  className={styles.nodeSelect}
                                >
                                  <option>Admissions Desk Queue</option>
                                  <option>Billing Support Trunk</option>
                                  <option>Campus Hostel Director Line</option>
                                </select>
                              </div>
                              <div className={styles.nodeConfigRow}>
                                <span>Max Ring Timeout Interval</span>
                                <input 
                                  type="text" 
                                  value={node.config.timeout}
                                  onChange={(e) => handleNodeConfigChange(node.id, 'timeout', e.target.value)}
                                  className={styles.nodeInput}
                                />
                              </div>
                            </div>
                          )}

                          {node.type === 'voicemail' && (
                            <div className={styles.nodeConfigRow}>
                              <span>Maximum Recording Segment Length</span>
                              <input 
                                type="text" 
                                value={node.config.maxDuration}
                                onChange={(e) => handleNodeConfigChange(node.id, 'maxDuration', e.target.value)}
                                className={styles.nodeInput}
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Connection arrow between nodes */}
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

          {/* Call performance metrics and call logs column */}
          <div className={styles.metricsColRight}>
            
            {/* Stats Mini Grid */}
            <div className={styles.statsMiniGrid}>
              <div className={styles.miniStatCard}>
                <h4>Inbound Calls Logged</h4>
                <h3>4,812</h3>
                <p style={{ fontSize: '9px', color: 'var(--stage-green-text)', margin: '4px 0 0' }}>▲ 12% vs yesterday</p>
              </div>
              <div className={styles.miniStatCard}>
                <h4>Average Conversation</h4>
                <h3>1m 45s</h3>
                <p style={{ fontSize: '9px', color: 'var(--color-text-secondary)', margin: '4px 0 0' }}>DLT Call Routing Efficiency</p>
              </div>
              <div className={styles.miniStatCard}>
                <h4>Answered Target Rate</h4>
                <h3>97.8%</h3>
                <p style={{ fontSize: '9px', color: 'var(--stage-green-text)', margin: '4px 0 0' }}>Gateway capacity holding</p>
              </div>
              <div className={styles.miniStatCard}>
                <h4>Abandon Call Drops</h4>
                <h3>2.2%</h3>
                <p style={{ fontSize: '9px', color: 'var(--stage-orange-text)', margin: '4px 0 0' }}>Queued ring timeouts</p>
              </div>
            </div>

            {/* Voice call records card */}
            <Card padding="md" variant="default">
              <CardHeader 
                title="Counselor Live Call Records" 
                subtitle="Listen to customer interaction recordings and capture insights"
              />
              <CardBody>
                <div className={styles.recordingsList}>
                  {RECORDINGS.map((rec) => (
                    <div key={rec.id} className={styles.recordingItem}>
                      <div className={styles.recordingMeta}>
                        <strong>{rec.student} ({rec.phone})</strong>
                        <span>{rec.time}</span>
                      </div>
                      <p className={styles.recordingDetails}>
                        <strong>Routing Intent:</strong> {rec.intent}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-1)' }}>
                        <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={11} /> Length: {rec.duration} mins
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          icon={<Volume2 size={12} />}
                          onClick={() => handlePlayRecording(rec)}
                        >
                          Listen Call
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Simulated Audio Player Widget */}
                {activeRecording && (
                  <div className={styles.audioPlayerWidget}>
                    <div className={styles.playerControlRow}>
                      <button 
                        type="button" 
                        onClick={togglePlayback}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: 'var(--color-brown-dark)',
                          color: 'var(--color-bg-card)',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                      </button>

                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className={styles.playerTitle}>{activeRecording.student}</span>
                        <span style={{ fontSize: '8px', color: 'var(--color-text-secondary)' }}>Streaming Voice Record Track...</span>
                      </div>

                      {/* Interactive pulsing visualizer */}
                      <div className={styles.visualizerWaves}>
                        <div className={`${styles.waveBar} ${isPlaying ? styles.waveBarActive : ''}`} style={{ height: isPlaying ? 'auto' : '6px', animationDelay: '0.1s' }} />
                        <div className={`${styles.waveBar} ${isPlaying ? styles.waveBarActive : ''}`} style={{ height: isPlaying ? 'auto' : '12px', animationDelay: '0.3s' }} />
                        <div className={`${styles.waveBar} ${isPlaying ? styles.waveBarActive : ''}`} style={{ height: isPlaying ? 'auto' : '4px', animationDelay: '0.5s' }} />
                        <div className={`${styles.waveBar} ${isPlaying ? styles.waveBarActive : ''}`} style={{ height: isPlaying ? 'auto' : '18px', animationDelay: '0.2s' }} />
                        <div className={`${styles.waveBar} ${isPlaying ? styles.waveBarActive : ''}`} style={{ height: isPlaying ? 'auto' : '10px', animationDelay: '0.4s' }} />
                        <div className={`${styles.waveBar} ${isPlaying ? styles.waveBarActive : ''}`} style={{ height: isPlaying ? 'auto' : '5px', animationDelay: '0.6s' }} />
                      </div>

                      <span className={styles.playerTimer}>
                        {formatPlaybackTime(playbackSeconds)} / {activeRecording.duration}
                      </span>
                    </div>
                  </div>
                )}

              </CardBody>
            </Card>

          </div>

        </div>
      </div>
    </PageContainer>
  );
}
