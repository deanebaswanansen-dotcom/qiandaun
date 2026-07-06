import React, { useEffect, useState } from 'react';

export default function Preloader({ onFinish }) {
  const [percent, setPercent] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let loadedCount = 0;
    const mediaEls = Array.from(document.querySelectorAll("img, video"));
    const totalCount = Math.max(1, mediaEls.length);

    function updatePercent() {
      loadedCount++;
      const targetPercent = Math.min(100, Math.floor((loadedCount / totalCount) * 100));
      setPercent(targetPercent);
      if (loadedCount >= totalCount) {
        finish();
      }
    }

    function finish() {
      setPercent(100);
      setIsLoaded(true);
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 500);
    }

    mediaEls.forEach(el => {
      if (el.tagName === "IMG") {
        if (el.complete) {
          loadedCount++;
        } else {
          el.addEventListener("load", updatePercent, { once: true });
          el.addEventListener("error", updatePercent, { once: true });
        }
      } else if (el.tagName === "VIDEO") {
        if (el.readyState >= 3) {
          loadedCount++;
        } else {
          el.addEventListener("canplaythrough", updatePercent, { once: true });
          el.addEventListener("error", updatePercent, { once: true });
        }
      }
    });

    if (loadedCount >= totalCount) {
      setTimeout(finish, 400);
    } else {
      // 兜底超时：最多等待 3 秒自动揭幕
      setTimeout(finish, 3000);
    }
  }, [onFinish]);

  return (
    <div id="preloader" class={`preloader ${isLoaded ? 'loaded' : ''}`}>
      <div className="preloader-circle"></div>
      <div id="preloaderPercent" className="preloader-percent">{percent}%</div>
    </div>
  );
}
