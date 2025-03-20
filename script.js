/* Gameboard */
const GameBoard = (function () {
  // Game board as a single array
  const board = ["", "", "", "", "", "", "", "", ""];

  return {
    getBoard: () => board,
    resetBoard: () => board.fill("")
  };
})();

/* Game Controller */
const GameController = (function () {
  const cells = document.querySelectorAll(".cell");
  const statusText = document.querySelector("#statusText");
  const restartBtn = document.querySelector("#restartBtn");

  // Game win conditions
  const winConditions = [
    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonals
    [0, 4, 8],
    [2, 4, 6]
  ];

  // Players
  const playerOne = { name: "Player One", counter: "X", score: 0 };
  const playerTwo = { name: "Player Two", counter: "O", score: 0 };

  let running = false;
  let activePlayer = playerOne;
  let options = [...GameBoard.getBoard()]; // Clone board state

  function updateStatusText() {
    statusText.textContent = `${activePlayer.name}'s turn`;
  }

  function changePlayer() {
    activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
    updateStatusText();
  }

  function playerGo() {
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restartBtn.addEventListener("click", restartGame);
    updateStatusText();
    running = true;
  }

  function cellClicked() {
    const cellIndex = this.getAttribute("cellIndex");

    if (options[cellIndex] !== "" || !running) {
      return;
    }

    updateCell(this, cellIndex);
    checkWinner();
  }

  function updateCell(cell, index) {
    options[index] = activePlayer.counter;
    cell.textContent = activePlayer.counter;
  }

  function restartGame() {
    options = ["", "", "", "", "", "", "", "", ""];
    cells.forEach(cell => (cell.textContent = ""));
    running = true;
    activePlayer = playerOne;
    updateStatusText();
  }

  function checkWinner() {
    let roundWon = false;

    for (let i = 0; i < winConditions.length; i++) {
      const [a, b, c] = winConditions[i];
      const cellA = options[a];
      const cellB = options[b];
      const cellC = options[c];

      if (cellA === "" || cellB === "" || cellC === "") continue;

      if (cellA === cellB && cellB === cellC) {
        roundWon = true;
        break;
      }
    }

    if (roundWon) {
      statusText.textContent = `${activePlayer.name} wins!`;
      running = false;
      activePlayer.score += 1;
    } else if (!options.includes("")) {
      statusText.textContent = "It's a draw!";
      running = false;
    } else {
      changePlayer();
    }
  }

  playerGo(); // Start the game

  return {
    restartGame,
    checkWinner
  };
})();