export default class Importer {
    constructor(doc) {
        this.doc = doc;
        this.modules = [];
    }

    async add(module) {
        this.modules.push(module)
        const result = await fetch(`../template/${module}.html`);
        const resultText = await result.text();

        const domParser = new DOMParser();
        const componentDoc = domParser.parseFromString(resultText, "text/html");

        const componentStyle = componentDoc.head.querySelector("style");
        const newStyle = document.createElement("style");

        const compoenentElement = componentDoc.body.children[0];

        const compoenentScript = componentDoc.querySelector("script");
        const newScript = document.createElement("script");

        const allComponentInstances = document.querySelectorAll(`shard-${module}`);

        if (componentStyle) {
            newStyle.innerHTML = componentStyle.innerHTML;
            document.head.appendChild(newStyle);
        }

        for (let index = 0; index < allComponentInstances.length; index++) {
           allComponentInstances[index].outerHTML = compoenentElement.outerHTML;
        }


        if (compoenentScript) {
            newScript.innerHTML = compoenentScript.innerHTML;
            newScript.setAttribute("type", "module");
            document.head.appendChild(newScript);
        }
    }
}