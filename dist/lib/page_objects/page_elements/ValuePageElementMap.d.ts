import { PageNodeStore } from '../stores';
import { IPageElementMapOpts, IValuePageElementOpts, PageElementMap, PageElementMapCurrently, PageElementMapEventually, PageElementMapWait, ValuePageElement } from './';
/**
 * Describes the `identifier` property of the `opts` parameter passed to ValuePageElementMap's constructor function.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template K the key names of ValuePageElementMap's `$` accessor used to access the map's managed ValuePageElements
 * @template PageElementType type of the ValuePageElement managed by ValuePageElementMap
 * @template PageElementOpts type of the opts parameter passed to the constructor function of the ValuePageElements
 * managed by ValuePageElementMap
 * @template ValueType type of the values of ValuePageElements managed by ValuePageElementMap
 */
export interface IValuePageElementMapOpts<Store extends PageNodeStore, K extends string, PageElementType extends ValuePageElement<Store, ValueType>, PageElementOpts extends Partial<IValuePageElementOpts<Store>>, ValueType> extends IPageElementMapOpts<Store, K, PageElementType, PageElementOpts> {
}
/**
 * ValuePageElementMap extends PageElementMap with the possibility to set, retrieve and check the values of
 * ValuePageElements managed by ValuePageElementMap.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template K the key names of ValuePageElementMap's `$` accessor used to access the map's managed ValuePageElements
 * @template PageElementType type of the ValuePageElement managed by ValuePageElementMap
 * @template PageElementOpts type of the opts parameter passed to the constructor function of the ValuePageElements
 * managed by ValuePageElementMap
 * @template ValueType type of the values of ValuePageElements managed by ValuePageElementMap
 */
