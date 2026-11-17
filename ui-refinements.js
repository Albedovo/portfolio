/* Presentation refinements shared by inline excerpts and enlarged views. */
window.refinePortfolioScreen = (screen, project, key) => {
  const add = (target, position, html) => target?.insertAdjacentHTML(position, html);
  const icon = (path) => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
  const cup = icon('<path d="M5 9h12v6a6 6 0 0 1-12 0zM17 10h2a3 3 0 0 1 0 6h-2M8 3v3m5-3v3M3 22h16"/>');
  if (project === 'cw') {
    if (key === 'map') {
      add(screen.querySelector('.search'), 'afterend', '<div class="map-topics"><span class="selected">All skills</span><span>Coffee</span><span>Art & craft</span></div>');
      const person = screen.querySelector('.person');
      person.querySelector('p').innerHTML = 'Coffee brewing · 350 m away';
      add(person.querySelector('.top'),'afterend',`<div class="exchange-detail"><span>${cup}<b>Can teach<small>Brewing coffee</small></b></span><i>↔</i><span><b>Wants to learn<small>Drawing</small></b></span></div>`);
      person.querySelector('.btn.or').textContent='Suggest an exchange';
      person.querySelector('.btn.soft').textContent='View workshop';
    }
    if (['workshop','co-create','market'].includes(key)) {
      const titles = {workshop:['LEARN SOMETHING LOCAL','A little curiosity.<br>A new skill.'], 'co-create':['MADE WITH YOUR NEIGHBOURS','Small skills.<br>Shared possibilities.'],market:['THE NEIGHBOURHOOD MARKET','Made nearby.<br>Made with care.']};
      add(screen.querySelector('.bar'),'afterend',`<div class="app-intro"><small>${titles[key][0]}</small><h2>${titles[key][1]}</h2></div>`);
    }
    screen.querySelectorAll('.course').forEach((card,i)=>{
      const labels=['PHOTOGRAPHY','CREATIVE WRITING','ART & CRAFT'];
      add(card.querySelector('h3'),'beforebegin',`<span class="course-category">${labels[i%3]}</span>`);
      card.querySelector('p')?.remove();
      add(card.querySelector('.price'),'afterend','<span class="course-link">View class ↗</span>');
    });
    screen.querySelectorAll('.good').forEach((card,i)=>{
      const categories=['LEATHERWORK','ILLUSTRATION','CERAMICS','PHOTOGRAPHY','JEWELLERY'];
      const q=card.querySelector('q');if(q)q.textContent=categories[i%5];
      add(card,'beforeend','<span class="maker-note">From a local maker <b>↗</b></span>');
    });
    if(key==='income'){
      const bal=screen.querySelector('.bal');const label=bal.previousElementSibling;const box=document.createElement('div');box.className='balance-card';bal.before(box);if(label)box.append(label);
      // Move the balance itself into the card; source amounts are unchanged.
      box.append(bal);
      add(box,'beforeend','<span>Your skills, earning back.</span>');
      add(screen.querySelector('h2'),'afterend','<div class="earnings-strip" aria-hidden="true"><i></i><i></i><i></i></div>');
    }
    screen.querySelectorAll('.tabs button').forEach(b=>{if(b.textContent.trim()==='MY')b.lastChild.textContent='Profile';});
  }
  if (project === 'inn') {
    const steps=['flavor','alcohol','fragrance','taste'];
    if(steps.includes(key)){
      const n=steps.indexOf(key);const names=['Flavour','Strength','Aroma','Texture'];
      add(screen.querySelector('.progress'),'beforebegin',`<div class="blend-step"><span>YOUR SIGNATURE BLEND</span><b>0${n+1} / 04</b></div>`);
      add(screen.querySelector('.progress'),'afterend',`<div class="blend-steps">${names.map((s,i)=>`<span class="${i===n?'active':''}">${s}</span>`).join('')}</div>`);
      const selected=[['Sour','A bright, citrus-led start.'],['3–5%','Keeping things light.'],['Jasmine','A soft floral finish.'],['Bubble','A little sparkle in every sip.']][n];
      add(screen.querySelector('.pad'),'beforeend',`<div class="blend-summary"><small>YOUR PICK</small><strong>${selected[0]} <span>✓</span></strong><p>${selected[1]}</p></div>`);
      if(key==='flavor')screen.querySelectorAll('.tile').forEach((t,i)=>add(t,'afterbegin',`<span class="flavour-symbol" aria-hidden="true">${['◒','✳','◐','✦','≈','▧'][i]}</span>`));
    }
    if(key==='home'){
      add(screen.querySelector('.welcome'),'beforebegin','<div class="night-tag"><span>i² / TONIGHT</span><b>YOUR EVENING, YOUR PACE</b></div>');
      screen.querySelectorAll('.big').forEach((t,i)=>add(t,'beforeend',`<span class="home-tile-art" aria-hidden="true">${i?icon('<path d="m12 2 2.5 6.5L21 11l-6.5 2.5L12 20l-2.5-6.5L3 11l6.5-2.5z"/>'):cup}</span><span class="tile-arrow">↗</span>`));
      screen.querySelectorAll('.mid').forEach(t=>{t.style.color='var(--navy)';t.querySelector('small').style.color='var(--navy)';});
    }
    if(key==='select'){
      screen.querySelector('.table small').textContent='YOUR TABLE · 4 PEOPLE';
      add(screen.querySelector('.table'),'afterend','<div class="game-guidance"><b>Pick your kind of fun.</b><span>Join in, watch, or take a break.</span></div>');
    }
    if(key==='play'){
      const invite=screen.querySelector('.invite>div');
      invite.querySelector('h4').textContent='A little hello from Anthony';
      invite.querySelector('.uid').innerHTML='Anthony <span class="invite-status">WANTS TO PLAY</span>';
      invite.querySelector('.ask b').textContent='A toast to a new face';
      invite.querySelector('.yn button').textContent='Join in ↗';
      invite.querySelector('.yn button+button').textContent='Maybe later';
      add(invite.querySelector('.yn'),'afterend','<p class="invite-foot">No pressure. Your game will wait.</p>');
    }
    if(['reg1','reg2'].includes(key))add(screen.querySelector('.pad'),'beforeend','<p class="privacy-note">✳ Your preferences, your choice.<br>You can update them during the evening.</p>');
  }
};
