let importList = [];

export default async function importer(module, globalDoc) {
    importList.push(module);
    const htmldata = await fetch(`../template/${module}.html`);

    const textdata = await htmldata.text();

    const parser = new DOMParser();

    let data = parser.parseFromString(textdata, "text/html");
        const allStuff = globalDoc.body.querySelectorAll(`${module}-shard`);
        for (let y = 0; y < allStuff.length; y++) {
            if (allStuff[y]) {
                const allText = data.querySelectorAll("text");
                for (let z = 0; z < allText.length; z++) {
                    const currentText = data.querySelector(`text#${allText[z].id}`);

                    const elm = data.querySelector("[set]");

                    elm.attributes[elm.attributes["set"].value].value = allStuff[y].attributes[elm.attributes["set"].value].value;

                    currentText.outerHTML = allStuff[y].attributes[allText[z].id].value;
                }

            }
            if (data.querySelector("slot")) {
                if (allStuff[y].children) {
                    data.querySelector("slot").outerHTML = allStuff[y].innerHTML
                }
            }
            allStuff[y].outerHTML = data.body.children[0].outerHTML;
            data = parser.parseFromString(textdata, "text/html");

        }

        return data;
    }


