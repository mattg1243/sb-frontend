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
          *We use Stripe & PayPal to handle our subscription payments and payouts to users. You are required to create
          an account with Stripe or PayPal to receive payouts.*
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
          <strong>Cancelling your subscription: </strong>
          To cancel your subscription, go to the "Account" page, click on manage subscription under the settings panel,
          and click "Cancel subscription."
        </Paragraph>
        <Paragraph className={styles.yikes}>
          <strong>Payouts: </strong>
          Payouts are initiated on the first Tuesday of each month between the hours of 9AM-5PM Pacific Time, unless the
          first Tuesday of a month lands on a federal holiday, or if other extenuating circumstances out of our control
          prohibit us from making a payment on the first Tuesday of a month, in which case payouts will be made the
          following day or as soon as possible between the hours of 9AM-5PM Pacific Time Monday-Friday.
        </Paragraph>
        <Paragraph className={styles.yikes}>
          Producer revenue is determined using a formula to calculate the average value of a credit at the end of the
          month and multiplied by the total amount of downloads a producer receives on all beats uploaded by producer in
          the period of one month. The total amount of revenue by the end of the month is then paid out to the producer
          in full through Stripe or PayPal.
        </Paragraph>
        <Paragraph className={styles.yikes}>
          <strong>Subscription tiers, credits: </strong> 1 credit grants the user the right to download and license 1
          beat of their choice under a standard non-exclusive unlimited license.
        </Paragraph>
        <Paragraph className={styles.yikes}>
          <strong>Basic subscription: </strong> users are entitled to 3 credits per month.
        </Paragraph>
        <Paragraph className={styles.yikes}>
          <strong>Standard subscription: </strong> users are entitled to 5 credits per month.
        </Paragraph>
        <Paragraph className={styles.yikes}>
          <strong>Premium subscription: </strong> users are entitled to 9 credits per month.
        </Paragraph>
        <h3>
          <strong>How long does a license last?</strong>
        </h3>
        <Paragraph className={styles.yikes}>
          Once you download a beat, it's yours forever regardless of whether or not you're subscribed. If a producer
          sells the beat you licensed exclusively after you licensed yours, you are "grandfathered" in, meaning your
          license does not suddenly expire.
        </Paragraph>
        <h3>
          <strong>What is a non-exclusive Unlimited License?</strong>
        </h3>
        <Paragraph>
          A non-exclusive license means the producer can re-sell the same license as many times as they want to other
          artists. You do not have any exclusive rights to the intellectual property you are licensing.
        </Paragraph>
        <Paragraph className={styles.yikes}>An unlimited license gives you the following rights:</Paragraph>
        <Paragraph className={styles.yikes}>
          <strong>- Use the beat for music recording</strong>
        </Paragraph>
        <Paragraph className={styles.yikes}>
          <strong>- Distribute unlimited copies of your song</strong>
        </Paragraph>
        <Paragraph className={styles.yikes}>
          <strong>- Unlimited audio streams of your song</strong>
        </Paragraph>
        <Paragraph className={styles.yikes}>
          <strong>- Unlimited music videos for your song</strong>
        </Paragraph>
        <Paragraph className={styles.yikes}>
          <strong>- Radio broadcast rights for an unlimited amount of stations</strong>
        </Paragraph>
        <Paragraph className={styles.yikes}>
          <strong>- For-profit live performances of your song</strong>
        </Paragraph>
        <img src={balloonLogo} alt="Balloon Logo" className={styles.logo} />
      </Typography>
    </>
  );
}
