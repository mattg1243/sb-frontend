import { Typography } from 'antd';
import styles from './FAQ.module.css';
import balloonLogo from '../../../assets/orangelogo.png';
import Navbar from '../../Navbar';

export default function FAQ() {
  const { Title, Paragraph } = Typography;

  return (
    <>
      <Navbar />
      <Title className={styles.faq} data-cy="title">
        Frequently asked questions
      </Title>
      <Typography className={styles.typography}>
        <h3>
          <strong>Valid social links</strong>
        </h3>
        <Paragraph>
          Only links from these websites are valid: YouTube, Instagram, Twitter, Spotify, and LinkTree.
        </Paragraph>
        <h3>
          <strong>Subscriptions, Payouts & Payments</strong>
        </h3>
        <Paragraph>
          *We use Stripe to handle our subscription payments and payouts to users. You are required to create an account
          with Stripe to receive payouts.*
        </Paragraph>
        <Paragraph className={styles.yikes}>
          <strong>Payments, subscriptions: </strong>
          Payments are recurring on a month to month basis, indefinitely, unless a user cancels their subscription.
          Credits roll over month to month for as long as a subscriber maintains their subscription. If a user cancels
          their subscription or has their subscription canceled for any reason, they sacrifice their accumulated credits
          at the end of their billing period coinciding with the cancellation of their subscription (example, if a user
          subscribes May 1st, cancels their subscription on May 20th, and has 3 credits left over, their credits will be
          sacrificed on June 1st and they will be unable to use or regain those credits at any time after June 1st.) If
          a user is unable to make a payment at the beginning of their billing cycle, or if a payment fails, they will
          have 14 days to update their billing information and make a payment before their subscription is automatically
          canceled.
        </Paragraph>
        <Paragraph className={styles.yikes}>
          <strong>Payouts: </strong>
          Payouts are made the first Tuesday of each month between the hours of 9AM-5PM Pacific Time, unless the first
          Tuesday of a month lands on a federal holiday, or if other extenuating circumstances out of our control
          prohibit us from making a payment on the first Tuesday of a month, in which case payouts will be made the
          following day or as soon as possible between the hours of 9AM-5PM Pacific Time Monday-Friday.
        </Paragraph>
        <Paragraph className={styles.yikes}>
          Producer revenue is determined using a formula to calculate the average value of a credit at the end of the
          month and multiplied by the total amount of downloads a producer receives on all beats uploaded by producer in
          the period of one month. The total amount of revenue by the end of the month is then paid out to the producer
          in full through Stripe.
        </Paragraph>
        <Paragraph className={styles.yikes}>
          <strong>Subscription tiers, credits: </strong> 1 credit grants the user the right to download and license 1
          beat under an unlimited license.
        </Paragraph>
        <Paragraph className={styles.yikes}>
          <strong>Basic subscription: </strong> users are entitled to 3 credits per month.
        </Paragraph>
        <Paragraph className={styles.yikes}>
          <strong>Standard subscription: </strong> users are entitled to 7 credits per month.
        </Paragraph>
        <Paragraph className={styles.yikes}>
          <strong>Premium subscription: </strong> users are entitled to 12 credits per month.
        </Paragraph>
        <img src={balloonLogo} alt="Balloon Logo" className={styles.logo} />
      </Typography>
    </>
  );
}
