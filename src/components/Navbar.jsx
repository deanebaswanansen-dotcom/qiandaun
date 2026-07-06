import React, { useEffect, useState } from 'react';
import audioEngine from '../services/AudioEngine';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);

  useEffect(() => {
    // 订阅音频开关状态
    const unsubscribe = audioEngine.subscribe((enabled) => {
      setIsSoundEnabled(enabled);
    });

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      const scrollPosition = window.scrollY + 250;
      const sections = ["hero", "sectionLore", "sectionTarot", "sectionMap", "sectionCharacter", "sectionGallery", "sectionPreOrder"];
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = document.getElementById(sections[i]);
        if (sec && sec.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      unsubscribe();
    };
  }, []);

  const handleSoundToggle = (e) => {
    e.stopPropagation();
    audioEngine.toggleSound();
  };

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="nav-container">
        <a href="#hero" className="brand">
          <span className="brand-en">DRAGON FANTASY</span>
          <span className="brand-cn">龙与幻想</span>
        </a>
        <nav className="nav-links">
          <a href="#hero" className={`nav-link ${activeSection === 'hero' ? 'active' : ''}`}>首页</a>
          <a href="#sectionLore" className={`nav-link ${activeSection === 'sectionLore' ? 'active' : ''}`}>史诗世界</a>
          <a href="#sectionTarot" className={`nav-link nav-highlight ${activeSection === 'sectionTarot' ? 'active' : ''}`}>命运塔罗 <span className="badge">HOT</span></a>
          <a href="#sectionMap" className={`nav-link nav-highlight ${activeSection === 'sectionMap' ? 'active' : ''}`}>大陆星图 <span className="badge">NEW</span></a>
          <a href="#sectionCharacter" className={`nav-link ${activeSection === 'sectionCharacter' ? 'active' : ''}`}>同伴传记</a>
          <a href="#sectionGallery" className={`nav-link ${activeSection === 'sectionGallery' ? 'active' : ''}`}>场景画廊</a>
          <a href="#sectionPreOrder" className={`nav-link nav-cta ${activeSection === 'sectionPreOrder' ? 'active' : ''}`}>公测预约</a>
        </nav>
        <button 
          id="soundToggle" 
          className={`sound-toggle ${isSoundEnabled ? 'playing' : ''}`} 
          onClick={handleSoundToggle}
          aria-label="开启或关闭后台幻音与音效"
        >
          <span className="sound-icon"></span>
          <span className="sound-text">{isSoundEnabled ? 'Sound On' : 'Sound Off'}</span>
        </button>
      </div>
    </header>
  );
}
