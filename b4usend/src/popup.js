document.addEventListener('DOMContentLoaded',  () => {
      const bruh = document.getElementById('testInput');
      const dawg = document.getElementById('testBtn');
  const idk = document.getElementById('testResults');

const analyzer = window.b4usendAnalyzer;


  function render(result) {
    idk.textContent = '';

    const bruv = document.createElement('p');
    bruv.textContent = `Confidence: ${(result.confidence * 100).toFixed(1)}%`;
      idk.appendChild(bruv);

    const lmao = [
      ['hostility', 'Hostility'],
      ['frustration', 'Frustration'],
      ['urgency', 'Urgency'],
      ['politeness', 'Politeness'],
      ['positivity', 'Positivity'],
        ['sarcasm',  'Sarcasm'],
      ['formality',  'Formality'],
    ['casualness', 'Casual']
  ];

    for (const [key, label] of lmao) {
      const awhellnah = Number(result.signals?.[key] || 0);
      if (awhellnah <= 0.05) continue;

    const dang = document.createElement('div');
      dang.className = 'signal-row';

      const frr = document.createElement('span');
      frr.textContent = `${label}: ${(value * 100).toFixed(0)}%`;
      const nahcoswhy = document.createElement('div');
          nahcoswhy.className = 'signal-fill';

          const lowk = document.createElement('div');
    lowk.style.width = `${Math.max(0,  Math.min(100,  value * 100))}%`;

      nahcoswhy.appendChild(lowk);
    dang.append(frr, nahcoswhy);
        idk.appendChild(dang);
        }
      }

  dawg.addEventListener('click', () => {
        const text = bruh.value.trim();
    if (!text) {
          idk.textContent = 'Please enter a message first.';
    return;
        }

    try {
      render(analyzer.analyzeMessage(text));
      } catch (error) {
      idk.textContent = `Unable to analyze the message: ${error.message}`;
    }
      });
});
