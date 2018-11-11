export declare class XPathBuilder {
    private static _instance;
    private _selector;
    static getInstance(): XPathBuilder;
    private SelectorBuilder;
    reset(selector: string): this;
    /**
     * Appends plain xPath to current selector.
     * @param appendedXPath
     */
    append(appendedXPath: string): this;
    /**
     * Appends childSelector to current selector in order to select a child element.
     *
     * After executing .child, the selected child element will become the new
     * "target" for all other xpath modifier functions like .id, .class ...
     * @param childSelector
     */
    child(childSelector: string): this;
    /**
     * Adds plain xPath constraint to current selector.
     * @param constraintSelector
     * @param builderFunc optional -> can be used to apply XPathSelector API to constraintSelector
     */
    constraint(constraintSelector: string, builderFunc?: (xpath: XPathBuilder) => XPathBuilder): this;
    /**
     * Restrict current selector to elements which have at least one child defined by childSelector.
     * Calls constraint() but adds a '.' to the beginning of the constraint to select only child elements.
     * @param childSelector
     * @param builderFunc optional -> can be used to apply XPathSelector API to childrenSelector
     */
    hasChild(childSelector: string, builderFunc?: (xpath: XPathBuilder) => XPathBuilder): this;
    text(text: string): this;
    notText(text: string): this;
    textContains(text: string): this;
    notTextContains(text: string): this;
    attribute(key: string, value?: string): this;
    notAttribute(key: string, value?: string): this;
    attributeContains(key: string, value: string): this;
    notAttributeContains(key: string, value: string): this;
    id(value?: string): this;
    notId(value?: string): this;
    idContains(value: string): this;
    notIdContains(value: string): this;
    class(value?: string): this;
    notClass(value?: string): this;
    classContains(value: string): this;
    notClassContains(value: string): this;
    name(value?: string): this;
    notName(value?: string): this;
    nameContains(value: string): this;
    notNameContains(value: string): this;
    type(value?: string): this;
    notType(value?: string): this;
    typeContains(value: string): this;
    notTypeContains(value: string): this;
    checked(): this;
    notChecked(): this;
    disabled(): this;
    notDisabled(): this;
    selected(): this;
    notSelected(): this;
    /**
     * Finds element by index of accurence on a single "level" of the DOM.
     * Eg.: If index === 3, there must be 3 siblings on the same DOM level that match the current selector
     * and the third one will be selected.
     * @param index starts at 1
     */
    levelIndex(index: number): this;
    /**
     * Finds element by index of accurence accross all "levels/depths" of the DOM.
     * @param index starts at 1
     */
    index(index: number): this;
    build(): string;
}
