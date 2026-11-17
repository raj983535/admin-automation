import { useState, useMemo } from 'react';
import { PageContainer } from '../layouts';
import { Card, CardBody, CardHeader, Button, StageChip } from '../components/ui';
import { useNotifications } from '../hooks/useNotifications';
import { useMetricClick } from '../hooks/useMetricClick';
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  ArrowUpRight,
  Clock,
} from 'lucide-react';
import styles from './FinanceManagementPage.module.css';

interface Invoice {
  id: string;
  studentName: string;
  course: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'failed' | 'refunded';
}

interface RefundRequest {
  id: string;
  studentName: string;
  course: string;
  reason: string;
  amount: number;
  requestedDate: string;
  status: 'pending' | 'approved' | 'denied';
}

const INITIAL_INVOICES: Invoice[] = [
  { id: 'INV-2026-001', studentName: 'Priya Pillai', course: 'B.Tech CSE', amount: 85000, dueDate: '2026-05-18', status: 'paid' },
  { id: 'INV-2026-002', studentName: 'Kabir Malhotra', course: 'MBA Finance', amount: 120000, dueDate: '2026-06-01', status: 'pending' },
  { id: 'INV-2026-003', studentName: 'Ananya Iyer', course: 'B.Tech CSE', amount: 85000, dueDate: '2026-05-24', status: 'pending' },
  { id: 'INV-2026-004', studentName: 'Kabir Malhotra', course: 'MBA Marketing', amount: 95000, dueDate: '2026-05-12', status: 'overdue' },
  { id: 'INV-2026-005', studentName: 'Arjun Singhal', course: 'B.Tech IT', amount: 80000, dueDate: '2026-05-15', status: 'failed' },
  { id: 'INV-2026-006', studentName: 'Kabir Malhotra', course: 'B.Tech Biotech', amount: 90000, dueDate: '2026-04-10', status: 'refunded' },
  { id: 'INV-2026-007', studentName: 'Ananya Iyer', course: 'B.Tech Biotechnology', amount: 90000, dueDate: '2026-05-23', status: 'paid' },
  { id: 'INV-2026-008', studentName: 'Rohan Verma', course: 'MBA Finance', amount: 120000, dueDate: '2026-05-28', status: 'paid' },
  { id: 'INV-2026-009', studentName: 'Sahil Sharma', course: 'B.Tech CSE', amount: 85000, dueDate: '2026-06-05', status: 'pending' },
  { id: 'INV-2026-010', studentName: 'Sneha Rao', course: 'MBA Marketing', amount: 95000, dueDate: '2026-05-08', status: 'overdue' },
];

const INITIAL_REFUNDS: RefundRequest[] = [
  { id: 'REF-8801', studentName: 'Sahil Sharma', course: 'B.Tech CSE', reason: 'Decided to opt for dual-degree program in USA.', amount: 45000, requestedDate: '2026-05-19', status: 'pending' },
  { id: 'REF-8802', studentName: 'Sneha Rao', course: 'MBA Finance', reason: 'Medical emergency health leave of absence.', amount: 60000, requestedDate: '2026-05-20', status: 'pending' },
  { id: 'REF-8803', studentName: 'Karan Johar', course: 'B.Tech IT', reason: 'Requested hostel allocation waiver after paying fee package.', amount: 15000, requestedDate: '2026-05-21', status: 'pending' },
  { id: 'REF-8804', studentName: 'Priya Pillai', course: 'B.Tech CSE', reason: 'Branch transfer to B.Tech Biotech approved by academic council.', amount: 32000, requestedDate: '2026-05-25', status: 'pending' },
  { id: 'REF-8805', studentName: 'Arjun Singhal', course: 'B.Tech IT', reason: 'Duplicate semester fee payment via UPI and card on same day.', amount: 80000, requestedDate: '2026-05-27', status: 'pending' },
];

