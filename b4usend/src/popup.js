document.addEventListener('DOMContentLoaded', () => {
  
  const input = document.getElementById('testInput');
  const button = document.getElementById('testBtn');
  const results = document.getElementById('testResults');

  const analyzer = window.b4usendAnalyzer;

 
  function render(result) {
    results.textContent = '';

   
    const confidence = document.createElement('p');
    confidence.textContent = `Confidence: ${(result.confidence * 100).toFixed(1)}%`;
    results.appendChild(confidence);

    const keys = [
      ['hostility', 'Hostility'],
      ['frustration', 'Frustration'],
      ['urgency', 'Urgency'],
      ['politeness', 'Politeness'],
      ['positivity', 'Positivity'],
      ['sarcasm', 'Sarcasm'],
      ['formality', 'Formality'],
      ['casualness', 'Casual']
    ];

    for (const [key, label] of keys) {
      const value = Number(result.signals?.[key] || 0);
      if (value <= 0.05) continue;

      const row = document.createElement('div');
      row.className = 'signal-row';

      const name = document.createElement('span');
      name.textContent = `${label}: ${(value * 100).toFixed(0)}%`;

      const bar = document.createElement('div');
      bar.className = 'signal-fill';

      const fill = document.createElement('div');
      fill.style.width = `${Math.max(0, Math.min(100, value * 100))}%`;

      bar.appendChild(fill);
      row.append(name, bar);
      results.appendChild(row);
    }
  }

  button.addEventListener('click', () => {
    const text = input.value.trim();
    if (!text) {
      results.textContent = 'Enter a message first.';
      return;
    }

    try {
      render(analyzer.analyzeMessage(text));
    } catch (error) {
      results.textContent = `Analysis failed: ${error.message}`;
    }
  });
});
