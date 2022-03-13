import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useEthersContext } from 'eth-hooks/context';
import { Card, Button, Result, notification } from 'antd';
import {
  LogoutOutlined,
  FileAddOutlined,
  SmileOutlined,
} from '@ant-design/icons';

import { uploadFile, mintNFT } from '../utils/nftport';
import { useStateContext } from '../contexts/StateContextProvider';

const DrawCard = () => {
  const ethersContext = useEthersContext();
  console.log(ethersContext);
  const { dMagic } = useStateContext();
  const { isLoading, data = {} } = useQuery(['DrawCard'], () =>
    axios
      .get(`https://api.magicthegathering.io/v1/cards/4980`)
      .then((res) => res.data)
  );
  const [loading, setLoading] = useState(false);
  const { card = {} } = data;

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
    <Result
      icon={<SmileOutlined />}
      title="Let's draw a magic card!"
      extra={
        <Button
          type="primary"
          icon={<LogoutOutlined />}
          onClick={() => this.enterLoading(2)}
        >
          Draw Card
        </Button>
      }
    />
  );

  return (
    <Card
      style={{ width: 500 }}
      cover={
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img width="300" alt={card.name} src={card.imageUrl} />
        </div>
      }
      actions={[
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={() => this.enterLoading(2)}
        >
          Draw Card
        </Button>,
        <Button
          type="text"
          icon={<FileAddOutlined />}
          onClick={() => this.enterLoading(2)}
        >
          Mint NFT
        </Button>,
      ]}
    >
      <Card.Meta title={card.name} description={card.text} />
    </Card>
  );
};

export default DrawCard;
