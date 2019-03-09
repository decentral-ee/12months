const CarLoan = artifacts.require("CarLoan");

module.exports = async (callback) => {
    try {
        console.log(`deploying...`);
        const i = await CarLoan.new();
        receipt = await web3.eth.getTransactionReceipt(i.transactionHash);
        console.log(`deployed at ${i.address}, gas used ${receipt.gasUsed}`);
        callback();
    } catch (err) {
        callback(err);
    }
}

