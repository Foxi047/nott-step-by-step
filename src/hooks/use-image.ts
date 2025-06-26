
import { useEffect, useState } from 'react';

const useImage = (url: string) => {
  const [image, setImage] = useState<HTMLImageElement | undefined>();

  useEffect(() => {
    if (!url) return;
    
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      setImage(img);
    };
    
    img.onerror = () => {
      setImage(undefined);
    };
    
    img.src = url;
  }, [url]);

  return [image];
};

export default useImage;
