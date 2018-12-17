import { PageElementStore } from '../stores';
import { PageElementGroup, IPageElementGroupOpts, PageElementGroupCurrently, PageElementGroupEventually, PageElementGroupWait } from '.';
declare type ExtractValue<T extends {
    [key: string]: Workflo.PageNode.INode;
}> = Workflo.PageNode.ExtractValue<T>;
export interface IValueGroupOpts<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}> extends IPageElementGroupOpts<Store, Content> {
}
export declare class ValuePageElementGroup<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}> extends PageElementGroup<Store, Content> implements Workflo.PageNode.IValueElementNode<ExtractValue<Content>> {
    readonly currently: ValuePageElementGroupCurrently<Store, Content, this>;
    readonly wait: ValuePageElementGroupWait<Store, Content, this>;
    readonly eventually: ValuePageElementGroupEventually<Store, Content, this>;
    constructor(id: string, { ...superOpts }: IValueGroupOpts<Store, Content>);
    getValue(filterMask?: ExtractValue<Content>): Workflo.PageNode.ExtractValue<Content>;
    /**
     * Sets values after performing the initial wait on all nodes that implement the setValue method.
     * Nodes that do not implement the setValue method will be ignored.
     *
     * @param values
     */
    setValue(values: ExtractValue<Content>): this;
}
declare class ValuePageElementGroupCurrently<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}, GroupType extends ValuePageElementGroup<Store, Content>> extends PageElementGroupCurrently<Store, Content, GroupType> {
    getValue(filterMask?: ExtractValue<Content>): Workflo.PageNode.ExtractValue<Content>;
    /**
     * Sets values immediately on all nodes that implement the setValue method.
     * Nodes that do not implement the setValue method will be ignored.
     *
     * @param values
     */
    setValue(values: ExtractValue<Content>): GroupType;
    hasValue(value: ExtractValue<Content>): boolean;
    hasAnyValue(filterMask?: ExtractValue<Content>): boolean;
    containsValue(value: ExtractValue<Content>): boolean;
    readonly not: {
        hasValue: (value: Workflo.PageNode.ExtractValue<Content>) => boolean;
        hasAnyValue: (filterMask?: Workflo.PageNode.ExtractValue<Content>) => boolean;
        containsValue: (value: Workflo.PageNode.ExtractValue<Content>) => boolean;
        exists: (filterMask?: Workflo.PageNode.ExtractBoolean<Content>) => boolean;
        isVisible: (filterMask?: Workflo.PageNode.ExtractBoolean<Content>) => boolean;
        isEnabled: (filterMask?: Workflo.PageNode.ExtractBoolean<Content>) => boolean;
        hasText: (text: Workflo.PageNode.ExtractText<Content>) => boolean;
        hasAnyText: (filterMask?: Workflo.PageNode.ExtractText<Content>) => boolean;
        containsText: (text: Workflo.PageNode.ExtractText<Content>) => boolean;
        hasDirectText: (directText: Workflo.PageNode.ExtractText<Content>) => boolean;
        hasAnyDirectText: (filterMask?: Workflo.PageNode.ExtractText<Content>) => boolean;
        containsDirectText: (directText: Workflo.PageNode.ExtractText<Content>) => boolean;
    };
}
declare class ValuePageElementGroupWait<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}, GroupType extends ValuePageElementGroup<Store, Content>> extends PageElementGroupWait<Store, Content, GroupType> {
    hasValue(value: ExtractValue<Content>, opts?: Workflo.IWDIOParamsInterval): GroupType;
    hasAnyValue(opts?: Workflo.IWDIOParamsInterval & {
        filterMask?: ExtractValue<Content>;
    }): GroupType;
    containsValue(value: ExtractValue<Content>, opts?: Workflo.IWDIOParamsInterval): GroupType;
    readonly not: {
        hasValue: (value: Workflo.PageNode.ExtractValue<Content>, opts?: Workflo.IWDIOParamsInterval) => GroupType;
        hasAnyValue: (opts?: Workflo.IWDIOParamsInterval & {
            filterMask?: Workflo.PageNode.ExtractValue<Content>;
        }) => GroupType;
        containsValue: (value: Workflo.PageNode.ExtractValue<Content>, opts?: Workflo.IWDIOParamsInterval) => GroupType;
        exists: (opts?: Workflo.IWDIOParams & {
            filterMask?: Workflo.PageNode.ExtractBoolean<Content>;
        }) => GroupType;
        isVisible: (opts?: Workflo.IWDIOParams & {
            filterMask?: Workflo.PageNode.ExtractBoolean<Content>;
        }) => GroupType;
        isEnabled: (opts?: Workflo.IWDIOParams & {
            filterMask?: Workflo.PageNode.ExtractBoolean<Content>;
        }) => GroupType;
        hasText: (text: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => GroupType;
        hasAnyText: (opts?: Workflo.IWDIOParamsInterval & {
            filterMask?: Workflo.PageNode.ExtractText<Content>;
        }) => GroupType;
        containsText: (text: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => GroupType;
        hasDirectText: (directText: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => GroupType;
        hasAnyDirectText: (opts?: Workflo.IWDIOParamsInterval & {
            filterMask?: Workflo.PageNode.ExtractText<Content>;
        }) => GroupType;
        containsDirectText: (directText: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => GroupType;
    };
}
declare class ValuePageElementGroupEventually<Store extends PageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}, GroupType extends ValuePageElementGroup<Store, Content>> extends PageElementGroupEventually<Store, Content, GroupType> {
    hasValue(value: ExtractValue<Content>, opts?: Workflo.IWDIOParamsInterval): boolean;
    hasAnyValue(opts?: Workflo.IWDIOParamsInterval & {
        filterMask?: ExtractValue<Content>;
    }): boolean;
    containsValue(value: ExtractValue<Content>, opts?: Workflo.IWDIOParamsInterval): boolean;
    readonly not: {
        hasValue: (value: Workflo.PageNode.ExtractValue<Content>, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasAnyValue: (opts?: Workflo.IWDIOParamsInterval & {
            filterMask?: Workflo.PageNode.ExtractValue<Content>;
        }) => boolean;
        containsValue: (value: Workflo.PageNode.ExtractValue<Content>, opts?: Workflo.IWDIOParamsInterval) => boolean;
        exists: (opts?: Workflo.IWDIOParams & {
            filterMask?: Workflo.PageNode.ExtractBoolean<Content>;
        }) => boolean;
        isVisible: (opts?: Workflo.IWDIOParams & {
            filterMask?: Workflo.PageNode.ExtractBoolean<Content>;
        }) => boolean;
        isEnabled: (opts?: Workflo.IWDIOParams & {
            filterMask?: Workflo.PageNode.ExtractBoolean<Content>;
        }) => boolean;
        hasText: (text: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasAnyText: (opts?: Workflo.IWDIOParamsInterval & {
            filterMask?: Workflo.PageNode.ExtractText<Content>;
        }) => boolean;
        containsText: (text: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasDirectText: (directText: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => boolean;
        hasAnyDirectText: (opts?: Workflo.IWDIOParamsInterval & {
            filterMask?: Workflo.PageNode.ExtractText<Content>;
        }) => boolean;
        containsDirectText: (directText: Workflo.PageNode.ExtractText<Content>, opts?: Workflo.IWDIOParamsInterval) => boolean;
    };
}
export {};
