/*                                                                                          *
 *   Name of the challenge: Uno Game                                             *
 *            Challenge No: 37                                                   *
 *            Developed by: VHI tech                                             *
 *           Programmed by: Dinesh                                               *
 *     Maintenance history:                                                      *
 *               Ticket No:                                                      *
 *                                                                               */

//screen Declaration
//Input Decalaration
let computerCardsBlock = document.getElementById("computerCardsBlock");
let unoCardsBlock = document.getElementById("unoCardsBlock");
let playerCardsBlock = document.getElementById("playerCardsBlock");
let unoDeck = document.getElementById("deck");
let openDeck = document.getElementById("openDeck");
computerCardsBlock.style.pointerEvents = "none"
//variable declaration
let milliSeconds = 0;    timerSeconds = 0;    timerMinutes = 0;
let computerCardsArray = [];
let playerCardsArray = [];
let optionalCardArray = [];
let buttonsArray = [];
let runTimer;
let isCpuTurn = false;
//constant declaration
const TIME_OUT = 2000;
const DRAW2_COUNT = 2;
const DRAW4_COUNT = 4;
const skipText = `<i class="fa-solid fa-ban"></i>`;
const reverseText = `<i class="fa-sharp fa-solid fa-arrows-rotate"></i>`;
const drawTwo = `<i class="fa-solid fa-plus"></i>2`;
const drawFour = `<i class="fa-solid fa-plus"></i>4`;
const wildCard = `W`;
const namesArray = [  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,  skipText,  reverseText,  drawTwo,  drawFour,  wildCard]
const colorsArray = ["red", "green", "yellow", "blue"];
const unoHidden = {
  cardName: "",
  color: "black",
  cardImage: "images/unocardback1.jpg",
}; //creating hidden uno card
//DOM elements
const colorButtonsDiv = document.createElement("div");
colorButtonsDiv.setAttribute("id", "colorButtonsDiv");
buttonsArray = colorsArray.map((color) => {
  return `<button class="wildButtonsColor" style="background-color:${color}"></button>`;
});
const unoClick = document.createElement("button");
unoClick.classList.add("unoButton");
unoClick.innerText = "Uno";
//main functions
const addCards = (addCardsArray, addCardsDeck) => {
  addCardsDeck === playerCardsBlock
    ? addCardsArray.forEach((card) => {
        createCard(card, addCardsArray, addCardsDeck);
      })
    : addCardsArray.forEach((card) => {
        createCard(unoHidden, addCardsArray, addCardsDeck);
      });
};
const cardsArray = namesArray.flatMap((element, namesIndex) => {   // creating all card objects
  return colorsArray.flatMap((myColor) => {
    return namesArray[namesIndex] === drawFour ||
      namesArray[namesIndex] === wildCard
      ? { cardName: element, color: "black" }
      : element === 0
      ? { cardName: element, color: myColor }
      : [
          { cardName: element, color: myColor },
          { cardName: element, color: myColor },
        ];
  });
});
cardsArray.sort(() => {          //shuffling the elements array
  return 0.5 - Math.random();
}); 
let popedCard = cardsArray.pop();    //taking a card to to show initially in uno deck
while (typeof popedCard.cardName !== "number") {     //to avoid special cards in open deck
  popedCard = cardsArray.pop();
}
playerCardsBlock.classList.add("glowDeck")
function glowDeck(isCpuPlaying){
  if (isCpuPlaying) {
    if(playerCardsBlock.className.includes("glowDeck")){
      computerCardsBlock.classList.add("glowDeck")
      playerCardsBlock.classList.remove("glowDeck")
    }
  }
  else{
    if(computerCardsBlock.className.includes("glowDeck")){
      playerCardsBlock.classList.add("glowDeck")
      computerCardsBlock.classList.remove("glowDeck")
    }
  }
}
//funtion to create card and add eventListener
const createCard = (getCardObject, getTargetArray, targetDeck) => {
  const newCard = document.createElement("div"); 
  newCard.classList.add("allCards");
  newCard.classList.add(`${getCardObject.color}background`);
  const cardText = document.createElement("p");                   //create element inside the inside div
  cardText.innerHTML = `${getCardObject.cardName}`;
  cardText.classList.add(`${getCardObject.color}FontColor`);
  if (getCardObject.cardImage) {
    newCard.innerHTML = `<img src="${getCardObject.cardImage}"/>`;
  }
  newCard.appendChild(cardText);
  targetDeck.appendChild(newCard);
  if (targetDeck !== computerCardsBlock || targetDeck !== openDeck) {
    newCard.addEventListener("click", () => {
        throwCard(getCardObject, getTargetArray, targetDeck);
    })
  }
}
//function that throws the card to deck
const throwToOpenDeck = (passObject, passedArray, passedDeck) => {
  const throwIndex = passedArray.indexOf(passObject);
  openDeck.removeChild(openDeck.children[0]);
  createCard(passObject, passedArray, openDeck);
  passedArray.splice(throwIndex, 1);
  popedCard = passObject;
  passedDeck.innerHTML = "";
  addCards(passedArray, passedDeck);
  removeWildButtons(unoCardsBlock);
};
//function to play skip card and reverse cards
const playSkipCard = (getSkipCard, skipCardsArray, skipCardsBlock) => {
  isCpuTurn =
    skipCardsBlock.getAttribute("id") === "computerCardsBlock" ? true : false;
  throwToOpenDeck(getSkipCard, skipCardsArray, skipCardsBlock);
  popedCard = getSkipCard;
  if(skipCardsBlock.getAttribute("id") === "computerCardsBlock"){
    playerCardsBlock.style.pointerEvents = "none";      unoDeck.style.pointerEvents = "none"
  }
  else{
    playerCardsBlock.style.pointerEvents = "auto";      unoDeck.style.pointerEvents = "auto"
  }
  checkWinner(skipCardsArray);
  glowDeck(isCpuTurn)
  changeTurns();
};
//function to play drawTwo and DrawFour cards
const playDrawCard = (drawTwoArray, drawTwoDeck, count) => {
  isCpuTurn =
    drawTwoDeck.getAttribute("id") === "computerCardsBlock" ? false : true;
  optionalCardArray = cardsArray.splice(-count, cardsArray.length);
  drawTwoArray = [...drawTwoArray,...optionalCardArray]
  drawTwoDeck.getAttribute("id") === "computerCardsBlock"
    ? (computerCardsArray = drawTwoArray)
    : (playerCardsArray = drawTwoArray);
  drawTwoDeck.innerHTML = "";
  addCards(drawTwoArray, drawTwoDeck);
  optionalCardArray = [];
  drawTwoDeck.getAttribute("id") === "computerCardsBlock"
    ? (playerCardsBlock.style.pointerEvents = "auto")
    : (playerCardsBlock.style.pointerEvents = "none");
  drawTwoDeck.getAttribute("id") === "computerCardsBlock"
    ? checkWinner(playerCardsArray)
    : checkWinner(computerCardsArray);
    glowDeck(isCpuTurn)
  changeTurns();
};
//function to show four colors to choose on wild card
const showColorButtons = () => {
  unoDeck.style.pointerEvents = "none";
  colorButtonsDiv.innerHTML = buttonsArray.reduce(
    (sum, colorText) => sum + colorText,
    ""
  );
  unoCardsBlock.appendChild(colorButtonsDiv);
};
//function that recieves the selected color and shows the color to draw for opponent
const selectWildCard = (getColor) =>{
  popedCard = { cardName: "wild", color: getColor };
  colorButtonsDiv.innerHTML = "";
  let selectedColor = colorsArray.indexOf(getColor);
  let targetButton = buttonsArray[selectedColor];
  colorButtonsDiv.innerHTML = targetButton;
  isCpuTurn = true;
}
//function for cpu to play the wildcard
const playWildCard = (getWildCard, getWildArray, getWildDeck) => {
  throwToOpenDeck(getWildCard, getWildArray, getWildDeck);
  let randomNum = Math.floor(Math.random() * 4);
  randomColor = buttonsArray[randomNum];
  popedCard = { name: "wild", color: colorsArray[randomNum] };
  unoCardsBlock.appendChild(colorButtonsDiv);
  removeWildButtons(colorButtonsDiv);
  colorButtonsDiv.innerHTML = randomColor;
  checkWinner(getWildArray);
};
//function to change turn between player and computer
const changeTurns = () => {
  if (isCpuTurn) {
    setTimeout(playComputer, TIME_OUT);
  }
};
//function to collect the card taken from deck if doesn't matches deck card
const collectCard = (previousCard, popedCard) => {
  playerCardsArray.push(popedCard);
  popedCard = previousCard;
  playerCardsBlock.innerHTML = "";
  addCards(playerCardsArray, playerCardsBlock);
  isCpuTurn = true;
  glowDeck(isCpuTurn)
  changeTurns();
  playerCardsBlock.style.pointerEvents = "auto";
};
//funtion to remove the exist buttons and div to avoid multiple appends
const removeWildButtons = (getDiv) => {
  if (getDiv.children.length) {
    if (
      getDiv.lastElementChild.getAttribute("id") === "colorButtonsDiv" ||
      getDiv.lastElementChild.getAttribute("class") === "wildButtonsColor"
    ) {
      getDiv.removeChild(getDiv.lastElementChild);
    } else if (getDiv.getAttribute("class") === "unoButton") {
      getDiv.remove();
    }
  }
};
//funtion that does wildcard functionalities
const doWildCardFuntions = (clickedCard) => {
  removeWildButtons(unoCardsBlock);
  removeWildButtons(colorButtonsDiv);
  throwToOpenDeck(clickedCard, playerCardsArray, playerCardsBlock);
  showColorButtons(clickedCard, playerCardsArray, playerCardsBlock);
};
//starts the game
startGame();
function startGame() {
  let cardsDrawn = 0;
  while (cardsDrawn < 7) {
    cardsDrawn++;
    let cardForPlayer = cardsArray.pop();
    let cardForCpu = cardsArray.pop();
    playerCardsArray.push(cardForPlayer);
    computerCardsArray.push(cardForCpu);
    createCard(cardForPlayer, playerCardsArray, playerCardsBlock);
    createCard(unoHidden, computerCardsArray, computerCardsBlock);
  }
  createCard(popedCard, [], openDeck);
}
//funtion that checks the matches and throws to the deck
function throwCard(clickedCard, getArray, getDeck) {
  clearInterval(runTimer);
  //function to run global timer
  runTimer = setInterval(()=> {
    timerMinutes = parseInt(timerMinutes)
    timerSeconds = parseInt(timerSeconds)
    milliSeconds = parseInt(milliSeconds)
    milliSeconds++;
    if (milliSeconds > 99) {
      timerSeconds++;
      milliSeconds = 0;
    } else if (timerSeconds > 59) {
      timerMinutes++;
      timerSeconds = 0;
    }
    timerMinutes = timerMinutes < 10 ? "0" + timerMinutes : timerMinutes;
    timerSeconds = timerSeconds < 10 ? "0" + timerSeconds : timerSeconds;
    milliSeconds = milliSeconds < 10 ? "0" + milliSeconds : milliSeconds;
    document.getElementById(
      "timer"
    ).innerHTML = `${timerMinutes}:${timerSeconds}:${milliSeconds}`;
  }, 10)
  //logics for throwing card
  if (getDeck === playerCardsBlock || getDeck === unoDeck) {
    setTimeout(() => {
      checkPenalty(playerCardsArray, playerCardsBlock);
    }, 100);
  }
  if (clickedCard.cardName === wildCard) {
    throwWildCard(clickedCard, getArray, getDeck)
  } else if (clickedCard.cardName === drawFour) {
    if (getDeck === computerCardsBlock) {
      removeWildButtons(unoCardsBlock);
      removeWildButtons(colorButtonsDiv);
      playWildCard(clickedCard, computerCardsArray, computerCardsBlock);
      setTimeout(playDrawCard(playerCardsArray, playerCardsBlock, 4), TIME_OUT);
    } else {
      doWildCardFuntions(clickedCard);
      setTimeout(
        playDrawCard(computerCardsArray, computerCardsBlock, 4),
        TIME_OUT
      );
      unoDeck.style.pointerEvents = "none";
      colorButtonsDiv.addEventListener("click", (event) => {
        let target = event.target;
        let targetColor;
        if (target.getAttribute("class") === "wildButtonsColor") {
          targetColor = target.style.backgroundColor;
          selectWildCard(targetColor)
        } else {
          event.preventDefault();
        }
        unoDeck.style.pointerEvents = "auto";
      })
    }
  } else {
    if (
      clickedCard.cardName === skipText &&
      (clickedCard.color === popedCard.color || popedCard.cardName === skipText)
    ) {
      playSkipCard(clickedCard, getArray, getDeck);
    } else if (
      clickedCard.cardName === reverseText &&
      (clickedCard.color === popedCard.color ||
        popedCard.cardName === reverseText)
    ) {
      playSkipCard(clickedCard, getArray, getDeck);
    } else if (
      clickedCard.cardName === drawTwo &&
      (clickedCard.color === popedCard.color || popedCard.cardName === drawTwo)
    ) {
      throwToOpenDeck(clickedCard, getArray, getDeck);
      getDeck === computerCardsBlock
        ? setTimeout(
            playDrawCard(playerCardsArray, playerCardsBlock, 2),
            TIME_OUT
          )
        : setTimeout(
            playDrawCard(computerCardsArray, computerCardsBlock, 2),
            TIME_OUT
          );
    } else if (
      popedCard.cardName === clickedCard.cardName ||
      popedCard.color === clickedCard.color
    ) {
      if (getDeck === computerCardsBlock) {
        setTimeout(
          throwToOpenDeck(clickedCard, computerCardsArray, computerCardsBlock),
          TIME_OUT
        );
        isCpuTurn = false;
        glowDeck(isCpuTurn)
        checkWinner(computerCardsArray);
        playerCardsBlock.style.pointerEvents = "auto";
        unoDeck.style.pointerEvents = "auto";
      } else {
        playerCardsBlock.style.pointerEvents = "none";
        unoDeck.style.pointerEvents = "none";
        throwToOpenDeck(clickedCard, playerCardsArray, playerCardsBlock);
        isCpuTurn = true;
        checkWinner(getArray);
        glowDeck(isCpuTurn)
        changeTurns();
      }
    }
    else if(getDeck === computerCardsBlock){
      isCpuTurn = false;
      glowDeck(isCpuTurn)
    }
  }
}
//function to play the computer
function playComputer() {
  const searchCard = computerCardsArray.find((element) => {
    return (
      element.cardName === popedCard.cardName ||
      element.color === popedCard.color ||
      element.cardName === wildCard ||
      element.cardName === drawFour
    );
  });
  if (searchCard) {
    throwCard(searchCard, computerCardsArray, computerCardsBlock);
  } else {
    const insertCard = cardsArray.pop();
    computerCardsArray.push(insertCard);
    setTimeout(() => {
      createCard(unoHidden, computerCardsArray, computerCardsBlock);
    }, 1000);
    setTimeout(() => {
      throwCard(insertCard, computerCardsArray, computerCardsBlock);
    }, 2000);
    playerCardsBlock.style.pointerEvents = "auto";
    unoDeck.style.pointerEvents = "auto";
  }
}
// to find matches while taking card from deck
const matchesArray = [wildCard, drawFour, skipText, reverseText, drawTwo];
let checkTurn = recievedCard => matchesArray.some(specialText =>  recievedCard.cardName !== wildCard ? recievedCard.cardName == specialText : false)
//function to get cards from uno deck
function getNewCard(event) {
  const checkExists = playerCardsArray.some((element) => {        //ensures player dont have matching cards
    return (
      element.cardName === popedCard.cardName || element.color === popedCard.color
    );
  });
  if (checkExists) {
    event.preventDefault();
  } else {
    playerCardsBlock.style.pointerEvents = "none";
    unoDeck.style.pointerEvents = "none";
    let previousCard = popedCard;
    popedCard = cardsArray.pop();
    let matchFound =
      popedCard.cardName === wildCard ||
      popedCard.cardName === drawFour ||
      previousCard.cardName === popedCard.cardName ||
      previousCard.color === popedCard.color;
    if (!matchFound) {
      collectCard(previousCard, popedCard);
      popedCard = previousCard;
    } else {
      unoDeck.style.pointerEvents = "none";
      playerCardsArray.push(popedCard);
      let optionalCard = document.createElement("div");
      optionalCard.classList.add("optionalDiv");
      createCard(popedCard, playerCardsArray, optionalCard);
      optionalCard.children[0].style.pointerEvents = "none";
      unoCardsBlock.insertBefore(optionalCard, unoDeck);
      let buttonsDiv = document.createElement("div");
      let passButton = document.createElement("button");
      passButton.innerText = "Pass";
      createCard(popedCard, playerCardsArray, optionalCard);
      optionalCard.children[1].classList.add("playButton");
      optionalCard.children[1].innerText = "Play";
      optionalCard.appendChild(passButton);
      unoCardsBlock.insertBefore(buttonsDiv, optionalCard);
      optionalCard.children[1].addEventListener("click", () => {
      optionalCard.remove();
        if (
          checkTurn(popedCard)
        ) {
          unoDeck.style.pointerEvents = "auto";
        }
      });
      passButton.addEventListener("click", () => {
        playerCardsBlock.innerHTML = "";
        addCards(playerCardsArray, playerCardsBlock);
        optionalCard.remove();
        unoDeck.style.pointerEvents = "auto";
        isCpuTurn = true;
        glowDeck(isCpuTurn)
        changeTurns();
      });
    }
  }
}
//function to throw wild card
function throwWildCard(clickedCard, getArray, getDeck){
  if (getDeck === computerCardsBlock) {
    removeWildButtons(unoCardsBlock);
    removeWildButtons(colorButtonsDiv);
    playWildCard(clickedCard, computerCardsArray, computerCardsBlock);
    checkWinner(computerCardsArray);
    playerCardsBlock.style.pointerEvents = "auto";
    unoDeck.style.pointerEvents = "auto";
  } else {
    doWildCardFuntions(clickedCard);
    colorButtonsDiv.addEventListener("click", (event) => {
      let target = event.target;
      let targetColor;
      if (target.getAttribute("class") === "wildButtonsColor") {
        targetColor = target.style.backgroundColor;
        selectWildCard(targetColor)
        checkWinner(getArray);
        glowDeck(isCpuTurn)
        changeTurns();
      } else {
        event.preventDefault();
      }
      unoDeck.style.pointerEvents = "auto";
    });
    playerCardsBlock.style.pointerEvents = "none";
    unoDeck.style.pointerEvents = "none";
  }
}
//function for check winner
const checkWinner = (checkArray) => {
  if (checkArray.length < 1 || timerMinutes >= 5) {
    let winnerText = document.createElement("h2");
    let scoreText = document.createElement("h2");
    finalScore =
      playerCardsArray && computerCardsArray
        ? score(computerCardsArray) < score(playerCardsArray)
          ? score(playerCardsArray)
          : score(computerCardsArray)
        : checkArray === playerCardsArray
        ? score(computerCardsArray)
        : score(playerCardsArray);
    document.body.appendChild(winnerText);
    document.body.style.pointerEvents = "none";
    winnerText.innerHTML =
      playerCardsArray && computerCardsArray
        ? score(playerCardsArray) < score(computerCardsArray)
          ? `Player won the game`
          : `Computer won the game`
        : checkArray === playerCardsArray
        ? `Player won the game`
        : `Computer won the game`;
    scoreText.innerHTML = `Score: ${finalScore}`;
    unoCardsBlock.appendChild(scoreText);
    computerCardsBlock.innerHTML = "";
    computerCardsArray.forEach((card) =>
      createCard(card, computerCardsArray, computerCardsBlock)
    );
    clearInterval(runTimer);
    isCpuTurn = false;
    glowDeck(isCpuTurn)
    changeTurns();
  }
};
//function to find score
const score = (givenArray) =>
  givenArray.reduce((sum, element) => {
    return element.cardName === wildCard || element.cardName === drawFour
      ? sum + 50
      : typeof element.cardName !== "number"
      ? sum + 20
      : sum + parseInt(element.cardName);
  }, 0);
