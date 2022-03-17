let component, folder;

class customComponenet extends HTMLElement {
    constructor() {

        super();
        this.states = [];

        this.attachShadow({ mode: 'open' });

        let moduleStyle = document.createElement("style");
        let moduleBody = document.createElement("div");

        moduleStyle.innerHTML = component.moduleStyle.innerHTML;
        moduleBody.setAttribute("class", component.moduleBody.getAttribute("class"))
        moduleBody.innerHTML = component.moduleBody.innerHTML;

        this.shadowRoot.append(moduleStyle, moduleBody);

        this.definedText = this.getAttribute("text");


        this.definedText.split(",").forEach(item => {
            const values = item.split(":");

            const textElement = this.shadowRoot.querySelector(`text#${values[0]}`);

            textElement.outerHTML = values[1];
        });


        this.shadowRoot.querySelector("slot").outerHTML = this.innerHTML;
    }
}

function setFolder(newfolder) {
    folder = newfolder;
}

async function add(module) {
    const result = await fetch(`./${folder}/${module}.html`);

    const textResult = await result.text();

    const domParser = new DOMParser();

    const moduleDocument = domParser.parseFromString(textResult, "text/html");

    const moduleStyle = moduleDocument.querySelector("style");
    const moduleBody = moduleDocument.body.children[0];
    const moduleScript = moduleDocument.querySelector("script");

    component = { moduleScript, moduleBody, moduleStyle };

    customElements.define(`shard-${module}`, customComponenet);
}

export default { add, setFolder };