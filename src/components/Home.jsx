import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { Skeleton, Card, List } from 'antd';

import { useWeb3Context } from '../contexts/Web3ContextProvider';
import { useStateContext } from '../contexts/StateContextProvider';

const Home = () => {
  const { address } = useWeb3Context();
  const { getOwnedCards } = useStateContext();
  const { isLoading, data } = useQuery(['HomeFeeds', address], () =>
    getOwnedCards()
  );

  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <List
      style={{ width: '100%' }}
      grid={{ gutter: 16, column: 4 }}
      dataSource={data}
      renderItem={(nft) => (
        <List.Item>
          <Card style={{ width: '100%' }} cover={<img src={nft.file_url} />}>
            <Card.Meta title={nft.metadata.name} />
          </Card>
        </List.Item>
      )}
    />
  );
};

export default Home;
