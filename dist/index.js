"use strict";
var validKeys = ['type', 'payload', 'error', 'meta'];
function isValidKey(key) {
    return validKeys.indexOf(key) !== -1;
}
function isAction(action) {
    return (typeof action !== 'undefined' &&
        typeof action.type !== 'undefined' &&
        Object.keys(action).every(isValidKey));
}
exports.isAction = isAction;
function isError(action) {
    return action.error === true;
}
exports.isError = isError;
