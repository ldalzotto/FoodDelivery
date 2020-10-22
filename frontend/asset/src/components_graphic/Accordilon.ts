import { BindingUtils, Observable } from "../binding/Binding.js";

class Accordilon
{
    private _root : HTMLElement;
    private items : AccordilonItem[];

    constructor(p_root : HTMLElement, p_input : AccordilonItemInput[])
    {
        this._root = p_root;
        this.items = [];
        if(p_input)
        {
            for(let i=0;i<p_input.length;i++)
            {
                this.items.push(new AccordilonItem(this._root, p_input[i]));
            }
        }
    }
}

class AccordilonItemInput
{
    public Name : string;
    public CreateBody : (p_root : HTMLElement) => void;

    public static build(p_name : string, p_createBody : (p_root : HTMLElement)=>void) : AccordilonItemInput
    {
        let l_accordilonInput = new AccordilonItemInput();
        l_accordilonInput.Name = p_name;
        l_accordilonInput.CreateBody = p_createBody;
        return l_accordilonInput;
    }
}

class AccordilonItem
{

    private header : HTMLElement;
    private body : HTMLElement;
    private bodyDisplayed : Observable<boolean>;
    private bodyCreated : boolean = false;

    private createdBody : (p_root:HTMLElement)=>void;


    constructor(p_parent : HTMLElement, p_input : AccordilonItemInput)
    {
        this.header = document.createElement("div");
        this.header = p_parent.appendChild(this.header);
        this.body = document.createElement("div");
        this.body = p_parent.appendChild(this.body);
        this.bodyDisplayed = new Observable(false);

        this.header.textContent = p_input.Name;
        this.createdBody = p_input.CreateBody;

        this.header.addEventListener("click", () => {this.onHeaderClick();});
        BindingUtils.bindDisplayStyle(this.body, this.bodyDisplayed);
    }

    private onHeaderClick()
    {
        if(!this.bodyCreated)
        {
            this.createdBody(this.body);
            this.bodyCreated = true;
        }

        this.bodyDisplayed.value = !this.bodyDisplayed.value;
    }

}

export {Accordilon, AccordilonItemInput}