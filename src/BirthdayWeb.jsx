import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const PARTICLES = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  size: Math.random() * 3 + 1,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: Math.random() * 12 + 8,
  delay: Math.random() * 8,
  opacity: Math.random() * 0.5 + 0.1,
}));

const STARS = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  top: Math.random() * 60 + 5,
  left: Math.random() * 60,
  delay: Math.random() * 15,
  duration: Math.random() * 4 + 3,
  rotate: Math.random() * 30 + 20,
}));

const HEARTS = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 12,
  duration: Math.random() * 10 + 12,
  size: Math.random() * 16 + 10,
  opacity: Math.random() * 0.4 + 0.1,
}));

const messages = [
  "Selamat ulang tahun, Tika Aviliani...",
  "Honestly, aku nggak tahu harus mulai dari mana,",
  "Tapi aku cuma pengen hari ini kamu ngerasa sedikit lebih tenang.",
  "Makasih ya sudah bertahan sejauh ini — makasih sudah tetap kuat...",
  "Meskipun aku tahu banyak hal yang kamu pendam sendiri,",
  "And maybe lots of tiring days yang nggak pernah kamu ceritain.",
  "I hope the world can be a bit kinder to you,",
  "Dan hal-hal baik mulai berdatangan tanpa harus kamu kejar terlalu jauh.",
  "Don't be too hard on yourself. It's okay to take a break.",
  "Karena buat aku, kamu yang tetap ada sampai detik ini pun sudah lebih dari cukup.",
  "Maaf ya cuma bisa kirim ini... it might not be much,",
  "Tapi aku harap ini bisa sedikit bikin kamu senyum hari ini."
];

/* ── Link Images ── */
const photos = [
  { src: "https://cdn.discordapp.com/attachments/1394756436780777516/1493587276062523525/IMG-20260402-WA0005.jpg?ex=69df830c&is=69de318c&hm=8a195f3ffc90405507b32b28ec073d6ed40e08bbac014ac6dba7377e0ce835bd&", caption: "The one that started it all. Always love this view of you." },
  { src: "https://cdn.discordapp.com/attachments/1394756436780777516/1493587276750393406/IMG-20251129-WA0001.jpg?ex=69df830c&is=69de318c&hm=ed04ab9cca05d2ebf9ff89d1129f8584c28aeb3dad6f4723ba08ef69faca075f&", caption: "Seeing you happy is my favorite part of the day. Don't ever stop laughing, Tik." },
  { src: "https://cdn.discordapp.com/attachments/1394756436780777516/1493587277107167332/IMG-20260225-WA0002.jpg?ex=69df830c&is=69de318c&hm=a3b84d92e260388c15f65195f471970dde65f6cd0a62c20ba6fc3dda6aa8a78b&", caption: "ust you, being you. Cheers to more years of witnessing your beautiful soul." },
];

function useTypewriter(text, speed = 40, started = false) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    if (!started || !text) return;
    let i = 0;
    ref.current = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(ref.current);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(ref.current);
  }, [text, started]);

  return { displayed, done };
}

