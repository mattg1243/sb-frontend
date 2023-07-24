import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import JSZip from 'jszip';
import { Button, Modal, Progress, Spin } from 'antd';
import { useEffect, useState } from 'react';
import styles from './BeatDownloadModal.module.css';
import gatewayUrl from '../../config/routing';
import axios, { AxiosResponse } from 'axios';
import CustomAlert from '../CustomAlert/index';
import { AlertObj } from '../../types';

interface IBeatDownloadModal {
  beatId: string;
  title: string;
  artistName: string;
  license: boolean;
}

export default function BeatDownloadModal(props: IBeatDownloadModal) {
  const { beatId, title, artistName, license } = props;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [beatDownloading, setBeatDownloading] = useState(false);
  const [beatDownloadProgress, setBeatDownloadProgress] = useState<number>(0);
  const [stemDownloading, setStemDownloading] = useState(false);
  const [stemDownloadProgress, setStemDownloadProgress] = useState<number>(0);
  const [licenseType, setLicenseType] = useState<string>('unlimited');
  const [errorMsg, setErrMsg] = useState<AlertObj>();

  let modalTitle = 'Download & License Beat';
  let modalTxt = 'Are you sure you would like download and license this beat for 1 credit?';
  let btnTxt = 'Download & License';

  if (!license) {
    modalTitle = 'Download Beat';
    modalTxt = 'You own a license for this beat. Would you like to download it?';
    btnTxt = 'Download';
  }

  const zip = new JSZip();
  const downloadZip = zip.folder(`${title}-${artistName}`);

  const icon = props.license ? (
    <PlusOutlined className={styles['plus-btn']} />
  ) : (
    <DownloadOutlined className={styles['plus-btn']} />
  );

  const downloadBeat = async () => {
    const promiseArr: Array<Promise<AxiosResponse>> = [];
    if (!downloadZip) {
      console.log('error creating zip folder');
      return;
    }
    setLoading(true);
    try {
      setBeatDownloading(true);
      const res = await axios.get(`${gatewayUrl}/beats/download?beatId=${beatId}&licenseType=${licenseType}`, {
        withCredentials: true,
      });
      console.log(res.data);
      // start downloading beat
      const downloadBeatRes = await axios.get(res.data.beat, {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setBeatDownloadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        },
      });
      // add beat to zip file
      downloadZip.file(`${title}.mp3`, downloadBeatRes.data);
      // check for stems
      const stems = res.data.stems;
      if (stems) {
        setStemDownloading(true);
        const numOfStems: number = stems.length;
        let sizeOfStems = 0;
        let downloadedStemBytes = 0;
        for (let i = 0; i < numOfStems; i++) {
          const stemResPromise = axios.get(stems[i].url, {
            responseType: 'blob',
            onDownloadProgress: (progressEvent) => {
              if (progressEvent.total) {
                downloadedStemBytes += progressEvent.bytes;
                setStemDownloadProgress(Math.round(downloadedStemBytes / sizeOfStems));
              }
            },
          });
          //  not currently tracking properly
          sizeOfStems += parseInt((await stemResPromise).headers['Content-Length'] as string);
          promiseArr.push(stemResPromise);
        }
      }
      const stemDownloadResArr = await Promise.all(promiseArr);
      setBeatDownloading(false);
      setStemDownloading(false);
      // add the stems
      for (let j = 0; j < stems.length; j++) {
        downloadZip.file(stems[j].name, stemDownloadResArr[j].data);
      }
      // download zip
      const download = await downloadZip.generateAsync({ type: 'blob' });
      const href = URL.createObjectURL(download);
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', `${title}.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
      setOpen(false);
    } catch (err) {
      console.error(err);
      setErrMsg({ message: 'Insufficient credits', status: 'error' });
    } finally {
      setBeatDownloading(false);
      setBeatDownloadProgress(0);
      setStemDownloadProgress(0);
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
        icon={icon}
        data-cy="download-modal-btn"
      />
      <Modal
        title={modalTitle}
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
            data-cy="download-beat-btn"
          >
            {btnTxt}
          </Button>,
        ]}
      >
        <Spin spinning={loading}>
          <h3>
            {title} - {artistName}
          </h3>
          {errorMsg ? (
            <>
              <CustomAlert message={errorMsg.message} status={errorMsg.status} />
            </>
          ) : (
            <p style={{ padding: '.5vw' }}>{modalTxt}</p>
          )}
        </Spin>
        {beatDownloading ? (
          <>
            <p>Downloading beats...</p>
            <Progress percent={beatDownloadProgress} strokeColor={'var(--primary)'} />
          </>
        ) : null}
        {stemDownloading ? (
          <>
            <p>Downloading stems...</p>
          </>
        ) : null}
      </Modal>
    </>
  );
}
