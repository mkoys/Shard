export default class Importer {
    constructor() {
        this.modules = [];
        this.states = [];
    }

    import(module) {
        this.modules.push(module);
        this.render();
    }

    state(name, value) {
        this.states.push({
            key: name,
            value: value,
            element: []
        })

        const index = this.states.findIndex(item => item.key === name);

        return (value) => {
            this.states[index].value = value;
            this.states[index].element.forEach(elm => {
                elm.innerHTML = value;
            });
        }
    }

    async render() {
        this.modules.forEach(async module => {
            const result = await fetch(`./template/${module}.html`);

            const textResult = await result.text();

            const domParser = new DOMParser();

            const moduleDocument = domParser.parseFromString(textResult, "text/html");

            const moduleStyle = moduleDocument.querySelector("style");
            const moduleBody = moduleDocument.body.children[0];
            const moduleScript = moduleDocument.querySelector("script");

            if (moduleStyle) {
                document.head.appendChild(moduleStyle);
            }

            const allTemplates = document.querySelectorAll(`shard-${module}`);

            allTemplates.forEach(element => {
                element.root = element;
                element.outerHTML = moduleBody.outerHTML;

                for (let index = 0; index < element.attributes.length; index++) {
                    const currentText = document.querySelector(`text#${element.attributes[index].name}`);
                    const parent = currentText.parentElement;
                    if (element.attributes[index].value.startsWith("{") && element.attributes[index].value.endsWith("}")) {
                        let value = element.attributes[index].value;
                        value = value.replace("{", "");
                        value = value.replace("}", "");
                        const stateIndex = this.states.findIndex(item => item.key === value);

                        this.states[stateIndex].element.push(parent);
                        currentText.outerHTML = this.states[stateIndex].value;
                    } else {
                        currentText.outerHTML = element.root.attributes[index].value;
                    }
                }
            });
            
            if (moduleScript) {
                const newScript = document.createElement("script");
                newScript.setAttribute("type", "module");
                newScript.innerHTML = moduleScript.innerHTML;
                document.head.appendChild(newScript);
            }
        });
    }
}