function LineMessage({ text, onDone, isTyping }) {
  const { displayed, done } = useTypewriter(text, 50, isTyping);

  useEffect(() => {
    if (done && isTyping) {
      const timer = setTimeout(() => {
        if (onDone) onDone();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [done, isTyping, onDone]);
  const content = isTyping ? displayed : text;

  return (
    <motion.p 
      className={`msg-text ${isTyping ? 'active-line' : 'dimmed-line'}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {content}
      {isTyping && !done && <span className="cursor-blink">|</span>}
    </motion.p>
  );
}

const BirthdayWeb = () => {
  const [phase, setPhase] = useState('intro');
  const [step, setStep] = useState(0);
  const scrollRef = useRef(null);

  const fireConfetti = (opts = {}) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.55 },
      colors: ['#f43f5e', '#fb7185', '#fda4af', '#fce7f3', '#fff1f2', '#e879f9'],
      ...opts,
    });
  };

  const handleOpen = () => {
    fireConfetti({ particleCount: 60 });
    setPhase('story');
    const audio = document.getElementById("bgm-audio");
    if (audio) {
      audio.volume = 0.5;
      audio.play().catch(e => console.log("Audio play failed, autplay policy:", e));
    }
  };

  const handleLineDone = () => {
    const next = step + 1;
    if (next === messages.length) {
      setTimeout(() => {
        setPhase('dashboard');
        fireConfetti({ particleCount: 200, spread: 140 });
        setTimeout(() => fireConfetti({ particleCount: 150, origin: { y: 0.3 } }), 800);
        
        const audio = document.getElementById("bgm-audio");
        if (audio) {
          let vol = audio.volume;
          const fadeOut = setInterval(() => {
            if (vol > 0.05) {
              vol -= 0.05;
              audio.volume = vol;
            } else {
              clearInterval(fadeOut);
              audio.pause();
            }
          }, 200);
        }
      }, 4000); 
    }
    setStep(next);
  };

  useEffect(() => {
    if (scrollRef.current && phase === 'story') {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [step, phase]);

  useEffect(() => {
    let interval;
    if (phase === 'story') {
      interval = setInterval(() => {
        const randomX = Math.random() * 0.8 + 0.1;
        confetti({
          particleCount: 40,
          spread: 70,
          origin: { x: randomX, y: 0.9 },
          colors: ['#f43f5e', '#fb7185', '#fda4af', '#e879f9', '#fce7f3', '#fff1f2'],
          ticks: 200,
          gravity: 0.7,
          scalar: 0.8,
          zIndex: 0
        });
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <div className="birthday-root">

      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="particles-layer" aria-hidden="true">
        {PARTICLES.map(p => (
          <motion.span
            key={p.id}
            className="particle"
            style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%`, opacity: p.opacity }}
            animate={{ y: [0, -120, 0], opacity: [0, p.opacity, 0] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
        {HEARTS.map(h => (
          <motion.span
            key={`h-${h.id}`}
            className="floating-heart"
            style={{ left: `${h.x}%`, fontSize: h.size, opacity: h.opacity }}
            animate={{ y: ['120vh', '-20vh'], opacity: [0, h.opacity, 0] }}
            transition={{ duration: h.duration, delay: h.delay, repeat: Infinity, ease: 'linear' }}
          >
            ♥
          </motion.span>
        ))}
        {STARS.map(s => (
          <span
            key={`s-${s.id}`}
            className="shooting-star"
            style={{ top: `${s.top}%`, left: `${s.left}%`, transform: `rotate(${s.rotate}deg)`, animationDuration: `${s.duration}s`, animationDelay: `${s.delay}s` }}
          />
        ))}
      </div>

      <audio id="bgm-audio" loop src="/lagu-kita.mp3"></audio>

      <div className="content-center">
        <AnimatePresence mode="wait">

          {/* INTRO */}
          {phase === 'intro' && (
            <motion.div
              key="intro"
              className="intro-wrap"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="intro-title">
                Happy Birthday,<br />
                <span className="intro-name">Tika Aviliani</span>
              </h1>
              <p className="intro-sub">Ada sesuatu untukmu hari ini</p>
              <motion.button
                className="open-btn"
                onClick={handleOpen}
              >
                Open Letter
              </motion.button>
            </motion.div>
          )}

          {phase === 'story' && (
            <motion.div 
              key="story" 
              className="letter-container"
              initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
              transition={{ duration: 1 }}
            >
              <div className="letter-card">
                {messages.slice(0, step + 1).map((msg, index) => (
                  <LineMessage 
                    key={index} 
                    text={msg} 
                    isTyping={index === step} 
                    onDone={index === step ? handleLineDone : null} 
                  />
                ))}
                <div ref={scrollRef} style={{ height: '30px' }} />
              </div>
            </motion.div>
          )}
          {phase === 'dashboard' && (
            <motion.div
              key="dashboard"
              className="dashboard-wrap"
              initial={{ opacity: 0, y: 60, filter: 'blur(15px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="dashboard-header">
                <motion.div 
                  className="anniv-badge"
                  animate={{ scale: [1, 1.05, 1], filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <span className="badge-text">
                    {Math.ceil(Math.abs(new Date() - new Date("2024-08-15")) / (1000 * 60 * 60 * 24))} Days of Us
                  </span>
                </motion.div>
                <h2 className="dashboard-title">Happy Birthday & Our Anniversary</h2>
                <p className="dashboard-subtitle">
                  Makasih udah nemenin perjalanan sampai sejauh ini. You mean the world to me.
                </p>
              </div>

              <div className="gallery-grid">
                {photos.map((photo, index) => (
                  <motion.div 
                    key={index}
                    className={`polaroid p-${index}`}
                    initial={{ opacity: 0, y: 30, rotate: index % 2 === 0 ? -6 : 6 }}
                    animate={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -3 : 4 }}
                    transition={{ delay: 0.8 + (index * 0.3), duration: 0.8, type: 'spring' }}
                    whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
                  >
                    <div className="polaroid-img-wrapper">
                      <img src={photo.src} alt={`Kenangan ${index+1}`} className="px-img" />
                    </div>
                    <p className="polaroid-caption">{photo.caption}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                 className="dashboard-footer"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 2.5 }}
              >
                  <p className="end-sign">I love you, Tika</p>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default BirthdayWeb;