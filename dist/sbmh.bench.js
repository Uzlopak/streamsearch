"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const benny_1 = require("benny");
const sbmh_1 = require("./sbmh");
const sbmh_2 = require("./sbmh");
const input = Buffer.from(`In incididunt enim consectetur laborum exercitation fugiat nulla. Labore non ex id deserunt commodo in occaecat. Nulla sit exercitation minim aliqua quis proident veniam aliqua mollit fugiat cupidatat deserunt.

Deserunt nulla enim pariatur fugiat eiusmod. Irure consectetur incididunt esse laborum laboris laborum sunt nulla quis aute. Deserunt ipsum laborum sit sunt nisi mollit consectetur voluptate Lorem duis. Fugiat laborum proident aliquip elit sunt enim excepteur aute. Eiusmod deserunt laboris proident in ipsum duis enim enim aute. Ipsum magna tempor sunt proident id ipsum tempor consequat reprehenderit deserunt.

Pariatur sunt proident ea labore consectetur cillum in laborum proident aliqua aliqua voluptate. Irure esse ad elit aute irure deserunt excepteur incididunt voluptate culpa anim nisi aliqua. Id pariatur sunt consequat id nulla culpa. Incididunt duis ea sint nisi. Nisi commodo aliquip dolore amet fugiat sint elit laboris do dolor est aliquip enim.`);
const chunkSizes = [4, 16, 64];
benny_1.default.suite("sbmh", ...chunkSizes.map((chunkSize) => benny_1.default.add(`chunk=${chunkSize}B`, () => {
    const m = new sbmh_1.default(Buffer.from("sunt"), () => undefined);
    for (let i = 0; i < input.length; i += chunkSize) {
        m.push(input.slice(i, i + chunkSize), 0);
    }
})), ...chunkSizes.map((chunkSize) => benny_1.default.add(`(prev) chunk=${chunkSize}B`, () => {
    const m = new sbmh_2.default(Buffer.from("sunt"), () => undefined);
    for (let i = 0; i < input.length; i += chunkSize) {
        m.push(input.slice(i, i + chunkSize), 0);
    }
})), benny_1.default.cycle(), benny_1.default.complete());
//# sourceMappingURL=sbmh.bench.js.map