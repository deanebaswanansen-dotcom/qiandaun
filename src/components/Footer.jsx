import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h4>DRAGON FANTASY</h4>
            <p>白垩与微风的史诗 · AAA 级幻想大作</p>
          </div>
          <div className="footer-links">
            <a href="#hero">隐私政策</a>
            <a href="#hero">用户协议</a>
            <a href="#hero">家长监护</a>
            <a href="#hero">官方社区</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 DRAGON FANTASY STUDIO. ALL RIGHTS RESERVED. 本网页仅作概念演示与审美展现。</p>
        </div>
      </div>
    </footer>
  );
}
