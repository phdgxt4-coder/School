'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const LOGO='<img class="logo" src="assets/images/logo.jpg" alt="شعار المدرسة" width="40" height="40">';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ic=n=>`<svg class="ic"><use href="#i-${n}"/></svg>`;
const ROLE={student:'طالب',teacher:'مدرس',parent:'ولي أمر',admin:'مدير'};
const SUBJ=[['math','رياضيات'],['book','لغة عربية'],['globe','لغة إنجليزية'],['atom','فيزياء'],['flask','كيمياء'],['leaf','أحياء'],['hist','تاريخ'],['map','جغرافيا']];
const NEWS=[['إعلان','بدء التسجيل على المنصة','يمكن للطلاب وأولياء الأمور والمدرسين إنشاء حساباتهم الآن.'],['دراسة','المحتوى التعليمي','سيتم رفع الدروس والفيديوهات تباعًا من المدرسين.'],['امتحانات','الامتحانات الإلكترونية','امتحانات بتصحيح تلقائي ونتائج فورية.']];
const ROLES=[['student','طالب','دروس وامتحانات وواجبات ودرجاتك في مكان واحد.'],['teacher','مدرس','ارفع الدروس والفيديوهات وأنشئ الامتحانات وسجّل الحضور.'],['parent','ولي أمر','تابع حضور ابنك ودرجاته ورسائل المدرسة.']];
const IL={student:'<rect x="30" y="38" width="100" height="44" rx="8" fill="#e8f6fa"/><circle cx="80" cy="24" r="14" fill="#1f7f95"/><rect x="46" y="48" width="68" height="6" rx="3" fill="#5cc3d9"/><rect x="46" y="62" width="44" height="6" rx="3" fill="#c9a24b" opacity=".6"/>',
teacher:'<rect x="20" y="10" width="120" height="58" rx="8" fill="#e8f6fa"/><path d="M40 52l22-20 18 14 26-24" fill="none" stroke="#1f7f95" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><rect x="62" y="74" width="36" height="6" rx="3" fill="#0b2545"/>',
parent:'<circle cx="56" cy="30" r="14" fill="#0b2545"/><circle cx="100" cy="40" r="10" fill="#5cc3d9"/><rect x="34" y="50" width="44" height="30" rx="14" fill="#1f7f95"/><rect x="84" y="54" width="32" height="26" rx="12" fill="#e8f6fa"/>'};
/* helpers */
function toast(t){const m=document.createElement('div');m.className='msg';m.textContent=t;document.body.append(m);setTimeout(()=>m.remove(),2200)}
function view(v){const f=()=>{['login','app'].forEach(x=>$('#'+x).classList.toggle('on',x===v));$('#site').style.display=v?'none':'';scrollTo(0,0)};document.startViewTransition&&!matchMedia('(prefers-reduced-motion:reduce)').matches?document.startViewTransition(f):f()}
document.addEventListener('click',e=>{const b=e.target.closest('.btn,.qa button');if(!b)return;const r=b.getBoundingClientRect(),s=document.createElement('span'),d=Math.max(r.width,r.height);
 s.className='rp';s.style.cssText=`width:${d}px;height:${d}px;left:${e.clientX-r.left-d/2}px;top:${e.clientY-r.top-d/2}px`;b.append(s);setTimeout(()=>s.remove(),600)});
