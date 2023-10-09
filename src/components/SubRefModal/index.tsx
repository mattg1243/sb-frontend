import { useEffect, useState } from 'react';
import { Modal, Input, Button } from 'antd';
import { AlertObj } from '../../types';
import { setSubReferrerReq } from '../../lib/axios';
import CustomAlert from '../CustomAlert';
import { Axios, AxiosError } from 'axios';

export default function SubRefModal() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [refCode, setRefCode] = useState<string>();
  const [alert, setAlert] = useState<AlertObj>({ status: 'none', message: '' });

  useEffect(() => {
    const subSucess = new URLSearchParams(window.location.search).get('sub-success');
    console.log(subSucess);
    if (subSucess) {
      setIsOpen(true);
    }
  }, []);

  const submitRefCode = async () => {
    try {
      await setSubReferrerReq(refCode as string);
      setAlert({ status: 'success', message: 'Referral code saved' });
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    } catch (err: any) {
      if (err instanceof AxiosError) {
        setAlert({ status: 'error', message: err.response?.data.message });
      }
      console.error(err);
    }
  };

  return (
    <>
      <Modal
        centered
        open={isOpen}
        title="Enter Referral Code"
        footer={[
          <Button
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Skip
          </Button>,
          <Button
            style={{ background: 'var(--primary)' }}
            onClick={async () => {
              await submitRefCode();
            }}
          >
            Submit
          </Button>,
        ]}
      >
        <p>If you were referred by someone, please enter the referral code here</p>
        <Input
          onChange={(e) => {
            setRefCode(e.target.value);
          }}
        />
        <div style={{ padding: '.5vw', width: '90%', textAlign: 'center', alignItems: 'center' }}>
          <CustomAlert {...alert} />
        </div>
      </Modal>
    </>
  );
}
