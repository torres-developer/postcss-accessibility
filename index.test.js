import postcss from "postcss";

import plugin from "./index.js";

async function run(input, output, opts = { }) {
  const result = await postcss([plugin(opts)]).process(input, { from: undefined });
  //console.log("Result CSS: ", result.css);
  expect(result.css).toEqual(output);
  expect(result.warnings()).toHaveLength(0);
}

// Write tests here

it("finds the best text color for the background-color: hsl(192deg, 62%, 94%)", async () => {
  await run(`p {
    background-color: hsl(192 62% 94%);
    color: a11y-txt(hsl(192 62% 94%), 1.75em, 400);
    font-size: 1.75em;
  }`, `p {
    background-color: hsl(192 62% 94%);
    color: hsl(192.63157894736838 61.290322580645174% 17%);
    font-size: 1.75em;
  }`, {});
});
