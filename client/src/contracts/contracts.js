export const CAR_LOAN = 'CarLoan';
export const DAI = 'DAI';
export const Contracts = {
  [CAR_LOAN]: {
    abi: require('./CarLoan.json').abi,
    address: '0xEbAe3a7309D2875389A814D4269C9f8af853Bc48' // kovan
  },
  [DAI]: {
    abi: require('./IERC20.json').abi,
    address: "0xc4375b7de8af5a38a93548eb8453a498222c4ff2"
  }
}
