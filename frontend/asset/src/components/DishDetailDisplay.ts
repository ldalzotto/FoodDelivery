import { InputElementType, InputImageUpdateElement, InputUpdateElement } from "../components_graphic/InputUpdateElement.js";
import { UpdatableElement, UpdatablePanel, UpdatablePanelCallbacks } from "../components_graphic/UpdatablePanel.js";
import { Dish, DishDelta, DishGet, DishService } from "../services/DishService.js";

class DishDetailDisplay
{
    static readonly Type: string = "dish-details-display";

    private _root : HTMLElement;

    public nameElement : InputUpdateElement;
    public priceElement : InputUpdateElement;
    public thumbElement: InputImageUpdateElement;

    public dish : Dish;

    public updatablePanel: UpdatablePanel;

    public static build(p_root : HTMLElement, p_dish_id : number) : DishDetailDisplay
    {
        let l_dishDetailDisplay : DishDetailDisplay = new DishDetailDisplay();
        l_dishDetailDisplay._root = p_root;
        let l_template: HTMLTemplateElement = document.getElementById(DishDetailDisplay.Type) as HTMLTemplateElement;
        let l_dishDetailDisplayContent =  l_template.content.cloneNode(true) as HTMLElement;

        l_dishDetailDisplay.nameElement = new InputUpdateElement(l_dishDetailDisplayContent.querySelector("#name"), InputElementType.TEXT);
        l_dishDetailDisplay.priceElement = new InputUpdateElement(l_dishDetailDisplayContent.querySelector("#price"), InputElementType.NUMBER);
        l_dishDetailDisplay.thumbElement = new InputImageUpdateElement(l_dishDetailDisplayContent.querySelector("#thumb"));
        
        DishService.GetDish(p_dish_id, null, 
            (p_dishGet : DishGet) => 
            {
                let l_dish = p_dishGet.dishes[0];
                l_dishDetailDisplay.dish = l_dish;
                l_dishDetailDisplay.nameElement.init(l_dish.name);
                l_dishDetailDisplay.priceElement.init(l_dish.price.toString());
            }, null);

        let l_updatableElements : UpdatableElement[] = [
            l_dishDetailDisplay.nameElement, l_dishDetailDisplay.priceElement, l_dishDetailDisplay.thumbElement
        ];
        
        l_dishDetailDisplay.updatablePanel = new UpdatablePanel(l_dishDetailDisplay._root, new DishDetailDisplay_Callbacks(l_dishDetailDisplay), l_dishDetailDisplayContent, l_updatableElements);

        return l_dishDetailDisplay;
    }
}

class DishDetailDisplay_Callbacks implements UpdatablePanelCallbacks
{
    private dishDetailDisplay : DishDetailDisplay;

    constructor(p_dishDetailDisplay : DishDetailDisplay)
    {
        this.dishDetailDisplay = p_dishDetailDisplay;
    }

    onSubmitPressed(p_onCompleted: () => void): void {
        let l_dishDelta = new DishDelta();
        if(this.dishDetailDisplay.nameElement.hasChanged())
        {
            l_dishDelta.name = this.dishDetailDisplay.nameElement.input.value;
        }
        if(this.dishDetailDisplay.priceElement.hasChanged())
        {
            l_dishDelta.price = parseFloat(this.dishDetailDisplay.priceElement.input.value);
        }

        let l_thumb_file: File | null = null;
        if (this.dishDetailDisplay.thumbElement.hasChanged())
        {
            l_thumb_file = this.dishDetailDisplay.thumbElement.input.files[0];
        }


        DishService.UpdateDish(this.dishDetailDisplay.dish.id, l_dishDelta, l_thumb_file,
            () => {
                this.dishDetailDisplay.updatablePanel.clearChanges();
                p_onCompleted();
            }, p_onCompleted);
    }
    onDeletePressed(p_onCompleted: () => void): void {
        DishService.DeleteDish(this.dishDetailDisplay.dish.id, p_onCompleted, p_onCompleted);
    }

}

export {DishDetailDisplay}