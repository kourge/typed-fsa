export declare type AnyType = string | symbol;
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
export declare type AnyAction = Action<AnyType, any>;
export declare function isAction<Type extends AnyType, Payload>(action: any): action is Action<Type, Payload>;
export declare function isError<Type extends AnyType>(action: Action<Type, any>): action is ErrorAction<Type>;
