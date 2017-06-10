/**
 * Created by Administrator on 2017/6/10.
 */
var app = new PIXI.Application(window.innerWidth, window.innerHeight, {backgroundColor: 0xFFCC66});
document.body.appendChild(app.view);
var maxCount = 16;
var currentCount = 0;
var score = 0;
var basicText = new PIXI.Text('2048',{
    fontSize:100
});
basicText.anchor.set(0.5);
basicText.x = app.renderer.width / 2;
basicText.y = app.renderer.height / 7;
app.stage.addChild(basicText);
var scoreText = new PIXI.Text('Score: ' + score, {
    fontSize: 100
});
scoreText.anchor.set(0.5);
scoreText.x = app.renderer.width / 2;
scoreText.y = app.renderer.height / 10 * 9;
app.stage.addChild(scoreText);

var grid = [];
for(var i = 0 ;i < 4;i ++){
    grid [i] = [0,0,0,0];
}
var flushUI = function () {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            drawcell(i, j);
        }
    }
    scoreText.text = 'Score: ' + score;
};
flushUI();
function generateRandomNumber() {
    return Math.floor(Math.random() * 4);
}
function generateRandom() {
    return Math.floor(Math.random() * 4);
}
    function drawcell(row,col) {
        var color = 0x33FF66;
        if (grid[row][col] == 2) {
            color = 0xFFFFCC;
        }
        var graphics = new PIXI.Graphics();
        graphics.beginFill(getColorByNumber(grid[row][col]), 1);
        graphics.drawRect(app.renderer.width / 5 + col * 138, app.renderer.height / 8 * 3 + row * 138, 130, 130);
        app.stage.addChild(graphics);
        if (grid[row][col] != 0) {
            var number = new PIXI.Text(grid[row][col], {
                fontSize:100
            });
            number.anchor.set(0.5);
            number.x = app.renderer.width / 5 + col * 138 + 138 / 2;
            number.y = app.renderer.height / 8 * 3 + row * 138 + 138 / 2;
            app.stage.addChild(number);
        }
    };
function getColorByNumber(number) {
    var colorValue = {
        0: 0xFFFFCC,
        2: 0x00FF99,
        4: 0xFFCCFF
    };
    var color = colorValue[number];
    if (color === undefined) {
        color = 0xff0fff;
    }
    return color;
}
var addRandomCell = function () {
    if (currentCount === maxCount) return;
    var row = generateRandomNumber();
    var col= generateRandomNumber();

    while (grid[row][col] !== 0 ) {
        row = generateRandomNumber();
        col = generateRandomNumber();
    }
    grid[row][col] = 2;
    currentCount++;
};
addRandomCell();
addRandomCell();
flushUI();
var onToRightEventHandler = function () {
    var isChanged = moveCellToRight();
    if (isChanged) {
        addRandomCell();
    }
    flushUI();
    if (checkGameOver()) {
        alert('Game over.');
    }
};
var onToDownEventHandler = function () {
    rotateArray(3);
    var isChanged = moveCellToRight();
    rotateArray(1);
    if (isChanged) {
        addRandomCell();
    }
    flushUI();
    if (checkGameOver()) {
        alert('Game over.');
    }
};
var onToLeftEventHandler = function () {
    rotateArray(2);
    var isChanged = moveCellToRight();
    rotateArray(2);
    if (isChanged) {
        addRandomCell();
    }
    flushUI();
    if (checkGameOver()) {
        alert('Game over.');
    }
};
var onToUpEventHandler = function () {
    rotateArray(1);
    var isChanged = moveCellToRight();
    rotateArray(3);
    if (isChanged) {
        addRandomCell();
    }
    flushUI();
    if (checkGameOver()) {
        alert('Game over.');
    }
};
 document.addEventListener('keydown', function (event) {
 if (event.key === 'ArrowRight') {
 onToRightEventHandler();
 }
 if (event.key === 'ArrowUp') {
 onToUpEventHandler();
 }
 if (event.key === 'ArrowLeft') {
 onToLeftEventHandler();
 }
 if (event.key === 'ArrowDown') {
 onToDownEventHandler();
 }
 });
var hammertime = new Hammer.Manager(document, {
    recognizers: [
        [Hammer.Swipe, {direction: Hammer.DIRECTION_ALL}]
    ]
});
hammertime.on('swiperight', function() {
    onToRightEventHandler();
});
hammertime.on('swipeup', function () {
    onToUpEventHandler();
});
hammertime.on('swipeleft', function () {
    onToLeftEventHandler();
});
hammertime.on('swipedown', function () {
    onToDownEventHandler();
});
function moveCellToRight() {
    var isChanged = false;
    for (var row = 0; row < 4; row++) {
        for (var col = 2; col >= 0; col--) {
            if (grid[row][col] === 0) continue;
            var theEmptyCellIndex = findTheFirstRightCell(row, col);
            if (theEmptyCellIndex !== -1) {
                grid[row][theEmptyCellIndex] = grid[row][col];
                grid[row][col] = 0;
                isChanged = true;
            }
            var currentIndex = theEmptyCellIndex === -1 ? col : theEmptyCellIndex;
            if (grid[row][currentIndex] === grid[row][currentIndex + 1]) {
                grid[row][currentIndex+ 1] += grid[row][currentIndex];
                grid[row][currentIndex] = 0;
                score += grid[row][currentIndex + 1];
                isChanged = true;
                currentCount--;
            }
        }
    }
    return isChanged;
}
function findTheFirstRightCell(row, col) {
    for (var i = 3; i > col; i--) {
        if (grid[row][i] === 0) {
            return i;
        }
    }
    return -1;
}
    function rotateArray(rotateCount = 1) {
        for (var i = 0 ; i < rotateCount; i ++) {
            grid = rotateArrayToRightOnce(grid);
        }
        function rotateArrayToRightOnce(array) {
            return array.map((row1, row) => {
                    return row1.map((item,col) => {
                        return array[3 - col][row];
        })
        })
        }
    }
function checkGameOver() {
    if (currentCount !== maxCount) return false;
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (grid[i][j] === grid[i][j - 1] || grid[i][j] === grid[i][j + 1] ||
                (grid[i-1] && grid[i][j] === grid[i - 1][j]) ||
                (grid[i+1] && grid[i][j] === grid[i + 1][j])
            ) {
                return false;
            }
        }
    }
    return true;
}
