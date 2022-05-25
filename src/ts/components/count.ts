import Component from '../lib/component.js'
import store from '../store'

export default class Count extends Component {
    constructor() {
        super({
            store,
            element: document.querySelector<HTMLElement>('.js-count')!,
        })
    }

    render = () => {
        const suffix = store.state.items.length !== 1 ? 's' : ''
        const emoji = store.state.items.length > 0 ? '🙌' : '😢'

        this.element.innerHTML = `
            <small>You've done</small>
            <span>${store.state.items.length}</span>
            <small>thing${suffix} today ${emoji}</small>
        `
    }
}
