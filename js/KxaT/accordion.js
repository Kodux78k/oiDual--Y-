export function makeCollapsible(node) {
  if (!node || node.dataset.accordionInit) return;
  node.dataset.accordionInit = 'true';

  const header = node.querySelector('.accordion-header');
  const body = node.querySelector('.collapsible-body');
  if (!header || !body) return;

  if (!header.querySelector('.indicator')) {
    const indicator = document.createElement('span');
    indicator.className = 'indicator';
    indicator.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';
    header.appendChild(indicator);
  }

  if (!node.classList.contains('is-collapsed') && !node.classList.contains('is-open')) {
    node.classList.add('is-open');
  }
  if (node.classList.contains('is-collapsed')) body.style.height = '0px';

  header.addEventListener('click', (e) => {
    const targetTag = e.target.tagName.toLowerCase();
    if (['input', 'select', 'button', 'textarea'].includes(targetTag)) return;

    const isCollapsed = node.classList.contains('is-collapsed');
    if (isCollapsed) {
      node.classList.remove('is-collapsed');
      node.classList.add('is-open');
      body.style.height = body.scrollHeight + 'px';
      body.addEventListener('transitionend', function handler(ev) {
        if (ev.propertyName === 'height') {
          body.style.height = 'auto';
          body.removeEventListener('transitionend', handler);
        }
      });
    } else {
      body.style.height = body.scrollHeight + 'px';
      void body.offsetHeight;
      node.classList.remove('is-open');
      node.classList.add('is-collapsed');
      body.style.height = '0px';
    }
  });
}

export function initAccordionObserver(root = document.body) {
  window.KobAccordion = {
    open: (card) => { card = (typeof card === 'string') ? document.querySelector(card) : card; if (card) { card.classList.remove('is-collapsed'); card.classList.add('is-open'); } },
    close: (card) => { card = (typeof card === 'string') ? document.querySelector(card) : card; if (card) { card.classList.remove('is-open'); card.classList.add('is-collapsed'); } },
    toggle: (card) => { card = (typeof card === 'string') ? document.querySelector(card) : card; card && card.querySelector('.accordion-header')?.click(); }
  };

  const observer = new MutationObserver((muts) => {
    muts.forEach((m) => {
      m.addedNodes && m.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;
        if (node.matches && node.matches('.accordion')) makeCollapsible(node);
        node.querySelectorAll && node.querySelectorAll('.accordion').forEach((el) => makeCollapsible(el));
      });
    });
  });

  if (root) observer.observe(root, { childList: true, subtree: true });
  document.querySelectorAll('.accordion').forEach(makeCollapsible);
  return observer;
}
