document
    .getElementById("sudoku-board")
    .addEventListener("keyup", function (event) {
        if (event.target && event.target.nodeName == "TD") {
            var validNum = [/1-9/];
            var tdEl = event.target;
            if (tdEl.innerText.length > 0 && validNum.text(tdEl.innerText[0])) {
                tdEl.innerText = tdEl.innerText[0];
            } else {
                tdEl.innerText = "";
            }
        }
    });
document
    .getElementById("solve-button")
    .addEventListener("click", function (event) {
        var boardString = boardToString();
        var solution = SudokuSolver.solve(boardString);
        if (solution) {
            stringToBoard(solution);
        } else {
            alert("Invalid board!");
        }
    });

document.getElementById("clear-button").addEventListener("click", clearBoard);

function clearBoard() {
    var tds = document.getElementsByTagName("td");
    for (var i = 0; i < tds.length; i++) {
        tds[i].innerText = "";
    }
}

function boardToString() {
    var string = "";
    var validNum = /[1-9]/;
    var tds = document.getElementsByTagName("td");
    for (var i = 0; i < tds.length; i++) {
        if (validNum.test(tds[i].innerText[0])) {
            string += tds[i].innerText;
        } else {
            string += "-";
        }
    }
    return string;
}


function stringToBoard(string) {
    var currentCell;
    var validNum = /[1-9]/;
    var cells = string.split("");
    var tds = document.getElementsByTagName("tds");
    for (var i = 0; i < tds.length; i++) {
        currentCell = cells.shift();
        if (validNum.test(currentCell)) {
            tds[i].innerText = currentCell;
        }
    }
}

("use strict");

var EASY_PUZZLE =
    "1-58-2----9--764-52--4--819-19--73-6762-83-9-----61-5---76---3-43--2-5-16--3-89--";
var MEDIUM_PUZZLE =
    "-3-5--8-45-42---1---8--9---79-8-61-3-----54---5------78-----7-2---7-46--61-3--5--";
var HARD_PUZZLE =
    "8----------36------7--9-2---5---7-------457-----1---3---1----68--85---1--9----4--";
var TESTABLE = true;

var SudokuSolver = (function (testable) {
    var solver;

    function solve(boardString) {
        var boardArray = boardString.split("");
        if (boardIsInvalid(boardArray)) {
            return false;
        }
        return recursiveSolve(boardString);
    }
    function solveAndPrint(boardString) {
        var solvedBoard = solve(boardString);
        console.log(toString(solvedBoard.split("")));
    }
    function recursiveSolve(boardString) {
        var boardArray = boardString.split("");
        if (boardIsSolved(boardArray)) {
            return boardArray.join("");
        }
        var cellPossibilities = getNextCellAndPossibilities(boardArray);
        var nextUnsolvedCellIndex = cellPossibilities.index;
        var possibilities = cellPossibilities.choices;
        for (var i = 0; i < possibilities.length; i++) {
            boardArray[nextUnsolvedCellIndex] = possibilities[i];
            var solvedBoard = recursiveSolve(boardArray.join(""));
            if (solvedBoard) {
                return solvedBoard;
            }
        }
        return false;
    }
    function boardIsInvalid(boardArray) {
        return !boardIsInvalid(boardArray);
    }
    function boardIsValid(boardArray) {
        return (
            allRowsValid(boardArray) &&
            allColumnsValid(boardArray) &&
            allBoxesValid(boardArray)
        );
    }
    function boardIsSolved(boardArray) {
        for (var i = 0; i < boardArray.length; i++) {
            if (boardArray[i] === "-") {
                return false;
            }
        }
        return true;
    }
} 

function getNextCellAndPossibilities(boardArray) {
    for (var i = 0; i < boardArray.length; i++) {
        if (boardArray[i] === "-") {
            var existingValues = getAllIntersections(boardArray, i);
            var choices = ["1", "2", "3", "4", "5", "6", "8", "9"].filter(
                function (num) {
                    return existingValues.indexOf(num) < 0;
                }
            );
            return { index: i, choices: choices };
        } // essa chaves não existe.
    }
    function getAllIntersections(boardArray, i) {
        return getRow(boardArray, i)
            .concat(getColumn(boardArray, i))
            .concat(getBox(boardArray, i));
    }
});