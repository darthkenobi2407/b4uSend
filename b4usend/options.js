const defaults = {
  enabled: true,
  sensitivity: 'medium',
  showNotifications: true
};

document.addEventListener('DOMContentLoaded', () => {
  const enabled = document.getElementById('enabled');
  const sensitivity = document.getElementById('sensitivity');
  const notifications = document.getElementById('notifications');
  const saved = document.getElementById('saved');

  chrome.storage.sync.get(defaults, settings => {
    enabled.checked = settings.enabled;
    sensitivity.value = settings.sensitivity;
    notifications.checked = settings.showNotifications;
  });

  document.getElementById('save').addEventListener('click', () => {
    chrome.storage.sync.set({
      enabled: enabled.checked,
      sensitivity: sensitivity.value,
      showNotifications: notifications.checked
    }, () => {
      saved.textContent = 'Settings saved.';
      setTimeout(() => { saved.textContent = ''; }, 1500);
    });
  });
});
