
type CachedProviderFn<INPUT, T> = ( p_input : INPUT,  p_onValueProvided : (p_value : T) => void )=>void;

class Cached<INPUT, T>
{
    private _providerFunction : CachedProviderFn<INPUT, T>;
    private _value : T;
    private _isValid : boolean;

    constructor(p_provider : CachedProviderFn<INPUT, T>)
    {
        this._providerFunction = p_provider;
    }

    invalidate() { this._isValid = false; }

    getValue(p_input : INPUT, p_callback : (p_value : T)=>void)
    {
        if(!this._isValid)
        {
            this._providerFunction(p_input,
                (p_value : T) => {
                    this._value = p_value;        
                    this._isValid = true;
                }
            );
        }
        else
        {
            p_callback(this._value);
        }
    }

}

export {Cached, CachedProviderFn}