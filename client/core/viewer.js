async function load(page) {
    const result = await fetch(`./page/${page}.html`);
    const textResult = await result.text();

    const domParser = new DOMParser();
    const doc = domParser.parseFromString(textResult, "text/html");

    document.head.querySelector("style").innerHTML = doc.head.querySelector("style").innerHTML
    document.body.outerHTML = doc.body.outerHTML;
    
    if (doc.querySelector("script")) {
        const newScript = document.createElement("script");
        newScript.setAttribute("type", "module");
        newScript.innerHTML = doc.querySelector("script").innerHTML;
        document.head.appendChild(newScript);
    }
}

export default { load }