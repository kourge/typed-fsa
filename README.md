# typed-fsa

A type-safe set of definitions and utilities for handling FSAs (Flux standard
actions) in TypeScript, based on [the specification at `flux-standard-action`](
https://github.com/acdlite/flux-standard-action). There are a few slight semantic
differences, such as:

- The `payload` property is not typed as optional, since if it is meaningless to
  have one, we can supply `void` or `undefined` accordingly
- The `ErrorAction` type's definition assumes the convention that if the `error`
  property is set to `true`, the `payload` is an `Error` object
- To minimize dependency, the `isAction` function does not check if the supplied
  object is in fact a plain object

## Installation

This package is [available on npm as `typed-fsa`](
https://www.npmjs.com/package/typed-fsa
). Simply run `npm install --save typed-fsa`.

## Basic examples

Based on the [`flux-standard-action` examples](
https://github.com/acdlite/flux-standard-action#example
).

A basic FSA looks like:

```ts
import {Action} from 'typed-fsa';

const a: Action<'ADD_TODO', {text: string}> = {
  type: 'ADD_TODO',
  payload: {
    text: 'Do something.'
  }
};
```

An error FSA looks like:

```ts
import {ErrorAction} from 'typed-fsa';

const e: ErrorAction<'ADD_TODO'> = {
  type: 'ADD_TODO',
  payload: new Error(),
  error: true
};
```

## API and philosophy

`typed-fsa` is designed to take full advantage of TypeScript 2.0's capabilities,
such as literal types, type narrowing, type guards, and discriminated unions.
The following is a definition by definition walkthrough of the API, types
included.

### `type AnyType = string | symbol`

An FSA type string is either an actual string or an ES6 symbol. Redux recommends
using a string for debuggability, but YMMV.

### `interface Action<Type extends AnyType, Payload> { ... }`

By typing both the type string and the payload in a single type, the two are
tied together. This ensures when you match `action.type` against some string,
thanks to type narrowing, you will always know what type `action.payload`
becomes.

The `error` property is optional (`error?: boolean`), per the FSA spec.

### `interface Meta<T> { meta: T }`

By default the `Action` type does not define the `meta` property. If you want to
use it, intersect your `Action` type with `Meta<T>` and alias accordingly.

### `interface ErrorAction<Type extends AnyType> extends Action<Type, Error> { ... }`

`ErrorAction` is a subtyped `Action` with two different guarantees:

- `action.error` is now non-optional, and is guaranteed to be `true`
- `action.payload` is guaranteed to be an `Error`

The `payload` guarantee is a stronger one than the one defined in the spec, which
only says that `payload` MAY be an error.

### `type AnyAction = Action<AnyType, any>`

`AnyAction` describes an action with any string or symbol type string as well as
any kind of payload. This is very useful for writing a Redux middleware.

### `function isAction<?, ?>(x: any): x is Action<?, ?>`

`isAction` acts like `isFSA` from `flux-standard-action`, with two differences:

- It does not bother checking if the examined object is a plain object
- It is a type guard, but a loose one that will not check its type parameter

The looseness is demonstrated thus:

```ts
const a: any = { ... };
if (isAction<'INCREMENT', number>(a)) {
  // a's type is narrowed down to Action<'INCREMENT', number>
  // a.type is narrowed down to type 'INCREMENT'
  // a.payload is narrowed down to type number
  // But these types are based on the invocation's say-so, and isn't actually
  // verified. The only guarantee is that the `type` property exists on `a`, and
  // that every property in `a` matches the FSA spec name-wise.
} else {
  // a is still type any
}
```

### `function isError<T extends AnyType>(a: Action<T, any>): a is ErrorAction<T>`

`isError` takes what is already known as an `Action` but narrows its type down to
`ErrorAction` if `action.error === true`. It is a type guard similar to `isAction`,
with a similar set of loosenesses:

- You can claim whatever type string you want
- It does not verify that `payload` is an `Error`

## Advanced examples

The following assumes you are using TypeScript 2.1, which features improved literal
type inference. Here is how you would define your actions:

```ts
export namespace Actions {
  export const INCREMENT = 'INCREMENT';
  export type Increment = Action<typeof INCREMENT, void>;

  export const DECREMENT = 'DECREMENT';
  export type Decrement = Action<typeof DECREMENT, void>;

  export const ASSIGN = 'ASSIGN';
  export type Assign = Action<typeof ASSIGN, number>;

  export type All = Increment | Decrement | Assign;
}

export function counterReducer(state: number = 0, action: Actions.All): number {
  switch (action.type) {
    case Actions.INCREMENT: return state + 1;
    case Actions.DECREMENT: return state - 1;
    case Actions.ASSIGN: return action.payload;
    default: return state;
  }
}
```

In this example, `Actions.All` cannot possibly have an action type string other
than `'INCREMENT'`, `'DECREMENT'`, and `'ASSIGN'`. Furthermore, when `action.type`
is known to match the value of `Actions.ASSIGN`, the type of `action.payload` is
narrowed down to `number`. All of this works because:

- Declaring a constant without specifying its type causes the literal type to be
  inferred, e.g. `const a = 'A'` expands to `const a: 'A' = 'A'`
- The type query `typeof NAME`, where `NAME` is a value, extracts the type out of
  a value. Inheriting from the above example, `typeof a` is equivalent to `'A'`.
- `type Name = Action<typeof NAME, PayloadType>` ties the type string to its
  corresponding payload type, forming an action type.
- `type All = Name1 | Name2 | Name3` forms a discriminated union out of multiple
  action types, with the property `type` acting as the discriminant.
