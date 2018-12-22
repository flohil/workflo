import { PageElementStore } from '../stores';
import { PageNodeCurrently, PageNode } from '.';
import { PageNodeEventually, PageNodeWait, IPageNodeOpts } from './PageNode';
export declare type ExtractText<Content extends {
    [key: string]: Workflo.PageNode.INode;
}> = Workflo.PageNode.ExtractText<Content>;
export declare type ExtractBoolean<Content extends {
    [key: string]: Workflo.PageNode.INode;
}> = Workflo.PageNode.ExtractBoolean<Content>;
export declare type ExtractTrue<Content extends {
    [key: string]: Workflo.PageNode.INode;
}> = Workflo.PageNode.ExtractTrue<Content>;
declare type ElementNode<Content extends {
    [K in keyof Content]: Workflo.PageNode.INode;
}> = Workflo.PageNode.IElementNode<ExtractText<Content>, ExtractBoolean<Content>, ExtractTrue<Content>>;
export interface IPageElementGroupOpts<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}> extends IPageNodeOpts<Store> {
    content: Content;
}
export declare class PageElementGroup<Store extends PageElementStore, Content extends {
    [K in keyof Content]: Workflo.PageNode.INode;
}> extends PageNode<Store> implements ElementNode<Content> {
    protected _id: string;
    protected _$: Workflo.StripNever<Content>;
    protected _lastDiff: Workflo.IDiff;
    readonly currently: PageElementGroupCurrently<Store, Content, this>;
    readonly wait: PageElementGroupWait<Store, Content, this>;
    readonly eventually: PageElementGroupEventually<Store, Content, this>;
    constructor(id: string, { store, timeout, content }: IPageElementGroupOpts<Store, Content>);
    readonly $: Content;
    readonly __getLastDiff: Workflo.IDiff;
    toJSON(): Workflo.IElementJSON;
    __getNodeId(): string;
    __getTrue(filterMask?: Workflo.StripNever<ExtractTrue<Content>>): Workflo.PageNode.ExtractTrue<Content>;
    getIsEnabled(filterMask?: ExtractTrue<Content>): Workflo.PageNode.ExtractBoolean<Content>;
    /**
     * Returns texts of all group elements after performing an initial wait in the order they were retrieved from the DOM.
     *
     * If passing filter, only values defined in this mask will be returned.
     * By default (if no filter is passed), all values will be returned.
     *
     * @param filter a filter mask
     */
    getText(filterMask?: ExtractTrue<Content>): Workflo.PageNode.ExtractText<Content>;
    getDirectText(filterMask?: ExtractTrue<Content>): Workflo.PageNode.ExtractText<Content>;
    eachGet<NodeInterface, ResultType extends Partial<Content>>(supportsInterface: (node: Workflo.PageNode.INode) => boolean, filterMask: Workflo.StripNever<ExtractTrue<Content>>, getFunc: (node: NodeInterface) => any): Workflo.StripNever<ResultType>;
    eachCheck<NodeInterface, ResultType extends Partial<Content>, ExpectedType extends Partial<Content> = ExtractTrue<Content>>(supportsInterface: (node: Workflo.PageNode.INode) => boolean, expected: ExpectedType, checkFunc: (node: NodeInterface, expected?: ResultType[keyof ResultType]) => boolean, isFilterMask?: boolean): boolean;
    eachWait<NodeInterface, ResultType extends Partial<Content>, ExpectedType extends Partial<Content> = ExtractTrue<Content>>(supportsInterface: (node: Workflo.PageNode.INode) => boolean, expected: ExpectedType, waitFunc: (node: NodeInterface, expected?: ResultType[keyof ResultType]) => NodeInterface): this;
    eachDo<NodeInterface>(supportsInterface: (node: Workflo.PageNode.INode) => boolean, filterMask: ExtractTrue<Content>, doFunc: (node: NodeInterface) => NodeInterface): this;
    eachSet<NodeInterface extends Workflo.PageNode.INode, ValuesType extends Partial<Content>>(supportsInterface: (node: Workflo.PageNode.INode) => boolean, values: Workflo.StripNever<ValuesType>, setFunc: (node: NodeInterface, expected?: ValuesType[keyof ValuesType]) => NodeInterface): this;
}
export declare class PageElementGroupCurrently<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}, GroupType extends PageElementGroup<Store, Content>> extends PageNodeCurrently<Store, GroupType> {
    getExists(filterMask?: ExtractTrue<Content>): Workflo.PageNode.ExtractBoolean<Content>;
    getIsVisible(filterMask?: ExtractTrue<Content>): Workflo.PageNode.ExtractBoolean<Content>;
    getIsEnabled(filterMask?: ExtractTrue<Content>): Workflo.PageNode.ExtractBoolean<Content>;
    /**
     * Returns texts of all group elements immediatly in the order they were retrieved from the DOM.
     *
     * If passing filter, only values defined in this mask will be returned.
     * By default (if no filter is passed), all values will be returned.
     *
     * @param filter a filter mask
     */
    getText(filterMask?: ExtractTrue<Content>): Workflo.PageNode.ExtractText<Content>;
    getDirectText(filterMask?: ExtractTrue<Content>): Workflo.PageNode.ExtractText<Content>;
    exists(filterMask?: ExtractTrue<Content>): boolean;
    isVisible(filterMask?: ExtractTrue<Content>): boolean;
    isEnabled(filterMask?: ExtractTrue<Content>): boolean;
    hasText(text: ExtractText<Content>): boolean;
    hasAnyText(filterMask?: ExtractTrue<Content>): boolean;
    containsText(text: ExtractText<Content>): boolean;
    hasDirectText(directText: ExtractText<Content>): boolean;
    hasAnyDirectText(filterMask?: ExtractTrue<Content>): boolean;
    containsDirectText(directText: ExtractText<Content>): boolean;
    readonly not: {
        exists: (filterMask?: Workflo.PageNode.ExtractTrue<Content>) => boolean;
        isVisible: (filterMask?: Workflo.PageNode.ExtractTrue<Content>) => boolean;
        isEnabled: (filterMask?: Workflo.PageNode.ExtractTrue<Content>) => boolean;
        hasText: (text: Workflo.PageNode.ExtractText<Content>) => boolean;
        hasAnyText: (filterMask?: Workflo.PageNode.ExtractTrue<Content>) => boolean;
        containsText: (text: Workflo.PageNode.ExtractText<Content>) => boolean;
        hasDirectText: (directText: Workflo.PageNode.ExtractText<Content>) => boolean;
        hasAnyDirectText: (filterMask?: Workflo.PageNode.ExtractTrue<Content>) => boolean;
        containsDirectText: (directText: Workflo.PageNode.ExtractText<Content>) => boolean;
    };
}
export declare class PageElementGroupWait<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}, GroupType extends PageElementGroup<Store, Content>> extends PageNodeWait<Store, GroupType> {
    exists(opts?: Workflo.IWDIOParams & {
        filterMask?: ExtractTrue<Content>;
    }): GroupType;
    isVisible(opts?: Workflo.IWDIOParams & {
        filterMask?: ExtractTrue<Content>;
    }): GroupType;
    isEnabled(opts?: Workflo.IWDIOParams & {
        filterMask?: ExtractTrue<Content>;
    }): GroupType;
    hasText(text: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval): GroupType;
    hasAnyText(opts?: Workflo.IWDIOParamsInterval & {
        filterMask?: ExtractTrue<Content>;
    }): GroupType;
    containsText(text: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval): GroupType;
    hasDirectText(directText: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval): GroupType;
    hasAnyDirectText(opts?: Workflo.IWDIOParamsInterval & {
        filterMask?: ExtractTrue<Content>;
    }): GroupType;
    containsDirectText(directText: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval): GroupType;
    readonly not: {
        exists: (opts?: Workflo.IWDIOParams & {
            filterMask?: Workflo.PageNode.ExtractTrue<Content>;
        }) => GroupType;
        isVisible: (opts?: Workflo.IWDIOParams & {
            filterMask?: Workflo.PageNode.ExtractTrue<Content>;
        }) => GroupType;
        isEnabled: (opts?: Workflo.IWDIOParams & {
            filterMask?: Workflo.PageNode.ExtractTrue<Content>;
        }) => GroupType;
        hasText: (text: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => GroupType;
        hasAnyText: (opts?: Workflo.IWDIOParamsInterval & {
            filterMask?: Workflo.PageNode.ExtractTrue<Content>;
        }) => GroupType;
        containsText: (text: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => GroupType;
        hasDirectText: (directText: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => GroupType;
        hasAnyDirectText: (opts?: Workflo.IWDIOParamsInterval & {
            filterMask?: Workflo.PageNode.ExtractTrue<Content>;
        }) => GroupType;
        containsDirectText: (directText: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => GroupType;
    };
}
export declare class PageElementGroupEventually<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}, GroupType extends PageElementGroup<Store, Content>> extends PageNodeEventually<Store, GroupType> {
    exists(opts?: Workflo.IWDIOParams & {
        filterMask?: ExtractTrue<Content>;
    }): boolean;
    isVisible(opts?: Workflo.IWDIOParams & {
        filterMask?: ExtractTrue<Content>;
    }): boolean;
    isEnabled(opts?: Workflo.IWDIOParams & {
        filterMask?: ExtractTrue<Content>;
    }): boolean;
    hasText(text: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval): boolean;
    hasAnyText(opts?: Workflo.IWDIOParamsInterval & {
        filterMask?: ExtractTrue<Content>;
    }): boolean;
    containsText(text: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval): boolean;
    hasDirectText(directText: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval): boolean;
    hasAnyDirectText(opts?: Workflo.IWDIOParamsInterval & {
        filterMask?: ExtractTrue<Content>;
    }): boolean;
    containsDirectText(directText: ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval): boolean;
    readonly not: {
        exists: (opts?: Workflo.IWDIOParams & {
            filterMask?: Workflo.PageNode.ExtractTrue<Content>;
        }) => boolean;
        isVisible: (opts?: Workflo.IWDIOParams & {
            filterMask?: Workflo.PageNode.ExtractTrue<Content>;
        }) => boolean;
        isEnabled: (opts?: Workflo.IWDIOParams & {
            filterMask?: Workflo.PageNode.ExtractTrue<Content>;
        }) => boolean;
        hasText: (text: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasAnyText: (opts?: Workflo.IWDIOParamsInterval & {
            filterMask?: Workflo.PageNode.ExtractTrue<Content>;
        }) => boolean;
        containsText: (text: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasDirectText: (directText: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasAnyDirectText: (opts?: Workflo.IWDIOParamsInterval & {
            filterMask?: Workflo.PageNode.ExtractTrue<Content>;
        }) => boolean;
        containsDirectText: (directText: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => boolean;
    };
}
export {};
