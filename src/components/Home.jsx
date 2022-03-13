import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';
import { Skeleton, Card, List } from 'antd';

import { getContractNFTs } from '../utils/nftport';

const Home = () => {
  const { isLoading, data } = useQuery(['HomeFeeds'], () => getContractNFTs());
  const history = useHistory();

  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <List
      grid={{ gutter: 16, column: 4 }}
      dataSource={data.nfts}
      renderItem={(nft) => (
        <List.Item>
          <Card
            hoverable
            style={{ marginTop: 16 }}
            cover={<img src={nft.file_url} height="200px" />}
            onClick={() => history.push(`/project/${nft.token_id}`)}
          >
            <Card.Meta title={nft.metadata.name} />
          </Card>
        </List.Item>
      )}
    />
  );
};

export default Home;
