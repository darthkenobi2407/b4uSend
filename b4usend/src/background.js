// b4usend background service worker
// Keeps analysis local and handles extension-level messages/settings.

/**
 * b4usend Message Analyzer
 * Analyzes natural-language messages and produces structured communication signals
 * 
 * This analyzer focuses on understanding communication characteristics like:
 * - politeness, warmth, friendliness, hostility, frustration, irritation
 * - pressure, urgency, blame, accusation, sarcasm, teasing
 * - directness, formality, casualness, emotional intensity, ambiguity
 * - positivity, negativity, uncertainty
 * 
 * Design Principles:
 * 1. Context matters more than individual keywords
 * 2. Avoid keyword-to-label mapping to reduce false positives
 * 3. Consider surrounding words, sentence structure, negation, punctuation
 * 4. Represent uncertainty through confidence values
 * 5. Run fully locally with no external API calls
 */

class MessageAnalyzer {
  constructor() {
    // Initialize any models or resources here
    this.initialized = false;
    this.model = null;
    this.fallbackEnabled = true;
    
    // Initialize with a lightweight approach
    this._initialize();
  }
  
  /**
   * Initialize the analyzer - load models or set up resources
   * @returns {Promise<void>}
   */
  _initialize() {
    // For now, we'll use a rule-based approach with contextual understanding
    // In a production version, this could load a small local ML model
    this.initialized = true;
    
    // Define contextual patterns and rules
    this._buildContextualRules();
  }
  
