class Observable<T>
{
    protected _listeners : ((arg0 : T) => void)[];
    protected _value : T;

    constructor(value : T)
    {
        this._listeners = [];
        this._value = value;
    }

    notify()
    {
        this._listeners.forEach(listener => {
                listener(this._value);
        });
    }

    subscribe(listener : (arg0 : T) => void)
    {
        this._listeners.push(listener);
    }

    subscribe_withInit(listener : (arg0 : T) => void)
    {
        this.subscribe(listener);
        listener(this._value);
    }

    get value()
    {
        return this._value;
    }

    set value(val : T)
    {
        if(this._value != val)
        {
            this._value = val;
            this.notify();
        }
    }
}

class Computed<T> extends Observable<T>
{
    constructor(value : () => T, deps : Observable<T>[] )
    {
        super(value());
        const listener = () => {
            this._value = value();
            this.notify();
        };
        deps.forEach(dep => dep.subscribe(listener));
    }

    get value() : T
    {
        return this._value;
    }

    set value(val : T)
    {
        throw "Cannot set computed property";
    }
}

class Watcher<T> 
{
    protected _listeners : ((old_value : T, new_value : T) => void)[];

    protected _value : T;
    protected _oldValue : T;

    constructor(value : T)
    {
        this._listeners = [];
        this._value = value;
        this._oldValue = value;
    }

    notify()
    {
        this._listeners.forEach(listener => {
            if(listener!=null)
            {
                listener(this._oldValue, this._value);
            }
        });
    }

    subscribe(listener : (old_value : T, new_value : T) => void)
    {
        this._listeners.push(listener);
    }

    subscribe_withInit(listener : (old_value : T, new_value : T) => void)
    {
        this.subscribe(listener);
        listener(this._oldValue, this._value);
    }

    get value()
    {
        return this._value;
    }

    set value(val : T)
    {
        if(this._value != val)
        {
            this._oldValue = this._value;
            this._value = val;
            this.notify();
        }
    }
}

class BindingIndex
{
    public index : number;
    constructor(p_index : number)
    {
        this.index = p_index;
    }
}

class MObservable<T>
{
    protected _listeners : ((arg0 : T) => void)[];
    protected _listeners_free : number[];
    protected _value : T;

    constructor(value : T)
    {
        this._listeners = [];
        this._listeners_free = [];
        this._value = value;
    }

    notify()
    {
        this._listeners.forEach(listener => {
            if(listener!=null)
            {
                listener(this._value);
            }
        });
    }

    subscribe(listener : (arg0 : T) => void) : BindingIndex
    {
        if(this._listeners_free.length > 0)
        {
            let l_index : number = this._listeners_free.pop();
            this._listeners[l_index] = listener;
            return new BindingIndex(l_index);
        }
        else
        {
            this._listeners.push(listener);
            return new BindingIndex(this._listeners.length - 1);
        }
    }

    unsubscribe(p_index : BindingIndex)
    {
        if(p_index.index <= this._listeners.length - 1)
        {
            this._listeners[p_index.index] = null;
            this._listeners_free.push(p_index.index);
        }
    }

    subscribe_withInit(listener : (arg0 : T) => void) : BindingIndex
    {
        let l_index : BindingIndex = this.subscribe(listener);
        listener(this._value);
        return l_index;
    }

    get value()
    {
        return this._value;
    }

    set value(val : T)
    {
        if(this._value != val)
        {
            this._value = val;
            this.notify();
        }
    }
}

class MWatcher<T> 
{
    protected _listeners : ((old_value : T, new_value : T) => void)[];
    protected _listeners_free : number[];
    protected _value : T;
    protected _oldValue : T;

    constructor(value : T)
    {
        this._listeners = [];
        this._listeners_free = [];
        this._value = value;
        this._oldValue = value;
    }

    notify()
    {
        this._listeners.forEach(listener => {
            if(listener!=null)
            {
                listener(this._oldValue, this._value);
            }
        });
    }

    subscribe(listener : (old_value : T, new_value : T) => void) : BindingIndex
    {
        if(this._listeners_free.length > 0)
        {
            let l_index : number = this._listeners_free.pop();
            this._listeners[l_index] = listener;
            return new BindingIndex(l_index);
        }
        else
        {
            this._listeners.push(listener);
            return new BindingIndex(this._listeners.length - 1);
        }
    }

    unsubscribe(p_index : BindingIndex)
    {
        if(p_index.index <= this._listeners.length - 1)
        {
            this._listeners[p_index.index] = null;
            this._listeners_free.push(p_index.index);
        }
    }

    subscribe_withInit(listener : (old_value : T, new_value : T) => void) : BindingIndex
    {
        let l_index : BindingIndex = this.subscribe(listener);
        listener(this._oldValue, this._value);
        return l_index;
    }

    get value()
    {
        return this._value;
    }

    set value(val : T)
    {
        if(this._value != val)
        {
            this._oldValue = this._value;
            this._value = val;
            this.notify();
        }
    }
}

class BindingUtils
{
    static bindInputText(input : HTMLInputElement, observable : Observable<string>)
    {
        input.value = observable.value;
        observable.subscribe(() => {input.value = observable.value});
        input.onkeyup = () => observable.value = input.value;
    }

    static bindToInputText(observable : Observable<string>, input : HTMLInputElement)
    {
        observable.subscribe((p_str:string) => {input.value = p_str});
    }

    static bindDisplayStyle(p_element : HTMLElement, observable : Observable<boolean>)
    {
        p_element.style.display = observable.value ? "" : "NONE";
        observable.subscribe(() => {  p_element.style.display = observable.value ? "" : "NONE"; });
    }
}

export {Observable, Computed, Watcher, BindingUtils, BindingIndex, MObservable, MWatcher}