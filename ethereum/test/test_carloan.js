const {
  assetDataUtils,
  BigNumber,
  ContractWrappers,
  generatePseudoRandomSalt,
  orderHashUtils,
  signatureUtils
} = require("0x.js");
const { Web3Wrapper } = require("@0x/web3-wrapper");

const { expectEvent } = require("openzeppelin-test-helpers");
//const TruffleContract = require("truffle-contract");
//const Exchange = new TruffleContract(require("@0x/contract-artifacts/artifacts/Exchange.json").compilerOutput);
const CarLoan = artifacts.require("CarLoan");
const FakeDAI = artifacts.require("FakeDAI");
//const IERC20 = artifacts.require("IERC20");

const ZERO = "0";
const MAX_UINT32 = "115792089237316195423570985008687907853269984665640564039457584007913129639935";
const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
const DECIMALS = 18;

contract("Test order contract", (accounts) => {
  const maker = accounts[0].toLowerCase();
  const taker = accounts[1].toLowerCase();
  const admin = accounts[2].toLowerCase();
  const contractWrappers = new ContractWrappers(web3.currentProvider, { networkId: 42 /* kovan */ });
  const makerAssetAmount = new BigNumber(1);
  const takerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(0.1), DECIMALS);
  const web3Wrapper = new Web3Wrapper(web3.currentProvider);

  let daiContract;
  let carLoanContract;
  let exchange;

  console.log("maker address", maker);
  console.log("taker address", taker);
  //Exchange.setProvider(web3.currentProvider);

  beforeEach(async () => {
    //console.log("contractWrappers ...", contractWrappers);
    daiContract = await web3tx(FakeDAI.new, "deploying FakeDAI contract")({ from: admin });
    //daiContract = await IERC20.at("0xc4375b7de8af5a38a93548eb8453a498222c4ff2");
    console.log("daiContract", daiContract.address);
    carLoanContract = await web3tx(CarLoan.new, "deployiny CarLoan contract")({ from: admin });
    //carLoanContract = await CarLoan.at("0x6F629F170873Eeb399738261EA8f3D9bE3d9874c");
    console.log("carLoanContract", carLoanContract.address);
    //exchange = await Exchange.at(contractWrappers.exchange.address);
    //console.log("exchangeAddress", exchange.address);
  });

  it("full flow", async () => {
    const infoUrl = "http://12months.finance/storage/deals/cars/42/contract.pdf";
    const tokenId = `0x${generatePseudoRandomSalt().toString(16)}`;
    const makerAssetData = assetDataUtils.encodeERC721AssetData(carLoanContract.address, tokenId);
    const takerAssetData = assetDataUtils.encodeERC20AssetData(daiContract.address);
    const blockNow = (await web3.eth.getBlock("latest")).timestamp;

    console.log("tokenId", tokenId);
    console.log("makerAssetData", makerAssetData);
    console.log("takerAssetData", takerAssetData);

    // maker get car loan token
    await web3tx(carLoanContract.mint, "mint new car loan token")(maker, tokenId, infoUrl, { from: maker });
    assert.equal(await carLoanContract.tokenMetadata(tokenId), infoUrl);
    assert.equal((await carLoanContract.ownerOf(tokenId)).toLowerCase(), maker);

    console.log("maker erc721Token.setProxyApprovalForAllAsync....");
    await web3Wrapper.awaitTransactionMinedAsync(await contractWrappers.erc721Token.setProxyApprovalForAllAsync(
      carLoanContract.address,
      maker,
      true,
    ));
    console.log("maker erc721Token.setProxyApprovalForAllAsync done");
    assert.isTrue(await carLoanContract.isApprovedForAll.call(maker, contractWrappers.erc721Proxy.address));

    // taker get dai
    await web3tx(daiContract.mint, "mint dai")(taker, takerAssetAmount.toString(), { from: taker });
    assert.equal(await daiContract.balanceOf.call(taker), takerAssetAmount.toString());
    console.log("taker dai balance", web3.utils.fromWei(await daiContract.balanceOf.call(taker), "ether").toString());
    console.log("taker erc20Token.setUnlimitedProxyAllowanceAsync....");
    await web3Wrapper.awaitTransactionMinedAsync(await contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(
      daiContract.address,
      taker
    ));
    console.log("taker erc20Token.setUnlimitedProxyAllowanceAsync done.");
    assert.equal((await daiContract.allowance.call(taker, contractWrappers.erc20Proxy.address)).toString(), MAX_UINT32);

    // maker creates order
    const order = {
      makerAddress: maker,
      takerAddress: NULL_ADDRESS,
      feeRecipientAddress: NULL_ADDRESS,
      senderAddress: NULL_ADDRESS,
      makerAssetAmount: makerAssetAmount.toString(),
      takerAssetAmount: takerAssetAmount.toString(),
      makerFee: ZERO,
      takerFee: ZERO,
      expirationTimeSeconds: new BigNumber(blockNow).plus(3600 * 24 * 30).toString(),
      salt: generatePseudoRandomSalt().toString(),
      makerAssetData,
      takerAssetData,
    };
    console.log("order created", order);
    const orderHashHex = orderHashUtils.getOrderHashHex({
      ...order,
      exchangeAddress: contractWrappers.exchange.address
    });
    const signature = await signatureUtils.ecSignHashAsync(web3.currentProvider, orderHashHex, maker);
    console.log("signature", signature);

    // exchange
    const exchangeGasAmount = 500000;
    console.log("exchange.fillOrderAsync...");
    await web3Wrapper.awaitTransactionMinedAsync(await contractWrappers.exchange.fillOrderAsync({
      ...order,
      exchangeAddress: contractWrappers.exchange.address,
      signature}, takerAssetAmount, taker, {
      gasLimit: exchangeGasAmount,
      shouldValidate: true
    }));
    console.log("exchange.fillOrderAsync done");
    /*await web3tx(exchange.fillOrder, "exchange.fillOrder")(
      order, takerAssetAmount.toString(), signature, {
        from: taker,
        gas: exchangeGasAmount
      }
    );*/
    console.log(await carLoanContract.ownerOf.call(tokenId), (await daiContract.balanceOf.call(maker)).toString(), (await daiContract.balanceOf.call(taker)).toString());
    assert.equal((await carLoanContract.ownerOf.call(tokenId)).toLowerCase(), taker);
    assert.equal((await daiContract.balanceOf.call(maker)).toString(), takerAssetAmount.toString());
  });
});

function web3tx(fn, msg, expects = {}) {
  return async function() {
    console.log(msg + ": started");
    let r = await fn.apply(null, arguments);
    let transactionHash, receipt, tx;
    // in case of contract.sendtransaction
    if (r.tx) {
      transactionHash = r.tx;
      receipt = r.receipt;
    }
    // in case of contract.new
    if (r.transactionHash) {
      transactionHash = r.transactionHash;
      receipt = await web3.eth.getTransactionReceipt(transactionHash);
    }

    tx = await web3.eth.getTransaction(transactionHash);
    r.receipt = receipt;

    // check logs
    if (expects.inLogs) {
      expects.inLogs.forEach(i => {
        expectEvent.inLogs(receipt.logs, i.name, i.args);
      });
    }

    let gasPrice = web3.utils.fromWei(tx.gasPrice, "gwei");
    console.log(`${msg}: done, gas used ${receipt.gasUsed}, gas price ${gasPrice} Gwei`);
    return r;
  };
}

/*function wad4human(wad) {
  return Number(web3.utils.fromWei(wad, "ether")).toFixed(4);
}*/
