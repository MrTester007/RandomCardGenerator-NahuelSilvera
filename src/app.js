import "bootstrap";
import "./style.css";
import "./assets/img/rigo-baby.jpg";
import "./assets/img/4geeks.ico";

let time_Checkbox = false;
let autoChangeInterval;
let countdownInterval;
window.selectedDeck = "Poker";

const Deck = {
  Poker: deckBuilderPoker(),
  Yorugua: deckBuilderYorugas(),
  Argento: deckBuilderArgento()
};

let currentCardWidth;
let currentCardHeight;
let currentImgWidth;
let currentImgHeight;

function deckBuilderPoker() {
  const values = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K"
  ];

  const suits = ["&hearts;", "&diams;", "&spades;", "&clubs;"];
  const cards = [];
  for (let s = 0; s < suits.length; s++) {
    for (let v = 0; v < values.length; v++) {
      const value = values[v];
      const suit = suits[s];
      cards.push({ value, suit });
    }
  }
  return cards;
}

function deckBuilderYorugas() {
  const values = ["12", "11", "10", "1"];
  const suits = ["Fazo", "Termo", "Vino", "Oro"];
  const cards = [];

  for (let s = 0; s < suits.length; s++) {
    for (let v = 0; v < values.length; v++) {
      const value = values[v];
      const suit = suits[s];
      cards.push({ value, suit });
    }
  }

  cards.push({ value: "Comodin1", suit: "Comodin" });
  cards.push({ value: "Comodin2", suit: "Comodin" });

  return cards;
}

function deckBuilderArgento() {
  const values = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "12"];

  const suits = ["Copa", "Oro", "Espada", "Basto"];
  const cards = [];
  for (let s = 0; s < suits.length; s++) {
    for (let v = 0; v < values.length; v++) {
      const value = values[v];
      const suit = suits[s];
      cards.push({ value, suit });
    }
  }
  return cards;
}

window.randomCard = function randomCard(deckType) {
  const cards = Deck[deckType];
  if (!cards) {
    return;
  }

  const random = Math.floor(Math.random() * cards.length);
  const cardValue = cards[random].value;
  const cardSuit = cards[random].suit;

  const cardContainer = document.getElementById("buttonsContent");
  let cardDiv = cardContainer.querySelector(".card");

  if (!cardDiv) {
    cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    cardContainer.insertBefore(cardDiv, cardContainer.firstChild);
  }

  if (deckType === "Yorugua") {
    const imagePath = `src/assets/img/yoruguas/${cardSuit.toLowerCase()}/${cardValue.toLowerCase()}.png`;

    if (cardSuit === "Comodin") {
      cardDiv.innerHTML = `<img src="${imagePath}" class="card-suit-img"/>`;
    } else {
      cardDiv.innerHTML =
        `<span class="card-value-suit top">${cardValue}</span>` +
        `<img src="${imagePath}" class="card-suit-img"/>` +
        `<span class="card-value-suit bot">${cardValue}</span>`;
    }
  } else if (deckType === "Argento") {
    const imagePath = `src/assets/img/argento/${cardSuit.toLowerCase()}/${cardValue.toLowerCase()}.png`;

    cardDiv.innerHTML = `<img src="${imagePath}" class="card-suit-img"/>`;
  } else {
    cardDiv.innerHTML =
      `<span class="card-value-suit top">${cardValue}${cardSuit}</span>` +
      `<span class="card-suit">${cardSuit}</span>` +
      `<span class="card-value-suit bot">${cardValue}${cardSuit}</span>`;
  }

  if (currentCardWidth && currentCardHeight) {
    cardDiv.style.width = `${currentCardWidth}px`;
    cardDiv.style.height = `${currentCardHeight}px`;
  }

  const cardImg = cardDiv.querySelector(".card-suit-img");
  if (cardImg && currentImgWidth && currentImgHeight) {
    cardImg.style.width = `${currentImgWidth}px`;
    cardImg.style.height = `${currentImgHeight}px`;
  }

  if (time_Checkbox) {
    startCountdown();
  }
};

window.changeCardSize = function changeCardSize(value) {
  const card = document.querySelector(".card");
  const cardImg = document.querySelector(".card-suit-img");
  if (card) {
    const minWidth = 90;
    const maxWidth = 150;
    const minHeight = 110;
    const maxHeight = 200;

    const width = minWidth + (value / 100) * (maxWidth - minWidth);
    const height = minHeight + (value / 100) * (maxHeight - minHeight);

    card.style.width = `${width}px`;
    card.style.height = `${height}px`;

    currentCardWidth = width;
    currentCardHeight = height;

    if (cardImg) {
      const minWidthImg = 85;
      const minHeigthImg = 100;
      const maxWidthImg = 150;
      const maxHeightImg = 200;

      const widthIMG =
        minWidthImg + (value / 100) * (maxWidthImg - minWidthImg);
      const heightIMG =
        minHeigthImg + (value / 100) * (maxHeightImg - minHeigthImg);
      cardImg.style.width = `${widthIMG}px`;
      cardImg.style.height = `${heightIMG}px`;

      currentImgWidth = widthIMG;
      currentImgHeight = heightIMG;
    }
  }
};

window.toggleAutoChange = function toggleAutoChange(checkbox) {
  if (checkbox.checked) {
    time_Checkbox = true;
    startCountdown();
    autoChangeInterval = setInterval(() => {
      window.randomCard(window.selectedDeck);
    }, 10000);
  } else {
    time_Checkbox = false;
    clearInterval(autoChangeInterval);
    clearInterval(countdownInterval);
    const countdownLabel = document.getElementById("countdownLabel");
    if (countdownLabel) {
      countdownLabel.remove();
    }
  }
};

function startCountdown() {
  let countdown = 10;
  const cardContainer = document.getElementById("buttonsContent");
  let countdownLabel = document.getElementById("countdownLabel");

  if (!countdownLabel) {
    countdownLabel = document.createElement("p");
    countdownLabel.id = "countdownLabel";
    countdownLabel.classList.add("text-light");
    cardContainer.insertBefore(countdownLabel, cardContainer.firstChild);
  }

  countdownLabel.innerHTML = `Next card in: ${countdown} seconds`;

  countdownInterval = setInterval(() => {
    countdown -= 1;
    if (countdown <= 0) {
      countdown = 10;
      window.randomCard(window.selectedDeck);
    }
    countdownLabel.innerHTML = `Next card in: ${countdown} seconds`;
  }, 1000);
}

window.setDeckType = function setDeckType(deckType) {
  const deckTypeBtn = document.getElementById("deckTypeBtn");
  deckTypeBtn.innerHTML = deckType;
  deckTypeBtn.dataset.selected = deckType;
  window.selectedDeck = deckType;
  window.randomCard(deckType);
};

document.addEventListener("DOMContentLoaded", () => {
  const deckTypeBtn = document.getElementById("deckTypeBtn");
  const selectedDeckType = deckTypeBtn.dataset.selected;
  window.setDeckType(selectedDeckType);
  window.randomCard(selectedDeckType);
});
