"use strict";

import { calcAPCA, fontLookupAPCA, reverseAPCA, sRGBtoY } from "apca-w3";
import { colorParsley } from "colorparsley";

function getFontSize(txtClr, bgClr, fontWeight) {
  return fontLookupAPCA(calcAPCA(txtClr, bgClr))[Math.round(fontWeight)/100];
}

function getBoW(txtClr, bgClr) {
  return /BoW/.test(calcAPCA(txtClr, bgClr, 0)) ? "#fff" : "#000";
}

// INDEX ARRAYS
// For the following arrays, the Y axis is contrastArrayLen
// The two x axis are weightArrayLen and scoreArrayLen

// MAY 25 2022 EXPANDED  //

const contrastArrayG = [0,125,120,115,110,105,100,95,90,85,80,75,70,65,60,55,50,45,40,35,30,25,20,15,10,0,];
const contrastArrayLenG = contrastArrayG.length; // Y azis

const weightArray = [0,100,200,300,400,500,600,700,800,900];
const weightArrayLen = weightArray.length;

const scoreArray = [0,1,2,3,4,5];
const scoreArrayLen = 6;

          // Lc contrast minimums per master level and score level
         // Lc, Spot, SubFluent, Fluent, BodyText, MAX
const fontScoreGmin = [         // CONTRAST LEVELS in Lc
    [90,60,67,78,90,90], // 0 MAX Large Headlines (> 36px & 700)
    [75,52,60,68,80,75], // 1 Min Cols of Body Text (manually set)
    [60,45,52,60,72,60], // 2 Min Content Text 
    [45,36,42,50,60,45], // 3 Min Large content text
    [30,25,30,35,42,30], // 4 Min non-content text, min large icons
    [15,14,15,20,25,15], // 5 Min for all (invisibility level)
    ];

const minScoreG = fontScoreGmin[5][1]; // Hard minimum contrast, all levels.

const nonTextScoreG = fontScoreGmin[4][2];  // level to break to non-text only

////////////////////////////////////////////////////////////////////////////////
/////     SORTED BY FONT SIZE         /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

// MAIN FONT LOOKUP May 25, 2022
// Sorted by Font Size
// First row is standard weights 100-900
// First column is font size in px
// All other values are the Lc contrast 
// 999 = too low. 777 = non-text and spot text only

const byFontSize = [
['px',100,200,300,400,500,600,700,800,900],
[10,  999,999,999,999,999,999,999,999,999],
[12,  999,999,999,777,777,777,777,999,999],
[14,  999,999,777,100,100,90, 75, 999,999],
[15,  999,999,777,100,90, 75, 70, 999,999],
[16,  999,999,777,90, 75, 70, 60, 60, 999],
[18,  999,777,100,75, 70, 60, 55, 55, 55 ],
[21,  999,777,90, 70, 60, 55, 50, 50, 50 ],
[24,  999,777,75, 60, 55, 50, 45, 45, 45 ],
[28,  999,100,70, 55, 50, 45, 43, 43, 43 ],
[32,  999,90, 65, 50, 45, 43, 40, 40, 40 ],
[36,  999,75, 60, 45, 43, 40, 38, 38, 38 ],
[42,  100,70, 55, 43, 40, 38, 35, 35, 35 ],
[48,  90, 60, 50, 40, 38, 35, 33, 33, 33 ],
[60,  75, 55, 45, 38, 35, 33, 30, 30, 30 ],
[72,  60, 50, 40, 35, 33, 30, 30, 30, 30 ],
[96,  50, 45, 35, 33, 30, 30, 30, 30, 30 ],
];

export function gettxt(color, knownType, fs, fw, usage) {
  const [fontWeights, ...rest] = byFontSize;
  const closestFontSize = rest.reduce((x, y) => Math.abs(y[0] - fs) < Math.abs(x[0] - fs) ? y : x);
  const Lc = closestFontSize[fontWeights.indexOf(fw)];
  const target = fontScoreGmin.reduce((x, y) => Math.abs(y[0] - Lc) < Math.abs(x[0] - Lc) ? y : x)[usage];

  const { h, s } = toHSL(color);

  const colors = [];
  for (let i = 0; i <= 100; i++) {
    const newColor = toHSLString({h, s, l: i});

    let contrast;
    switch (knownType) {
      case "txt": contrast = calcAPCA(newColor, color); break;
      case "bg": contrast = calcAPCA(color, newColor); break;
    }

    colors.push({
      color: newColor,
      contrast
    });
  }

  const { color: contrast } = colors.reduce((x, y) => Math.abs(Math.abs(y.contrast) - target) < Math.abs(Math.abs(x.contrast) - target) ? y : x);

  const colors3 = [];
  for (let i = 0; i <= 100; i++) {
    const newColor = toHSLString({h: 0, s: 0, l: i});

    let contrast;
    switch (knownType) {
      case "txt": contrast = calcAPCA(newColor, color); break;
      case "bg": contrast = calcAPCA(color, newColor); break;
    }

    colors3.push({
      color: newColor,
      contrast
    });
  }

  const { color: contrast3 } = colors3.reduce((x, y) => Math.abs(Math.abs(y.contrast) - target) < Math.abs(Math.abs(x.contrast) - target) ? y : x);

  let contrast2 = reverseAPCA(target, sRGBtoY(colorParsley(color)), knownType, "color");

  if (!contrast2) contrast2 = reverseAPCA(-target, sRGBtoY(colorParsley(color)), knownType, "color");

  contrast2 = toHSLString(toHSL(contrast2));

  //console.log(target, contrast, contrast2, contrast3);
  
  return contrast;
}

function toHSL(color) {
  let [r, g, b] = colorParsley(color);
  r /= 255;
  g /= 255;
  b /= 255;
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);

  const l = (min + max) / 2;

  const s = min === max
    ? 0
    : (l <= (1/2))
      ? (max - min) / (max + min)
      : (max - min) / (2 - max - min);

  const h = (() => {
    if (s === 0) return 0;
    
    switch (max) {
      case r: return (g - b) / (max - min);
      case g: return 2 + (b - r) / (max - min);
      case b: return 4 + (r - g) / (max - min);
    }
  })() * 60;

  return {h, s: s * 100 + "%", l: l * 100 + "%"};
}

function toHSLString({h, s, l}) {
  return `hsl(${h} ${s} ${l}%)`;
}
