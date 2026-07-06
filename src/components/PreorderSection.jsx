import React, { useState } from 'react';
import audioEngine from '../services/AudioEngine';

export default function PreorderSection({ onSuccess }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      audioEngine.playSuccessSound();
      if (onSuccess) onSuccess();
      setEmail('');
    }
  };

  return (
    <section className="section-preorder" id="sectionPreOrder">
      <div className="preorder-glow-bg"></div>
      <div className="container">
        <div className="preorder-box">
          <span className="section-tag">GLOBAL REGISTRATION</span>
          <h2 className="preorder-title">启程！全球公测预约开启</h2>
          <p className="preorder-desc">立即预约，即可在公测时领取限定飞行同伴「星光青鸟」、白垩专属头像框及 1000 颗星辉宝石！</p>
          
          <form className="preorder-form" id="preorderForm" onSubmit={handleSubmit}>
            <input 
              type="email" 
              placeholder="输入您的电子邮箱地址..." 
              required 
              className="preorder-input" 
              id="preorderInput" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="preorder-btn">立即预约公测 <span className="arrow">→</span></button>
          </form>

          <div className="preorder-footer">
            <span>🎁 已有 <strong>2,480,910</strong> 名旅行者完成预约</span>
            <span>🛡️ iOS / Android / PC / PS5 全平台数据互通</span>
          </div>
        </div>
      </div>
    </section>
  );
}
