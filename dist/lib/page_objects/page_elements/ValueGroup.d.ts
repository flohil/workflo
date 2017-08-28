import { TextGroup, ITextGroupOpts } from './';
export interface IValueGroupOpts<Store extends Workflo.IPageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}, WalkerType extends Workflo.IPageElementGroupWalker<Store>, WalkerOptions extends Workflo.IPageElementGroupWalkerOpts> extends ITextGroupOpts<Store, Content, WalkerType, WalkerOptions> {
}
export declare class ValueGroup<Store extends Workflo.IPageElementStore, Content extends {
    [key: string]: Workflo.PageNode.INode;
}, WalkerType extends Workflo.IPageElementGroupWalker<Store>, WalkerOptions extends Workflo.IPageElementGroupWalkerOpts> extends TextGroup<Store, Content, WalkerType, WalkerOptions> {
    constructor({...superOpts}: IValueGroupOpts<Store, Content, WalkerType, WalkerOptions>);
    /**
     * Returns node value for nodes which implement Workflo.PageNode.IGetValue
     * or undefined for those which don't.
     * @param param
     */
    GetValue({filter, options}?: {
        filter?: Workflo.IRecObj<boolean>;
        options?: Workflo.IWalkerOptions;
    }): Workflo.IRecObj<string>;
    SetValue({values, options}: {
        values: Workflo.IRecObj<string>;
        options?: Workflo.IWalkerOptions;
    }): Workflo.IRecObj<void>;
}
