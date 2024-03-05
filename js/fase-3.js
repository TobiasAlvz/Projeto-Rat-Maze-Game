(function () {
  let canvas = document.querySelector(".canvas-rat");
  let rat = canvas.getContext("2d");
  let arrowLeft = document.querySelector("#arrow-left");
  let arrowUp = document.querySelector("#arrow-up");
  let arrowRight = document.querySelector("#arrow-right");
  let arrowDown = document.querySelector("#arrow-down");

  let tileSize = 10;
  let WIDTH = canvas.width;
  let HEIGHT = canvas.height;

  let food = 5;
  let foodEaten = 0;
  let ratLength = 1;

  let walls = [];
  let rat1 = [];

  let rat1Left = false;
  let rat1Up = false;
  let rat1Right = false;
  let rat1Down = false;

  let countdownInterval;

  let player = {
    x: tileSize + 0,
    y: tileSize + 0,
    width: tileSize,
    height: tileSize,
    speed: 1.5,
    image: new Image(),
  };
  player.image.src = "img/rat.png";

  let cheese = {
    x: 50,
    y: 100,
    width: tileSize,
    height: tileSize,
    image: new Image(),
  };
  cheese.image.src = "img/food.png";

  let maze = [
    [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1,
    ],
    [
      1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2,
      1, 0, 0, 0, 1,
    ],
    [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1,
      1, 0, 1, 0, 1,
    ],
    [
      1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0,
      1, 0, 1, 0, 1,
    ],
    [
      1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
      1, 0, 1, 0, 1,
    ],
    [
      1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
      1, 0, 1, 0, 1,
    ],
    [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1,
      1, 0, 1, 0, 1,
    ],
    [
      1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 1, 0, 1,
    ],
    [
      1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 0, 1,
    ],
    [
      1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0,
      0, 0, 0, 0, 1,
    ],
    [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1,
    ],
    [
      1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 1,
    ],
    [
      1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 0, 1,
    ],
    [
      1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0,
      0, 0, 0, 0, 1,
    ],
    [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1,
    ],
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

  for (let i = 0; i < ratLength; i++) {
    rat1.push({
      x: player.x,
      y: player.y,
      width: tileSize,
      height: tileSize,
    });
  }

  function renderRat() {
    rat.fillStyle = "#757575";
    rat.fillStyle = player.image;
    for (let i = 0; i < rat1.length; i++) {
      rat.fillRect(rat1[i].x, rat1[i].y, rat1[i].width, rat1[i].height);
    }
  }

  function renderCheese() {
    rat.fillStyle = "#FABE13";
    rat.fillRect(cheese.x, cheese.y, cheese.width, cheese.height);
  }

  function checkCollisionWithItem() {
    if (
      player.x < cheese.x + cheese.width &&
      player.x + player.width > cheese.x &&
      player.y < cheese.y + cheese.height &&
      player.y + player.height > cheese.y
    ) {
      randomCheesePosition();
      foodEaten++;

      let lastRat = rat1[rat1.length - 1];
      rat1.push({
        x: lastRat.x,
        y: lastRat.y,
        width: tileSize,
        height: tileSize,
      });

      if (foodEaten === food) {
        greenModal();
        resetGame();
      }
    }
  }

  function greenModal() {
    const modal = document.getElementById("win-rat");
    modal.classList.add("open");

    modal.addEventListener("click", (e) => {
      if (e.target.id == "close-rat" || e.target.id == "win-rat") {
        modal.classList.remove("open");
      }
    });
  }
  function resetGame() {
    foodEaten = 0;
    player.x = tileSize + 1;
    player.y = tileSize + 10;
    rat1.length = ratLength;

    rat1.splice(2, 2, {
      x: player.x + tileSize,
      y: player.y,
      width: tileSize,
      height: tileSize,
    });

    randomCheesePosition();

    clearInterval(countdownInterval);
  }

  function upRat() {
    for (let i = rat1.length - 1; i > 0; i--) {
      rat1[i].x = rat1[i - 1].x;
      rat1[i].y = rat1[i - 1].y;
    }

    rat1[0].x = player.x;
    rat1[0].y = player.y;

    if (
      maze[Math.floor(player.y / tileSize)][Math.floor(player.x / tileSize)] ===
      2
    ) {
      player.x += tileSize;
    }
  }

  function isItemOnWall() {
    for (let i in walls) {
      let wall = walls[i];
      if (
        cheese.x < wall.x + wall.width &&
        cheese.x + cheese.width > wall.x &&
        cheese.y < wall.y + wall.height &&
        cheese.y + cheese.height > wall.y
      ) {
        return true;
      }
    }
    return false;
  }

  function randomCheesePosition() {
    let randomX = Math.floor(Math.random() * (WIDTH - tileSize));
    let randomY = Math.floor(Math.random() * (HEIGHT - tileSize));
    cheese.x = randomX;
    cheese.y = randomY;
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

  arrowLeft.addEventListener("click", function () {
    rat1Left = true;
    rat1Up = false;
    rat1Right = false;
    rat1Down = false;
  });

  arrowUp.addEventListener("click", function () {
    rat1Left = false;
    rat1Up = true;
    rat1Right = false;
    rat1Down = false;
  });

  arrowRight.addEventListener("click", function () {
    rat1Left = false;
    rat1Up = false;
    rat1Right = true;
    rat1Down = false;
  });

  arrowDown.addEventListener("click", function () {
    rat1Left = false;
    rat1Up = false;
    rat1Right = false;
    rat1Down = true;
  });

  window.addEventListener("drop", function (e) {
    e.preventDefault();

    let direction = e.dataTransfer.getData("text/plain");

    switch (direction) {
      case "arrowLeft":
        rat1Left = true;
        rat1Up = false;
        rat1Right = false;
        rat1Down = false;
        break;
      case "arrowUp":
        rat1Left = false;
        rat1Up = true;
        rat1Right = false;
        rat1Down = false;
        break;
      case "arrowRight":
        rat1Left = false;
        rat1Up = false;
        rat1Right = true;
        rat1Down = false;
        break;
      case "arrowDown":
        rat1Left = false;
        rat1Up = false;
        rat1Right = false;
        rat1Down = true;
        break;
    }
  });

  function update() {
    while (isItemOnWall()) {
      randomCheesePosition();
    }

    if (rat1Left && !rat1Right) {
      player.x -= player.speed;
    } else if (rat1Right && !rat1Left) {
      player.x += player.speed;
    } else if (rat1Up && !rat1Down) {
      player.y -= player.speed;
    } else if (rat1Down && !rat1Up) {
      player.y += player.speed;
    }

    for (let i in walls) {
      let wall = walls[i];
      blockRectangle(player, wall);
    }

    upRat();
    checkCollisionWithItem();
  }

  function render() {
    rat.clearRect(0, 0, WIDTH, HEIGHT);
    rat.save();
    for (let row in maze) {
      for (let column in maze[row]) {
        let tile = maze[row][column];
        if (tile == 1) {
          let x = column * tileSize;
          let y = row * tileSize;
          rat.fillStyle = "#1D1313";
          rat.fillRect(x, y, tileSize, tileSize);
        } else if (tile === 2) {
          let x = column * tileSize;
          let y = row * tileSize;
          rat.fillStyle = "#40E1CF";
          rat.fillRect(x, y, tileSize, tileSize);
        }
      }
    }

    renderCheese();
    renderRat();
  }

  function loop() {
    update();
    render();
    requestAnimationFrame(loop, canvas);
  }
  requestAnimationFrame(loop, canvas);
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
