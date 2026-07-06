import React, { useEffect } from 'react';

export default function GalleryModal({ item, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && item) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [item, onClose]);

  return (
    <div className={`lightbox-modal ${item ? 'show' : ''}`} id="galleryModal" aria-hidden={!item} role="dialog">
      <div className="lightbox-backdrop" id="closeLightbox" onClick={onClose}></div>
      <div className="lightbox-content">
        <button className="lightbox-close" id="closeLightboxBtn" aria-label="关闭大图" onClick={onClose}>&times;</button>
        {item && (
          <>
            <img src={item.img} alt={item.title} id="lightboxImg" className="lightbox-img" />
            <div className="lightbox-caption-box">
              <h3 id="lightboxTitle">{item.title}</h3>
              <p id="lightboxCaption">{item.caption}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
