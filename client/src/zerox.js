import {
  ContractWrappers,
  BigNumber,
  assetDataUtils,
  orderHashUtils,
  signatureUtils,
  MetamaskSubprovider
} from '0x.js';
import {Contracts, CAR_LOAN, DAI} from './contracts';
const {Web3Wrapper} = require("@0x/web3-wrapper");

const ZERO = new BigNumber(0);
const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
const DECIMALS = 18;
const makerAssetAmount = new BigNumber(1);
const takerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(0.1), DECIMALS);

export async function signOrder(web3, maker, tokenId) {
  const provider = new MetamaskSubprovider(window.ethereum);
  const contractWrappers = new ContractWrappers(provider, { networkId: 42 /* kovan */ });
  const makerAssetData = assetDataUtils.encodeERC721AssetData(Contracts[CAR_LOAN].address, tokenId);
  const takerAssetData = assetDataUtils.encodeERC20AssetData(Contracts[DAI].address);

  // maker creates order
  const exchangeAddress = contractWrappers.exchange.address;
  console.log("exchangeAddress", exchangeAddress);
  const order = {
    makerAddress: maker.toLowerCase(),
    takerAddress: NULL_ADDRESS,
    feeRecipientAddress: NULL_ADDRESS,
    senderAddress: NULL_ADDRESS,
    expirationTimeSeconds: new BigNumber(3600 * 24 * 30),
    // salt: generatePseudoRandomSalt().toString(),
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
  const signedOrder = await signatureUtils.ecSignHashAsync(provider, orderHashHex, maker.toLowerCase());
  console.log("signedOrder", signedOrder);
  return signedOrder;
}
