const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const nRows = Math.floor((window.innerHeight / 50) - 1);
const nColumns = Math.floor((window.innerWidth / 50) - 1);
let gameIsBeingPlayed = true;

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function drawPopulations() {
    let posX = 10;
    let posY = 10;

    engine.blocks.forEach(row => {
        row.forEach(column => {
            if (column == 0) {
                ctx.fillStyle = 'white';
            } else {
                ctx.fillStyle = 'black';
            }
            ctx.fillRect(posX, posY, 50, 50);
            posX += 51;
        })
        posX = 10;
        posY += 51;
    });

    ctx.stroke;
}

let engine = {
    tick: 0,
    blocks: new Array(nRows),
    initialiseArray: function () {
        for (let i = 0; i < this.blocks.length; i++) {
            this.blocks[i] = new Array(nColumns);
            for (let j = 0; j < this.blocks[i].length; j++) {
                this.blocks[i][j] = 0;
            }
        }
    },
    placePopulations: function () {
        for (let i = 0; i < getRandom(10, 25); i++) {
            this.blocks[getRandom(0, nRows - 1)][getRandom(0, nColumns - 1)] = 1;
        }
    },
    handleTicks: function () {
        if (gameIsBeingPlayed == false) {
            clearInterval(ticks);
            return 'ended';
        }

        let toBeDeleted = {
            deletedRow: [],
            deletedColumn: []
        }

        for (let i = 0; i < this.blocks.length; i++) {
            for (let j = 0; j < this.blocks[i].length; j++) {
                if (this.blocks[i][j] == 1) {
                    let neighbours = this.checkNeighbours(i, j, 1);
                    if (neighbours != 2 && neighbours != 3) {
                        toBeDeleted.deletedRow.push(i);
                        toBeDeleted.deletedColumn.push(j);
                    } 
                }
            }
        }

        this.deletePopulations(toBeDeleted);
        drawPopulations();
    },
    checkNeighbours: function (row, column, equalTo) {
        let neighbours = 0;

            if (this.blocks[row - 1][column] == equalTo) {
                neighbours++;
            }
            if (this.blocks[row + 1][column] == equalTo) {
                neighbours++;
            }
            if (this.blocks[row][column - 1] == equalTo) {
                neighbours++;
            }
            if (this.blocks[row][column + 1] == equalTo) {
                neighbours++;
            }
            if (this.blocks[row - 1][column - 1] == equalTo) {
                neighbours++;
            }
            if (this.blocks[row - 1][column + 1] == equalTo) {
                neighbours++;
            }
            if (this.blocks[row + 1][column - 1] == equalTo) {
                neighbours++;
            }
            if (this.blocks[row + 1][column + 1] == equalTo) {
                neighbours++;
            }

        return neighbours;
    },
    deletePopulations: function (toBeDeleted) {
        for (let i = toBeDeleted.deletedRow.length - 1; i >= 0; i--){
            this.blocks[toBeDeleted.deletedRow[i]][toBeDeleted.deletedColumn[i]] = 0;
            toBeDeleted.deletedRow.pop();
            toBeDeleted.deletedColumn.pop();
        }
    }
}

engine.initialiseArray();
engine.placePopulations();

drawPopulations();

setTimeout(() => {let ticks = setInterval(() => {engine.handleTicks();}, 1000);}, 5000 );

// Any live cell with two or three live neighbours survives.
// Any dead cell with three live neighbours becomes a live cell.
// All other live cells die in the next generation. Similarly, all other dead cells stay dead.

//Have to do:
//Fix issue with edges. maybe using undefined?
//Implement second rule.
//Make into larger scale.
//Add reset for when all populations die.