document.addEventListener('DOMContentLoaded', () => {
    // Game state variables
    let gameActive = true;
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    
    // DOM elements
    const statusMessage = document.getElementById('status-message');
    const cells = document.querySelectorAll('.cell');
    const restartButton = document.getElementById('restart-button');
    
    // Messages for game status
    const statusMessages = {
        playerTurn: () => `Player ${currentPlayer}'s turn`,
        playerWin: () => `Player ${currentPlayer} wins!`,
        draw: () => `Game ended in a draw!`
    };
    
    // Winning combinations (indexes)
    const winningConditions = [
        [0, 1, 2], // top row
        [3, 4, 5], // middle row
        [6, 7, 8], // bottom row
        [0, 3, 6], // left column
        [1, 4, 7], // middle column
        [2, 5, 8], // right column
        [0, 4, 8], // diagonal top-left to bottom-right
        [2, 4, 6]  // diagonal top-right to bottom-left
    ];
    
    // Function to handle cell click
    function cellClicked(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        // Ignore clicks on cells that are already filled or when game is not active
        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }
        
        // Update the game state and UI
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase());
        
        // Check if the game has been won or ended in a draw
        checkResult();
    }
    
    // Function to check for a win or a draw
    function checkResult() {
        let roundWon = false;
        let winningCombination = [];
        
        // Check all winning conditions
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            
            // Check if cells in the winning condition are filled with the same player's mark
            if (gameState[a] !== '' && 
                gameState[a] === gameState[b] && 
                gameState[a] === gameState[c]) {
                roundWon = true;
                winningCombination = [a, b, c];
                break;
            }
        }
        
        if (roundWon) {
            // Highlight winning cells
            winningCombination.forEach(index => {
                document.querySelector(`[data-index="${index}"]`).classList.add('winning-cell');
            });
            
            statusMessage.textContent = statusMessages.playerWin();
            gameActive = false;
            return;
        }
        
        // Check for a draw
        if (!gameState.includes('')) {
            statusMessage.textContent = statusMessages.draw();
            gameActive = false;
            return;
        }
        
        // If no win or draw, switch player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusMessage.textContent = statusMessages.playerTurn();
    }
    
    // Function to restart the game
    function restartGame() {
        gameActive = true;
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        statusMessage.textContent = statusMessages.playerTurn();
        
        // Reset the UI
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winning-cell');
        });
    }
    
    // Add event listeners
    cells.forEach(cell => {
        cell.addEventListener('click', cellClicked);
    });
    
    restartButton.addEventListener('click', restartGame);
});
