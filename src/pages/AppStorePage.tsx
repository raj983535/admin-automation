import { useState, useMemo } from 'react';
import { PageContainer } from '../layouts';
import { Card, CardBody, CardHeader, Button } from '../components/ui';
import { useNotifications } from '../contexts/NotificationContext';
import {
  Store,
  Video,
  Calendar,
  MessageSquare,
  CreditCard,
  Smartphone,
  Settings,
  AlertCircle,
  X,
  RefreshCw,
  CloudLightning,
} from 'lucide-react';
import styles from './AppStorePage.module.css';

interface IntegrationApp {
  id: string;
  name: string;
  category: 'Communication' | 'Video Conferencing' | 'Calendaring' | 'Payments' | 'SMS Providers';
  desc: string;
  status: 'connected' | 'pending' | 'disconnected' | 'syncing' | 'inactive';
  installedAt: string | null;
  syncCount: number;
  apiEndpoint: string;
  clientKey: string;
  installProgress?: number;
}

export function AppStorePage() {
  const { notify } = useNotifications();

  // State Management
  const [activeTab, setActiveTab] = useState('All');
  const [apps, setApps] = useState<IntegrationApp[]>([
    {
      id: 'APP-01',
      name: 'Zoom Video Conferencing',
      category: 'Video Conferencing',
      desc: 'Seamlessly schedule online lectures, counseling sessions, and campus-wide webinars directly from advisor dashboards.',
      status: 'disconnected',
      installedAt: null,
      syncCount: 0,
      apiEndpoint: 'https://api.zoom.us/v2/college-rec',
      clientKey: '',
    },
    {
      id: 'APP-02',
      name: 'Google Calendar Sync',
      category: 'Calendaring',
      desc: 'Remap student counseling schedules, faculty timetables, and admissions deadlines with real-time bidirectional syncing.',
      status: 'connected',
      installedAt: '2026-01-10',
      syncCount: 1482,
      apiEndpoint: 'https://www.googleapis.com/calendar/v3/college',
      clientKey: 'gcal_oauth_9921a8f',
    },
    {
      id: 'APP-03',
      name: 'Twilio SMS Provider',
      category: 'SMS Providers',
      desc: 'Send automated parent notifications, student enrollment reminders, and OTP alerts with high-throughput delivery nodes.',
      status: 'connected',
      installedAt: '2025-11-20',
      syncCount: 9283,
      apiEndpoint: 'https://api.twilio.com/2010-04-01/Accounts/col',
      clientKey: 'tw_sid_88a77f99b',
    },
    {
      id: 'APP-04',
      name: 'Stripe Merchant Gateway',
      category: 'Payments',
      desc: 'Process tuition invoices, hostel deposit sandboxes, and alumni charity payouts securely through integrated checkout widgets.',
      status: 'connected',
      installedAt: '2026-03-01',
      syncCount: 423,
      apiEndpoint: 'https://api.stripe.com/v1/college-charges',
      clientKey: 'sk_live_51P010a3d4f',
    },
    {
      id: 'APP-05',
      name: 'Slack Campus Messaging',
      category: 'Communication',
      desc: 'Remap student community feeds and faculty moderation channels into workspace channels, optimizing instant notifications.',
      status: 'syncing',
      installedAt: '2026-05-18',
      syncCount: 88,
      apiEndpoint: 'https://slack.com/api/chat.postMessage',
      clientKey: 'xoxb-college-2299-ff3a',
    },
  ]);

  // Drawer / Selection state
  const [selectedApp, setSelectedApp] = useState<IntegrationApp | null>(null);
  
  // Drawer form inputs
  const [configEndpoint, setConfigEndpoint] = useState('');
  const [configKey, setConfigKey] = useState('');

  // Active sync progress logs
  const [syncLogs, setSyncLogs] = useState([
    { id: 'SYN-001', app: 'Twilio SMS Provider', details: 'Dispatched parent advisory notices for admissions Q2', time: '10 mins ago' },
    { id: 'SYN-002', app: 'Google Calendar Sync', details: 'Remapped Dr. Sarah Jenkins availability slot vectors', time: '1 hour ago' },
    { id: 'SYN-003', app: 'Stripe Merchant Gateway', details: 'Successfully audited B.Tech tuition fee invoice ref STF-501', time: '2 hours ago' },
  ]);

  // Categories list
  const categories = ['All', 'Communication', 'Video Conferencing', 'Calendaring', 'Payments', 'SMS Providers'];

  // Filter apps by tab
  const filteredApps = useMemo(() => {
    if (activeTab === 'All') return apps;
    return apps.filter(a => a.category === activeTab);
  }, [apps, activeTab]);

  // Dynamic statistics
  const metrics = useMemo(() => {
    const totalCount = apps.length;
    const connectedCount = apps.filter(a => a.status === 'connected').length;
    const syncingCount = apps.filter(a => a.status === 'syncing').length;
    const totalSyncs = apps.reduce((acc, curr) => acc + curr.syncCount, 0);

    return {
      totalCount,
      connectedCount,
      syncingCount,
      totalSyncs,
    };
  }, [apps]);

  // Handle Installation progress simulation
  const handleInstallApp = (appId: string) => {
    setApps(prev =>
      prev.map(a => {
        if (a.id === appId) {
          return { ...a, status: 'syncing', installProgress: 10 };
        }
        return a;
      })
    );

    notify({
      type: 'info',
      title: 'Linking Service Integrations',
      message: 'Authenticating credentials and mapping endpoints, please wait...',
      duration: 2000
    });

    // Simulate progress loops
    const progressIntervals = [30, 60, 85, 100];
    progressIntervals.forEach((prog, index) => {
      setTimeout(() => {
        setApps(prev =>
          prev.map(a => {
            if (a.id === appId) {
              if (prog === 100) {
                return {
                  ...a,
                  status: 'connected',
                  installedAt: new Date().toISOString().split('T')[0],
                  installProgress: undefined,
                  syncCount: 0
                };
              }
              return { ...a, installProgress: prog };
            }
            return a;
          })
        );

        if (prog === 100) {
          const appName = apps.find(a => a.id === appId)?.name ?? 'Third-party app';
          
          // Add sync log
          const newSync = {
            id: `SYN-${Math.floor(100 + Math.random() * 900)}`,
            app: appName,
            details: 'Established cryptographical synchronization hooks',
            time: 'Just now',
          };
          setSyncLogs(prev => [newSync, ...prev]);

          notify({
            type: 'success',
            title: 'Integration Fully Synced',
            message: `"${appName}" successfully authorized and connected to local databases.`,
            duration: 4000
          });
        }
      }, (index + 1) * 800);
    });
  };

  // Handle Disconnection
  const handleUninstallApp = (appId: string) => {
    setApps(prev =>
      prev.map(a => {
        if (a.id === appId) {
          return {
            ...a,
            status: 'disconnected',
            installedAt: null,
            syncCount: 0
          };
        }
        return a;
      })
    );

    const appName = apps.find(a => a.id === appId)?.name ?? 'Third-party app';
    notify({
      type: 'warning',
      title: 'Service Terminated',
      message: `"${appName}" webhook triggers have been disconnected and deleted.`,
      duration: 3500
    });
  };

  // Configure drawer overlay opening
  const handleOpenConfig = (app: IntegrationApp) => {
    setSelectedApp(app);
    setConfigEndpoint(app.apiEndpoint);
    setConfigKey(app.clientKey || 'gcal_oauth_9921a8f');
  };

  // Save Settings Config
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    setApps(prev =>
      prev.map(a => {
        if (a.id === selectedApp.id) {
          return {
            ...a,
            apiEndpoint: configEndpoint,
            clientKey: configKey,
          };
        }
        return a;
      })
    );

    setSelectedApp(null);
    notify({
      type: 'success',
      title: 'Webhook Parameters Synchronized',
      message: `Operational webhooks for "${selectedApp.name}" saved in database indexes.`,
      duration: 3000
    });
  };

  // Trigger manual API synchronize
  const handleManualSync = (appId: string) => {
    setApps(prev =>
      prev.map(a => {
        if (a.id === appId) {
          return {
            ...a,
            status: 'syncing'
          };
        }
        return a;
      })
    );

    notify({
      type: 'info',
      title: 'Manual Recalibration Triggered',
      message: 'Running live data check against external merchant channels...',
      duration: 1500
    });

    setTimeout(() => {
      setApps(prev =>
        prev.map(a => {
          if (a.id === appId) {
            return {
              ...a,
              status: 'connected',
              syncCount: a.syncCount + Math.floor(10 + Math.random() * 90),
            };
          }
          return a;
        })
      );

      const target = apps.find(a => a.id === appId);
      const newSync = {
        id: `SYN-${Math.floor(100 + Math.random() * 900)}`,
        app: target?.name ?? 'App',
        details: `Dispatched manual REST check: synchronized new entries`,
        time: 'Just now',
      };
      setSyncLogs(prev => [newSync, ...prev]);

      notify({
        type: 'success',
        title: 'Endpoints Reconciled',
        message: 'Synchronized sync databases successfully.',
        duration: 3000
      });
    }, 1500);
  };

  return (
    <PageContainer breadcrumbs={[{ label: 'System Settings' }, { label: 'Integrations & Apps' }]}>
      
      {/* Upper header section */}
      <div className={styles.headerBar}>
        <div>
          <h2 className={styles.headerTitle}>Integrations App Marketplace</h2>
          <p className={styles.headerSubtitle}>
            Connect Google Calendars for student scheduling, launch Zoom video webinars, configure Twilio SMS nodes, and reconcile Stripe tuition accounts.
          </p>
        </div>
      </div>

      {/* Categories Filtering tabs */}
      <div className={styles.categoryTabs}>
        {categories.map(cat => {
          const isActive = activeTab === cat;
          return (
            <button type="button"
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`${styles.tabItem} ${isActive ? styles.activeTabItem : ''}`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Main split dashboard grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1.2fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Marketplace cards */}
        <div>
          <div className={styles.marketplaceGrid}>
            {filteredApps.length === 0 ? (
              <Card style={{ gridColumn: 'span 3' }}>
                <CardBody>
                  <div style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)', fontSize: '12px' }}>
                    No integrations matching the selected category are currently registered.
                  </div>
                </CardBody>
              </Card>
            ) : (
              filteredApps.map(app => {
                const isSyncing = app.status === 'syncing';
                const isConnected = app.status === 'connected';
                const isDisconnected = app.status === 'disconnected';

                // App category icon mapping
                let AppIconComponent = Store;
                if (app.category === 'Video Conferencing') AppIconComponent = Video;
                else if (app.category === 'Calendaring') AppIconComponent = Calendar;
                else if (app.category === 'Communication') AppIconComponent = MessageSquare;
                else if (app.category === 'Payments') AppIconComponent = CreditCard;
                else if (app.category === 'SMS Providers') AppIconComponent = Smartphone;

                return (
                  <div
                    key={app.id}
                    role="button"
                    tabIndex={0}
                    className={styles.integrationCard}
                    onClick={() => handleOpenConfig(app)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleOpenConfig(app);
                      }
                    }}
                  >
                    
                    <div>
                      <div className={styles.cardHeader}>
                        <div className={styles.appIcon}>
                          <AppIconComponent size={20} />
                        </div>
                        <span className={`${styles.appBadge} ${styles[`status-${app.status}`]}`}>
                          {app.status}
                        </span>
                      </div>

                      <div className={styles.appMeta}>
                        <span className={styles.appCategory}>{app.category}</span>
                        <h4 className={styles.appName}>{app.name}</h4>
                      </div>

                      <p className={styles.appDesc}>{app.desc}</p>
                    </div>

                    <div>
                      {isConnected && (
                        <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span>Synced records:</span>
                          <strong style={{ color: 'var(--color-brown-dark)', fontFamily: 'monospace' }}>{app.syncCount} items</strong>
                        </div>
                      )}

                      <div className={styles.cardFooter}>
                        {isDisconnected && (
                          <Button 
                            variant="gold" 
                            size="sm" 
                            fullWidth
                            onClick={() => handleInstallApp(app.id)}
                          >
                            Install Service
                          </Button>
                        )}

                        {isSyncing && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            fullWidth
                            disabled
                            icon={<RefreshCw size={12} className="spin animate" style={{ animation: 'spin 2s linear infinite' }} />}
                          >
                            Linking App...
                          </Button>
                        )}

                        {isConnected && (
                          <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              style={{ flex: 1, padding: '4px' }}
                              icon={<Settings size={12} />}
                              onClick={() => handleOpenConfig(app)}
                            >
                              Configure
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              style={{ padding: '4px' }}
                              icon={<RefreshCw size={12} />}
                              onClick={() => handleManualSync(app.id)}
                            />
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              style={{ color: 'var(--stage-red-text)', padding: '4px' }}
                              icon={<X size={12} />}
                              onClick={() => handleUninstallApp(app.id)}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Simulating installation progress loader */}
                    {app.installProgress !== undefined && (
                      <div className={styles.progressBarBg}>
                        <div className={styles.progressBarFill} style={{ width: `${app.installProgress}%` }} />
                      </div>
                    )}

                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Sync analytics and active status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <Card>
            <CardHeader title="Marketplace Metrics" subtitle="Active connected systems." />
            <CardBody className={styles.noPadding}>
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--color-border-subtle)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Connected integrations:</span>
                  <strong style={{ color: 'var(--stage-green-text)', fontSize: '12px' }}>{metrics.connectedCount} active</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--color-border-subtle)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Synchronizing services:</span>
                  <strong style={{ color: 'var(--stage-blue-text)', fontSize: '12px' }}>{metrics.syncingCount} syncing</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Total synced datasets:</span>
                  <strong style={{ color: 'var(--color-brown-dark)', fontSize: '12px', fontFamily: 'monospace' }}>{metrics.totalSyncs} queries</strong>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Real-Time Data Sync Logs" subtitle="Live checks on integrated webhooks." />
            <CardBody className={styles.noPadding}>
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {syncLogs.map(log => (
                    <div key={log.id} style={{ display: 'flex', gap: '8px', borderBottom: '1px dashed var(--color-border-subtle)', paddingBottom: '8px' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--color-gold-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--color-gold)' }}>
                        <CloudLightning size={10} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-primary)', lineHeight: '1.3' }}>
                          <strong>{log.app}</strong>: {log.details}
                        </span>
                        <span style={{ fontSize: '9px', color: 'var(--color-text-muted)' }}>{log.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>

        </div>

      </div>

      {/* Configurator Side Drawer */}
      {selectedApp && (
        <div className={styles.drawerOverlay} onClick={() => setSelectedApp(null)}>
          <div className={styles.drawer} onClick={e => e.stopPropagation()}>
            
            <div className={styles.drawerHeader}>
              <span className={styles.drawerTitle}>Integration Configuration</span>
              <button type="button" className={styles.drawerClose} onClick={() => setSelectedApp(null)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className={styles.drawerBody}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--color-gold-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold)' }}>
                  <Store size={20} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <strong style={{ fontSize: '13px', color: 'var(--color-brown-dark)' }}>{selectedApp.name}</strong>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Category: {selectedApp.category}</span>
                </div>
              </div>

              <div>
                <span className={styles.drawerLabel}>Service ID Reference</span>
                <div className={styles.drawerValue} style={{ fontFamily: 'monospace' }}>{selectedApp.id}</div>
              </div>

              <div>
                <span className={styles.drawerLabel}>Last Synced At</span>
                <div className={styles.drawerValue}>{selectedApp.installedAt ?? 'Just now'}</div>
              </div>

              <label className={styles.formLabel}>
                <span>Target REST API Webhook Endpoint URL</span>
                <input
                  type="url"
                  required
                  value={configEndpoint}
                  onChange={e => setConfigEndpoint(e.target.value)}
                  className={styles.formInput}
                />
              </label>

              <label className={styles.formLabel}>
                <span>Client OAuth API Key / Secret Token</span>
                <input
                  type="text"
                  required
                  value={configKey}
                  onChange={e => setConfigKey(e.target.value)}
                  placeholder="Insert secret token..."
                  className={styles.formInput}
                />
              </label>

              <div style={{ background: '#fcf8f2', border: '1px solid #ebdcb9', padding: '12px', borderRadius: '8px', display: 'flex', gap: '8px', marginTop: '12px' }}>
                <AlertCircle size={16} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
                <p style={{ fontSize: '11px', color: 'var(--color-text-primary)', lineHeight: '1.4' }}>
                  <strong>Security Reminder:</strong> These keys are stored in encrypted databases. Never share your Client Secret token in public channels.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '24px', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '16px' }}>
                <Button variant="ghost" size="sm" type="button" onClick={() => setSelectedApp(null)}>Cancel</Button>
                <Button variant="gold" size="sm" type="submit">Save Configurations</Button>
              </div>

            </form>

          </div>
        </div>
      )}

    </PageContainer>
  );
}