  /**
   * Build contextual rules and patterns for analysis
   * These are designed to avoid simple keyword matching
   */
  _buildContextualRules() {
    // Intensifiers and diminishers
    this.intensifiers = new Set([
      'very', 'extremely', 'incredibly', 'absolutely', 'completely', 
      'totally', 'really', 'so', 'quite', 'rather', 'pretty',
      'amazingly', 'awfully', 'horribly', 'terribly', 'fantastically'
    ]);
    
    this.diminishers = new Set([
      'slightly', 'somewhat', 'kind of', 'sort of', 'a bit', 
      'a little', 'mildly', 'moderately', 'fairly'
    ]);
    
    // Contextual patterns for different signals
    // Each pattern considers context to avoid false positives
    this.patterns = {
      // Politeness indicators (context-dependent)
      politeness: [
        { pattern: /\b(please|kindly|could you|would you|may i|might i)\b/ig, weight: 0.8, contextCheck: true },
        { pattern: /\b(thank you|thanks|thankyou|appreciate|grateful)\b/ig, weight: 0.6, contextCheck: true },
        { pattern: /\b(sorry|apologize|excuse me|pardon)\b/ig, weight: 0.5, contextCheck: true }
      ],
      
      // Hostility indicators (must consider context and targets)
      hostility: [
        { pattern: /\b(hate|despise|loathe|detest|abhor)\b/ig, weight: 0.9, contextCheck: true },
        { pattern: /\b(angry|furious|livid|irate|outraged)\b/ig, weight: 0.7, contextCheck: true },
        { pattern: /\b(stupid|idiot|moron|fool|imbecile)\b/ig, weight: 0.8, contextCheck: true }
      ],
      
// Frustration indicators
      frustration: [
        { pattern: /\b(already|still|yet|again)\b.*[\?\.]{0,1}$/ig, weight: 0.6, contextCheck: true },
        { pattern: /\b(tired of|fed up|sick of|had enough)\b/ig, weight: 0.8, contextCheck: true },
        { pattern: /\b(why don't you|why haven't you|when will you)\b/ig, weight: 0.7, contextCheck: true }
      ],
      
// Urgency vs Pressure distinction
      urgency: [
        { pattern: /\b(asap|urgent|emergency|immediately|right away|now)\b/ig, weight: 0.8, contextCheck: true },
        { pattern: /\b(as soon as possible)\b/ig, weight: 0.7, contextCheck: true },
        { pattern: /\b(quickly|fast|hurry|rush)\b/ig, weight: 0.6, contextCheck: true }
      ],
      
      pressure: [
        { pattern: /\b(need|must|should|have to|got to)\b/ig, weight: 0.5, contextCheck: true },
        { pattern: /\b(deadline|time.*running|running.*out|clock.*ticking)\b/ig, weight: 0.7, contextCheck: true }
      ],
      
// Blame and accusation (need to identify targets)
      blame: [
        { pattern: /\b(you.*(always|never|constantly|keep|keep on))\b/ig, weight: 0.8, contextCheck: true },
        { pattern: /\b(it\'s.*your.*fault|you.*caused|because of you)\b/ig, weight: 0.9, contextCheck: true }
      ],
      
      accusation: [
        { pattern: /\b(you.*(did|made|caused|said|took))\b.*\b(lie|mistake|error|wrong|problem)\b/ig, weight: 0.8, contextCheck: true },
        { pattern: /\b(accuse|blame|hold responsible)\b/ig, weight: 0.9, contextCheck: true }
      ],
      
// Sarcasm and teasing (highly context-dependent)
      sarcasm: [
        { pattern: /\b(oh\s+great|wonderful|fantastic|terrific)\b.*[.!]{1,2}$/ig, weight: 0.3, contextCheck: true }, // Low weight as highly context-dependent
        { pattern: /\b(yeah\s+right|as\s+if|big\s+surprise)\b/ig, weight: 0.6, contextCheck: true }
      ],
      
      teasing: [
        { pattern: /\b(jk|just\s+kidding|teasing|playing)\b/ig, weight: 0.4, contextCheck: true },
        { pattern: /\b(ha|haha|lol|lol+)\b.*[.!]{0,2}$/ig, weight: 0.3, contextCheck: true }
      ],
      
// Directness (not inherently negative)
      directness: [
        { pattern: /\b(can you|will you|please.*could|would you mind)\b/ig, weight: 0.2, contextCheck: true }, // Lowers directness
        { pattern: /\b(i need|i want|i require|give me|send me)\b/ig, weight: 0.7, contextCheck: true },
        { pattern: /\b(must|should|have to|need to)\b/ig, weight: 0.6, contextCheck: true }
      ],
      
// Formality vs Casualness
      formality: [
        { pattern: /\b(i am|it is|we are|they were)\b/ig, weight: 0.4, contextCheck: true },
        { pattern: /\b(furthermore|moreover|however|nevertheless)\b/ig, weight: 0.5, contextCheck: true },
        { pattern: /\b(dear|sincerely|respectfully|faithfully)\b/ig, weight: 0.6, contextCheck: true }
      ],
      
      casualness: [
        { pattern: /\b(hey|hi|yo|what\'s up|sup|howdy)\b/ig, weight: 0.5, contextCheck: true },
        { pattern: /\b(gonna|wanna|gotta|kinda|sorta|lemme|gimme)\b/ig, weight: 0.4, contextCheck: true },
        { pattern: /\b(lol|omg|wtf|brb|ttyl)\b/ig, weight: 0.3, contextCheck: true }
      ],
      
// Emotional intensity
      emotional_intensity: [
        { pattern: /[!]{2,}/g, weight: 0.6, contextCheck: false },
        { pattern: /[?]{2,}/g, weight: 0.4, contextCheck: false },
        { pattern: /\b(ABSOLUTELY|TOTALLY|COMPLETELY|UTTERLY)\b/ig, weight: 0.5, contextCheck: false },
        { pattern: /\b(never|ever|always|constantly)\b/ig, weight: 0.3, contextCheck: false }
      ],
      
// Ambiguity detection
      ambiguity: [
        { pattern: /\b(maybe|perhaps|possibly|might|could|maybe)\b/ig, weight: 0.4, contextCheck: false },
        { pattern: /\b(i guess|i suppose|i think|i feel|seems like)\b/ig, weight: 0.3, contextCheck: false },
        { pattern: /[,;:]s*[?!]/g, weight: 0.2, contextCheck: false }, // Mixed punctuation
      ],
      
// Positivity/Negativity (contextual)
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
  
  /**
   * Check contextual factors that might negate or modify a signal
   * @param {string} text - The full text being analyzed
   * @param {string} signalType - The type of signal being checked
   * @param {RegExp} pattern - The matched pattern
   * @param {number} index - Position of match in text
   * @returns {number} - Context modifier (0.0 to 2.0)
   */
  _checkContext(text, signalType, pattern, index) {
    const context = {
      negation: false,
      hedging: false,
      conditional: false,
      quoted: false,
      targetUnclear: false
    };
    
    // Get surrounding text (50 chars before and after)
    const before = text.substring(Math.max(0, index - 50), index).toLowerCase();
    const after = text.substring(index + pattern.source.length, Math.min(text.length, index + pattern.source.length + 50)).toLowerCase();
    const surrounding = before + ' ' + after;
    
// Check for negation
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
    
// Check for hedging language (makes statements less certain)
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
    
// Check for conditional language
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
    
// Check if text is in quotes (often indicates sarcasm or quoting others)
    const quoteCountBefore = (before.match(/['"]/g) || []).length;
    const quoteCountAfter = (after.match(/['"]/g) || []).length;
    if ((quoteCountBefore + quoteCountAfter) % 2 === 1) {
      context.quoted = true;
    }
    
// Calculate context modifier
    let modifier = 1.0;
    
    if (context.negation) {
      modifier *= 0.1; // Strongly negates most signals
    }
    
    if (context.hedging) {
      modifier *= 0.6; // Reduces signal strength
    }
    
    if (context.conditional) {
      modifier *= 0.7; // Somewhat reduces certainty
    }
    
    if (context.quoted) {
      modifier *= 0.5; // Quoted speech often not sincere
    }
    
// Signal-specific context adjustments
    switch (signalType) {
      case 'sarcasm':
// Sarcasm is heavily context-dependent - look for positive words in negative contexts
        if (/(good|great|excellent|wonderful|fantastic|amazing)/i.test(surrounding) && 
            /(oh\s+great|wonderful|fantastic|terrific)/i.test(pattern)) {
          modifier *= 2.0; // Increases likelihood of sarcasm
        }
        break;
        
      case 'hostility':
// Check if hostility is directed at self or abstract concepts (less hostile)
        if (/(i\s+am|i\s+feel|my\s+own)\s+(hate|angry|furious)/i.test(surrounding)) {
          modifier *= 0.3; // Self-directed anger is less hostile toward others
        }
        break;
        
      case 'blame':
// Blame needs a clear target
        if (!/(you|your|you\'re)/i.test(surrounding)) {
          modifier *= 0.2; // Unclear target reduces blame signal
        }
        break;
        
      case 'politeness':
// Politeness can be sarcastic
        if (/(oh\s+great|wonderful|fantastic|terrific|big\s+surprise|as\s+if)/i.test(surrounding)) {
          modifier *= 0.2; // Likely sarcastic politeness
        }
        break;
    }
    
    return Math.max(0.0, Math.min(2.0, modifier)); // Clamp between 0 and 2
  }
  
  /**
   * Analyze a message and return communication signals
   * @param {string} text - The message text to analyze
   * @returns {Object} - Structured analysis result
   */
  analyzeMessage(text) {
    if (!this.initialized) {
      this._initialize();
    }
    
    // Handle edge cases
    if (!text || typeof text !== 'string') {
      return this._getEmptyResult();
    }
    
    text = text.trim();
    if (text.length === 0) {
      return this._getEmptyResult();
    }
    
// Initialize signal scores
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
    
// Track total weight for confidence calculation
    let totalWeight = 0;
    let matchedPatterns = 0;
    
// Analyze each signal category
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
        
// If no matches but we want to check for absence (for some signals)
        if (!patternMatched && signalName === 'ambiguity') {
// Check for lack of clarity indicators
          if (!/[.!?]$/.test(text)) {
            signalScore += 0.3; // Incomplete sentences increase ambiguity
            signalWeight += 0.3;
          }
        }
      }
      
// Normalize signal score (0-1 range)
      if (signalWeight > 0) {
        signals[signalName] = Math.min(1.0, signalScore / signalWeight);
      }
      totalWeight += signalWeight;
    }
    
// Calculate derived signals
    signals.warmth = (signals.positivity * 0.5) + (signals.friendliness * 0.3) + (signals.positivity * 0.2);
    signals.friendliness = (signals.positivity * 0.4) + (signals.casualness * 0.3) + ((1.0 - signals.hostility) * 0.3);
    signals.irritation = Math.max(signals.frustration, signals.impatience || 0.0);
    
// Calculate confidence based on:
// 1. Number of patterns matched
// 2. Text length (very short texts are harder to analyze)
// 3. Presence of clear contextual cues
    let confidence = 0.0;
    
    if (matchedPatterns > 0) {
      confidence += Math.min(0.5, matchedPatterns * 0.1); // Up to 0.5 from pattern matches
    }
    
    if (text.length > 10) {
      confidence += 0.2; // Reasonable length
    }
    
    if (text.length > 30) {
      confidence += 0.2; // Good length for analysis
    }
    
// Check for clear contextual indicators
    const hasClearContext = /(please|thank you|hate|angry|already|asap|urgent|you.*always|never|you.*never|can you|could you)/i.test(text);
    if (hasClearContext) {
      confidence += 0.2;
    }
    
    confidence = Math.min(1.0, Math.max(0.1, confidence)); // Minimum confidence of 0.1
    
// Apply fallback logic if confidence is very low
    if (confidence < 0.3 && this.fallbackEnabled) {
      return this._fallbackAnalyzer(text);
    }
    
    return {
      message: text,
      signals: signals,
      confidence: parseFloat(confidence.toFixed(3))
    };
  }
  
  /**
   * Fallback analyzer - conservative, rule-based approach
   * Used when main analyzer confidence is too low
   * @param {string} text - The message text to analyze
   * @returns {Object} - Structured analysis result
   */
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
    
// Very basic keyword checking with conservative weights
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
    
// Cap all signals at 0.5 for fallback (conservative)
    for (const key in signals) {
      signals[key] = Math.min(0.5, signals[key]);
    }
    
    return {
      message: text,
      signals: signals,
      confidence: 0.3 // Fixed low confidence for fallback
    };
  }
  
  /**
   * Get empty result for invalid/empty input
   * @returns {Object} - Empty analysis result
   */
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

// Export the analyzer
const analyzer = new MessageAnalyzer();

// For browser extension usage
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeMessage') {
    if (!analyzerInstance) {
      sendResponse({ success: false, error: 'Analyzer not initialized' });
      return false;
    }

    try {
      Promise.resolve(analyzerInstance.analyzeMessage(request.text))
        .then(result => sendResponse({ success: true, result }))
        .catch(error => sendResponse({ success: false, error: error.message }));
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

chrome.contextMenus.onClicked.addListener((info, tab) => {
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