/* landing content */
const sk=n=>Array(n).fill('<div class="card"><div class="sk" style="width:40%"></div><div class="sk"></div><div class="sk" style="width:70%"></div></div>').join('');
const RI={student:'book',teacher:'up',parent:'users'};
$('#roleGrid').innerHTML=sk(3);$('#subGrid').innerHTML=sk(8);$('#newsGrid').innerHTML=sk(3);
$('#stats').innerHTML=[[3,'صفوف دراسية'],[8,'مواد'],[100,'درس ومحتوى (هدف)'],[24,'ساعة متاحة يوميًا']].map(([n,l])=>`<div><b data-n="${n}">0</b><span>${l}</span></div>`).join('');
setTimeout(()=>{
$('#roleGrid').innerHTML=ROLES.map(([k,t,d])=>`<button class="card role" data-login data-r="${k}"><span class="ico">${ic(RI[k])}</span><h4>${t}</h4><p>${d}</p><span class="go">دخول ${ic('arrow')}</span></button>`).join('');
$('#subGrid').innerHTML=SUBJ.map(([i,t],k)=>`<a class="card sub" href="subject.html?s=${k}"><div class="ico">${ic(i)}</div><h4>${t}</h4></a>`).join('');
$('#newsGrid').innerHTML=NEWS.map(([g,t,d],k)=>`<a class="card news" href="news.html?n=${k}"><div class="ph"></div><span class="tag">${g}</span><h4>${t}</h4><p>${d}</p></a>`).join('')},650);
/* spotlight */
document.addEventListener('pointermove',e=>{const c=e.target.closest&&e.target.closest('.card');if(c){const r=c.getBoundingClientRect();c.style.setProperty('--x',e.clientX-r.left+'px');c.style.setProperty('--y',e.clientY-r.top+'px')}},{passive:true});
/* nav + scroll */
const nav=$('#nav'),pg=$('#pg');
addEventListener('scroll',()=>{nav.classList.toggle('s',scrollY>20);pg.style.transform=`scaleX(${scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)})`},{passive:true});
$('#burger').onclick=()=>$('#links').classList.toggle('o');$$('#links a').forEach(a=>a.onclick=()=>$('#links').classList.remove('o'));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');io.unobserve(e.target);e.target.querySelectorAll('[data-n]').forEach(count)}),{threshold:.12});
$$('.rv').forEach(el=>io.observe(el));
function count(el){const t=+el.dataset.n,s=performance.now();(function f(n){const p=Math.min((n-s)/1400,1);el.textContent=Math.round(t*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(s)}
/* auth + session (demo: بيانات محلية على نفس الجهاز لحد ما نربط Firebase) */
let role='student',signup=false,cur=null;
const SK='tn_sess',TTL=432e5; /* الجلسة 12 ساعة */
async function hash(s){try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}catch(e){return btoa(unescape(encodeURIComponent(s)))}}
const users=()=>{try{const a=JSON.parse(localStorage.getItem('tn_users')||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}};
const saveSess=u=>{try{localStorage.setItem(SK,JSON.stringify({p:u.phone,r:u.role,e:Date.now()+TTL}))}catch(e){}};
const clearSess=()=>{try{localStorage.removeItem(SK);localStorage.removeItem('tn_cur');sessionStorage.clear()}catch(e){}};
/* التحقق من الجلسة: شكل البيانات + الانتهاء + وجود المستخدم + تطابق الدور */
function session(){try{const s=JSON.parse(localStorage.getItem(SK));if(!s||typeof s.p!=='string'||s.e<Date.now())return null;return users().find(x=>x.phone===s.p&&x.role===s.r&&DASH[x.role])||null}catch(e){return null}}
function mode(s){signup=s;$('#lt').textContent=s?'إنشاء حساب':'تسجيل الدخول';$('#nmWrap').hidden=!s;$('#sw').textContent=s?'لديك حساب؟ تسجيل الدخول':'ليس لديك حساب؟ إنشاء حساب';$('#er').textContent='';chw()}
const chw=()=>{$('#chWrap').hidden=!(signup&&role==='parent')};
function setRole(r){role=r;chw();$$('#seg button').forEach(b=>b.classList.toggle('on',b.dataset.r===r))}
$$('#seg button').forEach(b=>b.onclick=()=>setRole(b.dataset.r));
document.addEventListener('click',e=>{const b=e.target.closest('[data-login]');if(!b)return;if(b.dataset.r)setRole(b.dataset.r);mode(b.dataset.login==='signup');view('login')});
$$('[data-home]').forEach(b=>b.onclick=()=>view(''));
$('#sw').onclick=()=>mode(!signup);
$('#go').onclick=async()=>{const er=$('#er'),ph=$('#ph').value.trim(),pw=$('#pw').value,nm=$('#nm').value.trim();
 if(!/^01\d{9}$/.test(ph))return er.textContent='رقم الهاتف غير صحيح (11 رقم يبدأ بـ 01)';
 if(pw.length<6)return er.textContent='كلمة المرور لا تقل عن 6 أحرف';
 const h=await hash(pw),a=users();let u;
 if(signup){if(role==='admin')return er.textContent='لا يمكن إنشاء حساب مدير';if(!nm)return er.textContent='اكتب اسمك';const ch=($('#ch').value||'').trim();if(role==='parent'&&!/^01\d{9}$/.test(ch))return er.textContent='اكتب رقم هاتف الابن (11 رقم) المسجل في المنصة';if(a.some(x=>x.phone===ph))return er.textContent='هذا الرقم مسجل من قبل';
  u={role,name:nm,phone:ph,pw:h};if(role==='parent')u.child=ch;a.push(u);try{localStorage.setItem('tn_users',JSON.stringify(a))}catch(e){}}
 else{u=a.find(x=>x.phone===ph&&x.pw===h);if(!u)return er.textContent='الرقم أو كلمة المرور غير صحيحة'}
 saveSess(u);$('#pw').value='';er.textContent='';openApp(u,true)};
/* logout: مسح الجلسة والبيانات + إفراغ الـ Dashboard + استبدال خانة السجل حتى لا يرجع بها زر الرجوع */
function logout(){cur=null;clearSess();$('#app').innerHTML='';view('');history.replaceState(null,'',location.pathname+location.search);toast('تم تسجيل الخروج')}
const askOut=()=>{if(confirm('هل تريد تسجيل الخروج؟'))logout()};
/* حماية المسار: تُفحص عند التحميل والرجوع/الأمام وعودة الصفحة من الكاش وتغيّر التخزين (تبويب آخر) وعودة التبويب للواجهة */
function check(){const u=session(),inApp=$('#app').classList.contains('on');
 if(!u){if(inApp||cur||location.hash==='#dashboard')logout();return}
 if(location.hash==='#dashboard'&&!inApp)openApp(u);else if(inApp&&location.hash!=='#dashboard')view('')}
addEventListener('popstate',check);addEventListener('pageshow',e=>{if(e.persisted)check()});
addEventListener('storage',e=>{if(e.key===SK||e.key==='tn_users')check()});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)check()});setInterval(check,6e4);
/* dashboard (المحتوى في platform.js) */
function openApp(u,fresh){if(!session())return logout();cur=u;const d=DASH[u.role],nm=esc(u.name);
 if(location.hash!=='#dashboard')history[fresh?'pushState':'replaceState'](null,'','#dashboard');
 const out=`<button class="out" type="button" data-out>${ic('out')}تسجيل الخروج</button>`;
 $('#app').innerHTML=`<aside class="side" id="side"><a class="brand">${LOGO}<span>التناغة الشرقية<small>${ROLE[u.role]}</small></span></a>
 <nav class="snav">${d.map(([i,t,k],j)=>`<a data-k="${k}" class="${j?'':'on'}">${ic(i)}${t}</a>`).join('')}</nav>${out}</aside><div class="scrim" id="scrim"></div>
 <div class="main"><div class="topb"><button class="mb" id="mb" aria-label="القائمة">${ic('menu')}</button><h3>أهلاً ${nm}</h3><span style="color:var(--mu)">${ic('bell')}</span><div class="av">${esc((u.name||'؟')[0])}</div>
 <button class="out out-t" type="button" data-out aria-label="تسجيل الخروج">${ic('out')}<span><span class="lg">تسجيل </span>الخروج</span></button></div><div id="pbox" class="pbox"></div></div>`;
 view('app');
 $$('[data-out]').forEach(b=>b.onclick=askOut);
 const side=$('#side'),shut=()=>side.classList.remove('o');
 $('#mb').onclick=()=>side.classList.toggle('o');$('#scrim').onclick=shut;
 $$('.snav a').forEach(a=>a.onclick=()=>{$$('.snav a').forEach(x=>x.classList.remove('on'));a.classList.add('on');shut();tnGo(a.dataset.k)});
 tnGo('home')}
const u0=session();u0?openApp(u0):check();
if(!u0&&/^#(login|signup)$/.test(location.hash)){mode(location.hash==='#signup');view('login')}
