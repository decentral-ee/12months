import {
  ContractWrappers,
  BigNumber,
  assetDataUtils,
  orderHashUtils,
  signatureUtils,
  MetamaskSubprovider,
  generatePseudoRandomSalt
} from '0x.js';
import {Contracts, CAR_LOAN, DAI} from './contracts';
import * as Web3Utils from 'web3-utils';
const {Web3Wrapper} = require("@0x/web3-wrapper");
const uuidv4 = require('uuid/v4');

const ZERO = "0";
const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
const DECIMALS = 18;
const makerAssetAmount = new BigNumber(1);
const takerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(0.1), DECIMALS);
const web3Wrapper = new Web3Wrapper(window.ethereum);

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
  const blockNow = (await web3.eth.getBlock("latest")).timestamp;

  //                              maker creates order
  const exchangeAddress = contractWrappers.exchange.address;
  console.log("exchangeAddress", exchangeAddress);
  const order = {
    makerAddress: maker.toLowerCase(),
    takerAddress: NULL_ADDRESS,
    feeRecipientAddress: NULL_ADDRESS,
    senderAddress: NULL_ADDRESS,
    expirationTimeSeconds: new BigNumber(blockNow).plus(3600 * 24 * 30).toString(),
    salt: generatePseudoRandomSalt().toString(),
    makerAssetAmount: makerAssetAmount.toString(),
    takerAssetAmount: takerAssetAmount.toString(),
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

export async function approvalForAllAsync(maker) {
  const provider = new MetamaskSubprovider(window.ethereum);
  const contractWrappers = new ContractWrappers(provider, { networkId: 42 /* kovan */ });
  const txHash = await contractWrappers.erc721Token.setProxyApprovalForAllAsync(
    Contracts[CAR_LOAN].address,
    maker,
    true,
  );
  await web3Wrapper.awaitTransactionMinedAsync(txHash);
  return txHash;
}

export async function approveProxyAllowance(taker) {
  const provider = new MetamaskSubprovider(window.ethereum);
  const contractWrappers = new ContractWrappers(provider, { networkId: 42 /* kovan */ });
  const txHash = await contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(Contracts[DAI].address, taker);
  await web3Wrapper.awaitTransactionMinedAsync(txHash);
  return txHash;
}

const exchangeGasAmount = 500000;

export async function fillOrder(taker, zkOrder, signature) {
  console.log(`fillOrder! `, taker, zkOrder, signature);
  const order = {
    makerAddress: zkOrder.makerAddress,
    takerAddress: zkOrder.takerAddress,
    feeRecipientAddress: zkOrder.feeRecipientAddress,
    senderAddress: zkOrder.senderAddress,
    expirationTimeSeconds: zkOrder.expirationTimeSeconds,
    salt: zkOrder.salt,
    makerAssetAmount: zkOrder.makerAssetAmount,
    takerAssetAmount: zkOrder.takerAssetAmount,
    makerAssetData: zkOrder.makerAssetData,
    takerAssetData: zkOrder.takerAssetData,
    makerFee: zkOrder.makerFee,
    takerFee: zkOrder.takerFee,
  };
  const provider = new MetamaskSubprovider(window.ethereum);
  const contractWrappers = new ContractWrappers(provider, { networkId: 42 /* kovan */ });
  const txHash = await contractWrappers.exchange.fillOrderAsync({
    ...order,
    exchangeAddress: contractWrappers.exchange.address,
    signature
  }, takerAssetAmount, taker, {
    gasLimit: exchangeGasAmount,
    shouldValidate: true
  })
  await web3Wrapper.awaitTransactionMinedAsync(txHash);
  return txHash;
}
