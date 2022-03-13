import axios from 'axios';

const COVALENT_API = 'https://api.covalenthq.com/v1';

export const addressBalances = async ({ address, chainId = 1 } = {}) => {
  if (!address) {
    return;
  }

  const options = {
    method: 'GET',
    url: `${COVALENT_API}/${chainId}/address/${address}/balances_v2/`,
    headers: {
      'Content-Type': 'application/json',
    },
    params: { key: process.env.REACT_APP_COVALENT_KEY },
  };

  return axios.request(options).then((res) => res.data.data);
};

export const transactionsForAddress = async ({ address, chainId = 1 } = {}) => {
  if (!address) {
    return;
  }

  const options = {
    method: 'GET',
    url: `${COVALENT_API}/${chainId}/address/${address}/transactions_v2/`,
    headers: {
      'Content-Type': 'application/json',
    },
    params: { key: process.env.REACT_APP_COVALENT_KEY },
  };

  return axios.request(options).then((res) => res.data.data);
};
