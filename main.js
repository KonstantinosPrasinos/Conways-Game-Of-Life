// Any live cell with two or three live neighbours survives.
// Any dead cell with three live neighbours becomes a live cell.
// All other live cells die in the next generation. Similarly, all other dead cells stay dead.

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const dimensionsOfRect = 10;
const nRows = Math.floor(((window.innerHeight - (window.innerHeight / dimensionsOfRect)) / dimensionsOfRect) - 2);
const nColumns = Math.floor(((window.innerWidth - (window.innerWidth / dimensionsOfRect)) / dimensionsOfRect) - 2);
let mouseCoords = {
    x: 0,
    y: 0
}
let buttonPressed = false;

function buttonToggleRandom(){
    engine.gameIsRandom = !engine.gameIsRandom;
    startGame();
}

function buttonTogglePause() {
    engine.gameIsPaused = !engine.gameIsPaused;
    if (!engine.gameIsPaused) {
        document.getElementById("pauseButton").innerHTML = "Game is NOT paused";
        buttonPressed = false;
    } else {
        document.getElementById("pauseButton").innerHTML = "Game is paused";
        buttonPressed = true;
    }

}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function drawPopulations() {
    let posX = 10;
    let posY = 10;

    engine.blocks.forEach(row => {
        row.forEach(column => {
            if (column.isAlive == 0) {
                ctx.fillStyle = 'white';
                column.x = posX;
                column.y = posY;
            } else {
                ctx.fillStyle = `rgb(${column.roundsAlive <= 255 ? 255 - column.roundsAlive : 0}, 0, 0)`;
            }
            ctx.fillRect(posX, posY, dimensionsOfRect, dimensionsOfRect);
            posX += dimensionsOfRect + 1;
        })
        posX = 10;
        posY += dimensionsOfRect + 1;
    });

    ctx.stroke;
}

function cellDrawing() {
    if (!engine.gameIsRandom) {
        let isDrawing = false;
        canvas.addEventListener('mousedown', () => {
            isDrawing = true;
            engine.gameIsPaused = true;
        });
        canvas.addEventListener('mouseup', () => {
            isDrawing = false;
            if (!buttonPressed) {
                engine.gameIsPaused = false;
            }
        });
        canvas.addEventListener('mousemove', event => {
            if (isDrawing) {
                mouseCoords.x = event.offsetX;
                mouseCoords.y = event.offsetY;

                engine.blocks.forEach(row => {
                    row.forEach(column => {
                        if (column.x <= event.offsetX && column.x + dimensionsOfRect > event.offsetX && column.y <= event.offsetY && column.y + dimensionsOfRect > event.offsetY) {
                            column.isAlive = 1;
                            ctx.fillStyle = `rgb(${column.roundsAlive <= 255 ? 255 - column.roundsAlive : 0}, 0, 0)`;
                            ctx.fillRect(column.x, column.y, dimensionsOfRect, dimensionsOfRect);
                        }
                    })
                });
            }
        });
    }

}

function startGame() {
    engine.tick = 0;
    gameIsPaused = false;
    blocks = new Array(nRows);

    engine.initialiseArray();

    if (engine.gameIsRandom){
        engine.placeRandomPopulations();
        document.getElementById("randomButton").innerHTML = "Cells are placed Randomly";
    } else {
        engine.placeDrawnPopulations();
        document.getElementById("randomButton").innerHTML = "Cells are NOT placed Randomly";
    }

    drawPopulations();

    let ticks = setInterval(() => { engine.handleTicks();}, 10);
    
    cellDrawing();
}

