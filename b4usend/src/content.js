// Content script for b4usend extension
// Runs in the context of web pages to analyze messages before sending

// Wait for DOM to be ready
function initialize() {
  // Find common message input elements
  const selectors = [
    'textarea',
    'input[type="text"]',
    'input[type="search"]',
    'div[contenteditable="true"]',
    '[role="textbox"]',
    '.compose-input',
    '.message-input',
    '.chat-input',
    '#message-input',
    '#chat-input'
  ];
  
  // Debounce timer for analysis
  let debounceTimer = null;
  const DEBOUNCE_MS = 500; // Wait 500ms after typing stops
  
  // Analyze message and show feedback
  function analyzeAndFeedback(text) {
    if (!text || text.trim().length === 0) {
      clearFeedback();
      return;
    }
    
    // Import the analyzer (in a real extension, this would be imported differently)
    // For now, we'll assume it's available globally or we'll load it
    if (window.b4usendAnalyzer && typeof window.b4usendAnalyzer.analyzeMessage === 'function') {
      Promise.resolve(window.b4usendAnalyzer.analyzeMessage(text))
      .then(result => {
        showFeedback(result);
      })
      .catch(err => {
        console.error('Analysis error:', err);
        clearFeedback();
      });
    } else {
      // Fallback if analyzer not ready
      clearFeedback();
    }
  }
  
  // Show feedback UI near the input
  function showFeedback(result) {
    // Remove any existing feedback
    clearFeedback();
    
    // Create feedback container
    const feedbackContainer = document.createElement('div');
    feedbackContainer.className = 'b4usend-feedback';
    feedbackContainer.style.position = 'fixed';
    feedbackContainer.style.zIndex = '999999';
    feedbackContainer.style.fontFamily = 'Arial, sans-serif';
    feedbackContainer.style.fontSize = '12px';
    feedbackContainer.style.border = '1px solid #ccc';
    feedbackContainer.style.borderRadius = '4px';
    feedbackContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    feedbackContainer.style.padding = '8px';
    feedbackContainer.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    feedbackContainer.style.maxWidth = '300px';
    feedbackContainer.style.pointerEvents = 'none';
    
    // Create signal indicators
    const signals = result.signals;
    const confidence = result.confidence;
    
    // Only show if we have meaningful signals
    let hasSignals = false;
    const signalThreshold = 0.3;
    
    for (const [key, value] of Object.entries(signals)) {
      if (value >= signalThreshold) {
        hasSignals = true;
        break;
      }
    }
    
    if (!hasSignals && confidence < 0.5) {
      // No significant signals detected
      feedbackContainer.remove();
      return;
    }
    
    // Create title
    const title = document.createElement('div');
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '4px';
    title.style.color = '#333';
    title.textContent = `Message Analysis (${(confidence * 100).toFixed(0)}% confidence)`;
    feedbackContainer.appendChild(title);
    
    // Create signal bars
    const signalNames = [
      { key: 'hostility', label: 'Hostility', color: '#ff4444' },
      { key: 'frustration', label: 'Frustration', color: '#ff8800' },
      { key: 'urgency', label: 'Urgency', color: '#ffbb00' },
      { key: 'politeness', label: 'Politeness', color: '#00c853' },
      { key: 'positivity', label: 'Positivity', color: '#00b0ff' },
      { key: 'sarcasm', label: 'Sarcasm', color: '#aa00ff' },
      { key: 'formality', label: 'Formality', color: '#888888' },
      { key: 'casualness', label: 'Casual', color: '#00aaaa' }
    ];
    
    for (const {key, label, color} of signalNames) {
      const value = signals[key];
      if (value >= signalThreshold) {
        const signalRow = document.createElement('div');
        signalRow.style.marginBottom = '2px';
        
        const labelSpan = document.createElement('span');
        labelSpan.textContent = `${label}: `;
        labelSpan.style.minWidth = '80px';
        labelSpan.style.display = 'inline-block';
        labelSpan.style.fontSize = '11px';
        
        const barContainer = document.createElement('div');
        barContainer.style.display = 'inline-block';
        barContainer.style.width = '100px';
        barContainer.style.height = '8px';
        barContainer.style.backgroundColor = '#eee';
        barContainer.style.borderRadius = '4px';
        barContainer.style.overflow = 'hidden';
        barContainer.style.verticalAlign = 'middle';
        
        const barFill = document.createElement('div');
        barFill.style.height = '100%';
        barFill.style.width = `${value * 100}%`;
        barFill.style.backgroundColor = color;
        barFill.style.transition = 'width 0.2s ease';
        
        barContainer.appendChild(barFill);
        signalRow.appendChild(labelSpan);
        signalRow.appendChild(barContainer);
        feedbackContainer.appendChild(signalRow);
      }
    }
    
    // Position near the active element
    const activeElement = document.activeElement;
    if (activeElement) {
      const rect = activeElement.getBoundingClientRect();
      feedbackContainer.style.top = `${rect.bottom + window.scrollY + 5}px`;
      feedbackContainer.style.left = `${rect.left + window.scrollX}px`;
      
      // Ensure it doesn't go off screen
      if (feedbackContainer.offsetLeft + feedbackContainer.offsetWidth > window.innerWidth) {
        feedbackContainer.style.left = `${window.innerWidth - feedbackContainer.offsetWidth - 10}px`;
      }
      
      document.body.appendChild(feedbackContainer);
    }
  }
  
  // Clear feedback UI
  function clearFeedback() {
    const existing = document.querySelector('.b4usend-feedback');
    if (existing) {
      existing.remove();
    }
  }
  
  // Event listener for input changes
  function handleInput(event) {
    const target = event.target;
    const text = target.value || target.textContent || '';
    
    // Clear existing timer
    if (debounceTimer !== null) {
      clearTimeout(debounceTimer);
    }
    
    // Set new timer
    debounceTimer = setTimeout(() => {
      analyzeAndFeedback(text);
    }, DEBOUNCE_MS);
  }
  
  // Attach listeners to all matching elements
  function attachListeners() {
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        // Avoid duplicate listeners
        if (!el._b4usendListenerAttached) {
          el.addEventListener('input', handleInput);
          el.addEventListener('change', handleInput);
          el._b4usendListenerAttached = true;
        }
      });
    });
  }
  
  // Observe DOM changes for dynamically added elements
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Check if it matches our selectors
          const matchesSelector = selectors.some(selector => 
            node.matches && node.matches(selector)
          );
          
          if (matchesSelector && !node._b4usendListenerAttached) {
            node.addEventListener('input', handleInput);
            node.addEventListener('change', handleInput);
            node._b4usendListenerAttached = true;
          }
          
          // Also check children
          if (node.querySelectorAll) {
            selectors.forEach(selector => {
              const elements = node.querySelectorAll(selector);
              elements.forEach(el => {
                if (!el._b4usendListenerAttached) {
                  el.addEventListener('input', handleInput);
                  el.addEventListener('change', handleInput);
                  el._b4usendListenerAttached = true;
                }
              });
            });
          }
        }
      }
    }
  });
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Initial attachment
  attachListeners();
  
  // Listen for messages from extension
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getAnalyzerStatus') {
      sendResponse({ analyzerInitialized: !!window.b4usendAnalyzer });
    }
  });
}

// Initialize when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initialize };
}
