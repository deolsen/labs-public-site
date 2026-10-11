// Copy reports its outcome in the figure's live region and never moves focus.
document.addEventListener('click', async (event) => {
  const button = event.target.closest('.lk-copy');
  if (!button) return;
  const figure = button.closest('.lk-code');
  const status = figure.querySelector('.lk-copy-status');
  try {
    await navigator.clipboard.writeText(figure.querySelector('pre').innerText);
    status.textContent = 'Copied';
  } catch {
    status.textContent = 'Copy failed — select the text instead';
  }
});
