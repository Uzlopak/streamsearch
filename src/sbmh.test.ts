import * as assert from "assert";
import SBMH from "./sbmh";

const input =
  Buffer.from(`In incididunt enim consectetur laborum exercitation fugiat nulla. Labore non ex id deserunt commodo in occaecat. Nulla sit exercitation minim aliqua quis proident veniam aliqua mollit fugiat cupidatat deserunt.

  Deserunt nulla enim pariatur fugiat eiusmod. Irure consectetur incididunt esse laborum laboris laborum sunt nulla quis aute. Deserunt ipsum laborum sit sunt nisi mollit consectetur voluptate Lorem duis. Fugiat laborum proident aliquip elit sunt enim excepteur aute. Eiusmod deserunt laboris proident in ipsum duis enim enim aute. Ipsum magna tempor sunt proident id ipsum tempor consequat reprehenderit deserunt.

  Pariatur sunt proident ea labore consectetur cillum in laborum proident aliqua aliqua voluptate. Irure esse ad elit aute irure deserunt excepteur incididunt voluptate culpa anim nisi aliqua. Id pariatur sunt consequat id nulla culpa. Incididunt duis ea sint nisi. Nisi commodo aliquip dolore amet fugiat sint elit laboris do dolor est aliquip enim.`);

it("finds matches in stream", () => {
  const expected: unknown[] = [
    [{ offset: 317, text: "sunt" }],
    [{ offset: 366, text: "sunt" }],
    [{ offset: 454, text: "sunt" }],
    [{ offset: 563, text: "sunt" }],
    [{ offset: 639, text: "sunt" }],
    [{ offset: 833, text: "sunt" }],
  ];

  for (let chunkSize = 1; chunkSize < 16; chunkSize++) {
    let rebuilt = "";
    const actual: unknown[] = [];
    let offset = 0;
    const needle = Buffer.from("sunt");
    const stream = new SBMH(needle, (match, buf) => {
      if (buf) {
        rebuilt += Buffer.from(buf).toString();
        offset += buf.length;
      }
      if (match) {
        rebuilt += needle.toString();
        actual.push([
          {
            offset,
            text: input.slice(offset, offset + needle.length).toString(),
          },
        ]);
        offset += needle.length;
      }
    });

    for (let i = 0; i < input.length; i += chunkSize) {
      stream.push(input.slice(i, i + chunkSize), 0);
    }

    assert.strictEqual(rebuilt, input.toString());
    assert.deepStrictEqual(expected, actual);
  }
});
