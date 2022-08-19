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
['px', 100,         200,         300,         400,         500,         600,         700,         800,         900         ],
[10,   { Lc: 999 }, { Lc: 999 }, { Lc: 999 }, { Lc: 999 }, { Lc: 999 }, { Lc: 999 }, { Lc: 999 }, { Lc: 999 }, { Lc: 999 } ],
[12,   { Lc: 999 }, { Lc: 999 }, { Lc: 999 }, { Lc: 777 }, { Lc: 777 }, { Lc: 777 }, { Lc: 777 }, { Lc: 999 }, { Lc: 999 } ],
[14,   { Lc: 999 }, { Lc: 999 }, { Lc: 777 }, { Lc: 100 }, { Lc: 100 }, { Lc: 90 },  { Lc: 75 },  { Lc: 999 }, { Lc: 999 } ],
[15,   { Lc: 999 }, { Lc: 999 }, { Lc: 777 }, { Lc: 100 }, { Lc: 90 },  { Lc: 75 },  { Lc: 70 },  { Lc: 999 }, { Lc: 999 } ],
[16,   { Lc: 999 }, { Lc: 999 }, { Lc: 777 }, { Lc: 90 },  { Lc: 75 },  { Lc: 70 },  { Lc: 60 },  { Lc: 60 },  { Lc: 999 } ],
[18,   { Lc: 999 }, { Lc: 777 }, { Lc: 100 }, { Lc: 75 },  { Lc: 70 },  { Lc: 60 },  { Lc: 55 },  { Lc: 55 },  { Lc: 55 }  ],
[21,   { Lc: 999 }, { Lc: 777 }, { Lc: 90 },  { Lc: 70 },  { Lc: 60 },  { Lc: 55 },  { Lc: 50 },  { Lc: 50 },  { Lc: 50 }  ],
[24,   { Lc: 999 }, { Lc: 777 }, { Lc: 75 },  { Lc: 60 },  { Lc: 55 },  { Lc: 50 },  { Lc: 45 },  { Lc: 45 },  { Lc: 45 }  ],
[28,   { Lc: 999 }, { Lc: 100 }, { Lc: 70 },  { Lc: 55 },  { Lc: 50 },  { Lc: 45 },  { Lc: 43 },  { Lc: 43 },  { Lc: 43 }  ],
[32,   { Lc: 999 }, { Lc: 90 },  { Lc: 65 },  { Lc: 50 },  { Lc: 45 },  { Lc: 43 },  { Lc: 40 },  { Lc: 40 },  { Lc: 40 }  ],
[36,   { Lc: 999 }, { Lc: 75 },  { Lc: 60 },  { Lc: 45 },  { Lc: 43 },  { Lc: 40 },  { Lc: 38 },  { Lc: 38 },  { Lc: 38 }  ],
[42,   { Lc: 100 }, { Lc: 70 },  { Lc: 55 },  { Lc: 43 },  { Lc: 40 },  { Lc: 38 },  { Lc: 35 },  { Lc: 35 },  { Lc: 35 }  ],
[48,   { Lc: 90 },  { Lc: 60 },  { Lc: 50 },  { Lc: 40 },  { Lc: 38 },  { Lc: 35 },  { Lc: 33 },  { Lc: 33 },  { Lc: 33 }  ],
[60,   { Lc: 75 },  { Lc: 55 },  { Lc: 45 },  { Lc: 38 },  { Lc: 35 },  { Lc: 33 },  { Lc: 30 },  { Lc: 30 },  { Lc: 30 }  ],
[72,   { Lc: 60 },  { Lc: 50 },  { Lc: 40 },  { Lc: 35 },  { Lc: 33 },  { Lc: 30 },  { Lc: 30 },  { Lc: 30 },  { Lc: 30 }  ],
[96,   { Lc: 50 },  { Lc: 45 },  { Lc: 35 },  { Lc: 33 },  { Lc: 30 },  { Lc: 30 },  { Lc: 30 },  { Lc: 30 },  { Lc: 30 }  ],
];

export function gettxt(color, knownType, fs, fw, usage) {
  if (fw <= 100) console.warn("Avoid using font-weight 100");

  const [fontWeights, ...rest] = byFontSize;
  const closestFontSize = rest.reduce((x, y) => Math.abs(y[0] - fs) < Math.abs(x[0] - fs) ? y : x);
  let Lc = closestFontSize[fontWeights.indexOf(+fw)].Lc;

  switch (usage.toUpperCase()) {
    case "DECORATIVE": usage = 1; break;
    case "SPOT": usage = 2; break;
    case "SUBFLUENT": usage = 3; break;
    case "FLUENT": usage = 4; break;
    case "BODYTEXT": usage = 5; break;
    case "MAX": usage = 6; break;
  }

  if (Lc === 999) {
    if (usage !== 1) {
     return console.log(
       `Got font-size = ${fs}px and font-weight = ${fw}.`,
       "Too low. Prohibited Except for Decorative Purposes. Maybe you forgot to make the usage = Decorative."
     );
    }
    Lc = minScoreG;
  } else if (Lc === 777) {
    if (usage !== 2) {
     return console.log(
       `Got font-size = ${fs}px and font-weight = ${fw}.`,
       "Just for non-text and spot text only. Maybe you forgot to make the usage = Spot. If not try to increase the font size or font weight."
     );
    }
    Lc = nonTextScoreG;
  } else if (Lc < nonTextScoreG && usage > 3) {
    return console.log(
      `Got font-size = ${fs}px and font-weight = ${fw}.`,
      "Contrast too low for text. Try decreasing the font size or the font weight."
    );
  } else if (
    fw >= 300 && fw <= 700 &&
    fs >= 14 && fs <= 36 &&
    Lc > nonTextScoreG &&
    usage > 4
  ) {
    Lc += 15;
  }

  const target = fontScoreGmin.reduce((x, y) => Math.abs(y[0] - Lc) < Math.abs(x[0] - Lc) ? y : x)[usage];
  
  const { h, s } = toHSL(color);

  const colors = [];
  for (let i = 0; i <= 100; i++) {
    const newColor = toHSLString({h, s, l: i});

    let contrast;
    switch (knownType) {
      case "bg": contrast = calcAPCA(newColor, color); break;
      case "txt": contrast = calcAPCA(color, newColor); break;
    }

    colors.push({
      color: newColor,
      contrast
    });
  }

  const { color: contrast } = colors.reduce((x, y) => Math.abs(Math.abs(y.contrast) - target) < Math.abs(Math.abs(x.contrast) - target) ? y : x);

  /*
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
  */
  
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

  return {
    h: Math.round(h),
    s: Math.round(s * 100) + "%",
    l: Math.round(l * 100) + "%",
  };
}

function toHSLString({h, s, l}) {
  return `hsl(${h} ${s} ${l}%)`;
}
