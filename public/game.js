export default function createGame() {
    const state = {
        players: {},
        fruits: {},
        screen: {
            width: 10,
            height: 10
        }
    }

    const observers = []

    function subscribe(observerFunction) {
        observers.push(observerFunction)
    }

    function notifyAll(command) {
        for (const observerFunction of observers) {
            observerFunction(command)
        }
    }

    function setState(newState) {
        Object.assign(state, newState)

    }

    function addPlayer(command) {
        const { playerId, playerX, playerY } = command
        const newPlayerX = playerX || playerX == 0 ? playerX : Math.floor(Math.random() * state.screen.width)
        const newPlayerY = playerY || playerY == 0 ? playerY : Math.floor(Math.random() * state.screen.height)

        state.players[playerId] = { x: newPlayerX, y: newPlayerY }

        notifyAll({
            type: 'add-player',
            playerId,
            playerX: newPlayerX,
            playerY: newPlayerY
        })
    }

    function removePlayer(command) {
        const { playerId } = command
        const { [playerId]: removedPlayer, ...players } = state.players

        state.players = players

        notifyAll({
            type: 'remove-player',
            playerId,
        })
    }

    function movePlayer(command) {
        notifyAll(command)

        const acceptedMoves = {
            ArrowUp(player) {
                if (player.y - 1 >= 0) {
                    player.y -= 1
                }

            },
            ArrowLeft(player) {
                if (player.x - 1 >= 0) {
                    player.x -= 1
                }
            },
            ArrowRight(player) {
                if (player.x + 1 < state.screen.width) {
                    player.x += 1
                }
            },
            ArrowDown(player) {
                if (player.y + 1 < state.screen.height) {
                    player.y += 1
                }
            },
        }

        const { keyPressed, playerId } = command
        const { [command.playerId]: player } = state.players
        const moveFunction = acceptedMoves[keyPressed]

        if (player && moveFunction) {
            moveFunction(player)
            checkForFruitCollision(playerId)
        }

    }

    function addFruit(command) {
        
        const fruitId = command ? command.fruitId : Math.floor(Math.random() * 10000000)
        const fruitX = command ? command.fruitX : Math.floor(Math.random() * state.screen.width)
        const fruitY = command ? command.fruitY : Math.floor(Math.random() * state.screen.height)

        state.fruits[fruitId] = { x: fruitX, y: fruitY }

        notifyAll({
            type: 'add-fruit',
            fruitId,
            fruitX,
            fruitY
        })
    }

    function removeFruit(command) {
        const { fruitId } = command
        const { [fruitId]: _, ...fruits } = state.fruits

        state.fruits = fruits

        notifyAll({
            type: 'remove-fruit',
            fruitId,
        })
    }

    function checkForFruitCollision(playerId) {
        const { [playerId]: player } = state.players

        for (const fruitId in state.fruits) {
            const { [fruitId]: fruit } = state.fruits

            if (player.x == fruit.x && player.y == fruit.y) {
                removeFruit({ fruitId })
            }
        }
    }

    function start() {
        const frequency = 2000

        setInterval(addFruit, frequency)
    }

    return {
        addPlayer,
        removePlayer,
        addFruit,
        removeFruit,
        movePlayer,
        state,
        setState,
        subscribe,
        start
    }
}