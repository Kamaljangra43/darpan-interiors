'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ResponsiveImage {
  width: number;
  url: string;
}

interface OptimizedImageProps {
  src: string;
  alt: string;
  responsiveImages?: ResponsiveImage[];
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
  objectPosition?: string;
  onClick?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  responsiveImages,
  width = 1200,
  height = 675,
  fill = false,
  priority = false,
  className = '',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px',
  objectFit = 'cover',
  objectPosition = 'center',
  onClick,
}: OptimizedImageProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    const style = fill
      ? { position: 'absolute' as const, inset: 0, backgroundColor: '#f0f0f0' }
      : { width: width ? `${width}px` : '100%', height: height ? `${height}px` : 'auto', backgroundColor: '#f0f0f0' };

    return <div style={style} className={className} />;
  }

  let srcSet = '';
  if (responsiveImages && responsiveImages.length > 0) {
    srcSet = responsiveImages.map(img => `${img.url} ${img.width}w`).join(', ');
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={85}
        className={className}
        style={{ objectFit, objectPosition }}
        onClick={onClick}
      />
    );
  }

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'low'}
      className={className}
      style={{
        display: 'block',
        width: '100%',
        height: 'auto',
        maxWidth: width ? `${width}px` : 'none',
        objectFit,
        objectPosition,
      }}
      onClick={onClick}
    />
  );
}
