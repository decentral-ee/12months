export const CAR_LOAN = 'CarLoan';
export const DAI = 'DAI';
export const Contracts = {
  [CAR_LOAN]: {
    abi: require('./CarLoan.json').abi,
    address: '0x82EB61067F5Ba60e138c688083B9D89ef7dD96f3' // kovan
  },
  [DAI]: {
    abi: require('./IERC20.json').abi,
    address: "0xc4375b7de8af5a38a93548eb8453a498222c4ff2"
  }
}
