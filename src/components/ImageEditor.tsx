
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, Crop, Save, X, RotateCw, Scissors, Palette } from 'lucide-react';
import CropperCanvas, { CropperCanvasRef } from './CropperCanvas';
import KonvaAnnotations, { KonvaAnnotationsRef } from './KonvaAnnotations';

interface ImageEditorProps {
  onSave: (imageUrl: string, stepId?: string) => void;
  onCancel: () => void;
  stepId?: string | null;
  initialImageUrl?: string;
}

const ImageEditor: React.FC<ImageEditorProps> = ({
  onSave,
  onCancel,
  stepId,
  initialImageUrl
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(initialImageUrl || null);
  const [currentEditingImage, setCurrentEditingImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editMode, setEditMode] = useState<'crop' | 'konva'>('crop');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<CropperCanvasRef>(null);
  const konvaRef = useRef<KonvaAnnotationsRef>(null);

  // Загружаем начальное изображение при монтировании компонента
  useEffect(() => {
    if (initialImageUrl) {
      setSelectedImage(initialImageUrl);
      setCurrentEditingImage(initialImageUrl);
    }
  }, [initialImageUrl]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Пожалуйста, выберите изображение');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setSelectedImage(imageUrl);
      setCurrentEditingImage(imageUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleCrop = () => {
    if (!cropperRef.current) return;

    setIsProcessing(true);
    
    try {
      const croppedImage = cropperRef.current.getCroppedImage();
      if (croppedImage) {
        setCurrentEditingImage(croppedImage);
        toast.success('Изображение обрезано');
      } else {
        toast.error('Ошибка при обрезке изображения');
      }
    } catch (error) {
      toast.error('Ошибка при обрезке изображения');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRotate = () => {
    if (!cropperRef.current) return;
    try {
      cropperRef.current.rotate(90);
      toast.success('Изображение повернуто');
    } catch (error) {
      toast.error('Ошибка при повороте изображения');
    }
  };

  const handleApplyAnnotations = () => {
    if (!konvaRef.current) return;

    setIsProcessing(true);
    
    try {
      const annotatedImage = konvaRef.current.getAnnotatedImage();
      if (annotatedImage) {
        // Создаем новое изображение для проверки размеров
        const img = new Image();
        img.onload = () => {
          // Создаем canvas с правильными пропорциями
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            // Сохраняем оригинальные пропорции
            const originalImg = new Image();
            originalImg.onload = () => {
              canvas.width = originalImg.naturalWidth;
              canvas.height = originalImg.naturalHeight;
              
              // Рисуем изображение без растягивания
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              
              const finalImage = canvas.toDataURL('image/jpeg', 0.9);
              setCurrentEditingImage(finalImage);
              toast.success('Аннотации применены');
              setIsProcessing(false);
            };
            
            if (currentEditingImage || selectedImage) {
              originalImg.src = currentEditingImage || selectedImage || '';
            }
          }
        };
        img.src = annotatedImage;
      } else {
        toast.error('Ошибка при применении аннотаций');
        setIsProcessing(false);
      }
    } catch (error) {
      toast.error('Ошибка при применении аннотаций');
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    const imageToSave = currentEditingImage || selectedImage;
    if (!imageToSave) {
      toast.error('Выберите изображение');
      return;
    }

    onSave(imageToSave, stepId || undefined);
    
    if (stepId) {
      toast.success('Изображение обновлено');
    } else {
      toast.success('Изображение сохранено');
    }
  };

  const getImageForEditor = () => {
    return currentEditingImage || selectedImage;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            {stepId ? 'Редактирование изображения' : 'Продвинутый редактор изображений'}
          </h2>
          <Button
            variant="ghost"
            onClick={onCancel}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              {stepId ? 'Загрузить новое изображение' : 'Выбрать изображение'}
            </Button>

            {selectedImage && (
              <>
                <Button
                  onClick={() => setEditMode('crop')}
                  variant={editMode === 'crop' ? 'default' : 'outline'}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Crop className="w-4 h-4 mr-2" />
                  Обрезка
                </Button>
                
                <Button
                  onClick={() => setEditMode('konva')}
                  variant={editMode === 'konva' ? 'default' : 'outline'}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Аннотации
                </Button>
              </>
            )}
          </div>

          {selectedImage && (
            <div className="space-y-4">
              {editMode === 'crop' ? (
                <div className="space-y-4">
                  <CropperCanvas 
                    ref={cropperRef}
                    imageUrl={getImageForEditor() || selectedImage}
                  />
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCrop}
                      disabled={isProcessing}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Scissors className="w-4 h-4 mr-2" />
                      {isProcessing ? 'Обрезка...' : 'Применить обрезку'}
                    </Button>
                    
                    <Button
                      onClick={handleRotate}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <RotateCw className="w-4 h-4 mr-2" />
                      Повернуть на 90°
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <KonvaAnnotations
                    ref={konvaRef}
                    imageUrl={getImageForEditor() || selectedImage}
                  />
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={handleApplyAnnotations}
                      disabled={isProcessing}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isProcessing ? 'Сохранение...' : 'Применить аннотации'}
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {stepId ? 'Обновить изображение' : 'Сохранить изображение'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
