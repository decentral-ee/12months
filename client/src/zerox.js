import {
  ContractWrappers,
  BigNumber,
  assetDataUtils,
  orderHashUtils,
  signatureUtils,
  MetamaskSubprovider
} from '0x.js';
import {Contracts, CAR_LOAN, DAI} from './contracts';
import * as Web3Utils from 'web3-utils';
const {Web3Wrapper} = require("@0x/web3-wrapper");
const uuidv4 = require('uuid/v4');

const ZERO = new BigNumber(0);
const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
const DECIMALS = 18;
const makerAssetAmount = new BigNumber(1);
const takerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(0.1), DECIMALS);

export function mintNFT(web3, from, dealId) {
  return new Promise(async (resolve, reject) => {
    const tokenId = Web3Utils.sha3(uuidv4());
    const contract = new web3.eth.Contract(Contracts[CAR_LOAN].abi, Contracts[CAR_LOAN].address);
    const infoUrl = `https://local2.oja.me/api/deals/${dealId}/contract.pdf.hex`;
    contract.methods.mint(from, tokenId, infoUrl).send({from: from}).on('receipt', receipt => {
      console.log(`Minted NFT! receipt: `, receipt);
    }).on('transactionHash', hash => {
      console.log(`Minted NFT! hash! `, hash);
      resolve({tokenId, txHash: hash});
    }).catch(error => {
      console.error(error);
      reject(error);
    });
  });
}

export async function signOrder(web3, maker, tokenId) {
  const provider = new MetamaskSubprovider(window.ethereum);
  const contractWrappers = new ContractWrappers(provider, { networkId: 42 /* kovan */ });
  const makerAssetData = assetDataUtils.encodeERC721AssetData(Contracts[CAR_LOAN].address, tokenId);
  const takerAssetData = assetDataUtils.encodeERC20AssetData(Contracts[DAI].address);

  //  maker creates order
  const exchangeAddress = contractWrappers.exchange.address;
  console.log("exchangeAddress", exchangeAddress);
  const order = {
    makerAddress: maker.toLowerCase(),
    takerAddress: NULL_ADDRESS,
    feeRecipientAddress: NULL_ADDRESS,
    senderAddress: NULL_ADDRESS,
    expirationTimeSeconds: new BigNumber(3600 * 24 * 30),
    //  salt: generatePseudoRandomSalt().toString(),
    salt: new BigNumber(0),
    makerAssetAmount: makerAssetAmount,
    takerAssetAmount: takerAssetAmount,
    makerAssetData,
    takerAssetData,
    makerFee: ZERO,
    takerFee: ZERO,
  };
  console.log("order created", order);
  const orderHashHex = orderHashUtils.getOrderHashHex({
    ...order,
    exchangeAddress
  });
  const signature = await signatureUtils.ecSignHashAsync(provider, orderHashHex, maker.toLowerCase());
  console.log("signedOrder", signature);
  return {zxOrder: order, zxSignature: signature};
}

export async function approveProxyAllowance(taker) {
  const provider = new MetamaskSubprovider(window.ethereum);
  const contractWrappers = new ContractWrappers(provider, { networkId: 42 /* kovan */ });
  return await contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(Contracts[DAI].address, taker);
}

const exchangeGasAmount = 500000;

export async function fillOrder(taker, order, signature) {
  const provider = new MetamaskSubprovider(window.ethereum);
  const contractWrappers = new ContractWrappers(provider, { networkId: 42 /* kovan */ });
  await contractWrappers.exchange.fillOrderAsync({
    ...order,
    exchangeAddress: contractWrappers.exchange.address,
    signature
  }, takerAssetAmount, taker, {
    gasLimit: exchangeGasAmount,
    shouldValidate: true
  });
}
