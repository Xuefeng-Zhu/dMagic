import axios from 'axios';

export const NFT_PORT_API = 'https://api.nftport.xyz/v0';
const NFT_CONTRACT = '0x38776a041ab363ddb58a1ad1e434a29572943b30';

export const uploadFile = async (file) => {
  const data = new FormData();
  data.append('file', file);

  const options = {
    method: 'POST',
    url: `${NFT_PORT_API}/files`,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: process.env.REACT_APP_NFT_PORT_API_KEY,
      'content-type':
        'multipart/form-data; boundary=---011000010111000001101001',
    },
    data,
  };

  return axios.request(options).then(({ data }) => data);
};

export const uploadMetadata = async (data) => {
  const options = {
    method: 'POST',
    url: `${NFT_PORT_API}/metadata`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.REACT_APP_NFT_PORT_API_KEY,
    },
    data,
  };

  return axios.request(options).then((res) => res.data);
};

export const mintNFT = async (data, address) => {
  const metadata = await uploadMetadata(data);

  const options = {
    method: 'POST',
    url: `${NFT_PORT_API}/mints/customizable`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.REACT_APP_NFT_PORT_API_KEY,
    },
    data: {
      chain: 'polygon',
      contract_address: NFT_CONTRACT,
      metadata_uri: metadata.metadata_uri,
      mint_to_address: address,
    },
  };

  return axios.request(options).then((res) => res.data);
};

export const getContractNFTs = async () => {
  const options = {
    method: 'GET',
    url: `${NFT_PORT_API}/nfts/${NFT_CONTRACT}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.REACT_APP_NFT_PORT_API_KEY,
    },
    params: {
      chain: 'polygon',
      include: 'all',
    },
  };

  return axios.request(options).then((res) => res.data);
};

export const getNFTDetails = async (tokenId) => {
  const options = {
    method: 'GET',
    url: `${NFT_PORT_API}/nfts/${NFT_CONTRACT}/${tokenId}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.REACT_APP_NFT_PORT_API_KEY,
    },
    params: { chain: 'polygon' },
  };

  return axios.request(options).then((res) => res.data);
};
