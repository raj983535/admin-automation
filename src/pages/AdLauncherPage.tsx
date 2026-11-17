import { useState, useMemo } from 'react';
import { PageContainer, ModulePageHeader } from '../layouts';
import { Card, CardBody, CardHeader, Button } from '../components/ui';
import { useNotifications } from '../hooks/useNotifications';
import {
  Plus,
  Rocket,
  TrendingUp,
  Target,
  DollarSign,
  Play,
  Pause,
  Compass,
  AlertCircle,
  Eye,
  MousePointer,
  Sparkles,
  Settings,
} from 'lucide-react';

const Facebook = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Linkedin = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Instagram = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
import styles from './AdLauncherPage.module.css';

interface Campaign {
  id: string;
  name: string;
  platform: 'Meta' | 'LinkedIn' | 'Instagram' | 'Google';
  objective: string;
  status: 'Active' | 'Paused' | 'Draft';
  budgetType: 'Daily' | 'Lifetime';
  budgetAmount: number;
  spendToDate: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cpc: number;
  targeting: {
    locations: string[];
    ageRange: string;
    interests: string[];
  };
  headline: string;
  description: string;
}

type BudgetType = Campaign['budgetType'];

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-1',
    name: 'B.Tech Engineering Admissions — 2026',
    platform: 'Meta',
    objective: 'Lead Generation',
    status: 'Active',
    budgetType: 'Daily',
    budgetAmount: 5000,
    spendToDate: 124000,
    impressions: 480000,
    clicks: 15200,
    conversions: 480,
    cpc: 8.15,
    targeting: {
      locations: ['Delhi NCR', 'Mumbai', 'Bangalore'],
      ageRange: '17 - 20',
      interests: ['IIT JEE Prep', 'Engineering Degrees', 'Science Majors'],
    },
    headline: 'Top Engineering Admissions Open — Apply Now',
    description: '100% placement record, world-class labs, and global tie-ups. Apply for Fall 2026.',
  },
  {
    id: 'camp-2',
    name: 'Executive MBA Fall Intake — Corporate',
    platform: 'LinkedIn',
    objective: 'Lead Generation',
    status: 'Active',
    budgetType: 'Daily',
    budgetAmount: 12000,
    spendToDate: 310000,
    impressions: 195000,
    clicks: 8400,
    conversions: 150,
    cpc: 36.9,
    targeting: {
      locations: ['All India Metro Cities'],
      ageRange: '24 - 35',
      interests: ['Business Strategy', 'Management', 'Corporate Leaders'],
    },
    headline: 'Accelerate Your Corporate Career with our Executive MBA',
    description: 'Flexible weekend classes, elite networking cohorts, and dual specializations.',
  },
  {
    id: 'camp-3',
    name: 'Scholarship Admissions Webinar RSVP',
    platform: 'Instagram',
    objective: 'Event Registrations',
    status: 'Paused',
    budgetType: 'Lifetime',
    budgetAmount: 50000,
    spendToDate: 45000,
    impressions: 340000,
    clicks: 5100,
    conversions: 340,
    cpc: 8.8,
    targeting: {
      locations: ['Tier 1 & Tier 2 Cities'],
      ageRange: '16 - 19',
      interests: ['College Scholarship', 'Financial Aid', 'Higher Education'],
    },
    headline: 'Get Up to 100% Scholarship — Live Info Session',
    description: 'Learn eligibility, application hacks, and essay tricks from scholarship winners.',
  },
  {
    id: 'camp-4',
    name: 'General Admissions Query Search Campaign',
    platform: 'Google',
    objective: 'Website Conversions',
    status: 'Active',
    budgetType: 'Daily',
    budgetAmount: 8000,
    spendToDate: 256000,
    impressions: 890000,
    clicks: 22000,
    conversions: 890,
    cpc: 11.6,
    targeting: {
      locations: ['All India'],
      ageRange: '16 - 45',
      interests: ['Best Colleges', 'University Admissions', 'SaaS Programs'],
    },
    headline: 'Apply to CollegeOS University — Admissions 2026',
    description: 'Applications closing soon. Fill out the quick enquiry form today.',
  },
];

