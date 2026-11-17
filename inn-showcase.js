/* Composed interface presentation with optional enlarged screen views. */
(() => {
  const library = document.querySelector('#screen-library');
  const status = document.querySelector('#phone-status');
  const shots = [...document.querySelectorAll('[data-screen-shot]')];
  const hunts = [
    ['The Old Captain’s Final Voyage', 'teal'], ['The Heart of the Gear', 'yellow'],
    ['The Secret of one Page', 'lime'], ['The Boss’s Stash', 'blue'], ['The Philosopher’s Stone', 'teal']
  ];
  function makePhone(key) {
    const source = library.content.querySelector(`[data-screen="${key}"]`);
    if (!source) return null;
    const phone = document.createElement('div');
    phone.className = 'phone inn';
    phone.inert = true;
    phone.setAttribute('aria-hidden', 'true');
    phone.append(status.content.cloneNode(true));
    const screen = source.cloneNode(true);
    screen.classList.add('on');
    if (key === 'play') screen.querySelector('.invite').classList.add('show');
    if (key === 'hunts') {
      screen.querySelector('#hunts').innerHTML = hunts.map(([name, colour], i) => `<div class="hunt c-${colour}">Tavern Treasure Hunt ${i + 1}:<br>${name}${i === 0 ? '<small>Recommended for Newcomers</small>' : ''}</div>`).join('');
    }
    if (key === 'ach') {
      screen.querySelector('#ach-got').innerHTML = `<div class="ach c-teal">Tavern Treasure Hunt 1:<br>${hunts[0][0]}<span>Unlocked</span></div><div class="ach c-blue">Complete user registration<span>Unlocked</span></div>`;
      screen.querySelector('#ach-todo').innerHTML = hunts.slice(1).map(([name, colour], i) => `<div class="ach locked c-${colour}">Tavern Treasure Hunt ${i + 2}:<br>${name}<span>Locked</span></div>`).join('');
    }
    screen.querySelectorAll('.tabs').forEach(nav => {
      nav.innerHTML = ['Home', 'Achievement', 'Messages', 'Account'].map((label, i) => `<span class="static-tab ${i === (key === 'ach' ? 1 : 0) ? 'cur' : ''}"><i>${['⌂', '♜', '☏', '◎'][i]}</i>${label}</span>`).join('');
    });
    window.refinePortfolioScreen?.(screen, 'inn', key);
    screen.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
    phone.append(screen);
    const home = document.createElement('div');
    home.className = 'homebar';
    phone.append(home);
    return phone;
  }
  for (const shot of shots) {
    const phone = makePhone(shot.dataset.screenShot);
    if (phone) shot.append(phone);
  }
  const size = () => shots.forEach(shot => shot.style.setProperty('--shot-scale', shot.clientWidth / 402));
  size();
  const observer = new ResizeObserver(size);
  shots.forEach(shot => observer.observe(shot));

  let language = 'en';
  const dialog = document.querySelector('#screen-dialog');
  const detailShot = dialog.querySelector('.detail-shot');
  let opener;
  function closeDetail() { dialog.close(); }
  document.querySelectorAll('[data-open-screen]').forEach(button => button.addEventListener('click', () => {
    opener = button;
    document.querySelector('#screen-detail-title').textContent = button.dataset[language === 'en' ? 'titleEn' : 'titleZh'];
    detailShot.replaceChildren(makePhone(button.dataset.openScreen));
    dialog.showModal();
    detailShot.style.setProperty('--shot-scale', detailShot.clientWidth / 402);
    document.body.classList.add('detail-open');
    dialog.querySelector('.dialog-close').focus();
  }));
  const detailObserver = new ResizeObserver(() => detailShot.style.setProperty('--shot-scale', detailShot.clientWidth / 402));
  detailObserver.observe(detailShot);
  dialog.querySelector('.dialog-close').addEventListener('click', closeDetail);
  dialog.addEventListener('click', event => { if (event.target === dialog) closeDetail(); });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('detail-open');
    detailShot.replaceChildren();
    opener?.focus({preventScroll:true});
  });
  document.querySelector('#language').addEventListener('click', event => {
    language = language === 'en' ? 'zh' : 'en';
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
    document.querySelectorAll('[data-en]').forEach(el => el.innerHTML = el.dataset[language]);
    event.currentTarget.textContent = language === 'en' ? '中 / EN' : '中文 / EN';
    event.currentTarget.setAttribute('aria-label', language === 'en' ? 'Switch to Chinese' : '切换至英文');
    document.querySelectorAll('[data-open-screen]').forEach(button => button.setAttribute('aria-label', language === 'en' ? `Enlarge ${button.dataset.titleEn}` : `放大${button.dataset.titleZh}`));
    dialog.querySelector('.dialog-close').setAttribute('aria-label', language === 'en' ? 'Close enlarged interface' : '关闭放大界面');
  });
})();
