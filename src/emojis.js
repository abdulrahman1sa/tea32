// --- 1992 Retro / Classic Forum Animated Emojis (PURE SVG DATA URIs) ---
// FINAL SOLUTION: Embedding animated SVGs directly as Data URLs.
// No external links. No broken images. 100% Code-based animations.

const svgHeader = "data:image/svg+xml;charset=utf-8,";

// 1. Smile (Classic bouncing bounce)
const smileSVG = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="30" fill="#FFCC00" stroke="#8B4513" stroke-width="2"/>
  <circle cx="20" cy="24" r="4" fill="#000"/>
  <circle cx="44" cy="24" r="4" fill="#000"/>
  <path d="M 16 40 Q 32 56 48 40" stroke="#000" stroke-width="3" fill="none">
    <animate attributeName="d" values="M 16 40 Q 32 56 48 40; M 16 40 Q 32 50 48 40; M 16 40 Q 32 56 48 40" dur="0.8s" repeatCount="indefinite"/>
  </path>
</svg>`);

// 2. Grin (Big open mouth laugh)
const grinSVG = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="30" fill="#FFCC00" stroke="#8B4513" stroke-width="2"/>
  <circle cx="20" cy="24" r="4" fill="#000"/>
  <circle cx="44" cy="24" r="4" fill="#000"/>
  <path d="M 16 40 Q 32 60 48 40 Z" fill="#FFFFFF" stroke="#000" stroke-width="2">
     <animate attributeName="d" values="M 16 40 Q 32 60 48 40 Z; M 16 40 Q 32 65 48 40 Z; M 16 40 Q 32 60 48 40 Z" dur="0.4s" repeatCount="indefinite"/>
  </path>
</svg>`);

// 3. Wink (One eye closes)
const winkSVG = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="30" fill="#FFCC00" stroke="#8B4513" stroke-width="2"/>
  <circle cx="20" cy="24" r="4" fill="#000"/>
  <path d="M 40 24 L 50 24" stroke="#000" stroke-width="3">
     <animate attributeName="stroke-width" values="3;1;3" dur="1s" repeatCount="indefinite"/>
  </path>
  <path d="M 20 44 Q 32 52 44 44" stroke="#000" stroke-width="3" fill="none"/>
</svg>`);

// 4. Tongue (Stick out)
const tongueSVG = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="30" fill="#FFCC00" stroke="#8B4513" stroke-width="2"/>
  <circle cx="20" cy="24" r="4" fill="#000"/>
  <circle cx="44" cy="24" r="4" fill="#000"/>
  <path d="M 20 44 Q 32 44 44 44" stroke="#000" stroke-width="3" fill="none"/>
  <path d="M 26 44 Q 32 58 38 44 Z" fill="#FF69B4" stroke="#C71585" stroke-width="1">
      <animate attributeName="d" values="M 26 44 Q 32 58 38 44 Z; M 24 44 Q 32 64 40 44 Z; M 26 44 Q 32 58 38 44 Z" dur="0.6s" repeatCount="indefinite"/>
  </path>
</svg>`);

// 5. Cool (Sunglasses)
const coolSVG = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="30" fill="#FFCC00" stroke="#8B4513" stroke-width="2"/>
  <path d="M 10 24 Q 32 24 54 24 L 54 32 Q 43 40 32 32 Q 21 40 10 32 Z" fill="#000"/>
  <path d="M 20 48 Q 32 52 44 48" stroke="#000" stroke-width="3" fill="none"/>
  <animateTransform attributeName="transform" type="rotate" values="0 32 32; 10 32 32; 0 32 32" dur="2s" repeatCount="indefinite"/>
</svg>`);

// 6. Love (Heart eyes)
const loveSVG = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="30" fill="#FFCC00" stroke="#8B4513" stroke-width="2"/>
  <path d="M 16 26 Q 20 18 24 26 T 32 26" fill="red" transform="scale(0.8) translate(5,5)">
     <animateTransform attributeName="transform" type="scale" values="0.8; 1.2; 0.8" dur="0.8s" repeatCount="indefinite" additive="sum"/>
  </path>
  <path d="M 36 26 Q 40 18 44 26 T 52 26" fill="red" transform="scale(0.8) translate(-5,5)">
      <animateTransform attributeName="transform" type="scale" values="0.8; 1.2; 0.8" dur="0.8s" repeatCount="indefinite" additive="sum"/>
  </path>
  <path d="M 20 44 Q 32 52 44 44" stroke="#000" stroke-width="3" fill="none"/>
</svg>`);

// 7. Shock (:o)
const shockSVG = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="30" fill="#FFCC00" stroke="#8B4513" stroke-width="2"/>
  <circle cx="20" cy="24" r="5" fill="#000"/>
  <circle cx="44" cy="24" r="5" fill="#000"/>
  <ellipse cx="32" cy="46" rx="8" ry="10" fill="#000">
      <animate attributeName="ry" values="10; 14; 10" dur="1s" repeatCount="indefinite"/>
  </ellipse>
</svg>`);

// 8. Sad (Undo smile)
const sadSVG = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="30" fill="#FFCC00" stroke="#8B4513" stroke-width="2"/>
  <circle cx="20" cy="24" r="4" fill="#000"/>
  <circle cx="44" cy="24" r="4" fill="#000"/>
  <path d="M 16 50 Q 32 36 48 50" stroke="#000" stroke-width="3" fill="none"/>
  <circle cx="50" cy="40" r="2" fill="#00f" opacity="0">
    <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite"/>
    <animate attributeName="cy" values="40;55" dur="2s" repeatCount="indefinite"/>
  </circle>
</svg>`);

// 9. Angry (Red face)
const angrySVG = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="30" fill="#FF4500" stroke="#8B0000" stroke-width="2"/>
  <path d="M 16 20 L 26 26 M 48 20 L 38 26" stroke="#000" stroke-width="3"/>
  <circle cx="20" cy="30" r="3" fill="#000"/>
  <circle cx="44" cy="30" r="3" fill="#000"/>
  <path d="M 20 48 Q 32 40 44 48" stroke="#000" stroke-width="3" fill="none"/>
</svg>`);

// 10. Neutral / Confused
const confusedSVG = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="30" fill="#FFCC00" stroke="#8B4513" stroke-width="2"/>
  <circle cx="20" cy="24" r="4" fill="#000"/>
  <circle cx="44" cy="24" r="4" fill="#000"/>
  <path d="M 20 44 L 44 40" stroke="#000" stroke-width="3" fill="none">
     <animateTransform attributeName="transform" type="rotate" values="0 32 32; 5 32 32; 0 32 32" dur="1s" repeatCount="indefinite"/>
  </path>
</svg>`);


export const EMOJI_LIST = [
    { id: 'smile', code: ':)', url: svgHeader + smileSVG },
    { id: 'grin', code: ':D', url: svgHeader + grinSVG },
    { id: 'wink', code: ';)', url: svgHeader + winkSVG },
    { id: 'tongue', code: ':p', url: svgHeader + tongueSVG },
    { id: 'cool', code: '8)', url: svgHeader + coolSVG },
    { id: 'love', code: '<3', url: svgHeader + loveSVG },
    { id: 'shock', code: ':o', url: svgHeader + shockSVG },
    { id: 'sad', code: ':(', url: svgHeader + sadSVG },
    { id: 'angry', code: ':@', url: svgHeader + angrySVG },
    { id: 'confused', code: ':?', url: svgHeader + confusedSVG },
];
