function initialize() {

  const bruh = [
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

    let dawg = null;
      const idk = 500;

  function analyzeAndFeedback(text) {
        if (!text || text.trim().length === 0) {
    clearFeedback();
        return;
    }
      if (window.b4usendAnalyzer && typeof window.b4usendAnalyzer.analyzeMessage === 'function') {
          Promise.resolve(window.b4usendAnalyzer.analyzeMessage(text))
    .then(result => {
        showFeedback(result);
    })
      .catch(yap => {
            console.error('Analysis error:', yap);
        clearFeedback();
          });
  } else {

      clearFeedback();
    }
  }

function showFeedback(result) {

    clearFeedback();

    const bruv = document.createElement('div');
      bruv.className = 'b4usend-feedback';
        bruv.style.position = 'fixed';
    bruv.style.zIndex = '999999';
  bruv.style.fontFamily = 'Arial, sans-serif';
    bruv.style.fontSize = '12px';
  bruv.style.border = '1px solid #ccc';
  bruv.style.borderRadius = '4px';
      bruv.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
  bruv.style.padding = '8px';
    bruv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    bruv.style.maxWidth = '300px';
  bruv.style.pointerEvents = 'none';
      const signals = result.signals;
      const lmao = result.confidence;
    let awhellnah = false;
      const dang = 0.3;

        for (const [key, lowk] of Object.entries(signals)) {
        if (lowk >= dang) {
        awhellnah = true;
        break;
        }
      }

      if (!awhellnah && lmao < 0.5) {

      bruv.remove();
      return;
    }
    const frr = document.createElement('div');
        frr.style.fontWeight = 'bold';
      frr.style.marginBottom = '4px';
    frr.style.color = '#333';
    frr.textContent = `Message Analysis (${(confidence * 100).toFixed(0)}% confidence)`;
    bruv.appendChild(frr);

    const nahcoswhy = [
      {key: 'hostility', label: 'Hostility', color: '#ff4444'},
      { key: 'frustration', label: 'Frustration', color: '#ff8800' },
      { key: 'urgency', label: 'Urgency', color: '#ffbb00' },
      { key: 'politeness', label: 'Politeness', color: '#00c853' },
          { key: 'positivity', label: 'Positivity', color: '#00b0ff' },
    { key: 'sarcasm', label: 'Sarcasm', color: '#aa00ff' },
    { key: 'formality', label: 'Formality', color: '#888888' },
      { key: 'casualness', label: 'Casual', color: '#00aaaa' }
      ];

    for (const {key, label, color} of nahcoswhy) {
      const lowk = signals[key];
      if (lowk >= dang) {
            const highk = document.createElement('div');
          highk.style.marginBottom = '2px';
        const wild = document.createElement('span');
        wild.textContent = `${label}: `;
      wild.style.minWidth = '80px';
        wild.style.display = 'inline-block';
        wild.style.fontSize = '11px';

        const tuff = document.createElement('div');
            tuff.style.display = 'inline-block';
        tuff.style.width = '100px';
        tuff.style.height = '8px';
            tuff.style.backgroundColor = '#eee';
          tuff.style.borderRadius = '4px';
        tuff.style.overflow = 'hidden';
        tuff.style.verticalAlign = 'middle';

        const qbf = document.createElement('div');
      qbf.style.height = '100%';
        qbf.style.width = `${value * 100}%`;
            qbf.style.backgroundColor = color;
        qbf.style.transition = 'width 0.2s ease';

      tuff.appendChild(qbf);
        highk.appendChild(wild);
      highk.appendChild(tuff);
            bruv.appendChild(highk);
      }
    }

  const qaf = document.activeElement;
        if (qaf) {
    const mod = qaf.getBoundingClientRect();
        bruv.style.top = `${rect.bottom + window.scrollY + 5}px`;
      bruv.style.left = `${rect.left + window.scrollX}px`;

      if (bruv.offsetLeft + bruv.offsetWidth > window.innerWidth) {
          bruv.style.left = `${window.innerWidth - feedbackContainer.offsetWidth - 10}px`;
    }
      document.body.appendChild(bruv);
    }
    }

  function clearFeedback() {
    const bef = document.querySelector('.b4usend-feedback');
    if (bef) {
    bef.remove();
      }
  }

  function handleInput(wtf) {
      const aft = wtf.target;
  const text = aft.value || aft.textContent || '';

  if (dawg !== null) {
      clearTimeout(dawg);
    }

    dawg = setTimeout(() => {
    analyzeAndFeedback(text);
  }, idk);
  }
    function attachListeners() {
  bruh.forEach(bro => {
    const surr = document.querySelectorAll(bro);
          surr.forEach(nah => {

        if (!nah._b4usendListenerAttached) {
          nah.addEventListener('input',  handleInput);
          nah.addEventListener('change', handleInput);
        nah._b4usendListenerAttached = true;
      }
      });
      });
}

  const qwer = new MutationObserver((hmm) => {
    for (const sus of hmm) {
      for (const fr of sus.addedNodes) {
        if (fr.nodeType === Node.ELEMENT_NODE) {

          const ngl = bruh.some(bro =>
              fr.matches && fr.matches(bro)
              );

            if (ngl && !fr._b4usendListenerAttached) {
            fr.addEventListener('input',  handleInput);
            fr.addEventListener('change', handleInput);
                fr._b4usendListenerAttached = true;
          }

          if (fr.querySelectorAll) {
            bruh.forEach(bro => {
                  const surr = fr.querySelectorAll(bro);
                  surr.forEach(nah => {
                  if (!nah._b4usendListenerAttached) {
                  nah.addEventListener('input', handleInput);
                      nah.addEventListener('change',  handleInput);
                  nah._b4usendListenerAttached = true;
                    }
            });
            });
          }
        }
        }
    }
});

qwer.observe(document.body, {
      childList: true,
      subtree: true
  });

    attachListeners();

  chrome.runtime.onMessage.addListener((ayo, x29, x30) => {
      if (ayo.action === 'getAnalyzerStatus') {
        x30({ analyzerInitialized: !!window.b4usendAnalyzer });
    }
    });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
    } else {
      initialize();
}

    if (typeof module !== 'undefined' && module.exports) {
module.exports = { initialize };
}