//function to fthrow penalty
const throwPenalty = (playerCardsArray, playerCardsBlock) =>
  playDrawCard(playerCardsArray, playerCardsBlock, 2);         //throws penalty to player
//function to check penalty
const checkPenalty = () => {
  if (playerCardsArray.length === 1) {
    playerCardsBlock.style.pointerEvents = "none"
    unoClick.style.backgroundColor = "blueviolet"
    unoCardsBlock.insertBefore(unoClick, unoCardsBlock.children[0]);
    let unoTimerText = document.createElement("h3")
    unoCardsBlock.insertBefore(unoTimerText, unoCardsBlock.children[0]);
    let unoMilliSeconds = 99,   unoTimerSeconds= 1
    let unoTimer = setInterval(()=>{
        unoTimerSeconds = parseInt(unoTimerSeconds)
        unoMilliSeconds = parseInt(unoMilliSeconds)
        unoMilliSeconds--;
        if (unoMilliSeconds <0) {
          unoTimerSeconds--;
          unoMilliSeconds = 99;
        }
        unoTimerSeconds = unoTimerSeconds < 10 ? "0" + unoTimerSeconds : unoTimerSeconds;
        unoMilliSeconds = unoMilliSeconds < 10 ? "0" + unoMilliSeconds : unoMilliSeconds;
        unoTimerText.innerHTML = `${unoTimerSeconds}:${unoMilliSeconds}`
    },10)
    const penaltyTimeOut = setTimeout(() => {
      throwPenalty(playerCardsArray, playerCardsBlock);
      clearInterval(unoTimer);
      unoTimerText.remove()
      unoClick.remove();
      playerCardsBlock.style.pointerEvents = "auto";
    }, TIME_OUT);
    unoClick.addEventListener("click", () => {
      unoClick.style.backgroundColor = "green";
      clearInterval(unoTimer);
      unoTimerText.remove()
      clearTimeout(penaltyTimeOut);
      setTimeout(() => {
        unoClick.remove();
        playerCardsBlock.style.pointerEvents = "auto";
      }, TIME_OUT);
    });
  }
};