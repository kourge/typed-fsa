# typed-fsa
A type-safe set of definitions and utilities for handling FSAs (Flux standard
actions) in TypeScript, based on [the specification at `flux-standard-action`](
https://github.com/acdlite/flux-standard-action). There are a few slight
differences, such as:
- The `payload` property is not typed as optional, since if it is meaningless to
  have one, we can supply `void` or `undefined` accordingly
- The `ErrorAction` type's definition assumes the convention that if the `error`
  property is set to `true`, the `payload` is an `Error` object
- To minimize dependency, the `isAction` function does not check if the supplied
  object is in fact a plain object
