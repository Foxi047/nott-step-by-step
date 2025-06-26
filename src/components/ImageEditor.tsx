
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Upload, Crop, Save, X } from 'lucide-react';

interface ImageEditorProps {
  onSave: (imageUrl: string, stepId?: string) => void;
  onCancel: () => void;
  stepId?: string | null;
}

const ImageEditor: React.FC<ImageEditorProps> = ({
  onSave,
  onCancel,
  stepId
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Пожалуйста, выберите изображение');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCrop = () => {
    if (!selectedImage || !canvasRef.current) return;

    setIsProcessing(true);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Простая обрезка по центру
      const size = Math.min(img.width, img.height);
      const x = (img.width - size) / 2;
      const y = (img.height - size) / 2;
      
      canvas.width = size;
      canvas.height = size;
      
      ctx.drawImage(img, x, y, size, size, 0, 0, size, size);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setSelectedImage(url);
        }
        setIsProcessing(false);
      }, 'image/jpeg', 0.9);
    };
    img.src = selectedImage;
  };

  const handleSave = () => {
    if (!selectedImage) {
      toast.error('Выберите изображение');
      return;
    }

    onSave(selectedImage, stepId || undefined);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Редактор изображений</h2>
          <Button
            variant="ghost"
            onClick={onCancel}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              Выбрать изображение
            </Button>
          </div>

          {selectedImage && (
            <div className="space-y-4">
              <div className="border border-slate-600 rounded-lg p-4 bg-slate-900">
                <img
                  src={selectedImage}
                  alt="Выбранное изображение"
                  className="max-w-full h-auto rounded"
                  style={{ maxHeight: '400px' }}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleCrop}
                  disabled={isProcessing}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Crop className="w-4 h-4 mr-2" />
                  {isProcessing ? 'Обработка...' : 'Обрезать по центру'}
                </Button>
                
                <Button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить
                </Button>
              </div>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default ImageEditor;
