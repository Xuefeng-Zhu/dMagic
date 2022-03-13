import React, { useState } from 'react';
import { Form, Input, Upload, Button, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import { uploadFile, mintNFT } from '../utils/nftport';

const Create = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const createProject = async (values) => {
    const { name, owner, description, logo, website, github } = values;
    setLoading(true);
    await mintNFT(
      {
        name,
        description,
        file_url: logo?.file?.response?.ipfs_url,
        custom_fields: {
          website,
          github,
          owner,
        },
      },
      owner
    );
    setLoading(false);
    notification.open({
      message: `Project ${name} created`,
    });
  };

  return (
    <Form layout="vertical" form={form} onFinish={createProject}>
      <Form.Item name="name" label="Project Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="owner"
        label="Owner Address"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true }]}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item name="website" label="Website">
        <Input />
      </Form.Item>
      <Form.Item name="github" label="Github">
        <Input />
      </Form.Item>

      <Form.Item name="logo" label="Logo" rules={[{ required: true }]}>
        <Upload
          name="logo"
          listType="picture-card"
          maxCount={1}
          customRequest={async ({ file, onSuccess }) => {
            const data = await uploadFile(file);
            onSuccess(data, file);
          }}
        >
          <UploadOutlined />
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Create;
