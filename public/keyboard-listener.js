export default function createKeyboardListener(document) {
    const state = {
        observers: []
    }

    function registerPlayerId(playerId) {
        state.playerId = playerId
    }

    function subscribe(observerFunction) {
        state.observers.push(observerFunction)
    }

    function unsubscribe(observerFunction) {
        state.observers = state.observers.filter(fn => fn != observerFunction)
    }

    function unsubscribeAll() {
        state.observers = []
    }

    function notifyAll(command) {
        for (const observerFunction of state.observers) {
            observerFunction(command)
        }
    }

    document.addEventListener('keydown', handleKeyDown)

    function handleKeyDown(event) {
        const keyPressed = event.key

        const command = {
            type: 'move-player',
            playerId: state.playerId,
            keyPressed
        }

        notifyAll(command)
    }

    return {
        subscribe,
        unsubscribe,
        unsubscribeAll,
        registerPlayerId
    }
}