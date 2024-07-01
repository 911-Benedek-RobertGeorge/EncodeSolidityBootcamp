# Week 3 - Group 6

## Forks

Olakunle Dosunmu (LFKRoI): [Olakunle Dosunmu fork](https://github.com/LakunleD/SolidityBootcampGroup6/)

Kifal (AIAwTO): [Kifal fork](https://github.com/Kifal15/SolidityBootcampGroup6)

## Users and addresses

- AIAwTO - @Detergent - Address: 0x46Bec6C328eDA6A432A45b9c0c598A1A6e15C4d3
- 4hO1fl - @Nicolas Beaudouin - Address: 0xC6CbDd7D90458c5e1003DdE243bF1561efAeE516 | 	0xa18d5e848Aca5A5Eaf9cD2d05bAe1D60C2f4884d | 	0x94857C8c49B99Bd1e98E649250c49ba57421928c
- LFKRoI - @lakunle - Address: 0x23e2009fF32160D3357106EAbEe8e09868Ae7FC1
- KPkomO - @kvngeko.eth - Address: 0x8f731049CfE57d67E8c1507B78A41E6EC8cD0731
- bA101G - @Robert - Address: 0x9d1aAF184154E9d6Fc7d138Ee560134732427f7E


## Contracts
Here are the deployed contracts:
- My Token contract: 0x785ad3b5b6a0592f6e5627e9895b392632541ff3
- Tokenized Contract: 0x72F186E758Dd0e9F983CA16a51307E750DBc4eD8

## Report

### Token Contract
- Deploying the token contract from 0xC6CbDd7D90458c5e1003DdE243bF1561efAeE516 (Nico) : https://sepolia.etherscan.io/tx/0x7da4169db5e5867fd6c6aaa763fc6278b025e830bb1c5aa226d68d1f356b0bdb
- Minting for everyone:
   - https://sepolia.etherscan.io/tx/0x744e994e4586d3286dbac77db3eb94969e8971d60e5100852749606cc48dc2d1
   - https://sepolia.etherscan.io/tx/0x84b5007e1c338c6e570b84a209249d050221cc5c66c67fc00117b6097033d3e1
   - https://sepolia.etherscan.io/tx/0x7a3ffc10c505e72a3c6dfe99af4a0eecc17bca549ddcc08536b9dee4baa437b4
   - https://sepolia.etherscan.io/tx/0x33ee0ed3ecb51df9ce3905559d2ed6df2307a47ac1b502c29a4b0a8ce9072d5a
   - https://sepolia.etherscan.io/tx/0xa661b6528523d11bde7ee9cc575151feec89ee138914dd8aa9bbeef9a06c8bd2
   - https://sepolia.etherscan.io/tx/0xf7277252c5f360e2641dc689a6c16640beba265827cdf4784b3a853c234fd864
   - https://sepolia.etherscan.io/tx/0x1f64b5e0d6c23db1c8cdbc906a93f041173ef5a742d86958e00be54d0f05a808

- Self delegation 0xC6CbDd7D90458c5e1003DdE243bF1561efAeE516 (Nico) : https://sepolia.etherscan.io/tx/0x7383bcb076f048720cfd7e99abfe685791e91ca97a056a4bbcfba23548e65777
- Self delegation 0xC6CbDd7D90458c5e1003DdE243bF1561efAeE516 (Nico) : https://sepolia.etherscan.io/tx/0x4966553f85a156113becba879dc4e20c00dc6994f62d4df67a89cddead7eac3e
- Self delegation 0x9d1aAF184154E9d6Fc7d138Ee560134732427f7E (Robert) : https://sepolia.etherscan.io/tx/0x9c1330c783bac50095a1ebce585353901d3f079b6fcf30498f6650dbc6966fd3

- Minting for extra accounts that will delegate to lakunle and detergent :
   - To 0xa18d5e848Aca5A5Eaf9cD2d05bAe1D60C2f4884d (nico) : https://sepolia.etherscan.io/tx/0xa6927dc18e5c46cb23217055e78c8fd7f1271250ebeb4db25254fa6c23ff2f98
   - To 0x94857C8c49B99Bd1e98E649250c49ba57421928c (nico) : https://sepolia.etherscan.io/tx/0x6d350d09a3ede98347c242e17a36638003495da574ca6775c3e9339463d201fb

   - Delegation from 0xa18d5e848Aca5A5Eaf9cD2d05bAe1D60C2f4884d to 0x23e2009fF32160D3357106EAbEe8e09868Ae7FC1 (Lakunle) : https://sepolia.etherscan.io/tx/0x7383bcb076f048720cfd7e99abfe685791e91ca97a056a4bbcfba23548e65777
   - Delegation from 0x94857C8c49B99Bd1e98E649250c49ba57421928c to  0x46Bec6C328eDA6A432A45b9c0c598A1A6e15C4d3 (Detergent) : https://sepolia.etherscan.io/tx/0x7064e8bb7dfcecba21557ded1a51f3684b7f3755ce2d93cbfb2f4a4d6f6f909c


### TokenizedBallot Contract
- Deploying the ballot contract with proposals \['Chocolate Mint', 'Matheus', 'Encode Club Sandwich'\] after all delegation with a blocknumber that occured after all delegation we wanted (even though it wouldn't happen like that in reality) - tx : https://sepolia.etherscan.io/tx/0xc9a42a0391061be8216b041aa50548e1786f5b5fb0b92c9c824e7a6aead694fd

- Vote of 2 for "Chocolate Mint" (index 0) from 0x472c1C8D4A26bBa989Bf3B82feFF3BddA39F8380 (kvngeko.eth 2) : https://sepolia.etherscan.io/tx/0x2bdaa31f8655102d1749daeca57b1addd519758caa7766e81378340d55ea7858
  - Running script to query results give: `Winning Proposal Name: Chocolate Mint, Winning Proposal Index: 0, Vote Count: 0.000000000000000002`
   
- Vote of 1000000 for "Chocolate Mint" from 0x9d1aAF184154E9d6Fc7d138Ee560134732427f7E (Robert) : 
https://sepolia.etherscan.io/tx/0x19a8879b2634bf174b919c587c25b4125487d95e0f6df0878b951cc475c513b3
  - Running script to query results give: `Winning Proposal Name: Chocolate Mint, Winning Proposal Index: 0, Vote Count: 0.00000000001000002`
- Vote of 1000000 for "Chocolate Mint" from 0x9d1aAF184154E9d6Fc7d138Ee560134732427f7E (Robert) : 
https://sepolia.etherscan.io/tx/0x5c9fc44e0aaf1696c314d9b3316d953e1a42924d021b8f38316f28c9a97c56af
  - Running script to query results give: `Winning Proposal Name: Chocolate Mint, Winning Proposal Index: 0, Vote Count: 0.00000000002000002`
- Vote of 1000000000 for "Matheus" from 0x9d1aAF184154E9d6Fc7d138Ee560134732427f7E (Robert) : 
https://sepolia.etherscan.io/tx/0xf8ebfc96606316d97f294372158c326610a2840103d0da5143a08ddd629937bc
  - Running script to query results give: `Winning Proposal Name: Matheus, Winning Proposal Index: 0, Vote Count: 0.000000001`
- Vote of 1000000000 for "Matheus" from 0x9d1aAF184154E9d6Fc7d138Ee560134732427f7E (Robert) : 
https://sepolia.etherscan.io/tx/0x6a7aad9ffc3bab45be7f8d130181d5171dbc405cfc56f56c3a5a830c826f136a
  - Running script to query results give: `Winning Proposal Name: Matheus, Winning Proposal Index: 0, Vote Count: 0.000000002`
- Vote of 3000000000000 for "Matheus" from 0x9d1aAF184154E9d6Fc7d138Ee560134732427f7E (Robert) : 
https://sepolia.etherscan.io/tx/0x29bea2e9450a71be0915aa50c299f7af03f5369c6e9841d373f53a2ade6617a1
  - Running script to query results give: `Winning Proposal Name: Matheus, Winning Proposal Index: 0, Vote Count: 0.000003002`
- Vote of 3000000000000 for "Matheus" from 0x9d1aAF184154E9d6Fc7d138Ee560134732427f7E (Robert) : 
 https://sepolia.etherscan.io/tx/0x817bea039d1a3a97b11c0966151134099475ba033f837a0be1a6e7907da35b16
  - Running script to query results give: `Winning Proposal Name: Matheus, Winning Proposal Index: 0, Vote Count: 0.000006002`

- Vote of 10000000000000000000 (10 Tokens) for "Chocolate Mint" from 0xC6CbDd7D90458c5e1003DdE243bF1561efAeE516 (Nico):  https://sepolia.etherscan.io/tx/0x5066bde06fec5e38765e055c2bd84f04e2d0f0a6f883d31951954f30b7b433ea
  - Running script to query results give: `Winning Proposal Name: Chocolate Mint, Winning Proposal Index: 0, Vote Count: 10.000000000002000002`
     
