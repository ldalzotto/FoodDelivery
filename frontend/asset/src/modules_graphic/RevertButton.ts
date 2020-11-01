class RevertButton
{
    public revertClickCallback: () => void;

    constructor(p_revertbutton_element: HTMLElement)
    {
        p_revertbutton_element.addEventListener("click", (p_event) => { this.onRevertClicked(p_event); });
    }

    private onRevertClicked(p_event: Event)
    {
        p_event.stopPropagation();
        p_event.preventDefault();
        this.revertClickCallback();
    }
}

export { RevertButton }