export class Board {
  _first;
  _stateTracker;
  _selected;
  _state;
  _initLayout;
  _possibleMoves;
  _stateMoves;
  _textOutput;
  _gameBG;
  _disabled;
  //persistant
  _moveDict = new Map();

  //Global State
  _helper = false;
  _finder = true;
  _editMode = false;

  constructor(layout) {
    this._initLayout = layout;
    this.init();
  }

  get state() {
    return {
      helper: [this._helper, !this._editMode && this._finder && this._helper],
      finder: [this._finder, !this._editMode && this._finder],
      edit: [this._editMode, this._editMode],
    };
  }

  toggleHelper() {
    this._helper = !this._helper;
    this._computeBoard();
  }

  toggleFinder() {
    this._finder = !this._finder;
    this._computeBoard();
  }

  toggleEdit() {
    this._editMode = !this._editMode;
    if (!this._editMode) this._computeBoard();
    else {
      this._deselectAll();
      this._updateBoard();
    }
  }

  _computeBoard() {
    this._deselectAll();
    this._showHints();
    if (this._state) this._showHintsFrom(this._state.row, this._state.column);
    this._updateBoard();
  }

  getTotalNodes(state = this._state) {
    let acc = 0;
    state.forEach((rowArr) => {
      acc += rowArr.reduce((a, v) => (a += v ? 1 : 0), 0);
    });
    return acc;
  }

  getTotalMoves(state = this._state) {
    let acc = 0;

    this._getAllPossibleMoves(() => {
      acc++;
    }, state);
    return acc;
  }

  _addwin(state) {
    this._moveDict.set(this._maptostring(state), true);
    return true;
  }

  _addlose(state) {
    this._moveDict.set(this._maptostring(state), false);
    return false;
  }

  _checkWinning(nodeA, nodeB, state = this._state) {
    const childState = this._projectStateFromMove(state, nodeA, nodeB);
    return this._moveDict.get(this._maptostring(childState));
  }

  _projectStateFromMove(state, nodeA, nodeB) {
    const childState = new Map();
    this._copyMap(state, childState);

    const nodeC = this._getCenterNode(nodeA, nodeB);

    this._mapSet(childState, nodeA.row, nodeA.column, false);
    this._mapSet(childState, nodeC.row, nodeC.column, false);
    this._mapSet(childState, nodeB.row, nodeB.column, true);

    return childState;
  }

  _getAllChildStates(state = this._state) {
    const states = [];

    this._getAllPossibleMoves((nodeA, nodeB) => {
      states.push(this._projectStateFromMove(state, nodeA, nodeB));
    }, state);

    return states;
  }

  _recursiveFindAllWinningMoves(state) {
    // check if in map
    if (this._moveDict.has(this._maptostring(state)))
      return this._moveDict.get(this._maptostring(state));

    // check if it's the last move (win flag)
    if (this.getTotalNodes(state) === 1) return this._addwin(state);

    // check if no moves left (lose flag)
    if (this.getTotalMoves(state) === 0) return this._addlose(state);

    // check children moves
    const moves = this._getAllChildStates(state).map((childState) =>
      this._recursiveFindAllWinningMoves(childState)
    );

    //if a child has a winning move
    return moves.includes(true) ? this._addwin(state) : this._addlose(state);
  }

  init() {
    this._first = true;
    this._stateTracker = [];
    this._selected = false;
    this._disabled = false;
    this._state = new Map();
    this._possibleMoves = [
      { row: -2, col: -2 },
      { row: -2, col: 0 },
      { row: 0, col: -2 },
      { row: 0, col: 2 },
      { row: 2, col: 0 },
      { row: 2, col: 2 },
    ];
    this._stateMoves = [];

    this._layout = this._initLayout.map((v) => new Array(v + 1).fill("filled"));
    this._initLayout.forEach((v, i) =>
      this._state.set(i, new Array(v + 1).fill(true))
    );
    this._textOutput = document.querySelector(".guide-message");
    this._textOutput.textContent = "Click any red dot to start!";
    this._addState();
    this._gameBG = document.querySelector(".game-bg");
    this._gameBG.classList = "game-bg";
    this._updateBoard();
  }

  //Takes the internal data and updates it to the user interface
  _updateBoard() {
    this._layout.forEach((rowArr, row) => {
      rowArr.forEach((className, column) => {
        const node = document.querySelector(
          `.game-btn[data-row="${row}"][data-col="${column}"]`
        );
        const container = document.querySelector(
          `.game-btn-container[data-row="${row}"][data-col="${column}"]`
        );
        this._clearClasses(node);
        this._clearClasses(container);
        node.classList.add(`btn-${className}`);
        container.classList.add(`container-${className}`);
      });
    });
  }

