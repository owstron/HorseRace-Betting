var results = []; //To store the results
var numLaps = 1;

class Horse {
    constructor(id, x, y) {
        this.id = id; // Id of horse
        this.element = document.getElementById(id); // Getting the horse element
        this.originX = x; // The initial X coordinates of the horse
        this.originY = y; // The initial Y coordinates of the horse
        this.x = x; // Current X coordinates of the horse
        this.y = y; // Current Y coordinates of the horse
        this.odds = this.oddsGenerator(); // The odds on return on this horse
        this.laps = 0; // Number of laps the horse has completed
        this.lastTurn = false;
        this.speed = this.speedGenerator(); // Speed of the horse, used to set time for starting timeout function
        this.initialTime = 0; // Initial time of starting the game
        this.finalTime = 0; // Final time of ending the race
        this.time = 0; // Time taken to complete a lap
        this.showOdds();
    }

    showOdds() {
        // Displays odds of the horse in the odds table
        document.getElementById(`${this.id}-odds`).innerText = `1 to ${this.odds}`;
    }

    oddsGenerator() {
        // Generates odds randomly from 1 to 16
        return Math.floor(Math.random() * 16 + 1);
    }

    speedGenerator() {
        // Generates the speed. 1000 is divided by speed in for each timeout function
        return Math.random() * 10 + 20;
    }

    moveRight() {
        // Moves the horse object to the right
        let horse = this;

        setTimeout(function() {
            horse.x++;
            horse.element.style.left = horse.x + 'vw';
            horse.element.className = 'horse runRight';

            if (horse.x > 72) {
                if (Math.random() > 0.7 || horse.x > 80) {
                    // Randomly selecting a turn after the horse reaches the perpendicular part of track
                    // If the horse does not turn till the end of track, it will turn
                    horse.speed = horse.speedGenerator();
                    horse.moveUp();
                } else {
                    horse.moveRight();
                }
            } else {
                if (horse.lastTurn === true && horse.x > 22) {
                    if (horse.x >= 30) {
                        horse.lastTurn = false;
                        if (horse.laps == numLaps) {
                            horse.finalTime = new Date().getTime();
                            horse.raceEnd();
                        } else {
                            horse.moveRight();
                        }
                    } else {
                        horse.moveRight();
                    }
                } else {
                    horse.moveRight();
                }
            }
        }, 1000/horse.speed);
    }

    moveLeft() {
        // Moves the object towards left
        let horse = this;

        setTimeout(function() {
            horse.x--;
            horse.element.style.left = horse.x + 'vw';
            horse.element.className = 'horse runLeft';

            if (horse.x < 10) {
                if (Math.random() > 0.7 || horse.x < 3) {
                    // Randomly selecting a turn after the horse reaches the perpendicular part of track
                    // If the horse does not turn till the end of track, it will turn
                    horse.speed = horse.speedGenerator();
                    horse.moveDown();
                } else {
                    horse.moveLeft();
                }
            } else {
                horse.moveLeft();
            }
        }, 1000/horse.speed);
    }

    moveUp() {
        // Move the object in upwards direction
        let horse = this;

        setTimeout(function() {
            horse.y--;
            horse.element.style.top = horse.y + 'vh';
            horse.element.className = 'horse runUp';

            if (horse.y < 16) {
                if (Math.random() > 0.7 || horse.y < 3) {
                    // Randomly selecting a turn after the horse reaches the perpendicular part of track
                    // If the horse does not turn till the end of track, it will turn
                    horse.speed = horse.speedGenerator(); // Changing speed while turning direction.
                    horse.moveLeft();
                } else {
                    horse.moveUp();
                }
            } else {
                horse.moveUp();
            }
        }, 1000/horse.speed);
    }

    moveDown() {
        // Move the object in downwards direction.
        let horse = this;

        setTimeout(function() {
            horse.y++;
            horse.element.style.top = horse.y + 'vh';
            horse.element.className = 'horse runDown';

            if (horse.y > 68) {
                if (Math.random() > 0.7 || horse.y > 79) {
                    // Randomly selecting a turn after the horse reaches the perpendicular part of track
                    // If the horse does not turn till the end of track, it will turn
                    horse.speed = horse.speedGenerator();
                    horse.laps++;
                    horse.lastTurn = true;
                    horse.moveRight();
                } else {
                    horse.moveDown();
                }
            } else {
                horse.moveDown();
            }
        }, 1000 / horse.speed);
    }

    raceEnd() {
        // Ends the race by stopping the horse, adding it to results array for displaying and calculating time.
        let horse = this;

        horse.element.className = 'horse standRight';
        horse.calcRunTime();
        results.push(horse);
    }

