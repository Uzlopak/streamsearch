import b from "benny";
import SBMH from "./sbmh";
import Prev from "./sbmh";

const input =
  Buffer.from(`In incididunt enim consectetur laborum exercitation fugiat nulla. Labore non ex id deserunt commodo in occaecat. Nulla sit exercitation minim aliqua quis proident veniam aliqua mollit fugiat cupidatat deserunt.

Deserunt nulla enim pariatur fugiat eiusmod. Irure consectetur incididunt esse laborum laboris laborum sunt nulla quis aute. Deserunt ipsum laborum sit sunt nisi mollit consectetur voluptate Lorem duis. Fugiat laborum proident aliquip elit sunt enim excepteur aute. Eiusmod deserunt laboris proident in ipsum duis enim enim aute. Ipsum magna tempor sunt proident id ipsum tempor consequat reprehenderit deserunt.

Pariatur sunt proident ea labore consectetur cillum in laborum proident aliqua aliqua voluptate. Irure esse ad elit aute irure deserunt excepteur incididunt voluptate culpa anim nisi aliqua. Id pariatur sunt consequat id nulla culpa. Incididunt duis ea sint nisi. Nisi commodo aliquip dolore amet fugiat sint elit laboris do dolor est aliquip enim.`);

const chunkSizes = [4, 16, 64];

b.suite(
  "sbmh",
  ...chunkSizes.map((chunkSize) =>
    b.add(`chunk=${chunkSize}B`, () => {
      const m = new SBMH(Buffer.from("sunt"), () => undefined);
      for (let i = 0; i < input.length; i += chunkSize) {
        m.push(input.slice(i, i + chunkSize), 0);
      }
    })
  ),
  ...chunkSizes.map((chunkSize) =>
    b.add(`(prev) chunk=${chunkSize}B`, () => {
      const m = new Prev(Buffer.from("sunt"), () => undefined);
      for (let i = 0; i < input.length; i += chunkSize) {
        m.push(input.slice(i, i + chunkSize), 0);
      }
    })
  ),
  b.cycle(),
  b.complete()
);
