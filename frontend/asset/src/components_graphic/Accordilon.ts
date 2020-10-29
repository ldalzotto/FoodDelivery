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
    private header_symbol: HTMLElement;

    private body : HTMLElement;
    private bodyDisplayed : Observable<boolean>;
    private bodyCreated : boolean = false;

    private createdBody : (p_root:HTMLElement)=>void;


    constructor(p_parent : HTMLElement, p_input : AccordilonItemInput)
    {
        this.header = document.createElement("div");
        this.header.classList.add("accordilon-header");
        this.header = p_parent.appendChild(this.header);
        this.body = document.createElement("div");
        this.body = p_parent.appendChild(this.body);
        this.body.classList.add("accordilon-item");
        this.body.addEventListener("transitionend", (p_event: TransitionEvent) => { this.onBobyDisplayTransitionEnd(p_event); });

        this.bodyDisplayed = new Observable(false);

        this.header_symbol = document.createElement("span");
        this.header_symbol.textContent = "❯";
        this.header_symbol.style.display = "inline-block";
        this.header_symbol.style.transition = "transform 0.2s";
        this.header_symbol.style.transform = "rotate(0deg)";
        this.header_symbol.style.marginRight = "10px";
        this.header.appendChild(this.header_symbol);

        let l_title = document.createElement("span");
        l_title.textContent = p_input.Name;

        this.header.appendChild(l_title);
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

        if (!this.bodyDisplayed.value)
        {
            this.bodyDisplayed.value = true;
            this.body.style.maxHeight = this.body.scrollHeight.toString() + "px";
            this.header_symbol.style.transform = "rotate(90deg)";
        }
        else
        {
            this.body.style.maxHeight = "0px";
            this.header_symbol.style.transform = "rotate(0deg)";
        }
    }

    private onBobyDisplayTransitionEnd(p_transitionEvent: TransitionEvent)
    {
        if (p_transitionEvent.propertyName === "max-height")
        {
            if (this.body.style.maxHeight === "0px")
            {
                this.bodyDisplayed.value = false;
            }
            else
            {
                this.bodyDisplayed.value = true;
            }
        }
    }

}

export {Accordilon, AccordilonItemInput}