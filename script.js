// header shadow on scroll
const header=document.getElementById('top');
addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>10));

// mobile menu
const menuBtn=document.getElementById('menuBtn'),navlinks=document.getElementById('navlinks');
menuBtn.addEventListener('click',()=>navlinks.classList.toggle('open'));
navlinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>navlinks.classList.remove('open')));

// scroll reveal
const io=new IntersectionObserver((es)=>{
  es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// faq accordion
document.querySelectorAll('.faq-q').forEach(q=>{
  q.addEventListener('click',()=>{
    const item=q.parentElement,a=item.querySelector('.faq-a');
    const open=item.classList.toggle('open');
    a.style.maxHeight=open?a.scrollHeight+'px':0;
  });
});

// year
document.getElementById('year').textContent=new Date().getFullYear();

// ===== carrossel do painel "em dia" =====
(function(){
  const checkSVG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>';
  const cases=[
    {biz:'Padaria Pão Quente ME', rows:[['Contas PJ e PF','separadas'],['Fluxo de caixa','organizado'],['Preço de venda','revisado'],['Reserva do mês','feita']]},
    {biz:'Studio Bela Hair', rows:[['Despesas fixas','mapeadas'],['Margem de lucro','definida'],['Fluxo de caixa','em dia'],['Meta do mês','no caminho']]},
    {biz:'Norte Móveis (loja online)', rows:[['Capital de giro','sob controle'],['Precificação','ajustada'],['Fluxo de caixa','organizado'],['Relatório financeiro','enviado']]},
    {biz:'Helena Lima Estética', rows:[['Contas PJ e PF','separadas'],['Custos','mapeados'],['Sobra mensal','+18%'],['Planejamento','em dia']]}
  ];
  const biz=document.getElementById('panelBiz'),
        rowsEl=document.getElementById('panelRows'),
        dotsEl=document.getElementById('panelDots'),
        stage=document.querySelector('.panel-stage');
  if(!biz||!rowsEl||!dotsEl) return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let idx=0,timer=null;

  function paint(i){
    const c=cases[i];
    biz.textContent=c.biz;
    rowsEl.innerHTML=c.rows.map(r=>
      '<div class="check-row"><div class="check">'+checkSVG+'</div><div class="txt">'+r[0]+'</div><div class="sub">'+r[1]+'</div></div>'
    ).join('');
    const rows=[...rowsEl.children];
    if(reduce){rows.forEach(el=>el.classList.add('row-in'));}
    else{requestAnimationFrame(()=>rows.forEach((el,k)=>{el.style.transitionDelay=(k*70)+'ms';el.classList.add('row-in');}));}
    [...dotsEl.children].forEach((d,k)=>{d.classList.toggle('active',k===i);d.setAttribute('aria-selected',k===i);});
  }
  function go(i){
    idx=(i+cases.length)%cases.length;
    if(reduce){paint(idx);return;}
    biz.classList.add('is-out');
    rowsEl.style.opacity='0';rowsEl.style.transition='opacity .24s ease';
    setTimeout(()=>{
      paint(idx);
      requestAnimationFrame(()=>{biz.classList.remove('is-out');rowsEl.style.opacity='1';});
    },260);
  }
  function start(){if(reduce||timer)return;timer=setInterval(()=>go(idx+1),3800);}
  function stop(){if(timer){clearInterval(timer);timer=null;}}

  cases.forEach((c,k)=>{
    const b=document.createElement('button');
    b.setAttribute('role','tab');
    b.setAttribute('aria-label',c.biz);
    b.addEventListener('click',()=>{stop();go(k);start();});
    dotsEl.appendChild(b);
  });

  stage.addEventListener('mouseenter',stop);
  stage.addEventListener('mouseleave',start);
  stage.addEventListener('focusin',stop);
  stage.addEventListener('focusout',start);

  paint(0);
  start();
})();