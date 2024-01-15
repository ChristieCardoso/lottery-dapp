// SPDX-License-Identifier: GPL-3.0
import "@openzeppelin/contracts/utils/Strings.sol";

pragma solidity >=0.7.0 <0.9.0;

contract Lottery {
    uint256 public constant ticketPrice = 0.01 ether; // preço do bilhete
    uint256 public constant maxTickets = 100; // máximo de bilhetes por loteria
    uint256 public constant ticketCommission = 0.001 ether; // comissão por bilhete
    uint256 public constant duration = 30 minutes; // Duração definida para a loteria

    uint256 public expiration; // Tempo limite no caso de a loteria não ser realizada.
    address public lotteryOperator; // o criador da loteria
    uint256 public operatorTotalCommission = 0; // saldo total de comissão
    address public lastWinner; // o último vencedor da loteria
    uint256 public lastWinnerAmount; // o valor do último vencedor da loteria

    mapping(address => uint256) public winnings; // mapeia os vencedores para seus ganhos
    address[] public tickets; // array de bilhetes comprados

    // modificador para verificar se o chamador é o operador da loteria
    modifier isOperator() {
        require(
            (msg.sender == lotteryOperator),
            "The caller is not the lottery operator"
        );
        _;
    }

    // modificador para verificar se o chamador é um vencedor
    modifier isWinner() {
        require(IsWinner(), "The caller is not a winner");
        _;
    }

    constructor() {
        // Define o operador da loteria como o endereço do remetente (quem deployou o contrato)
        lotteryOperator = msg.sender;
        
        // Define a expiração inicial para a soma do carimbo de data/hora atual e a duração da loteria
        expiration = block.timestamp + duration;
    }


    // retorna todos os bilhetes
    function getTickets() public view returns (address[] memory) {
        return tickets;
    }

    function getWinningsForAddress(address addr) public view returns (uint256) {
        // Retorna os ganhos associados a um endereço específico
        return winnings[addr];
    }


    function BuyTickets() public payable {
        // Verifica se o valor enviado é um múltiplo do preço do bilhete
        require(
            msg.value % ticketPrice == 0,
            "The value must be a multiple of the ticket price"
        );

        // Calcula o número de bilhetes a serem comprados com base no valor enviado
        uint256 numOfTicketsToBuy = msg.value / ticketPrice;

        // Verifica se a quantidade de bilhetes a ser comprada não excede a quantidade disponível
        require(
            numOfTicketsToBuy <= RemainingTickets(),
            "There are not enough tickets available."
        );

        // Adiciona os bilhetes comprados ao array de bilhetes
        for (uint256 i = 0; i < numOfTicketsToBuy; i++) {
            tickets.push(msg.sender);
        }
    }

    function DrawWinnerTicket() public isOperator {
        // Verifica se algum bilhete foi comprado
        require(tickets.length > 0, "Nenhum bilhete foi comprado");

        // Obtém o hash do bloco para gerar um número aleatório
        bytes32 blockHash = blockhash(block.number - tickets.length);
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, blockHash)));

        // Calcula o bilhete vencedor com base no número aleatório gerado
        uint256 winningTicket = randomNumber % tickets.length;

        // Obtém o endereço do vencedor e atualiza as informações do vencedor e dos ganhos
        address winner = tickets[winningTicket];
        lastWinner = winner;
        winnings[winner] += (tickets.length * (ticketPrice - ticketCommission));
        lastWinnerAmount = winnings[winner];
        operatorTotalCommission += (tickets.length * ticketCommission);

        // Limpa o array de bilhetes, atualiza a expiração e prepara para o próximo sorteio
        delete tickets;
        expiration = block.timestamp + duration;
    }


    function restartDraw() public isOperator {
        // Verifica se não há nenhum bilhete comprado
        require(tickets.length == 0, "It is not possible to restart the draw while it is in progress");

        // Limpa o array de bilhetes e atualiza a expiração para preparar para o próximo sorteio
        delete tickets;
        expiration = block.timestamp + duration;
    }


    function checkWinningsAmount() public view returns (uint256) {
        // Obtém o endereço do chamador da função
        address payable winner = payable(msg.sender);

        // Obtém o valor dos ganhos associado ao endereço do chamador
        uint256 reward2Transfer = winnings[winner];

        // Retorna o valor a ser transferido como ganhos para o chamador
        return reward2Transfer;
    }

    function WithdrawWinnings() public isWinner {
        // Obtém o endereço do chamador da função
        address payable winner = payable(msg.sender);

        // Obtém o valor dos ganhos associado ao endereço do chamador
        uint256 reward2Transfer = winnings[winner];

        // Zera o valor dos ganhos associado ao endereço do chamador
        winnings[winner] = 0;

        // Transfere os ganhos para o endereço do chamador
        winner.transfer(reward2Transfer);
    }


    function RefundAll() public {
        // Verifica se a loteria expirou
        require(block.timestamp >= expiration, "The lottery has not expired yet");

        // Realiza o reembolso para todos os participantes
        for (uint256 i = 0; i < tickets.length; i++) {
            address payable to = payable(tickets[i]);
            tickets[i] = address(0); // Limpa o bilhete
            to.transfer(ticketPrice); // Transfere o valor do reembolso para o participante
        }
        delete tickets; // Limpa o array de bilhetes
    }


   function WithdrawCommission() public isOperator {
        // Obtém o endereço do operador da loteria
        address payable operator = payable(msg.sender);

        // Obtém o valor total da comissão a ser transferido para o operador
        uint256 commission2Transfer = operatorTotalCommission;

        // Zera o saldo total de comissão
        operatorTotalCommission = 0;

        // Transfere o valor total da comissão para o operador
        operator.transfer(commission2Transfer);
    }


   function IsWinner() public view returns (bool) {
        // Verifica se o chamador da função é um vencedor com ganhos maiores que zero
        return winnings[msg.sender] > 0;
    }


    function CurrentWinningReward() public view returns (uint256) {
        // Retorna a recompensa atual calculada com base no número de bilhetes vendidos e no preço do bilhete
        return tickets.length * ticketPrice;
    }


   function RemainingTickets() public view returns (uint256) {
        // Retorna a quantidade restante de bilhetes disponíveis para compra
        return maxTickets - tickets.length;
    }

}
