// main.js - 共用脚本（中文注释）
document.addEventListener('DOMContentLoaded', ()=>{
  // 主题切换
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  if(stored) root.setAttribute('data-theme', stored);
  const themeToggle = document.getElementById('themeToggle');
  if(themeToggle){
    themeToggle.addEventListener('click', ()=>{
      const cur = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', cur);
      localStorage.setItem('theme', cur);
    });
  }

  // 汉堡菜单
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  if(burger && navLinks){
    burger.addEventListener('click', ()=> navLinks.classList.toggle('show'));
  }

  // 导航背景随滚动变化
  const nav = document.querySelector('.nav');
  const onScroll = ()=>{
    if(window.scrollY>40) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
  }
  onScroll(); window.addEventListener('scroll', onScroll);

  // 交互动画：IntersectionObserver 控制 .reveal
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting) e.target.classList.add('in-view');
    });
  },{threshold:0.15});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // 作品数据（写死在页面内）
  const projects = [
    {id:1,title:'示例项目 A',img:'https://picsum.photos/seed/p1/600/400',desc:'项目 A 简短介绍。',detail:'项目 A 详细说明，技术栈：HTML/CSS/JS。'},
    {id:2,title:'示例项目 B',img:'https://picsum.photos/seed/p2/600/400',desc:'项目 B 简短介绍。',detail:'项目 B 详细说明，练习响应式布局。'},
    {id:3,title:'示例项目 C',img:'https://picsum.photos/seed/p3/600/400',desc:'项目 C 简短介绍。',detail:'项目 C 详细说明，包含交互效果。'}
  ];

  // 渲染作品卡片并绑定弹窗
  const worksGrid = document.getElementById('worksGrid');
  if(worksGrid){
    projects.forEach(p=>{
      const a = document.createElement('a');
      a.className='card work-card';
      a.href='#';
      a.innerHTML = `<img src="${p.img}" alt="${p.title}"><h3>${p.title}</h3><p>${p.desc}</p>`;
      a.addEventListener('click', (ev)=>{ev.preventDefault(); openModal(p);} );
      worksGrid.appendChild(a);
    });
  }

  // 通用模态框逻辑
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');
  const modalBackdrop = document.getElementById('modalBackdrop');
  function openModal(data){
    if(!modal) return;
    modal.setAttribute('aria-hidden','false');
    modalBody.innerHTML = `<h2>${data.title}</h2><img style="width:100%;border-radius:6px;margin:8px 0" src="${data.img}"><p>${data.detail}</p>`;
  }
  function closeModal(){ if(!modal) return; modal.setAttribute('aria-hidden','true'); }
  if(modalClose) modalClose.addEventListener('click', closeModal);
  if(modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  // 技能进度条动画，滚动到视口时填充宽度
  const skillObserver = new IntersectionObserver((entries, obs)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        en.target.querySelectorAll('.progress-bar').forEach(pb=>{
          const p = pb.getAttribute('data-percent')||'0';
          pb.style.width = p + '%';
        });
        obs.unobserve(en.target);
      }
    });
  },{threshold:0.2});
  const skillsEl = document.getElementById('skills');
  if(skillsEl) skillObserver.observe(skillsEl);

  // 联系表单：本地校验与保存到 localStorage
  const contactForm = document.getElementById('contactForm');
  const contactModal = document.getElementById('contactModal');
  const contactModalBody = document.getElementById('contactModalBody');
  const contactModalClose = document.getElementById('contactModalClose');
  const contactBackdrop = document.getElementById('contactBackdrop');
  function showContactModal(msg){ if(!contactModal) return; contactModalBody.textContent = msg; contactModal.setAttribute('aria-hidden','false'); }
  function closeContactModal(){ if(!contactModal) return; contactModal.setAttribute('aria-hidden','true'); }
  if(contactModalClose) contactModalClose.addEventListener('click', closeContactModal);
  if(contactBackdrop) contactBackdrop.addEventListener('click', closeContactModal);

  if(contactForm){
    contactForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      if(!name || !email || !message){ showContactModal('请填写所有字段'); return; }
      // 简单邮箱格式校验
      if(!/^\S+@\S+\.\S+$/.test(email)){ showContactModal('请输入有效邮箱地址'); return; }
      // 保存到 localStorage
      const list = JSON.parse(localStorage.getItem('contacts')||'[]');
      list.push({name, email, message, time: new Date().toISOString()});
      localStorage.setItem('contacts', JSON.stringify(list));
      showContactModal('提交成功，已保存到本地。');
      contactForm.reset();
    });
  }

  // 关闭页面级别模态时按 ESC
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape'){ closeModal(); closeContactModal(); } });
});
