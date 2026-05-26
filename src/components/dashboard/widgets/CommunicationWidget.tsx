import { Card, CardBody, CardHeader } from '../../ui';
import { communicationStats } from '../../../data/mock/dashboard';
import styles from './Widgets.module.css';

export function CommunicationWidget() {
  const { whatsappSent, whatsappRead, emailSent, smsSent, responseRate } =
    communicationStats;
  return (
    <Card padding="md" variant="default">
      <CardHeader
        title="Communication"
        subtitle="WhatsApp, email, and SMS volume (demo)"
      />
      <CardBody>
        <div className={styles.statGrid}>
          <div className={styles.statBox}>
            <p className={styles.statValue}>{whatsappSent.toLocaleString()}</p>
            <p className={styles.statLabel}>WhatsApp sent</p>
          </div>
          <div className={styles.statBox}>
            <p className={styles.statValue}>{whatsappRead.toLocaleString()}</p>
            <p className={styles.statLabel}>Read receipts</p>
          </div>
          <div className={styles.statBox}>
            <p className={styles.statValue}>{emailSent.toLocaleString()}</p>
            <p className={styles.statLabel}>Emails sent</p>
          </div>
          <div className={styles.statBox}>
            <p className={styles.statValue}>{smsSent.toLocaleString()}</p>
            <p className={styles.statLabel}>SMS sent</p>
          </div>
        </div>
        <p className={styles.responseRate}>
          <strong>{responseRate}%</strong> avg. response rate across channels
        </p>
      </CardBody>
    </Card>
  );
}
