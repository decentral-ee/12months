![GitHub Logo](/client/images/screenshot.jpg)
Format: ![Alt Text](url)


# Instant Crypto Loans using your car as collateral

## Inspiration

We are Estonian residents and know our way around electronic ID systems. We decided to leverage the possibilities of 0x markets.
#What it does

Estonian residents (and e-residents) can request a DAI loan through our platform by staking collateral (a car). They then define the details of the loan, like interest rate and payment term, and immediately get access to crypto liquidity on the 0x market.

The user needs to sign a contract using their Estonian Id Card, and the hash of this signed contract is used as metadata to mint an ERC-721 token representing the loan agreement. The ERC-721 token is then put on a sale through our 0x Relayer's order book.

On the buyer side, creditors can see all available loan agreements. While personal data of the seller is not exposed, users can see data from the cars, and check the cars on the Estonian Vehicle registry. They can then select a loan they want to finance, sign the off-chain legal contract, and deposit the required capital (in DAI).

Because the off-chain contract is signed by both parties, the contract is legally enforceable in Estonian courts. We believe this synergy will allow for many Decentralised Finance applications, bringing the potential of global liquidity pools to Estonia.
## How we built it

We built the front-end using react.js and web3.js The back-end (very slim) is in node.js The smart contracts are written in solidity
## Challenges we ran into

Our main challenge was integrating with the 0x protocol, as well as creating a browser client for signatures using the Estonian E-ID
## Accomplishments that we're proud of

Linking off-chain and on-chain dynamics to create new decentralized finance opportunities.
## What's next for 12months

To further enhance the platform we will

    Integrate better market dynamics
        partial funding of contracts
        reverse auction to improve the interest rate for the consumer
        possibly open our relayer to the wider 0x network.
    Get legal advice (our lawyer couldn't come to the hackathon)
    Perfect the details in the off-chain contract
    Minimize the data we hold by using proxy re-encryption, allowing users to share their data directly
    Improve web3 experience and integrate more wallets

Built With

    react
    web3
    solidity
    0x

