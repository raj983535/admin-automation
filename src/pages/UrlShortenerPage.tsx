import { useState, useMemo } from 'react';
import { PageContainer } from '../layouts';
import { Card, CardBody, CardHeader, Button } from '../components/ui';
import { useNotifications } from '../contexts/NotificationContext';
import {
  Copy,
  QrCode,
  BarChart3,
  Search,
  Plus,
  Check,
  Globe,
  Laptop,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import styles from './UrlShortenerPage.module.css';

interface ShortUrl {
  id: string;
  title: string;
  shortLink: string;
  longLink: string;
  domain: string;
  slug: string;
  clicks: number;
  status: 'Active' | 'Inactive';
  date: string;
  referrers: Record<string, number>;
  devices: Record<string, number>;
  regions: Record<string, number>;
}

const INITIAL_URLS: ShortUrl[] = [
  {
    id: 'url-1',
    title: 'Fall 2026 Undergraduate Application',
    domain: 'colleg.os',
    slug: 'apply2026',
    shortLink: 'colleg.os/apply2026',
    longLink: 'https://uos.edu/admissions/apply?utm_source=meta&utm_medium=cpc&utm_campaign=fall2026',
    clicks: 4850,
    status: 'Active',
    date: '2026-05-10',
    referrers: { 'Meta Ads': 3100, 'Direct': 750, 'Google Search': 600, 'LinkedIn': 400 },
    devices: { 'Mobile': 3600, 'Desktop': 1050, 'Tablet': 200 },
    regions: { 'Delhi NCR': 2100, 'Maharashtra': 1400, 'Karnataka': 850, 'Others': 500 },
  },
  {
    id: 'url-2',
    title: 'Spring Open House Info Registration',
    domain: 'visit.college',
    slug: 'openhouse',
    shortLink: 'visit.college/openhouse',
    longLink: 'https://uos.edu/events/open-house-spring?utm_source=newsletter&utm_medium=email&utm_campaign=rsvp-blast',
    clicks: 1204,
    status: 'Active',
    date: '2026-05-12',
    referrers: { 'Email Newsletter': 950, 'Direct': 150, 'Facebook Group': 104 },
    devices: { 'Mobile': 480, 'Desktop': 680, 'Tablet': 44 },
    regions: { 'Delhi NCR': 700, 'Haryana': 304, 'Uttar Pradesh': 200 },
  },
  {
    id: 'url-3',
    title: 'Merchandise Store 10% Discount Campaign',
    domain: 'colleg.os',
    slug: 'merch10',
    shortLink: 'colleg.os/merch10',
    longLink: 'https://uos.edu/store/merchandise?utm_source=instagram&utm_medium=social_bio&utm_campaign=hoodie-launch',
    clicks: 945,
    status: 'Active',
    date: '2026-05-15',
    referrers: { 'Instagram Bio': 820, 'Direct': 75, 'Twitter Share': 50 },
    devices: { 'Mobile': 880, 'Desktop': 55, 'Tablet': 10 },
    regions: { 'Karnataka': 450, 'Maharashtra': 300, 'Tamil Nadu': 195 },
  },
  {
    id: 'url-4',
    title: 'Digital Calculus Study Guide PDF Download',
    domain: 'apply.uos.edu',
    slug: 'calc-guide',
    shortLink: 'apply.uos.edu/calc-guide',
    longLink: 'https://uos.edu/downloads/calculus-guide-calc101?utm_source=qr-code&utm_medium=flyer',
    clicks: 320,
    status: 'Active',
    date: '2026-05-18',
    referrers: { 'Physical Flyer QR': 300, 'Direct': 20 },
    devices: { 'Mobile': 310, 'Desktop': 5, 'Tablet': 5 },
    regions: { 'Delhi NCR': 200, 'Others': 120 },
  },
];

export function UrlShortenerPage() {
  const { notify } = useNotifications();
  const [urls, setUrls] = useState<ShortUrl[]>(INITIAL_URLS);
  const [selectedUrlId, setSelectedUrlId] = useState<string>(urls[0]?.id || '');

  // Form State
  const [longLinkInput, setLongLinkInput] = useState('');
  const [domainSelect, setDomainSelect] = useState('colleg.os');
  const [slugInput, setSlugInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  
  // UTM variables
  const [utmSource, setUtmSource] = useState('');
  const [utmMedium, setUtmMedium] = useState('');
  const [utmCampaign, setUtmCampaign] = useState('');

  // Search & Copy check states
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // QR Modal
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  // Auto-fill random slug helper
  const generateRandomSlug = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSlugInput(result);
  };

  // Compile UTM parameter link
  const computedLongUrl = useMemo(() => {
    if (!longLinkInput) return '';
    try {
      const url = new URL(longLinkInput);
      if (utmSource) url.searchParams.set('utm_source', utmSource);
      if (utmMedium) url.searchParams.set('utm_medium', utmMedium);
      if (utmCampaign) url.searchParams.set('utm_campaign', utmCampaign);
      return url.toString();
    } catch {
      // If invalid URL, return text with params concatenated
      let query = '';
      if (utmSource) query += `&utm_source=${utmSource}`;
      if (utmMedium) query += `&utm_medium=${utmMedium}`;
      if (utmCampaign) query += `&utm_campaign=${utmCampaign}`;
      if (query) {
        const joiner = longLinkInput.includes('?') ? '&' : '?';
        return `${longLinkInput}${joiner}${query.substring(1)}`;
      }
      return longLinkInput;
    }
  }, [longLinkInput, utmSource, utmMedium, utmCampaign]);

  // Handle URL creation
  const handleCreateShortUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!longLinkInput) return;

    // Check slug uniqueness
    const slug = slugInput.trim() || Math.random().toString(36).substring(2, 8);
    const existing = urls.find((u) => u.domain === domainSelect && u.slug === slug);
    if (existing) {
      notify({
        type: 'error',
        title: 'Slug Unavailable',
        message: `The slug "${slug}" is already taken on domain "${domainSelect}".`,
      });
      return;
    }

    const shortLink = `${domainSelect}/${slug}`;
    const newUrl: ShortUrl = {
      id: `url-${Date.now()}`,
      title: titleInput.trim() || `Link to ${domainSelect}/${slug}`,
      domain: domainSelect,
      slug,
      shortLink,
      longLink: computedLongUrl,
      clicks: 0,
      status: 'Active',
      date: new Date().toISOString().split('T')[0],
      referrers: { 'Direct': 0 },
      devices: { 'Mobile': 0, 'Desktop': 0 },
      regions: { 'Others': 0 },
    };

    setUrls((prev) => [newUrl, ...prev]);
    setSelectedUrlId(newUrl.id);

    // Reset fields
    setLongLinkInput('');
    setSlugInput('');
    setTitleInput('');
    setUtmSource('');
    setUtmMedium('');
    setUtmCampaign('');

    notify({
      type: 'success',
      title: 'Short Link Created',
      message: `Successfully generated short URL: ${shortLink}`,
    });
  };

  // Handle click copy
  const handleCopyLink = (shortLink: string, id: string) => {
    navigator.clipboard.writeText(`https://${shortLink}`);
    setCopiedId(id);
    notify({
      type: 'success',
      title: 'Copied to Clipboard',
      message: `Copied https://${shortLink}`,
      duration: 1500,
    });
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Open QR modal
  const handleOpenQr = (shortLink: string) => {
    setQrUrl(`https://${shortLink}`);
    setShowQrModal(true);
  };

  // Toggle Redirect status
  const handleToggleStatus = (id: string) => {
    setUrls((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const newStatus = u.status === 'Active' ? 'Inactive' : 'Active';
          notify({
            type: 'info',
            title: `Link redirect ${newStatus}`,
            message: `"${u.shortLink}" redirect is now ${newStatus.toLowerCase()}.`,
          });
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  // Filtered links
  const filteredUrls = useMemo(() => {
    return urls.filter((u) => {
      const q = searchQuery.toLowerCase();
      return (
        u.title.toLowerCase().includes(q) ||
        u.shortLink.toLowerCase().includes(q) ||
        u.longLink.toLowerCase().includes(q)
      );
    });
  }, [urls, searchQuery]);

  const selectedUrl = useMemo(() => {
    return urls.find((u) => u.id === selectedUrlId) || urls[0];
  }, [urls, selectedUrlId]);

  return (
    <PageContainer breadcrumbs={[{ label: 'Builders' }, { label: 'URL Shortener' }]}>
      {/* Overview stats */}
      <section className={styles.topStatsGrid}>
        <div className={styles.statMiniCard}>
          <span>Total Links</span>
          <h3>{urls.length}</h3>
        </div>
        <div className={styles.statMiniCard}>
          <span>Accumulated Clicks</span>
          <h3>{urls.reduce((sum, u) => sum + u.clicks, 0).toLocaleString()}</h3>
        </div>
        <div className={styles.statMiniCard}>
          <span>Active Redirects</span>
          <h3>{urls.filter((u) => u.status === 'Active').length}</h3>
        </div>
      </section>

      {/* Main Split Layout */}
      <div className={styles.shortenerLayout}>
        {/* Left Form & Table */}
        <div className={styles.colLeft}>
          {/* Creator form */}
          <Card padding="md" variant="default" className={styles.formCard}>
            <CardHeader title="Generate Branded Short URL" subtitle="Instantly redirect students with UTM tracking parameters" />
            <CardBody>
              <form onSubmit={handleCreateShortUrl} className={styles.creationForm}>
                <div className={styles.formRow}>
                  <label className={styles.formLabel}>
                    <span>Destination Long URL</span>
                    <input
                      type="url"
                      required
                      placeholder="https://yourcollege.edu/admissions/fall-application-page"
                      value={longLinkInput}
                      onChange={(e) => setLongLinkInput(e.target.value)}
                      className={styles.formInput}
                    />
                  </label>

                  <label className={styles.formLabel}>
                    <span>Link Descriptor (Internal Label)</span>
                    <input
                      type="text"
                      placeholder="e.g. Fall 2026 admissions page"
                      value={titleInput}
                      onChange={(e) => setTitleInput(e.target.value)}
                      className={styles.formInput}
                    />
                  </label>
                </div>

                {/* Slug customizer */}
                <div className={styles.slugCustomizerRow}>
                  <div className={styles.formLabel}>
                    <span>Shortened Link Format</span>
                    <div className={styles.slugPickerWrap}>
                      <select
                        value={domainSelect}
                        onChange={(e) => setDomainSelect(e.target.value)}
                        className={styles.domainSelect}
                      >
                        <option value="colleg.os">colleg.os/</option>
                        <option value="visit.college">visit.college/</option>
                        <option value="apply.uos.edu">apply.uos.edu/</option>
                      </select>
                      <input
                        type="text"
                        placeholder="custom-slug"
                        value={slugInput}
                        onChange={(e) => setSlugInput(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                        className={styles.slugInput}
                      />
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={generateRandomSlug} className={styles.rndSlugBtn}>
                    Generate Slug
                  </Button>
                </div>

                {/* UTM Parameter Collapse */}
                <div className={styles.utmBox}>
                  <h4>UTM Tracking Parameters (Campaign Builder)</h4>
                  <div className={styles.utmGrid}>
                    <label className={styles.formLabel}>
                      <span>Campaign Source</span>
                      <input
                        type="text"
                        placeholder="e.g. facebook, email, qr-code"
                        value={utmSource}
                        onChange={(e) => setUtmSource(e.target.value)}
                        className={styles.formInput}
                      />
                    </label>

                    <label className={styles.formLabel}>
                      <span>Campaign Medium</span>
                      <input
                        type="text"
                        placeholder="e.g. cpc, newsletter, print-flyer"
                        value={utmMedium}
                        onChange={(e) => setUtmMedium(e.target.value)}
                        className={styles.formInput}
                      />
                    </label>

                    <label className={styles.formLabel}>
                      <span>Campaign Name</span>
                      <input
                        type="text"
                        placeholder="e.g. admissions-eng-2026"
                        value={utmCampaign}
                        onChange={(e) => setUtmCampaign(e.target.value)}
                        className={styles.formInput}
                      />
                    </label>
                  </div>

                  {computedLongUrl && (
                    <div className={styles.compiledLongLink}>
                      <span>Final URL Destination:</span>
                      <p>{computedLongUrl}</p>
                    </div>
                  )}
                </div>

                <Button type="submit" variant="gold" icon={<Plus size={16} />}>
                  Shorten & Save Redirect Link
                </Button>
              </form>
            </CardBody>
          </Card>

          {/* Directory list */}
          <Card padding="none" variant="default" className={styles.dirCard}>
            <div className={styles.dirHeader}>
              <CardHeader title="Link Directory" subtitle="All generated short URLs in circulation" />
              <div className={styles.searchWrap}>
                <Search size={14} />
                <input
                  type="text"
                  placeholder="Search redirects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </div>

            <CardBody className={styles.dirBody}>
              <div className={styles.tableWrapper}>
                <table className={styles.urlsTable}>
                  <thead>
                    <tr>
                      <th>Link Title & Destination</th>
                      <th>Short Link</th>
                      <th>Clicks</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUrls.length === 0 ? (
                      <tr>
                        <td colSpan={5} className={styles.emptyTable}>
                          No redirect links match search parameters.
                        </td>
                      </tr>
                    ) : (
                      filteredUrls.map((url) => (
                        <tr
                          key={url.id}
                          className={`${styles.urlRow} ${selectedUrlId === url.id ? styles.urlRowSelected : ''}`}
                          onClick={() => setSelectedUrlId(url.id)}
                        >
                          <td>
                            <div className={styles.titleDestCol}>
                              <strong>{url.title}</strong>
                              <p className={styles.longUrlTrunc} title={url.longLink}>
                                {url.longLink}
                              </p>
                            </div>
                          </td>
                          <td className={styles.shortLinkCol}>
                            <span className={styles.shortSpan}>{url.shortLink}</span>
                          </td>
                          <td className={styles.clicksCol}>{url.clicks}</td>
                          <td>
                            <button type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleStatus(url.id);
                              }}
                              className={`${styles.statusPill} ${url.status === 'Active' ? styles.statusPillActive : styles.statusPillInactive}`}
                            >
                              {url.status}
                            </button>
                          </td>
                          <td>
                            <div className={styles.actionsWrap} onClick={(e) => e.stopPropagation()}>
                              <button type="button"
                                onClick={() => handleCopyLink(url.shortLink, url.id)}
                                className={styles.actionIconButton}
                                title="Copy Shortened URL"
                              >
                                {copiedId === url.id ? <Check size={12} className={styles.greenText} /> : <Copy size={12} />}
                              </button>
                              <button type="button"
                                onClick={() => handleOpenQr(url.shortLink)}
                                className={styles.actionIconButton}
                                title="Generate QR Code"
                              >
                                <QrCode size={12} />
                              </button>
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
        </div>

        {/* Right Click Analytics Panel */}
        <div className={styles.colRight}>
          {selectedUrl ? (
            <Card padding="md" variant="bordered" className={styles.analyticsSidebarCard}>
              <div className={styles.sidebarAnalyticsHeader}>
                <BarChart3 size={18} className={styles.goldText} />
                <div>
                  <h3>Link Analytics View</h3>
                  <p>{selectedUrl.shortLink}</p>
                </div>
              </div>

              <CardBody className={styles.sidebarAnalyticsBody}>
                <div className={styles.kpiRowMini}>
                  <div className={styles.kpiMiniBox}>
                    <span>Total Hits</span>
                    <strong>{selectedUrl.clicks.toLocaleString()}</strong>
                  </div>
                  <div className={styles.kpiMiniBox}>
                    <span>Created Date</span>
                    <strong>{selectedUrl.date}</strong>
                  </div>
                </div>

                {/* Destination Preview */}
                <div className={styles.destSnippet}>
                  <span>Destination Long Link:</span>
                  <p>{selectedUrl.longLink}</p>
                  <a href={selectedUrl.longLink} target="_blank" rel="noreferrer" className={styles.visitDestLink}>
                    Visit Destination <ExternalLink size={10} />
                  </a>
                </div>

                {/* Referrers */}
                <div className={styles.analyticsBlock}>
                  <h4>Top Referrers</h4>
                  <div className={styles.progressList}>
                    {Object.entries(selectedUrl.referrers).map(([ref, count]) => {
                      const percentage = selectedUrl.clicks > 0 ? (count / selectedUrl.clicks) * 100 : 0;
                      return (
                        <div key={ref} className={styles.analyticsStatRow}>
                          <div className={styles.statLabelRow}>
                            <span>{ref}</span>
                            <strong>{count}</strong>
                          </div>
                          <div className={styles.barBg}>
                            <div className={styles.barFill} style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Devices */}
                <div className={styles.analyticsBlock}>
                  <h4>Device Distribution</h4>
                  <div className={styles.deviceRowList}>
                    {Object.entries(selectedUrl.devices).map(([dev, count]) => (
                      <div key={dev} className={styles.deviceBoxItem}>
                        {dev === 'Mobile' ? <Smartphone size={16} /> : dev === 'Desktop' ? <Laptop size={16} /> : <Globe size={16} />}
                        <strong>{dev}</strong>
                        <span>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Regions */}
                <div className={styles.analyticsBlock}>
                  <h4>Geographic Yield</h4>
                  <div className={styles.progressList}>
                    {Object.entries(selectedUrl.regions).map(([reg, count]) => {
                      const percentage = selectedUrl.clicks > 0 ? (count / selectedUrl.clicks) * 100 : 0;
                      return (
                        <div key={reg} className={styles.analyticsStatRow}>
                          <div className={styles.statLabelRow}>
                            <span>{reg}</span>
                            <strong>{count}</strong>
                          </div>
                          <div className={styles.barBg}>
                            <div className={styles.barFill} style={{ width: `${percentage}%`, background: 'var(--color-muted-brown)' }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardBody>
            </Card>
          ) : (
            <Card padding="md" variant="bordered">
              <CardBody className={styles.emptyAnalyticsMsg}>
                Select an active shortened redirect link in the directory to inspect UTM visitor sources and demographic devices analytics.
              </CardBody>
            </Card>
          )}
        </div>
      </div>

      {/* QR Code Dialog Modal */}
      {showQrModal && qrUrl && (
        <div className={styles.modalOverlay}>
          <div className={styles.qrModal}>
            <h3>Branded College QR Code</h3>
            <p className={styles.modalDesc}>Scan code below to instantly test redirect link</p>

            <div className={styles.qrContainer}>
              <div className={styles.qrBorderBox}>
                {/* Visual mock representation of QR code with college branding logo */}
                <div className={styles.qrCodeGraphic}>
                  <div className={styles.qrCenterLogo}>C</div>
                  <div className={styles.qrGridPattern}></div>
                </div>
              </div>
              <span className={styles.qrLinkText}>{qrUrl}</span>
            </div>

            <div className={styles.modalFooter}>
              <Button variant="ghost" onClick={() => setShowQrModal(false)}>
                Close Window
              </Button>
              <Button
                variant="gold"
                icon={<QrCode size={14} />}
                onClick={() => notify({ type: 'success', title: 'Downloaded', message: 'Mock SVG/PNG QR asset downloaded successfully.' })}
              >
                Download QR Code
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
