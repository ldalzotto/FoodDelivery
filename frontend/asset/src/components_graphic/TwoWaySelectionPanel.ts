import { Observable } from "../binding/Binding.js";
import { LoadingButton } from "./LoadingButton.js";
import { ScrollablePanel } from "./ScrollablePanel.js"

class TwoWaySelectionPanel<ElementType>
{
    static readonly Type : string = "two-way-selection-panel";

    private _root : HTMLElement;

    private leftScrollablePanel : ScrollablePanel;
    private rightScrollablePanel : ScrollablePanel;

    private _leftElements : TwoWaySelectionPanel_SelectableElement<ElementType>[];
    public get leftElements(){return this._leftElements;}
    private _rightElements : TwoWaySelectionPanel_SelectableElement<ElementType>[];
    public get rightElements(){return this._rightElements;}

    constructor(p_root : HTMLElement, p_onLeftButtonClicked : (p_onCompleted : () => void) => void, p_onRightButtonClicked : (p_onCompleted : () => void) => void )
    {
        this._root = p_root;
        let l_template: HTMLTemplateElement = document.getElementById(TwoWaySelectionPanel.Type) as HTMLTemplateElement;
        this._root.appendChild(l_template.content.cloneNode(true));

        this._leftElements = [];
        this._rightElements = [];

        this.leftScrollablePanel = new ScrollablePanel(this._root.querySelector("#left-scroll-panel"));
        this.rightScrollablePanel = new ScrollablePanel(this._root.querySelector("#right-scroll-panel"));

        new LoadingButton(this._root.querySelector("#left-button"), p_onLeftButtonClicked);
        new LoadingButton(this._root.querySelector("#right-button"), p_onRightButtonClicked);
    }

    pushSelectableElementToLeft(p_element_userdefined : ElementType, p_elementRoot_html : HTMLElement)
    {
        let l_element : TwoWaySelectionPanel_SelectableElement<ElementType> = new TwoWaySelectionPanel_SelectableElement(p_element_userdefined, p_elementRoot_html);
        this.leftScrollablePanel.container.appendChild(l_element.selectableElement);
        this.leftElements.push(l_element);
    }

    pushSelectableElementToRight(p_element_userdefined : ElementType, p_elementRoot_html : HTMLElement)
    {
        let l_element : TwoWaySelectionPanel_SelectableElement<ElementType> = new TwoWaySelectionPanel_SelectableElement(p_element_userdefined, p_elementRoot_html);
        this.rightScrollablePanel.container.appendChild(l_element.selectableElement);
        this.rightElements.push(l_element);
    }

    public moveLeftToRight()
    {
        this.moveElements(this._leftElements, this._rightElements, this.rightScrollablePanel);
    }

    public moveRightToLeft()
    {
        this.moveElements(this._rightElements, this._leftElements, this.leftScrollablePanel);
    }

    private moveElements(p_from : TwoWaySelectionPanel_SelectableElement<ElementType>[], p_to : TwoWaySelectionPanel_SelectableElement<ElementType>[], p_to_scrollPanel : ScrollablePanel)
    {
        for(let i=0;i<p_from.length;i++)
        {
            if(p_from[i].isSelected.value)
            {
                let l_element : TwoWaySelectionPanel_SelectableElement<ElementType> = p_from[i];
                l_element.isSelected.value = false;
                p_to_scrollPanel.container.appendChild(l_element.selectableElement);
                p_from.splice(i, 1);
                p_to.push(l_element);
            }
            
        }
    }
   
}

class TwoWaySelectionPanel_SelectableElement<ElementType>
{
    private _selectableElement : HTMLElement;
    public get selectableElement(){return this._selectableElement;}
    
    private _userDefined : ElementType;
    public get userDefined(){return this._userDefined;}

    private _isSelected : Observable<boolean>;
    public get isSelected(){return this._isSelected;}

    constructor(p_userDefinedElement : ElementType, p_selectableElement : HTMLElement)
    {
        this._selectableElement = p_selectableElement;
        this._userDefined = p_userDefinedElement;
        this._isSelected = new Observable<boolean>(false);
        this._isSelected.subscribe(() => {this.onIsSelectedChange();});
        this._selectableElement.addEventListener("click", () => {this.onClick();});
    }
    onClick() 
    {
        this._isSelected.value = !this._isSelected.value;
    }

    onIsSelectedChange() 
    {
        if(this._isSelected.value)
        {
            this._selectableElement.style.borderStyle = "dashed";
            this._selectableElement.style.borderColor = "orange";
        }
        else
        {
            this._selectableElement.style.borderStyle = "";
            this._selectableElement.style.borderColor = "";
        }
    }
}

export {TwoWaySelectionPanel}