  _addState() {
    //2 dimentional copy
    const arrayCopy = [];
    this._state.forEach((v) => arrayCopy.push(v.map((d) => d)));
    this._stateTracker.push(arrayCopy);
  }

  _clearClasses(el) {
    //btn filled classes
    el.classList.remove("btn-filled");
    el.classList.remove("btn-highlight");
    el.classList.remove("btn-helper");
    el.classList.remove("btn-helper-w");
    el.classList.remove("btn-helper-l");
    //btn empty classes
    el.classList.remove("btn-empty");
    el.classList.remove("btn-empty-highlight");
    el.classList.remove("btn-empty-helper-w");
    el.classList.remove("btn-empty-helper-l");
    el.classList.remove("btn-empty-fill");

    //container filled classes
    el.classList.remove("container-filled");
    el.classList.remove("container-highlight");
    el.classList.remove("container-helper");
    el.classList.remove("container-helper-w");
    el.classList.remove("container-helper-l");
    //container empty classes
    el.classList.remove("container-empty");
    el.classList.remove("container-empty-highlight");
    el.classList.remove("container-empty-helper-w");
    el.classList.remove("container-empty-helper-l");
    el.classList.remove("container-empty-fill");
  }

  _getCenterNode(posA, posB) {
    switch (`${posB.row - posA.row}|${posB.column - posA.column}`) {
      //upper left move
      case `-2|-2`:
        return { row: +posA.row - 1, column: +posA.column - 1 };
      //upper right move
      case `-2|0`:
        return { row: +posA.row - 1, column: +posA.column };
      //left move
      case `0|-2`:
        return { row: +posA.row, column: +posA.column - 1 };
      //right move
      case `0|2`:
        return { row: +posA.row, column: +posA.column + 1 };
      //lower left move
      case `2|0`:
        return { row: +posA.row + 1, column: +posA.column };
      //lower right move
      case `2|2`:
        return { row: +posA.row + 1, column: +posA.column + 1 };
      default:
        return "DnE";
    }
  }

  _maptostring(map) {
    let str = "";
    map.forEach((arr) => arr.forEach((val) => (str += val ? "1" : 0)));
    return str;
  }

  _checkValidMove(posA, posB, state = this._state) {
    //Ensure that both nodes exists
    const posAState = state.get(+posA.row)?.[posA.column] ?? "DnE";
    const posBState = state.get(+posB.row)?.[posB.column] ?? "DnE";

    if (posAState === "DnE" || posBState === "DnE") return false;

    //Check to ensure that they are the proper distance
    const posC = this._getCenterNode(posA, posB);
    const posCState = state.get(+posC.row)?.[posC.column] ?? "DnE";

    if (posC === "DnE" || posCState === "DnE") return false;

    //Check the typing on all three
    if (posAState === false || posBState === true || posCState === false)
      return false;

    //set nodes to selected
    return true;
  }

  _selectPossibleFrom(row, column, callback, state = this._state) {
    this._possibleMoves.forEach(({ row: r, col: c }) => {
      const validMove = this._checkValidMove(
        { row, column },
        { row: +row + r, column: +column + c },
        state
      );
      if (!validMove) return;
      callback({ row, column }, { row: +row + r, column: +column + c });
    });
  }

  _deselectAll() {
    this._state.forEach((rowArr, row) => {
      rowArr.forEach((state, column) => {
        state
          ? (this._layout[row][column] = "filled")
          : (this._layout[row][column] = "empty");
      });
    });
  }

  _showHintsFrom(row, column) {
    if (!this._finder) return;
    this._selectPossibleFrom(row, column, (_, { row: r, column: c }) => {
      if (this._helper) {
        this._layout[r][c] = this._checkWinning(
          { row, column },
          { row: r, column: c }
        )
          ? "empty-helper-w"
          : "empty-helper-l";
      } else {
        this._layout[r][c] = "empty-highlight";
      }
    });
  }
  _select(row, column) {
    this._deselectAll();
    this._showHints();
    this._showHintsFrom(row, column);

    this._layout[row][column] = "highlight";
    this._updateBoard();
    this._selected = { row, column };
  }

  _mapSet(state, row, column, value) {
    const newNode = state.get(+row);
    newNode[column] = value;
    state.set(+row, newNode);
  }
  _removeNode(row, column) {
    this._layout[row][column] = "empty";
    this._mapSet(this._state, row, column, false);
  }

