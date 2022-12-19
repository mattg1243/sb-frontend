import { Modal, Form, Upload, Button, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { checkImgFile, checkAudioFile } from '../utils/fileCheckers';
import { useState } from 'react';

export default function UploadBeatModal() {

  const [showModal, setShowModal] = useState<boolean>(false);

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <>
    <Button type='ghost' onClick={() => { setShowModal(true) }} style={{ color: 'white' }} >Upload</Button>
      <Modal title="upload beat modal" open={showModal} closable={true} onCancel={handleCancel} >
        <Form method='post' action='http://localhost:8000/beats/upload' encType='multipart/form-data'>
          <Form.Item>
            <Input placeholder="Title"></Input>
          </Form.Item>
          <Form.Item>
            <Input placeholder="Genre Tags (comman seperated)"></Input>
          </Form.Item>
          <Form.Item>
            <Input placeholder="Tempo"></Input>
          </Form.Item>
          <Form.Item>
            <Input placeholder="Key"></Input>
          </Form.Item>
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            multiple={false}
            beforeUpload={checkImgFile}
          >
            Artwork
          </Upload>
          {/* TODO: make a similar checkAudioFile function */}
          <Upload name="beat" multiple={false} beforeUpload={checkAudioFile}>
            <Button icon={<UploadOutlined />}>Audio File</Button>
          </Upload>
          <Button htmlType='submit' >Uplaod Beat</Button>
        </Form>
      </Modal>
    </>
)
}