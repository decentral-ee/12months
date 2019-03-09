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
const CarLoan = artifacts.require("CarLoan");
const FakeDAI = artifacts.require("FakeDAI");

contract("Test order contract", (accounts) => {
  const DECIMALS = 18;
  const admin = accounts[0].toLowerCase();
  const maker = accounts[1].toLowerCase();
  const taker = accounts[2].toLowerCase();
  const contractWrappers = new ContractWrappers(web3.currentProvider.engine, { networkId: 42 /* kovan */ });
  const makerAssetAmount = new BigNumber(1);
  const takerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(0.1), DECIMALS);

  let daiContract;
  let carLoanContract;

  beforeEach(async () => {
    daiContract = await web3tx(FakeDAI.new, "deploying FakeDAI contract")({ from: admin });
    carLoanContract = await web3tx(CarLoan.new, "deployiny CarLoan contract")({ from: admin });
  });

  it("full flow", async () => {
    const infoUrl = "http://12months.finance/storage/deals/cars/42/contract.pdf";

    // maker get car loan token
    await web3tx(carLoanContract.mint, "mint new car loan token")(infoUrl, { from: maker });
    const mintedTokens = await carLoanContract.getPastEvents("Mint", {
      fromBlock: 0,
      toBlock: "latest",
      filter: {
        owner: maker
      }
    });
    assert.equal(mintedTokens.length, 1);
    const tokenId = mintedTokens[0].args.tokenId;
    assert.equal(await carLoanContract.tokenMetadata(tokenId), infoUrl);

    console.log("maker setUnlimitedProxyAllowanceAsync");
    await contractWrappers.erc721Token.setProxyApprovalForAllAsync(
      carLoanContract.address,
      maker,
      true,
    );


    const makerAssetData = assetDataUtils.encodeERC721AssetData(carLoanContract.address, tokenId);
    const takerAssetData = assetDataUtils.encodeERC20AssetData(daiContract.address);

    // maker creates order
    const order = {
      exchangeAddress: contractWrappers.exchange.address,
      makerAddress: maker,
      takerAddress: NULL_ADDRESS,
      senderAddress: NULL_ADDRESS,
      feeRecipientAddress: NULL_ADDRESS,
      expirationTimeSeconds: 3600 * 24 * 30,
      salt: generatePseudoRandomSalt(),
      makerAssetAmount,
      takerAssetAmount,
      makerAssetData,
      takerAssetData,
      makerFee: ZERO,
      takerFee: ZERO,
    };
    console.log("order created", order);
    const orderHashHex = orderHashUtils.getOrderHashHex(order);
    const signature = await signatureUtils.ecSignHashAsync(web3.currentProvider, orderHashHex, maker);
    const signedOrder = { ...order, signature };

    // taker get dai
    await web3tx(daiContract.mint, "mint dai")(taker, takerAssetAmount.toString(), { from: admin });
    console.log("taker setUnlimitedProxyAllowanceAsync");
    await contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(
      daiContract.address,
      taker
    );

    // exchange
    console.log("exchange.fillOrderAsync");
    await contractWrappers.exchange.fillOrderAsync(signedOrder, takerAssetAmount, taker, {
      gasLimit: 400000,
    });
  });
});

const ZERO = "0";

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

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
