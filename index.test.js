import postcss from "postcss";

import plugin from "./index.js";

async function run(input, output, opts = { }) {
  const result = await postcss([plugin(opts)]).process(input, { from: undefined });
  //console.log("Result CSS: ", result.css);
  expect(result.css).toEqual(output);
  expect(result.warnings()).toHaveLength(0);
}

// Write tests here

it("Use text as a decorative element for the background-color: hsl(192deg, 62%, 6%)", async () => {
  await run(`p {
    background-color: hsl(192 62% 6%);
    color: a11y-txt(hsl(192 62% 6%), 12px, 100, Decorative);
    font-size: 12px;
    font-weight: 100;
  }`, `p {
    background-color: hsl(192 62% 6%);
    color: hsl(193 61% 24%);
    font-size: 12px;
    font-weight: 100;
  }`);
});

it("Creates a good text color to use on copyright/by-line text for the background-color: hsl(192deg, 62%, 6%)", async () => {
  await run(`p {
    background-color: hsl(192 62% 6%);
    color: a11y-txt(hsl(192 62% 6%), 14px, 300, Spot);
    font-size: 14px;
    font-weight: 300;
  }`, `p {
    background-color: hsl(192 62% 6%);
    color: hsl(193 61% 36%);
    font-size: 14px;
    font-weight: 300;
  }`);
});

it("Use text as a decorative element for the background-color: hsl(192deg, 62%, 6%)", async () => {
  await run(`p {
    background-color: hsl(192 62% 6%);
    color: a11y-txt(hsl(192 62% 6%), 96px, 900, Decorative);
    font-size: 96px;
    font-weight: 900;
  }`, `p {
    background-color: hsl(192 62% 6%);
    color: hsl(193 61% 32%);
    font-size: 96px;
    font-weight: 900;
  }`);
});

it("Creates a good text color to use on copyright/by-line text for the background-color: hsl(192deg, 62%, 6%)", async () => {
  await run(`p {
    background-color: hsl(192 62% 6%);
    color: a11y-txt(hsl(192 62% 6%), 96px, 900, Spot);
    font-size: 96px;
    font-weight: 900;
  }`, `p {
    background-color: hsl(192 62% 6%);
    color: hsl(193 61% 36%);
    font-size: 96px;
    font-weight: 900;
  }`);
});

//
//
//

it("", async () => {
  await run(`p {
    background-color: hsl(192 62% 6%);
    color: a11y-txt(hsl(192 62% 6%), 96px, 200, Fluent);
    font-size: 96px;
    font-weight: 200;
  }`, `p {
    background-color: hsl(192 62% 6%);
    color: hsl(193 61% 60%);
    font-size: 96px;
    font-weight: 200;
  }`);
});

it("", async () => {
  await run(`p {
    background-color: hsl(192 62% 6%);
    color: a11y-txt(hsl(192 62% 6%), 28px, 200, Fluent);
    font-size: 28px;
    font-weight: 200;
  }`, `p {
    background-color: hsl(192 62% 6%);
    color: hsl(193 61% 88%);
    font-size: 28px;
    font-weight: 200;
  }`);
});

it("", async () => {
  await run(`p {
    background-color: hsl(192 62% 6%);
    color: a11y-txt(hsl(192 62% 6%), 42px, 900, Fluent);
    font-size: 42px;
    font-weight: 900;
  }`, `p {
    background-color: hsl(192 62% 6%);
    color: hsl(193 61% 44%);
    font-size: 42px;
    font-weight: 900;
  }`);
});

it("", async () => {
  await run(`p {
    background-color: hsl(192 62% 6%);
    color: a11y-txt(hsl(192 62% 6%), 16px, 800, Fluent);
    font-size: 16px;
    font-weight: 800;
  }`, `p {
    background-color: hsl(192 62% 6%);
    color: hsl(193 61% 72%);
    font-size: 16px;
    font-weight: 800;
  }`);
});
