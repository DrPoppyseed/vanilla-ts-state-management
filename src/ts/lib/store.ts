import PubSub from '../lib/pubsub.js'
import { KeyValueObject, Status } from '../types'

export default class Store {
    constructor(
        public actions: KeyValueObject = {},
        public mutations: KeyValueObject = {},
        public state: KeyValueObject = {},
        public status: Status = 'resting',
        public events = new PubSub()
    ) {
        // We can't use arrow functions in constructor
        //eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this

        // Add some default objects to hold our actions, mutations and state
        self.actions = actions
        self.mutations = mutations

        // Set our state to be a Proxy. We are setting the default state by
        // checking the params and defaulting to an empty object if no default
        // state is passed in
        self.state = new Proxy(state, {
            set: (state, key, value) => {
                // Set the value as we would normally
                state[key] = value

                // Trace out to the console. This will be grouped by the
                // related action TODO: make it so that the user can toggle
                // whether to log or not. something like checking env vars may
                // be a good option.
                console.log(`stateChange: ${String(key)}: ${value}`)

                // Publish the change event for the components that are
                // listening
                self.events.publish('stateChange', self.state)

                // Give the user a little telling off if they set a value
                // directly
                if (self.status !== 'mutation') {
                    console.warn(
                        `You should use a mutation to set ${String(key)}`
                    )
                }

                // Reset the status ready for the next operation
                self.status = 'resting'

                return true
            },
        })
    }

    /**
     * A dispatcher for actions that looks in the actions
     * collection and runs the action if it can find it
     *
     * @param {string} actionKey
     * @param {any} payload
     * @returns {boolean}
     * @memberof Store
     */
    dispatch = (actionKey: string, payload: any) => {
        // Run a quick check to see if the action actually exists
        // before we try to run it
        if (typeof this.actions[actionKey] !== 'function') {
            console.error(`Action "${actionKey} doesn't exist.`)
            return false
        }

        // Create a console group which will contain the logs from our Proxy etc
        console.groupCollapsed(`ACTION: ${actionKey}`)

        // Let anything that's watching the status know that we're dispatching
        // an action
        this.status = 'action'

        // Actually call the action and pass it the Store context and whatever
        // payload was passed
        this.actions[actionKey](this, payload)

        // Close our console group to keep things nice and neat
        console.groupEnd()

        return true
    }

    /**
     * Look for a mutation and modify the state object
     * if that mutation exists by calling it
     *
     * @param {string} mutationKey
     * @param {any} payload
     * @returns {boolean}
     * @memberof Store
     */
    commit = (mutationKey: string, payload: any) => {
        // Run a quick check to see if this mutation actually exists
        // before trying to run it
        if (typeof this.mutations[mutationKey] !== 'function') {
            console.log(`Mutation "${mutationKey}" doesn't exist`)
            return false
        }

        // Let anything that's watching the status know that we're mutating
        // state
        this.status = 'mutation'

        // Get a new version of the state by running the mutation and storing
        // the result of it
        const newState = this.mutations[mutationKey](this.state, payload)

        // Merge the old and new together to create a new state and set it
        this.state = Object.assign(this.state, newState)

        return true
    }
}
