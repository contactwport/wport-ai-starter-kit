// Typing Animation
const typingText = document.getElementById('typingText');
const phrases = [
  'AI 工作流講師',
  '熱火數碼資訊執行長',
  'WPORT 職航站創辦人',
  'B2B 軟體顧問',
  'Vibe Coding 實踐者',
  'Obsidian 知識管理愛好者'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function type() {
  const currentPhrase = phrases[phraseIndex];
  
  if (isDeleting) {
    typingText.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
    typingSpeed = 50;
  } else {
    typingText.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
    typingSpeed = 100;
  }
  
  if (!isDeleting && charIndex === currentPhrase.length) {
    isDeleting = true;
    typingSpeed = 1500; // Pause at end
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typingSpeed = 500; // Pause before next phrase
  }
  
  setTimeout(type, typingSpeed);
}

// Start typing animation
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(type, 1000);
  
  // Create particles
  createParticles();
  
  // Initialize scroll reveal
  initScrollReveal();
  
  // Initialize counter animation
  initCounters();
  
  // Initialize mobile nav
  initMobileNav();
  
  // Load blog posts
  loadBlogPosts();
  
  // Initialize category filter
  initCategoryFilter();
});

// Create floating particles
function createParticles() {
  const particlesContainer = document.getElementById('particles');
  const particleCount = 50;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 3 + 's';
    particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
    particlesContainer.appendChild(particle);
  }
}

// Scroll reveal animation
function initScrollReveal() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el);
  });
}

// Counter animation
function initCounters() {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
          current += step;
          if (current < target) {
            counter.textContent = Math.floor(current) + '+';
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target + '+';
          }
        };
        
        updateCounter();
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });
  
  document.querySelectorAll('.stat-number').forEach(counter => {
    counterObserver.observe(counter);
  });
}

// Mobile navigation
function initMobileNav() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = navMenu.classList.contains('active') ? 'rotate(-45deg) translate(-7px, 7px)' : 'none';
    spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
    spans[2].style.transform = navMenu.classList.contains('active') ? 'rotate(45deg) translate(-7px, -7px)' : 'none';
  });
  
  // Close menu when clicking on a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      const spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    });
  });
}

// Blog posts data
const blogPosts = [
  {
    id: 1,
    title: '漁業 50% vs 製造業 10%',
    category: '就業服務人資',
    excerpt: '移工配額比例差異分析，探討漁業與製造業在外籍移工引進上的不同規定與審查標準。',
    path: '就業服務人資/01-漁業50%vs製造業10%'
  },
  {
    id: 2,
    title: '3K 五級・課金 10%・45%',
    category: '就業服務人資',
    excerpt: '3K五級產業、課金比例、雇主負擔費用及45%天花板等重點規定說明。',
    path: '就業服務人資/02-3K五級課金10%與45%天花板'
  },
  {
    id: 3,
    title: '小資本公司請家庭幫傭',
    category: '就業服務人資',
    excerpt: '小型資本額公司申請家庭幫傭的條件、限制與審查要點。',
    path: '就業服務人資/03-小資本公司請家庭幫傭'
  },
  {
    id: 4,
    title: '就業金卡個人特權',
    category: '就業服務人資',
    excerpt: '就業金卡制度的個人特權、適用對象與申請要件說明。',
    path: '就業服務人資/04-就業金卡個人特權'
  },
  {
    id: 5,
    title: '一對二看護幫傭例外',
    category: '就業服務人資',
    excerpt: '特殊狀況下的一對二看護與家庭幫傭並聘例外規定。',
    path: '就業服務人資/05-一對二看護幫傭例外'
  },
  {
    id: 6,
    title: '商標法公訴罪',
    category: '就業服務人資',
    excerpt: '商標法與著作權法相關公訴罪探討，移工法規中的法律灰地帶分析。',
    path: '就業服務人資/06-商標法公訴罪'
  },
  {
    id: 7,
    title: '移工名額共軛性',
    category: '就業服務人資',
    excerpt: '移工名額計算中的共軛性原則與實務應用。',
    path: '就業服務人資/07-移工名額共軛性'
  },
  {
    id: 8,
    title: '護病比 3床 vs 5床',
    category: '就業服務人資',
    excerpt: '護理機構護病比規定差異對外籍看護申請的影響。',
    path: '就業服務人資/08-護病比3床vs5床'
  },
  {
    id: 9,
    title: '工作氣質風格價值觀－開車出遊法',
    category: '就業服務人資',
    excerpt: '職涯諮詢中的性格測驗理論應用，以開車出遊法說明工作氣質、風格與價值觀。',
    path: '就業服務人資/09-工作氣質風格價值觀-開車出遊法'
  },
  {
    id: 10,
    title: '適合不等於喜歡',
    category: '就業服務人資',
    excerpt: '職涯選擇中「適合」與「喜歡」的差異，探討理性與感性在求職決策中的平衡。',
    path: '就業服務人資/10-適合不等於喜歡'
  },
  {
    id: 11,
    title: '台灣就業通．Holland 六型',
    category: '就業服務人資',
    excerpt: 'Holland 職業興趣理論在台灣就業通系統的應用與實務運用。',
    path: '就業服務人資/11-台灣就業通Holland六型'
  },
  {
    id: 12,
    title: '黃金三角人才畫像',
    category: '就業服務人資',
    excerpt: '建立完整人才畫像的黃金三角模型，結合興趣、能力與價值觀分析。',
    path: '就業服務人資/12-黃金三角人才畫像'
  }
];

// Load blog posts
function loadBlogPosts(filter = 'all') {
  const blogGrid = document.getElementById('blogGrid');
  blogGrid.innerHTML = '';
  
  const filteredPosts = filter === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === filter);
  
  filteredPosts.forEach((post, index) => {
    const postCard = document.createElement('article');
    postCard.className = 'blog-card scroll-reveal';
    postCard.style.animationDelay = (index * 0.1) + 's';
    
    postCard.innerHTML = `
      <div class="blog-card-header">
        <span class="blog-category-tag">${post.category}</span>
        <h3 class="blog-card-title">${post.title}</h3>
        <p class="blog-card-excerpt">${post.excerpt}</p>
      </div>
      <div class="blog-card-footer">
        <a href="https://github.com/search?q=repo:ericlu-sys/obsidian+path:${encodeURIComponent(post.path)}&type=code" target="_blank" class="blog-read-more">
          <span>閱讀更多</span>
          <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    `;
    
    blogGrid.appendChild(postCard);
  });
  
  // Re-trigger scroll reveal for new elements
  setTimeout(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);
    
    document.querySelectorAll('.blog-card.scroll-reveal:not(.revealed)').forEach(el => {
      observer.observe(el);
    });
  }, 100);
}

// Initialize category filter
function initCategoryFilter() {
  const categoryBtns = document.querySelectorAll('.category-btn');
  
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Filter posts
      const category = btn.getAttribute('data-category');
      loadBlogPosts(category);
    });
  });
}

// Smooth scroll offset for fixed nav
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const navHeight = document.querySelector('.nav').offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.nav');
  if (window.scrollY > 100) {
    nav.style.background = 'rgba(15, 10, 30, 0.95)';
    nav.style.boxShadow = '0 10px 40px -10px rgba(168, 85, 247, 0.2)';
  } else {
    nav.style.background = 'rgba(15, 10, 30, 0.8)';
    nav.style.boxShadow = 'none';
  }
});
