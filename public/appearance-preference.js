/* Documentation appearance is independent of the theme and mode of each specimen. */
(() => {
  const storageKey = 'research-ui:documentation:appearance:v1';
  const choices = ['light', 'dark', 'system'];
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = 'system';
  try {
    const saved = localStorage.getItem(storageKey);
    if (choices.includes(saved)) preference = saved;
  } catch { /* A session-only preference remains usable when persistence is unavailable. */ }
  const apply = () => {
    document.documentElement.dataset.appearance = preference;
    document.documentElement.dataset.theme = preference === 'system' ? (system.matches ? 'dark' : 'light') : preference;
    document.querySelectorAll('[data-documentation-appearance]').forEach(input => {
      input.checked = input.value === preference;
    });
  };
  apply();
  system.addEventListener('change', () => { if (preference === 'system') apply(); });
  window.addEventListener('storage', event => {
    if (event.key !== storageKey) return;
    preference = choices.includes(event.newValue) ? event.newValue : 'system';
    apply();
  });
  const icons = {
    light: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
    dark: '<path d="M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10Z"/>',
    system: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/>',
  };
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.hdr-actions button[data-theme]').forEach((old, groupIndex) => {
      const group = document.createElement('fieldset');
      group.className = 'rui-appearance';
      const legend = document.createElement('legend');
      legend.className = 'rui-visually-hidden';
      legend.textContent = 'Documentation appearance';
      group.append(legend);
      for (const value of choices) {
        const label = document.createElement('label');
        label.title = value === 'system' ? 'Follow system appearance' : `${value[0].toUpperCase() + value.slice(1)} appearance`;
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `documentation-appearance-${groupIndex}`;
        input.value = value;
        input.dataset.documentationAppearance = '';
        input.checked = preference === value;
        input.addEventListener('change', () => {
          preference = value;
          try { localStorage.setItem(storageKey, value); } catch { /* Keep the in-memory selection. */ }
          apply();
        });
        const face = document.createElement('span');
        face.innerHTML = `<svg aria-hidden="true" viewBox="0 0 24 24">${icons[value]}</svg><span class="rui-visually-hidden">${value[0].toUpperCase() + value.slice(1)}</span>`;
        label.append(input, face);
        group.append(label);
      }
      old.replaceWith(group);
    });
  });
})();
