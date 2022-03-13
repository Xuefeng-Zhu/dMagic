import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Skeleton, Card, Col, Row, Typography, List, Avatar } from 'antd';
import { GiftOutlined, HistoryOutlined } from '@ant-design/icons';
import { formatUnits } from 'ethers/lib/utils';

import OneTimeContributionModal from './OneTimeContributionModal';
import MonthlyContributionModal from './MonthlyContributionModal';
import { transactionsForAddress } from '../utils/covalent';
import { useWeb3Context } from '../contexts/Web3ContextProvider';

const { Text, Title } = Typography;

const ContributionCard = ({ receiver }) => {
  const {
    network: { chainId },
  } = useWeb3Context();
  const [showOneTimeContribution, setShowOneTimeContribution] = useState(false);
  const [showMonthlyContribution, setShowMonthlyContribution] = useState(false);
  const [transfers, setTransfers] = useState([]);
  const { isLoading, data } = useQuery(
    ['transactionsForAddress', receiver, chainId],
    () => transactionsForAddress({ address: receiver, chainId })
  );

  useEffect(async () => {
    if (isLoading) {
      return;
    }

    const txs = data.items.filter((item) => {
      if (item.log_events.length === 0) {
        return;
      }

      const event = item.log_events.find(
        (event) => event.decoded?.name === 'Transfer'
      );
      if (!event) {
        return;
      }

      item.event = event;
      const decoded = event.decoded;

      return (
        decoded.params[1].value === receiver.toLowerCase() &&
        decoded.params[2].value
      );
    });

    setTransfers(txs.map((tx) => tx.event));
  }, [isLoading]);

  console.log(transfers);

  return (
    <>
      <Card title="Contribution" bordered={false}>
        <Row gutter={16}>
          <Col span={8}>
            <Card
              hoverable
              style={{ paddingTop: 10 }}
              cover={<GiftOutlined style={{ fontSize: '50px' }} />}
              onClick={() => setShowOneTimeContribution(true)}
            >
              <Card.Meta
                title="One-time contribution"
                style={{ textAlign: 'center' }}
              />
            </Card>
            <Card
              hoverable
              style={{ paddingTop: 10, marginTop: 10 }}
              cover={<HistoryOutlined style={{ fontSize: '50px' }} />}
              onClick={() => setShowMonthlyContribution(true)}
            >
              <Card.Meta
                title="Monthly contribution"
                style={{ textAlign: 'center' }}
              />
            </Card>
          </Col>
          <Col span={16}>
            <List
              itemLayout="horizontal"
              dataSource={transfers}
              loading={isLoading}
              header={<Title level={5}>Recent contributions</Title>}
              renderItem={(transfer) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={transfer.sender_logo_url} />}
                    title={transfer.decoded.params[0].value}
                    description={`${formatUnits(
                      transfer.decoded.params[2].value || '0',
                      transfer.sender_contract_decimals || 18
                    )} ${transfer.sender_contract_ticker_symbol}`}
                  />
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </Card>
      <OneTimeContributionModal
        receiver={receiver}
        visible={showOneTimeContribution}
        onClose={() => setShowOneTimeContribution(false)}
      />
      <MonthlyContributionModal
        receiver={receiver}
        visible={showMonthlyContribution}
        onClose={() => setShowMonthlyContribution(false)}
      />
    </>
  );
};

export default ContributionCard;
