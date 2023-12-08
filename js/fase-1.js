(function () {
  let green = document.querySelector(".green-rat");
  let greenSnake = green.getContext("2d");

  let arrowLeft = document.querySelector("#arrow-left");
  let arrowUp = document.querySelector("#arrow-up");
  let arrowRight = document.querySelector("#arrow-right");
  let arrowDown = document.querySelector("#arrow-down");

  let tileSize = 17;
  let WIDTH = green.width;
  let HEIGHT = green.height;

  let quantidadeMaca = 1;
  let maçasComidas = 0;
  let initialSnakeLength = 1;

  let walls = [];
  let snake = [];

  let snakeLeft = false;
  let snakeUp = false;
  let snakeRight = false;
  let snakeDown = false;

  let countdownInterval;

  let player = {
    x: tileSize + 0,
    y: tileSize + 0,
    width: tileSize,
    height: tileSize,
    speed: 2,
    image: new Image(),
  };
  player.image.src = "img/rat.png";

  let apple = {
    x: 50,
    y: 100,
    width: tileSize,
    height: tileSize,
    image: new Image(),
  };
  apple.image.src = "img/food.png";

  let maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1],
    [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  for (let row in maze) {
    for (let column in maze[row]) {
      let tile = maze[row][column];
      if (tile === 1) {
        let wall = {
          x: tileSize * column,
          y: tileSize * row,
          width: tileSize,
          height: tileSize,
        };
        walls.push(wall);
      }
    }
  }

  for (let i = 0; i < initialSnakeLength; i++) {
    snake.push({
      x: player.x,
      y: player.y,
      width: tileSize,
      height: tileSize,
    });
  }

  function renderSnake() {
    greenSnake.fillStyle = "#FF0000";
    greenSnake.fillStyle = player.image;
    for (let i = 0; i < snake.length; i++) {
      greenSnake.fillRect(
        snake[i].x,
        snake[i].y,
        snake[i].width,
        snake[i].height
      );
    }
  }

  function renderApple() {
    greenSnake.fillStyle = "#7CFC00";
    greenSnake.fillRect(apple.x, apple.y, apple.width, apple.height);
  }

  function checkCollisionWithApple() {
    if (
      player.x < apple.x + apple.width &&
      player.x + player.width > apple.x &&
      player.y < apple.y + apple.height &&
      player.y + player.height > apple.y
    ) {
      generateRandomApplePosition();
      maçasComidas++;

      let lastSnakePart = snake[snake.length - 1];
      snake.push({
        x: lastSnakePart.x,
        y: lastSnakePart.y,
        width: tileSize,
        height: tileSize,
      });

      if (maçasComidas === quantidadeMaca) {
        greenModal();
        resetGame();
      }
    }
  }

  function greenModal() {
    const modal = document.getElementById("win-rat");
    modal.classList.add("open");

    modal.addEventListener("click", (e) => {
      if (e.target.id == "fechar-snake" || e.target.id == "win-rat") {
        modal.classList.remove("open");
      }
    });
  }
  function resetGame() {
    maçasComidas = 0;
    player.x = tileSize + 1;
    player.y = tileSize + 10;
    snake.length = initialSnakeLength;

    snake.splice(2, 2, {
      x: player.x + tileSize,
      y: player.y,
      width: tileSize,
      height: tileSize,
    });

    generateRandomApplePosition();

    clearInterval(countdownInterval);
  }

  function updateSnake() {
    for (let i = snake.length - 1; i > 0; i--) {
      snake[i].x = snake[i - 1].x;
      snake[i].y = snake[i - 1].y;
    }

    snake[0].x = player.x;
    snake[0].y = player.y;

    if (
      maze[Math.floor(player.y / tileSize)][Math.floor(player.x / tileSize)] ===
      2
    ) {
      player.x += tileSize;
    }
  }

  function isAppleOnWall() {
    for (let i in walls) {
      let wall = walls[i];
      if (
        apple.x < wall.x + wall.width &&
        apple.x + apple.width > wall.x &&
        apple.y < wall.y + wall.height &&
        apple.y + apple.height > wall.y
      ) {
        return true;
      }
    }
    return false;
  }

  function generateRandomApplePosition() {
    let randomX = Math.floor(Math.random() * (WIDTH - tileSize));
    let randomY = Math.floor(Math.random() * (HEIGHT - tileSize));
    apple.x = randomX;
    apple.y = randomY;
  }

  function blockRectangle(a, b) {
    let distX = a.x + a.width / 2 - (b.x + b.width / 2);
    let distY = a.y + a.height / 2 - (b.y + b.height / 2);

    let sumWidth = (a.width + b.width) / 2;
    let sumHeight = (a.height + b.height) / 2;

    if (Math.abs(distX) < sumWidth && Math.abs(distY) < sumHeight) {
      let overlapX = sumWidth - Math.abs(distX);
      let overlapY = sumHeight - Math.abs(distY);

      if (overlapX > overlapY) {
        a.y = distY > 0 ? a.y + overlapY : a.y - overlapY;
      } else {
        a.x = distX > 0 ? a.x + overlapX : a.x - overlapX;
      }
    }
  }

  arrowLeft.addEventListener("dragstart", function (e) {
    e.dataTransfer.setData("text/plain", "arrowLeft");
  });

  arrowUp.addEventListener("dragstart", function (e) {
    e.dataTransfer.setData("text/plain", "arrowUp");
  });

  arrowRight.addEventListener("dragstart", function (e) {
    e.dataTransfer.setData("text/plain", "arrowRight");
  });

  arrowDown.addEventListener("dragstart", function (e) {
    e.dataTransfer.setData("text/plain", "arrowDown");
  });

  window.addEventListener("drop", function (e) {
    e.preventDefault();

    let direction = e.dataTransfer.getData("text/plain");

    switch (direction) {
      case "arrowLeft":
        snakeLeft = true;
        snakeUp = false;
        snakeRight = false;
        snakeDown = false;
        break;
      case "arrowUp":
        snakeLeft = false;
        snakeUp = true;
        snakeRight = false;
        snakeDown = false;
        break;
      case "arrowRight":
        snakeLeft = false;
        snakeUp = false;
        snakeRight = true;
        snakeDown = false;
        break;
      case "arrowDown":
        snakeLeft = false;
        snakeUp = false;
        snakeRight = false;
        snakeDown = true;
        break;
    }
  });

  function update() {
    while (isAppleOnWall()) {
      generateRandomApplePosition();
    }

    if (snakeLeft && !snakeRight) {
      player.x -= player.speed;
    } else if (snakeRight && !snakeLeft) {
      player.x += player.speed;
    } else if (snakeUp && !snakeDown) {
      player.y -= player.speed;
    } else if (snakeDown && !snakeUp) {
      player.y += player.speed;
    }

    for (let i in walls) {
      let wall = walls[i];
      blockRectangle(player, wall);
    }

    updateSnake();
    checkCollisionWithApple();
  }

  function render() {
    greenSnake.clearRect(0, 0, WIDTH, HEIGHT);
    greenSnake.save();
    for (let row in maze) {
      for (let column in maze[row]) {
        let tile = maze[row][column];
        if (tile == 1) {
          let x = column * tileSize;
          let y = row * tileSize;
          greenSnake.fillStyle = "#1D1313";
          greenSnake.fillRect(x, y, tileSize, tileSize);
        } else if (tile === 2) {
          let x = column * tileSize;
          let y = row * tileSize;
          greenSnake.fillStyle = "#FFFFFF";
          greenSnake.fillRect(x, y, tileSize, tileSize);
        }
      }
    }

    renderApple();
    renderSnake();
  }

  function loop() {
    update();
    render();
    requestAnimationFrame(loop, green);
  }
  requestAnimationFrame(loop, green);
})();

let selectedDirection = null;

function drag(event) {
  selectedDirection = event.target.src;
  document.querySelector(".g-rat").classList.add("drap");
}

function drop(event) {
  let img = document.createElement("img");
  img.src = selectedDirection;
  document.querySelector(".g-rat").appendChild(img);

  document.querySelector(".g-rat").classList.remove("drap");
  event.preventDefault();
}

function allowDrop(event) {
  event.preventDefault();
}

document.addEventListener("DOMContentLoaded", function () {
  const exitLink = document.getElementById("exitLink");
  const confirmButton = document.getElementById("confirmButton");
  const cancelButton = document.getElementById("cancelButton");
  const modal = document.getElementById("confirmationModal");

  exitLink.addEventListener("click", function (event) {
    event.preventDefault();
    modal.style.display = "flex";
  });

  confirmButton.addEventListener("click", function () {
    console.log("Saindo...");
    closeConfirmationModal();
    window.location.href = exitLink.getAttribute("href");
  });

  cancelButton.addEventListener("click", function () {
    console.log("A saída foi cancelada.");
    closeConfirmationModal();
  });

  function closeConfirmationModal() {
    modal.style.display = "none";
  }
});
