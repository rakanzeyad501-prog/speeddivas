/**
 * SPEEDDIVAS - Master JavaScript
 * Handles interactive elements, telemetry animations, video controls,
 * mobile drawer, join modal, and Web Audio engine rev FX.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header scroll effect
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking outside or clicking any link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // 3. Hero Video Controls (Play/Pause & Mute)
  const heroVideo = document.getElementById('heroVideo');
  const videoCtrlBtn = document.getElementById('videoCtrlBtn');
  const videoCtrlIcon = document.getElementById('videoCtrlIcon');
  const videoCtrlText = document.getElementById('videoCtrlText');

  if (heroVideo && videoCtrlBtn) {
    videoCtrlBtn.addEventListener('click', () => {
      if (heroVideo.paused) {
        heroVideo.play();
        videoCtrlText.textContent = 'إيقاف الفيديو';
        videoCtrlIcon.innerHTML = `
          <rect x="6" y="4" width="4" height="16" fill="currentColor"></rect>
          <rect x="14" y="4" width="4" height="16" fill="currentColor"></rect>
        `;
      } else {
        heroVideo.pause();
        videoCtrlText.textContent = 'تشغيل الفيديو';
        videoCtrlIcon.innerHTML = `
          <polygon points="5 3 19 12 5 21 5 3" fill="currentColor"></polygon>
        `;
      }
    });
  }

  // 4. Modal System (Join SpeedDivas Team)
  const modalOverlay = document.getElementById('joinModal');
  const modalOpenBtns = document.querySelectorAll('.open-join-modal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const joinForm = document.getElementById('joinTeamForm');

  modalOpenBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tier = btn.getAttribute('data-tier');
      const tierSelect = document.getElementById('membershipTierSelect');
      if (tier && tierSelect) {
        tierSelect.value = tier;
      }
      if (modalOverlay) {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (modalCloseBtn && modalOverlay) {
    modalCloseBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  if (joinForm) {
    joinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('مرحباً بكِ في أسطول SpeedDivas! ✨\nتم استلام طلب انضمامك بنجاح، وسيتواصل معك فريق الإدارة قريباً.');
      joinForm.reset();
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // 5. Telemetry Number Counter Animation on scroll into view
  const counters = document.querySelectorAll('.counter-val');
  let speedCountStarted = false;

  const startCounter = () => {
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const isDecimal = target % 1 !== 0;
      const duration = 2000;
      const stepTime = 30;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = isDecimal ? target.toFixed(1) : Math.floor(target);
          clearInterval(timer);
        } else {
          counter.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
        }
      }, stepTime);
    });
  };

  const telemetrySection = document.querySelector('.hero-telemetry');
  if (telemetrySection) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !speedCountStarted) {
        speedCountStarted = true;
        startCounter();
      }
    }, { threshold: 0.5 });
    observer.observe(telemetrySection);
  }

  // 6. Sound FX: Launch Control & Random Engine Rev (Idea #2)
  const revBtn = document.getElementById('engineRevBtn');
  const engineSounds = [
    {
      fileOgg: 'audio/rev-v8.ogg',
      fileMp3: 'audio/rev-v8.mp3',
      name: 'V8 Twin-Turbo Beast',
      rpm: '8,500 RPM',
      icon: '🔥',
      desc: 'دَوسة محرك V8 توين تيربو مع باك فاير'
    },
    {
      fileOgg: 'audio/rev-v12.ogg',
      fileMp3: 'audio/rev-v12.mp3',
      name: 'V12 Naturally Aspirated',
      rpm: '9,200 RPM',
      icon: '⚡',
      desc: 'صرخة محرك V12 تنفس طبيعي حلبات'
    },
    {
      fileOgg: 'audio/rev-turbo.ogg',
      fileMp3: 'audio/rev-turbo.mp3',
      name: 'Turbo Blow-Off Flutter',
      rpm: '7,800 RPM',
      icon: '💨',
      desc: 'تفريغ تيربو وفلاتر سباق Anti-Lag'
    }
  ];

  let currentAudio = null;

  if (revBtn) {
    revBtn.addEventListener('click', () => {
      playEngineRev();
    });
  }

  function playEngineRev() {
    // 1. Pick a random sound from the 3 local options
    const sound = engineSounds[Math.floor(Math.random() * engineSounds.length)];

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    // 2. Play local audio file
    const audio = new Audio();
    if (audio.canPlayType('audio/ogg; codecs="vorbis"')) {
      audio.src = sound.fileOgg;
    } else {
      audio.src = sound.fileMp3;
    }

    audio.volume = 0.9;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback to Web Audio synthesizer if browser blocks audio element
        playSynthesizedFallback();
      });
    }
    currentAudio = audio;

    // 3. Launch Control Visual FX (Screen shake, button pulse, HUD toast)
    triggerLaunchControlFX(sound);
  }

  function triggerLaunchControlFX(sound) {
    // Button pulse
    if (revBtn) {
      revBtn.classList.add('revving');
      setTimeout(() => {
        revBtn.classList.remove('revving');
      }, 1600);
    }

    // Screen Shake
    document.body.classList.remove('screen-shake');
    void document.body.offsetWidth; // trigger reflow
    document.body.classList.add('screen-shake');
    setTimeout(() => {
      document.body.classList.remove('screen-shake');
    }, 600);

    // Launch HUD Toast
    let toast = document.querySelector('.launch-hud-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'launch-hud-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `
      <span class="hud-flame">${sound.icon}</span>
      <span>${sound.desc}</span>
      <span class="hud-rpm">[ ${sound.rpm} ]</span>
    `;
    toast.classList.remove('active');
    void toast.offsetWidth;
    toast.classList.add('active');

    setTimeout(() => {
      toast.classList.remove('active');
    }, 2400);
  }

  function playSynthesizedFallback() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);

      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.35);
      osc.frequency.exponentialRampToValueAtTime(560, now + 0.65);
      osc.frequency.exponentialRampToValueAtTime(100, now + 1.3);

      gainNode.gain.setValueAtTime(0.01, now);
      gainNode.gain.linearRampToValueAtTime(0.35, now + 0.3);
      gainNode.gain.linearRampToValueAtTime(0.4, now + 0.65);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.35);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.4);
    } catch (e) {
      console.log('Audio rev error:', e);
    }
  }

  // 7. Garage Category Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const carCards = document.querySelectorAll('.garage-grid .car-card');

  if (filterBtns.length > 0 && carCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        carCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  // 8. Events Category Filter
  const eventFilterBtns = document.querySelectorAll('.event-filter-btn');
  const eventCards = document.querySelectorAll('.events-full-grid .event-card');

  if (eventFilterBtns.length > 0 && eventCards.length > 0) {
    eventFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        eventFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        eventCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  // 9. Event RSVP & Survey Modal
  const rsvpModal = document.getElementById('rsvpModal');
  const rsvpOpenBtns = document.querySelectorAll('.open-rsvp-modal');
  const rsvpCloseBtn = document.getElementById('rsvpCloseBtn');
  const rsvpForm = document.getElementById('rsvpSurveyForm');
  const selectedEventTitle = document.getElementById('selectedEventTitle');
  const rsvpEventInput = document.getElementById('rsvpEventInput');

  if (rsvpOpenBtns.length > 0 && rsvpModal) {
    rsvpOpenBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const eventName = btn.getAttribute('data-event') || 'الفعالية المختارة';
        if (selectedEventTitle) selectedEventTitle.textContent = eventName;
        if (rsvpEventInput) rsvpEventInput.value = eventName;
        rsvpModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
  }

  if (rsvpCloseBtn && rsvpModal) {
    rsvpCloseBtn.addEventListener('click', () => {
      rsvpModal.classList.remove('active');
      document.body.style.overflow = '';
    });

    rsvpModal.addEventListener('click', (e) => {
      if (e.target === rsvpModal) {
        rsvpModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const eventName = selectedEventTitle ? selectedEventTitle.textContent : '';
      alert(`تم تسجيل حضوركِ واستلام إجابات الاستبيان لـ (${eventName}) بنجاح! 🏎️✨\nسيتواصل معكِ فريق تنظيم SpeedDivas عبر الواتساب لإرسال تصريح الدخول والجدول الزمني.`);
      rsvpForm.reset();
      rsvpModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // 10. Contact Us Form Handler
  const contactForm = document.getElementById('contactUsForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('تم إرسال رسالتكِ بنجاح إلى إدارة SpeedDivas! 🏎️✨\nسيتواصل معكِ فريق العلاقات العامة والتنظيم في أقرب وقت عبر الواتساب أو البريد.');
      contactForm.reset();
    });
  }
});

