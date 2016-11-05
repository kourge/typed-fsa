export type AnyType = string | symbol;

export interface Action<Type extends AnyType, Payload> {
  type: Type;
  payload: Payload;
  error?: boolean;
}

export interface Meta<T> {
  meta: T;
}

export interface ErrorAction<Type extends AnyType> extends Action<Type, Error> {
  error: true;
}

export type AnyAction = Action<AnyType, any>;

const validKeys = ['type', 'payload', 'error', 'meta'];

function isValidKey(key: string): boolean {
  return validKeys.indexOf(key) !== -1;
}

export function isAction<Type extends AnyType, Payload>(
  action: any
): action is Action<Type, Payload> {
  return (
    typeof action !== 'undefined' && (
      typeof action.type === 'string' ||
      typeof action.type === 'symbol'
    ) &&
    Object.keys(action).every(isValidKey)
  );
}

export function isError<Type extends AnyType>(
  action: Action<Type, any>
): action is ErrorAction<Type> {
  return action.error === true;
}
