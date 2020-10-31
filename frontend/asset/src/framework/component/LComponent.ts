import { GlobalStyle } from "../../Style.js";

abstract class LComponent<LModuleType extends number>
{
    protected _root: HTMLElement;
    public get root() { return this._root; };

    protected _modules: Map<LModuleType, any>;

    abstract type(): string;

    abstract html(): string;
    abstract style(): string | null;
    abstract module(p_key: LModuleType): void;

    constructor(p_root: HTMLElement, p_modules: LModuleType[])
    {
        this._root = p_root;
        this._modules = new Map<LModuleType, any>();

        if (p_modules)
        {
            for (let i = 0; i < p_modules.length; i++)
            {
                this._modules.set(p_modules[i], {});
            }
        }

        this._root.appendChild(document.createRange().createContextualFragment(this.html()));

        if (p_modules)
        {
            for (let i = 0; i < p_modules.length; i++)
            {
                this.module(p_modules[i]);
            }
        }

        let l_style = this.style();
        if (l_style)
        {
            GlobalStyle.append(this.type(), l_style);
        }

    }

    public getModule(p_moduleType: LModuleType): any | null
    {
        return this._modules.get(p_moduleType);
    }
}

export { LComponent }