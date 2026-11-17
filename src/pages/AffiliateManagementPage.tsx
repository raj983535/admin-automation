import { useState, useMemo } from 'react';
import { PageContainer } from '../layouts';
import { Card, CardBody, CardHeader, Button, StageChip } from '../components/ui';
import { useNotifications } from '../hooks/useNotifications';
import { useMetricClick } from '../hooks/useMetricClick';
import {
  Users,
  Award,
  DollarSign,
  Search,
  Filter,
  CheckCircle,
  RefreshCw,
  Gift,
  Percent,
} from 'lucide-react';
import styles from './AffiliateManagementPage.module.css';

interface ReferralRecord {
  id: string;
  refereeName: string;
  affiliateName: string;
  affiliateType: 'Alumni' | 'Student' | 'Partner';
  course: string;
  commission: number;
  status: 'paid' | 'pending';
  date: string;
}

interface AffiliatePayout {
  id: string;
  affiliateName: string;
  referralsCount: number;
  pendingAmount: number;
  payoutStatus: 'pending' | 'processing' | 'paid';
}

const INITIAL_REFERRALS: ReferralRecord[] = [
  { id: 'REF-001', refereeName: 'Meera Deshmukh', affiliateName: 'Sanjay Deshmukh', affiliateType: 'Alumni', course: 'B.Tech Biotech', commission: 15000, status: 'pending', date: '2026-05-18' },
  { id: 'REF-002', refereeName: 'Rahul Sen', affiliateName: 'Swati Sen', affiliateType: 'Partner', course: 'MBA Finance', commission: 20000, status: 'pending', date: '2026-05-19' },
  { id: 'REF-003', refereeName: 'Anisha Iyer', affiliateName: 'Aishwarya Iyer', affiliateType: 'Student', course: 'B.Tech CSE', commission: 10000, status: 'paid', date: '2026-05-12' },
  { id: 'REF-004', refereeName: 'Tushar Mehta', affiliateName: 'Rajesh Mehta', affiliateType: 'Alumni', course: 'B.Tech IT', commission: 15000, status: 'paid', date: '2026-05-14' },
  { id: 'REF-005', refereeName: 'Rohit Verma', affiliateName: 'Gaurav Verma', affiliateType: 'Student', course: 'MBA Marketing', commission: 12000, status: 'pending', date: '2026-05-20' },
];

const INITIAL_PAYOUTS: AffiliatePayout[] = [
  { id: 'PAY-881', affiliateName: 'Sanjay Deshmukh', referralsCount: 1, pendingAmount: 15000, payoutStatus: 'pending' },
  { id: 'PAY-882', affiliateName: 'Swati Sen', referralsCount: 1, pendingAmount: 20000, payoutStatus: 'pending' },
  { id: 'PAY-883', affiliateName: 'Gaurav Verma', referralsCount: 1, pendingAmount: 12000, payoutStatus: 'pending' }
];

