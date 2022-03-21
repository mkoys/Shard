async function load(page) {
    const result = await fetch(`./page/${page}.html`);
    const textResult = await result.text();


    document.body.innerHTML = null;
    const modScript = document.head.querySelector("[module]");

    if(modScript) {
        modScript.outerHTML = null;
    }
 
    const domParser = new DOMParser();
    const doc = domParser.parseFromString(textResult, "text/html");

    document.head.querySelector("style").innerHTML = doc.head.querySelector("style").innerHTML
    document.body.outerHTML = doc.body.outerHTML;

    if (doc.querySelector("script")) {
        const newScript = document.createElement("script");
        newScript.setAttribute("type", "module");
        newScript.setAttribute("module", "");
        newScript.innerHTML = doc.querySelector("script").innerHTML;
        document.body.appendChild(newScript);
    }

    primeRoutes();
}


function primeRoutes() {
    const routes = document.querySelectorAll("[route]");

    for (let routeIndex = 0; routeIndex < routes.length; routeIndex++) {
        routes[routeIndex].addEventListener("click", () => {
            load(routes[routeIndex].getAttribute("route"));
        })
    }
}

export default { load }