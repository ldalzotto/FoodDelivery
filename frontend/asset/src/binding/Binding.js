class Observable
{
    constructor(value)
    {
        this._listeners = [];
        this._value = value;
    }

    notify()
    {
        this._listeners.forEach(listener => listener(this._value));
    }

    subscribe(listener)
    {
        this._listeners.push(listener);
    }

    get value()
    {
        return this._value;
    }

    set value(val)
    {
        if(this._value != val)
        {
            this._value = val;
            this.notify();
        }
    }
}

class Computed extends Observable
{
    constructor(value, deps)
    {
        super(value());
        const listener = () => {
            this._value = value();
            this.notify();
        };
        deps.forEach(dep => dep.subscribe(listener));
    }

    get value()
    {
        return this._value;
    }

    set value(val)
    {
        throw "Cannot set computed property";
    }
}

const bindValue_inputElement = (input, observable) => {
    input.value = observable.value;
    observable.subscribe(() => {input.value = observable.value});
    input.onkeyup = () => observable.value = input.value;
}

export {Observable, Computed, bindValue_inputElement}