export declare class ValuePageElementMap<Store extends PageNodeStore, K extends string, PageElementType extends ValuePageElement<Store, ValueType>, PageElementOpts extends Partial<IValuePageElementOpts<Store>>, ValueType> extends PageElementMap<Store, K, PageElementType, PageElementOpts> implements Workflo.PageNode.IValueElementNode<Partial<Record<K, ValueType>>, Partial<Record<K, boolean>>> {
    readonly currently: ValuePageElementMapCurrently<Store, K, PageElementType, PageElementOpts, this, ValueType>;
    readonly wait: ValuePageElementMapWait<Store, K, PageElementType, PageElementOpts, this, ValueType>;
    readonly eventually: ValuePageElementMapEventually<Store, K, PageElementType, PageElementOpts, this, ValueType>;
    /**
     * ValuePageElementMap extends PageElementMap with the possibility to set, retrieve and check the values of
     * ValuePageElements managed by ValuePageElementMap.
     *
     * @param selector an XPath expression which identifies all ValuePageElements managed by ValuePageElementMap
     * @param opts the options used to configure ValuePageElementMap
     */
    constructor(selector: string, opts: IValuePageElementMapOpts<Store, K, PageElementType, PageElementOpts, ValueType>);
    /**
     * Returns the values of all ValuePageElements managed by ValuePageElementMap as a result map after performing the
     * initial waiting condition of each ValuePageElement.
     *
     * @param filterMask can be used to skip the invocation of the `getValue` function for some or all managed
     * ValuePageElements. The results of skipped function invocations are not included in the total results object.
     */
    getValue(filterMask?: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, ValueType>>;
    /**
     * Returns the 'hasValue' status of all ValuePageElements managed by ValuePageElementMap as a result map after
     * performing the initial waiting condition of each managed ValuePageElement.
     *
     * A ValuePageElement's 'hasValue' status is set to true if its actual text equals the expected text.
     *
     * @param values the expected values used in the comparisons which set the 'hasValue' status
     */
    getHasValue(values: Partial<Record<K, ValueType>>): Partial<Record<K, boolean>>;
    /**
     * Returns the 'hasAnyValue' status of all ValuePageElements managed by ValuePageElementMap as a result map after
     * performing the initial waiting condition of each managed ValuePageElement.
     *
     * A ValuePageElement's 'hasAnyValue' status is set to true if the ValuePageElement has any text.
     *
     * @param filterMask can be used to skip the invocation of the `getHasAnyValue` function for some or all managed
     * ValuePageElements. The results of skipped function invocations are not included in the total results object.
     */
    getHasAnyValue(filterMask?: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, boolean>>;
    /**
     * Returns the 'containsValue' status of all ValuePageElements managed by ValuePageElementMap as a result map after
     * performing the initial waiting condition of each managed ValuePageElement.
     *
     * A ValuePageElement's 'containsValue' status is set to true if its actual text contains the expected text.
     *
     * @param values the expected values used in the comparisons which set the 'containsValue' status
     */
    getContainsValue(values: Partial<Record<K, ValueType>>): Partial<Record<K, boolean>>;
    /**
     * This function sets the passed values to all ValuePageElements managed by ValuePageElementMap
     * after performing the initial waiting condition of each ValuePageElement.
     *
     * @param values a map of setter values
     */
    setValue(values: Partial<Record<K, ValueType>>): this;
}
/**
 * This class defines all `currently` functions of ValuePageElementMap.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template K the key names of ValuePageElementMap's `$` accessor used to access the map's managed ValuePageElements
 * @template PageElementType type of the ValuePageElement managed by ValuePageElementMap
 * @template PageElementOpts type of the opts parameter passed to the constructor function of the ValuePageElements
 * managed by ValuePageElementMap
 * @template MapType type of the ValuePageElementMap for which ValuePageElementMapCurrently defines all `currently`
 * functions
 * @template ValueType type of the values of ValuePageElements managed by ValuePageElementMap
 */
declare class ValuePageElementMapCurrently<Store extends PageNodeStore, K extends string, PageElementType extends ValuePageElement<Store, ValueType>, PageElementOpts extends Partial<IValuePageElementOpts<Store>>, MapType extends ValuePageElementMap<Store, K, PageElementType, PageElementOpts, ValueType>, ValueType> extends PageElementMapCurrently<Store, K, PageElementType, PageElementOpts, MapType> {
    /**
     * Returns the current values of all ValuePageElements managed by ValuePageElementMap as a result map.
     *
     * @param filterMask can be used to skip the invocation of the `getValue` function for some or all managed
     * ValuePageElements. The results of skipped function invocations are not included in the total results object.
     */
    getValue(filterMask?: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, ValueType>>;
    /**
     * Returns the current 'hasValue' status of all ValuePageElements managed by ValuePageElementMap as a result map.
     *
     * A ValuePageElement's 'hasValue' status is set to true if its actual text equals the expected text.
     *
     * @param values the expected values used in the comparisons which set the 'hasValue' status
     */
    getHasValue(values: Partial<Record<K, ValueType>>): Partial<Record<K, boolean>>;
    /**
     * Returns the current 'hasAnyValue' status of all ValuePageElements managed by ValuePageElementMap as a result map.
     *
     * A ValuePageElement's 'hasAnyValue' status is set to true if the ValuePageElement has any text.
     *
     * @param filterMask can be used to skip the invocation of the `getHasAnyValue` function for some or all managed
     * ValuePageElements. The results of skipped function invocations are not included in the total results object.
     */
    getHasAnyValue(filterMask?: Workflo.PageNode.MapFilterMask<K>): Partial<Record<K, boolean>>;
    /**
     * Returns the current 'containsValue' status of all ValuePageElements managed by ValuePageElementMap as a result map.
     *
     * A ValuePageElement's 'containsValue' status is set to true if its actual text contains the expected text.
     *
     * @param values the expected values used in the comparisons which set the 'containsValue' status
     */
    getContainsValue(values: Partial<Record<K, ValueType>>): Partial<Record<K, boolean>>;
    /**
     * Returns true if the actual values of all ValuePageElements managed by ValuePageElementMap currently equal the
     * expected values.
     *
     * @param values the expected values supposed to equal the actual values
     */
    hasValue(values: Partial<Record<K, ValueType>>): boolean;
    /**
     * Returns true if all ValuePageElements managed by ValuePageElementMap currently have any text.
     *
     * @param filterMask can be used to skip the invocation of the `hasAnyValue` function for some or all managed
     * ValuePageElements
     */
    hasAnyValue(filterMask?: Workflo.PageNode.MapFilterMask<K>): boolean;
    /**
     * Returns true if the actual values of all ValuePageElements managed by ValuePageElementMap currently contain the
     * expected values.
     *
     * @param values the expected values supposed to be contained in the actual values
     */
    containsValue(values: Partial<Record<K, ValueType>>): boolean;
    /**
     * returns the negated variants of ValuePageElementMapCurrently's state check functions
     */
    readonly not: {
        /**
         * Returns true if the actual values of all ValuePageElements managed by ValuePageElementMap currently do not
         * equal the expected values.
         *
         * @param values the expected values supposed not to equal the actual values
         */
        hasValue: (values: Partial<Record<K, ValueType>>) => boolean;
        /**
         * Returns true if all ValuePageElements managed by ValuePageElementMap currently do not have any text.
         *
         * @param filterMask can be used to skip the invocation of the `hasAnyValue` function for some or all managed
         * ValuePageElements
         */
        hasAnyValue: (filterMask?: Partial<Record<K, boolean>>) => boolean;
        /**
         * Returns true if the actual values of all ValuePageElements managed by ValuePageElementMap currently do not
         * contain the expected values.
         *
         * @param values the expected values supposed not to be contained in the actual values
         */
        containsValue: (values: Partial<Record<K, ValueType>>) => boolean;
        exists: (filterMask?: Partial<Record<K, boolean>>) => boolean;
        isVisible: (filterMask?: Partial<Record<K, boolean>>) => boolean;
        isEnabled: (filterMask?: Partial<Record<K, boolean>>) => boolean;
        hasText: (text: Partial<Record<K, string>>) => boolean;
        hasAnyText: (filterMask?: Partial<Record<K, boolean>>) => boolean;
        containsText: (text: Partial<Record<K, string>>) => boolean;
        hasDirectText: (directText: Partial<Record<K, string>>) => boolean;
        hasAnyDirectText: (filterMask?: Partial<Record<K, boolean>>) => boolean;
        containsDirectText: (directText: Partial<Record<K, string>>) => boolean;
    };
}
/**
 * This class defines all `wait` functions of ValuePageElementMap.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template K the key names of ValuePageElementMap's `$` accessor used to access the map's managed ValuePageElements
 * @template PageElementType type of the ValuePageElement managed by ValuePageElementMap
 * @template PageElementOpts type of the opts parameter passed to the constructor function of the ValuePageElements
 * managed by ValuePageElementMap
 * @template MapType type of the ValuePageElementMap for which ValuePageElementMapWait defines all `wait`
 * functions
 * @template ValueType type of the values of ValuePageElements managed by ValuePageElementMap
 */
declare class ValuePageElementMapWait<Store extends PageNodeStore, K extends string, PageElementType extends ValuePageElement<Store, ValueType>, PageElementOpts extends Partial<IValuePageElementOpts<Store>>, MapType extends ValuePageElementMap<Store, K, PageElementType, PageElementOpts, ValueType>, ValueType> extends PageElementMapWait<Store, K, PageElementType, PageElementOpts, MapType> {
    /**
     * Waits for the actual values of all ValuePageElements managed by ValuePageElementMap to equal the expected values.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param values the expected values supposed to equal the actual values
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a ValuePageElement's default timeout is used.
     * If no `interval` is specified, a ValuePageElement's default interval is used.
     *
     * @returns this (an instance of ValuePageElementMap)
     */
    hasValue(values: Partial<Record<K, ValueType>>, opts?: Workflo.ITimeoutInterval): MapType;
    /**
     * Waits for all ValuePageElements managed by ValuePageElementMap to have any text.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyValue` function for some
     * or all managed ValuePageElements, the `timeout` within which the condition is expected to be met and the `interval`
     * used to check it
     *
     * If no `timeout` is specified, a ValuePageElement's default timeout is used.
     * If no `interval` is specified, a ValuePageElement's default interval is used.
     *
     * @returns this (an instance of ValuePageElementMap)
     */
    hasAnyValue(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<K>): MapType;
    /**
     * Waits for the actual values of all ValuePageElements managed by ValuePageElementMap to contain the expected values.
     *
     * Throws an error if the condition is not met within a specific timeout.
     *
     * @param values the expected values supposed to be contained in the actual values
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a ValuePageElement's default timeout is used.
     * If no `interval` is specified, a ValuePageElement's default interval is used.
     *
     * @returns this (an instance of ValuePageElementMap)
     */
    containsValue(values: Partial<Record<K, ValueType>>, opts?: Workflo.ITimeoutInterval): MapType;
    /**
     * returns the negated variants of ValuePageElementMapWait's state check functions
     */
    readonly not: {
        /**
         * Waits for the actual values of all ValuePageElements managed by ValuePageElementMap not to equal the expected
         * values.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param values the expected values supposed not to equal the actual values
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
         * to check it
         *
         * If no `timeout` is specified, a ValuePageElement's default timeout is used.
         * If no `interval` is specified, a ValuePageElement's default interval is used.
         *
         * @returns this (an instance of ValuePageElementMap)
         */
        hasValue: (values: Partial<Record<K, ValueType>>, opts?: Workflo.ITimeoutInterval) => MapType;
        /**
         * Waits for all ValuePageElements managed by ValuePageElementMap not to have any text.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyValue` function for
         * some or all managed ValuePageElements, the `timeout` within which the condition is expected to be met and the
         * `interval` used to check it
         *
         * If no `timeout` is specified, a ValuePageElement's default timeout is used.
         * If no `interval` is specified, a ValuePageElement's default interval is used.
         *
         * @returns this (an instance of ValuePageElementMap)
         */
        hasAnyValue: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<K>) => MapType;
        /**
         * Waits for the actual values of all ValuePageElements managed by ValuePageElementMap not to contain the expected
         * values.
         *
         * Throws an error if the condition is not met within a specific timeout.
         *
         * @param values the expected values supposed not to be contained in the actual values
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
         * to check it
         *
         * If no `timeout` is specified, a ValuePageElement's default timeout is used.
         * If no `interval` is specified, a ValuePageElement's default interval is used.
         *
         * @returns this (an instance of ValuePageElementMap)
         */
        containsValue: (values: Partial<Record<K, ValueType>>, opts?: Workflo.ITimeoutInterval) => MapType;
        exists: (opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>) => MapType;
        isVisible: (opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>) => MapType;
        isEnabled: (opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>) => MapType;
        hasText: (texts: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval) => MapType;
        hasAnyText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<K>) => MapType;
        containsText: (texts: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval) => MapType;
        hasDirectText: (directTexts: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval) => MapType;
        hasAnyDirectText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<K>) => MapType;
        containsDirectText: (directTexts: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval) => MapType;
    };
}
/**
 * This class defines all `eventually` functions of ValuePageElementMap.
 *
 * @template Store type of the PageNodeStore instance which can be used to retrieve/create PageNodes
 * @template K the key names of ValuePageElementMap's `$` accessor used to access the map's managed ValuePageElements
 * @template PageElementType type of the ValuePageElement managed by ValuePageElementMap
 * @template PageElementOpts type of the opts parameter passed to the constructor function of the ValuePageElements
 * managed by ValuePageElementMap
 * @template MapType type of the ValuePageElementMap for which ValuePageElementMapEventually defines all `eventually`
 * functions
 * @template ValueType type of the values of ValuePageElements managed by ValuePageElementMap
 */
