import axios from 'axios';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMap } from 'react-use';
import _ from 'lodash';

import { useWeb3Context } from './Web3ContextProvider';
import DMagic from '../contracts/DMagic';
import * as nftport from '../utils/nftport';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { address, signer } = useWeb3Context();
  const [dMagic, setDMagic] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    if (!signer) {
      return;
    }

    setDMagic(DMagic(signer));
  }, [signer]);

  const getOwnedCards = async () => {
    const data = await nftport.getContractNFTs();
    return data.nfts.filter((nft) => nft.metadata.owner === address);
  };

  return (
    <StateContext.Provider
      value={{
        loading,
        dMagic,
        getOwnedCards,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
