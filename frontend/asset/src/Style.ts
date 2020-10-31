class Style
{

    private element: HTMLStyleElement;

    private styles: Map<string, boolean>;

    public initialize()
    {
        this.element = document.querySelector("#user-style")
        this.element.innerHTML = "";
        this.styles = new Map<string, boolean>();
    }

    public append(p_key: string, p_style: string)
    {
        if (!this.styles.has(p_key))
        {
            this.styles.set(p_key, true);
            this.element.innerHTML += p_style;
        }
    }

}

var GlobalStyle: Style = new Style();

export { GlobalStyle };