declare class ValuePageElementMapEventually<Store extends PageNodeStore, K extends string, PageElementType extends ValuePageElement<Store, ValueType>, PageElementOpts extends Partial<IValuePageElementOpts<Store>>, MapType extends ValuePageElementMap<Store, K, PageElementType, PageElementOpts, ValueType>, ValueType> extends PageElementMapEventually<Store, K, PageElementType, PageElementOpts, MapType> {
    /**
     * Returns true if the actual values of all ValuePageElements managed by ValuePageElementMap eventually equal the
     * expected values within a specific timeout.
     *
     * @param values the expected values supposed to equal the actual values
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a ValuePageElement's default timeout is used.
     * If no `interval` is specified, a ValuePageElement's default interval is used.
     */
    hasValue(values: Partial<Record<K, ValueType>>, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * Returns true if all ValuePageElements managed by ValuePageElementMap eventually have any text within a specific
     * timeout.
     *
     * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyValue` function for some
     * or all managed ValuePageElements, the `timeout` within which the condition is expected to be met and the `interval`
     * used to check it
     *
     * If no `timeout` is specified, a ValuePageElement's default timeout is used.
     * If no `interval` is specified, a ValuePageElement's default interval is used.
     */
    hasAnyValue(opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<K>): boolean;
    /**
     * Returns true if the actual values of all ValuePageElements managed by ValuePageElementMap eventually contain the
     * expected values within a specific timeout.
     *
     * @param values the expected values supposed to be contained in the actual values
     * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
     * to check it
     *
     * If no `timeout` is specified, a ValuePageElement's default timeout is used.
     * If no `interval` is specified, a ValuePageElement's default interval is used.
     */
    containsValue(values: Partial<Record<K, ValueType>>, opts?: Workflo.ITimeoutInterval): boolean;
    /**
     * returns the negated variants of ValuePageElementMapEventually's state check functions
     */
    readonly not: {
        /**
         * Returns true if the actual values of all ValuePageElements managed by ValuePageElementMap eventually do not
         * equal the expected values within a specific timeout.
         *
         * @param values the expected values supposed not to equal the actual values
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
         * to check it
         *
         * If no `timeout` is specified, a ValuePageElement's default timeout is used.
         * If no `interval` is specified, a ValuePageElement's default interval is used.
         */
        hasValue: (values: Partial<Record<K, ValueType>>, opts?: Workflo.ITimeoutInterval) => boolean;
        /**
         * Returns true if all ValuePageElements managed by ValuePageElementMap eventually do not have any text within a
         * specific timeout.
         *
         * @param opts includes a `filterMask` which can be used to skip the invocation of the `hasAnyValue` function for
         * some or all managed ValuePageElements, the `timeout` within which the condition is expected to be met and the
         * `interval` used to check it
         *
         * If no `timeout` is specified, a ValuePageElement's default timeout is used.
         * If no `interval` is specified, a ValuePageElement's default interval is used.
         */
        hasAnyValue: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<K>) => boolean;
        /**
         * Returns true if the actual values of all ValuePageElements managed by ValuePageElementMap eventually do not
         * contain the expected values within a specific timeout.
         *
         * @param values the expected values supposed not to be contained in the actual values
         * @param opts includes the `timeout` within which the condition is expected to be met and the `interval` used
         * to check it
         *
         * If no `timeout` is specified, a ValuePageElement's default timeout is used.
         * If no `interval` is specified, a ValuePageElement's default interval is used.
         */
        containsValue: (values: Partial<Record<K, ValueType>>, opts?: Workflo.ITimeoutInterval) => boolean;
        exists: (opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>) => boolean;
        isVisible: (opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>) => boolean;
        isEnabled: (opts?: Workflo.ITimeout & Workflo.PageNode.IMapFilterMask<K>) => boolean;
        hasText: (texts: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval) => boolean;
        hasAnyText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<K>) => boolean;
        containsText: (texts: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval) => boolean;
        hasDirectText: (directTexts: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval) => boolean;
        hasAnyDirectText: (opts?: Workflo.ITimeoutInterval & Workflo.PageNode.IMapFilterMask<K>) => boolean;
        containsDirectText: (directTexts: Partial<Record<K, string>>, opts?: Workflo.ITimeoutInterval) => boolean;
    };
}
export {};
