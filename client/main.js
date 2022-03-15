import Importer from "./core/importer.js";

const importer = new Importer(document);

importer.import("input");

const setTest = importer.state("test", Math.random());

setInterval(() => {
    setTest(Math.random());
})