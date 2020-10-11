
class Router
{
    private routes : Route[];
    private current : string;

    constructor()
    {
        this.routes = [];
        window.addEventListener('popstate', (ev : PopStateEvent) => { this.onStatedChanged(); });
    }

    add(p_route : Route)
    {
        this.routes.push(p_route);
    }

    remove(p_path : string)
    {
        for(let i=0;i<this.routes.length;i++)
        {
            if(this.routes[i].Path === p_path)
            {
                this.routes.splice(i, 1);
                return;
            }
        }
    }

    flush()
    {
        this.routes = [];
    }

    private getFragment() : string
    {
        return  decodeURI(window.location.pathname + window.location.search);
    }

    navigate(p_path : string)
    {
        if(this.current !== p_path)
        {
            this.pushState(p_path);
        }
    }

    interpretCurrentUrl()
    {
        this.navigate(this.getFragment());
    }

    private pushState(p_path : string)
    {
        window.history.pushState(null, null, p_path);
        this.onStatedChanged();
    }

    private onStatedChanged()
    {
        let l_fragment = this.getFragment();
        if (this.current === l_fragment) return;
        this.current = l_fragment;
    
        this.routes.some((route : Route) => {
            const match = this.current.match(route.Path);
            if (match) {
              match.shift();
              route.Callback.apply({}, match);
              return true;
            }
            return false;
        });
    }
}

class Route
{
    public Path : string;
    public Callback : ()=>void;

    constructor(p_path : string, p_callback : ()=>void)
    {
        this.Path = p_path;
        this.Callback = p_callback;
    }
}


export {Router, Route};