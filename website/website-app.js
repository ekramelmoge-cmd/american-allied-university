// AAU website only. No learning records or campus APIs are loaded here.
let route='university';
function websiteLocation(){
 const [path,query='']=location.hash.slice(1).split('?');
 return {parts:path.split('/'),query:new URLSearchParams(query).get('q')||''};
}
function renderWebsite(){
 const {parts,query}=websiteLocation();const [next,id,section]=parts;
 
 const campus=['dashboard','courses','course','grades','inbox','calendar','people','studio','offerings'];
 if(campus.includes(next)){location.replace('https://aau-learning-campus.ekramelmoge.chatgpt.site/sovora'+location.hash);return;}
 route=!next?'university':universityRoutes.includes(next)?next:'not-found';
 const sections=['overview','curriculum','learning','admissions','questions'];
 if(route==='program'&&(!['business','ai','leadership','education'].includes(id)||(section&&!sections.includes(section))||parts.length>3))route='not-found';
 else if(route==='academic-course'&&(!['human-capital','digital-infrastructure'].includes(id)||(id==='human-capital'&&parts.length>2)||(id==='digital-infrastructure'&&((section&&section!=='week1')||parts.length>3))))route='not-found';
 else if(route==='resources'&&((id&&!['calendar','catalog','policies','contact'].includes(id))||parts.length>2))route='not-found';
 else if(!['program','academic-course','resources','not-found'].includes(route)&&parts.length>1)route='not-found';
 if(route==='info')prepareInquiryProgram(new URLSearchParams(location.hash.split('?')[1]||'').get('program'));
 document.title=route==='university'?'American Allied University':universityPageLabel()+' | American Allied University';
 document.querySelector('#app').innerHTML=renderUniversity();mountInquiryPage();
 if(route==='search'&&query){document.querySelector('#page-search').value=query;showWebsiteSearch(query);}
}
function scrollWebsiteSection(focus=false){
 const section=websiteLocation().parts[2];
 const target=route==='program'&&section?document.getElementById('program-'+section):route==='academic-course'&&section==='week1'?document.getElementById('course-week1'):null;
 if(target)target.scrollIntoView();else window.scrollTo(0,0);
 if(focus){const heading=(target||document.querySelector('#main-content')).querySelector('h1,h2');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}}
}
window.addEventListener('hashchange',()=>{renderWebsite();scrollWebsiteSection(true);});
document.addEventListener('click',e=>{if(e.target.closest('[data-skip]')){e.preventDefault();document.querySelector('#main-content').focus();}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const menu=document.querySelector('.uni-mobile-menu[open],.uni-admin-menu[open]');if(menu){menu.open=false;menu.querySelector('summary').focus();}}});

const websiteIndex=[['academic-course/digital-infrastructure','Digital Infrastructure Operations Lab','AI infrastructure datacenter cloud networking servers storage operations curriculum lab week 1 incident service map'],['program/ai','Master’s in Artificial Intelligence','AI data machine learning evaluation implementation governance curriculum requirements'],['program/leadership','Master’s in Leadership','Organizational leadership change strategy execution curriculum requirements'],['program/education','Master of Education','Learning instructional educational leadership improvement curriculum requirements'],['program/business','Master of Business Administration','MBA graduate strategy finance leadership curriculum requirements'],['academic-course/human-capital','Human Capital Management course preview','Talent performance development succession hiring selection rewards culture engagement retention MBA'],['programs','Academic Programs','Graduate study business administration MBA artificial intelligence AI leadership education masters degrees'],['learning','Student Experience','Online study learning teaching readings assignments feedback technology advising support'],['admissions','Become a Student','Apply application requirements eligibility enrollment intake admission'],['tuition','Tuition & Fees','Cost fees payment tuition-free scholarship financial aid'],['about','About AAU','Institution authorization accreditation status university mission vision values purpose access integrity innovation student success'],['resources/calendar','Academic Calendar','Dates terms deadlines registration examinations'],['resources/catalog','Academic Catalog','Credit course requirements catalog'],['resources/policies','Policies & Documents','Privacy academic integrity refund appeals withdrawal'],['resources/contact','Contact Information','Contact email phone help'],['faq','Common Questions','Answers frequently asked questions'],['info','Request Information','Inquiry prospective student information']];
function showWebsiteSearch(query){const normalized=query.trim().toLowerCase();const words=normalized.split(/\s+/).filter(Boolean);const matches=websiteIndex.filter(([path,title,terms])=>words.every(w=>(path+' '+title+' '+terms).toLowerCase().includes(w)));const result=document.querySelector('#search-results');if(!result)return;const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));result.innerHTML='<p class="subtitle">'+matches.length+' result'+(matches.length===1?'':'s')+' for “'+escape(query)+'”</p>'+matches.map(([path,title])=>'<a class="uni-search-result" href="#'+path+'"><h2>'+title+'</h2><span>View page</span></a>').join('')+(!matches.length?'<p>Try a broader topic such as programs, admissions, fees, or accreditation.</p>':'');}
document.addEventListener('submit',e=>{
 if(!e.target.matches('.uni-search-form'))return;e.preventDefault();
 const query=String(new FormData(e.target).get('q')||'').trim();if(!query)return;
 const next='#search?q='+encodeURIComponent(query);
 if(location.hash===next)showWebsiteSearch(query);else location.hash=next;
});
document.addEventListener('click',e=>{const button=e.target.closest('[data-faq-category]');if(!button)return;document.querySelectorAll('[data-faq-category]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));const category=button.dataset.faqCategory;document.querySelector('#faq-results').innerHTML=universityFAQs(aauQuestions.filter(q=>category==='All'||q.category===category).map(q=>[q.q,q.a]));});

renderWebsite();scrollWebsiteSection();

// Preserve footer groups on desktop; collapse them when entering the phone layout.
if(window.matchMedia){window.matchMedia('(max-width:640px)').addEventListener('change',e=>{document.querySelectorAll('.uni-footer-group').forEach(group=>{group.open=!e.matches;});});}