let engine = {
    tick: 0,
    gameIsPaused: false,
    gameIsRandom: false,
    blocks: new Array(nRows),
    initialiseArray: function () {
        for (let i = 0; i < this.blocks.length; i++) {
            this.blocks[i] = new Array(nColumns);
            for (let j = 0; j < this.blocks[i].length; j++) {
                this.blocks[i][j] = { x: j, y: i, isAlive: 0, roundsAlive: 0 };
            }
        }
    },
    placeRandomPopulations: function () {
        for (let i = 0; i < getRandom(nRows * nColumns / 4, nRows * nColumns / 2); i++) {
            this.blocks[getRandom(0, nRows - 1)][getRandom(0, nColumns - 1)].isAlive = 1;
        }
    },
    placeDrawnPopulations: function () {

    },
    handleTicks: function () {
        let toBeDeleted = {
            deletedRow: [],
            deletedColumn: []
        }

        let toBeMadeAlive = {
            aliveRow: [],
            aliveColumn: []
        }

        if (!this.gameIsPaused) {
            for (let i = 0; i < this.blocks.length; i++) {
                for (let j = 0; j < this.blocks[i].length; j++) {
                    if (this.blocks[i][j].isAlive == 1) {
                        let neighbours = this.checkNeighbours(i, j, 1);
                        if (neighbours != 2 && neighbours != 3) {
                            toBeDeleted.deletedRow.push(i);
                            toBeDeleted.deletedColumn.push(j);
                        } else {
                            this.blocks[i][j].roundsAlive++;
                        }
                    } else {
                        let neighbours = this.checkNeighbours(i, j, 1);
                        if (neighbours == 3) {
                            toBeMadeAlive.aliveRow.push(i);
                            toBeMadeAlive.aliveColumn.push(j);
                        }
                    }
                }
            }

            this.deletePopulations(toBeDeleted);
            this.giveLifetoPopulation(toBeMadeAlive);
            drawPopulations();
            this.tick++;
        }
    },
    checkNeighbours: function (row, column, equalTo) {
        let neighbours = 0;

        if (row > 0) {
            if (this.blocks[row - 1][column].isAlive == equalTo) {
                neighbours++;
            }
        }
        if (row < nRows - 1) {
            if (this.blocks[row + 1][column].isAlive == equalTo) {
                neighbours++;
            }
        }
        if (column > 0) {
            if (this.blocks[row][column - 1].isAlive == equalTo) {
                neighbours++;
            }
        }
        if (column < nColumns - 1) {
            if (this.blocks[row][column + 1].isAlive == equalTo) {
                neighbours++;
            }
        }
        if (row > 0 && column > 0) {
            if (this.blocks[row - 1][column - 1].isAlive == equalTo) {
                neighbours++;
            }
        }
        if (row > 0 && column < nColumns - 1) {
            if (this.blocks[row - 1][column + 1].isAlive == equalTo) {
                neighbours++;
            }
        }
        if (row < nRows - 1 && column > 0) {
            if (this.blocks[row + 1][column - 1].isAlive == equalTo) {
                neighbours++;
            }
        }
        if (row < nRows - 1 && column < nColumns - 1) {
            if (this.blocks[row + 1][column + 1].isAlive == equalTo) {
                neighbours++;
            }
        }

        return neighbours;
    },
    deletePopulations: function (toBeDeleted) {
        for (let i = toBeDeleted.deletedRow.length - 1; i >= 0; i--) {
            this.blocks[toBeDeleted.deletedRow[i]][toBeDeleted.deletedColumn[i]].isAlive = 0;
            toBeDeleted.deletedRow.pop();
            toBeDeleted.deletedColumn.pop();
        }
    },
    giveLifetoPopulation: function (toBeMadeAlive) {
        for (let i = toBeMadeAlive.aliveRow.length - 1; i >= 0; i--) {
            this.blocks[toBeMadeAlive.aliveRow[i]][toBeMadeAlive.aliveColumn[i]].isAlive = 1;
            this.blocks[toBeMadeAlive.aliveRow[i]][toBeMadeAlive.aliveColumn[i]].roundsAlive = 1;
            toBeMadeAlive.aliveRow.pop();
            toBeMadeAlive.aliveColumn.pop();
        }
    }
}
startGame();