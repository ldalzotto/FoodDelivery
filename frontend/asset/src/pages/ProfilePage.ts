class ProfilePage extends HTMLElement
{
    constructor()
    {
        super();        
        this.attachShadow({mode: 'open'});
        this.shadowRoot.append((document.getElementById("profile-page") as HTMLTemplateElement).content.cloneNode(true));
    }
}

customElements.define('profile-page', ProfilePage);

export {ProfilePage}