import { useState, useMemo } from 'react';
import { PageContainer } from '../layouts';
import { Card, CardBody, CardHeader, Button, MetricTile } from '../components/ui';
import { useNotifications } from '../contexts/NotificationContext';
import { useMetricClick } from '../hooks/useMetricClick';
import {
  Calendar,
  Download,
  Filter,
  HelpCircle,
  FileText,
} from 'lucide-react';
import styles from './AnalyticsPage.module.css';

interface FunnelStage {
  stage: string;
  count: number;
  yieldRate: number;
  description: string;
  color: string;
}

interface CounsellorPerformance {
  counsellor: string;
  assigned: number;
  contacted: number;
  converted: number;
  conversionRate: number;
  channelSource: string;
}

export function AnalyticsPage() {
  const { notify } = useNotifications();
  const metricClick = useMetricClick();

  // State Management
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [courseFilter, setCourseFilter] = useState('All');
  const [selectedFunnelStage, setSelectedFunnelStage] = useState<string | null>(null);
  const [tableSearch, setTableSearch] = useState('');
  const [hoveredHeatmapCell, setHoveredHeatmapCell] = useState<{ day: string; hour: string; count: number } | null>(null);

  // Dynamic Metrics depending on Date Range and Course Filter
  const metrics = useMemo(() => {
    let multiplier = 1;
    if (dateRange === 'Last 7 Days') multiplier = 0.25;
    if (dateRange === 'Last 90 Days') multiplier = 2.8;
    if (courseFilter === 'Engineering') multiplier *= 0.55;
    if (courseFilter === 'Management') multiplier *= 0.45;

    return {
      totalInquiries: Math.round(1420 * multiplier),
      conversionRate: courseFilter === 'Engineering' ? 12.8 : courseFilter === 'Management' ? 10.2 : 11.4,
      qualifiedLeads: Math.round(710 * multiplier),
      averageCounsellingMinutes: Math.round(34 * (multiplier > 1 ? 1.05 : 0.95)),
    };
  }, [dateRange, courseFilter]);

  // Interactive SVG Funnel Data
  const funnelStages: FunnelStage[] = [
    { stage: 'Total Inquiries', count: metrics.totalInquiries, yieldRate: 100, description: 'All leads captured through ads, SEO, and referrals.', color: 'var(--stage-blue-text, #1e40af)' },
    { stage: 'Contacted Leads', count: Math.round(metrics.totalInquiries * 0.72), yieldRate: 72, description: 'Leads successfully contacted by counsellor team.', color: 'var(--stage-purple-text, #6b21a8)' },
    { stage: 'Counselling Scheduled', count: Math.round(metrics.totalInquiries * 0.42), yieldRate: 58, description: 'One-on-one session confirmed and conducted.', color: 'var(--stage-orange-text, #c2410c)' },
    { stage: 'Documents Pending', count: Math.round(metrics.totalInquiries * 0.22), yieldRate: 52, description: 'Academic records uploaded, entering review cycle.', color: 'var(--stage-yellow-text, #a16207)' },
    { stage: 'Admission Confirmed', count: Math.round(metrics.totalInquiries * 0.114), yieldRate: 52, description: 'Seat booking fees reconciled and confirmed.', color: 'var(--stage-green-text, #15803d)' },
  ];

  // Grid Heatmap Data: Peak counsellor response time & active conversations (Mocked hours 9 AM to 6 PM)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = ['09:00', '11:00', '13:00', '15:00', '17:00'];
  
  // Static seed matrix for heatmap values
  const heatmapMatrix: Record<string, Record<string, number>> = {
    Mon: { '09:00': 45, '11:00': 68, '13:00': 30, '15:00': 82, '17:00': 55 },
    Tue: { '09:00': 52, '11:00': 74, '13:00': 42, '15:00': 90, '17:00': 64 },
    Wed: { '09:00': 48, '11:00': 65, '13:00': 35, '15:00': 85, '17:00': 70 },
    Thu: { '09:00': 60, '11:00': 80, '13:00': 50, '15:00': 95, '17:00': 75 },
    Fri: { '09:00': 55, '11:00': 88, '13:00': 48, '15:00': 78, '17:00': 62 },
    Sat: { '09:00': 30, '11:00': 40, '13:00': 20, '15:00': 35, '17:00': 25 },
    Sun: { '09:00': 15, '11:00': 18, '13:00': 10, '15:00': 22, '17:00': 14 },
  };

  const getHeatmapColor = (value: number) => {
    if (value > 80) return 'rgba(196, 165, 116, 0.9)'; // Deep gold
    if (value > 60) return 'rgba(196, 165, 116, 0.65)'; // Medium-deep gold
    if (value > 40) return 'rgba(196, 165, 116, 0.45)'; // Medium gold
    if (value > 20) return 'rgba(196, 165, 116, 0.25)'; // Light gold
    return 'rgba(196, 165, 116, 0.08)'; // Subtle wash
  };

  // Live Performance Table Data
  const counsellorPerformanceData: CounsellorPerformance[] = [
    { counsellor: 'Swati Sen', assigned: 340, contacted: 310, converted: 48, conversionRate: 14.1, channelSource: 'Meta Ads' },
    { counsellor: 'Dr. Sarah Jenkins', assigned: 290, contacted: 265, converted: 38, conversionRate: 13.1, channelSource: 'Google Search' },
    { counsellor: 'Amit Kulkarni', assigned: 210, contacted: 180, converted: 22, conversionRate: 10.4, channelSource: 'Referral' },
    { counsellor: 'Rajesh Nair', assigned: 280, contacted: 240, converted: 25, conversionRate: 8.9, channelSource: 'Direct Traffic' },
    { counsellor: 'Nisha Varma', assigned: 300, contacted: 270, converted: 30, conversionRate: 10.0, channelSource: 'Meta Ads' },
  ];

  const filteredPerformance = useMemo(() => {
    return counsellorPerformanceData.filter(item => {
      const matchSearch = item.counsellor.toLowerCase().includes(tableSearch.toLowerCase()) || 
                          item.channelSource.toLowerCase().includes(tableSearch.toLowerCase());
      return matchSearch;
    });
  }, [counsellorPerformanceData, tableSearch]);

  // Export simulator
  const handleExportData = (type: 'CSV' | 'PDF') => {
    notify({
      type: 'info',
      title: 'Compiling Report Ledger',
      message: `Packaging metrics pipeline in ${type} layout. Please wait...`
    });

    setTimeout(() => {
      notify({
        type: 'success',
        title: 'Document Transferred Successfully',
        message: `Conversion_Report_${dateRange.replace(/ /g, '_')}.${type.toLowerCase()} downloaded to your system archives.`,
        duration: 4000
      });
    }, 1500);
  };

  return (
    <PageContainer breadcrumbs={[{ label: 'CRM & Sales' }, { label: 'Conversion Analytics' }]}>
      
      {/* Header bar controls */}
      <div className={styles.headerBar}>
        <div>
          <h2 className={styles.headerTitle}>CRM Yield & Performance Analytics</h2>
          <p className={styles.headerSubtitle}>
            Interactive SVG pipelines, counsellor yield comparisons, peak hour engagement heatmaps, and downloadable operational datasets.
          </p>
        </div>
        <div className={styles.filterControlsGroup}>
          <div className={styles.selectWrapper}>
            <Calendar size={13} className={styles.selectIcon} />
            <select
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                notify({ type: 'info', title: 'Data Timeline Reset', message: `Displaying metrics compiled over the ${e.target.value}.` });
              }}
              className={styles.dashboardSelect}
            >
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days (Standard)</option>
              <option value="Last 90 Days">Last 90 Days</option>
            </select>
          </div>

          <div className={styles.selectWrapper}>
            <Filter size={13} className={styles.selectIcon} />
            <select
              value={courseFilter}
              onChange={(e) => {
                setCourseFilter(e.target.value);
                notify({ type: 'info', title: 'Academic Filter Applied', message: `Filtered pipeline leads by sector: ${e.target.value}.` });
              }}
              className={styles.dashboardSelect}
            >
              <option value="All">All Disciplines</option>
              <option value="Engineering">Engineering Sector</option>
              <option value="Management">Management Sector</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI metrics row */}
      <div className={`${styles.metricsKpiGrid} ml-stats-grid`}>
        <MetricTile
          label="Captured Leads"
          value={metrics.totalInquiries.toLocaleString()}
          hint="+12.4% vs last period"
          onClick={() => metricClick('Captured Leads', metrics.totalInquiries.toLocaleString())}
        />
        <MetricTile
          label="Admissions Conversion Yield"
          value={`${metrics.conversionRate}%`}
          hint="+1.8% target lock pace"
          onClick={() => metricClick('Admissions Conversion Yield', `${metrics.conversionRate}%`)}
        />
        <MetricTile
          label="Qualified Prospects"
          value={metrics.qualifiedLeads.toLocaleString()}
          hint="50% qualification yield"
          onClick={() => metricClick('Qualified Prospects', metrics.qualifiedLeads.toLocaleString())}
        />
        <MetricTile
          label="Mean Counsel Time"
          value={`${metrics.averageCounsellingMinutes} mins`}
          hint="Per candidate callback"
          onClick={() => metricClick('Mean Counsel Time', `${metrics.averageCounsellingMinutes} mins`)}
        />
      </div>

      {/* Main interactive middle analytics split */}
      <div className={styles.dashboardSplitGrid}>
        
        {/* Interactive Funnel Visualizer card */}
        <Card>
          <CardHeader
            title="Interactive Pipeline Funnel Yield"
            subtitle="Click stages to examine conversion drops, cohort volumes, and operational descriptions."
          />
          <CardBody>
            <div className={styles.funnelSectionLayout}>
              
              {/* Funnel SVG Renderer */}
              <div className={styles.funnelSvgContainer}>
                <svg viewBox="0 0 400 320" className={styles.funnelSvg}>
                  {/* Total Inquiries */}
                  <polygon 
                    points="20,10 380,10 340,65 60,65" 
                    className={`${styles.funnelPolygon} ${selectedFunnelStage === 'Total Inquiries' ? styles.funnelPolygonActive : ''}`}
                    onClick={() => setSelectedFunnelStage('Total Inquiries')}
                    fill="url(#goldGradient1)"
                  />
                  {/* Contacted */}
                  <polygon 
                    points="64,72 336,72 300,127 100,127" 
                    className={`${styles.funnelPolygon} ${selectedFunnelStage === 'Contacted Leads' ? styles.funnelPolygonActive : ''}`}
                    onClick={() => setSelectedFunnelStage('Contacted Leads')}
                    fill="url(#goldGradient2)"
                  />
                  {/* Counselling Scheduled */}
                  <polygon 
                    points="104,134 296,134 260,189 140,189" 
                    className={`${styles.funnelPolygon} ${selectedFunnelStage === 'Counselling Scheduled' ? styles.funnelPolygonActive : ''}`}
                    onClick={() => setSelectedFunnelStage('Counselling Scheduled')}
                    fill="url(#goldGradient3)"
                  />
                  {/* Documents Pending */}
                  <polygon 
                    points="144,196 256,196 220,251 180,251" 
                    className={`${styles.funnelPolygon} ${selectedFunnelStage === 'Documents Pending' ? styles.funnelPolygonActive : ''}`}
                    onClick={() => setSelectedFunnelStage('Documents Pending')}
                    fill="url(#goldGradient4)"
                  />
                  {/* Confirmed */}
                  <polygon 
                    points="184,258 216,258 206,310 194,310" 
                    className={`${styles.funnelPolygon} ${selectedFunnelStage === 'Admission Confirmed' ? styles.funnelPolygonActive : ''}`}
                    onClick={() => setSelectedFunnelStage('Admission Confirmed')}
                    fill="url(#goldGradient5)"
                  />

                  {/* SVG Gradients for beautiful warm rendering */}
                  <defs>
                    <linearGradient id="goldGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#d8c5a9" />
                      <stop offset="100%" stopColor="#c4a574" />
                    </linearGradient>
                    <linearGradient id="goldGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#d1b897" />
                      <stop offset="100%" stopColor="#bfa06d" />
                    </linearGradient>
                    <linearGradient id="goldGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#c9ab85" />
                      <stop offset="100%" stopColor="#b59461" />
                    </linearGradient>
                    <linearGradient id="goldGradient4" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#bf9d72" />
                      <stop offset="100%" stopColor="#aa8954" />
                    </linearGradient>
                    <linearGradient id="goldGradient5" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#b38f5f" />
                      <stop offset="100%" stopColor="#9e7b4b" />
                    </linearGradient>
                  </defs>

                  {/* Centered Labels */}
                  <text x="200" y="38" className={styles.funnelText}>Total Inquiries</text>
                  <text x="200" y="102" className={styles.funnelText}>Contacted</text>
                  <text x="200" y="164" className={styles.funnelText}>Counselling</text>
                  <text x="200" y="226" className={styles.funnelText}>Documents</text>
                  <text x="200" y="288" className={styles.funnelText}>Enrolled</text>
                </svg>
              </div>

              {/* Side dossier breakdown of the selected stage */}
              <div className={styles.funnelMetricsDetails}>
                {selectedFunnelStage ? (
                  (() => {
                    const stageObj = funnelStages.find(s => s.stage === selectedFunnelStage);
                    if (!stageObj) return null;
                    return (
                      <div className={styles.stageDossierBox} style={{ borderLeftColor: stageObj.color }}>
                        <span className={styles.tagLabel}>Operational Details</span>
                        <h4>{stageObj.stage}</h4>
                        <div className={styles.dossierGrid}>
                          <div>
                            <span className={styles.descTitle}>Volume Count</span>
                            <strong>{stageObj.count.toLocaleString()} Students</strong>
                          </div>
                          <div>
                            <span className={styles.descTitle}>Yield Threshold</span>
                            <strong>{stageObj.yieldRate}%</strong>
                          </div>
                        </div>
                        <p className={styles.dossierDesc}>{stageObj.description}</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSelectedFunnelStage(null)} 
                          style={{ marginTop: '8px' }}
                        >
                          Clear Selection
                        </Button>
                      </div>
                    );
                  })()
                ) : (
                  <div className={styles.stageDossierPlaceholder}>
                    <HelpCircle size={32} className={styles.placeholderIcon} />
                    <span>Select any pipeline level in the funnel diagram to isolate details.</span>
                  </div>
                )}
              </div>

            </div>
          </CardBody>
        </Card>

        {/* Interactive Engagement Heatmap Card */}
        <Card>
          <CardHeader
            title="Counsellor Interaction Engagement Heatmap"
            subtitle="Hourly tracker mapping volume of outbound callback operations, calls, and WhatsApp dispatches."
          />
          <CardBody>
            <div className={styles.heatmapWrapper}>
              
              {/* Heatmap header timeline */}
              <div className={styles.heatmapYLabels}>
                <div style={{ height: '24px' }}></div> {/* spacer */}
                {days.map(d => (
                  <div key={d} className={styles.yLabel}>{d}</div>
                ))}
              </div>

              <div className={styles.heatmapGridContent}>
                <div className={styles.heatmapXLabels}>
                  {hours.map(h => (
                    <span key={h} className={styles.xLabel}>{h}</span>
                  ))}
                </div>

                <div className={styles.heatmapCellsBody}>
                  {days.map(day => (
                    <div key={day} className={styles.heatmapRow}>
                      {hours.map(hour => {
                        const count = heatmapMatrix[day][hour];
                        return (
                          <div
                            key={hour}
                            className={styles.heatmapCell}
                            style={{ backgroundColor: getHeatmapColor(count) }}
                            onMouseEnter={() => setHoveredHeatmapCell({ day, hour, count })}
                            onMouseLeave={() => setHoveredHeatmapCell(null)}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Dynamic Heatmap Info Display */}
            <div className={styles.heatmapSummaryRow}>
              {hoveredHeatmapCell ? (
                <div className={styles.heatmapTooltipBox}>
                  <strong>{hoveredHeatmapCell.day} at {hoveredHeatmapCell.hour}</strong>
                  <span> — {hoveredHeatmapCell.count} counsellor communications executed.</span>
                </div>
              ) : (
                <div className={styles.heatmapLegend}>
                  <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Activity Scale:</span>
                  <div className={styles.legendBlock} style={{ background: 'rgba(196, 165, 116, 0.08)' }}></div>
                  <div className={styles.legendBlock} style={{ background: 'rgba(196, 165, 116, 0.25)' }}></div>
                  <div className={styles.legendBlock} style={{ background: 'rgba(196, 165, 116, 0.45)' }}></div>
                  <div className={styles.legendBlock} style={{ background: 'rgba(196, 165, 116, 0.65)' }}></div>
                  <div className={styles.legendBlock} style={{ background: 'rgba(196, 165, 116, 0.9)' }}></div>
                  <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>High Density</span>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

      </div>

      {/* Counselor Performance & Data Export section */}
      <Card style={{ marginTop: 'var(--space-4)' }}>
        <CardHeader
          title="Counsellor Conversion Audit Records"
          subtitle="Live roster monitoring campaign source channels, assigned load, and absolute admission conversions."
          action={
            <div className={styles.tableToolbar}>
              <div className={styles.tableSearchWrapper}>
                <input 
                  type="text" 
                  placeholder="Filter by counsellor or source..."
                  value={tableSearch}
                  onChange={e => setTableSearch(e.target.value)}
                  className={styles.tableSearchInput}
                />
              </div>
              <div className={styles.exportButtons}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  icon={<Download size={13} />}
                  onClick={() => handleExportData('CSV')}
                >
                  Export CSV
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  icon={<FileText size={13} />}
                  onClick={() => handleExportData('PDF')}
                >
                  Export PDF Ledger
                </Button>
              </div>
            </div>
          }
        />
        <CardBody className={styles.noPadding}>
          <div className={styles.tableResponsive}>
            <table className={styles.performanceTable}>
              <thead>
                <tr>
                  <th>Counsellor Name</th>
                  <th>Core Channel Source</th>
                  <th style={{ textAlign: 'center' }}>Assigned Leads</th>
                  <th style={{ textAlign: 'center' }}>Contacted Contacts</th>
                  <th style={{ textAlign: 'center' }}>Admissions Sealed</th>
                  <th style={{ textAlign: 'right' }}>Yield Ratio (%)</th>
                </tr>
              </thead>
              <tbody>
                {filteredPerformance.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyTableState}>
                      No counsellor details match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredPerformance.map(item => (
                    <tr key={item.counsellor}>
                      <td className={styles.counsellorNameCol}>
                        <div className={styles.avatarMini}>{item.counsellor.charAt(0)}</div>
                        <span>{item.counsellor}</span>
                      </td>
                      <td>
                        <span className={styles.channelBadge}>{item.channelSource}</span>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{item.assigned}</td>
                      <td style={{ textAlign: 'center' }}>{item.contacted}</td>
                      <td style={{ textAlign: 'center', color: 'var(--stage-green-text)' }}>{item.converted}</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold', color: 'var(--color-brown-dark)' }}>
                        <div className={styles.ratioWrapper}>
                          <span>{item.conversionRate}%</span>
                          <div className={styles.ratioVisualBar}>
                            <div className={styles.ratioFill} style={{ width: `${item.conversionRate * 6}%` }}></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

    </PageContainer>
  );
}