    calcRunTime() {
        // Calculate time taken by the horse to complete the race
        let horse = this;
        horse.time = (horse.finalTime - horse.initialTime) / 1000;
    }

    run() {
        // Starts the race by moving the horse to the right
        let horse = this;

        horse.initialTime = new Date().getTime();
        horse.moveRight();
    }
}


document.addEventListener('DOMContentLoaded', function() {

    // Initializing the horses.
    let horse1 = new Horse('horse1',20,68);
    let horse2 = new Horse('horse2',20,72);
    let horse3 = new Horse('horse3',20,76);
    let horse4 = new Horse('horse4',20,80);

    let startButton = document.getElementById('start');
    // Event Listener to to listen to clicking of startButton
    startButton.addEventListener('click', function(e) {
        emptyScoreBoard();
        resetGame();

        let availableFunds = parseFloat(document.getElementById('funds').innerText); // Stores available funds
        let betAmount = parseFloat(document.getElementById('amount').value); // Stores amount bet on the horse
        let horseElement = document.getElementById('bethorse'); // Stores the DOM element of selected horse. It takes the select class
        let betHorse = horseElement.options[horseElement.selectedIndex].value; // stores the ID of the selected horse
        numLaps = parseInt(document.getElementById('laps').value); // Stores the number of laps for race

        if (betAmount > availableFunds && betAmount < 0) {
            alert('You do not have enough funds');
        } else {
            if (numLaps < 1) {
                alert ('Number of laps entered is invalid!')
            } else {
                // Disabling all the inputs during the game.
                horseElement.disabled = true;
                document.getElementById('amount').disabled = true;
                document.getElementById('laps').disabled = true;
                this.disabled = true;

                // Decreasing the available fund after starting the race
                document.getElementById('funds').innerText = availableFunds - betAmount;
                results = []

                // Racing the horses
                horse1.run();
                horse2.run();
                horse3.run();
                horse4.run();

                // This function is called repeated until, all the horses complete the race
                // After completing the race, the horse object is added to global 'results' array
                var resultChecker = setInterval(function() {
                    if (results.length === 4) {
                        // When all the four horses complete the race, this recurring function is ended and results are shown.
                        clearInterval(resultChecker);
                        showResult(betHorse);
                    }
                }, 1000);
            }
        }

        function emptyScoreBoard() {
            // Clears the scoreboard at the beginning of the game
            for (let i = 0; i < 4; i++) {
                document.getElementById(`pos-${i + 1}-head`).className = ``;
                document.getElementById(`pos-${i + 1}-time`).innerText = ``;
            }
        }

        function showResult(betHorse) {
            // Shows the results of the race, calculates the amount won and changes the odds
            for(let i = 0; i < results.length; i++) {
                let horse = results[i];
                document.getElementById(`pos-${i + 1}-head`).className = `${horse.id}`;
                document.getElementById(`pos-${i + 1}-time`).innerText = `${horse.time}s`;
                if (i == 0) {
                    // The first horse object in the results array is the winner.
                    if (betHorse === horse.id) {
                        let remainingFunds = parseFloat(document.getElementById('funds').innerText);
                        let amount = parseFloat(document.getElementById('amount').innerText);
                        document.getElementById('funds').innerText = remainingFunds + betAmount * results[0].odds;
                        alert('Congratulation you won the last round!!!');
                    }
                    // The odds of winning horse are decreased
                    horse.odds -= Math.floor(Math.random() * 4 + 1);
                    if (horse.odds < 1) {
                        horse.odds = 1;
                    }
                } else {
                    // The odds of losing horse are increased
                    horse.odds += Math.floor(Math.random() * 4 + 1);
                }
                // Displaying the updated odds
                horse.showOdds();
            }

            // Enabling all the inputs
            document.getElementById('start').disabled = false;
            document.getElementById('bethorse').disabled = false;
            document.getElementById('amount').value = 0;
            document.getElementById('amount').disabled = false;
            document.getElementById('laps').disabled = false;

        }

        function resetGame() {
            // resetting parameters for restarting the race.
            for (let i = 0; i < results.length; i++) {
                let horse = results[i];
                horse.element.style.left = horse.originX + 'vw';
                horse.element.style.top = horse.originY + 'vh';
                horse.x = horse.originX;
                horse.y = horse.originY;
                horse.time = 0;
                horse.laps = 0;
                horse.speed = horse.speedGenerator();
                horse.lastTurn = false;
                horse.initialTime = 0;
                horse.finalTime = 0;
                horse.time = 0;
            }
        }
    }, false);

});