"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
class ValuePageElementMap extends _1.PageElementMap {
    constructor(selector, opts) {
        super(selector, opts);
        this.currently = new ValuePageElementMapCurrently(this);
        this.wait = new ValuePageElementMapWait(this);
        this.eventually = new ValuePageElementMapEventually(this);
    }
    /**
     * Returns values of all list elements after performing an initial wait in the order they were retrieved from the DOM.
     *
     * If passing filter, only values defined in this mask will be returned.
     * By default (if no filter is passed), all values will be returned.
     *
     * @param filterMask a filter mask
     */
    getValue(filterMask) {
        return this.eachGet(this._$, node => node.getValue(), filterMask);
    }
    /**
     * Sets values on all list elements.
     *
     * If values is an array, the number of list elements must match the number of passed values.
     * The values will be assigned in the order that the list elements were retrieved from the DOM.
     *
     * If values is a single value, the same value will be set on all list elements.
     *
     * @param values
     */
    setValue(values) {
        return this.eachSet(this._$, (element, value) => element.setValue(value), values);
    }
}
exports.ValuePageElementMap = ValuePageElementMap;
class ValuePageElementMapCurrently extends _1.PageElementMapCurrently {
    /**
     * Returns values of all list elements immediatly in the order they were retrieved from the DOM.
     *
     * If passing filter, only values defined in this mask will be returned.
     * By default (if no filter is passed), all values will be returned.
     *
     * @param filterMask a filter mask
     */
    getValue(filterMask) {
        return this._node.eachGet(this._node.$, node => node.currently.getValue(), filterMask);
    }
    hasValue(value) {
        return this._node.eachCheck(this._node.$, (element, expected) => element.currently.hasValue(expected), value);
    }
    hasAnyValue(filterMask) {
        return this._node.eachCheck(this._node.$, (element) => element.currently.hasAnyValue(), filterMask, true);
    }
    containsValue(value) {
        return this._node.eachCheck(this._node.$, (element, expected) => element.currently.containsValue(expected), value);
    }
    get not() {
        return Object.assign({}, super.not, { hasValue: (value) => {
                return this._node.eachCheck(this._node.$, (element, expected) => element.currently.not.hasValue(expected), value);
            }, hasAnyValue: (filterMask) => {
                return this._node.eachCheck(this._node.$, element => element.currently.not.hasAnyValue(), filterMask, true);
            }, containsValue: (value) => {
                return this._node.eachCheck(this._node.$, (element, expected) => element.currently.not.containsValue(expected), value);
            } });
    }
}
class ValuePageElementMapWait extends _1.PageElementMapWait {
    hasValue(value, opts) {
        return this._node.eachWait(this._node.$, (element, expected) => element.wait.hasValue(expected, opts), value);
    }
    hasAnyValue(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachWait(this._node.$, element => element.wait.hasAnyValue(otherOpts), filterMask, true);
    }
    containsValue(value, opts) {
        return this._node.eachWait(this._node.$, (element, expected) => element.wait.containsValue(expected, opts), value);
    }
    get not() {
        return Object.assign({}, super.not, { hasValue: (value, opts) => {
                return this._node.eachWait(this._node.$, (element, expected) => element.wait.not.hasValue(expected, opts), value);
            }, hasAnyValue: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachWait(this._node.$, element => element.wait.not.hasAnyValue(otherOpts), filterMask, true);
            }, containsValue: (value, opts) => {
                return this._node.eachWait(this._node.$, (element, expected) => element.wait.not.containsValue(expected, opts), value);
            } });
    }
}
class ValuePageElementMapEventually extends _1.PageElementMapEventually {
    hasValue(value, opts) {
        return this._node.eachCheck(this._node.$, (element, expected) => element.eventually.hasValue(expected, opts), value);
    }
    hasAnyValue(opts = {}) {
        const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
        return this._node.eachCheck(this._node.$, element => element.eventually.hasAnyValue(otherOpts), filterMask, true);
    }
    containsValue(value, opts) {
        return this._node.eachCheck(this._node.$, (element, expected) => element.eventually.containsValue(expected, opts), value);
    }
    get not() {
        return Object.assign({}, super.not, { hasValue: (value, opts) => {
                return this._node.eachCheck(this._node.$, (element, expected) => element.eventually.not.hasValue(expected, opts), value);
            }, hasAnyValue: (opts = {}) => {
                const { filterMask } = opts, otherOpts = __rest(opts, ["filterMask"]);
                return this._node.eachCheck(this._node.$, element => element.eventually.not.hasAnyValue(otherOpts), filterMask, true);
            }, containsValue: (value, opts) => {
                return this._node.eachCheck(this._node.$, (element, expected) => element.eventually.not.containsValue(expected, opts), value);
            } });
    }
}
//# sourceMappingURL=ValuePageElementMap.js.map