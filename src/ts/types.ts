export type KeyValueObject = { [key: string | symbol]: any }

export type Events = { [key: string]: Array<(args: any) => void> }

export type Status = 'resting' | 'mutation' | 'action'
