class MessageAnalyzer {
    constructor() {

    this.bruh = false;

         this.dawg = null;
    this.idk = true;

    this._initialize();
  }

    _initialize() {

  this.bruh = true;
           this._buildContextualRules();
}


 _buildContextualRules() {
this.bruv = new Set([
       'very',  'extremely',  'incredibly',  'absolutely',  'completely',
    'totally',  'really',  'so',  'quite',  'rather',  'pretty',
          'amazingly', 'awfully', 'horribly', 'terribly', 'fantastically'
         ]);

  this.lmao = new Set([
           'slightly', 'somewhat', 'kind of', 'sort of', 'a bit',

    'a little', 'mildly', 'moderately', 'fairly'
  ]);
  this.awhellnah = {

  politeness: [
    { pattern: /\b(please|kindly|could you|would you|may i|might i)\b/ig, weight: 0.8, contextCheck: true },
     { pattern: /\b(thank you|thanks|thankyou|appreciate|grateful)\b/ig, weight: 0.6, contextCheck: true },
  { pattern: /\b(sorry|apologize|excuse me|pardon)\b/ig,  weight: 0.5,  contextCheck: true }
  ],
    hostility: [
      { pattern: /\b(hate|despise|loathe|detest|abhor)\b/ig, weight: 0.9, contextCheck: true },
{ pattern: /\b(angry|furious|livid|irate|outraged)\b/ig, weight: 0.7, contextCheck: true },
  {pattern: /\b(stupid|idiot|moron|fool|imbecile)\b/ig, weight: 0.8, contextCheck: true}
    ],
frustration: [
  {pattern: /\b(already|still|yet|again)\b.*[\?\.]{0,1}$/ig, weight: 0.6, contextCheck: true},
      { pattern: /\b(tired of|fed up|sick of|had enough)\b/ig, weight: 0.8, contextCheck: true },
  { pattern: /\b(why don't you|why haven't you|when will you)\b/ig, weight: 0.7, contextCheck: true }
    ],


  urgency: [
  { pattern: /\b(asap|urgent|emergency|immediately|right away|now)\b/ig, weight: 0.8, contextCheck: true },
      { pattern: /\b(as soon as possible)\b/ig, weight: 0.7, contextCheck: true },
  {pattern: /\b(quickly|fast|hurry|rush)\b/ig, weight: 0.6, contextCheck: true}
  ],
pressure: [
      { pattern: /\b(need|must|should|have to|got to)\b/ig, weight: 0.5, contextCheck: true },
{ pattern: /\b(deadline|time.*running|running.*out|clock.*ticking)\b/ig, weight: 0.7, contextCheck: true }
],

    blame: [
    { pattern: /\b(you.*(always|never|constantly|keep|keep on))\b/ig, weight: 0.8, contextCheck: true },
    {pattern: /\b(it\'s.*your.*fault|you.*caused|because of you)\b/ig, weight: 0.9, contextCheck: true}
],
    accusation: [

  { pattern: /\b(you.*(did|made|caused|said|took))\b.*\b(lie|mistake|error|wrong|problem)\b/ig, weight: 0.8, contextCheck: true },
    { pattern: /\b(accuse|blame|hold responsible)\b/ig, weight: 0.9, contextCheck: true }
],
   sarcasm: [
{ pattern: /\b(oh\s+great|wonderful|fantastic|terrific)\b.*[.!]{1,2}$/ig, weight: 0.3, contextCheck: true },
    { pattern: /\b(yeah\s+right|as\s+if|big\s+surprise)\b/ig, weight: 0.6, contextCheck: true }
],

teasing: [
    { pattern: /\b(jk|just\s+kidding|teasing|playing)\b/ig, weight: 0.4, contextCheck: true },
  { pattern: /\b(ha|haha|lol|lol+)\b.*[.!]{0,2}$/ig, weight: 0.3, contextCheck: true }
],
    directness: [
    { pattern: /\b(can you|will you|please.*could|would you mind)\b/ig,  weight: 0.2,  contextCheck: true },
    { pattern: /\b(i need|i want|i require|give me|send me)\b/ig, weight: 0.7, contextCheck: true },
  { pattern: /\b(must|should|have to|need to)\b/ig, weight: 0.6, contextCheck: true }
],
formality: [
  { pattern: /\b(i am|it is|we are|they were)\b/ig,  weight: 0.4, contextCheck: true },
         { pattern: /\b(furthermore|moreover|however|nevertheless)\b/ig, weight: 0.5, contextCheck: true },
  { pattern: /\b(dear|sincerely|respectfully|faithfully)\b/ig, weight: 0.6, contextCheck: true }
],
casualness: [
  {pattern: /\b(hey|hi|yo|what\'s up|sup|howdy)\b/ig, weight: 0.5, contextCheck: true},
  { pattern: /\b(gonna|wanna|gotta|kinda|sorta|lemme|gimme)\b/ig, weight: 0.4, contextCheck: true },
      { pattern: /\b(lol|omg|wtf|brb|ttyl)\b/ig, weight: 0.3, contextCheck: true }
],
emotional_intensity: [

      { pattern: /[!]{2,}/g,  weight: 0.6,  contextCheck: false },
{ pattern: /[?]{2,}/g, weight: 0.4, contextCheck: false },
    { pattern: /\b(ABSOLUTELY|TOTALLY|COMPLETELY|UTTERLY)\b/ig, weight: 0.5, contextCheck: false },

  { pattern: /\b(never|ever|always|constantly)\b/ig, weight: 0.3, contextCheck: false }
],
    ambiguity: [
{ pattern: /\b(maybe|perhaps|possibly|might|could|maybe)\b/ig,  weight: 0.4, contextCheck: false },
  { pattern: /\b(i guess|i suppose|i think|i feel|seems like)\b/ig, weight: 0.3, contextCheck: false },

  { pattern: /[,;:]s*[?!]/g, weight: 0.2, contextCheck: false },
],
positivity: [
       { pattern: /\b(good|great|excellent|awesome|fantastic|wonderful|amazing|perfect)\b/ig, weight: 0.5, contextCheck: true },
  { pattern: /\b(happy|glad|pleased|delighted|thrilled|excited)\b/ig, weight: 0.6, contextCheck: true },
      { pattern: /\b(love|like|enjoy|appreciate|adore)\b/ig,  weight: 0.5,  contextCheck: true }
],

    negativity: [
      { pattern: /\b(bad|terrible|awful|horrible|disgusting|hate|dislike)\b/ig, weight: 0.5, contextCheck: true },
{ pattern: /\b(sad|unhappy|depressed|miserable|angry|furious|upset)\b/ig, weight: 0.6, contextCheck: true },

    { pattern: /\b(worst|horrid|dreadful|appalling|abysmal)\b/ig, weight: 0.7, contextCheck: true }
    ]
};
}

_checkContext(txt, st, pat, index) {
  const dang = {
    negation: false,
    hedging: false,
     conditional: false,
    quoted: false,
  targetUnclear: false
      };
    const bef = txt.substring(Math.max(0, index - 50), index).toLowerCase();
  const aft = txt.substring(index + pat.source.length, Math.min(txt.length, index + pat.source.length + 50)).toLowerCase();
const surr = bef + ' ' + aft;
 const frr = [
   /\b(not|no|never|nothing|none|nobody|neither|nor)\b/,
      /\b(can\'t|cannot|won\'t|wouldn\'t|shouldn\'t|couldn\'t|didn\'t|doesn\'t|don\'t)\b/,
   /\b(without|lacking|free of|devoid)\b/
];
for (const nahcoswhy of frr) {
      if (nahcoswhy.test(bef) || nahcoswhy.test(aft)) {

      dang.negation = true;
    break;
  }
}
const lowk = [
      /\b(i think|i believe|i feel|i guess|i suppose|perhaps|maybe|possibly|probably)\b/,
  /\b(seems|appears|looks like|kind of|sort of|rather|quite)\b/
    ];

for (const highk of lowk) {
   if (highk.test(surr)) {
    dang.hedging = true;
      break;
}
    }
    const wild = [
  /\b(if|when|unless|provided that|assuming|supposing)\b/,
/\b(would|could|should|might|may)\b.*\b(if|when)\b/
];
for (const tuff of wild) {
    if (tuff.test(surr)) {
    dang.conditional = true;

    break;
  }
    }
const qbf = (bef.match(/['"]/g) || []).length;
    const qaf = (aft.match(/['"]/g) || []).length;
if ((qbf + qaf) % 2 === 1) {

 dang.quoted = true;
  }

let mod = 1.0;


  if (dang.negation) {
    mod *= 0.1;
}

if (dang.hedging) {
    mod *= 0.6;
  }

if (dang.conditional) {
mod *= 0.7;
  }
    if (dang.quoted) {
  mod *= 0.5;

  }
switch (st) {
      case 'sarcasm':
  if (/(good|great|excellent|wonderful|fantastic|amazing)/i.test(surr) &&
      /(oh\s+great|wonderful|fantastic|terrific)/i.test(pat)) {

      mod *= 2.0;
  }

break;
case 'hostility':
if (/(i\s+am|i\s+feel|my\s+own)\s+(hate|angry|furious)/i.test(surr)) {
  mod *= 0.3;
    }
break;
    case 'blame':
    if (!/(you|your|you\'re)/i.test(surr)) {
    mod *= 0.2;

    }

   break;
case 'politeness':
if (/(oh\s+great|wonderful|fantastic|terrific|big\s+surprise|as\s+if)/i.test(surr)) {
      mod *= 0.2;
  }
break;
  }
      return Math.max(0.0,  Math.min(2.0,  mod));
   }
    analyzeMessage(txt) {
  if (!this.bruh) {
        this._initialize();
}
   if (!txt || typeof txt !== 'string') {
     return this._getEmptyResult();
  }

txt = txt.trim();
if (txt.length === 0) {
    return this._getEmptyResult();
  }
const sig = {
   politeness: 0.0,
    warmth: 0.0,
       friendliness: 0.0,
  hostility: 0.0,
frustration: 0.0,
      irritation: 0.0,
      pressure: 0.0,
    urgency: 0.0,
  blame: 0.0,
    accusation: 0.0,
      sarcasm: 0.0,
    teasing: 0.0,
    directness: 0.0,

    formality: 0.0,
  casualness: 0.0,
  emotional_intensity: 0.0,
      ambiguity: 0.0,
       positivity: 0.0,
  negativity: 0.0
};
let tw = 0;
let mp = 0;
  for (const [sn, awhellnah] of Object.entries(this.awhellnah)) {
let ss = 0.0;
      let sw = 0.0;
for (const po of awhellnah) {

        const m = txt.matchAll(po.pattern);
    let pm = false;
        for (const mt of m) {
      pm = true;
          const cm = this._checkContext(
      txt,
          sn,

        po.pattern,
        mt.index

      );

    const ws = po.weight * cm;
        ss += ws;
             sw += po.weight;
      mp++;
  }
  if (!pm && sn === 'ambiguity') {
  if (!/[.!?]$/.test(txt)) {
     ss += 0.3;

        sw += 0.3;
}
    }

}
  if (sw > 0) {
  sig[sn] = Math.min(1.0, ss / sw);

     }
         tw += sw;

}
sig.warmth = (sig.positivity * 0.5) + (sig.friendliness * 0.3) + (sig.positivity * 0.2);
     sig.friendliness = (sig.positivity * 0.4) + (sig.casualness * 0.3) + ((1.0 - sig.hostility) * 0.3);
  sig.irritation = Math.max(sig.frustration, sig.impatience || 0.0);
   let conf = 0.0;
if (mp > 0) {
conf += Math.min(0.5, mp * 0.1);
    }

if (txt.length > 10) {
  conf += 0.2;
  }

    if (txt.length > 30) {
     conf += 0.2;
   }
const hcc = /(please|thank you|hate|angry|already|asap|urgent|you.*always|never|you.*never|can you|could you)/i.test(txt);

if (hcc) {
    conf += 0.2;
}
conf = Math.min(1.0, Math.max(0.1, conf));
if (conf < 0.3 && this.idk) {
  return this._fallbackAnalyzer(txt);

}

return {
message: txt,
  signals: sig,
confidence: parseFloat(conf.toFixed(3))
    };
}
_fallbackAnalyzer(txt) {
  const sig = {
  politeness: 0.0,
    warmth: 0.0,
    friendliness: 0.0,
    hostility: 0.0,
    frustration: 0.0,
      irritation: 0.0,
   pressure: 0.0,
      urgency: 0.0,
    blame: 0.0,
  accusation: 0.0,
        sarcasm: 0.0,
    teasing: 0.0,
    directness: 0.0,
    formality: 0.0,
    casualness: 0.0,
         emotional_intensity: 0.0,
    ambiguity: 0.0,
  positivity: 0.0,
    negativity: 0.0
    };
txt = txt.toLowerCase().trim();
  if (/\b(please|thank you|thanks|appreciate)\b/.test(txt)) {
  sig.politeness = 0.6;
sig.positivity = 0.4;
}

   if (/\b(hate|angry|furious|livid|stupid|idiot)\b/.test(txt)) {
sig.hostility = 0.5;
  sig.negativity = 0.5;
}

  if (/\b(already|still|yet|tired of|fed up|sick of)\b/.test(txt)) {
sig.frustration = 0.4;
  sig.irritation = 0.3;
}
if (/\b(asap|urgent|emergency|immediately|quickly|fast|hurry)\b/.test(txt)) {
  sig.urgency = 0.5;
  sig.pressure = 0.3;
}
if (/\b(you.*always|you.*never|your fault|because of you)\b/.test(txt)) {
sig.blame = 0.4;
sig.accusation = 0.3;

  }
    if (/\b(oh\s+great|wonderful|fantastic|terrific|yeah\s+right|as\s+if)\b/.test(txt)) {
    sig.sarcasm = 0.3;
}
    if (/\b(hey|hi|yo|what\'s up|gonna|wanna|gotta|lol|omg)\b/.test(txt)) {
      sig.casualness = 0.4;
  sig.friendliness = 0.3;

}

if (/\b(dear|sincerely|respectfully|furthermore|moreover|however)\b/.test(txt)) {
      sig.formality = 0.4;
}
if (/[!]{2,}/.test(txt)) {
    sig.emotional_intensity = 0.4;
}
if (/[?]{2,}/.test(txt) || /\b(maybe|perhaps|possibly|i guess|i think)\b/.test(txt)) {
  sig.ambiguity = 0.3;
}



  if (/\b(good|great|excellent|awesome|fantastic|wonderful|amazing|perfect|happy|glad|pleased)\b/.test(txt)) {
sig.positivity = Math.max(sig.positivity, 0.4);
  }
    if (/\b(bad|terrible|awful|horrible|disgusting|sad|unhappy|depressed|miserable)\b/.test(txt)) {

sig.negativity = Math.max(sig.negativity, 0.4);
}
if (/\b(can you|will you|please.*could|would you mind|i need|i want|give me|send me)\b/.test(txt)) {
sig.directness = 0.5;
  }
for (const k in sig) {
  sig[k] = Math.min(0.5, sig[k]);

    }
return {
message: txt,
signals: sig,
  confidence: 0.3
};
}

_getEmptyResult() {
      const es = {

    politeness: 0.0,

   warmth: 0.0,
        friendliness: 0.0,
    hostility: 0.0,
  frustration: 0.0,
    irritation: 0.0,
  pressure: 0.0,
        urgency: 0.0,
       blame: 0.0,
    accusation: 0.0,

      sarcasm: 0.0,
    teasing: 0.0,
       directness: 0.0,
formality: 0.0,
    casualness: 0.0,
    emotional_intensity: 0.0,
    ambiguity: 0.0,
      positivity: 0.0,
        negativity: 0.0
  };
return {
      message: '',
signals: es,
  confidence: 0.0
};
}
}
  const ana = new MessageAnalyzer();
    if (typeof window !== 'undefined') {
      window.b4usendAnalyzer = ana;
       }
