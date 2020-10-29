// TODO, in the future this object will handle dynamic column number display
class ElementList<ELEMENT_TYPE, FETCH_TYPE, FETCH_ELEMENT_TYPE, Callbacks extends ElementListCallbacks<ELEMENT_TYPE, FETCH_TYPE, FETCH_ELEMENT_TYPE>>
{
    private _root : HTMLElement;

    private _items : ELEMENT_TYPE[];
    private _callbacks : Callbacks;

    constructor(p_root : HTMLElement, p_callbacks : Callbacks)
    {
        this._root = p_root;
        this._callbacks = p_callbacks;
        this._items = [];

        // let l_template: HTMLTemplateElement = document.getElementById(ElementList.Type) as HTMLTemplateElement;
        // this._root.appendChild(l_template.content.cloneNode(true));

        // this.reload();
    }

    public reload()
    {
        this._root.innerHTML = "";
        this._items = [];
        this._callbacks.fetchElements((p_fetch : FETCH_TYPE) => {
            this._callbacks.forEachFetchedElements(p_fetch, (p_fetchElement : FETCH_ELEMENT_TYPE, p_index : number) => {
                this._items.push(this._callbacks.buildElement(p_fetchElement, p_index, this._root));
            });
        });
    }
}

interface ElementListCallbacks<ELEMENT_TYPE, FETCH_TYPE, FETCH_ELEMENT_TYPE>
{
    fetchElements(p_onSuccess : (p_fetch : FETCH_TYPE)=>void) : null;
    forEachFetchedElements(p_fetch : FETCH_TYPE, p_callback : (p_fetchElement : FETCH_ELEMENT_TYPE, p_index : number)=>void) : null;
    buildElement(p_fetchElement : FETCH_ELEMENT_TYPE, p_index : number, p_itemHTMlRoot : HTMLElement) : ELEMENT_TYPE;
}

export {ElementList, ElementListCallbacks}