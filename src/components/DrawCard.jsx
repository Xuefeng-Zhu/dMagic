import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Card, Button, Result, notification } from 'antd';
import {
  LogoutOutlined,
  FileAddOutlined,
  SmileOutlined,
  LoadingOutlined,
} from '@ant-design/icons';

import { uploadMetadata } from '../utils/nftport';
import { useStateContext } from '../contexts/StateContextProvider';
import { useWeb3Context } from '../contexts/Web3ContextProvider';

const DrawCard = () => {
  const { address } = useWeb3Context();
  const { dMagic } = useStateContext();
  const { data: cardId } = useQuery(['CardId', address], async () => {
    if (!dMagic) {
      return;
    }
    const randomWord = await dMagic.userRandomWords(address);
    return randomWord.toNumber();
  });
  const { data = {} } = useQuery(['CardInfo', cardId], () =>
    axios
      .get(`https://api.magicthegathering.io/v1/cards/${cardId}`)
      .then((res) => res.data)
  );
  const [loading, setLoading] = useState(false);
  const { card = {} } = data;

  const drawCard = async () => {
    if (!dMagic) {
      return;
    }
    await dMagic.drawCard({
      value: 1000000000,
    });
  };

  const mintCard = async () => {
    if (!dMagic) {
      return;
    }
    const res = await uploadMetadata({
      name: card.name,
      custom_fields: {
        owner: address,
      },
      description: card.text,
      file_url: card.imageUrl,
    });
    await dMagic.mintCard(address, res.metadata_uri);
  };

  if (!cardId) {
    return (
      <Result
        icon={<SmileOutlined />}
        title="Let's draw a magic card!"
        extra={
          <Button type="primary" icon={<LogoutOutlined />} onClick={drawCard}>
            Draw Card
          </Button>
        }
      />
    );
  }

  if (cardId === 5001) {
    return (
      <Result icon={<LoadingOutlined />} title="Waiting the draw card result" />
    );
  }

  return (
    <Card
      style={{ width: 500 }}
      cover={
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img width="300" alt={card.name} src={card.imageUrl} />
        </div>
      }
      actions={[
        <Button type="text" icon={<LogoutOutlined />} onClick={drawCard}>
          Draw Card
        </Button>,
        <Button type="text" icon={<FileAddOutlined />} onClick={mintCard}>
          Mint NFT
        </Button>,
      ]}
    >
      <Card.Meta title={card.name} description={card.text} />
    </Card>
  );
};

export default DrawCard;
