export default class Importer {
    constructor(document) {
        this.document = document
        this.states = [];
        this.modules = [];
        this.render(document)
    }

    render(document) {
        const allText = document.querySelectorAll("[text]");

        allText.forEach(element => {
            if (!element.localName.startsWith("shard")) {
                let textValue = element.getAttribute("text");
                if (!textValue.startsWith("{")) {
                    element.removeAttribute("text");
                    const valueIndex = this.states.findIndex(item => item.key === element.getAttribute("text"));
                    if (valueIndex > -1) {
                        element.textContent = this.states[valueIndex].value;
                    }
                } else {
                    textValue = textValue.replace("{", "");
                    textValue = textValue.replace("}", "");
                    textValue = element.setAttribute("text", textValue);
                }
            }
        });
    }

    state(name, value, document) {
        this.states.push({
            key: name,
            value: value
        });

        this.render(document)

        return (newValue) => {
            const index = this.states.findIndex(item => item.key === name);

            this.states[index].value = newValue;

            this.render(document)
        }
    }

    async add(module) {
        this.modules.push(module);

        const result = await fetch(`/template/${module}.html`);

        const textDom = await result.text();

        const parser = new DOMParser();

        const dom = parser.parseFromString(textDom, "text/html");

        const moduleStyle = dom.head.querySelector("style");
        const moduleHtml = dom.body.children[0];
        const moduleScript = dom.querySelector("script");

        const allModuleElements = document.querySelectorAll(`shard-${module}`)

        const splitScript = moduleScript.innerHTML.split("\n");

        let lineIndex = splitScript.findIndex(item => {
            item.indexOf("import");

            return item;
        })

        delete splitScript[lineIndex];

        let modifiedScript = splitScript.join("\n");

        modifiedScript = modifiedScript.replace(/document/, "moduleHtml");

        eval(modifiedScript);

        document.head.appendChild(moduleStyle);

        allModuleElements.forEach(element => {
            const cloneHtml = moduleHtml.cloneNode(true);

            const allText = cloneHtml.querySelectorAll("[text]");

            const textList = element.getAttribute("text");

            const textArray = textList.split(",");

            textArray.forEach((item, index) => textArray[index] = item.split(":"));

            allText.forEach(element => {
                let textValue = element.getAttribute("text");

                const index = textArray.findIndex(item => item[0] === textValue);

                element.removeAttribute("text");

                element.textContent = textArray[index][1];
            });

            element.appendChild(cloneHtml)
        })


    }
}