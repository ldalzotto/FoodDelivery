class QueryParamBuilder
{
    public params : string = "";
    public isQuestionMark : boolean = true;

    public addParam(p_name : string, p_value : string) : QueryParamBuilder
    {
        if(this.isQuestionMark)
        {
            this.params += `?${p_name}=${p_value}`;
            this.isQuestionMark = false;
        }
        else
        {
            this.params += `&${p_name}=${p_value}`;
        }

        return this;
    }
}

export {QueryParamBuilder}