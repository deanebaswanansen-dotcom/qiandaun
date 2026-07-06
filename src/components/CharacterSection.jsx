import React from 'react';
import TiltCard from './TiltCard';

const charactersData = [
  {
    id: 1,
    role: "DESTINY EXPLORER",
    name: "主角 · 命运开拓者",
    quote: "“如果远方没有恶龙，我们便去追寻未曾见过的星海与日落。”",
    img: "/assets/images/character-hero.png",
    stats: [
      { label: "定位：", val: "全能开拓者 / 龙契者" },
      { label: "武器：", val: "古代命运断剑" },
      { label: "元素：", val: "星辉 & 晨光" }
    ]
  },
  {
    id: 2,
    role: "STARLIGHT MAGE",
    name: "蕾娅 (Leia)",
    quote: "“风吹过来的地方，不仅有故事，还有深埋在遗迹深处的星辉。”",
    img: "/assets/images/character-leia.png",
    stats: [
      { label: "定位：", val: "皇家观星首席" },
      { label: "武器：", val: "星轨至高法杖" },
      { label: "元素：", val: "星穹 & 幻水" }
    ]
  },
  {
    id: 3,
    role: "WANDERING SWORDSMAN",
    name: "艾尔 (Al)",
    quote: "“只要手中有剑，目光所及之处，皆是守护王城的道路。”",
    img: "/assets/images/character-al.png",
    stats: [
      { label: "定位：", val: "白垩近卫骑士团长" },
      { label: "武器：", val: "晨曦破晓剑" },
      { label: "元素：", val: "微风 & 雷霆" }
    ]
  }
];

export default function CharacterSection() {
  return (
    <section className="section-character" id="sectionCharacter">
      <div className="bg-watermark astrolabe"></div>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">DESTINY COMPANIONS</span>
          <h2 className="section-title">命运羁绊 · 同伴登场</h2>
          <p className="section-desc">无论是命运的开拓者、聆听星轨的观星法师，还是誓死守护晨曦的近卫，他们的轨迹皆在此汇聚。</p>
        </div>

        <div className="character-showcase char-showcase-3">
          {charactersData.map(char => (
            <TiltCard key={char.id} className="char-card companion-card" maxRotate={6}>
              <div className="char-bg" style={{ backgroundImage: `url('${char.img}')` }}></div>
              <div className="char-glow"></div>
              <div className="char-info">
                <span className="char-role">{char.role}</span>
                <h3 className="char-name">{char.name}</h3>
                <p className="char-quote">{char.quote}</p>
                <ul className="char-stats">
                  {char.stats.map((s, idx) => (
                    <li key={idx}><span>{s.label}</span> {s.val}</li>
                  ))}
                </ul>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
