import axios from 'axios';
import gatewayUrl from '../../../config/routing';
import { Button } from 'antd';
import { FaPaypal } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import styles from './Account.module.css';

export default function PayPalConnectBtn() {
  const [actionUrl, setActionUrl] = useState<string>();
  const [merchantId, setMerchantId] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${gatewayUrl}/user/paypal-connect-link`, { withCredentials: true })
      .then((res) => {
        if (res.data.links) {
          setActionUrl(res.data.links[1].href);
        } else {
          console.log(res.data);
          setMerchantId(res.data.merchantId);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const merchantIdInPaypal = searchParams.get('merchantIdInPayPal');
    const permissionsGranted = searchParams.get('permissionsGranted');
    const consentStatus = searchParams.get('consentStatus');

    if (merchantIdInPaypal && permissionsGranted && consentStatus) {
      // fire notification to the page
      axios
        .post(`${gatewayUrl}/user/paypal-connect`, { merchantId: merchantIdInPaypal }, { withCredentials: true })
        .then((res) => console.log(res))
        .catch((err) => console.error(err));
      // api call to save the merchant id in the database
    }
  });

  const openPaypalConnectPage = async () => {
    try {
      setLoading(true);
      window.open(actionUrl, '_blank', 'noreferrer');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        className={styles.btn}
        onClick={async () => {
          await openPaypalConnectPage();
        }}
        loading={loading}
        icon={<FaPaypal />}
        disabled={merchantId !== undefined}
      >
        {merchantId ? `PayPal Connected ✔️` : 'Connect PayPal'}
      </Button>
    </>
  );
}
