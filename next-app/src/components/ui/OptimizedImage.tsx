import React, { useState } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  width?: string | number;
  height?: string | number;
  className?: string;
}

export default function OptimizedImage({ 
  src, 
  alt, 
  fallbackSrc, 
  width, 
  height, 
  className = '', 
  ...props 
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);

  const handleError = () => {
    if (!error && fallbackSrc) {
      setImgSrc(fallbackSrc);
      setError(true);
    }
  };

  return (
    <picture>
      {/* If we had an AVIF version, we'd add it here like: <source srcSet={src.replace(/\.(png|jpg|jpeg)$/, '.avif')} type="image/avif" /> */}
      {/* Same for WebP: <source srcSet={src.replace(/\.(png|jpg|jpeg)$/, '.webp')} type="image/webp" /> */}
      <img
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        loading="lazy" // Native browser lazy loading
        decoding="async" // Decode async for performance
        onError={handleError}
        className={`transition-opacity duration-300 ${className}`}
        {...props}
      />
    </picture>
  );
}
