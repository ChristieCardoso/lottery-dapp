# Lottery DApp

This is a decentralized application (DApp) for a smart contract-based lottery on the mumbai blockchain. The app was developed using Next.js and React, with integration with Ethereum smart contracts through the ethers.js library.

## Key Features

### Home Page

The Home page is responsible for displaying information about the lottery, allowing users to purchase tickets, withdraw winnings, and perform other lottery-related operations.

### Ticket Purchase

Users can purchase tickets to participate in the lottery. The ticket price is obtained from the smart contract and the user can purchase 10 tickets at a time.

### Winner Drawing

The smart contract allows the winners to be drawn at random. The contract administrator can trigger the draw through the application dashboard.

### Withdrawal of Winnings and Commissions

Users can withdraw their lottery winnings, and the operator's commission can also be withdrawn through the app.

## Technologies Used

- Next.js
- React
- Thirdweb
- ethers.js
- Solidity (for smart contracts)

## How to Run the Project Locally

1. Clone the repository:

git clone https://github.com/ChristieCardoso/lottery-dapp.git

2. Install dependencies:

cd lottery-dapp
npm install

3. Start the development server:

npm run dev

## Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.