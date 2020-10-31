class UpdateDot
{
    private updateDotElement: HTMLElement;

    constructor(p_update_dot_element: HTMLElement)
    {
        this.updateDotElement = p_update_dot_element;
    }

    public setEnabled(p_value: boolean)
    {
        this.updateDotElement.style.display = p_value ? "" : "none";
    }
}

export { UpdateDot }