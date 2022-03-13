import axios from 'axios';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMap } from 'react-use';
import _ from 'lodash';

import { useWeb3Context } from './Web3ContextProvider';
import DMagic from '../contracts/DMagic';
import * as nftport from '../utils/nftport';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { provider, signer } = useWeb3Context();
  const [dMagic, setDMagic] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    if (!provider) {
      return;
    }

    setDMagic(DMagic(signer || provider));
  }, [provider, signer]);

  return (
    <StateContext.Provider
      value={{
        loading,
        dMagic,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