  _addNode(row, column) {
    this._layout[row][column] = "filled";
    this._mapSet(this._state, row, column, true);
  }

  _moveNode(nodeA, nodeB) {
    const nodeC = this._getCenterNode(nodeA, nodeB);

    this._removeNode(nodeA.row, nodeA.column);
    this._removeNode(nodeC.row, nodeC.column);
    this._addNode(nodeB.row, nodeB.column);
    this._addState();
  }

  _getAllPossibleMoves(callback, state = this._state) {
    //move: [{r,c},{r2,c2}]

    state.forEach((rowArr, row) => {
      rowArr.forEach((_, col) => {
        this._selectPossibleFrom(
          row,
          col,
          (nodeA, nodeB) => {
            callback(nodeA, nodeB);
          },
          state
        );
      });
    });
  }

  _nodeStr(node) {
    return `${node.row},${node.column}`;
  }

  _nodeparse(str) {
    const [row, column] = str.split(",");
    return { row: +row, column: +column };
  }

  _showHints() {
    if (!this._finder) return;

    this._stateMoves = [];
    this._getAllPossibleMoves((nodeA, nodeB) => {
      this._stateMoves.push([nodeA, nodeB]);
      this._layout[nodeA.row][nodeA.column] = "helper";
    });

    const moveData = new Map();
    this._stateMoves.forEach((move) => {
      if (!moveData.has(this._nodeStr(move[0]))) {
        moveData.set(this._nodeStr(move[0]), [move]);
      } else {
        moveData.set(this._nodeStr(move[0]), [
          ...moveData.get(this._nodeStr(move[0])),
          move,
        ]);
      }
    });

    if (this._helper) {
      this._recursiveFindAllWinningMoves(this._state);
      moveData.forEach((moves) => {
        const value = moves.reduce((a, move) => {
          if (a) return a;
          return this._checkWinning(move[0], move[1]);
        }, false);
        this._layout[moves[0][0].row][moves[0][0].column] = value
          ? "helper-w"
          : "helper-l";
      });
    }
  }

  _win() {
    this._disabled = true;
    this._textOutput.textContent = this._helper
      ? `You won!`
      : ` You won! Amazing!`;
    this._gameBG.classList.add("game-win");
  }
  _lose() {
    this._disabled = true;
    this._textOutput.textContent = this._helper
      ? `Any red moves is calcuated to lose! Reset to retry!`
      : `There's no more moves left! 
Hit reset to try again.`;
    this._gameBG.classList.add("game-lose");
  }
  _checkgame() {
    this._textOutput.textContent =
      "You can toggle highlighting settings in the options!";

    if (this.getTotalNodes() === 1) this._win();
    else if (this.getTotalMoves() === 0) this._lose();
  }
  _move(endPos) {
    this._deselectAll();
    if (!this._selected) return;
    if (!this._checkValidMove(this._selected, endPos)) return;

    this._moveNode(this._selected, endPos);

    this._showHints();

    this._updateBoard();

    this._checkgame();
  }

  _toggle(row, column) {
    if (this._state.get(+row)[column]) {
      this._removeNode(row, column);
      this._updateBoard();
    } else {
      this._addNode(row, column);
      this._updateBoard();
    }
    this._first = this.getTotalNodes === 15 ? true : false;
  }

  handleClick(row, column) {
    if (this._editMode) {
      this._toggle(row, column);
      return;
    }
    if (this._disabled) return;

    //Handles the very first click
    if (this._first) {
      this._first = false;
      this._removeNode(row, column);
      this._addState();
      this._showHints();

      this._updateBoard();

      this._textOutput.textContent =
        "Click highlighted nodes, then click the click the empty space to capture pieces!";
    }
    //Handles all filled node clicks
    else if (this._state.get(+row)[column]) this._select(row, column);
    //Handles all empty node clicks
    else {
      this._move({ row, column });
    }
  }

  _copyMap(stateA, stateB) {
    stateA.forEach((v, i) => stateB.set(i, v.slice()));
  }

  undo() {
    this._textOutput.textContent =
      "You can toggle highlighting settings in the options!";

    this._gameBG.classList = "game-bg";
    this._disabled = false;

    if (this._stateTracker.length <= 1) return;
    this._stateTracker.pop();

    this._copyMap(
      this._stateTracker[this._stateTracker.length - 1],
      this._state
    );

    this._deselectAll();
    this._showHints();

    this._updateBoard();

    if (this._stateTracker.length <= 1) this._first = true;
  }

  reset() {}
}

export default Board;
