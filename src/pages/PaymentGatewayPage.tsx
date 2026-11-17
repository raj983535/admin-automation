import { useState, useMemo } from 'react';
import { PageContainer } from '../layouts';
import { Card, CardBody, CardHeader, Button, StageChip } from '../components/ui';
import { useNotifications } from '../hooks/useNotifications';
import { useMetricClick } from '../hooks/useMetricClick';
import {
  CreditCard,
  QrCode,
  Wallet,
  Activity,
  AlertTriangle,
  RefreshCw,
  Search,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import styles from './PaymentGatewayPage.module.css';

interface Transaction {
  id: string;
  studentName: string;
  amount: number;
  method: 'UPI' | 'Card' | 'Wallet';
  timestamp: string;
  status: 'success' | 'pending' | 'failed';
  referenceNo: string;
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 'TXN-99801', studentName: 'Ananya Iyer', amount: 85000, method: 'Card', timestamp: '2026-05-21 10:14 AM', status: 'success', referenceNo: 'REF-CARD-8891' },
  { id: 'TXN-99802', studentName: 'Meera Deshmukh', amount: 90000, method: 'UPI', timestamp: '2026-05-21 11:30 AM', status: 'success', referenceNo: 'REF-UPI-2311' },
  { id: 'TXN-99803', studentName: 'Rohan Verma', amount: 120000, method: 'Card', timestamp: '2026-05-21 12:45 PM', status: 'pending', referenceNo: 'REF-CARD-5524' },
  { id: 'TXN-99804', studentName: 'Arjun Singhal', amount: 80000, method: 'UPI', timestamp: '2026-05-20 03:15 PM', status: 'failed', referenceNo: 'REF-UPI-1090' },
  { id: 'TXN-99805', studentName: 'Kabir Malhotra', amount: 95000, method: 'Wallet', timestamp: '2026-05-20 04:40 PM', status: 'success', referenceNo: 'REF-WLT-3304' },
  { id: 'TXN-99806', studentName: 'Sahil Sharma', amount: 85000, method: 'UPI', timestamp: '2026-05-20 05:12 PM', status: 'success', referenceNo: 'REF-UPI-4418' },
  { id: 'TXN-99807', studentName: 'Priya Pillai', amount: 85000, method: 'Card', timestamp: '2026-05-19 09:30 AM', status: 'pending', referenceNo: 'REF-CARD-7762' },
  { id: 'TXN-99808', studentName: 'Sneha Rao', amount: 95000, method: 'Wallet', timestamp: '2026-05-19 02:50 PM', status: 'failed', referenceNo: 'REF-WLT-5501' },
];

