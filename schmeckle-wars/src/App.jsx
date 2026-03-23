import { useState, useEffect, useCallback, useRef, useMemo } from "react";

// ══════════════════════════════════════════════════════════════════
// SCHMECKLE WARS v8 — PRODUCTION BUILD
// Cartoon R&M Aesthetic · Persistent Evolution · Live War Feed
// ══════════════════════════════════════════════════════════════════

// ═══ TOKEN CONFIG — PASTE YOUR CA HERE AFTER LAUNCHING ON PUMP.FUN ═══
const TOKEN = {
  CA: "", // ← Paste your Contract Address here, e.g. "AbCd...xYz1"
  SYMBOL: "$CHMCO",
  NAME: "Schmeckle Coin",
  NETWORK: "Solana",
  DEXSCREENER: (ca) => `https://api.dexscreener.com/latest/dex/tokens/${ca}`,
  JUPITER_SWAP: (ca) => `https://jup.ag/swap/SOL-${ca}`,
  PUMP_FUN: (ca) => `https://pump.fun/${ca}`,
  SOLSCAN: (ca) => `https://solscan.io/token/${ca}`,
};

const N = {
  USA:{n:"USA",c:"Rick C-137",e:"🇺🇸",cl:"#39FF14",av:"🔬",rl:"Scientific Superpower",q:"Wubba Lubba Dub Dub!",th:"OMEGA",
    img:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAIAAADYYG7QAAAA+UlEQVR4nO3Xuw3EIAwA0AyRmj2ywNVX3yRX3zhpskZqNkiTOhtwhSWLIxAwIeCLbLlAloJfAOXT9cyiaw1wIwn0mVfIgmMBCYg3aNKjd1wVFEKwBh3gbgqiIlqC7BTQvL7ej5Q8wBUGmd/AtdnXLwc5jZVSXpBTd7ayMMjuCgG9Q/XyIOdGs1do0mO0V+oXYwgUPUMkTT4I25Pql4OoeWvQ3pTyVKRq/hyEptAr7ORm5YDARAWR5s/5cyWBqJMTQHrZINNBeIletsYgm1IPZPfzIiqB8jI6/2Cqg57hGEwPyQKEGi4gdiuEJl6HGkJAAhKQgAQkICLoCwOKnahWaThfAAAAAElFTkSuQmCC",
    s:{military:95,economy:94,nuclear:88,cyber:96,diplomacy:75,intel:97},
    d:"5,550 warheads · 11 carriers · $886B budget",r:{Troops:"1.39M",Budget:"$886B",Nukes:"5,550"}},
  ISRAEL:{n:"Israel",c:"Krombopulos Michael",e:"🇮🇱",cl:"#FF4D00",av:"🎯",rl:"Precision Assassin",q:"Oh boy, here I go killing again!",th:"LETHAL",
    img:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAIAAADYYG7QAAABDElEQVR4nO3WOw7DIAwGYA7Ra2TpkoUrRMqcOfe/Ah2QWgQBfhu7JZWRNwz+EvFyj8ma+zUgbwbqtf8FHecuMg8fdJx7O74K6mrYJjIIpLBZNBBDQzURQOnsuINqGt1lgstZBlSaBmfjgMKWj6ppykxhUNhcGg1QLVMHFAIKKjIlQZ8asRUmMFMMNMsfQlYGvoa62/Ceu6z9Wfg5hJxSKKg2F35Sg8cmATR4lymCYnj/bAfvmkMXnQgIKcR5fqg+ie4MWv3C1qx+UQHxTHGgFojESofoghBTlq8CCpvLyqS+WlccJQ96X92XJbtdwqDsOXFZstslCZruD3XXULdLBTQSBjKQgQxkIAPpgF4PIQshehY1iwAAAABJRU5ErkJggg==",
    s:{military:82,economy:62,nuclear:80,cyber:92,diplomacy:28,intel:98},
    d:"Iron Dome 97% · Mossad · Unit 8200 · At war since Oct 7",r:{Troops:"634K",Budget:"$23B",Nukes:"90*"}},
  IRAN:{n:"Iran",c:"Evil Rick",e:"🇮🇷",cl:"#FF073A",av:"💀",rl:"Absolute Nemesis",q:"I'm the real deal, baby.",th:"HIGH",
    img:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAIAAADYYG7QAAAA4klEQVR4nO3XwQ3DIAwFUIZgiJ4ZokN0iJ47Ts49ZwjOXYgeUBDCFAypCW2+5QOyiPyEUSSUnizU0YA0WKD7+vL5xTVAAM0Netolux4K+oSYGlTAiYPi9EVrjDVGFlQ4iSlA5TwryOftca2mB9FRioDcFqtSzrlsXRCktU7GEbr6zNYpiNOoB5RogympC4Lohe07IY5p18ha7xCnUScotC/UDwC15l+DqKn6Y+zQ/Dhoz+D4LZofiqKazpernKYNdImCqYk/kQVVWXTzCFCCK28YDaoGQAABBBBAAAEEEECseANfNYmZedbL/wAAAABJRU5ErkJggg==",
    s:{military:58,economy:35,nuclear:52,cyber:55,diplomacy:30,intel:62},
    d:"IRGC · Hezbollah · Hamas · Houthis · 60% enriched uranium",r:{Troops:"610K",Budget:"$6.8B",U235:"60%"}},
  FRANCE:{n:"France",c:"Birdperson",e:"🇫🇷",cl:"#00D4FF",av:"🔱",rl:"Honor Diplomat",q:"It has been a challenging mating season for Birdperson.",th:"MODERATE",
    img:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAIAAADYYG7QAAAA3ElEQVR4nO3XzQ2DMAwFYIbIEJx77rnnDNEhMk6GYAiG6C6u2kgoyg+NTQKhPOsdIgvwJxQQDKqzGo4GhMUGPR+ji2ANEEDnAVmjk+tdQTlE16AAdwGQNVqW8hEMkFjDMp0WlJxBRKx+WxARKaXi2bl+W5Cb6sqfnev/+x3K7VPuHioxbdrULR60CqDXdPcDUCegFVMhqHBKHdBsR5ddQSumBbRRI/keEoBY15f8uVZ/9whBRt+WFGr8U9qCfrLig9uC5inMZydFzSNByVwYJAhAAAEEEEAAAQTQt964Jpfw6Op1MQAAAABJRU5ErkJggg==",
    s:{military:65,economy:70,nuclear:68,cyber:60,diplomacy:85,intel:68},
    d:"290 warheads · Charles de Gaulle carrier · SCALP missiles",r:{Troops:"205K",Budget:"$54B",Nukes:"290"}},
  RUSSIA:{n:"Russia",c:"Evil Morty",e:"🇷🇺",cl:"#FFD700",av:"👁️",rl:"Supreme Strategist",q:"I'm done being a sidekick.",th:"CRITICAL",
    img:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAIAAADYYG7QAAAA2UlEQVR4nO3XwQ2EIBAFUIrg7NmzNe2ZSrYSK7ED2qAD9kCWTFBgBgU5/J9/MAblBTFGpSeLehuQBqBaBKDvZ7tTgAASg9Z/AAJIAFrzeR7krEnqvU/OjAOdKTQckLOmO0hrXQB5qwaBoiaEmqgmdIoVihpqehJ0uZ3Le+hyhTimxhXivGXj9lChr71lAN0w5cqcpR1U/a51ByUmEYg/hfg3qN/DagRJTdKbC0DLssUyNfSSvqAq6zx4BCj02NWxK2dNOMgNGw2KBQgggAACaDoQswABBNAkoB/wJU2pN1DZqwAAAABJRU5ErkJggg==",
    s:{military:82,economy:40,nuclear:98,cyber:78,diplomacy:25,intel:80},
    d:"6,255 warheads · Full invasion since Feb 2022 · 500K+ casualties",r:{Troops:"1.33M",Budget:"$109B",Nukes:"6,255"}},
  CHINA:{n:"China",c:"Unity",e:"🇨🇳",cl:"#FF6B00",av:"🧠",rl:"Hivemind Collective",q:"We are one.",th:"CRITICAL",
    img:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAIAAADYYG7QAAABCUlEQVR4nO3VwQ2DMAwFUIbILmzQSRiiZ3bhwiQdIru4h1SRRQyxHQeRypEPYCX+TwjBFBjr81pz2d6Wa3KQgxz0cFDc4sWtg2qgqs8AJBI46GkgACAFAGAPwifJSABY5t8FJuL+AXSoJlDcYq4UvMxrqhSc6qyfD3YB4VScfdbvDnrcEyLflQwi+31BOF7U7w6SloPuBIUQyoD9vZ9VuZmc+V8g0sSsi5lNIJ2pOpMFIlf6BIs06Qg/QgDCPymRRmRSgqqscrMxqAwocdU9t4I45aDbQCYapmnMJ+SgEUHtJmbKyKAWEz9CBtKZRPPFIKlJOlwD4psUk5WgKks9swl0wJnMMQNZrS8niHmJXazLwgAAAABJRU5ErkJggg==",
    s:{military:88,economy:92,nuclear:75,cyber:90,diplomacy:52,intel:82},
    d:"2M troops · 500+ warheads · 370+ ships · Taiwan escalation",r:{Troops:"2.0M",Budget:"$296B",Nukes:"500+"}},
  NKOREA:{n:"N.Korea",c:"Scary Terry",e:"🇰🇵",cl:"#BF40FF",av:"🤖",rl:"Existential Artillery",q:"You can run but you can't hide, bitch!",th:"WILDCARD",
    img:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAIAAADYYG7QAAAA8klEQVR4nO3XOw6DMAwGYA6ROUsX5s45RA/RQ/QQHKIzJ8mt0qESonnalv+WIlsekJzgT+AgMbmDxfRrQB4D0P3qEWkgAxnIOfcIF3QaSBdUjWWNsqS3YIDEGpZJDkopddqXVWVQ1mwfJaVVxYK89x1QtQoBbf3ekXXtVyGgQzwh+pQMqzqg6pnnnjLgK4N+is4C2uaDcgEBVQ8aC0Ts8s+g8vNIB9FbsH8UQbMsB3FN3JuTQOEWsiRqyo0o0JDV2qIDes7zMJc1UpZ9D0TMk4JaAyFIA2mBYhH7RYgZanU0kAoIMUMGMpCBDPQJ6gcC1IoX2BrKQ8/SD/cAAAAASUVORK5CYII=",
    s:{military:40,economy:6,nuclear:38,cyber:25,diplomacy:3,intel:28},
    d:"50+ warheads · Hwasong-18 ICBM · 12K troops in Russia",r:{Troops:"1.28M",Budget:"$3.6B",Nukes:"50+"}},
};
const SM={military:{i:"⚔️",c:"#FF073A",l:"MIL"},economy:{i:"💰",c:"#FFD700",l:"ECO"},nuclear:{i:"☢️",c:"#FF6B00",l:"NUK"},cyber:{i:"🖥️",c:"#00D4FF",l:"CYB"},diplomacy:{i:"🤝",c:"#39FF14",l:"DIP"},intel:{i:"👁️",c:"#BF40FF",l:"INT"}};
const KS=Object.keys(N);

// ── EVOLUTION LEVELS ──
const EVOLUTIONS = [
  {min:0,title:"Recruit",badge:"🔰",border:"#555"},
  {min:50,title:"Soldier",badge:"⭐",border:"#888"},
  {min:120,title:"Commander",badge:"🎖️",border:"#FFD700"},
  {min:200,title:"War Lord",badge:"👑",border:"#FF6B00"},
  {min:350,title:"Dimension Breaker",badge:"🌀",border:"#39FF14"},
  {min:500,title:"Multiverse Conqueror",badge:"💀",border:"#FF073A"},
];
const getEvo=(xp)=>EVOLUTIONS.filter(e=>xp>=e.min).pop()||EVOLUTIONS[0];

// ── MAP ──
const ZN={
  USA:{cx:115,cy:108,p:"M50,80 L95,70 L140,74 L172,88 L178,112 L168,138 L138,150 L108,148 L78,142 L58,122 Z"},
  ISRAEL:{cx:392,cy:118,p:"M384,106 L400,106 L402,120 L400,132 L384,132 L382,118 Z"},
  IRAN:{cx:420,cy:110,p:"M398,94 L418,90 L436,96 L442,110 L436,124 L420,130 L400,126 L394,114 Z"},
  FRANCE:{cx:338,cy:82,p:"M316,66 L338,60 L356,64 L364,78 L358,94 L344,100 L326,96 L316,84 Z"},
  RUSSIA:{cx:498,cy:56,p:"M372,46 L422,34 L482,28 L548,34 L604,48 L622,66 L614,84 L578,94 L522,96 L462,90 L412,80 L384,66 Z"},
  CHINA:{cx:538,cy:110,p:"M494,84 L528,76 L562,82 L576,96 L578,116 L568,134 L548,142 L522,140 L502,128 L492,110 Z"},
  NKOREA:{cx:580,cy:92,p:"M572,84 L582,80 L588,88 L586,102 L580,106 L572,102 Z"},
};
const MC={
  na:"M45,95 L55,80 L75,72 L105,68 L130,72 L155,78 L170,88 L178,105 L175,120 L168,130 L155,140 L140,148 L128,155 L120,148 L115,138 L105,145 L95,152 L85,148 L78,140 L72,132 L68,120 L55,115 L48,108 Z",
  sa:"M135,175 L145,165 L158,162 L168,168 L178,180 L182,198 L180,218 L178,240 L172,258 L165,272 L158,282 L148,288 L140,278 L135,262 L132,245 L128,228 L125,210 L128,195 Z",
  eu:"M310,68 L318,62 L330,58 L345,60 L358,62 L370,68 L378,75 L375,88 L368,98 L358,105 L345,108 L335,102 L325,98 L318,92 Z",
  af:"M315,118 L328,112 L345,110 L362,115 L375,125 L382,142 L385,162 L382,185 L375,205 L365,222 L352,232 L340,235 L328,228 L318,218 L312,202 L308,185 L305,165 L308,145 Z",
  ru:"M370,42 L395,35 L425,30 L460,28 L500,30 L540,35 L575,40 L600,48 L615,58 L620,72 L612,85 L598,92 L578,95 L555,98 L530,95 L505,92 L480,88 L455,85 L430,82 L405,78 L388,72 L378,62 Z",
  me:"M380,98 L395,92 L412,95 L425,102 L430,115 L425,128 L415,135 L402,132 L390,125 L382,115 Z",
  cn:"M492,82 L515,75 L540,78 L560,85 L572,98 L575,112 L568,128 L555,138 L538,142 L520,138 L505,130 L495,118 Z",
  au:"M545,205 L565,195 L588,198 L608,208 L618,225 L615,242 L602,255 L582,258 L562,252 L548,238 Z",
  in:"M445,108 L458,102 L472,108 L480,122 L478,140 L470,155 L458,162 L445,158 L438,145 L435,128 Z",
};

