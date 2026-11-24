'use strict';
/* منصة التناغة — البيانات (localStorage لحد ما نربط Firebase) + لوحات الأدوار */
if(localStorage.getItem('tn_dark'))document.documentElement.classList.add('dk');
const TD=()=>new Date().toISOString().slice(0,10),DB='tn_db',
rd=()=>{try{return JSON.parse(localStorage.getItem(DB))||{}}catch(e){return{}}},
L=k=>rd()[k]||[],
S=(k,a)=>{const d=rd();d[k]=a;try{localStorage.setItem(DB,JSON.stringify(d));return true}catch(e){toast('المساحة ممتلئة، استخدم رابطًا بدل رفع الملف');return false}},
A=(k,o)=>S(k,[...L(k),{id:Date.now().toString(36)+Math.random().toString(36).slice(2,5),t:Date.now(),...o}]),
X=(k,id)=>S(k,L(k).filter(x=>x.id!==id)),
U=(k,id,p)=>S(k,L(k).map(x=>x.id===id?{...x,...p}:x)),
SB=()=>[...SUBJ.map(s=>s[1]),...L('subj').map(x=>x.n)],
byR=r=>users().filter(x=>x.role===r),
NM=p=>(users().find(x=>x.phone===p)||{}).name||p||'—',
yt=u=>{const m=/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/.exec(u||'');return m?m[1]:''},
okurl=u=>/^https?:\/\//i.test(u||''),
att=u=>{const a=L('att').filter(x=>!u||x.u===u);return a.length?Math.round(a.filter(x=>x.p).length/a.length*100)+'%':'—'},
avg=u=>{const g=L('subs').filter(s=>(!u||s.u===u)&&s.p!=null);return g.length?Math.round(g.reduce((a,s)=>a+s.p,0)/g.length)+'%':'—'},
NT=()=>L('notes').filter(n=>n.to==='all'||n.to===cur.role||n.to===cur.phone).reverse(),
PQ=t=>String(t||'').split('\n').map(l=>l.split('|').map(x=>x.trim())).filter(p=>p.length>=4&&p[0]).map(p=>{const a=+p.pop()-1,o=p.slice(1);return a>=0&&a<o.length?{q:p[0],o,a}:null}).filter(Boolean),
rf=f=>new Promise(r=>{if(!f||!f.size)return r('');if(f.size>1.2e6){toast('الملف أكبر من 1.2MB، استخدم رابطًا');return r(null)}const x=new FileReader();x.onload=()=>r(x.result);x.onerror=()=>r(null);x.readAsDataURL(f)}),
DAYS=['السبت','الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس'];
/* واجهة */
const H=(t,b)=>`<div class="pc"><h4>${t}</h4>${b}</div>`,E=m=>`<div class="em2">${m}</div>`,
ST3=a=>`<div class="st">${a.map(([l,v,i])=>`<div><i class="si">${ic(i||'chart')}</i><b>${v}</b><span>${l}</span></div>`).join('')}</div>`,
T=(h,r)=>r.length?`<div class="tw"><table><tr>${h.map(x=>`<th>${x}</th>`).join('')}</tr>${r.map(c=>`<tr>${c.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</table></div>`:E('لا توجد بيانات بعد'),
DEL=(c,i)=>`<button class="ib" data-a="del" data-c="${c}" data-i="${i}" aria-label="حذف">${ic('trash')}</button>`,
F=(n,fs,b,i='')=>`<form class="pf" data-f="${n}" data-i="${i}">${fs.map(([k,l,t,o])=>`<label>${l}</label>`+(t==='select'?`<select name="${k}">${o.map(x=>{const[v,s]=Array.isArray(x)?x:[x,x];return`<option value="${esc(v)}">${esc(s)}</option>`}).join('')}</select>`:t==='area'?`<textarea name="${k}" rows="4" placeholder="${esc(o||'')}"></textarea>`:`<input name="${k}" type="${t||'text'}"${t==='file'?` accept="${o||'application/pdf'}"`:''}${t==='number'?' min="0" step="any"':''}>`)).join('')}<button class="btn sm">${b}</button></form>`,
CH=()=>`<div class="cp"><button class="${ST.f?'':'on'}" data-a="flt" data-i="">الكل</button>${SB().map(s=>`<button class="${ST.f===s?'on':''}" data-a="flt" data-i="${esc(s)}">${esc(s)}</button>`).join('')}</div>`,
LC=l=>{const f=L('fav').some(x=>x.u===cur.phone&&x.l===l.id),b=l.ty==='video'?`<iframe class="yv" src="https://www.youtube.com/embed/${yt(l.url)}" allowfullscreen loading="lazy"></iframe>`:l.ty==='pdf'?`<a class="btn sm" ${l.data?`href="${l.data}" download="${esc(l.title)}.pdf"`:`href="${esc(l.url)}" target="_blank" rel="noopener"`}>فتح / تحميل الكتاب</a>`:`<p>${esc(l.txt)}</p>`;
 return`<div class="pc"><div class="rw"><b>${esc(l.title)}</b><span class="tg">${esc(l.sub)}</span><button class="ib ${f?'on':''}" data-a="fav" data-i="${l.id}" aria-label="مفضلة">${ic('star')}</button></div>${b}</div>`},
NW=()=>H('أخبار المدرسة',L('news').slice(-3).reverse().map(n=>`<div class="rw"><b>${esc(n.title)}</b></div><p>${esc(n.txt)}</p>`).join('')||E('لا توجد أخبار')),
NB=()=>H('آخر الإشعارات',NT().slice(0,3).map(n=>`<div class="rw"><b>${esc(n.txt)}</b><span class="tg">${esc(n.from||'')}</span></div>`).join('')||E('لا توجد إشعارات')),
chd=()=>users().find(x=>x.phone===cur.child&&x.role==='student'),
needCh=f=>chd()?f(chd()):E('حساب الابن غير مربوط بعد. رقم الابن المسجل: '+esc(cur.child||'—')+' — يجب أن يسجّل الابن حسابه أولًا بنفس الرقم.');
const TL=[['bell','الإشعارات','notes'],['users','الملف الشخصي','me'],['edit','الإعدادات','set']];
const DASH={
student:[['home','الرئيسية','home'],['book','المواد','subjects'],['video','الفيديوهات','videos'],['file','الكتب','books'],['edit','الواجبات','hw'],['edit','الامتحانات','exams'],['chart','الدرجات','grades'],['cal','الجدول','sched'],['search','البحث','search'],['star','المفضلة','favs'],...TL],
teacher:[['home','الرئيسية','home'],['up','رفع PDF','pdf'],['video','فيديو YouTube','vid'],['book','إدارة الدروس','lessons'],['file','الواجبات','tasg'],['edit','الامتحانات','texm'],['file','بنك الأسئلة','bank'],['users','الحضور','att'],['check','التصحيح','grading'],['chart','الإحصائيات','stats'],['bell','إرسال إشعار','send'],...TL],
parent:[['home','الرئيسية','home'],['users','حضور الابن','patt'],['chart','الدرجات','pgr'],['file','الواجبات','phw'],['msg','الرسائل','msgs'],['file','التقارير','rep'],...TL],
admin:[['home','الرئيسية','home'],['users','المستخدمون','usr'],['file','الأخبار','news'],['book','المواد والجدول','subj'],['chart','الإحصائيات والتقارير','stats'],['msg','الرسائل','msgs'],['bell','إرسال إشعار','send'],['up','النسخ الاحتياطي','bkp'],...TL]};
let K='home',ST={};const V={},HND={},ACT={};
const LV=t=>CH()+(L('lessons').filter(x=>t.includes(x.ty)&&(!ST.f||x.sub===ST.f)).reverse().map(LC).join('')||E('لا يوجد محتوى بعد — سيظهر فور رفع المدرسين له'));
/* الرئيسية */
V.home=()=>{const r=cur.role,p=cur.phone,my=L('subs').filter(z=>z.u===p);
 if(r==='student')return ST3([['دروس متاحة',L('lessons').length,'book'],['واجبات معلقة',L('assign').filter(a=>!my.some(z=>z.ref===a.id)).length,'file'],['متوسط الدرجات',avg(p),'chart']])+H('امتحانات متاحة',L('exams').filter(e=>!my.some(z=>z.ref===e.id)).map(e=>`<div class="rw"><b>${esc(e.title)}</b><span class="tg">${esc(e.sub)}</span></div>`).join('')||E('لا توجد امتحانات'))+NW()+NB();
 if(r==='teacher')return ST3([['الطلاب',byR('student').length,'users'],['الدروس المرفوعة',L('lessons').filter(l=>l.by===p).length,'up'],['امتحانات نشطة',L('exams').filter(e=>e.by===p).length,'edit']])+H('بانتظار التصحيح',`<b>${L('subs').filter(z=>z.k==='hw'&&z.p==null).length}</b> تسليم`)+NB();
 if(r==='parent')return needCh(c=>ST3([['نسبة الحضور',att(c.phone),'check'],['متوسط الدرجات',avg(c.phone),'chart'],['رسائل المدرسة',L('msgs').filter(m=>m.to===p).length,'msg']])+H('الابن',esc(c.name))+NB());
 return ST3([['المستخدمون',users().length,'users'],['الدروس',L('lessons').length,'book'],['رسائل جديدة',L('msgs').filter(m=>m.to==='school').length,'msg']])+NW()+NB()};
/* الطالب */
V.subjects=()=>LV(['video','pdf','text']);V.videos=()=>LV(['video']);V.books=()=>LV(['pdf']);
V.favs=()=>{const f=L('fav').filter(x=>x.u===cur.phone).map(x=>x.l);return L('lessons').filter(x=>f.includes(x.id)).map(LC).join('')||E('لم تضف شيئًا بعد — اضغط النجمة على أي درس')};
V.hw=()=>{const my=L('subs').filter(z=>z.u===cur.phone&&z.k==='hw');return L('assign').reverse().map(w=>{const z=my.find(q=>q.ref===w.id);return`<div class="pc"><div class="rw"><b>${esc(w.title)}</b><span class="tg">${esc(w.sub)}</span>${w.due?`<span class="tg">التسليم: ${esc(w.due)}</span>`:''}</div><p>${esc(w.desc)}</p>`+(z?`<div class="ok">تم التسليم ${z.p==null?'— بانتظار التصحيح':'— الدرجة: '+z.g+'/'+w.max}</div>`:F('hw',[['ans','إجابتك','area']],'تسليم',w.id))+'</div>'}).join('')||E('لا توجد واجبات')};
V.exams=()=>{if(ST.ex){const e=L('exams').find(x=>x.id===ST.ex);if(e)return H(esc(e.title),`<form class="pf" data-f="exam" data-i="${e.id}">${e.qs.map((q,k)=>`<div class="qq"><b>${k+1}. ${esc(q.q)}</b>${q.o.map((o,j)=>`<label class="ck"><input type="radio" name="q${k}" value="${j}"> ${esc(o)}</label>`).join('')}</div>`).join('')}<button class="btn sm">تسليم الامتحان</button></form>`)}
 const my=L('subs').filter(z=>z.u===cur.phone&&z.k==='exam');return L('exams').reverse().map(e=>{const z=my.find(q=>q.ref===e.id);return`<div class="pc"><div class="rw"><b>${esc(e.title)}</b><span class="tg">${esc(e.sub)}</span><span class="tg">${e.qs.length} سؤال</span></div>`+(z?`<div class="ok">درجتك: ${esc(z.txt)} (${z.p}%)</div>`:`<button class="btn sm" data-a="ex" data-i="${e.id}">ابدأ الامتحان</button>`)+'</div>'}).join('')||E('لا توجد امتحانات')};
V.grades=()=>ST3([['المتوسط',avg(cur.phone),'chart']])+H('درجاتي',T(['النوع','العنوان','المادة','النسبة'],L('subs').filter(z=>z.u===cur.phone).reverse().map(z=>[z.k==='exam'?'امتحان':'واجب',esc(z.title),esc(z.sub),z.p==null?'—':z.p+'%'])));
V.sched=()=>H('الجدول الدراسي',T(['اليوم','الوقت','المادة','المدرس'],L('sched').sort((a,b)=>DAYS.indexOf(a.day)-DAYS.indexOf(b.day)||(a.time||'').localeCompare(b.time||'')).map(s=>[s.day,esc(s.time),esc(s.sub),esc(s.tc)])));
V.search=()=>{const q=(ST.q||'').trim().toLowerCase(),m=s=>String(s||'').toLowerCase().includes(q);let r='';
 if(q){const l=L('lessons').filter(x=>m(x.title)||m(x.sub)||m(x.txt)),n=L('news').filter(x=>m(x.title)||m(x.txt)),a=L('assign').filter(x=>m(x.title)||m(x.desc)),e=L('exams').filter(x=>m(x.title));
  r=(l.length?'<h4 class="sh">الدروس</h4>'+l.map(LC).join(''):'')+(n.length?H('الأخبار',n.map(x=>`<b>${esc(x.title)}</b><p>${esc(x.txt)}</p>`).join('')):'')+(a.length?H('الواجبات',a.map(x=>`<div class="rw"><b>${esc(x.title)}</b></div>`).join('')):'')+(e.length?H('الامتحانات',e.map(x=>`<div class="rw"><b>${esc(x.title)}</b></div>`).join('')):'');if(!r)r=E('لا نتائج')}
 return`<form class="pf srch" data-f="q"><input name="q" value="${esc(ST.q||'')}" placeholder="ابحث في الدروس والأخبار والواجبات والامتحانات"><button class="btn sm">بحث</button></form>`+r};
/* المدرس */
V.pdf=()=>H('رفع كتاب / ملف PDF',F('pdf',[['title','العنوان'],['sub','المادة','select',SB()],['f','ملف PDF (حتى 1.2MB)','file'],['url','أو رابط الملف (للملفات الكبيرة)','url']],'رفع'));
V.vid=()=>H('إضافة فيديو YouTube',F('vid',[['title','العنوان'],['sub','المادة','select',SB()],['url','رابط YouTube','url']],'إضافة'));
V.lessons=()=>H('إضافة درس نصي',F('txt',[['title','العنوان'],['sub','المادة','select',SB()],['txt','محتوى الدرس','area']],'إضافة'))+H('كل المحتوى',L('lessons').reverse().map(l=>`<div class="rw"><b>${esc(l.title)}</b><span class="tg">${esc(l.sub)}</span><span class="tg">${{video:'فيديو',pdf:'PDF',text:'درس'}[l.ty]}</span>${DEL('lessons',l.id)}</div>`).join('')||E('لا يوجد محتوى'));
V.tasg=()=>H('إنشاء واجب',F('asg',[['title','العنوان'],['sub','المادة','select',SB()],['desc','الوصف','area'],['due','آخر موعد','date'],['max','الدرجة النهائية','number']],'نشر الواجب'))+H('الواجبات',L('assign').reverse().map(a=>`<div class="rw"><b>${esc(a.title)}</b><span class="tg">${esc(a.sub)}</span><span class="tg">${L('subs').filter(z=>z.ref===a.id).length} تسليم</span>${DEL('assign',a.id)}</div>`).join('')||E('لا توجد واجبات'));
const QH='السؤال | خيار 1 | خيار 2 | خيار 3 | رقم الإجابة الصحيحة (سطر لكل سؤال)';
V.texm=()=>H('إنشاء امتحان',F('exm',[['title','العنوان'],['sub','المادة','select',SB()],['qs','الأسئلة','area',QH],['n','أو أضف عددًا عشوائيًا من بنك الأسئلة','number']],'نشر الامتحان'))+H('الامتحانات',L('exams').reverse().map(e=>`<div class="rw"><b>${esc(e.title)}</b><span class="tg">${e.qs.length} سؤال</span><span class="tg">${L('subs').filter(z=>z.ref===e.id).length} طالب</span>${DEL('exams',e.id)}</div>`).join('')||E('لا توجد امتحانات'));
V.bank=()=>H('بنك الأسئلة',F('bnk',[['sub','المادة','select',SB()],['qs','الأسئلة','area',QH]],'إضافة للبنك'))+H('الأسئلة ('+L('bank').length+')',L('bank').reverse().map(q=>`<div class="rw"><b>${esc(q.q)}</b><span class="tg">${esc(q.sub)}</span>${DEL('bank',q.id)}</div>`).join('')||E('البنك فارغ'));
V.att=()=>{const st=byR('student'),d=TD(),c=L('att').filter(x=>x.d===d);return H('تسجيل الحضور',st.length?`<form class="pf" data-f="att"><label>التاريخ</label><input type="date" name="d" value="${d}">${st.map(s=>`<label class="ck"><input type="checkbox" name="s${s.phone}" ${c.some(x=>x.u===s.phone&&x.p)?'checked':''}> ${esc(s.name)} <small>${s.phone}</small></label>`).join('')}<button class="btn sm">حفظ الحضور (المحدد = حاضر)</button></form>`:E('لا يوجد طلاب مسجلون بعد'))};
V.grading=()=>{const a=L('assign');return H('تصحيح الواجبات',L('subs').filter(z=>z.k==='hw').reverse().map(z=>{const w=a.find(q=>q.id===z.ref)||{max:100};return`<div class="pc in"><div class="rw"><b>${esc(z.title)}</b><span class="tg">${esc(NM(z.u))}</span><span class="tg">${z.p==null?'بانتظار التصحيح':z.g+'/'+w.max}</span></div><p>${esc(z.txt)}</p>${F('gr',[['g','الدرجة (من '+w.max+')','number']],'حفظ الدرجة',z.id)}</div>`}).join('')||E('لا توجد تسليمات'))};
V.stats=()=>ST3([['طلاب',byR('student').length,'users'],['مدرسون',byR('teacher').length,'users'],['أولياء أمور',byR('parent').length,'users'],['دروس',L('lessons').length,'book'],['امتحانات',L('exams').length,'edit'],['تسليمات',L('subs').length,'file'],['متوسط الدرجات',avg(),'chart'],['نسبة الحضور',att(),'check']])+H('نتائج الامتحانات',T(['الامتحان','الطلاب','المتوسط'],L('exams').map(e=>{const s=L('subs').filter(z=>z.ref===e.id);return[esc(e.title),s.length,s.length?Math.round(s.reduce((a,z)=>a+z.p,0)/s.length)+'%':'—']})))+'<button class="btn sm ghost" data-a="print">طباعة التقرير</button>';
V.send=()=>H('إرسال إشعار',F('nt',[['to','إلى','select',[['all','الجميع'],['student','الطلاب'],['parent','أولياء الأمور'],['teacher','المدرسون']]],['txt','النص','area']],'إرسال'));
/* ولي الأمر */
V.patt=()=>needCh(c=>ST3([['نسبة الحضور',att(c.phone),'check']])+H('سجل حضور '+esc(c.name),T(['التاريخ','الحالة'],L('att').filter(x=>x.u===c.phone).sort((a,b)=>b.d.localeCompare(a.d)).map(x=>[x.d,x.p?'حاضر':'غائب']))));
V.pgr=()=>needCh(c=>ST3([['المتوسط',avg(c.phone),'chart']])+H('درجات '+esc(c.name),T(['النوع','العنوان','المادة','النسبة'],L('subs').filter(z=>z.u===c.phone).map(z=>[z.k==='exam'?'امتحان':'واجب',esc(z.title),esc(z.sub),z.p==null?'—':z.p+'%']))));
V.phw=()=>needCh(c=>H('واجبات '+esc(c.name),T(['الواجب','المادة','آخر موعد','الحالة'],L('assign').map(w=>{const z=L('subs').find(q=>q.ref===w.id&&q.u===c.phone);return[esc(w.title),esc(w.sub),esc(w.due||'—'),z?(z.p==null?'سُلّم':z.g+'/'+w.max):'لم يُسلَّم']}))));
V.rep=()=>needCh(c=>ST3([['الحضور',att(c.phone),'check'],['المتوسط',avg(c.phone),'chart'],['تسليمات',L('subs').filter(z=>z.u===c.phone).length,'file']])+H('تقرير '+esc(c.name),T(['العنوان','المادة','النسبة'],L('subs').filter(z=>z.u===c.phone).map(z=>[esc(z.title),esc(z.sub),z.p==null?'—':z.p+'%'])))+'<button class="btn sm ghost" data-a="print">طباعة</button>');
V.msgs=()=>{const ad=cur.role==='admin',p=cur.phone;if(ad)return H('رسائل أولياء الأمور',L('msgs').filter(m=>m.to==='school').reverse().map(m=>`<div class="pc in"><div class="rw"><b>${esc(NM(m.from))}</b><span class="tg">${m.from}</span></div><p>${esc(m.txt)}</p>${F('rp',[['txt','الرد','area']],'إرسال الرد',m.from)}</div>`).join('')||E('لا توجد رسائل'));
 return H('رسالة للمدرسة',F('ms',[['txt','رسالتك','area']],'إرسال'))+H('المحادثة',L('msgs').filter(m=>m.from===p||m.to===p).reverse().map(m=>`<div class="rw"><span class="tg">${m.from===p?'أنت':'المدرسة'}</span><b>${esc(m.txt)}</b></div>`).join('')||E('لا توجد رسائل'))};
/* المدير */
V.usr=()=>H('المستخدمون',T(['الاسم','الهاتف','النوع',''],users().map(u=>[esc(u.name),u.phone,ROLE[u.role],u.role==='admin'?'':`<button class="ib" data-a="du" data-i="${u.phone}" aria-label="حذف">${ic('trash')}</button>`])));
V.news=()=>H('إضافة خبر',F('nw',[['title','العنوان'],['txt','الخبر','area']],'نشر'))+H('الأخبار',L('news').reverse().map(n=>`<div class="rw"><b>${esc(n.title)}</b>${DEL('news',n.id)}</div>`).join('')||E('لا توجد أخبار'));
V.subj=()=>H('إضافة مادة',F('sj',[['n','اسم المادة']],'إضافة'))+H('المواد',SB().map(s=>`<span class="tg">${esc(s)}</span>`).join(' ')+L('subj').map(s=>DEL('subj',s.id)).join(''))+H('إضافة حصة للجدول',F('sc',[['day','اليوم','select',DAYS],['time','الوقت (مثال 8:00)'],['sub','المادة','select',SB()],['tc','المدرس']],'إضافة'))+H('الجدول',L('sched').map(s=>`<div class="rw"><b>${esc(s.day)} ${esc(s.time)}</b><span class="tg">${esc(s.sub)}</span>${DEL('sched',s.id)}</div>`).join('')||E('الجدول فارغ'));
V.bkp=()=>H('النسخ الاحتياطي',`<button class="btn sm" data-a="bk">تنزيل نسخة احتياطية</button>`+F('imp',[['f','استرجاع من ملف نسخة','file','application/json']],'استرجاع'));
/* مشترك */
V.notes=()=>H('الإشعارات',NT().map(n=>`<div class="rw"><b>${esc(n.txt)}</b><span class="tg">${esc(n.from||'')}</span></div>`).join('')||E('لا توجد إشعارات'));
V.me=()=>H('الملف الشخصي',`<div class="rw"><b>${esc(cur.name)}</b><span class="tg">${ROLE[cur.role]}</span><span class="tg">${cur.phone}</span></div>`+F('pf',[['name','تغيير الاسم'],['pw','كلمة مرور جديدة (اختياري)','password']],'حفظ'));
V.set=()=>H('الإعدادات',`<div class="rw"><b>الوضع الليلي</b><button class="btn sm ghost" data-a="dark">${document.documentElement.classList.contains('dk')?'إيقاف':'تشغيل'}</button></div><div class="rw"><b>تسجيل الخروج</b><button class="btn sm ghost" data-a="out">خروج</button></div>`+(cur.role==='admin'?`<div class="rw"><b>مسح كل بيانات المنصة</b><button class="btn sm ghost" data-a="reset">مسح</button></div>`:''));
/* معالجات النماذج */
HND.q=o=>{ST.q=o.q;go()};
HND.hw=(o,i)=>{const w=L('assign').find(x=>x.id===i);if(!w||!(o.ans||'').trim()||L('subs').some(z=>z.ref===i&&z.u===cur.phone))return;A('subs',{k:'hw',ref:i,u:cur.phone,title:w.title,sub:w.sub,p:null,txt:o.ans});toast('تم التسليم');go()};
HND.exam=(o,i)=>{const e=L('exams').find(x=>x.id===i);if(!e||L('subs').some(z=>z.ref===i&&z.u===cur.phone))return;let c=0;e.qs.forEach((q,k)=>{if(+o['q'+k]===q.a)c++});A('subs',{k:'exam',ref:i,u:cur.phone,title:e.title,sub:e.sub,p:Math.round(c/e.qs.length*100),txt:c+'/'+e.qs.length});toast('درجتك '+c+' من '+e.qs.length);ST={};go()};
HND.pdf=async o=>{const d=await rf(o.f);if(d===null)return;if(!o.title||(!d&&!okurl(o.url)))return toast('اكتب العنوان وارفع ملف PDF أو ضع رابطًا صحيحًا');A('lessons',{ty:'pdf',title:o.title,sub:o.sub,data:d,url:o.url,by:cur.phone});toast('تم الرفع');go()};
HND.vid=o=>{if(!yt(o.url))return toast('رابط YouTube غير صحيح');A('lessons',{ty:'video',title:o.title||'فيديو',sub:o.sub,url:o.url,by:cur.phone});toast('تمت الإضافة');go()};
HND.txt=o=>{if(!o.title||!o.txt)return toast('اكتب العنوان والمحتوى');A('lessons',{ty:'text',title:o.title,sub:o.sub,txt:o.txt,by:cur.phone});toast('تمت الإضافة');go()};
HND.asg=o=>{if(!o.title)return toast('اكتب العنوان');A('assign',{title:o.title,sub:o.sub,desc:o.desc,due:o.due,max:+o.max||100,by:cur.phone});toast('تم النشر');go()};
HND.exm=o=>{let qs=PQ(o.qs);const n=+o.n||0;if(n)qs=qs.concat(L('bank').filter(x=>x.sub===o.sub).sort(()=>Math.random()-.5).slice(0,n).map(x=>({q:x.q,o:x.o,a:x.a})));if(!o.title||!qs.length)return toast('اكتب العنوان وسؤالًا صحيح الصيغة على الأقل');A('exams',{title:o.title,sub:o.sub,qs,by:cur.phone});toast('تم إنشاء الامتحان');go()};
HND.bnk=o=>{const q=PQ(o.qs);if(!q.length)return toast('صيغة الأسئلة غير صحيحة');q.forEach(x=>A('bank',{...x,sub:o.sub}));toast('أُضيف '+q.length+' سؤال');go()};
HND.att=o=>{const d=o.d||TD();S('att',[...L('att').filter(x=>x.d!==d),...byR('student').map(s=>({id:s.phone+d,d,u:s.phone,p:o['s'+s.phone]==='on'}))]);toast('تم حفظ الحضور')};
HND.gr=(o,i)=>{const z=L('subs').find(x=>x.id===i),w=z&&L('assign').find(x=>x.id===z.ref),g=+o.g;if(!z||o.g===''||isNaN(g))return toast('اكتب الدرجة');const mx=(w&&w.max)||100;U('subs',i,{g,p:Math.min(100,Math.round(g/mx*100))});A('notes',{to:z.u,txt:'تم تصحيح: '+z.title,from:'النظام'});toast('تم الحفظ');go()};
HND.nt=o=>{if(!o.txt)return;A('notes',{to:o.to,txt:o.txt,from:cur.name});toast('تم الإرسال')};
HND.ms=o=>{if(!o.txt)return;A('msgs',{from:cur.phone,to:'school',txt:o.txt});toast('تم الإرسال');go()};
HND.rp=(o,i)=>{if(!o.txt)return;A('msgs',{from:'school',to:i,txt:o.txt});toast('تم الرد');go()};
HND.nw=o=>{if(!o.title)return;A('news',{title:o.title,txt:o.txt});toast('تم النشر');go()};
HND.sj=o=>{if(!o.n)return;A('subj',{n:o.n.trim()});go()};
HND.sc=o=>{if(!o.time)return toast('اكتب الوقت');A('sched',o);go()};
HND.pf=async o=>{const a=users(),u=a.find(x=>x.phone===cur.phone);if(!u)return;if(o.name)u.name=o.name.trim();if(o.pw){if(o.pw.length<6)return toast('كلمة المرور 6 أحرف على الأقل');u.pw=await hash(o.pw)}localStorage.setItem('tn_users',JSON.stringify(a));cur=u;toast('تم الحفظ')};
HND.imp=async o=>{const f=o.f;if(!f||!f.size)return;try{const j=JSON.parse(await f.text());if(!j||typeof j.db!=='object'||!Array.isArray(j.users))throw 0;localStorage.setItem(DB,JSON.stringify(j.db));localStorage.setItem('tn_users',JSON.stringify(j.users));toast('تم الاسترجاع');go()}catch(e){toast('ملف غير صالح')}};
/* أزرار */
ACT.flt=i=>{ST.f=i;go()};ACT.ex=i=>{ST.ex=i;go()};ACT.print=()=>print();ACT.out=()=>askOut();
ACT.fav=i=>{const f=L('fav'),h=f.some(x=>x.u===cur.phone&&x.l===i);S('fav',h?f.filter(x=>!(x.u===cur.phone&&x.l===i)):[...f,{u:cur.phone,l:i}]);go()};
ACT.del=(i,d)=>{if(confirm('تأكيد الحذف؟')){X(d.c,i);go()}};
ACT.du=i=>{if(confirm('حذف هذا المستخدم؟')){localStorage.setItem('tn_users',JSON.stringify(users().filter(u=>u.phone!==i||u.role==='admin')));go()}};
ACT.dark=()=>{localStorage.setItem('tn_dark',document.documentElement.classList.toggle('dk')?'1':'');go()};
ACT.reset=()=>{if(confirm('سيتم مسح الدروس والامتحانات والدرجات وكل شيء. متأكد؟')){localStorage.removeItem(DB);go()}};
ACT.bk=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({db:rd(),users:users()})],{type:'application/json'}));a.download='backup-'+TD()+'.json';a.click()};
function go(){const b=$('#pbox');if(!b)return;b.innerHTML=(V[K]||V.home)();b.onclick=e=>{const x=e.target.closest('[data-a]');if(x&&ACT[x.dataset.a])ACT[x.dataset.a](x.dataset.i,x.dataset)};
 b.querySelectorAll('form[data-f]').forEach(f=>f.onsubmit=async e=>{e.preventDefault();const h=HND[f.dataset.f];if(h)await h(Object.fromEntries(new FormData(f)),f.dataset.i)})}
function tnGo(k){K=k;ST={};go();scrollTo(0,0)}
/* أيقونات إضافية + مدير افتراضي + تحديث تلقائي */
document.addEventListener('DOMContentLoaded',()=>document.body.insertAdjacentHTML('beforeend','<svg width="0" height="0" style="position:absolute" aria-hidden="true"><symbol id="i-star" viewBox="0 0 24 24"><path d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-2.9-5.4 2.9 1.1-6L3.2 9.4l6.1-.8z"/></symbol><symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></symbol><symbol id="i-trash" viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></symbol></svg>'));
setTimeout(async()=>{const a=users();if(!a.some(x=>x.role==='admin')){a.push({role:'admin',name:'المدير',phone:'01000000000',pw:await hash('admin123')});try{localStorage.setItem('tn_users',JSON.stringify(a))}catch(e){}}},0);
(()=>{try{navigator.serviceWorker&&navigator.serviceWorker.getRegistrations().then(r=>r.forEach(x=>x.unregister()));window.caches&&caches.keys().then(k=>k.forEach(x=>caches.delete(x)));
 const chk=async()=>{try{const r=await fetch('version.json?_='+Date.now(),{cache:'no-store'});if(!r.ok)return;const v=(await r.json()).v,o=localStorage.getItem('tn_v');localStorage.setItem('tn_v',v);if(o&&o!==v&&!sessionStorage.getItem('tn_r'+v)){sessionStorage.setItem('tn_r'+v,1);location.reload()}}catch(e){}};
 chk();setInterval(chk,12e4);document.addEventListener('visibilitychange',()=>{if(!document.hidden)chk()})}catch(e){}})();
