"use strict";

const valueParser = require("postcss-value-parser");

//const { gettxt } = require("./tools.mjs");

console.log(valueParser);
//console.log(gettxt);

/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = (opts = {
  fontSize: 16,
  fontWeight: 400,
  usage: 4,
}) => {
  // Work with options here
  return {
    postcssPlugin: 'postcss-accessibility',
    //Rule: rule => {
    //  console.log(rule);
    //},
    Declaration: decl => {
      if (decl.value.startsWith("a11y-txt(")) {
        const params = valueParser(decl.value).nodes[0].nodes;
        console.log(/*gettxt(*/params[0].value, "txt", ...Object.values(opts)/*)*/);
      }
    },
  };
}

module.exports.postcss = true;
