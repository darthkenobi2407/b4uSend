class MessageAnalyzer {
    constructor() {
    this.initialized = false;
  this.model = null;
    this.fallbackEnabled = true;

  this._initialize();
      }


      _initialize() {

    this.initialized = true;

        this._buildContextualRules();
  }


  _buildContextualRules() {

    this.intensifiers = new Set([
          'very',  'extremely',  'incredibly',  'absolutely',  'completely',
    'totally', 'really', 'so', 'quite', 'rather', 'pretty',
      'amazingly', 'awfully', 'horribly', 'terribly', 'fantastically'
      ]);

        this.diminishers = new Set([
    'slightly',  'somewhat',  'kind of',  'sort of',  'a bit',
          'a little', 'mildly', 'moderately', 'fairly'
  ]);

    this.patterns = {

    politeness: [
        { pattern: /\b(please|kindly|could you|would you|may i|might i)\b/ig, weight: 0.8, contextCheck: true },
        { pattern: /\b(thank you|thanks|thankyou|appreciate|grateful)\b/ig, weight: 0.6, contextCheck: true },
        { pattern: /\b(sorry|apologize|excuse me|pardon)\b/ig,  weight: 0.5,  contextCheck: true }
          ],

        hostility: [
        { pattern: /\b(hate|despise|loathe|detest|abhor)\b/ig, weight: 0.9, contextCheck: true },
        { pattern: /\b(angry|furious|livid|irate|outraged)\b/ig, weight: 0.7, contextCheck: true },
        { pattern: /\b(stupid|idiot|moron|fool|imbecile)\b/ig, weight: 0.8, contextCheck: true }
        ],

    frustration: [
      { pattern: /\b(already|still|yet|again)\b.*[\?\.]{0,1}$/ig, weight: 0.6, contextCheck: true },
        { pattern: /\b(tired of|fed up|sick of|had enough)\b/ig, weight: 0.8, contextCheck: true },
          { pattern: /\b(why don't you|why haven't you|when will you)\b/ig, weight: 0.7, contextCheck: true }
    ],

        urgency: [
            { pattern: /\b(asap|urgent|emergency|immediately|right away|now)\b/ig, weight: 0.8, contextCheck: true },
          { pattern: /\b(as soon as possible)\b/ig, weight: 0.7, contextCheck: true },
        { pattern: /\b(quickly|fast|hurry|rush)\b/ig,  weight: 0.6,  contextCheck: true }
      ],

        pressure: [
        { pattern: /\b(need|must|should|have to|got to)\b/ig, weight: 0.5, contextCheck: true },
        { pattern: /\b(deadline|time.*running|running.*out|clock.*ticking)\b/ig, weight: 0.7, contextCheck: true }
    ],

      blame: [
      { pattern: /\b(you.*(always|never|constantly|keep|keep on))\b/ig, weight: 0.8, contextCheck: true },
        { pattern: /\b(it\'s.*your.*fault|you.*caused|because of you)\b/ig, weight: 0.9, contextCheck: true }
      ],

          accusation: [
        { pattern: /\b(you.*(did|made|caused|said|took))\b.*\b(lie|mistake|error|wrong|problem)\b/ig, weight: 0.8, contextCheck: true },
        { pattern: /\b(accuse|blame|hold responsible)\b/ig,  weight: 0.9,  contextCheck: true }
        ],
      sarcasm: [
        { pattern: /\b(oh\s+great|wonderful|fantastic|terrific)\b.*[.!]{1,2}$/ig, weight: 0.3, contextCheck: true },
      { pattern: /\b(yeah\s+right|as\s+if|big\s+surprise)\b/ig, weight: 0.6, contextCheck: true }
        ],

    teasing: [
        { pattern: /\b(jk|just\s+kidding|teasing|playing)\b/ig,  weight: 0.4,  contextCheck: true },
          { pattern: /\b(ha|haha|lol|lol+)\b.*[.!]{0,2}$/ig, weight: 0.3, contextCheck: true }
        ],

      directness: [
      { pattern: /\b(can you|will you|please.*could|would you mind)\b/ig, weight: 0.2, contextCheck: true },
        { pattern: /\b(i need|i want|i require|give me|send me)\b/ig, weight: 0.7, contextCheck: true },
            { pattern: /\b(must|should|have to|need to)\b/ig, weight: 0.6, contextCheck: true }
          ],

      formality: [
        { pattern: /\b(i am|it is|we are|they were)\b/ig, weight: 0.4, contextCheck: true },
          { pattern: /\b(furthermore|moreover|however|nevertheless)\b/ig, weight: 0.5, contextCheck: true },
            { pattern: /\b(dear|sincerely|respectfully|faithfully)\b/ig,  weight: 0.6,  contextCheck: true }
        ],

        casualness: [
      {pattern: /\b(hey|hi|yo|what\'s up|sup|howdy)\b/ig,  weight: 0.5,  contextCheck: true},
      { pattern: /\b(gonna|wanna|gotta|kinda|sorta|lemme|gimme)\b/ig,  weight: 0.4,  contextCheck: true },
      { pattern: /\b(lol|omg|wtf|brb|ttyl)\b/ig, weight: 0.3, contextCheck: true }
    ],

    emotional_intensity: [
            { pattern: /[!]{2,}/g,  weight: 0.6,  contextCheck: false },
            { pattern: /[?]{2,}/g, weight: 0.4, contextCheck: false },
            { pattern: /\b(ABSOLUTELY|TOTALLY|COMPLETELY|UTTERLY)\b/ig, weight: 0.5, contextCheck: false },
          { pattern: /\b(never|ever|always|constantly)\b/ig,  weight: 0.3,  contextCheck: false }
      ],

      ambiguity: [
        { pattern: /\b(maybe|perhaps|possibly|might|could|maybe)\b/ig, weight: 0.4, contextCheck: false },
      { pattern: /\b(i guess|i suppose|i think|i feel|seems like)\b/ig, weight: 0.3, contextCheck: false },
        { pattern: /[,;:]s*[?!]/g, weight: 0.2, contextCheck: false },
        ],

      positivity: [
      { pattern: /\b(good|great|excellent|awesome|fantastic|wonderful|amazing|perfect)\b/ig, weight: 0.5, contextCheck: true },
        { pattern: /\b(happy|glad|pleased|delighted|thrilled|excited)\b/ig, weight: 0.6, contextCheck: true },
        { pattern: /\b(love|like|enjoy|appreciate|adore)\b/ig, weight: 0.5, contextCheck: true }
    ],

          negativity: [
          { pattern: /\b(bad|terrible|awful|horrible|disgusting|hate|dislike)\b/ig, weight: 0.5, contextCheck: true },
          { pattern: /\b(sad|unhappy|depressed|miserable|angry|furious|upset)\b/ig, weight: 0.6, contextCheck: true },
        { pattern: /\b(worst|horrid|dreadful|appalling|abysmal)\b/ig, weight: 0.7, contextCheck: true }
      ]
        };
    }

    _checkContext(text, signalType, pattern, index) {
      const context = {
      negation: false,
    hedging: false,
        conditional: false,
      quoted: false,
    targetUnclear: false
  };

        const before = text.substring(Math.max(0, index - 50), index).toLowerCase();
      const after = text.substring(index + pattern.source.length,  Math.min(text.length,  index + pattern.source.length + 50)).toLowerCase();
        const surrounding = before + ' ' + after;

    const negationPatterns = [
      /\b(not|no|never|nothing|none|nobody|neither|nor)\b/,
      /\b(can\'t|cannot|won\'t|wouldn\'t|shouldn\'t|couldn\'t|didn\'t|doesn\'t|don\'t)\b/,
      /\b(without|lacking|free of|devoid)\b/
  ];
      for (const negPattern of negationPatterns) {
        if (negPattern.test(before) || negPattern.test(after)) {
            context.negation = true;
        break;
      }
  }
      const hedgingPatterns = [
      /\b(i think|i believe|i feel|i guess|i suppose|perhaps|maybe|possibly|probably)\b/,
        /\b(seems|appears|looks like|kind of|sort of|rather|quite)\b/
  ];

        for (const hedgePattern of hedgingPatterns) {
          if (hedgePattern.test(surrounding)) {
      context.hedging = true;
      break;
      }
    }

    const conditionalPatterns = [
    /\b(if|when|unless|provided that|assuming|supposing)\b/,
      /\b(would|could|should|might|may)\b.*\b(if|when)\b/
  ];
  for (const condPattern of conditionalPatterns) {
      if (condPattern.test(surrounding)) {
        context.conditional = true;
        break;
    }
        }

    const quoteCountBefore = (before.match(/['"]/g) || []).length;
        const quoteCountAfter = (after.match(/['"]/g) || []).length;
    if ((quoteCountBefore + quoteCountAfter) % 2 === 1) {
      context.quoted = true;
  }

        let modifier = 1.0;

      if (context.negation) {
      modifier *= 0.1;
  }

    if (context.hedging) {
        modifier *= 0.6;
  }
    if (context.conditional) {
      modifier *= 0.7;
    }

  if (context.quoted) {
          modifier *= 0.5;
        }

        switch (signalType) {
      case 'sarcasm':
          if (/(good|great|excellent|wonderful|fantastic|amazing)/i.test(surrounding) &&
          /(oh\s+great|wonderful|fantastic|terrific)/i.test(pattern)) {
          modifier *= 2.0;
          }
          break;

        case 'hostility':

        if (/(i\s+am|i\s+feel|my\s+own)\s+(hate|angry|furious)/i.test(surrounding)) {
        modifier *= 0.3;
        }
        break;

    case 'blame':

        if (!/(you|your|you\'re)/i.test(surrounding)) {
        modifier *= 0.2;
        }
      break;

        case 'politeness':

        if (/(oh\s+great|wonderful|fantastic|terrific|big\s+surprise|as\s+if)/i.test(surrounding)) {
        modifier *= 0.2;
          }
            break;
        }
  return Math.max(0.0,  Math.min(2.0,  modifier));
  }


  analyzeMessage(text) {
      if (!this.initialized) {
      this._initialize();
      }

  if (!text || typeof text !== 'string') {
        return this._getEmptyResult();
    }

    text = text.trim();
    if (text.length === 0) {
          return this._getEmptyResult();
    }
        const signals = {
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

    let totalWeight = 0;
    let matchedPatterns = 0;

    for (const [signalName, patterns] of Object.entries(this.patterns)) {
      let signalScore = 0.0;
        let signalWeight = 0.0;

      for (const patternObj of patterns) {
            const matches = text.matchAll(patternObj.pattern);
        let patternMatched = false;

        for (const match of matches) {
              patternMatched = true;
        const contextModifier = this._checkContext(
            text,
            signalName,
            patternObj.pattern,
          match.index
          );

          const weightedScore = patternObj.weight * contextModifier;
              signalScore += weightedScore;
          signalWeight += patternObj.weight;
        matchedPatterns++;
            }

        if (!patternMatched && signalName === 'ambiguity') {

            if (!/[.!?]$/.test(text)) {
            signalScore += 0.3;
          signalWeight += 0.3;
        }
          }
      }

      if (signalWeight > 0) {
          signals[signalName] = Math.min(1.0, signalScore / signalWeight);
        }
      totalWeight += signalWeight;
  }

        signals.warmth = (signals.positivity * 0.5) + (signals.friendliness * 0.3) + (signals.positivity * 0.2);
        signals.friendliness = (signals.positivity * 0.4) + (signals.casualness * 0.3) + ((1.0 - signals.hostility) * 0.3);
    signals.irritation = Math.max(signals.frustration,  signals.impatience || 0.0);




    let confidence = 0.0;

  if (matchedPatterns > 0) {
    confidence += Math.min(0.5, matchedPatterns * 0.1);
  }

    if (text.length > 10) {
          confidence += 0.2;
    }

        if (text.length > 30) {
      confidence += 0.2;
        }
  const hasClearContext = /(please|thank you|hate|angry|already|asap|urgent|you.*always|never|you.*never|can you|could you)/i.test(text);
        if (hasClearContext) {
      confidence += 0.2;
  }

    confidence = Math.min(1.0,  Math.max(0.1,  confidence));
      if (confidence < 0.3 && this.fallbackEnabled) {
      return this._fallbackAnalyzer(text);
    }

    return {
      message: text,
      signals: signals,
          confidence: parseFloat(confidence.toFixed(3))
    };
    }


      _fallbackAnalyzer(text) {
    const signals = {
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

  text = text.toLowerCase().trim();

  if (/\b(please|thank you|thanks|appreciate)\b/.test(text)) {
    signals.politeness = 0.6;
      signals.positivity = 0.4;
      }

  if (/\b(hate|angry|furious|livid|stupid|idiot)\b/.test(text)) {
      signals.hostility = 0.5;
      signals.negativity = 0.5;
        }

    if (/\b(already|still|yet|tired of|fed up|sick of)\b/.test(text)) {
        signals.frustration = 0.4;
      signals.irritation = 0.3;
        }

    if (/\b(asap|urgent|emergency|immediately|quickly|fast|hurry)\b/.test(text)) {
          signals.urgency = 0.5;
    signals.pressure = 0.3;
    }
    if (/\b(you.*always|you.*never|your fault|because of you)\b/.test(text)) {
        signals.blame = 0.4;
        signals.accusation = 0.3;
        }

    if (/\b(oh\s+great|wonderful|fantastic|terrific|yeah\s+right|as\s+if)\b/.test(text)) {
      signals.sarcasm = 0.3;
        }

    if (/\b(hey|hi|yo|what\'s up|gonna|wanna|gotta|lol|omg)\b/.test(text)) {
      signals.casualness = 0.4;
          signals.friendliness = 0.3;
    }
    if (/\b(dear|sincerely|respectfully|furthermore|moreover|however)\b/.test(text)) {
    signals.formality = 0.4;
    }

    if (/[!]{2,}/.test(text)) {
      signals.emotional_intensity = 0.4;
    }

    if (/[?]{2,}/.test(text) || /\b(maybe|perhaps|possibly|i guess|i think)\b/.test(text)) {
      signals.ambiguity = 0.3;
    }

      if (/\b(good|great|excellent|awesome|fantastic|wonderful|amazing|perfect|happy|glad|pleased)\b/.test(text)) {
      signals.positivity = Math.max(signals.positivity, 0.4);
    }

    if (/\b(bad|terrible|awful|horrible|disgusting|sad|unhappy|depressed|miserable)\b/.test(text)) {
          signals.negativity = Math.max(signals.negativity, 0.4);
    }

    if (/\b(can you|will you|please.*could|would you mind|i need|i want|give me|send me)\b/.test(text)) {
      signals.directness = 0.5;
      }

    for (const key in signals) {
      signals[key] = Math.min(0.5,  signals[key]);
    }

    return {
      message: text,
          signals: signals,
          confidence: 0.3
      };
  }


    _getEmptyResult() {
    const emptySignals = {
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
      signals: emptySignals,
          confidence: 0.0
      };
    }
}
const analyzer = new MessageAnalyzer();

if (typeof window !== 'undefined') {
      window.b4usendAnalyzer = analyzer;
  }



let analyzerInstance = null;

try {
analyzerInstance = new MessageAnalyzer();
console.log('b4usend analyzer initialized');
} catch (error) {
console.error('Failed to initialize analyzer:', error);
}

    chrome.runtime.onMessage.addListener((request,  sender,  sendResponse) => {
  if (request.action === 'analyzeMessage') {
    if (!analyzerInstance) {
      sendResponse({ success: false, error: 'Analyzer not initialized' });
      return false;
  }

    try {
      Promise.resolve(analyzerInstance.analyzeMessage(request.text))
      .then(result => sendResponse({ success: true, result }))
        .catch(error => sendResponse({ success: false,  error: error.message }));
    } catch (error) {
    sendResponse({ success: false, error: error.message });
    }

    return true;
  }

  if (request.action === 'getAnalyzerStatus') {
    sendResponse({
    initialized: !!analyzerInstance,
          version: '1.0.0'
    });
        return false;
    }

    return false;
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    enabled: true,
  sensitivity: 'medium',
      showNotifications: true
    });
    });

chrome.contextMenus.create({
    id: 'analyze-selection',
    title: 'Analyze selected text with b4usend',
    contexts: ['selection']
  }, () => {
      if (chrome.runtime.lastError) {
  console.debug('Context menu setup:', chrome.runtime.lastError.message);
      }
});

chrome.contextMenus.onClicked.addListener((info,  tab) => {
  if (info.menuItemId !== 'analyze-selection' || !info.selectionText || !tab?.id) {
    return;
  }

    if (!analyzerInstance) {
        return;
  }
    try {
        const result = analyzerInstance.analyzeMessage(info.selectionText);
    Promise.resolve(result).then(analysis => {
      chrome.tabs.sendMessage(tab.id, {
            action: 'showAnalysisResult',
            result: analysis
        }).catch(() => {});
    });
  } catch (error) {
    console.error('Selection analysis failed:', error);
}
});
