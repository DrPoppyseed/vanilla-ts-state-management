import Store from '../store'

export default abstract class Component {
    protected element: HTMLElement

    protected constructor({
        store,
        element,
    }: {
        store: typeof Store
        element: HTMLElement
    }) {
        // If there's a store passed in, subscribe to the state change
        store.events.subscribe('stateChange', () => this.render())

        this.element = element
    }

    /**
     * React to state changes and render the component's HTML.
     * The reason we're adding this as an abstract method is because we want to
     * impose the creation of a render method for child classes without us
     * needing to know the implementation.
     *
     * @returns {void}
     */
    protected abstract render(): void
}