// No hardcoded timeline — ONLY live current news from API

// WW3 probability tiers — based on Bulletin of Atomic Scientists methodology
// Real baseline: Doomsday Clock at 90 seconds to midnight (2024) = ~17-22% range
const DOOM=[
  {x:5,l:"PEACETIME",s:"No active major conflicts between nuclear powers",cl:"#39FF14",ic:"🕊️"},
  {x:12,l:"LOW RISK",s:"Regional proxy conflicts only. Nuclear powers not directly involved",cl:"#7FFF00",ic:"🟢"},
  {x:22,l:"ELEVATED",s:"Multiple active wars. 90 seconds to midnight. Current baseline.",cl:"#FFD700",ic:"🟡"},
  {x:35,l:"HIGH RISK",s:"Nuclear-armed states in direct confrontation. Doctrines updated.",cl:"#FF8C00",ic:"🟠"},
  {x:50,l:"SEVERE",s:"Direct military exchanges between nuclear powers. Red lines crossed.",cl:"#FF4500",ic:"🔴"},
  {x:70,l:"CRITICAL",s:"Nuclear weapons deployed to forward positions. Launch drills active.",cl:"#FF073A",ic:"🚨"},
  {x:90,l:"IMMINENT",s:"Nuclear first-strike considered. DEFCON 1. Evacuations ordered.",cl:"#FF0000",ic:"☢️"},
  {x:100,l:"EXTINCTION",s:"Strategic nuclear exchange initiated. Civilization collapse.",cl:"#CC0000",ic:"💀"},
];
const gD=c=>DOOM.find(l=>c<=l.x)||DOOM.at(-1);

// WW3 risk weights per event type — nuclear events are disproportionately dangerous
const WW3_WEIGHTS={nuclear:2.8,military:1.0,cyber:0.8,intel:0.6,diplomacy:0.3,economy:0.2};
// Specific country pair escalation multipliers — direct nuclear power conflicts are worse
const ESCALATION_PAIRS={
  "USA-RUSSIA":2.5,"RUSSIA-USA":2.5,  // Direct superpower confrontation
  "USA-CHINA":2.2,"CHINA-USA":2.2,    // Pacific nuclear flashpoint
  "ISRAEL-IRAN":1.8,"IRAN-ISRAEL":1.8,// Could draw in USA/Russia
  "RUSSIA-FRANCE":1.6,"FRANCE-RUSSIA":1.6, // NATO Article 5 trigger
  "USA-IRAN":1.4,"IRAN-USA":1.4,      // Gulf escalation
  "NKOREA-USA":1.5,"USA-NKOREA":1.5,  // Nuclear wildcard
  "CHINA-NKOREA":0.8,"NKOREA-CHINA":0.8,
};

// Realistic WW3 baseline — where we actually are right now (Mar 2025)
// Based on: Russia-Ukraine active war, Israel-Iran exchanges, China-Taiwan drills,
// Doomsday Clock at 90 seconds, multiple nuclear doctrines updated
const WW3_BASELINE = 19.5; // ~19.5% baseline risk per expert analysis
const WW3_MAX = 95; // Cap — 100% = already happened
const WW3_DECAY_RATE = 0.15; // % decay per minute toward baseline (de-escalation)
const WW3_EVENT_CAP = 0.8; // Max % a single event can add

// Rick quotes for attacks
const RICK_LINES=["Wubba Lubba Dub Dub!","And that's the wayyy the news goes!","Rikki-Tikki-Tavi, b*tch!","Grasssss... tastes bad!","Hit the sack, Jack!","Uh oh, somersault jump!","AIDS!","Burger time!","Rubber baby buggy bumpers!","Lick lick lick my balls!","No jumping in the sewer!","Get schwifty!","I'm pickle Riiiick!","That's my portal gun, Morty!","Nobody exists on purpose."];

