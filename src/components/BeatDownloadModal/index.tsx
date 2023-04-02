import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Spin } from 'antd';
import { useState } from 'react';
import styles from './BeatDownloadModal.module.css';
import gatewayUrl from '../../config/routing';
import axios from 'axios';

interface IBeatDownloadModal {
  cdnKey: string;
  title: string;
  artistName: string;
}

export default function BeatDownloadModal(props: IBeatDownloadModal) {
  const { cdnKey, title, artistName } = props;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const downloadBeat = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${gatewayUrl}/beats/download?beatId=${cdnKey}`, {
        responseType: 'blob',
        withCredentials: true,
      });
      const href = URL.createObjectURL(res.data);
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', `${title}.mp3`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
      console.log(res);
      setOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        type="ghost"
        onClick={() => {
          setOpen(true);
        }}
        icon={<PlusOutlined className={styles['plus-btn']} />}
      />
      <Modal
        title="Download & License Beat"
        open={open}
        centered
        onCancel={() => {
          setOpen(false);
        }}
        footer={[
          <Button
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>,
          <Button
            onClick={() => {
              downloadBeat();
            }}
          >
            Download
          </Button>,
        ]}
      >
        <Spin spinning={loading}>
          <h3>
            {title} - {artistName}
          </h3>
          <p style={{ padding: '.5vw' }}>Are you sure you would like download and license this beat for 10 credits?</p>
        </Spin>
      </Modal>
    </>
  );
}
