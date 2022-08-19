"use strict";

import valueParser from "postcss-value-parser";

import { gettxt } from "./tools.mjs";

const OPTIONS = {
  rootFontSize: "16px",
  fontSize: "16px",
  fontWeight: 400,
  usage: 4,
};

function plugin(options = {}) {
  const { rootFontSize, fontSize, fontWeight, usage, } = Object.assign(OPTIONS, options);

  let curM = OPTIONS.rootM = getFontSizePX(rootFontSize);

  return {
    postcssPlugin: "postcss-accessibility",

    Declaration(decl) {
      const values = decl.value.split(/(?!\(.*)\s(?![^(]*?\))/g);

      for (const valueIndex in values) {
        const value = values[valueIndex];
        if (value.startsWith("a11y-txt(")) {
          const params = valueParser(value).nodes[0].nodes
            .filter(i => i.type !== "div")
            .map(i => {
              switch (i.type) {
                case "word": return i.value;
                case "function": return `${i.value}(${i.nodes.filter(i => i.type !== "div").map(i => i.value).join("")})`;
              }
            });
          decl.value = gettxt(params[0], "txt", `${getFontSizePX(params[1] ?? fontSize, curM)}px`, params[2] ?? fontWeight, params[3] ?? usage);
        }
      }
    }
  }
}
plugin.postcss = true;

/**
 * @type {import('postcss').PluginCreator}
 */
export default plugin;

function getFontSizePX(fontSize, M = OPTIONS.rootM) {
  if (typeof fontSize !== "string" && !(fontSize instanceof String)) return;

  let [, value, unit] = fontSize.match(/^(\d*\.?\d+)(px|cm|mm|Q|in|pc|pt|rem|em)$/) ?? [];

  if (unit.includes("em") && !OPTIONS.rootM) return;

  if (value == null || !unit == null) return;

  if (unit.startsWith(".")) unit = 0 + unit;

  switch (unit) {
    case "em": return value * M;
    case "rem": return value * OPTIONS.rootM;
    case "px": return value;
    case "cm": return value * 96/2.54;
    case "mm": return value * 96/2.54/10;
    case "Q": return value * 96/2.54/10*4;
    case "in": return value * 96;
    case "pc": return value * 96/6;
    case "pt": return value * 96/72;
    default: return;
  }
}
