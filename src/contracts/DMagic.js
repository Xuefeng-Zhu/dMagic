import { ethers } from 'ethers';

import DMagic from '../deployments/rinkeby/DMagic.json';

const instances = {};

export default function DMagicInstance(signer) {
  if (instances[signer]) {
    return instances[signer];
  }

  instances[signer] = new ethers.Contract(DMagic.address, DMagic.abi, signer);
  return instances[signer];
}
