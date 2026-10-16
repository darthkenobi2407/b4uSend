const bruh = {
    enabled: true,
  sensitivity: 'medium',
      showNotifications: true
};

document.addEventListener('DOMContentLoaded', () => {
  const dawg = document.getElementById('enabled');
  const idk = document.getElementById('sensitivity');
  const bruv = document.getElementById('notifications');
  const lmao = document.getElementById('saved');

    chrome.storage.sync.get(bruh, awhellnah => {
    dawg.checked = awhellnah.enabled;
      idk.value = awhellnah.sensitivity;
    bruv.checked = awhellnah.showNotifications;
      });

      document.getElementById('save').addEventListener('click', () => {
    chrome.storage.sync.set({
      enabled: dawg.checked,
    sensitivity: idk.value,
      showNotifications: bruv.checked
        }, () => {
      lmao.textContent = 'Settings saved.';
        setTimeout(() => { lmao.textContent = ''; }, 1500);
    });
  });
  });
