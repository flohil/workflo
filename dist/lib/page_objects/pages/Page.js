"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
/**
 * This class is supposed to be used as base class for all Pages.
 *
 * @template Store type of the PageElementStore instance which can be used to retrieve/create PageNodes via Page
 * @template IsOpenOpts type of the opts parameter passed to the functions `isOpen`, `wait.isOpen` and
 * `eventually.isOpen`
 * @template IsClosedOpts type of the opts parameter passed to the functions `isClosed`, `wait.isClosed` and
 * `eventually.isClosed`
 */
class Page {
    constructor(opts) {
        this._store = opts.store;
        this._timeout = opts.timeout || JSON.parse(process.env.WORKFLO_CONFIG).timeouts.default || __1.DEFAULT_TIMEOUT;
        this._interval = opts.interval || JSON.parse(process.env.WORKFLO_CONFIG).intervals.default || __1.DEFAULT_INTERVAL;
        this.wait = new PageWait(this);
        this.eventually = new PageEventually(this);
    }
    getStore() {
        return this._store;
    }
    getTimeout() {
        return this._timeout;
    }
    getInterval() {
        return this._interval;
    }
}
exports.Page = Page;
class PageWait {
    constructor(page) {
        this._page = page;
    }
    _wait(conditionFunc, conditionMessage, opts = Object.create(null)) {
        const timeout = opts.timeout || this._page.getTimeout();
        const interval = opts.interval || this._page.getInterval();
        let error = undefined;
        try {
            browser.waitUntil(() => {
                try {
                    return conditionFunc();
                }
                catch (_error) {
                    error = _error;
                }
            }, timeout, '', interval);
        }
        catch (untilError) {
            const _error = error || untilError;
            if (_error.type === 'WaitUntilTimeoutError') {
                const waitError = new Error(`Waiting for page ${this.constructor.name}${conditionMessage} within ${timeout}ms failed.`);
                waitError.type = 'WaitUntilTimeoutError';
                throw waitError;
            }
            else {
                throw _error;
            }
        }
        return this._page;
    }
    isOpen(opts = Object.create(null)) {
        return this._wait(() => this._page.isOpen(opts), " to be open", opts);
    }
    isClosed(opts = Object.create(null)) {
        return this._wait(() => this._page.isClosed(opts), " to be closed", opts);
    }
}
class PageEventually {
    constructor(page) {
        this._page = page;
    }
    _eventually(conditionFunc, opts = Object.create(null)) {
        const timeout = opts.timeout || this._page.getTimeout();
        const interval = opts.interval || this._page.getInterval();
        let error = undefined;
        try {
            browser.waitUntil(() => {
                try {
                    return conditionFunc();
                }
                catch (_error) {
                    error = _error;
                }
            }, timeout, '', interval);
            return true;
        }
        catch (untilError) {
            const _error = error || untilError;
            if (_error.type === 'WaitUntilTimeoutError') {
                return false;
            }
            else {
                throw _error;
            }
        }
    }
    isOpen(opts = Object.create(null)) {
        return this._eventually(() => this._page.isOpen(opts), opts);
    }
    isClosed(opts = Object.create(null)) {
        return this._eventually(() => this._page.isClosed(opts), opts);
    }
}
//# sourceMappingURL=Page.js.map