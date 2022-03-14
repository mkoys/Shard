

fetch("./page/login.html").then(res => res.text().then(res => {
    console.log(res)
    const parser = new DOMParser();

    const data = parser.parseFromString(res, "text/html");

    console.log(data.head.querySelector("style"));
    const newStyle = document.createElement("style");
    newStyle.innerHTML = data.head.querySelector("style").innerHTML
    document.head.appendChild(newStyle)

    document.body.innerHTML = data.body.innerHTML
}))