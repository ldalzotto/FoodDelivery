
class ScrollablePanel {

    static readonly Type : string = "scrollable-panel";

    private _root: HTMLElement;
    public root(){return this._root;}

    private _container : HTMLElement;
    public get container(){return this._container;}

    constructor(p_root: HTMLElement) {
        this._root = p_root;
        let l_template: HTMLTemplateElement = document.getElementById(ScrollablePanel.Type) as HTMLTemplateElement;
        this._root.appendChild(l_template.content.cloneNode(true));

       this._container = this._root.querySelector("#container");

    }
}

export { ScrollablePanel }