export function AffiliateManagementPage() {
  const { notify } = useNotifications();
  const metricClick = useMetricClick();

  // State Management
  const [referrals, setReferrals] = useState<ReferralRecord[]>(INITIAL_REFERRALS);
  const [payouts, setPayouts] = useState<AffiliatePayout[]>(INITIAL_PAYOUTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Dynamic Metrics Recalculator
  const metrics = useMemo(() => {
    const totalActive = referrals.length;
    
    const paidSum = referrals
      .filter(r => r.status === 'paid')
      .reduce((sum, r) => sum + r.commission, 0);

    const pendingSum = referrals
      .filter(r => r.status === 'pending')
      .reduce((sum, r) => sum + r.commission, 0);

    // Origin breakdown counts
    const alumniCount = referrals.filter(r => r.affiliateType === 'Alumni').length;
    const studentCount = referrals.filter(r => r.affiliateType === 'Student').length;
    const partnerCount = referrals.filter(r => r.affiliateType === 'Partner').length;

    const alumniShare = totalActive > 0 ? Math.round((alumniCount / totalActive) * 100) : 0;
    const studentShare = totalActive > 0 ? Math.round((studentCount / totalActive) * 100) : 0;
    const partnerShare = totalActive > 0 ? Math.round((partnerCount / totalActive) * 100) : 0;

    return {
      totalActive,
      commissionPaid: paidSum,
      commissionPending: pendingSum,
      alumniShare,
      studentShare,
      partnerShare,
    };
  }, [referrals]);

  // Referral Filter logic
  const filteredReferrals = useMemo(() => {
    return referrals.filter(r => {
      const matchSearch = r.refereeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.affiliateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchStatus = statusFilter === 'all' ? true : r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [referrals, searchQuery, statusFilter]);

  // Payout simulator logic
  const handleProcessPayout = (payoutId: string) => {
    const payoutObj = payouts.find(p => p.id === payoutId);
    if (!payoutObj) return;

    // Trigger process countdown simulation
    setPayouts(prev =>
      prev.map(p => (p.id === payoutId ? { ...p, payoutStatus: 'processing' } : p))
    );

    notify({
      type: 'info',
      title: 'Affiliate Payout Dispatched',
      message: `Executing bank transfer clearance for ${payoutObj.affiliateName} (INR ${payoutObj.pendingAmount.toLocaleString()}).`
    });

    setTimeout(() => {
      // Shifting payout state to paid
      setPayouts(prev =>
        prev.map(p => (p.id === payoutId ? { ...p, payoutStatus: 'paid', pendingAmount: 0 } : p))
      );

      // Mutate matching referrals to paid
      setReferrals(prev =>
        prev.map(r => {
          if (r.affiliateName === payoutObj.affiliateName) {
            return { ...r, status: 'paid' };
          }
          return r;
        })
      );

      notify({
        type: 'success',
        title: 'Payout Disbursed Successfully',
        message: `INR ${payoutObj.pendingAmount.toLocaleString()} credited successfully. Ledger databases synchronized.`,
        duration: 4500
      });
    }, 1800);
  };

  return (
    <PageContainer breadcrumbs={[{ label: 'CRM & Sales' }, { label: 'Affiliate Ledger' }]}>
      
      {/* Header bar controls */}
      <div className={styles.headerBar}>
        <div>
          <h2 className={styles.headerTitle}>Affiliate & Referral Operations</h2>
          <p className={styles.headerSubtitle}>
            Monitor alumni/student referral acquisition ratios, track reward commission allocations, and disburse affiliate payouts.
          </p>
        </div>
      </div>

      {/* KPI Stats overview row */}
      <div className={`${styles.metricsKpiRow} ml-stats-grid`}>
        <button type="button" className={styles.affiliateKpiCard} onClick={() => metricClick('Total Referrals Captured', `${metrics.totalActive} active`)}>
          <div className={styles.kpiUpper}>
            <span>Total Referrals Captured</span>
            <Users size={16} style={{ color: 'var(--color-gold)' }} />
          </div>
          <strong>{metrics.totalActive} Active</strong>
          <span className={styles.kpiSubtext}>Admitted via referral links</span>
        </button>
        <button type="button" className={styles.affiliateKpiCard} onClick={() => metricClick('Commission Settled', `INR ${metrics.commissionPaid.toLocaleString()}`)}>
          <div className={styles.kpiUpper}>
            <span>Commission Settled</span>
            <DollarSign size={16} style={{ color: 'var(--stage-green-text, #15803d)' }} />
          </div>
          <strong>INR {metrics.commissionPaid.toLocaleString()}</strong>
          <span className={styles.kpiSubtext}>Released to date</span>
        </button>
        <button type="button" className={styles.affiliateKpiCard} onClick={() => metricClick('Pending Payouts Balance', `INR ${metrics.commissionPending.toLocaleString()}`)}>
          <div className={styles.kpiUpper}>
            <span>Pending Payouts Balance</span>
            <Award size={16} style={{ color: 'var(--stage-orange-text, #c2410c)' }} />
          </div>
          <strong style={{ color: 'var(--stage-orange-text)' }}>INR {metrics.commissionPending.toLocaleString()}</strong>
          <span className={styles.kpiSubtext}>Awaiting release logs</span>
        </button>
        <button type="button" className={styles.affiliateKpiCard} onClick={() => metricClick('Conversion Yield', '42%')}>
          <div className={styles.kpiUpper}>
            <span>Conversion Yield</span>
            <Percent size={16} style={{ color: 'var(--color-gold)' }} />
          </div>
          <strong>42% Conversion</strong>
          <span className={styles.kpiSubtext}>From clicks to locking seats</span>
        </button>
      </div>

      {/* Main split grid layout */}
      <div className={styles.affiliateSplitGrid}>
        
        {/* Referral Ledger Database Card */}
        <Card className={styles.ledgerCard}>
          <CardHeader
            title="Referral Registry Ledger"
            subtitle="Monitor qualified referees and active commissions."
            action={
              <div className={styles.tableControls}>
                <div className={styles.searchWrapper}>
                  <Search size={12} className={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Search student or referee..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>

                <div className={styles.filterWrapper}>
                  <Filter size={12} className={styles.filterIcon} />
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className={styles.statusSelect}
                  >
                    <option value="all">All Registries</option>
                    <option value="paid">Paid Settlements</option>
                    <option value="pending">Pending Settlements</option>
                  </select>
                </div>
              </div>
            }
          />
          <CardBody className={styles.noPadding}>
            <div className={styles.tableResponsive}>
              <table className={styles.referralTable}>
                <thead>
                  <tr>
                    <th>Ref ID</th>
                    <th>Referee Student</th>
                    <th>Affiliate Sponsor</th>
                    <th>Sponsor Type</th>
                    <th>Academic Degree</th>
                    <th>Commission</th>
                    <th>Settlement</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReferrals.length === 0 ? (
                    <tr>
                      <td colSpan={7} className={styles.emptyTableState}>
                        No referral registries match your query filters.
                      </td>
                    </tr>
                  ) : (
                    filteredReferrals.map(r => (
                      <tr key={r.id}>
                        <td className={styles.monospaceCol}>{r.id}</td>
                        <td style={{ fontWeight: 'bold' }}>{r.refereeName}</td>
                        <td>{r.affiliateName}</td>
                        <td>
                          <span className={`${styles.typeBadge} ${styles[`badge${r.affiliateType}`]}`}>
                            {r.affiliateType}
                          </span>
                        </td>
                        <td>{r.course}</td>
                        <td style={{ fontWeight: 'bold' }}>INR {r.commission.toLocaleString()}</td>
                        <td>
                          <StageChip stage={r.status === 'paid' ? 'green' : 'yellow'} label={r.status.toUpperCase()} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        {/* Sidebar payout dispatcher and Origin breakdown */}
        <div className={styles.sidebarPanel}>
          
          {/* Active payout disbursement dispatcher panel */}
          <Card className={styles.payoutDispatcherCard}>
            <CardHeader title="Commission Disbursements" subtitle="Disburse accumulated credits to active affiliates." />
            <CardBody className={styles.noPadding}>
              <div className={styles.payoutsList}>
                {payouts.filter(p => p.payoutStatus !== 'paid').length === 0 ? (
                  <div className={styles.emptyPayoutState}>
                    <CheckCircle size={30} className={styles.checkIconSuccess} />
                    <span>All referral payouts successfully processed and paid!</span>
                  </div>
                ) : (
                  payouts
                    .filter(p => p.payoutStatus !== 'paid')
                    .map(p => (
                      <div key={p.id} className={styles.payoutItem}>
                        <div className={styles.payoutHeaderRow}>
                          <span className={styles.payoutRef}>{p.id}</span>
                          <strong className={styles.payoutAmt}>INR {p.pendingAmount.toLocaleString()}</strong>
                        </div>
                        <strong className={styles.affiliateTitleName}>{p.affiliateName}</strong>
                        <span className={styles.payoutDetails}>{p.referralsCount} referral conversions mapped</span>
                        
                        <div style={{ marginTop: '8px' }}>
                          <Button
                            variant="gold"
                            size="sm"
                            disabled={p.payoutStatus === 'processing'}
                            onClick={() => handleProcessPayout(p.id)}
                            style={{ width: '100%' }}
                          >
                            {p.payoutStatus === 'processing' ? (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                <RefreshCw size={12} className={styles.spinner} />
                                <span>Verifying Account...</span>
                              </div>
                            ) : (
                              <span>Process Commission Payout</span>
                            )}
                          </Button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardBody>
          </Card>

          {/* Lead Origin Breakdown representation */}
          <Card className={styles.breakdownCard}>
            <CardHeader title="Sponsorship Origin Share" subtitle="Distribution percentage yield by referral channels." />
            <CardBody>
              <div className={styles.originDistributionList}>
                <div className={styles.originItem}>
                  <div className={styles.originHeader}>
                    <span>Alumni Sponsorships</span>
                    <strong>{metrics.alumniShare}%</strong>
                  </div>
                  <div className={styles.barBackground}>
                    <div className={styles.barFill} style={{ width: `${metrics.alumniShare}%`, background: 'var(--color-gold)' }}></div>
                  </div>
                </div>

                <div className={styles.originItem}>
                  <div className={styles.originHeader}>
                    <span>Active Student Referrals</span>
                    <strong>{metrics.studentShare}%</strong>
                  </div>
                  <div className={styles.barBackground}>
                    <div className={styles.barFill} style={{ width: `${metrics.studentShare}%`, background: 'var(--stage-blue-text, #1e40af)' }}></div>
                  </div>
                </div>

                <div className={styles.originItem}>
                  <div className={styles.originHeader}>
                    <span>Corporate & Agency Partners</span>
                    <strong>{metrics.partnerShare}%</strong>
                  </div>
                  <div className={styles.barBackground}>
                    <div className={styles.barFill} style={{ width: `${metrics.partnerShare}%`, background: 'var(--stage-purple-text, #6b21a8)' }}></div>
                  </div>
                </div>
              </div>

              <div className={styles.breakdownSummaryFooter}>
                <Gift size={16} className={styles.giftIcon} />
                <span>Alumni networks drive over 40% of qualified warm inbound referrals.</span>
              </div>
            </CardBody>
          </Card>

        </div>

      </div>

    </PageContainer>
  );
}
