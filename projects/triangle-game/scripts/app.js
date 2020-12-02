"use strict";
import Board from "../src/Board.js";
//_____________________________
// Constructs game

const gameContainer = document.querySelector(".game-container");

const constructGame = (columnLengthArr = [0, 1, 2, 3, 4]) => {
  const createRows = () => {
    columnLengthArr.forEach((_, i) => {
      const html = `<div class="row-container row-container-${i}"></div>`;
      gameContainer.insertAdjacentHTML("beforeend", html);
      i++;
    });
  };

  const createButton = (row, col) => {
    const html = `
    <div class="game-btn-container container-filled" data-row="${row}" data-col="${col}">
    <button class="game-btn btn-filled" data-row="${row}" data-col="${col}"></button></div>`;
    gameRows[row].insertAdjacentHTML("beforeend", html);
  };

  const createButtons = () => {
    columnLengthArr.forEach((v, i) => {
      let acc = 0;
      while (acc <= v) {
        createButton(v, acc);
        acc++;
      }
    });
  };

  createRows();
  const gameRows = document.querySelectorAll(".row-container");
  createButtons();
};

//NOT GENERIC
const boardData = [0, 1, 2, 3, 4];

constructGame(boardData);

//_____________________________
// Init

const board = new Board(boardData);

//_____________________________
// node click event

const game = document.querySelector(".game-container");
game.addEventListener("click", (e) => {
  const { row, col } = e.target?.dataset;
  if (!row) return;
  board.handleClick(+row, +col);
});

//_____________________________
// Undo Event

const undoBtn = document.querySelector(".undo-btn");
undoBtn.addEventListener("click", board.undo.bind(board));

//_____________________________
// reset Event

const resetBtn = document.querySelector(".reset-btn");
resetBtn.addEventListener("click", board.init.bind(board));

//_____________________________
// Modal View

const optionBtn = document.querySelector(".option-btn");
const closeModalBtn = document.querySelector(".close-modal");
const modalShade = document.querySelector(".modal-shade");
const modal = document.querySelector(".options-modal");

const closeModal = () => {
  modal.classList.add("hide-modal");
  modalShade.classList.remove("blur-content");
  document.removeEventListener("click", outsideClick);
};

const openModal = (e) => {
  modal.classList.remove("hide-modal");
  modalShade.classList.add("blur-content");
  document.addEventListener("click", outsideClick);

  setButtonValues();
  e.cancelBubble = true;
};

const outsideClick = (e) => {
  if (!e.target.closest(".modal")) closeModal();
};

optionBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);

//_____________________________
// Option buttons

const btnHelper = document.querySelector(".modal-item-btn-helper");
const btnFinder = document.querySelector(".modal-item-btn-finder");
const btnEdit = document.querySelector(".modal-item-btn-edit");

const setButtion = (el, messageArr, value) => {
  value[1] ? el.classList.add("btn-active") : el.classList.remove("btn-active");
  value[0]
    ? (el.textContent = messageArr[0])
    : (el.textContent = messageArr[1]);
};

const setButtonValues = () => {
  const { helper, finder, edit } = board.state;

  setButtion(btnHelper, ["On", "Off"], helper);
  setButtion(btnFinder, ["On", "Off"], finder);
  setButtion(btnEdit, ["On", "Off"], edit);
};

//show calc moves
btnHelper.addEventListener("click", () => {
  board.toggleHelper();
  setButtonValues();
});
//show nodes with moves
btnFinder.addEventListener("click", () => {
  board.toggleFinder();
  setButtonValues();
});
//toggle edit mode
btnEdit.addEventListener("click", () => {
  board.toggleEdit();
  setButtonValues();
});
