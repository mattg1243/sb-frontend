import { useState } from 'react';
import { Breadcrumb, Upload, Layout, Button, Modal, Form, Input } from 'antd';
import { Content, Header } from 'antd/lib/layout/layout';
import DashRow from '../DashRow';

export default function Dashboard() {
  const topTen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);

  return (
    <Layout>
      <Header>
        Dashboard
        <Breadcrumb>wow</Breadcrumb>
        <Button
          onClick={() => {
            setUploadModalOpen(true);
          }}
        >
          Upload Beat
        </Button>
        <Content style={{ display: 'flex', flexDirection: 'column' }}>
          {topTen.map((beat) => {
            return <DashRow beat={beat} />;
          })}
          <Modal title="upload beat modal" open={uploadModalOpen} closable={true}>
            <Form>
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
              <Upload name="beat" action="http://localhost:3001/api/upload/beat">
                Upload Beat
              </Upload>
            </Form>
          </Modal>
        </Content>
      </Header>
    </Layout>
  );
}
