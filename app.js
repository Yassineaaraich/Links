const grid = document.getElementById('grid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const sidebar = document.getElementById('sidebar');

const modal = document.getElementById('movieModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalRating = document.getElementById('modalRating');
const watchBtn = document.getElementById('watchBtn');
const closeModal = document.getElementById('closeModal');

document.getElementById('openSlider').addEventListener('click',()=> sidebar.classList.add('open'));
document.getElementById('closeSlider').addEventListener('click',()=> sidebar.classList.remove('open'));

// تحميل ملف JSON بشكل آمن حتى لو الاسم يحتوي فراغات
async function loadJSONSafe(filename){
  const variants=[filename,`./${filename}`,encodeURIComponent(filename),`./${encodeURIComponent(filename)}`];
  for(const v of variants){
    try{
      const res=await fetch(v);
      if(res.ok) return await res.json();
    }catch{}
  }
  return [];
}

// تحميل الملفين
let allMovies=[];
async function loadMovies(){
  const m1=await loadJSONSafe('movies (1).json');
  const m2=await loadJSONSafe('movies (2).json');
  allMovies=[...(m1||[]),...(m2||[])];
  renderMovies(allMovies);
}

// عرض الأفلام
function renderMovies(list){
  grid.innerHTML='';
  if(!list.length){
    grid.innerHTML='<p style="color:#9faec5;text-align:center">لا توجد نتائج</p>';
    return;
  }
  list.forEach(m=>{
    const card=document.createElement('div');
    card.className='card';
    card.innerHTML=`
      <img src="${m.image||''}" alt="${m.title||''}">
      <h3>${m.title||'بدون عنوان'}</h3>
    `;
    card.addEventListener('click',()=>openMovie(m));
    grid.appendChild(card);
  });
}

// فتح نافذة الفيلم
function openMovie(m){
  modalImage.src=m.image||'';
  modalTitle.textContent=m.title||'بدون عنوان';
  const rating=(Math.random()*(9-6)+6).toFixed(1);
  modalRating.textContent=`التقييم: ${rating} / 10`;
  watchBtn.href=m.embed || (m.video_data && m.video_data.embed) || '#';
  modal.classList.add('show');
}

// إغلاق المودال
closeModal.addEventListener('click',()=> modal.classList.remove('show'));
modal.addEventListener('click',e=>{ if(e.target===modal) modal.classList.remove('show'); });

// البحث
function doSearch(){
  const q=searchInput.value.trim().toLowerCase();
  if(!q) renderMovies(allMovies);
  else{
    const res=allMovies.filter(m=>(m.title||'').toLowerCase().includes(q));
    renderMovies(res);
  }
}
searchBtn.addEventListener('click',doSearch);
searchInput.addEventListener('keyup',e=>{if(e.key==='Enter')doSearch();});

// البدء
loadMovies();
