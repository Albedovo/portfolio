/* Static interface compositions, generated from the original project prototypes. */
(() => {
  const library = document.querySelector('#screen-library').content;
  let serial = 0;
  function phoneFor(key) {
    const source = library.querySelector(`[data-screen="${key}"]`);
    if (!source) return null;
    const phone = document.createElement('div');
    phone.className = `phone ${document.body.dataset.phoneClass}`;
    phone.style.setProperty('--status', source.dataset.status || '#fff');
    phone.inert = true;
    phone.setAttribute('aria-hidden', 'true');
    const status = library.querySelector('.statusbar');
    if (status) phone.append(status.cloneNode(true));
    const screen = source.cloneNode(true);
    screen.classList.remove('fwd', 'bwd', 'fade');
    screen.classList.add('on');
    window.refinePortfolioScreen?.(screen, document.body.dataset.phoneClass, key);
    phone.append(screen);
    const bar = document.createElement('div');
    bar.className = 'homebar';
    phone.append(bar);
    const prefix = `view-${++serial}-`;
    const ids = new Map();
    phone.querySelectorAll('[id]').forEach(node => { ids.set(node.id, prefix + node.id); node.id = prefix + node.id; });
    phone.querySelectorAll('*').forEach(node => {
      for (const attribute of [...node.attributes]) {
        let value = attribute.value.replace(/url\(#([^)]+)\)/g, (match, id) => ids.has(id) ? `url(#${ids.get(id)})` : match);
        if ((attribute.name === 'href' || attribute.name === 'xlink:href') && value.startsWith('#') && ids.has(value.slice(1))) value = '#' + ids.get(value.slice(1));
        if (value !== attribute.value) node.setAttribute(attribute.name, value);
      }
    });
    return phone;
  }
  const views = [...document.querySelectorAll('[data-shot]')];
  views.forEach(view => { const phone = phoneFor(view.dataset.shot); if (phone) view.append(phone); });
  const fit = view => view.style.setProperty('--scale', view.clientWidth / 402);
  const resize = new ResizeObserver(entries => entries.forEach(entry => fit(entry.target)));
  views.forEach(view => { fit(view); resize.observe(view); });
  const dialog = document.querySelector('#screen-dialog');
  const detail = dialog.querySelector('.detail-render');
  resize.observe(detail);
  let lang = 'en';
  let opener;
  document.querySelectorAll('[data-open-screen]').forEach(button => button.addEventListener('click', () => {
    opener = button;
    detail.replaceChildren(phoneFor(button.dataset.openScreen));
    document.querySelector('#screen-detail-title').textContent = lang === 'en' ? button.dataset.titleEn : button.dataset.titleZh;
    dialog.showModal();
    fit(detail);
    document.body.classList.add('modal-open');
    dialog.querySelector('.dialog-close').focus();
  }));
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { detail.replaceChildren(); document.body.classList.remove('modal-open'); opener?.focus({preventScroll:true}); });
  document.querySelector('#language').addEventListener('click', event => {
    lang = lang === 'en' ? 'zh' : 'en';
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
    document.querySelectorAll('[data-en]').forEach(node => node.innerHTML = node.dataset[lang]);
    event.currentTarget.textContent = lang === 'en' ? '中 / EN' : '中文 / EN';
    event.currentTarget.setAttribute('aria-label', lang === 'en' ? 'Switch to Chinese' : '切换至英文');
    document.querySelectorAll('[data-open-screen]').forEach(button => button.setAttribute('aria-label',lang === 'en' ? `Enlarge ${button.dataset.titleEn}` : `放大${button.dataset.titleZh}`));
    dialog.querySelector('.dialog-close').setAttribute('aria-label', lang === 'en' ? 'Close enlarged interface' : '关闭放大界面');
  });
})();