export function PaymentGatewayPage() {
  const { notify } = useNotifications();
  const metricClick = useMetricClick();

  // State Management
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'Card' | 'Wallet'>('UPI');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Checkout Simulator Form Inputs
  const [checkoutStudent, setCheckoutStudent] = useState('');
  const [checkoutAmount, setCheckoutAmount] = useState('45000');
  const [checkoutCardName, setCheckoutCardName] = useState('');
  const [checkoutCardNum, setCheckoutCardNum] = useState('');
  const [checkoutUpiId, setCheckoutUpiId] = useState('student@okaxis');
  
  // Sandbox Control States
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReconciling, setIsReconciling] = useState(false);
  const [sandboxFailureTrigger, setSandboxFailureTrigger] = useState(false);

  // Dynamic metrics of payment volumes
  const volumes = useMemo(() => {
    let upi = 0;
    let card = 0;
    let wallet = 0;
    let failedCount = 0;

    transactions.forEach(t => {
      if (t.status === 'success') {
        if (t.method === 'UPI') upi += t.amount;
        if (t.method === 'Card') card += t.amount;
        if (t.method === 'Wallet') wallet += t.amount;
      } else if (t.status === 'failed') {
        failedCount += 1;
      }
    });

    const totalVolume = upi + card + wallet;
    return { upi, card, wallet, totalVolume, failedCount };
  }, [transactions]);

  // Filter transaction log ledger
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const query = searchQuery.toLowerCase();
      return (
        t.studentName.toLowerCase().includes(query) ||
        t.id.toLowerCase().includes(query) ||
        t.referenceNo.toLowerCase().includes(query)
      );
    });
  }, [transactions, searchQuery]);

  // Execute Mock checkout transaction
  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutStudent.trim() || !checkoutAmount) {
      notify({ type: 'error', title: 'Details Incomplete', message: 'Candidate name and tuition fees are required.' });
      return;
    }

    setIsProcessing(true);
    notify({
      type: 'info',
      title: 'Connecting Gateway Channel',
      message: 'Processing sandbox payload. Awaiting routing server token...'
    });

    setTimeout(() => {
      setIsProcessing(false);
      const isFailed = sandboxFailureTrigger;
      
      const newTxn: Transaction = {
        id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
        studentName: checkoutStudent.trim(),
        amount: parseFloat(checkoutAmount),
        method: paymentMode,
        timestamp: 'Just Now',
        status: isFailed ? 'failed' : 'success',
        referenceNo: `REF-${paymentMode.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
      };

      setTransactions(prev => [newTxn, ...prev]);

      if (isFailed) {
        notify({
          type: 'error',
          title: 'Transaction Failed',
          message: `Gateway returned code 502: Insufficient balance or invalid verification code.`,
          duration: 4500
        });
      } else {
        notify({
          type: 'success',
          title: 'Tuition Payment Received',
          message: `INR ${newTxn.amount.toLocaleString()} reconciled for ${newTxn.studentName} via ${paymentMode}.`,
          duration: 4500
        });
      }

      // Reset form
      setCheckoutStudent('');
      setCheckoutCardName('');
      setCheckoutCardNum('');
    }, 1800);
  };

  // Reconcile records Station
  const handleReconcileGateway = () => {
    setIsReconciling(true);
    notify({
      type: 'info',
      title: 'Gateway Reconciliation Initiated',
      message: 'Comparing live payment ledger transactions with external PG statement records...'
    });

    setTimeout(() => {
      setIsReconciling(false);

      // Mutate pending and failed records to success to show complete functional action resolution
      setTransactions(prev =>
        prev.map(t => {
          if (t.status === 'pending') {
            return { ...t, status: 'success', timestamp: `${t.timestamp} (Reconciled)` };
          }
          if (t.status === 'failed') {
            return { ...t, status: 'success', timestamp: `${t.timestamp} (Settled)` };
          }
          return t;
        })
      );

      notify({
        type: 'success',
        title: 'Reconciliation Completed',
        message: 'All discrepant accounts resolved. Bank transfers cleared and pending tuition updated.',
        duration: 5000
      });
    }, 2000);
  };

  return (
    <PageContainer breadcrumbs={[{ label: 'CRM & Sales' }, { label: 'Payment Gateway Integration' }]}>
      
      {/* Upper header segment */}
      <div className={styles.headerBar}>
        <div>
          <h2 className={styles.headerTitle}>Tuition Payment Gateway Control</h2>
          <p className={styles.headerSubtitle}>
            Monitor active merchant volumes, simulate mock student checkout pipelines in UPI/Card, and execute ledger database reconciliation.
          </p>
        </div>
      </div>

      {/* Gateway volumes stats grid */}
      <div className={`${styles.metricsGrid} ml-stats-grid`}>
        <button
          type="button"
          className={styles.volumeCard}
          onClick={() => metricClick('Total Collected Volume', `INR ${volumes.totalVolume.toLocaleString()}`)}
        >
          <div className={styles.cardHeaderRow}>
            <span>Total Collected Volume</span>
            <Activity size={15} style={{ color: 'var(--color-gold)' }} />
          </div>
          <strong>INR {volumes.totalVolume.toLocaleString()}</strong>
          <span className={styles.subtext}>Across active merchant routes</span>
        </button>

        <button
          type="button"
          className={styles.volumeCard}
          onClick={() => metricClick('UPI Scanning Channel', `INR ${volumes.upi.toLocaleString()}`)}
        >
          <div className={styles.cardHeaderRow}>
            <span>UPI Scanning Channel</span>
            <QrCode size={15} style={{ color: 'var(--stage-green-text, #15803d)' }} />
          </div>
          <strong>INR {volumes.upi.toLocaleString()}</strong>
          <span className={styles.subtext}>
            {volumes.totalVolume > 0 ? Math.round((volumes.upi / volumes.totalVolume) * 100) : 0}% share ratio
          </span>
        </button>

        <button
          type="button"
          className={styles.volumeCard}
          onClick={() => metricClick('Credit / Debit Card Volume', `INR ${volumes.card.toLocaleString()}`)}
        >
          <div className={styles.cardHeaderRow}>
            <span>Credit / Debit Card Volume</span>
            <CreditCard size={15} style={{ color: 'var(--stage-blue-text, #1e40af)' }} />
          </div>
          <strong>INR {volumes.card.toLocaleString()}</strong>
          <span className={styles.subtext}>
            {volumes.totalVolume > 0 ? Math.round((volumes.card / volumes.totalVolume) * 100) : 0}% share ratio
          </span>
        </button>

        <button
          type="button"
          className={styles.volumeCard}
          onClick={() => metricClick('Failed Ratios', `${volumes.failedCount} refused`)}
        >
          <div className={styles.cardHeaderRow}>
            <span>Failed Ratios</span>
            <AlertTriangle size={15} style={{ color: 'var(--stage-orange-text, #c2410c)' }} />
          </div>
          <strong style={{ color: 'var(--stage-orange-text)' }}>{volumes.failedCount} Refused</strong>
          <span className={styles.subtext}>Auto-reconciliations queued</span>
        </button>
      </div>

      {/* Main payment content grid split */}
      <div className={styles.gatewaySplitGrid}>
        
        {/* Interactive Payment Checkout Sandbox */}
        <Card className={styles.checkoutSimulatorCard}>
          <CardHeader
            title="Sandbox Tuition Checkout Simulator"
            subtitle="Simulate full candidate invoicing payments using our sandbox routing system."
          />
          <CardBody>
            <form onSubmit={handleSimulatePayment} className={styles.checkoutForm}>
              
              {/* Payment Mode Toggles */}
              <div className={styles.methodSelector}>
                <button
                  type="button"
                  onClick={() => setPaymentMode('UPI')}
                  className={`${styles.methodBtn} ${paymentMode === 'UPI' ? styles.methodActive : ''}`}
                >
                  <QrCode size={14} />
                  <span>UPI Scan QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode('Card')}
                  className={`${styles.methodBtn} ${paymentMode === 'Card' ? styles.methodActive : ''}`}
                >
                  <CreditCard size={14} />
                  <span>Card Swipe</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode('Wallet')}
                  className={`${styles.methodBtn} ${paymentMode === 'Wallet' ? styles.methodActive : ''}`}
                >
                  <Wallet size={14} />
                  <span>E-Wallet</span>
                </button>
              </div>

              {/* General Form Fields */}
              <div className={styles.formInputsBody}>
                <label className={styles.formLabel}>
                  <span>Student Candidate Name</span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sahil Sharma"
                    value={checkoutStudent}
                    onChange={e => setCheckoutStudent(e.target.value)}
                    className={styles.formInput}
                  />
                </label>

                <label className={styles.formLabel}>
                  <span>Amount to Deposit (INR)</span>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 45000"
                    value={checkoutAmount}
                    onChange={e => setCheckoutAmount(e.target.value)}
                    className={styles.formInput}
                  />
                </label>

                {/* Specific details depending on chosen mode */}
                {paymentMode === 'Card' && (
                  <div className={styles.cardFieldsWrapper}>
                    <label className={styles.formLabel}>
                      <span>Cardholder Full Name</span>
                      <input
                        type="text"
                        placeholder="Sahil Sharma"
                        value={checkoutCardName}
                        onChange={e => setCheckoutCardName(e.target.value)}
                        className={styles.formInput}
                      />
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-2)' }}>
                      <label className={styles.formLabel}>
                        <span>Simulated Card Number</span>
                        <input
                          type="text"
                          placeholder="4111 2222 3333 4444"
                          value={checkoutCardNum}
                          onChange={e => setCheckoutCardNum(e.target.value)}
                          className={styles.formInput}
                        />
                      </label>
                      <label className={styles.formLabel}>
                        <span>CVV Code</span>
                        <input type="password" maxLength={3} placeholder="•••" className={styles.formInput} />
                      </label>
                    </div>
                  </div>
                )}

                {paymentMode === 'UPI' && (
                  <div className={styles.upiQRWrapper}>
                    <div className={styles.mockQRCodeBox}>
                      <QrCode size={110} style={{ color: 'var(--color-brown-dark)' }} />
                      <span style={{ fontSize: '9px', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginTop: '6px' }}>
                        Merchant: College Admission QR
                      </span>
                    </div>
                    <label className={styles.formLabel} style={{ width: '100%' }}>
                      <span>Virtual Payment Address (VPA)</span>
                      <input
                        type="text"
                        placeholder="student@okaxis"
                        value={checkoutUpiId}
                        onChange={e => setCheckoutUpiId(e.target.value)}
                        className={styles.formInput}
                      />
                    </label>
                  </div>
                )}

                {paymentMode === 'Wallet' && (
                  <div className={styles.walletDetailsWrapper}>
                    <div className={styles.walletDisplayBadge}>
                      <Smartphone size={28} style={{ color: 'var(--color-gold)' }} />
                      <div>
                        <strong>Tuition Paytm / PhonePe Route</strong>
                        <p style={{ margin: 0, fontSize: '10px', color: 'var(--color-text-secondary)' }}>
                          Simulate checkout via immediate SMS OTP authorization.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sandbox controls & authorization button */}
              <div className={styles.sandboxTriggerBlock}>
                <label className={styles.sandboxCheckboxLabel}>
                  <input
                    type="checkbox"
                    checked={sandboxFailureTrigger}
                    onChange={e => setSandboxFailureTrigger(e.target.checked)}
                    className={styles.sandboxCheckbox}
                  />
                  <span className={styles.checkboxLabelText}>
                    Simulate Payment Timeout / Failure state
                  </span>
                </label>
              </div>

              <Button
                variant="gold"
                type="submit"
                disabled={isProcessing}
                style={{ width: '100%', marginTop: 'var(--space-2)' }}
              >
                {isProcessing ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <RefreshCw size={14} className={styles.spinner} />
                    <span>Authorizing Sandbox Route...</span>
                  </div>
                ) : (
                  <span>Authorize Sandbox tuition Deposit</span>
                )}
              </Button>

            </form>
          </CardBody>
        </Card>

        {/* Sidebar container with Reconciliation station and active transaction log */}
        <div className={styles.sidebarPanel}>
          
          {/* Gateway Reconciliation Station card */}
          <Card className={styles.reconciliationCard}>
            <CardHeader
              title="PG Reconciliation Station"
              subtitle="Clear merchant settlement gaps and auto-resolve pending transaction ledger states."
            />
            <CardBody>
              <div className={styles.reconcileBoxContent}>
                <div className={styles.securityHeader}>
                  <ShieldCheck size={28} className={styles.shieldIcon} />
                  <div>
                    <strong>Dual-Factor Security Locked</strong>
                    <p style={{ margin: 0, fontSize: '10px', color: 'var(--color-text-secondary)' }}>
                      Reconciliation matches bank ledger statements against admissions database.
                    </p>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  disabled={isReconciling}
                  onClick={handleReconcileGateway}
                  style={{ width: '100%', borderStyle: 'dashed' }}
                >
                  {isReconciling ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <RefreshCw size={13} className={styles.spinner} />
                      <span>Scanning Database Ledgers...</span>
                    </div>
                  ) : (
                    <span>Reconcile Gateway Records</span>
                  )}
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Transaction Ledger Card */}
          <Card className={styles.ledgerLogsCard}>
            <CardHeader
              title="Merchant Transaction Logs"
              subtitle="Search logs below."
              action={
                <div className={styles.ledgerSearchWrapper}>
                  <Search size={11} className={styles.searchIconMini} />
                  <input
                    type="text"
                    placeholder="Filter logs..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className={styles.ledgerSearchInput}
                  />
                </div>
              }
            />
            <CardBody className={styles.noPadding}>
              <div className={styles.ledgerListContainer}>
                {filteredTransactions.length === 0 ? (
                  <div className={styles.emptyLedgerState}>
                    <span>No matching transactions.</span>
                  </div>
                ) : (
                  filteredTransactions.map(t => (
                    <div key={t.id} className={styles.ledgerItem}>
                      <div className={styles.ledgerUpperRow}>
                        <strong className={styles.leadName}>{t.studentName}</strong>
                        <span className={styles.leadAmount}>INR {t.amount.toLocaleString()}</span>
                      </div>
                      
                      <div className={styles.ledgerMiddleRow}>
                        <span>{t.id} • {t.method}</span>
                        <span className={styles.leadRef}>Ref: {t.referenceNo}</span>
                      </div>
                      
                      <div className={styles.ledgerLowerRow}>
                        <span className={styles.leadTime}>{t.timestamp}</span>
                        <StageChip 
                          stage={t.status === 'success' ? 'green' : t.status === 'pending' ? 'yellow' : 'orange'} 
                          label={t.status.toUpperCase()} 
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardBody>
          </Card>

        </div>

      </div>

    </PageContainer>
  );
}
