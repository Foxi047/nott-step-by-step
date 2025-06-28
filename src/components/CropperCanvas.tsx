
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
          const canvas = cropperRef.current.getCroppedCanvas({
            width: 800,
            height: 600,
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high',
          });
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
          autoCropArea: 0.8,
          viewMode: 1,
          responsive: true,
          restore: false,
          checkCrossOrigin: false,
          checkOrientation: false,
          modal: true,
          background: true,
          movable: true,
          rotatable: true,
          scalable: true,
          zoomable: true,
          zoomOnTouch: true,
          zoomOnWheel: true,
          wheelZoomRatio: 0.1,
          cropBoxResizable: true,
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
        <div className="mb-2 text-sm text-slate-300">
          Выделите область для обрезки и нажмите "Применить обрезку"
        </div>
        <div className="max-w-full overflow-hidden">
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Редактируемое изображение"
            className="max-w-full h-auto block object-contain"
            style={{ 
              maxHeight: '500px',
              width: 'auto'
            }}
          />
        </div>
      </div>
    );
  }
);

CropperCanvas.displayName = 'CropperCanvas';

export default CropperCanvas;