const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Bangers&family=Chakra+Petch:wght@400;600;700&family=Fira+Code:wght@400;700&display=swap');
:root{--g:#39FF14;--r:#FF073A;--y:#FFD700;--c:#00D4FF;--o:#FF6B00;--p:#BF40FF;
  --bg:#0a0e12;--card:#0f1519;--bdr:#39FF1422;--txt:#e8ffe8}
*{box-sizing:border-box;margin:0;padding:0}
@keyframes sp{to{transform:rotate(360deg)}}
@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes wobble{0%,100%{transform:rotate(-1deg)}50%{transform:rotate(1deg)}}
@keyframes popIn{0%{transform:scale(0) rotate(-10deg);opacity:0}60%{transform:scale(1.1) rotate(2deg)}100%{transform:scale(1) rotate(0);opacity:1}}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes glitch{0%,100%{transform:translate(0)}25%{transform:translate(-2px,1px)}75%{transform:translate(2px,-1px)}}
@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes chaos{0%{background-position:0% 50%}100%{background-position:200% 50%}}
@keyframes portalBg{0%,100%{transform:scale(1) rotate(0deg);opacity:.06}50%{transform:scale(1.15) rotate(180deg);opacity:.03}}
@keyframes scan{0%{top:-4px}100%{top:100%}}
@keyframes neonPulse{0%,100%{text-shadow:0 0 4px var(--g),0 0 12px #39FF1444}50%{text-shadow:0 0 8px var(--g),0 0 24px #39FF1466,0 0 40px #39FF1422}}
@keyframes rickFly{0%{offset-distance:0%;opacity:0}8%{opacity:1}88%{opacity:1}100%{offset-distance:100%;opacity:0}}
@keyframes bubPop{0%{transform:scale(0)}15%{transform:scale(1.15)}30%{transform:scale(1)}85%{transform:scale(1)}100%{transform:scale(.7);opacity:0}}
@keyframes rickWobble{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(8deg)}}
@keyframes boom{0%{transform:scale(0);opacity:1}50%{transform:scale(1.5);opacity:.8}100%{transform:scale(2.5);opacity:0}}
@keyframes lvlUp{0%{transform:scale(1)}25%{transform:scale(1.3)}50%{transform:scale(1)}75%{transform:scale(1.15)}100%{transform:scale(1)}}
@keyframes particle{0%{transform:translateY(0) scale(1);opacity:.6}100%{transform:translateY(-40px) scale(0);opacity:0}}
@keyframes alertBg{0%{background:rgba(255,7,58,.08)}100%{background:transparent}}
.scanbar{pointer-events:none;position:fixed;left:0;right:0;height:3px;z-index:9999;
  background:linear-gradient(180deg,transparent,rgba(57,255,20,.03),transparent);animation:scan 6s linear infinite}
.card{border:3px solid var(--bdr);background:var(--card);border-radius:16px;
  box-shadow:0 4px 0 #000,0 0 0 1px rgba(57,255,20,.05);transition:all .2s}
.card:hover{transform:translateY(-2px);box-shadow:0 6px 0 #000,0 0 20px rgba(57,255,20,.08)}
.news-link{cursor:pointer;transition:all .15s;border-radius:12px;padding:2px}
.news-link:hover{background:rgba(57,255,20,.04);transform:translateX(3px)}
.news-link:active{transform:translateX(1px) scale(.99)}
.news-link .link-icon{opacity:0;transition:opacity .15s}
.news-link:hover .link-icon{opacity:.5}
.glow{animation:neonPulse 3s ease infinite}
.toon{font-family:'Bangers',cursive;letter-spacing:.04em}
.mono{font-family:'Fira Code',monospace}
.body{font-family:'Chakra Petch',sans-serif}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:var(--bdr);border-radius:3px}
*{scrollbar-width:thin;scrollbar-color:var(--bdr) var(--bg)}
`;

function Bar({v,mx=120,c,l,sm}){const p=Math.min(100,Math.max(0,(v/mx)*100));
  return <div className="flex items-center gap-1" style={{fontSize:sm?8:10}}>
    <span className="opacity-40 mono" style={{width:sm?14:22,fontSize:sm?7:8}}>{l}</span>
    <div className="flex-1 rounded-full overflow-hidden" style={{height:sm?5:7,background:"#ffffff08",border:"2px solid #ffffff06"}}>
      <div className="h-full rounded-full transition-all duration-700" style={{width:`${p}%`,background:`linear-gradient(90deg,${c}66,${c})`,boxShadow:`0 0 8px ${c}44`}}/></div>
    <span className="mono tabular-nums" style={{color:c,width:16,textAlign:"right",fontSize:sm?7:9,fontWeight:700}}>{v}</span>
  </div>}

// ── CHARACTER AVATAR — Base64 data URIs embedded (works in any sandbox) ──
function Av({k,sz=40,st={}}){
  const n=N[k];if(!n)return null;
  return <div className="flex items-center justify-center" style={{width:sz,height:sz,borderRadius:"50%",
    border:`3px solid ${n.cl}66`,background:`radial-gradient(circle at 35% 35%,${n.cl}15,${n.cl}05)`,
    boxShadow:`0 3px 0 ${n.cl}22, 0 0 16px ${n.cl}15`,overflow:"hidden",
    ...st}}>
    <img src={n.img} alt={n.c}
      style={{width:"120%",height:"120%",objectFit:"cover",objectPosition:"center",borderRadius:"50%",imageRendering:"pixelated"}}/>
  </div>
}

function MapChar({k,sz=30}){
  const n=N[k];if(!n)return null;
  return <div style={{width:sz,height:sz,borderRadius:"50%",overflow:"hidden",margin:"0 auto",
    background:`radial-gradient(circle,${n.cl}15,${n.cl}05)`}}>
    <img src={n.img} alt={n.c}
      style={{width:"120%",height:"120%",objectFit:"cover",objectPosition:"center",imageRendering:"pixelated"}}/>
  </div>
}

// ══════════════════════════════════════════════════════════════════
// War-only search queries — rotating through active conflict theaters
const QUERIES=[
  // Russia-Ukraine frontline
  "Ukraine Russia frontline battle today drone strike casualties",
  "Ukraine Russia missile attack Kharkiv Odesa Kyiv today",
  "Russia Ukraine Kursk offensive counterattack troops killed",
  // Israel-Gaza-Iran
  "Israel IDF Gaza airstrike ground operation today",
  "Israel Hezbollah Lebanon border attack rockets today",
  "Iran Israel military strike attack retaliation today",
  // Iran proxies
  "Houthi Red Sea ship attack US Navy strike Yemen today",
  "Iran proxy Iraq Syria militia US base attack",
  // China-Taiwan
  "China Taiwan military drills warships aircraft incursion today",
  "China PLA South China Sea Philippines military confrontation",
  // North Korea
  "North Korea missile launch ICBM nuclear test today 2025",
  "North Korea troops Russia Ukraine Kursk casualties",
];

// Client-side war relevance filter — reject headlines that don't match actual warfare
const WAR_KEYWORDS=new Set(["strike","attack","missile","bomb","troops","killed","casualties","invasion","offensive","drone","airstrike","shelling","combat","battle","war","military","weapon","nuclear","rocket","artillery","navy","warship","fighter","jet","intercept","shoot","fire","deploy","raid","siege","blockade","sanctions","embargo","convoy","base","frontline","advance","retreat","captured","destroy","launch","ICBM","ballistic","cruise","tank","infantry","brigade","battalion","division","regiment","wounded","dead","hostage","ceasefire","violation","escalation","provocation","incursion","airspace","territorial","shell","mortar","grenade","sniper","ambush","checkpoint","fortify","bunker","trench","satellite","reconnaissance","surveillance","cyber","hack","infrastructure","enrichment","uranium","centrifuge","warhead","arsenal","carrier","submarine","fleet","patrol","intercontinental"]);

const isWarRelevant=(headline)=>{
  if(!headline||headline.length<15)return false;
  const words=headline.toLowerCase().replace(/[^a-z\s]/g,"").split(/\s+/);
  let warHits=0;
  for(const w of words){if(WAR_KEYWORDS.has(w))warHits++}
  // Need at least 2 war-related keywords to pass
  return warHits>=2;
};

// Stable random seeds for SVG elements (no flicker on re-render)
const STAR_SEEDS=Array.from({length:60},(_,i)=>({x:(i*17+7)%100,y:(i*23+13)%100,r:.3+i%3*.4,fill:["#39FF14","#00D4FF","#FFD700","#FF6B00","#fff"][i%5],o:.05+i%4*.08,dur:3+i%5,ov1:.03+i%3*.05,ov2:.15+i%3*.1}));
const CHAR_SEEDS=Object.fromEntries(KS.map((k,i)=>[k,{bobDur:3+((i*7)%3),bobDelay:((i*1.3)%2).toFixed(1)}]));

export default function App(){
  const [stats,setStats]=useState(()=>{const o={};Object.entries(N).forEach(([k,n])=>{o[k]={...n.s,xp:0,kills:0,hits:0}});return o});
  const [evts,setEvts]=useState([]);
  const [atk,setAtk]=useState(null);
  const [rickLine,setRickLine]=useState("");
  const [sel,setSel]=useState(null);
  const [hov,setHov]=useState(null);
  const [chaos,setChaos]=useState(WW3_BASELINE);
  const [tokenData,setTokenData]=useState({
    price:0, priceUsd:"0.00", mc:0, vol24h:0, liq:0, supply:0,
    circulating:0, pairAddr:"", dexUrl:"", priceChange5m:0,
    priceChange1h:0, priceChange24h:0, live:false, lastFetch:null
  });
  const [pH,setPH]=useState(()=>Array.from({length:60},()=>0));
  const [tab,setTab]=useState("map");
  const [ops,setOps]=useState(0);
  const [liveN,setLiveN]=useState(0);
  const [fetching,setFetching]=useState(false);
  const [lvlUp,setLvlUp]=useState(null);
  const [caCopied,setCaCopied]=useState(false);
  const aid=useRef(0);
  const fetchRound=useRef(0);
  const priceRef=useRef(0);
  const atkQueue=useRef([]);
  const atkBusy=useRef(false);
  const atkTimer=useRef(null);

  // Shorthand for current price
  const price=tokenData.price;
  const pc=tokenData.priceChange1h||tokenData.priceChange5m||0;

  // ── SMART DEDUPLICATION ENGINE ──────────────────────────────
  // Stores {keywords, attacker, target, headline, url, quality} for each seen event
  const seenEvents=useRef([]);

  // Stop words to ignore when comparing headlines
  const STOP_WORDS=new Set(["the","a","an","in","on","at","to","for","of","and","or","is","are","was","were","has","have","had","with","from","by","as","its","it","that","this","be","been","will","would","could","should","may","might","can","do","does","did","not","no","but","if","so","than","into","over","after","before","about","up","out","their","them","they","he","she","his","her","we","our","us","all","also","just","more","most","very","new"]);

  // Source quality ranking — higher = better
  const SOURCE_RANK={
    "reuters.com":100,"apnews.com":95,"bbc.com":90,"bbc.co.uk":90,
    "aljazeera.com":85,"theguardian.com":82,"nytimes.com":80,
    "washingtonpost.com":78,"france24.com":76,"dw.com":74,
    "timesofisrael.com":73,"jpost.com":72,"haaretz.com":71,
    "cnn.com":70,"foxnews.com":65,"nbcnews.com":65,"cbsnews.com":65,
    "sky.com":62,"independent.co.uk":60,"telegraph.co.uk":60,
    "economist.com":58,"foreignpolicy.com":56,"politico.com":55,
    "bloomberg.com":54,"ft.com":53,"wsj.com":52,
    "ukrinform.net":50,"pravda.com.ua":48,"kyivindependent.com":48,
    "tass.com":40,"rt.com":30,"presstv.ir":25,
    "news.google.com":15,"":5
  };

  const getSourceQuality=(url)=>{
    if(!url)return 5;
    try{
      const host=new URL(url).hostname.replace("www.","");
      // Check exact match first, then partial
      if(SOURCE_RANK[host]!==undefined)return SOURCE_RANK[host];
      for(const [domain,score] of Object.entries(SOURCE_RANK)){
        if(host.includes(domain)||domain.includes(host))return score;
      }
      return 20; // Unknown source
    }catch(e){return 5}
  };

  const extractKeywords=(text)=>{
    if(!text)return [];
    return text.toLowerCase()
      .replace(/[^a-z0-9\s]/g," ")
      .split(/\s+/)
      .filter(w=>w.length>2&&!STOP_WORDS.has(w));
  };

  const keywordSimilarity=(kw1,kw2)=>{
    if(!kw1.length||!kw2.length)return 0;
    const set1=new Set(kw1);
    const set2=new Set(kw2);
    let overlap=0;
    for(const w of set1)if(set2.has(w))overlap++;
    return overlap/Math.min(set1.size,set2.size);
  };

  // Check if event is duplicate. Returns {isDupe, upgradeIdx} if should upgrade existing URL
  const checkDuplicate=(item)=>{
    const kw=extractKeywords(item.h);
    const newQuality=getSourceQuality(item.url);

    for(let i=0;i<seenEvents.current.length;i++){
      const existing=seenEvents.current[i];

      // Same attacker+target pair check (or reversed)
      const sameActors=(item.a===existing.attacker&&item.t===existing.target)||
                       (item.a===existing.target&&item.t===existing.attacker);

      // Keyword similarity
      const sim=keywordSimilarity(kw,existing.keywords);

      // Consider duplicate if:
      // 1. >55% keyword overlap AND same actors
      // 2. >70% keyword overlap regardless of actors (same story different framing)
      // 3. Exact headline match (first 40 chars)
      const exactMatch=(item.h||"").toLowerCase().slice(0,40)===(existing.headline||"").toLowerCase().slice(0,40);

      if(exactMatch||(sim>0.55&&sameActors)||(sim>0.70)){
        // It's a duplicate — should we upgrade the source?
        if(newQuality>existing.quality&&item.url){
          return {isDupe:true,upgradeIdx:i,newUrl:item.url,newQuality};
        }
        return {isDupe:true,upgradeIdx:-1};
      }
    }
    return {isDupe:false};
  };

  // Register event as seen
  const registerSeen=(item)=>{
    seenEvents.current.push({
      keywords:extractKeywords(item.h),
      attacker:item.a,
      target:item.t,
      headline:item.h,
      url:item.url||"",
      quality:getSourceQuality(item.url),
      time:Date.now()
    });
    // Keep only last 200 events to avoid memory bloat
    if(seenEvents.current.length>200)seenEvents.current=seenEvents.current.slice(-150);
  };

  // ── PERSISTENCE ──
  useEffect(()=>{(async()=>{try{
    const r=localStorage.getItem("sw-stats");
    if(r){const d=JSON.parse(r);
      if(d.stats)setStats(d.stats);
      // Clamp saved chaos to at least baseline — world didn't get safer while you were away
      if(d.chaos)setChaos(Math.max(WW3_BASELINE, d.chaos));
      if(d.ops)setOps(d.ops);if(d.liveN)setLiveN(d.liveN)}
  }catch(e){}})()},[]);
  useEffect(()=>{const iv=setInterval(async()=>{try{
    localStorage.setItem("sw-stats",JSON.stringify({stats,chaos,ops,liveN}));
  }catch(e){}},10000);return()=>clearInterval(iv)},[stats,chaos,ops,liveN]);

  // ── WW3 DECAY — slowly de-escalate toward baseline when no new events ──
  // Simulates diplomatic cooling / de-escalation over time
  useEffect(()=>{
    const decayIv=setInterval(()=>{
      setChaos(prev=>{
        if(prev<=WW3_BASELINE)return WW3_BASELINE; // Never drop below baseline
        const newVal = prev - WW3_DECAY_RATE;
        return parseFloat(Math.max(WW3_BASELINE, newVal).toFixed(1));
      });
    },60000); // Decay check every 60 seconds
    return()=>clearInterval(decayIv);
  },[]);

  // Keep priceRef in sync
  useEffect(()=>{priceRef.current=tokenData.price},[tokenData.price]);

  // ── DEXSCREENER LIVE TOKEN DATA ──────────────────────────────
  // Fetches real price, mcap, volume, liquidity, supply every 12s
  const fetchTokenData=useCallback(async()=>{
    if(!TOKEN.CA)return; // No CA set yet
    try{
      const r=await fetch(TOKEN.DEXSCREENER(TOKEN.CA));
      if(!r.ok)return;
      const data=await r.json();
      if(!data.pairs||data.pairs.length===0)return;
      // Pick the pair with most liquidity
      const pair=data.pairs.sort((a,b)=>(b.liquidity?.usd||0)-(a.liquidity?.usd||0))[0];
      const p=parseFloat(pair.priceUsd)||0;
      setTokenData(prev=>({
        price:p,
        priceUsd:pair.priceUsd||"0",
        mc:pair.marketCap||pair.fdv||0,
        vol24h:pair.volume?.h24||0,
        liq:pair.liquidity?.usd||0,
        supply:pair.fdv&&p>0?Math.round(pair.fdv/p):prev.supply,
        circulating:pair.marketCap&&pair.fdv?((pair.marketCap/pair.fdv)*100).toFixed(1):prev.circulating,
        pairAddr:pair.pairAddress||"",
        dexUrl:pair.url||"",
        priceChange5m:pair.priceChange?.m5||0,
        priceChange1h:pair.priceChange?.h1||0,
        priceChange24h:pair.priceChange?.h24||0,
        live:true,
        lastFetch:new Date().toLocaleTimeString()
      }));
      setPH(prev=>[...prev.slice(-59),p]);
    }catch(e){/* DexScreener fetch failed — keep last data */}
  },[]);

  useEffect(()=>{
    if(!TOKEN.CA)return;
    fetchTokenData(); // Fetch immediately
    const iv=setInterval(fetchTokenData,12000); // Then every 12s
    return()=>clearInterval(iv);
  },[fetchTokenData]);

  // ── R&M SOUND ENGINE — Low volume, show-authentic synthesis ──
  // All volumes at ~3-5% so it's ambient background, not jarring
  const audioCtx=useRef(null);
  const masterGain=useRef(null);
  const soundEnabled=useRef(true);
  const [muted,setMuted]=useState(false);
  const VOL=0.035; // Master volume — very quiet ambient

  const getAudio=useCallback(()=>{
    if(!audioCtx.current){
      try{
        audioCtx.current=new(window.AudioContext||window.webkitAudioContext)();
        masterGain.current=audioCtx.current.createGain();
        masterGain.current.gain.value=VOL;
        masterGain.current.connect(audioCtx.current.destination);
      }catch(e){soundEnabled.current=false}
    }
    if(audioCtx.current?.state==="suspended")audioCtx.current.resume().catch(()=>{});
    return audioCtx.current;
  },[]);

  const dst=useCallback(()=>masterGain.current||audioCtx.current?.destination,[]);

  // ── PORTAL GUN "ZHWOOOP" ──
  // The iconic R&M portal gun: bubbly frequency-modulated warble with wet reverb feel
  const playPortalGun=useCallback(()=>{
    if(muted||!soundEnabled.current)return;
    const ctx=getAudio();if(!ctx)return;
    try{
      const t=ctx.currentTime;
      // Main warble oscillator — the "zhwoop" sweep
      const osc1=ctx.createOscillator();
      osc1.type="sine";
      osc1.frequency.setValueAtTime(120,t);
      osc1.frequency.exponentialRampToValueAtTime(800,t+0.15);
      osc1.frequency.exponentialRampToValueAtTime(300,t+0.4);
      osc1.frequency.exponentialRampToValueAtTime(150,t+0.8);

      // FM modulator — creates the bubbly warble texture
      const mod=ctx.createOscillator();
      const modGain=ctx.createGain();
      mod.type="sine";
      mod.frequency.setValueAtTime(30,t);
      mod.frequency.linearRampToValueAtTime(8,t+0.8);
      modGain.gain.setValueAtTime(80,t);
      modGain.gain.linearRampToValueAtTime(20,t+0.8);
      mod.connect(modGain);modGain.connect(osc1.frequency);

      // Bubbly overtone
      const osc2=ctx.createOscillator();
      osc2.type="triangle";
      osc2.frequency.setValueAtTime(240,t);
      osc2.frequency.exponentialRampToValueAtTime(600,t+0.12);
      osc2.frequency.exponentialRampToValueAtTime(200,t+0.6);

      const g=ctx.createGain();
      g.gain.setValueAtTime(0,t);
      g.gain.linearRampToValueAtTime(1,t+0.05);
      g.gain.setValueAtTime(0.8,t+0.2);
      g.gain.exponentialRampToValueAtTime(0.01,t+0.8);

      const g2=ctx.createGain();
      g2.gain.setValueAtTime(0,t);
      g2.gain.linearRampToValueAtTime(0.4,t+0.05);
      g2.gain.exponentialRampToValueAtTime(0.01,t+0.5);

      osc1.connect(g);g.connect(dst());
      osc2.connect(g2);g2.connect(dst());
      mod.start(t);osc1.start(t);osc2.start(t);
      mod.stop(t+0.85);osc1.stop(t+0.85);osc2.stop(t+0.55);
    }catch(e){}
  },[muted,getAudio,dst]);

  // ── PORTAL BUBBLING — ambient gurgle while Rick flies ──
  const playPortalBubble=useCallback(()=>{
    if(muted||!soundEnabled.current)return;
    const ctx=getAudio();if(!ctx)return;
    try{
      const t=ctx.currentTime;
      // Multiple short bubbly pops at random intervals
      for(let i=0;i<8;i++){
        const osc=ctx.createOscillator();
        const g=ctx.createGain();
        const delay=i*0.18+Math.random()*0.1;
        const freq=200+Math.random()*400;
        osc.type="sine";
        osc.frequency.setValueAtTime(freq,t+delay);
        osc.frequency.exponentialRampToValueAtTime(freq*0.4,t+delay+0.12);
        g.gain.setValueAtTime(0,t+delay);
        g.gain.linearRampToValueAtTime(0.3+Math.random()*0.3,t+delay+0.02);
        g.gain.exponentialRampToValueAtTime(0.01,t+delay+0.12);
        osc.connect(g);g.connect(dst());
        osc.start(t+delay);osc.stop(t+delay+0.15);
      }
    }catch(e){}
  },[muted,getAudio,dst]);

  // ── RICK BURP — quick descending "bworp" ──
  const playBurp=useCallback(()=>{
    if(muted||!soundEnabled.current)return;
    const ctx=getAudio();if(!ctx)return;
    try{
      const t=ctx.currentTime;
      const osc=ctx.createOscillator();
      const g=ctx.createGain();
      osc.type="sawtooth";
      // Quick descending gurgle
      osc.frequency.setValueAtTime(250,t);
      osc.frequency.setValueAtTime(180,t+0.04);
      osc.frequency.setValueAtTime(220,t+0.08);
      osc.frequency.exponentialRampToValueAtTime(80,t+0.2);
      // Wobble via filter
      const filter=ctx.createBiquadFilter();
      filter.type="bandpass";filter.frequency.value=200;filter.Q.value=3;
      g.gain.setValueAtTime(0,t);
      g.gain.linearRampToValueAtTime(0.5,t+0.02);
      g.gain.exponentialRampToValueAtTime(0.01,t+0.2);
      osc.connect(filter);filter.connect(g);g.connect(dst());
      osc.start(t);osc.stop(t+0.22);
    }catch(e){}
  },[muted,getAudio,dst]);

  // ── CARTOON IMPACT — soft splat/thud like the show ──
  const playImpact=useCallback(()=>{
    if(muted||!soundEnabled.current)return;
    const ctx=getAudio();if(!ctx)return;
    try{
      const t=ctx.currentTime;
      // Low thud
      const osc=ctx.createOscillator();
      const g=ctx.createGain();
      osc.type="sine";
      osc.frequency.setValueAtTime(100,t);
      osc.frequency.exponentialRampToValueAtTime(30,t+0.3);
      g.gain.setValueAtTime(0.6,t);
      g.gain.exponentialRampToValueAtTime(0.01,t+0.3);
      osc.connect(g);g.connect(dst());
      osc.start(t);osc.stop(t+0.35);

      // Short filtered noise — the "splat" texture
      const buf=ctx.createBuffer(1,ctx.sampleRate*0.15,ctx.sampleRate);
      const d=buf.getChannelData(0);
      for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,3);
      const ns=ctx.createBufferSource();
      ns.buffer=buf;
      const ng=ctx.createGain();
      ng.gain.setValueAtTime(0.3,t);
      ng.gain.exponentialRampToValueAtTime(0.01,t+0.12);
      const lp=ctx.createBiquadFilter();
      lp.type="lowpass";lp.frequency.value=600;
      ns.connect(lp);lp.connect(ng);ng.connect(dst());
      ns.start(t);ns.stop(t+0.15);
    }catch(e){}
  },[muted,getAudio,dst]);

  // ── INTERDIMENSIONAL STATIC — glitchy TV interference ──
  const playStatic=useCallback(()=>{
    if(muted||!soundEnabled.current)return;
    const ctx=getAudio();if(!ctx)return;
    try{
      const t=ctx.currentTime;
      const buf=ctx.createBuffer(1,ctx.sampleRate*0.3,ctx.sampleRate);
      const d=buf.getChannelData(0);
      for(let i=0;i<d.length;i++){
        // Modulated static — sounds like interdimensional cable
        const env=Math.sin(i/(ctx.sampleRate*0.05))*0.5+0.5;
        d[i]=(Math.random()*2-1)*env*Math.pow(1-i/d.length,1.5);
      }
      const ns=ctx.createBufferSource();ns.buffer=buf;
      const g=ctx.createGain();
      g.gain.setValueAtTime(0.2,t);
      g.gain.exponentialRampToValueAtTime(0.01,t+0.25);
      const bp=ctx.createBiquadFilter();
      bp.type="bandpass";bp.frequency.value=2000;bp.Q.value=1;
      ns.connect(bp);bp.connect(g);g.connect(dst());
      ns.start(t);ns.stop(t+0.3);
    }catch(e){}
  },[muted,getAudio,dst]);

  // ── LEVEL UP — interdimensional power chord ──
  const playLevelUp=useCallback(()=>{
    if(muted||!soundEnabled.current)return;
    const ctx=getAudio();if(!ctx)return;
    try{
      const t=ctx.currentTime;
      // Ascending portal-style chord
      [220,330,440,660].forEach((f,i)=>{
        const osc=ctx.createOscillator();
        const g=ctx.createGain();
        osc.type=i<2?"triangle":"sine";
        osc.frequency.setValueAtTime(f*0.8,t+i*0.1);
        osc.frequency.exponentialRampToValueAtTime(f,t+i*0.1+0.08);
        // FM wobble
        const mod=ctx.createOscillator();
        const mg=ctx.createGain();
        mod.frequency.value=6+i*2;mg.gain.value=f*0.03;
        mod.connect(mg);mg.connect(osc.frequency);
        g.gain.setValueAtTime(0,t+i*0.1);
        g.gain.linearRampToValueAtTime(0.4,t+i*0.1+0.04);
        g.gain.exponentialRampToValueAtTime(0.01,t+i*0.1+0.5);
        osc.connect(g);g.connect(dst());
        mod.start(t+i*0.1);osc.start(t+i*0.1);
        mod.stop(t+i*0.1+0.55);osc.stop(t+i*0.1+0.55);
      });
    }catch(e){}
  },[muted,getAudio,dst]);

  // ── FULL ATTACK SEQUENCE — timed to 6s animation ──
  const playAttackSequence=useCallback(()=>{
    if(muted)return;
    // 0.0s — Portal gun fires (zhwooop)
    playPortalGun();
    // 0.6s — Brief static as dimension tears
    setTimeout(playStatic,600);
    // 1.2s — Portal bubbling while Rick flies through
    setTimeout(playPortalBubble,1200);
    // 2.0s — Rick burp mid-flight
    setTimeout(playBurp,2000);
    // 3.8s — Impact at target
    setTimeout(playImpact,3800);
    // 4.2s — Second portal gun sound (exit portal)
    setTimeout(playPortalGun,4200);
  },[muted,playPortalGun,playStatic,playPortalBubble,playBurp,playImpact]);

  // ── ATTACK QUEUE: one attack at a time, 6s each ──
  const ATK_DURATION = 6000;

  const drainQueue=useCallback(()=>{
    if(atkBusy.current||atkQueue.current.length===0)return;
    atkBusy.current=true;
    const {item, live} = atkQueue.current.shift();

    let{a,t,h,tp,sv,d}=item;
    if(a===t){const o=KS.filter(k=>k!==a);t=o[Math.floor(Math.random()*o.length)]}
    const boost=Math.floor(sv*0.6)+2,dmg=Math.floor(sv*0.5)+2,xpGain=Math.floor(sv*2)+5;

    setStats(prev=>{
      const nx=JSON.parse(JSON.stringify(prev));
      const sk=tp&&nx[a][tp]!==undefined?tp:"military";
      nx[a][sk]=Math.min(120,(nx[a][sk]||50)+boost);nx[t][sk]=Math.max(1,(nx[t][sk]||50)-dmg);
      nx[a].kills+=1;nx[a].xp=(nx[a].xp||0)+xpGain;nx[t].hits+=1;nx[t].xp=(nx[t].xp||0)+Math.floor(xpGain/3);
      const oldEvo=getEvo(prev[a]?.xp||0);const newEvo=getEvo(nx[a].xp);
      if(newEvo.min>oldEvo.min)setTimeout(()=>{setLvlUp({k:a,evo:newEvo});playLevelUp();setTimeout(()=>setLvlUp(null),3500)},800);
      return nx;
    });
    aid.current+=1;
    const rl=RICK_LINES[Math.floor(Math.random()*RICK_LINES.length)];
    setRickLine(rl);
    setEvts(prev=>[{attacker:a,target:t,text:h,type:tp,boost,dmg,ts:d||new Date().toLocaleTimeString("en-US",{hour12:false}),id:aid.current,date:d,live,
      url:item.url||null,
      searchUrl:`https://news.google.com/search?q=${encodeURIComponent(h.replace(/^[A-Za-z]{3}\s\d{1,2}\s\d{4}\s—\s/,"").slice(0,60))}&hl=en`
    },...prev].slice(0,120));
    setAtk({attacker:a,target:t,key:aid.current});
    setOps(c=>c+1);if(live)setLiveN(c=>c+1);

    // 🔊 Play attack sound sequence
    playAttackSequence();

    // ── WW3 PROBABILITY UPDATE — realistic weighted calculation ──
    const typeWeight = WW3_WEIGHTS[tp] || 1.0;
    const pairKey = `${a}-${t}`;
    const pairMul = ESCALATION_PAIRS[pairKey] || 1.0;
    // Raw impact: severity(1-10) * type weight * pair multiplier, scaled to max 0.8%
    const rawImpact = (sv / 10) * typeWeight * pairMul * WW3_EVENT_CAP;
    // Apply diminishing returns — harder to push higher
    setChaos(prev => {
      const resistance = 1 - (prev / 100); // Harder to increase when already high
      const actualImpact = rawImpact * Math.max(resistance, 0.1);
      return Math.min(WW3_MAX, parseFloat((prev + actualImpact).toFixed(1)));
    });
    const p=priceRef.current;
    setPH(prev=>[...prev.slice(-59),p]);

    // Clear attack after animation, then drain next from queue
    atkTimer.current=setTimeout(()=>{
      setAtk(null);
      atkBusy.current=false;
      // Small gap before next attack for visual breathing room
      setTimeout(drainQueue,800);
    },ATK_DURATION);
  },[playAttackSequence,playLevelUp]);

  // Enqueue with smart dedup + war relevance filter
  const enqueue=useCallback((item,live=false)=>{
    if(!item||!N[item.a]||!N[item.t])return;

    // War relevance gate — ALL events must pass
    if(!isWarRelevant(item.h))return;

    // Smart duplicate check
    const {isDupe,upgradeIdx,newUrl,newQuality}=checkDuplicate(item);

    if(isDupe){
      if(upgradeIdx>=0&&newUrl){
        // Duplicate exists but we have a better source — upgrade the URL in existing event
        seenEvents.current[upgradeIdx].url=newUrl;
        seenEvents.current[upgradeIdx].quality=newQuality;
        // Also upgrade in displayed events list
        setEvts(prev=>prev.map(e=>{
          const sim=keywordSimilarity(extractKeywords(e.text),extractKeywords(item.h));
          if(sim>0.5&&(e.attacker===item.a||e.target===item.t)){
            return {...e,url:newUrl}; // Upgrade source URL silently
          }
          return e;
        }));
        // Also upgrade in queue if pending
        atkQueue.current.forEach(q=>{
          const sim=keywordSimilarity(extractKeywords(q.item.h),extractKeywords(item.h));
          if(sim>0.5)q.item.url=newUrl;
        });
      }
      return; // Skip — it's a duplicate (with or without upgrade)
    }

    // Not a duplicate — register and enqueue
    registerSeen(item);

    if(atkQueue.current.length<15){
      atkQueue.current.push({item,live});
    }
    drainQueue();
  },[drainQueue]);

  // Cleanup on unmount
  useEffect(()=>()=>{if(atkTimer.current)clearTimeout(atkTimer.current)},[]);

  // ── NEWS FETCH — WAR EVENTS ONLY ──
  const fetchNews=useCallback(async()=>{
    setFetching(true);
    const q=QUERIES[fetchRound.current%QUERIES.length];fetchRound.current++;
    const today=new Date().toISOString().split("T")[0];
    const yesterday=new Date(Date.now()-86400000).toISOString().split("T")[0];
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1500,tools:[{type:"web_search_20250305",name:"web_search"}],
          messages:[{role:"user",content:`You are a military intelligence analyst. Search the web RIGHT NOW for: "${q}"

⚠️ CRITICAL DATE REQUIREMENT: Today is ${today}. ONLY return events dated ${today} or ${yesterday}. 
ANY event before ${yesterday} must be COMPLETELY IGNORED — zero tolerance for old news.

Find 2-4 CURRENT military events happening RIGHT NOW or in the last 24 hours ONLY.

✅ ACCEPT:
- Airstrikes, drone attacks, bombings with specific location — HAPPENING TODAY
- Ground combat, territorial changes reported TODAY
- Missile launches or interceptions from LAST 24 HOURS
- Military casualties confirmed TODAY
- Active naval confrontations happening NOW
- Nuclear developments announced TODAY
- Weapons arriving at frontline TODAY

❌ REJECT ABSOLUTELY:
- ANYTHING before ${yesterday} — even if it's important
- Political statements, speeches, diplomatic talks
- "Tensions" or "concerns" without a specific military event TODAY
- Historical context, background summaries
- Future plans, speculation, analysis

Each headline: WHO + WHAT military action + WHERE + must be from today/yesterday

Codes: USA (Ukraine-related too), ISRAEL, IRAN (Hamas/Hezbollah/Houthis), FRANCE (NATO), RUSSIA, CHINA, NKOREA

ONLY valid JSON:
[{"a":"ATTACKER","t":"TARGET","h":"specific current military action max 90 chars","tp":"military|nuclear|cyber|intel","sv":1-10,"d":"${today}","url":"https://source.com/article"}]

url = real article URL. Prefer reuters.com, apnews.com, bbc.com.
JSON ONLY. Zero old news.`}]})});
      if(!r.ok)throw new Error(`${r.status}`);
      const data=await r.json();const txt=data.content?.filter(b=>b.type==="text").map(b=>b.text).join("")||"";
      const m=txt.match(/\[[\s\S]*?\]/);if(m){
        const items=JSON.parse(m[0].replace(/```json|```/g,"").trim());
        if(Array.isArray(items)){
          // Client-side filters: war relevance + date check
          const warItems=items.filter(i=>{
            if(!N[i.a]||!N[i.t]||!i.h||i.h.length<15)return false;
            if(!isWarRelevant(i.h))return false;
            // Reject old dates client-side too
            if(i.d&&i.d<yesterday)return false;
            // Reject talk-only headlines
            const low=i.h.toLowerCase();
            if(/\b(says|said|warns|warned|urged|called for|expressed concern|discussed|announced plan|proposed|considers)\b/.test(low)&&
               !/\b(strike|attack|launch|fire|kill|destroy|intercept|deploy|shell|bomb)\b/.test(low))return false;
            return true;
          });
          warItems.forEach(item=>{
            enqueue({...item,id:Date.now()+Math.random()},true);
          });
        }
      }
    }catch(e){/* API error — wait for next cycle */}
    setFetching(false);
  },[enqueue]);

  // ── INITIALIZATION — Only live news, no old events ──
  useEffect(()=>{
    // Fetch immediately on load, then again at 8s for a second theater
    fetchNews();
    const secondFetch=setTimeout(fetchNews,8000);
    // Auto-fetch rotating theaters every 25s
    const fetchIv=setInterval(fetchNews,25000);
    return()=>{clearTimeout(secondFetch);clearInterval(fetchIv)};
  },[fetchNews]);
  // Price chart path from DexScreener history (no simulation needed when CA is set)

  const lb=useMemo(()=>Object.entries(stats).map(([k,s])=>({k,n:N[k],s,total:Object.entries(s).filter(([kk])=>SM[kk]).reduce((a,[,v])=>a+v,0),xp:s.xp||0})).sort((a,b)=>b.total-a.total),[stats]);
  const pHf=useMemo(()=>pH.filter(p=>p>0),[pH]); // Filter out zero entries
  const pp=useMemo(()=>{if(pHf.length<2)return"";const mn=Math.min(...pHf),mx=Math.max(...pHf),r=mx-mn||0.0001;return pHf.map((p,i)=>`${i===0?"M":"L"}${(i/(pHf.length-1))*280+10},${34-((p-mn)/r)*26}`).join(" ")},[pHf]);
  const dm=gD(chaos);

  // Copy CA to clipboard
  const copyCA=useCallback(()=>{
    if(!TOKEN.CA)return;
    navigator.clipboard.writeText(TOKEN.CA).then(()=>{setCaCopied(true);setTimeout(()=>setCaCopied(false),2000)}).catch(()=>{});
  },[]);

  // Format numbers: 1234567 → 1.23M
  const fmt=(n)=>{if(!n||n===0)return"—";if(n>=1e9)return`$${(n/1e9).toFixed(2)}B`;if(n>=1e6)return`$${(n/1e6).toFixed(2)}M`;if(n>=1e3)return`$${(n/1e3).toFixed(1)}K`;return`$${n.toFixed(2)}`};
  const fmtSupply=(n)=>{if(!n||n===0)return"—";if(n>=1e12)return`${(n/1e12).toFixed(2)}T`;if(n>=1e9)return`${(n/1e9).toFixed(2)}B`;if(n>=1e6)return`${(n/1e6).toFixed(1)}M`;return n.toLocaleString()};

  const tabs=[{id:"map",l:"WAR MAP",s:"🌀"},{id:"roster",l:"DOSSIER",s:"👤"},{id:"doom",l:"DOOMSDAY",s:"☢️"},{id:"news",l:"WAR LOG",s:"📡"},{id:"coin",l:"$CHMCO",s:"🧪"},{id:"swap",l:"SWAP",s:"💱"}];

  return <div className="min-h-screen text-white relative overflow-x-hidden body" style={{background:"var(--bg)",color:"var(--txt)"}}>
    <style>{CSS}</style><div className="scanbar"/>

    {/* ═══ LIVING BACKGROUND ═══ */}
    <div className="fixed inset-0 z-0 overflow-hidden">
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 15% 20%,#0a1f10 0%,#080c10 30%,#050608 60%,#000 100%)"}}/>
      {/* Animated portal vortex */}
      <div className="absolute" style={{top:"-5%",left:"-5%",width:"40vw",height:"40vw",maxWidth:350,maxHeight:350,borderRadius:"50%",
        background:"conic-gradient(from 0deg,transparent,#39FF1408,transparent,#39FF1404,transparent)",
        animation:"sp 20s linear infinite",opacity:.5}}/>
      <div className="absolute" style={{bottom:"-10%",right:"-8%",width:"30vw",height:"30vw",maxWidth:280,maxHeight:280,borderRadius:"50%",
        background:"conic-gradient(from 0deg,transparent,#00D4FF06,transparent,#BF40FF04,transparent)",
        animation:"sp 25s linear infinite reverse"}}/>
      {/* Stars */}
      <svg className="absolute inset-0 w-full h-full">{STAR_SEEDS.map((s,i)=><circle key={i} cx={`${s.x}%`} cy={`${s.y}%`}
        r={s.r} fill={s.fill} opacity={s.o}>
        <animate attributeName="opacity" values={`${s.ov1};${s.ov2};${s.ov1}`} dur={`${s.dur}s`} repeatCount="indefinite"/></circle>)}</svg>
      {/* Floating portal particles */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">{Array.from({length:8},(_,i)=>
        <text key={i} x={`${10+i*12}%`} y={`${20+i*8}%`} fontSize={6+i%3*3} opacity={.04+i%2*.03}
          style={{animation:`bob ${4+i%3}s ease-in-out infinite ${i*.5}s`}}>🌀</text>)}</svg>
    </div>

    {/* ═══ HEADER ═══ */}
    <header className="relative z-10 px-3 sm:px-5 pt-3 pb-2" style={{borderBottom:"3px solid var(--bdr)"}}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div style={{animation:"sp 3s linear infinite",display:"inline-block",filter:"drop-shadow(0 0 8px #39FF1444)"}}>
              <span className="text-2xl sm:text-3xl">🌀</span>
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl toon glow" style={{color:"var(--g)"}}>SCHMECKLE WARS</h1>
              <div className="text-[7px] sm:text-[8px] opacity-25 mono tracking-wide">Interdimensional War Dashboard • $CHMCO on Solana</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="card px-2.5 py-1 flex items-center gap-1.5 rounded-xl" style={{borderColor:dm.cl+"44"}}>
              <span style={{fontSize:12}}>{dm.ic}</span>
              <span className="toon text-xs" style={{color:dm.cl}}>{chaos.toFixed(1)}%</span>
            </div>
            <div className="card px-2.5 py-1 flex items-center gap-1.5 rounded-xl">
              {tokenData.live&&<span className="w-1.5 h-1.5 rounded-full bg-green-400" style={{animation:"bob 1s infinite"}}/>}
              <span className="toon text-xs glow" style={{color:"var(--g)"}}>${price>0?price.toFixed(price<0.001?8:price<1?6:2):"—"}</span>
              <span className="mono text-[8px]" style={{color:pc>=0?"var(--g)":"var(--r)"}}>{pc!==0?`${pc>=0?"▲":"▼"}${Math.abs(pc).toFixed(1)}%`:""}</span>
            </div>
            {/* 🔊 Sound toggle */}
            <button onClick={()=>{setMuted(m=>!m);if(!audioCtx.current)getAudio()}}
              className="card w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-all active:scale-90 hover:scale-105"
              style={{borderColor:muted?"#FF073A33":"#39FF1433",opacity:muted?.5:1}}
              title={muted?"Unmute sounds":"Mute sounds"}>
              {muted?"🔇":"🔊"}
            </button>
          </div>
        </div>
        {/* Chart */}
        <div className="mt-1.5 rounded-xl overflow-hidden" style={{background:"#06080a",height:34,border:"2px solid var(--bdr)"}}>
          <svg viewBox="0 0 300 36" className="w-full h-full" preserveAspectRatio="none">
            <defs><linearGradient id="pf" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#39FF14" stopOpacity=".15"/><stop offset="100%" stopColor="#39FF14" stopOpacity="0"/></linearGradient></defs>
            {pp&&<><path d={pp+" L290,34 L10,34 Z"} fill="url(#pf)"/><path d={pp} fill="none" stroke="#39FF14" strokeWidth="1.5"/></>}
            <text x="8" y="9" fill="#39FF1422" fontSize="5" className="mono">$CHMCO • WW3: {chaos.toFixed(1)}% • {dm.l}</text>
          </svg>
        </div>
      </div>
    </header>

    {/* TABS */}
    <nav className="relative z-10 px-3 sm:px-5 py-1.5 flex gap-1.5 overflow-x-auto" style={{borderBottom:"2px solid var(--bdr)"}}>
      {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} className="px-2.5 sm:px-3.5 py-1.5 rounded-xl text-[9px] sm:text-[10px] whitespace-nowrap transition-all shrink-0 toon"
        style={{background:tab===t.id?"rgba(57,255,20,.1)":"transparent",color:tab===t.id?"#39FF14":"#ffffff28",
          border:`2px solid ${tab===t.id?"#39FF1433":"transparent"}`,transform:tab===t.id?"scale(1.05)":"scale(1)"}}>
        {t.s} <span className="hidden sm:inline">{t.l}</span></button>)}
    </nav>

    {/* TICKER */}
    {evts.length>0&&<div className="relative z-10 overflow-hidden py-1" style={{background:"rgba(255,7,58,.04)",borderBottom:"2px solid #FF073A15"}}>
      <div className="flex whitespace-nowrap" style={{animation:"ticker 45s linear infinite"}}>
        {[...evts.slice(0,10),...evts.slice(0,10)].map((e,i)=><span key={i} className="mx-4 mono text-[7px] cursor-pointer hover:opacity-80"
          onClick={()=>{const link=e.url||e.searchUrl;if(link)window.open(link,"_blank","noopener,noreferrer")}}>
          <span className="text-green-400 mr-1">●</span>
          <span className="opacity-15">[{e.date||e.ts}]</span>{" "}
          <span style={{color:N[e.attacker]?.cl}}>{N[e.attacker]?.c}</span>
          <span className="opacity-20"> ⚔️ </span>
          <span style={{color:N[e.target]?.cl}}>{N[e.target]?.c}</span>
        </span>)}
      </div>
    </div>}

    <main className="relative z-10 max-w-7xl mx-auto p-3 sm:p-5">

      {/* ═══ MAP ═══ */}
      {tab==="map"&&<div className="space-y-3">
        <div className="card p-2 sm:p-4 relative">
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="text-sm sm:text-base toon glow" style={{color:"var(--g)"}}>🌀 War Map — Dimension C-137</h2>
            <div className="flex items-center gap-2 mono text-[7px] opacity-25">
              {fetching&&<span className="text-green-400" style={{animation:"bob .5s infinite"}}>● SCANNING WAR ZONES</span>}
              {atk&&<span className="text-yellow-300">⚔️ ATTACKING</span>}
              {atkQueue.current.length>0&&<span className="text-orange-300">📋 {atkQueue.current.length} queued</span>}
              <span>⚡{liveN} live</span>
            </div>
          </div>

          <svg viewBox="0 0 680 320" className="w-full rounded-xl" style={{background:"radial-gradient(ellipse at 40% 40%,#0d1a12,#080e0a 45%,#050807)",border:"3px solid var(--bdr)"}}>
            <defs>
              <filter id="gl"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              <filter id="gB"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              <filter id="toon"><feMorphology operator="dilate" radius=".5"/></filter>
            </defs>
            {/* Grid */}
            {Array.from({length:35},(_,i)=><line key={`x${i}`} x1={i*20} y1={0} x2={i*20} y2={320} stroke="#39FF1405" strokeWidth=".4"/>)}
            {Array.from({length:17},(_,i)=><line key={`y${i}`} x1={0} y1={i*20} x2={680} y2={i*20} stroke="#39FF1405" strokeWidth=".4"/>)}
            {/* Continents */}
            {Object.values(MC).map((p,i)=><path key={i} d={p} fill="rgba(57,255,20,.03)" stroke="rgba(57,255,20,.12)" strokeWidth="1.2" strokeLinejoin="round"/>)}
            {/* Country zones */}
            {Object.entries(ZN).map(([k,z])=>{const n=N[k],iA=atk?.attacker===k,iT=atk?.target===k,iH=hov===k;
              return <path key={k} d={z.p} fill={iA?n.cl+"20":iT?"#FF073A15":iH?n.cl+"10":"transparent"}
                stroke={iH||iA?n.cl+"77":iT?"#FF073A55":n.cl+"22"} strokeWidth={iH?2.5:1.5} strokeLinejoin="round"
                style={{cursor:"pointer",transition:"all .3s",animation:iT?"glitch .25s infinite":"none"}}
                onMouseEnter={()=>setHov(k)} onMouseLeave={()=>setHov(null)} onClick={()=>setSel(k===sel?null:k)}/>})}

            {/* ═══ RICK FLYOVER ATTACK ═══ */}
            {atk&&ZN[atk.attacker]&&ZN[atk.target]&&(()=>{
              const f=ZN[atk.attacker],t=ZN[atk.target],cl=N[atk.attacker].cl;
              const mx=(f.cx+t.cx)/2,my=Math.min(f.cy,t.cy)-40;
              const fly=`M${f.cx},${f.cy} Q${mx},${my} ${t.cx},${t.cy}`;
              return <g key={atk.key}>
                {/* Source portal opens */}
                <circle cx={f.cx} cy={f.cy} r="0" fill="none" stroke="#39FF14" strokeWidth="2.5" filter="url(#gl)">
                  <animate attributeName="r" values="0;15;10" dur=".7s" fill="freeze"/>
                  <animate attributeName="opacity" values="0;.9;.5" dur=".7s" fill="freeze"/></circle>
                <text x={f.cx} y={f.cy+4} textAnchor="middle" fontSize="16" opacity="0">🌀
                  <animate attributeName="opacity" values="0;.8;.6;0" dur="1.8s" fill="freeze"/>
                  <animateTransform attributeName="transform" type="rotate" from={`0 ${f.cx} ${f.cy}`} to={`720 ${f.cx} ${f.cy}`} dur="1.8s" fill="freeze"/></text>

                {/* Trail — slow reveal */}
                <path d={fly} fill="none" stroke={cl} strokeWidth="2" strokeDasharray="500" strokeDashoffset="500" filter="url(#gl)" opacity=".4">
                  <animate attributeName="stroke-dashoffset" from="500" to="0" dur="2.5s" begin=".4s" fill="freeze"/>
                  <animate attributeName="opacity" values="0;0;.5;.4;.15;.05" dur="5.5s" fill="freeze"/></path>

                {/* ═══ RICK SPRITE FLYING — SLOW & DRAMATIC ═══ */}
                <g opacity="0">
                  <animateMotion dur="3.5s" begin=".3s" fill="freeze" path={fly}/>
                  <animate attributeName="opacity" values="0;1;1;1;1;0" dur="4.5s" begin=".2s" fill="freeze"/>
                  {/* Portal glow */}
                  <circle cx="0" cy="0" r="14" fill="#39FF1412" stroke="#39FF1433" strokeWidth="1">
                    <animate attributeName="r" values="12;16;12" dur=".6s" repeatCount="7"/></circle>
                  {/* Rick body */}
                  <g style={{animation:"rickWobble .3s ease-in-out infinite"}}>
                    <rect x="-6" y="0" width="12" height="14" rx="3" fill="#d4e6f1" stroke="#6a8a90" strokeWidth="1.2"/>
                    <ellipse cx="0" cy="-6" rx="7" ry="8" fill="#b8d8b0" stroke="#5a7a50" strokeWidth="1.2"/>
                    <path d="M-7,-12 L-8,-20 L-3,-14 L-4,-21 L0,-15 L1,-22 L4,-15 L6,-21 L5,-14 L8,-20 L7,-12" fill="#87ceeb" stroke="#4a8ab0" strokeWidth=".8"/>
                    <path d="M-4,-7 Q0,-9.5 4,-7" stroke="#4a6a40" strokeWidth="1.2" fill="none"/>
                    <circle cx="-2.5" cy="-5" r="2.2" fill="white" stroke="#444" strokeWidth=".6"/>
                    <circle cx="2.5" cy="-5" r="2.2" fill="white" stroke="#444" strokeWidth=".6"/>
                    <circle cx="-2" cy="-5" r="1.1" fill="#111"/><circle cx="3" cy="-5" r="1.1" fill="#111"/>
                    <path d="M-1.5,-1 Q-2.5,5 -3.5,9" stroke="#87ceeb" strokeWidth=".8" fill="none" opacity=".5"/>
                    {/* Portal gun */}
                    <rect x="7" y="-3" width="10" height="4.5" rx="2" fill="#444" stroke="#39FF14" strokeWidth=".8"/>
                    <circle cx="17" cy="-0.75" r="2" fill="#39FF14" opacity=".9">
                      <animate attributeName="r" values="1.5;2.5;1.5" dur=".25s" repeatCount="indefinite"/></circle>
                    <line x1="18" y1="-0.75" x2="28" y2="-0.75" stroke="#39FF14" strokeWidth="1.5" opacity=".6" strokeLinecap="round">
                      <animate attributeName="x2" values="18;30;18" dur=".35s" repeatCount="indefinite"/></line>
                  </g>
                  {/* Speech bubble — stays visible longer */}
                  <g opacity="0"><animate attributeName="opacity" values="0;0;0;1;1;1;1;0" dur="4.8s" begin=".2s" fill="freeze"/>
                    <rect x="-42" y="-36" width="84" height="18" rx="9" fill="#000000cc" stroke="#39FF14" strokeWidth="1.5"/>
                    <polygon points="-3,-18 3,-18 0,-14" fill="#000000cc" stroke="#39FF14" strokeWidth="1"/>
                    <text x="0" y="-24.5" textAnchor="middle" fill="#39FF14" fontSize="6.5" fontFamily="Bangers" letterSpacing=".5">
                      {rickLine || "WUBBA LUBBA DUB DUB!"}
                    </text>
                  </g>
                </g>

                {/* Impact — delayed to when Rick arrives */}
                <circle cx={t.cx} cy={t.cy} r="0" fill="#FF073A" filter="url(#gB)">
                  <animate attributeName="r" values="0;0;0;0;0;6;28" dur="4.2s" fill="freeze"/>
                  <animate attributeName="opacity" values="0;0;0;0;0;1;0" dur="4.2s" fill="freeze"/></circle>
                <circle cx={t.cx} cy={t.cy} r="0" fill="#FFD700">
                  <animate attributeName="r" values="0;0;0;0;0;4;18" dur="4s" fill="freeze"/>
                  <animate attributeName="opacity" values="0;0;0;0;0;1;0" dur="4s" fill="freeze"/></circle>
                {/* BOOM text — rises up after impact */}
                <text x={t.cx} y={t.cy-22} textAnchor="middle" fill="#FF073A" fontSize="9" fontFamily="Bangers" opacity="0" letterSpacing="1">
                  💥 BOOM!
                  <animate attributeName="opacity" values="0;0;0;0;0;0;1;1;0" dur="5.5s" fill="freeze"/>
                  <animate attributeName="y" values={`${t.cy-16};${t.cy-16};${t.cy-16};${t.cy-16};${t.cy-16};${t.cy-16};${t.cy-22};${t.cy-32};${t.cy-42}`} dur="5.5s" fill="freeze"/>
                </text>
                {/* Target portal closing */}
                <text x={t.cx} y={t.cy+4} textAnchor="middle" fontSize="14" opacity="0">🌀
                  <animate attributeName="opacity" values="0;0;0;0;0;.6;.4;0" dur="5.5s" fill="freeze"/>
                  <animateTransform attributeName="transform" type="rotate" from={`0 ${t.cx} ${t.cy}`} to={`-720 ${t.cx} ${t.cy}`} dur="1.5s" begin="3.5s" fill="freeze"/>
                </text>
              </g>})()}

            {/* Character markers */}
            {Object.entries(ZN).map(([k,z])=>{const n=N[k],iA=atk?.attacker===k,iT=atk?.target===k,isH=hov===k;
              const sz=k==="NKOREA"||k==="ISRAEL"?14:k==="FRANCE"||k==="IRAN"?17:21;
              const evo=getEvo(stats[k]?.xp||0);
              return <g key={`ch-${k}`} onMouseEnter={()=>setHov(k)} onMouseLeave={()=>setHov(null)} onClick={()=>setSel(k===sel?null:k)} style={{cursor:"pointer"}}>
                {/* Evo ring */}
                <circle cx={z.cx} cy={z.cy} r={sz+5} fill="none" stroke={evo.border} strokeWidth={iA?2:1} opacity={iA?.7:isH?.4:.15} strokeDasharray={iA?"none":"3 3"}>
                  {iA&&<animate attributeName="r" values={`${sz+5};${sz+12};${sz+5}`} dur="1s" repeatCount="indefinite"/>}</circle>
                {/* Body */}
                <circle cx={z.cx} cy={z.cy} r={sz} fill={`${n.cl}12`} stroke={iA?n.cl:iT?"#FF073A":n.cl+"55"} strokeWidth={isH?3:2}
                  style={{filter:iA?`drop-shadow(0 0 10px ${n.cl}66)`:iT?"drop-shadow(0 0 10px #FF073A55)":`drop-shadow(0 0 4px ${n.cl}1a)`,
                    animation:iT?"glitch .2s infinite":"none",transition:"all .3s"}}/>
                {/* Character Image */}
                <foreignObject x={z.cx-sz} y={z.cy-sz} width={sz*2} height={sz*2}
                  className="pointer-events-none overflow-visible"
                  style={{animation:iT?"glitch .2s infinite":`bob ${CHAR_SEEDS[k].bobDur}s ease-in-out infinite`,
                    animationDelay:`${CHAR_SEEDS[k].bobDelay}s`}}>
                  <div style={{display:"flex",justifyContent:"center",alignItems:"center",width:"100%",height:"100%"}}>
                    <MapChar k={k} sz={sz*1.4}/>
                  </div>
                </foreignObject>
                {/* Evo badge */}
                <text x={z.cx+sz*.7} y={z.cy-sz*.7} textAnchor="middle" fontSize="6" opacity=".8"
                  style={{filter:"drop-shadow(0 1px 0 #000)"}}>{evo.badge}</text>
                {/* Labels */}
                <text x={z.cx} y={z.cy+sz+11} textAnchor="middle" fill={n.cl} fontSize="6" fontFamily="Bangers" opacity=".8"
                  style={{filter:`drop-shadow(0 1px 0 ${n.cl}44)`}}>{n.e} {n.n}</text>
                <text x={z.cx} y={z.cy+sz+19} textAnchor="middle" fill={n.cl} fontSize="4.5" className="body" opacity=".3">{n.c}</text>
                {(iA||iT)&&<g><rect x={z.cx-17} y={z.cy-sz-15} width="34" height="11" rx="5.5"
                  fill={iA?"#39FF1433":"#FF073A33"} stroke={iA?"#39FF1466":"#FF073A66"} strokeWidth="1.5"/>
                  <text x={z.cx} y={z.cy-sz-7.5} textAnchor="middle" fill={iA?"#39FF14":"#FF073A"} fontSize="5.5" fontFamily="Bangers">
                    {iA?"⚡ ATK":"💥 HIT"}</text></g>}
              </g>})}
            {/* Portal deco */}
            <text x="30" y="32" textAnchor="middle" fontSize="14" opacity=".15" style={{animation:"sp 8s linear infinite"}}>🌀</text>
            <text x="650" y="295" textAnchor="middle" fontSize="10" opacity=".08" style={{animation:"sp 12s linear infinite reverse"}}>🌀</text>
          </svg>

          {/* Hover tooltip */}
          {hov&&!sel&&<div className="absolute top-14 right-2 sm:right-4 card p-3 rounded-xl z-40" style={{animation:"popIn .25s ease",maxWidth:220,minWidth:180,borderColor:N[hov].cl+"44"}}>
            <div className="flex items-center gap-2 mb-2"><Av k={hov} sz={30}/><div>
              <div className="toon text-xs" style={{color:N[hov].cl}}>{N[hov].c}</div>
              <div className="mono text-[7px] opacity-25">{N[hov].e} {N[hov].n} • {N[hov].th}</div>
              <div className="mono text-[6px] opacity-20 flex items-center gap-1">{getEvo(stats[hov]?.xp||0).badge} {getEvo(stats[hov]?.xp||0).title} • XP:{stats[hov]?.xp||0}</div>
            </div></div>
            <div className="space-y-0.5">{Object.entries(SM).map(([k,v])=><Bar key={k} l={v.l} v={stats[hov]?.[k]||0} c={v.c} sm/>)}</div>
          </div>}
        </div>

        {/* Latest event or waiting */}
        {evts[0]?<div className="card rounded-xl p-2.5 flex items-center gap-2.5 cursor-pointer transition-all hover:scale-[1.01] active:scale-[.99]"
          style={{animation:"popIn .3s ease",borderColor:"#39FF1444"}}
          onClick={()=>{const link=evts[0].url||evts[0].searchUrl;if(link)window.open(link,"_blank","noopener,noreferrer")}}>
          <Av k={evts[0].attacker} sz={26}/>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] flex-wrap">
              <span className="toon text-[7px] px-1.5 py-0.5 rounded-full" style={{background:"#39FF1418",color:"#39FF14",border:"2px solid #39FF1433"}}>⚡ LIVE</span>
              <span className="toon" style={{color:N[evts[0].attacker]?.cl}}>{N[evts[0].attacker]?.c}</span>
              <span className="opacity-25">⚔️</span>
              <span className="toon" style={{color:N[evts[0].target]?.cl}}>{N[evts[0].target]?.c}</span>
            </div>
            <div className="mono text-[7px] opacity-35 truncate mt-0.5 flex items-center gap-1">
              <span className="flex-1 truncate">{evts[0].text}</span>
              <span className="shrink-0 opacity-30" style={{fontSize:8}}>🔗</span>
            </div>
          </div>
          <Av k={evts[0].target} sz={26}/>
        </div>
        :<div className="card rounded-xl p-3 text-center" style={{borderColor:"#39FF1422"}}>
          <div className="flex items-center justify-center gap-2">
            <span style={{animation:"sp 2s linear infinite",fontSize:16}}>🌀</span>
            <span className="toon text-[10px] opacity-30">Scanning active war zones for current events...</span>
          </div>
        </div>}

        {/* Nation cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {Object.entries(N).map(([k,n])=>{const iA=atk?.attacker===k,iT=atk?.target===k;const evo=getEvo(stats[k]?.xp||0);
            return <div key={k} className="card rounded-xl p-2.5 cursor-pointer" onClick={()=>setSel(k===sel?null:k)}
              style={{borderColor:iA?n.cl+"55":iT?"#FF073A55":"var(--bdr)",animation:iT?"glitch .3s infinite":"none"}}>
              <div className="flex items-center gap-2">
                <Av k={k} sz={28} st={{animation:iA?"sp .6s linear infinite":iT?"glitch .2s infinite":`bob ${CHAR_SEEDS[k].bobDur}s ease-in-out infinite`}}/>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1"><span style={{fontSize:8}}>{n.e}</span>
                    <span className="toon text-[9px] truncate" style={{color:n.cl}}>{n.c}</span></div>
                  <div className="mono text-[6px] opacity-25">{evo.badge} {evo.title} • XP:{stats[k]?.xp||0}</div>
                </div>
              </div>
            </div>})}
        </div>
      </div>}

      {/* ═══ ROSTER ═══ */}
      {tab==="roster"&&<div className="space-y-3">
        <h2 className="toon text-base sm:text-lg glow" style={{color:"var(--g)"}}>👤 Interdimensional Dossier</h2>
        {Object.entries(N).map(([k,n])=>{const s=stats[k],evo=getEvo(s?.xp||0);
          return <div key={k} className="card rounded-2xl p-4" style={{borderColor:n.cl+"22",animation:"popIn .4s ease"}}>
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="shrink-0 text-center">
                <Av k={k} sz={58}/><div className="mt-1.5 toon text-[9px] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1"
                  style={{background:evo.border+"18",color:evo.border,border:`2px solid ${evo.border}33`}}>
                  {evo.badge} {evo.title}</div>
                <div className="mono text-[7px] opacity-20 mt-0.5">XP: {s?.xp||0}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1"><span className="text-lg">{n.e}</span>
                  <h3 className="toon text-base sm:text-lg" style={{color:n.cl}}>{n.c}</h3>
                  <span className="toon text-[8px] px-1.5 py-0.5 rounded-full" style={{background:["OMEGA","CRITICAL","LETHAL"].includes(n.th)?"#FF073A12":"#FFD70012",color:["OMEGA","CRITICAL","LETHAL"].includes(n.th)?"#FF073A":"#FFD700",border:"2px solid currentColor"}}>{n.th}</span></div>
                <div className="body text-[9px] opacity-25 mb-1">{n.n} • {n.rl}</div>
                <p className="body text-[10px] opacity-45 mb-2">{n.d}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">{Object.entries(n.r).map(([rk,rv])=>
                  <div key={rk} className="card rounded-lg px-2 py-1 text-[7px]" style={{borderWidth:2}}>
                    <span className="opacity-25">{rk}: </span><span className="toon" style={{color:n.cl}}>{rv}</span></div>)}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">{Object.entries(SM).map(([sk,sv])=>
                  <Bar key={sk} l={`${sv.i} ${sv.l}`} v={s?.[sk]||0} c={sv.c}/>)}</div>
              </div>
            </div>
          </div>})}
      </div>}

      {/* ═══ DOOMSDAY ═══ */}
      {tab==="doom"&&<div className="space-y-3">
        <h2 className="toon text-base sm:text-lg glow" style={{color:"var(--g)"}}>☢️ WW3 Probability Index</h2>

        {/* Main probability panel */}
        <div className="card rounded-2xl p-4 sm:p-5" style={{borderColor:dm.cl+"33"}}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2"><span style={{fontSize:26}}>{dm.ic}</span><div>
              <h3 className="toon text-sm sm:text-base" style={{color:dm.cl}}>{dm.l}</h3>
              <div className="body text-[8px] opacity-35">{dm.s}</div></div></div>
            <div className="text-right">
              <div className="toon text-3xl sm:text-4xl" style={{color:dm.cl,textShadow:`0 0 20px ${dm.cl}44`}}>{chaos.toFixed(1)}%</div>
              <div className="mono text-[7px] opacity-20">WW3 PROBABILITY</div>
            </div>
          </div>

          {/* Main bar */}
          <div className="mt-3"><div className="h-5 sm:h-6 rounded-full overflow-hidden relative" style={{background:"#ffffff06",border:"3px solid #ffffff0a"}}>
            <div className="h-full rounded-full transition-all duration-1000" style={{width:`${chaos}%`,
              background:"linear-gradient(90deg,#39FF14,#7FFF00,#FFD700,#FF8C00,#FF4500,#FF073A)",
              backgroundSize:"200%",animation:"chaos 3s linear infinite",boxShadow:`0 0 16px ${dm.cl}44`}}/>
            {/* Baseline marker */}
            <div className="absolute top-0 bottom-0 w-0.5" style={{left:`${WW3_BASELINE}%`,background:"#ffffff33"}}/>
          </div>
            <div className="flex justify-between mt-1.5 mono text-[5px] opacity-15"><span>0% Safe</span><span>Baseline →</span><span>50% Severe</span><span>Nuclear</span><span>100%</span></div>
          </div>

          {/* Methodology */}
          <div className="mt-4 p-3 rounded-xl" style={{background:"#ffffff04",border:"2px solid #ffffff06"}}>
            <h4 className="toon text-[9px] opacity-40 mb-2">📊 How This Is Calculated</h4>
            <div className="body text-[8px] opacity-35 space-y-1.5 leading-relaxed">
              <p><span style={{color:"var(--g)"}}>Baseline: {WW3_BASELINE}%</span> — Based on Bulletin of Atomic Scientists Doomsday Clock at 90 seconds to midnight (closest ever). Multiple active wars between nuclear-aligned states. Updated nuclear doctrines.</p>
              <p><span style={{color:"#FF6B00"}}>Live adjustments:</span> Each real military event adjusts the index based on: event severity (1-10), event type (nuclear events weighted 2.8x, military 1x, cyber 0.8x), and which countries are involved (USA-Russia direct = 2.5x multiplier, Israel-Iran = 1.8x).</p>
              <p><span style={{color:"#00D4FF"}}>De-escalation:</span> Index slowly decays toward baseline ({WW3_BASELINE}%) when no new escalation events occur, simulating diplomatic cooling periods. It never drops below baseline while active wars continue.</p>
              <p><span style={{color:"#FF073A"}}>Diminishing returns:</span> The higher the index, the harder each event pushes it further — reflecting that each additional escalation step requires exponentially more provocation.</p>
            </div>
          </div>
        </div>

        {/* Risk factors */}
        <div className="card rounded-2xl p-4" style={{borderColor:"#FF073A22"}}>
          <h4 className="toon text-[10px] opacity-40 mb-3">🎯 Active Risk Factors (Real as of today)</h4>
          <div className="space-y-2">
            {[
              {f:"Russia-Ukraine War",r:"Full-scale conventional war between nuclear power and NATO-backed state. 1000+ days active. Russia updated nuclear doctrine Nov 2024. Oreshnik hypersonic IRBM deployed.",p:35,c:"#FFD700"},
              {f:"Israel-Iran Direct Exchanges",r:"Two direct missile exchanges in 2024 (Apr & Oct). Iran pursuing nuclear weapons capability. Could draw in USA and trigger regional nuclear war.",p:28,c:"#FF4D00"},
              {f:"China-Taiwan Flashpoint",r:"PLA encirclement drills (Joint Sword 2024A & B). 370+ warship fleet. USA committed to Taiwan defense. Nuclear powers on collision course.",p:22,c:"#FF6B00"},
              {f:"North Korea Arsenal",r:"50+ warheads. ICBM capability proven. 12K troops fighting in Russia. Unpredictable regime with nothing to lose.",p:12,c:"#BF40FF"},
              {f:"Nuclear Doctrine Escalation",r:"Russia: 'Any attack backed by nuclear state = nuclear response.' Multiple nations lowering thresholds for nuclear use.",p:40,c:"#FF073A"},
              {f:"Doomsday Clock Position",r:"90 seconds to midnight — closest in history. Set Jan 2024. Reflects judgment of nuclear scientists worldwide.",p:22,c:"#FFD700"},
            ].map(rf=><div key={rf.f} className="flex items-start gap-2 py-2 border-b" style={{borderColor:"#ffffff05"}}>
              <div className="w-1 shrink-0 rounded-full" style={{background:rf.c,height:50}}/>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="toon text-[9px]" style={{color:rf.c}}>{rf.f}</span>
                  <span className="toon text-[10px] shrink-0" style={{color:rf.c}}>{rf.p}%</span>
                </div>
                <div className="body text-[7px] opacity-30 mt-0.5 leading-relaxed">{rf.r}</div>
              </div>
            </div>)}
          </div>
        </div>

        {/* Nuclear arsenals */}
        <div className="card rounded-2xl p-4" style={{borderColor:"#FF6B0022"}}>
          <h4 className="toon text-[10px] opacity-40 mb-2">☢️ Global Nuclear Arsenal — 12,100+ warheads</h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">{[{k:"RUSSIA",w:"6,255",p:"Active"},{k:"USA",w:"5,550",p:"Active"},{k:"CHINA",w:"500+",p:"Growing fast"},{k:"FRANCE",w:"290",p:"Submarine"},{k:"ISRAEL",w:"90*",p:"Undeclared"},{k:"NKOREA",w:"50+",p:"Expanding"},{k:"IRAN",w:"0†",p:"Threshold"}].map(({k,w,p})=>
            <div key={k} className="card rounded-lg p-1.5 text-center" style={{borderWidth:2}}>
              <div className="mono text-[6px] opacity-25">{N[k]?.e} {N[k]?.n}</div>
              <div className="toon text-[11px]" style={{color:N[k]?.cl}}>{w}</div>
              <div className="mono text-[5px] opacity-15">{p}</div>
            </div>)}</div>
          <div className="mono text-[6px] opacity-10 text-center mt-2">*estimated †threshold state • Source: FAS/SIPRI 2024</div>
        </div>

        {/* Escalation multipliers */}
        <div className="card rounded-2xl p-4" style={{borderColor:"#ffffff0a"}}>
          <h4 className="toon text-[10px] opacity-40 mb-2">⚡ Escalation Multipliers (how event pairs affect WW3 index)</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {Object.entries(ESCALATION_PAIRS).filter(([k])=>k.includes("USA")||k.includes("ISRAEL")).slice(0,6).map(([pair,mul])=>{
              const [a,b]=pair.split("-");
              return <div key={pair} className="card rounded-lg p-1.5 text-center" style={{borderWidth:2,borderColor:mul>2?"#FF073A22":mul>1.5?"#FF8C0022":"#ffffff08"}}>
                <div className="mono text-[7px] opacity-30">{N[a]?.e}→{N[b]?.e}</div>
                <div className="toon text-sm" style={{color:mul>2?"#FF073A":mul>1.5?"#FF8C00":"#FFD700"}}>{mul}x</div>
              </div>})}
          </div>
        </div>

        {/* Ranking */}
        <h3 className="toon text-sm opacity-40">Power Ranking</h3>
        {lb.map((e,i)=>{const evo=getEvo(e.xp);return <div key={e.k} className="card rounded-xl px-3 py-2.5 flex items-center gap-3"
          style={{borderColor:i===0?"#FFD70033":e.n.cl+"15",animation:`popIn .3s ease ${i*.05}s both`}}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center toon text-xs shrink-0" style={{
            background:i===0?"linear-gradient(135deg,#FFD700,#FF8800)":i===1?"#555":i===2?"#8B6914":"#222",color:"#000"}}>{i+1}</div>
          <Av k={e.k} sz={26}/><div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5"><span className="text-[10px]">{e.n.e}</span>
              <span className="toon text-[11px] truncate" style={{color:e.n.cl}}>{e.n.c}</span>
              <span className="mono text-[6px] opacity-20">{evo.badge}</span></div></div>
          <div className="text-right shrink-0"><div className="toon text-sm" style={{color:"#FFD700"}}>{e.total}</div></div>
        </div>})}
      </div>}

      {/* ═══ WAR LOG ═══ */}
      {tab==="news"&&<div>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div><h2 className="toon text-base glow" style={{color:"var(--g)"}}>📡 War Log — Active Conflicts Only</h2>
            <div className="mono text-[7px] opacity-25 flex items-center gap-2 mt-0.5 flex-wrap">
              <span className={fetching?"text-yellow-400":"text-green-400"}>{fetching?"● Scanning war zones...":"● Monitoring active theaters"}</span>
              <span>⚡ {liveN} live</span>
              <span className="opacity-50">• Only verified military actions 🔗</span></div></div>
          <button onClick={fetchNews} disabled={fetching} className="card px-3 py-1.5 rounded-xl toon text-[9px] active:scale-95 transition-all disabled:opacity-30"
            style={{color:"var(--g)",borderColor:"#39FF1444"}}>{fetching?"⏳ Scanning...":"⚡ Fetch Now"}</button>
        </div>
        <div className="space-y-1 max-h-[65vh] overflow-y-auto rounded-xl p-3 card">
          {evts.length===0?<div className="text-center py-12">
            <div className="text-3xl mb-3" style={{animation:"bob 2s ease-in-out infinite"}}>🛸</div>
            <div className="toon text-sm opacity-30">Scanning active war zones...</div>
            <div className="mono text-[8px] opacity-15 mt-1">Connecting to interdimensional intelligence feeds</div>
            <div className="mono text-[7px] opacity-10 mt-2">Only CURRENT military events will appear here — no old news</div>
          </div>
          :evts.map(e=>{
            const link=e.url||e.searchUrl;
            const quality=getSourceQuality(e.url);
            const qColor=quality>=80?"#39FF14":quality>=50?"#FFD700":quality>=20?"#FF6B00":"#ffffff33";
            let sourceName="";
            try{if(e.url)sourceName=new URL(e.url).hostname.replace("www.","")}catch(_){}
            return <div key={e.id} className="news-link flex items-start gap-2 py-2.5 border-b"
              style={{borderColor:"#ffffff06",animation:"fadeUp .3s ease"}}
              onClick={()=>link&&window.open(link,"_blank","noopener,noreferrer")}
              title={e.url?`Read on ${sourceName} →`:"Search Google News for this event"}>
              <Av k={e.attacker} sz={20}/>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap text-[9px]">
                  <span className="toon text-[6px] px-1 py-px rounded-full" style={{background:"#39FF1418",color:"#39FF14",border:"1px solid #39FF1433"}}>⚡LIVE</span>
                  {e.date&&<span className="mono text-[6px] opacity-20">{e.date}</span>}
                  <span className="toon" style={{color:N[e.attacker]?.cl}}>{N[e.attacker]?.c}</span>
                  <span className="opacity-20">⚔️</span>
                  <span className="toon" style={{color:N[e.target]?.cl}}>{N[e.target]?.c}</span>
                </div>
                <div className="body text-[8px] opacity-40 mt-0.5 flex items-center gap-1">
                  <span className="flex-1 truncate">{e.text}</span>
                  <span className="link-icon shrink-0" style={{fontSize:10}}>🔗</span>
                </div>
                {/* Source info with quality dot */}
                {sourceName?
                  <div className="mono text-[6px] opacity-25 mt-0.5 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full shrink-0" style={{background:qColor}}/>
                    <span className="truncate">📰 {sourceName}</span>
                  </div>
                  :<div className="mono text-[6px] opacity-12 mt-0.5">🔍 click to search</div>
                }
              </div>
              <Av k={e.target} sz={20}/>
            </div>})}
        </div>
      </div>}

      {/* ═══ $CHMCO ═══ */}
      {tab==="coin"&&<div className="space-y-4 max-w-2xl mx-auto">
        <div className="text-center"><div className="text-5xl" style={{animation:"sp 4s linear infinite",display:"inline-block",filter:"drop-shadow(0 0 16px #39FF1444)"}}>🌀</div>
          <h2 className="toon text-2xl sm:text-3xl glow" style={{color:"var(--g)"}}>{TOKEN.SYMBOL}</h2>
          <div className="body text-[10px] opacity-30">{TOKEN.NAME} on {TOKEN.NETWORK}</div>
          {TOKEN.CA&&<div className="mt-2 flex items-center justify-center gap-2">
            <code className="mono text-[8px] opacity-30 bg-black/20 px-2 py-1 rounded-lg">{TOKEN.CA.slice(0,6)}...{TOKEN.CA.slice(-6)}</code>
            <button onClick={copyCA} className="card px-2 py-1 rounded-lg toon text-[8px] active:scale-95 transition-all"
              style={{color:caCopied?"var(--g)":"#fff8",borderColor:caCopied?"#39FF1444":"#ffffff11"}}>
              {caCopied?"✓ Copied!":"📋 Copy CA"}</button>
          </div>}
          {!TOKEN.CA&&<div className="mt-2 card rounded-xl px-4 py-2 inline-block" style={{borderColor:"#FF073A33"}}>
            <span className="toon text-[9px]" style={{color:"#FF073A"}}>⚠️ No CA set — paste your Contract Address in TOKEN.CA</span>
          </div>}
        </div>

        {/* Live Price Card */}
        <div className="card rounded-2xl p-5 text-center" style={{borderColor:"#39FF1433"}}>
          <div className="flex items-center justify-center gap-2 mb-1">
            {tokenData.live&&<span className="w-2 h-2 rounded-full bg-green-400" style={{animation:"bob 1s infinite"}}/>}
            <span className="mono text-[8px] opacity-25">{tokenData.live?"LIVE from DexScreener":"Waiting for CA..."}</span>
          </div>
          <div className="toon text-3xl sm:text-4xl glow" style={{color:"var(--g)"}}>
            ${price>0?price.toFixed(price<0.0001?10:price<0.001?8:price<1?6:2):"0.00"}
          </div>
          <div className="flex items-center justify-center gap-3 mt-2 mono text-[9px]">
            {[{l:"5m",v:tokenData.priceChange5m},{l:"1h",v:tokenData.priceChange1h},{l:"24h",v:tokenData.priceChange24h}].map(({l,v})=>
              <span key={l} style={{color:v>=0?"var(--g)":"var(--r)",opacity:v===0?.3:1}}>
                {l}: {v>=0?"▲":"▼"}{Math.abs(v).toFixed(1)}%
              </span>)}
          </div>
          {tokenData.lastFetch&&<div className="mono text-[7px] opacity-15 mt-1">Updated: {tokenData.lastFetch}</div>}
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            {l:"Market Cap",v:fmt(tokenData.mc),ic:"💰"},
            {l:"24h Volume",v:fmt(tokenData.vol24h),ic:"📊"},
            {l:"Liquidity",v:fmt(tokenData.liq),ic:"💧"},
            {l:"WW3 Index",v:`${chaos.toFixed(1)}%`,ic:dm.ic},
          ].map(x=><div key={x.l} className="card rounded-xl p-3 text-center" style={{borderWidth:2}}>
            <span style={{fontSize:16}}>{x.ic}</span>
            <div className="toon text-sm mt-1" style={{color:"var(--g)"}}>{x.v}</div>
            <div className="mono text-[6px] opacity-20 mt-0.5">{x.l}</div>
          </div>)}
        </div>

        {/* Rick Speech */}
        <div className="card rounded-2xl p-5" style={{borderColor:"#39FF1433"}}>
          <div className="flex items-start gap-3 mb-4"><div className="shrink-0" style={{animation:"bob 2s ease-in-out infinite"}}><Av k="USA" sz={48}/></div>
            <div><div className="toon text-xs mb-1" style={{color:"#39FF14"}}>RICK C-137 SPEAKING</div>
              <p className="body text-[11px] opacity-70 leading-relaxed">Listen Morty, *burp* every civilization that achieved interdimensional travel had ONE thing in common: a currency backed by absolute chaos.</p></div></div>
          <div className="space-y-3 body text-[10px] opacity-55 leading-relaxed">
            <p>That's what {TOKEN.SYMBOL} is. While every other pathetic memecoin is backed by nothing — {TOKEN.SYMBOL} is backed by <span style={{color:"#FF073A"}}>human conflict</span>. Wars go up? Schmeckle goes up. Nuclear threats? *burp* That's a 10x.</p>
            <p>The War Engine scans real conflicts across every dimension. Every missile, every drone feeds the <span style={{color:"#FFD700"}}>Chaos Index</span>. And that index is the heartbeat of {TOKEN.SYMBOL}.</p>
          </div>
        </div>

        {/* Tokenomics — real data when available */}
        <div className="card rounded-2xl p-5" style={{borderColor:"#39FF1422"}}>
          <h3 className="toon text-sm mb-3" style={{color:"var(--g)"}}>🧪 Tokenomics</h3>
          <div className="space-y-2 mono text-[10px]">{[
            ["Token",`${TOKEN.NAME} (${TOKEN.SYMBOL})`],
            ["Network",TOKEN.NETWORK+" (SPL)"],
            ["Contract",TOKEN.CA?`${TOKEN.CA.slice(0,8)}...${TOKEN.CA.slice(-8)}`:"Not set"],
            ["Total Supply",tokenData.supply>0?fmtSupply(tokenData.supply):"—"],
            ["Market Cap",tokenData.mc>0?fmt(tokenData.mc):"—"],
            ["Liquidity",tokenData.liq>0?fmt(tokenData.liq):"—"],
            ["24h Volume",tokenData.vol24h>0?fmt(tokenData.vol24h):"—"],
            ["Tax","0% — Rick doesn't do taxes"],
            ["WW3 Index",`${chaos.toFixed(1)}% — ${dm.l}`],
          ].map(([k,v])=>
            <div key={k} className="flex justify-between py-1 border-b" style={{borderColor:"#ffffff06"}}>
              <span className="opacity-35">{k}</span><span style={{color:"var(--g)"}}>{v}</span></div>)}</div>
        </div>

        {/* Links */}
        {TOKEN.CA&&<div className="flex flex-wrap gap-2 justify-center">
          {[
            {l:"DexScreener",u:tokenData.dexUrl||`https://dexscreener.com/solana/${TOKEN.CA}`,ic:"📈"},
            {l:"Pump.fun",u:TOKEN.PUMP_FUN(TOKEN.CA),ic:"🚀"},
            {l:"Solscan",u:TOKEN.SOLSCAN(TOKEN.CA),ic:"🔍"},
            {l:"Jupiter Swap",u:TOKEN.JUPITER_SWAP(TOKEN.CA),ic:"💱"},
          ].map(x=><a key={x.l} href={x.u} target="_blank" rel="noopener noreferrer"
            className="card px-3 py-2 rounded-xl toon text-[9px] hover:scale-105 active:scale-95 transition-all"
            style={{color:"var(--g)",borderColor:"#39FF1433"}}>{x.ic} {x.l}</a>)}
        </div>}
      </div>}

      {/* ═══ SWAP — Jupiter Terminal ═══ */}
      {tab==="swap"&&<div className="max-w-md mx-auto space-y-4">
        <h2 className="toon text-base glow text-center" style={{color:"var(--g)"}}>💱 Interdimensional Swap</h2>
        {TOKEN.CA?<>
          <div className="card rounded-2xl overflow-hidden" style={{borderColor:"#39FF1433",minHeight:450}}>
            <iframe src={TOKEN.JUPITER_SWAP(TOKEN.CA)}
              title="Jupiter Swap" className="w-full border-0" style={{height:500,background:"#0a0e12"}}
              allow="clipboard-write"/>
          </div>
          <div className="text-center space-y-2">
            <div className="flex flex-wrap gap-2 justify-center">
              <a href={TOKEN.JUPITER_SWAP(TOKEN.CA)} target="_blank" rel="noopener noreferrer"
                className="card px-4 py-2.5 rounded-xl toon text-[10px] hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-1.5"
                style={{color:"#000",background:"linear-gradient(135deg,#39FF14,#00cc33)",boxShadow:"0 4px 0 #008800"}}>
                🌀 Open Jupiter Swap</a>
              <a href={TOKEN.PUMP_FUN(TOKEN.CA)} target="_blank" rel="noopener noreferrer"
                className="card px-4 py-2.5 rounded-xl toon text-[10px] hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-1.5"
                style={{color:"var(--g)",borderColor:"#39FF1444"}}>
                🚀 Buy on Pump.fun</a>
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <code className="mono text-[7px] opacity-20">{TOKEN.CA}</code>
              <button onClick={copyCA} className="mono text-[7px] px-1.5 py-0.5 rounded active:scale-95"
                style={{color:caCopied?"var(--g)":"#fff4",background:"#ffffff08"}}>{caCopied?"✓":"📋"}</button>
            </div>
          </div>
        </>:<div className="card rounded-2xl p-8 text-center" style={{borderColor:"#FF073A33"}}>
          <div className="text-3xl mb-3">🌀</div>
          <div className="toon text-sm" style={{color:"#FF073A"}}>No Contract Address Set</div>
          <div className="body text-[10px] opacity-35 mt-2 max-w-xs mx-auto">
            Launch your token on pump.fun, then paste the CA into the <code className="mono text-[8px] px-1 py-0.5 rounded" style={{background:"#ffffff08"}}>TOKEN.CA</code> field at the top of the code.
          </div>
          <div className="mono text-[8px] opacity-15 mt-4">The swap widget, live price, market cap, volume and supply will all connect automatically.</div>
        </div>}
      </div>}
    </main>

    {/* ═══ RICK TOAST ═══ */}
    {atk&&<div key={atk.key} className="fixed bottom-4 left-1/2 z-50 pointer-events-none" style={{transform:"translateX(-50%)",animation:"popIn .3s ease"}}>
      <div className="card flex items-center gap-3 px-4 py-3 rounded-2xl" style={{maxWidth:"92vw",borderColor:"#39FF1455",boxShadow:"0 4px 0 #006600, 0 0 30px #39FF1433"}}>
        <div style={{animation:"rickWobble .3s ease-in-out infinite",filter:"drop-shadow(0 2px 0 #000)"}}>
          <Av k={atk.attacker} sz={36}/>
        </div>
        <div className="min-w-0"><div className="toon text-xs sm:text-sm glow" style={{color:"#39FF14"}}>{rickLine||"WUBBA LUBBA DUB DUB!"}</div>
          <div className="mono text-[8px] opacity-35 truncate">{N[atk.attacker]?.c} ⚔️ {N[atk.target]?.c}</div></div>
        <div style={{animation:"rickWobble .4s ease-in-out infinite",filter:"drop-shadow(0 2px 0 #000)"}}>
          <Av k={atk.target} sz={30}/>
        </div>
      </div>
    </div>}

    {/* ═══ LEVEL UP POPUP ═══ */}
    {lvlUp&&<div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none" style={{background:"rgba(0,0,0,.5)"}}>
      <div className="card p-6 rounded-2xl text-center" style={{animation:"popIn .4s ease",borderColor:N[lvlUp.k]?.cl+"66",boxShadow:`0 0 60px ${N[lvlUp.k]?.cl}33`}}>
        <div className="mb-2" style={{animation:"lvlUp 1s ease infinite",display:"inline-block"}}><Av k={lvlUp.k} sz={60}/></div>
        <div className="toon text-xl" style={{color:N[lvlUp.k]?.cl}}>{N[lvlUp.k]?.c}</div>
        <div className="toon text-base mt-1" style={{color:lvlUp.evo.border}}>EVOLVED TO: {lvlUp.evo.title}!</div>
        <div className="mono text-[9px] opacity-30 mt-2">{N[lvlUp.k]?.c} — Power increased</div>
      </div>
    </div>}

    <footer className="relative z-10 mt-8 px-4 py-4 text-center" style={{borderTop:"3px solid var(--bdr)"}}>
      <div className="mono text-[6px] opacity-10">SCHMECKLE WARS v8 • Real Wars • Persistent Evolution • $CHMCO on Solana</div>
    </footer>

    {/* MODAL */}
    {sel&&(()=>{const n=N[sel],s=stats[sel],evo=getEvo(s?.xp||0);
      return <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{background:"rgba(0,0,0,.75)",backdropFilter:"blur(12px)"}} onClick={()=>setSel(null)}>
        <div className="w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl relative max-h-[88vh] overflow-y-auto card p-5" style={{borderColor:n.cl+"33",animation:"popIn .3s ease"}} onClick={e=>e.stopPropagation()}>
          <button onClick={()=>setSel(null)} className="absolute top-3 right-3 card w-8 h-8 rounded-full flex items-center justify-center text-xs opacity-40 hover:opacity-100" style={{borderWidth:2}}>✕</button>
          <div className="text-center mb-4">
            <Av k={sel} sz={72} st={{margin:"0 auto",boxShadow:`0 4px 0 ${n.cl}33, 0 0 30px ${n.cl}22`}}/>
            <h3 className="toon text-xl mt-2" style={{color:n.cl}}>{n.c}</h3>
            <div className="body text-sm opacity-30">{n.e} {n.n}</div>
            <div className="flex justify-center gap-2 mt-1.5">
              <span className="toon text-[8px] px-2 py-0.5 rounded-full" style={{background:n.cl+"15",color:n.cl,border:`2px solid ${n.cl}33`}}>{n.rl}</span>
              <span className="toon text-[8px] px-2 py-0.5 rounded-full" style={{background:evo.border+"15",color:evo.border,border:`2px solid ${evo.border}33`}}>{evo.badge} {evo.title}</span>
            </div>
            <div className="mono text-[8px] opacity-20 mt-1">XP: {s?.xp||0}</div>
          </div>
          <p className="body text-[10px] opacity-40 mb-3 text-center">{n.d}</p>
          <div className="space-y-1.5 mb-4">{Object.entries(SM).map(([k,v])=><Bar key={k} l={`${v.i} ${v.l}`} v={s?.[k]||0} c={v.c}/>)}</div>
          <div className="grid grid-cols-2 gap-2">{[{l:"Ops",v:s?.kills||0,c:"var(--g)"},{l:"XP",v:s?.xp||0,c:"var(--y)"},{l:"Hits",v:s?.hits||0,c:"var(--r)"},{l:"Level",v:evo.title,c:evo.border}].map(x=>
            <div key={x.l} className="card rounded-xl p-2.5 text-center" style={{borderWidth:2}}>
              <div className="toon text-lg" style={{color:x.c}}>{x.v}</div><div className="mono text-[6px] opacity-20">{x.l}</div></div>)}</div>
          {evts.filter(e=>e.attacker===sel||e.target===sel).length>0&&
            <div className="mt-4"><h4 className="toon text-[9px] opacity-30 mb-1.5">Battle History <span className="opacity-50">(click to read)</span></h4>
              <div className="space-y-1 max-h-28 overflow-y-auto">{evts.filter(e=>e.attacker===sel||e.target===sel).slice(0,6).map(e=>
                <div key={e.id} className="news-link mono text-[7px] py-1 border-b flex gap-1.5 items-center" style={{borderColor:"#ffffff06"}}
                  onClick={(ev)=>{ev.stopPropagation();const link=e.url||e.searchUrl;if(link)window.open(link,"_blank","noopener,noreferrer")}}>
                  <span style={{color:e.attacker===sel?"var(--g)":"var(--r)"}}>{e.attacker===sel?"⚡":"💥"}</span>
                  <span className="opacity-30 flex-1 truncate">{e.text}</span>
                  <span className="link-icon shrink-0" style={{fontSize:8}}>🔗</span></div>)}</div></div>}
        </div>
      </div>})()}
  </div>
}
