import { useEffect } from 'react';
import { resendVerificationEmailReq } from '../../../lib/axios';
import { getUserIdFromLocalStorage } from '../../../utils/localStorageParser';
import { useNavigate } from 'react-router-dom';
import gatewayUrl from '../../../config/routing';
import axios from 'axios';

export default function VerifyEmail() {
  const userId = getUserIdFromLocalStorage();
  const queryParams = new URLSearchParams(window.location.search);
  const code = queryParams.get('code');

  const navigate = useNavigate();

  useEffect(() => {
    if (code) {
      axios
        .get(`${gatewayUrl}/user/verify-email?code=${code}&user=${userId}`)
        .then((res) => {
          if (res.status == 200) {
            navigate('/app/dash');
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  });

  const resendEmail = async () => {
    try {
      const res = await resendVerificationEmailReq(userId || '123');
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <h1>Click the link in your email to verify your account</h1>
      <button
        onClick={() => {
          resendEmail();
        }}
      >
        Resend email
      </button>
    </>
  );
}
