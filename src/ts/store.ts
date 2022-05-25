import Store from './lib/store'

type State = {
    items: Array<string>
}

const state: State = {
    items: ['I made this', 'Another thing'],
}

const mutations = {
    addItem: (state: State, payload: string) => {
        state.items.push(payload)

        return state
    },
    clearItem: (state: State, payload: { index: number }) => {
        state.items.splice(payload.index, 1)

        return state
    },
}

const actions = {
    addItem: (context: Store, payload: string) => {
        context.commit('addItem', payload)
    },
    clearItem: (context: Store, payload: { index: number }) => {
        context.commit('clearItem', payload)
    },
}

export default new Store(actions, mutations, state)
