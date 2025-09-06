/**
 * UI class for displaying messages to the DOM.
 */
class UI {
    /**
     * Displays a message inside a DOM element with the given ID.
     */
    displayMessages(id, message) {
        const container = document.getElementById(id)
        if (container) {
            container.innerHTML = message
        } else {
            console.log(ERROR_MESSAGE)
        }
    }
}

/**
 * Game class that handles button generation, scrambling, and game logic.
 */
class Game {
    constructor() {
        this.arrayButtons = []
        this.num = 0
        this.current = 0
        this.timeoutId = null
        this.intervalId = null
        this.ui = new UI()
    }

    /**
     * Generates the specified number of buttons.
     */
    generateButtons(number) {
        this.num = number
        for (let i = 0; i < number; i++) {
            let button = new Button(i)
            this.arrayButtons.push(button)
        }
    }

    /**
     * Displays all buttons in the container.
     */
    displayButtons() {
        const container = document.getElementById("box-container")
        container.innerHTML = ""
        this.arrayButtons.forEach(b => {
            container.appendChild(b.button)
        })
    }

    /**
     * Randomly moves buttons around the screen and clears their text.
     */
    scrambleButtons() {
        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight

        this.arrayButtons.forEach(b => {
            b.button.style.position = "absolute"

            const top = RandomGenerator.generateRandomNum(0, windowHeight - b.button.offsetHeight)
            const left = RandomGenerator.generateRandomNum(0, windowWidth - b.button.offsetWidth)

            b.button.style.top = top + "px"
            b.button.style.left = left + "px"

            b.button.innerText = ""
        })
    }

    /**
     * Starts the game by setting up the start button and input.
     */
    start() {
        this.ui.displayMessages("message-container", WELCOME_MESSAGE)
        this.ui.displayMessages("start-button", GO_BUTTON)
        const start_button = document.getElementById("start-button")
        const input_num = document.getElementById("box-number")

        start_button.addEventListener("click", () => {
            let num = parseInt(input_num.value)

            if (num) {
                this.startGame(num)
            } else {
                alert(INPUT_INVALID)
                input_num.value = ""
            }
        })
    }

    /**
     * Starts a game with the specified number of buttons.
     */
    startGame(num) {
        this.arrayButtons.length = 0
        this.current = 0

        clearTimeout(this.timeoutId)
        clearInterval(this.intervalId)

        const INTERVAL_TIME = 2000
        const TIME_CONVERT = 1000

        this.generateButtons(num)
        this.displayButtons()

        this.timeoutId = setTimeout(() => {
            let counter = 0
            this.intervalId = setInterval(() => {
                this.scrambleButtons()
                counter++

                if (counter >= num) {
                    clearInterval(this.intervalId)
                    this.intervalId = null

                    this.arrayButtons.forEach((b) => {
                        b.button.disabled = false
                    })
                }
            }, INTERVAL_TIME)
        }, num * TIME_CONVERT)

        this.arrayButtons.forEach((b) => {
            b.button.addEventListener("click", () => {
                if (this.current === b.id) {
                    b.button.innerHTML = b.id
                    this.current++
                } else {
                    this.endGame(false)
                }

                if (this.current === this.arrayButtons.length) {
                    this.endGame(true)
                }
            })
        })
    }

    /**
     * Ends the game and shows a success or fail message.
     */
    endGame(status) {
        this.current = 0
        this.arrayButtons.forEach((b) => {
            b.button.innerHTML = b.id
        })

        setTimeout(() => {
            if (status) {
                alert(SUCCESS)
            } else {
                alert(FAIL)
            }
        }, 0)
    }
}

/**
 * Button class representing an individual game button.
 */
class Button {
    constructor(number) {
        this.id = number
        this.button = document.createElement("button")
        this.button.style.backgroundColor = RandomGenerator.generateRandomColor()
        this.button.style.height = "5rem"
        this.button.style.width = "10rem"
        this.button.innerText = number
        this.button.disabled = true
        this.button.classList.add("game-buttons")
    }
}

/**
 * RandomGenerator class for generating random colors and numbers.
 */
class RandomGenerator {

    /**
     * chatGPT was used.
     * Generates a random hex color string.
     */
    static generateRandomColor() {
        const letters = "0123456789ABCDEF"
        let color = "#"
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)]
        }
        return color
    }

    /**
     * chatGPT was used.
     * Generates a random integer between min and min+range-1.
     */
    static generateRandomNum(min, range) {
        const size = Math.floor(Math.random() * range) + min
        return size
    }
}

window.onload = () => {
    const game = new Game()
    game.start()
}
