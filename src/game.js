import React from 'react';

import { EventEmitter } from 'events';

import fontawesome from '@fortawesome/fontawesome'
import { faDiamond, faCircle, faSpider, faCar, faBatteryFull, faCube, faCubes, faDumbbell, faFaceGrinBeamSweat, faKey, faFile } 
  from '@fortawesome/free-solid-svg-icons';

import Board from './board.js'
import Card from './card.js'

/**
 * Game Model
 */
 class Game extends React.Component {

    constructor(props) {
      super(props);
  
      this.ee = new EventEmitter();
  
      this.symbols = [
        "fa-diamond",               // faDiamond
        "fa-circle",                // faCircle
        "fa-spider",                // faSpider
        "fa-car",                   // faCar
        "fa-battery-full",          // faBatteryFull
        "fa-cube",                  // faCube
        "fa-cubes",                 // faCubes
        "fa-dumbbell",              // faDumbbell
        "fa-face-grin-beam-sweat",  // faFaceGrinBeamSweat
        "fa-key",                   // faKey
      ];
      this.colors = [
        "maroon",
        "brown",
        "olive",
        "teal",
        "navy",
        "black",
        "red",
        "orange",
        "yellow",
        "lime",
        "green",
        "cyan",
        "blue",
        "purple",
        "magenta",
      ];
      this.rows = 4;
      this.cols = 6;
      this.totalCards = this.rows * this.cols;
      this.cards = this.generateDeck();
  
      fontawesome.library.add(faDiamond, faCircle, faSpider, faCar, faBatteryFull, faCube, faCubes, faDumbbell, faFaceGrinBeamSweat, faKey, faFile);
  
      this.state = {
        totalPlayers: 2,
        playerTurn: 0,
        scores: new Array(2).fill(0),
        revealedCards: [],
        gameOver: false,
      };
  
      // Listen for card clicked event, which passes the card object as the event
      this.ee.on('cardClicked', (event) => this.showCard(event))
    }
  
    /**
     * Creates all cards, then shuffles them into a 2D array
     */
    generateDeck(){
  
      // Determine how many suites to make & copy array of colors to preserve original data
      let requiredPairs = this.totalCards / 2;
      let colorCopy = [...this.colors];
      let suites = [];
  
      // Create pairs of color and symbols, remove only color, allowing multiple of the same symbol
      for (let i = 0; i < requiredPairs; i ++){
        let colorIndex = Math.floor(Math.random() * colorCopy.length);
        let symbolIndex = Math.floor(Math.random() * this.symbols.length);
  
        suites.push({
          color: colorCopy.splice(colorIndex, 1)[0],
          symbol: this.symbols[symbolIndex],
        })
      }
  
      // Double the suites to create the pairs, and shuffle
      let shuffledDeck = this.shuffle([...suites, ...suites]);
  
      // Convert each pair into a Card Object
      for (let cardIndex = 0; cardIndex < this.totalCards; cardIndex ++){
        shuffledDeck[cardIndex] = new Card({...shuffledDeck[cardIndex], ee: this.ee})
      }
  
      // Push into 2D Array and return to start the game
      let deck = []
      for (let x = 0; x < this.rows; x ++){
        let row = [];
        for (let y = 0; y < this.cols; y ++){
          row.push(shuffledDeck.pop());
        }
        deck.push(row);
      }
  
      return deck;
    }
  
    /**
     * Generic array randomizer, pulled from stackoverflow
     * https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
     * @param {Array} array 
     * @returns 
     */
    shuffle(array) {
      let currentIndex = array.length,  randomIndex;
    
      // While there remain elements to shuffle.
      while (currentIndex !== 0) {
    
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
    
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex], array[currentIndex]];
      }
    
      return array;
    }
  
    /**
     * Flips the card, and adds to the revealed card list. If another is already flipped, compare 
     * and let the player know if they got a point.
     * @param {Card} cardClicked The card selected by the player
     */
    showCard(cardClicked) {
      // If both cards have already been revealed, do nothing
      // If it is Game Over, do nothing
      // If the card is already flipped, do nothing
      if (this.state.revealedCards.length >= 2 || this.state.gameOver || cardClicked.isFlipped()){
        return;
      }
  
      // Get card info and push into the revealed list
      cardClicked.revealCard();
      this.state.revealedCards.push(cardClicked)
  
      // If there are now 2 cards in the list, compare them
      if (this.state.revealedCards.length >= 2) {
        if (this.compareCards()){
          // Success, add a point and the player keeps going
          let scoreCopy = [...this.state.scores]
          scoreCopy[this.state.playerTurn] ++
          this.setState({scores: scoreCopy, revealedCards: []});
          this.isGameOver()
        } else {
          // Failure, next player goes, hide mismatched cards
          setTimeout(() => {
            this.state.revealedCards[0].hideCard()
            this.state.revealedCards[1].hideCard()
            this.setState({revealedCards: []})
            this.nextPlayer()
          }, 2000);
        }
      }
    }
  
    /**
     * Checks if game is over by taking the sum of all player points, and seeing if it is greater than
     * half the total cards
     * @returns True if game is over
     */
    isGameOver() {
      let totalPoints = this.state.scores.reduce(function(a, b) { return a + b; }, 0);
      console.log("TOTAL POINTS", totalPoints);
      console.log("GAME OVER?", totalPoints >= (this.totalCards / 2));
      if (totalPoints >= (this.totalCards / 2)) {
        this.setState({gameOver: true});
      }
    }
  
    /**
     * Advances to the next players turn
     */
    nextPlayer(){
      this.setState({playerTurn: this.state.playerTurn + 1});
      if (this.state.playerTurn >= this.state.totalPlayers -1){
        this.setState({playerTurn: 0});
      }
    }
  
    /**
     * Checks the revealed cards
     * @returns True if revealed cards match
     */
    compareCards(){
      return this.state.revealedCards[0].getSymbol() === this.state.revealedCards[1].getSymbol() && 
              this.state.revealedCards[0].getColor() === this.state.revealedCards[1].getColor();
    }
  
    render(){
      // Determine if status should be player turn, or the victory display
      let status;
      if (this.state.gameOver){
        let winner;
        if (this.state.scores[0] > this.state.scores[1]){
          winner = 1
        } else {
          winner = 2
        }
        status = (<h2>{"Player " + winner + " has won! Congrats!"}</h2>)
      } else {
        status = (<h4>{"It is currently Player " + (this.state.playerTurn + 1) + "'s turn."}</h4>)
      }
  
      return (
        <div className="wrapper">
          <div className="score-board">
            <h3>{"Player 1 Score: " + this.state.scores[0]}</h3>
            <h3>{"Player 2 Score: " + this.state.scores[1]}</h3>
            {status}
          </div>
          <Board
            rows={this.rows}
            cols={this.cols}
            cards={this.cards}
          />
        </div>
      );
    }
  
  }

  export default Game;