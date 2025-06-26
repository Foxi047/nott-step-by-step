
import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

interface CropperCanvasProps {
  imageUrl: string;
  onCropComplete?: (croppedImageUrl: string) => void;
}

export interface CropperCanvasRef {
  getCroppedImage: () => string | null;
  rotate: (degrees: number) => void;
  destroy: () => void;
}

const CropperCanvas = forwardRef<CropperCanvasRef, CropperCanvasProps>(
  ({ imageUrl, onCropComplete }, ref) => {
    const imageRef = useRef<HTMLImageElement>(null);
    const cropperRef = useRef<Cropper | null>(null);

    useImperativeHandle(ref, () => ({
      getCroppedImage: () => {
        if (!cropperRef.current) return null;
        try {
          const canvas = cropperRef.current.getCroppedCanvas();
          return canvas ? canvas.toDataURL('image/jpeg', 0.9) : null;
        } catch (error) {
          console.error('Error getting cropped image:', error);
          return null;
        }
      },
      rotate: (degrees: number) => {
        if (cropperRef.current) {
          try {
            cropperRef.current.rotate(degrees);
          } catch (error) {
            console.error('Error rotating image:', error);
          }
        }
      },
      destroy: () => {
        if (cropperRef.current) {
          cropperRef.current.destroy();
          cropperRef.current = null;
        }
      }
    }));

    useEffect(() => {
      if (imageRef.current && imageUrl) {
        if (cropperRef.current) {
          cropperRef.current.destroy();
          cropperRef.current = null;
        }
        
        cropperRef.current = new Cropper(imageRef.current, {
          dragMode: 'crop',
          aspectRatio: NaN,
          guides: true,
          center: true,
          highlight: false,
          cropBoxMovable: true,
          cropBoxResizable: true,
          toggleDragModeOnDblclick: false,
        });
      }

      return () => {
        if (cropperRef.current) {
          cropperRef.current.destroy();
          cropperRef.current = null;
        }
      };
    }, [imageUrl]);

    return (
      <div className="border border-slate-600 rounded-lg p-4 bg-slate-900">
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Редактируемое изображение"
          className="max-w-full h-auto"
          style={{ maxHeight: '500px' }}
        />
      </div>
    );
  }
);

CropperCanvas.displayName = 'CropperCanvas';

export default CropperCanvas;
