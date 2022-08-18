const postcss = require("postcss");

const plugin = require("./index.js");

async function run(input, output, opts = { }) {
  const result = await postcss([plugin(opts)]).process(input, { from: undefined });
  //console.log("Result CSS: ", result.css);
  expect(result.css).toEqual(output);
  expect(result.warnings()).toHaveLength(0);
}

// Write tests here

it('does something', async () => {
  await run(`p {
    background-color: #fff;
    color: a11y-txt(#fff);
  }`, `p {
    background-color: #fff;
    color: a11y-txt(#fff);
  }`, {});
});
it('does something', async () => {
  await run(`p {
    background-color: #fff;
    color: a11y-txt(#fff);
  }`, `p {
    background-color: #fff;
    color: a11y-txt(#fff);
  }`, {rootFontSize: ".5in"});
});
it('does something', async () => {
  await run(`p {
    background-color: #fff;
    color: a11y-txt(#fff);
  }`, `p {
    background-color: #fff;
    color: a11y-txt(#fff);
  }`, {rootFontSize: "3mm"});
});
it('does something', async () => {
  await run(`p {
    background-color: #fff;
    color: a11y-txt(#fff);
  }`, `p {
    background-color: #fff;
    color: a11y-txt(#fff);
  }`, {rootFontSize: "1.5pt"});
});
//color: hsl(0 0% 29%);
