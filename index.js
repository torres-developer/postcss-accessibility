"use strict";

const valueParser = require("postcss-value-parser");

//const { gettxt } = require("./tools.mjs");

const DEFAULT_OPTS = {
  rootFontSize: "16px",
  fontSize: "16px",
  fontWeight: 400,
  usage: 4,
};

/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = (opts = {}) => {
  const { rootFontSize, fontSize, fontWeight, usage, } = Object.assign(DEFAULT_OPTS, opts);

  if (typeof rootFontSize !== "string" && !(rootFontSize instanceof String)) return;

  let [, rootFontSizeValue, rootFontSizeUnit] = rootFontSize.match(/^(\d*\.?\d+)(px|cm|mm|Q|in|pc|pt)$/) ?? [];

  if (rootFontSizeValue == null || !rootFontSizeUnit == null) return;

  if (rootFontSizeUnit.startsWith(".")) rootFontSizeUnit = 0 + rootFontSizeUnit;

  switch (rootFontSizeUnit) {
    case "px": break;
    case "cm": rootFontSizeValue *= 96/2.54; break;
    case "mm": rootFontSizeValue *= 96/2.54/10; break;
    case "Q": rootFontSizeValue *= 96/2.54/10*4; break;
    case "in": rootFontSizeValue *= 96; break;
    case "pc": rootFontSizeValue *= 96/6; break;
    case "pt": rootFontSizeValue *= 96/72; break;
    default: return;
  }

  console.log("fs: ", rootFontSizeValue);

  // Work with options here
  return {
    postcssPlugin: 'postcss-accessibility',
    //Rule: rule => {
    //  console.log(rule);
    //},
    Declaration: decl => {
      if (decl.value.startsWith("a11y-txt(")) {
        const params = valueParser(decl.value).nodes[0].nodes;
        //console.log(/*gettxt(*/params[0].value, "txt", ...Object.values(opts)/*)*/);
      }
    },
  };
}

module.exports.postcss = true;
