import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import Web3Modal from '@0xsequence/web3modal';
import { sequence } from '0xsequence';
import { Framework } from '@superfluid-finance/sdk-core';

import { Web3Provider } from '@ethersproject/providers';

const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions: {
    sequence: {
      package: sequence,
      options: {
        appName: 'dMagic',
        defaultNetwork: 'rinkeby',
      },
    },
  },
  theme: 'dark',
});

export const Web3Context = createContext({
  provider: undefined,
  signer: undefined,
  sf: undefined,
  address: '',
  web3Modal,
  loadWeb3Modal: async () => {},
  logoutOfWeb3Modal: async () => {},
});

export const Web3ContextProvider = ({ children }) => {
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [network, setNetwork] = useState({});
  const [address, setAddress] = useState('');
  const [web3Connection, setWeb3Connection] = useState();
  const [sf, setSf] = useState();

  useEffect(() => {
    if (!web3Connection) {
      return;
    }
    web3Connection.on('accountsChanged', () => {
      window.location.reload();
    });
    web3Connection.on('chainChanged', () => {
      window.location.reload();
    });
  }, [web3Connection]);

  const loadWeb3Modal = useCallback(async () => {
    const connection = await web3Modal.connect();
    setWeb3Connection(connection);
    const newProvider = new Web3Provider(connection);
    setProvider(newProvider);

    const network = await newProvider.getNetwork();
    setNetwork(network);

    const sf = await Framework.create({
      chainId: network.chainId,
      provider: newProvider,
    });
    const sfsigner = sf.createSigner({ web3Provider: newProvider });
    setSf(sf);
    setSigner(sfsigner);
    setAddress(await sfsigner.getAddress());
  }, []);

  const logoutOfWeb3Modal = useCallback(async () => {
    if (web3Connection && web3Connection.close) {
      web3Connection.close();
    }
    web3Modal.clearCachedProvider();
    window.location.reload();
  }, [web3Connection]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, []);

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        sf,
        address,
        network,
        web3Modal,
        loadWeb3Modal,
        logoutOfWeb3Modal,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3Context = () => useContext(Web3Context);
