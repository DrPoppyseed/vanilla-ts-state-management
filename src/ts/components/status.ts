import Component from '../lib/component'
import store from '../store'

export default class Status extends Component {
    constructor() {
        super({
            store,
            element: document.querySelector<HTMLElement>('.js-status')!,
        })
    }

    render = () => {
        const suffix = store.state.items.length !== 1 ? 's' : ''

        this.element.innerHTML = `${store.state.items.length} item${suffix}`
    }
}
