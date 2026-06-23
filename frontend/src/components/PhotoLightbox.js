import { useEffect } from 'react';
import { BASE_URL } from '../api';

export default function PhotoLightbox({ photo, onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose}>✕</button>
      <img
        src={`${BASE_URL}${photo.url}`}
        alt={photo.originalName}
        className="lightbox-img"
        onClick={e => e.stopPropagation()}
      />
      {photo.originalName && (
        <p className="lightbox-caption" onClick={e => e.stopPropagation()}>
          {photo.originalName}
        </p>
      )}
    </div>
  );
}