export function AdLauncherPage() {
  const { notify } = useNotifications();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'campaigns' | 'launcher' | 'audiences'>('dashboard');

  // Campaigns & Segment state
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [targetSegments, setTargetSegments] = useState([
    { id: 'seg-1', name: 'High School Seniors (Science)', locations: 'Delhi, Bangalore', interests: 'IIT JEE, Physics, STEM' },
    { id: 'seg-2', name: 'Working Professionals (MBA)', locations: 'Metro Cities', interests: 'Business, Finance, Product Management' },
  ]);

  // Form State for Launcher
  const [newCampaignName, setNewCampaignName] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<Campaign['platform']>('Meta');
  const [objective, setObjective] = useState('Lead Generation');
  const [budgetType, setBudgetType] = useState<'Daily' | 'Lifetime'>('Daily');
  const [budgetAmount, setBudgetAmount] = useState(5000);
  const [locations, setLocations] = useState('Delhi, Mumbai, Bangalore');
  const [ageRange, setAgeRange] = useState('17 - 21');
  const [interests, setInterests] = useState('High School Graduate, College Admission');
  const [headline, setHeadline] = useState('');
  const [description, setDescription] = useState('');

  // Segment creation form
  const [newSegName, setNewSegName] = useState('');
  const [newSegLocs, setNewSegLocs] = useState('');
  const [newSegInts, setNewSegInts] = useState('');

  // Aggregate metrics
  const totalMetrics = useMemo(() => {
    let spend = 0;
    let imps = 0;
    let clicks = 0;
    let convs = 0;
    campaigns.forEach((c) => {
      spend += c.spendToDate;
      imps += c.impressions;
      clicks += c.clicks;
      convs += c.conversions;
    });

    const averageCpc = clicks > 0 ? spend / clicks : 0;
    const overallCtr = imps > 0 ? (clicks / imps) * 100 : 0;
    const overallConvRate = clicks > 0 ? (convs / clicks) * 100 : 0;

    return {
      spend,
      imps,
      clicks,
      convs,
      averageCpc,
      overallCtr,
      overallConvRate,
    };
  }, [campaigns]);

  // Toggle Campaign active status
  const handleToggleStatus = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newStatus = c.status === 'Active' ? 'Paused' : 'Active';
          notify({
            type: 'info',
            title: `Campaign ${newStatus}`,
            message: `"${c.name}" has been ${newStatus.toLowerCase()}.`,
          });
          return { ...c, status: newStatus };
        }
        return c;
      })
    );
  };

  // Launch Campaign
  const handleLaunchCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaignName || !headline || !description) {
      notify({
        type: 'error',
        title: 'Form Incomplete',
        message: 'Please fill in campaign title, headline, and creative description.',
      });
      return;
    }

    const newCamp: Campaign = {
      id: `camp-${Date.now()}`,
      name: newCampaignName,
      platform: selectedPlatform,
      objective,
      status: 'Active',
      budgetType,
      budgetAmount,
      spendToDate: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      cpc: selectedPlatform === 'LinkedIn' ? 35 : selectedPlatform === 'Google' ? 12 : 8,
      targeting: {
        locations: locations.split(',').map((l) => l.trim()),
        ageRange,
        interests: interests.split(',').map((i) => i.trim()),
      },
      headline,
      description,
    };

    setCampaigns((prev) => [newCamp, ...prev]);

    // Reset Form
    setNewCampaignName('');
    setHeadline('');
    setDescription('');
    setActiveTab('campaigns');

    notify({
      type: 'success',
      title: 'Campaign Launched!',
      message: `"${newCamp.name}" is now live on ${newCamp.platform}. Syncing tracking metrics...`,
    });
  };

  // Add Target Segment
  const handleAddSegment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSegName) return;

    const newSeg = {
      id: `seg-${Date.now()}`,
      name: newSegName,
      locations: newSegLocs || 'All India',
      interests: newSegInts || 'None Specified',
    };

    setTargetSegments((prev) => [...prev, newSeg]);
    setNewSegName('');
    setNewSegLocs('');
    setNewSegInts('');

    notify({
      type: 'success',
      title: 'Segment Saved',
      message: `Audience cohort "${newSeg.name}" created. Ready for campaign attachment.`,
    });
  };

  return (
    <PageContainer breadcrumbs={[{ label: 'Builders' }, { label: 'Ad Launcher' }]}>
      <ModulePageHeader
        title="Ad Launcher"
        subtitle="Launch and monitor Meta and Google ads for enrollment."
      />
      <nav className="ml-tabs">
        <button type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`ml-tab ${activeTab === 'dashboard' ? 'ml-tab-active' : ''}`}
        >
          <Compass size={16} />
          <span>Overview Analytics</span>
        </button>
        <button type="button"
          onClick={() => setActiveTab('campaigns')}
          className={`ml-tab ${activeTab === 'campaigns' ? 'ml-tab-active' : ''}`}
        >
          <Rocket size={16} />
          <span>Active Ad Campaigns</span>
        </button>
        <button type="button"
          onClick={() => setActiveTab('launcher')}
          className={`ml-tab ${activeTab === 'launcher' ? 'ml-tab-active' : ''}`}
        >
          <Plus size={16} />
          <span>New Campaign Launcher</span>
        </button>
        <button type="button"
          onClick={() => setActiveTab('audiences')}
          className={`ml-tab ${activeTab === 'audiences' ? 'ml-tab-active' : ''}`}
        >
          <Target size={16} />
          <span>Audience Cohorts</span>
        </button>
      </nav>

      {/* Main Content Area */}
      <div className={`ml-tab-panel ${styles.tabContent}`}>
        {/* OVERVIEW ANALYTICS */}
        {activeTab === 'dashboard' && (
          <div className={styles.dashboardContainer}>
            <div className={styles.statsGrid}>
              <Card padding="md" variant="default" className={styles.statBox}>
                <div className={styles.statHeader}>
                  <span>Ad Spend to Date</span>
                  <DollarSign size={16} className={styles.goldText} />
                </div>
                <h3>₹{totalMetrics.spend.toLocaleString('en-IN')}</h3>
                <p>Budget utilized across cycle</p>
              </Card>

              <Card padding="md" variant="default" className={styles.statBox}>
                <div className={styles.statHeader}>
                  <span>Total Conversions</span>
                  <TrendingUp size={16} className={styles.greenText} />
                </div>
                <h3>{totalMetrics.convs.toLocaleString()} Leads</h3>
                <p>Forms completed from ads</p>
              </Card>

              <Card padding="md" variant="default" className={styles.statBox}>
                <div className={styles.statHeader}>
                  <span>Impressions / Views</span>
                  <Eye size={16} />
                </div>
                <h3>{totalMetrics.imps.toLocaleString()}</h3>
                <p>Total visual ad impressions</p>
              </Card>

              <Card padding="md" variant="default" className={styles.statBox}>
                <div className={styles.statHeader}>
                  <span>Avg. Cost Per Click (CPC)</span>
                  <MousePointer size={16} className={styles.blueText} />
                </div>
                <h3>₹{totalMetrics.averageCpc.toFixed(2)}</h3>
                <p>Google Search, Meta & LinkedIn</p>
              </Card>
            </div>

            {/* Performance charts & platform gauges */}
            <div className={styles.dashboardLayoutSplit}>
              {/* Gauges */}
              <div className={styles.chartColLeft}>
                <Card padding="md" variant="default">
                  <CardHeader title="Conversion Performance By Network" subtitle="Average lead yield rates" />
                  <CardBody className={styles.gaugeContainer}>
                    <div className={styles.progressRow}>
                      <div className={styles.progressLabel}>
                        <div className={styles.platformBadgeMeta}>
                          <Facebook size={12} /> <span>Meta Network</span>
                        </div>
                        <strong>3.16% rate</strong>
                      </div>
                      <div className={styles.progressBarBg}>
                        <div className={styles.progressBarFill} style={{ width: '65%' }}></div>
                      </div>
                    </div>

                    <div className={styles.progressRow}>
                      <div className={styles.progressLabel}>
                        <div className={styles.platformBadgeGoogle}>
                          <span>G</span> <span>Google Adwords</span>
                        </div>
                        <strong>4.05% rate</strong>
                      </div>
                      <div className={styles.progressBarBg}>
                        <div className={styles.progressBarFill} style={{ width: '82%', background: '#c4a574' }}></div>
                      </div>
                    </div>

                    <div className={styles.progressRow}>
                      <div className={styles.progressLabel}>
                        <div className={styles.platformBadgeLinkedIn}>
                          <Linkedin size={12} /> <span>LinkedIn Professional</span>
                        </div>
                        <strong>1.79% rate</strong>
                      </div>
                      <div className={styles.progressBarBg}>
                        <div className={styles.progressBarFill} style={{ width: '36%', background: 'var(--color-muted-brown)' }}></div>
                      </div>
                    </div>

                    <div className={styles.progressRow}>
                      <div className={styles.progressLabel}>
                        <div className={styles.platformBadgeInstagram}>
                          <Instagram size={12} /> <span>Instagram Mobile</span>
                        </div>
                        <strong>6.67% rate</strong>
                      </div>
                      <div className={styles.progressBarBg}>
                        <div className={styles.progressBarFill} style={{ width: '90%', background: '#e8d4c0' }}></div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Tips & Recommendations */}
              <div className={styles.chartColRight}>
                <Card padding="md" variant="bordered">
                  <CardHeader title="AI Budget Optimization Tips" subtitle="Calculated recommendations for current cycle" />
                  <CardBody className={styles.aiTipsBody}>
                    <div className={styles.tipRow}>
                      <Sparkles size={16} className={styles.goldText} />
                      <div>
                        <strong>Meta Engineering Campaign is CPC-Efficient</strong>
                        <p>Cost per lead on Meta is ₹8.15 vs ₹36.90 on LinkedIn. We recommend shifting 15% budget from LinkedIn Executive MBA to Meta to maximize total inquiries.</p>
                      </div>
                    </div>
                    <div className={styles.tipRow}>
                      <AlertCircle size={16} className={styles.orangeText} />
                      <div>
                        <strong>Low Audience Size on Scholarship RSVP</strong>
                        <p>Audience interests are too narrow. Expand age targeting to 16-24 to lower CPC bid rates by an estimated 11%.</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVE CAMPAIGNS CARD LIST */}
        {activeTab === 'campaigns' && (
          <div className={styles.campaignsContainer}>
            <div className={styles.campaignsHeader}>
              <h3>Configured Campaigns Directory</h3>
              <p>Review real-time conversion KPIs, adjust budget, and pause/start ads instantly.</p>
            </div>

            <div className={styles.campaignGrid}>
              {campaigns.map((camp) => (
                <Card key={camp.id} padding="md" variant="default" className={styles.campaignCard}>
                  <div className={styles.campaignCardHeader}>
                    {camp.platform === 'Meta' && (
                      <span className={styles.platformBadgeMeta}>
                        <Facebook size={12} /> Meta Ads
                      </span>
                    )}
                    {camp.platform === 'LinkedIn' && (
                      <span className={styles.platformBadgeLinkedIn}>
                        <Linkedin size={12} /> LinkedIn Ads
                      </span>
                    )}
                    {camp.platform === 'Instagram' && (
                      <span className={styles.platformBadgeInstagram}>
                        <Instagram size={12} /> Instagram
                      </span>
                    )}
                    {camp.platform === 'Google' && (
                      <span className={styles.platformBadgeGoogle}>Google Search</span>
                    )}

                    <button type="button"
                      onClick={() => handleToggleStatus(camp.id)}
                      className={`${styles.toggleStatusBtn} ${camp.status === 'Active' ? styles.statusActive : styles.statusPaused}`}
                    >
                      {camp.status === 'Active' ? <Pause size={12} /> : <Play size={12} />}
                      {camp.status}
                    </button>
                  </div>

                  <div className={styles.campaignCardBody}>
                    <h4 className={styles.campaignCardTitle}>{camp.name}</h4>
                    <p className={styles.campaignObjective}>Objective: {camp.objective}</p>

                    <div className={styles.campaignInlineStats}>
                      <div className={styles.inlineStatItem}>
                        <span>Spend</span>
                        <strong>₹{camp.spendToDate.toLocaleString('en-IN')}</strong>
                      </div>
                      <div className={styles.inlineStatItem}>
                        <span>Clicks</span>
                        <strong>{camp.clicks.toLocaleString()}</strong>
                      </div>
                      <div className={styles.inlineStatItem}>
                        <span>Leads</span>
                        <strong>{camp.conversions}</strong>
                      </div>
                    </div>

                    <div className={styles.targetingBox}>
                      <strong>Targeting:</strong>
                      <p>Age: {camp.targeting.ageRange}</p>
                      <div className={styles.tagGroup}>
                        {camp.targeting.interests.slice(0, 3).map((tag, i) => (
                          <span key={i} className={styles.interestTag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className={styles.campaignCardFooter}>
                    <div className={styles.budgetDisplay}>
                      <span>{camp.budgetType} Budget:</span>
                      <strong>₹{camp.budgetAmount.toLocaleString('en-IN')}</strong>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Settings size={12} />}
                      onClick={() =>
                        notify({
                          type: 'info',
                          title: 'Ad Set Editor Opened',
                          message: `Selected campaign "${camp.name}". Deep bid adjust tools coming soon.`,
                        })
                      }
                    >
                      Bids
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* NEW CAMPAIGN LAUNCHER FORM */}
        {activeTab === 'launcher' && (
          <div className={styles.launcherContainer}>
            <div className={styles.launcherColumns}>
              {/* Launcher inputs */}
              <div className={styles.launcherColLeft}>
                <Card padding="md" variant="default">
                  <CardHeader title="Create Ad Campaign" subtitle="Define objective, budget, targeting, and ad creatives" />
                  <CardBody>
                    <form onSubmit={handleLaunchCampaign} className={styles.launcherForm}>
                      <label className={styles.formLabel}>
                        <span>Campaign Name</span>
                        <input
                          type="text"
                          required
                          value={newCampaignName}
                          onChange={(e) => setNewCampaignName(e.target.value)}
                          placeholder="e.g. MBA Program Scholarship Push — June 2026"
                          className={styles.formInput}
                        />
                      </label>

                      <div className={styles.formRow}>
                        <label className={styles.formLabel}>
                          <span>Select Channel Network</span>
                          <select
                            value={selectedPlatform}
                            onChange={(e) => setSelectedPlatform(e.target.value as Campaign['platform'])}
                            className={styles.formSelect}
                          >
                            <option value="Meta">Meta Ads (Facebook/Audience Network)</option>
                            <option value="Instagram">Instagram Mobile Placement</option>
                            <option value="Google">Google AdWords Search Ads</option>
                            <option value="LinkedIn">LinkedIn Sponsored Content</option>
                          </select>
                        </label>

                        <label className={styles.formLabel}>
                          <span>Optimization Objective</span>
                          <select
                            value={objective}
                            onChange={(e) => setObjective(e.target.value)}
                            className={styles.formSelect}
                          >
                            <option value="Lead Generation">Lead Generation Forms</option>
                            <option value="Website Conversions">Direct Inquiries (Website Conversions)</option>
                            <option value="Event Registrations">RSVP Signups (Event Registration)</option>
                            <option value="Brand Awareness">Video Views & Brand Reach</option>
                          </select>
                        </label>
                      </div>

                      <div className={styles.formRow}>
                        <label className={styles.formLabel}>
                          <span>Budget Schedule</span>
                          <select
                            value={budgetType}
                            onChange={(e) => setBudgetType(e.target.value as BudgetType)}
                            className={styles.formSelect}
                          >
                            <option value="Daily">Daily Budget Limit</option>
                            <option value="Lifetime">Lifetime Campaign Budget</option>
                          </select>
                        </label>

                        <label className={styles.formLabel}>
                          <span>Budget Amount (₹)</span>
                          <input
                            type="number"
                            required
                            value={budgetAmount}
                            onChange={(e) => setBudgetAmount(parseInt(e.target.value) || 0)}
                            className={styles.formInput}
                          />
                        </label>
                      </div>

                      {/* Targeting */}
                      <div className={styles.targetingFormBox}>
                        <h4>Target Demographic Targeting</h4>
                        <div className={styles.formRow}>
                          <label className={styles.formLabel}>
                            <span>Age Range</span>
                            <input
                              type="text"
                              value={ageRange}
                              onChange={(e) => setAgeRange(e.target.value)}
                              placeholder="e.g. 17 - 21"
                              className={styles.formInput}
                            />
                          </label>

                          <label className={styles.formLabel}>
                            <span>Locations</span>
                            <input
                              type="text"
                              value={locations}
                              onChange={(e) => setLocations(e.target.value)}
                              placeholder="e.g. Delhi NCR, Bangalore, Pune"
                              className={styles.formInput}
                            />
                          </label>
                        </div>

                        <label className={styles.formLabel}>
                          <span>Interests & Demographics Keywords (comma-separated)</span>
                          <input
                            type="text"
                            value={interests}
                            onChange={(e) => setInterests(e.target.value)}
                            placeholder="e.g. JEE Preparation, College Admission, STEM subjects"
                            className={styles.formInput}
                          />
                        </label>
                      </div>

                      {/* Ad creatives */}
                      <div className={styles.targetingFormBox}>
                        <h4>Ad Creative Design</h4>
                        <label className={styles.formLabel}>
                          <span>Main Ad Headline</span>
                          <input
                            type="text"
                            required
                            value={headline}
                            onChange={(e) => setHeadline(e.target.value)}
                            placeholder="e.g. Apply for Engineering 2026 Today"
                            className={styles.formInput}
                          />
                        </label>

                        <label className={styles.formLabel}>
                          <span>Creative Ad Body Text</span>
                          <textarea
                            required
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe scholarships, rankings, course placements..."
                            className={styles.formTextarea}
                          />
                        </label>
                      </div>

                      <Button type="submit" variant="gold" icon={<Rocket size={16} />} fullWidth>
                        Launch Ad Campaign Now
                      </Button>
                    </form>
                  </CardBody>
                </Card>
              </div>

              {/* Mobile/Live Ad Preview Mockup */}
              <div className={styles.launcherColRight}>
                <Card padding="md" variant="bordered" className={styles.previewSidebarCard}>
                  <CardHeader title="Mock Ad Creative Preview" subtitle="Simulated view of active placement" />
                  <CardBody>
                    <div className={styles.mobilePlacementPreview}>
                      <div className={styles.adMobileHeader}>
                        <div className={styles.avatarMock}>C</div>
                        <div>
                          <strong>CollegeOS University</strong>
                          <span>Sponsored Ad</span>
                        </div>
                      </div>

                      <div className={styles.adMobileImage}>
                        <div className={styles.imagePlaceholderText}>
                          {selectedPlatform} Banner Mockup
                        </div>
                      </div>

                      <div className={styles.adMobileBody}>
                        <h4 className={styles.previewAdHeadline}>{headline || 'Add an eye-catching headline...'}</h4>
                        <p className={styles.previewAdDesc}>{description || 'Fill in the ad description to see how it renders in student feeds.'}</p>
                      </div>

                      <div className={styles.adMobileFooter}>
                        <span>{objective === 'Event Registrations' ? 'RSVP' : 'Apply Now'}</span>
                        <div className={styles.ctaBtnMock}>Learn More</div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* AUDIENCE COHORTS */}
        {activeTab === 'audiences' && (
          <div className={styles.audiencesContainer}>
            <div className={styles.launcherColumns}>
              {/* Form to add segment */}
              <div className={styles.launcherColLeft}>
                <Card padding="md" variant="default">
                  <CardHeader title="Build Student Audience Cohort" subtitle="Create targeting cohorts to attach to future ad campaigns" />
                  <CardBody>
                    <form onSubmit={handleAddSegment} className={styles.launcherForm}>
                      <label className={styles.formLabel}>
                        <span>Cohort Segment Name</span>
                        <input
                          type="text"
                          required
                          value={newSegName}
                          onChange={(e) => setNewSegName(e.target.value)}
                          placeholder="e.g. CS Prospects Delhi NCR"
                          className={styles.formInput}
                        />
                      </label>

                      <label className={styles.formLabel}>
                        <span>Target Locations</span>
                        <input
                          type="text"
                          value={newSegLocs}
                          onChange={(e) => setNewSegLocs(e.target.value)}
                          placeholder="e.g. Delhi NCR, Haryana"
                          className={styles.formInput}
                        />
                      </label>

                      <label className={styles.formLabel}>
                        <span>Educational / Interest Keywords</span>
                        <input
                          type="text"
                          value={newSegInts}
                          onChange={(e) => setNewSegInts(e.target.value)}
                          placeholder="e.g. High School Graduate, Engineering Interest"
                          className={styles.formInput}
                        />
                      </label>

                      <Button type="submit" variant="primary">
                        Save Audience Segment
                      </Button>
                    </form>
                  </CardBody>
                </Card>
              </div>

              {/* Saved list */}
              <div className={styles.launcherColRight}>
                <Card padding="md" variant="default">
                  <CardHeader title="Saved Cohorts Library" subtitle="Ready for platform targeting" />
                  <CardBody>
                    <div className={styles.cohortList}>
                      {targetSegments.map((seg) => (
                        <div key={seg.id} className={styles.cohortRowItem}>
                          <strong>{seg.name}</strong>
                          <p>
                            <strong>Locations:</strong> {seg.locations}
                          </p>
                          <p>
                            <strong>Interests:</strong> {seg.interests}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
