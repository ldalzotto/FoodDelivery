
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
              if(route.Callback(match.input))
              {
                return true;
              };
            }
            return false;
        });
    }

    static extractQueryParams(p_path : string) : RouteQueryParams
    {
        let l_params : RouteQueryParams = {};
        let l_queryMatch_0 = p_path.match(/(\?(.+?)=([^&]*))/g);
        if(l_queryMatch_0.length > 0)
        {
            for(let i=0;i<l_queryMatch_0.length;i++)
            {
                let l_querySubmatch =  l_queryMatch_0[i].match(/(\?(.+?)=([^&]*))/);
                for(let j=0;j<l_querySubmatch.length;j = j + 2)
                {
                    l_params[l_querySubmatch[j]] = l_querySubmatch[j+1];
                }

            }
        }


        let l_queryMath_1 = p_path.match(/(&(.*)=([^&]*))/g);

        if(l_queryMath_1.length > 0)
        {
            for(let i=0;i<l_queryMath_1.length;i++)
            {
                let l_querySubmatch =  l_queryMath_1[i].match(/(&(.*)=([^&]*))/);
                for(let j=0;j<l_querySubmatch.length;j = j + 2)
                {
                    l_params[l_querySubmatch[j]] = l_querySubmatch[j+1];
                }

            }
        }

        return l_params;
    }
}

interface RouteQueryParams
{
    [name:string]: string
}

class Route
{
    public Path : string;
    public Callback : (p_math : string)=>boolean;

    constructor(p_path : string, p_callback : (p_math : string)=>boolean)
    {
        this.Path = p_path;
        this.Callback = p_callback;
    }
}


export {Router, Route};