export function FinanceManagementPage() {
  const { notify } = useNotifications();
  const metricClick = useMetricClick();

  // State Management
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [refunds, setRefunds] = useState<RefundRequest[]>(INITIAL_REFUNDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  // Dynamic Metrics Recalculator based on invoice changes and refund approvals
  const metrics = useMemo(() => {
    const paidSum = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.amount, 0);
    
    const pendingSum = invoices
      .filter(inv => inv.status === 'pending')
      .reduce((sum, inv) => sum + inv.amount, 0);

    const overdueSum = invoices
      .filter(inv => inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.amount, 0);

    const refundedSum = invoices
      .filter(inv => inv.status === 'refunded')
      .reduce((sum, inv) => sum + inv.amount, 0);

    return {
      collectedFees: paidSum,
      pendingFees: pendingSum,
      overdueFees: overdueSum,
      refundedCapital: refundedSum,
    };
  }, [invoices]);

  // Invoice Filter logic
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchSearch = inv.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inv.course.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchStatus = statusFilter === 'all' ? true : inv.status === statusFilter;
      
      return matchSearch && matchStatus;
    });
  }, [invoices, searchQuery, statusFilter]);

  const selectedInvoice = useMemo(() => {
    return invoices.find(inv => inv.id === selectedInvoiceId) || null;
  }, [invoices, selectedInvoiceId]);

  // Approve Refund workflow
  const handleApproveRefund = (refundId: string) => {
    const refundToApprove = refunds.find(r => r.id === refundId);
    if (!refundToApprove) return;

    // Update refunds state
    setRefunds(prev =>
      prev.map(r => (r.id === refundId ? { ...r, status: 'approved' } : r))
    );

    // Dynamic ledger action: Add a refunded invoice, or shift matching student to refunded
    const matchingInvoice = invoices.find(inv => inv.studentName === refundToApprove.studentName);
    
    if (matchingInvoice) {
      setInvoices(prev =>
        prev.map(inv => {
          if (inv.studentName === refundToApprove.studentName) {
            return { ...inv, status: 'refunded' };
          }
          return inv;
        })
      );
    } else {
      // Ingest a refunded entry
      const simulatedInvoice: Invoice = {
        id: `INV-RF-${Date.now().toString().slice(-4)}`,
        studentName: refundToApprove.studentName,
        course: refundToApprove.course,
        amount: refundToApprove.amount,
        dueDate: 'Refund Reconciled',
        status: 'refunded'
      };
      setInvoices(prev => [...prev, simulatedInvoice]);
    }

    notify({
      type: 'success',
      title: 'Refund Approved',
      message: `Ledger recalculated. INR ${refundToApprove.amount.toLocaleString()} marked for refund release to ${refundToApprove.studentName}.`,
      duration: 4000
    });
  };

  // Deny Refund workflow
  const handleDenyRefund = (refundId: string) => {
    const refundToDeny = refunds.find(r => r.id === refundId);
    if (!refundToDeny) return;

    setRefunds(prev =>
      prev.map(r => (r.id === refundId ? { ...r, status: 'denied' } : r))
    );

    notify({
      type: 'info',
      title: 'Refund Request Rejected',
      message: `Claim for ${refundToDeny.studentName} has been routed to board oversight review.`,
      duration: 3500
    });
  };

  const getStatusChipColor = (status: Invoice['status']): 'blue' | 'purple' | 'orange' | 'yellow' | 'green' | 'gray' => {
    switch (status) {
      case 'paid': return 'green';
      case 'pending': return 'yellow';
      case 'overdue': return 'orange';
      case 'failed': return 'orange';
      case 'refunded': return 'gray';
    }
  };

  return (
    <PageContainer breadcrumbs={[{ label: 'CRM & Sales' }, { label: 'Revenue Operations Cockpit' }]}>
      
      {/* Header operations bar */}
      <div className={styles.headerBar}>
        <div>
          <h2 className={styles.headerTitle}>Finance & Revenue Operations</h2>
          <p className={styles.headerSubtitle}>
            Track captured fee structures, monitor transaction ledger statuses, and approve student tuition refunds in real-time.
          </p>
        </div>
      </div>

      {/* Dynamic revenue operations card indicators */}
      <div className={`${styles.kpiGrid} ml-stats-grid`}>
        <button
          type="button"
          className={styles.financeKpiCard}
          onClick={() => metricClick('Collected Tuition Fees', `INR ${metrics.collectedFees.toLocaleString()}`)}
        >
          <div className={styles.kpiHeaderIconRow}>
            <span>Collected Tuition Fees</span>
            <div className={styles.iconCircle} style={{ background: 'var(--stage-green-text, #15803d)' }}>
              <DollarSign size={14} color="white" />
            </div>
          </div>
          <strong>INR {metrics.collectedFees.toLocaleString()}</strong>
          <span className={styles.trendRow}>
            <TrendingUp size={10} style={{ color: 'var(--stage-green-text)' }} />
            <span style={{ color: 'var(--stage-green-text)', fontSize: '10px' }}>Active ledger locked</span>
          </span>
        </button>

        <button
          type="button"
          className={styles.financeKpiCard}
          onClick={() => metricClick('Pending Receivables', `INR ${metrics.pendingFees.toLocaleString()}`)}
        >
          <div className={styles.kpiHeaderIconRow}>
            <span>Pending Receivables</span>
            <div className={styles.iconCircle} style={{ background: 'var(--stage-yellow-text, #a16207)' }}>
              <Clock size={14} color="white" />
            </div>
          </div>
          <strong>INR {metrics.pendingFees.toLocaleString()}</strong>
          <span className={styles.trendRow}>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}>Unresolved academic cohorts</span>
          </span>
        </button>

        <button
          type="button"
          className={styles.financeKpiCard}
          onClick={() => metricClick('Overdue Balance', `INR ${metrics.overdueFees.toLocaleString()}`)}
        >
          <div className={styles.kpiHeaderIconRow}>
            <span>Overdue Balance</span>
            <div className={styles.iconCircle} style={{ background: 'var(--stage-orange-text, #c2410c)' }}>
              <AlertTriangle size={14} color="white" />
            </div>
          </div>
          <strong style={{ color: 'var(--stage-orange-text)' }}>INR {metrics.overdueFees.toLocaleString()}</strong>
          <span className={styles.trendRow}>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}>Reminders dispatched</span>
          </span>
        </button>

        <button
          type="button"
          className={styles.financeKpiCard}
          onClick={() => metricClick('Refunded Capital', `INR ${metrics.refundedCapital.toLocaleString()}`)}
        >
          <div className={styles.kpiHeaderIconRow}>
            <span>Refunded Capital</span>
            <div className={styles.iconCircle} style={{ background: 'var(--color-text-muted, #737373)' }}>
              <RotateCcw size={14} color="white" />
            </div>
          </div>
          <strong>INR {metrics.refundedCapital.toLocaleString()}</strong>
          <span className={styles.trendRow}>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}>Reconciled reserves</span>
          </span>
        </button>
      </div>

      {/* Grid containing invoice table and refund operations panel */}
      <div className={styles.financeSplitGrid}>
        
        {/* Main invoice table card */}
        <Card className={styles.invoicesCard}>
          <CardHeader
            title="Transaction & Invoicing Ledger"
            subtitle="Search queries and filter statuses of seat bookings."
            action={
              <div className={styles.tableControls}>
                <div className={styles.searchWrapper}>
                  <Search size={12} className={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Search student or invoice..."
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
                    <option value="all">All Invoices</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>
            }
          />
          <CardBody className={styles.noPadding}>
            <div className={styles.tableContainer}>
              <table className={styles.invoiceTable}>
                <thead>
                  <tr>
                    <th>Invoice ID</th>
                    <th>Candidate</th>
                    <th>Degree Cohort</th>
                    <th>Total Package</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={6} className={styles.emptyTableState}>
                        No ledger logs match your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map(inv => (
                      <tr 
                        key={inv.id} 
                        onClick={() => setSelectedInvoiceId(inv.id)}
                        className={`${styles.invoiceRow} ${selectedInvoiceId === inv.id ? styles.rowActiveSelection : ''}`}
                      >
                        <td className={styles.idCol}>{inv.id}</td>
                        <td className={styles.nameCol}>{inv.studentName}</td>
                        <td>{inv.course}</td>
                        <td style={{ fontWeight: 'bold' }}>INR {inv.amount.toLocaleString()}</td>
                        <td>{inv.dueDate}</td>
                        <td>
                          <StageChip stage={getStatusChipColor(inv.status)} label={inv.status.toUpperCase()} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        {/* Sidebar containing refund checklists and detail drawer */}
        <div className={styles.sidebarSection}>
          
          {/* Active Refund Approvals checklist panel */}
          <Card className={styles.refundsWorkflowCard}>
            <CardHeader
              title="Tuition Refund Approvals Console"
              subtitle="Verify withdrawal applications and dispatch returns."
            />
            <CardBody className={styles.noPadding}>
              <div className={styles.refundsList}>
                {refunds.filter(r => r.status === 'pending').length === 0 ? (
                  <div className={styles.emptyRefundState}>
                    <CheckCircle size={28} className={styles.checkIconSuccess} />
                    <span>All student tuition refund requests reconciled!</span>
                  </div>
                ) : (
                  refunds
                    .filter(r => r.status === 'pending')
                    .map(r => (
                      <div key={r.id} className={styles.refundRequestItem}>
                        <div className={styles.refundMetaHeader}>
                          <span className={styles.refundId}>{r.id}</span>
                          <span className={styles.refundDate}>{r.requestedDate}</span>
                        </div>
                        <strong className={styles.studentName}>{r.studentName}</strong>
                        <span className={styles.studentCourse}>{r.course}</span>
                        <p className={styles.refundReason}>"{r.reason}"</p>
                        
                        <div className={styles.refundAmountLine}>
                          <span>Claim Value:</span>
                          <strong>INR {r.amount.toLocaleString()}</strong>
                        </div>

                        <div className={styles.refundActionsRow}>
                          <button type="button"
                            onClick={() => handleDenyRefund(r.id)}
                            className={styles.refundDenyBtn}
                          >
                            <XCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                            Reject
                          </button>
                          <button type="button"
                            onClick={() => handleApproveRefund(r.id)}
                            className={styles.refundApproveBtn}
                          >
                            <CheckCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                            Approve Release
                          </button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardBody>
          </Card>

          {/* Dynamic Row Detail Dossier box */}
          {selectedInvoice && (
            <Card className={styles.invoiceDetailsPanel}>
              <CardHeader
                title="Receipt Breakdown"
                action={
                  <button type="button" onClick={() => setSelectedInvoiceId(null)} className={styles.detailCloseBtn}>×</button>
                }
              />
              <CardBody>
                <div className={styles.receiptBody}>
                  <div className={styles.receiptLine}>
                    <span>Student Ledger:</span>
                    <strong>{selectedInvoice.studentName}</strong>
                  </div>
                  <div className={styles.receiptLine}>
                    <span>Degree Class:</span>
                    <strong>{selectedInvoice.course}</strong>
                  </div>
                  <div className={styles.receiptLine}>
                    <span>Invoice Ref:</span>
                    <span>{selectedInvoice.id}</span>
                  </div>
                  <div className={styles.receiptLine}>
                    <span>Due Date Limit:</span>
                    <span>{selectedInvoice.dueDate}</span>
                  </div>
                  <hr className={styles.receiptDivider} />
                  <div className={styles.receiptLine} style={{ fontSize: '13px', color: 'var(--color-brown-dark)', fontWeight: 'bold' }}>
                    <span>Tuition Fee Package:</span>
                    <span>INR {selectedInvoice.amount.toLocaleString()}</span>
                  </div>
                  <div className={styles.receiptLine} style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                    <span>Assigned Tax (GST 18%):</span>
                    <span>Included</span>
                  </div>
                  <div className={styles.receiptStatusRow}>
                    <span>Ledger Status:</span>
                    <StageChip stage={getStatusChipColor(selectedInvoice.status)} label={selectedInvoice.status.toUpperCase()} />
                  </div>
                  <div className={styles.actionsRow} style={{ marginTop: '12px' }}>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      icon={<ArrowUpRight size={13} />}
                      onClick={() => notify({ type: 'success', title: 'Receipt Printed', message: `Dispatched receipt copy to ${selectedInvoice.studentName}'s portal inbox.` })}
                      style={{ width: '100%' }}
                    >
                      Print Official Receipt
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

        </div>

      </div>

    </PageContainer>
  );
}
