import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Upload, Crop, Save, X, RotateCw, Scissors, Palette } from 'lucide-react';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { Stage, Layer, Image as KonvaImage, Rect, Circle, Line } from 'react-konva';
import useImage from '../hooks/use-image';

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
  const [editMode, setEditMode] = useState<'crop' | 'konva'>('crop');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const cropperRef = useRef<Cropper | null>(null);
  const stageRef = useRef(null);
  const [image] = useImage(selectedImage || '');
  const [annotations, setAnnotations] = useState<any[]>([]);
  const [tool, setTool] = useState<'select' | 'rect' | 'circle' | 'pen'>('select');
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<number[]>([]);

  useEffect(() => {
    if (imageRef.current && selectedImage && editMode === 'crop') {
      if (cropperRef.current) {
        cropperRef.current.destroy();
        cropperRef.current = null;
      }
      cropperRef.current = new Cropper(imageRef.current, {
        dragMode: 'crop',
        autoCropArea: 1,
        responsive: true,
        restore: false,
        guides: true,
        center: true,
        highlight: false,
        movable: true,
        resizable: true,
        rotatable: true,
        scalable: true,
        zoomable: true,
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
  }, [selectedImage, editMode]);

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
    if (!cropperRef.current) return;

    setIsProcessing(true);
    
    try {
      const canvas = cropperRef.current.getCroppedCanvas();
      if (canvas) {
        const dataURL = canvas.toDataURL('image/jpeg', 0.9);
        setSelectedImage(dataURL);
        setIsProcessing(false);
      } else {
        setIsProcessing(false);
        toast.error('Ошибка при обрезке изображения');
      }
    } catch (error) {
      setIsProcessing(false);
      toast.error('Ошибка при обрезке изображения');
    }
  };

  const handleRotate = () => {
    if (!cropperRef.current) return;
    try {
      cropperRef.current.rotate(90);
    } catch (error) {
      toast.error('Ошибка при повороте изображения');
    }
  };

  const handleKonvaMouseDown = (e: any) => {
    if (tool === 'select') return;

    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();

    if (tool === 'rect') {
      const newRect = {
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        fill: 'transparent',
        stroke: 'red',
        strokeWidth: 2,
        id: Date.now(),
        type: 'rect'
      };
      setAnnotations([...annotations, newRect]);
    } else if (tool === 'circle') {
      const newCircle = {
        x: pos.x,
        y: pos.y,
        radius: 0,
        fill: 'transparent',
        stroke: 'red',
        strokeWidth: 2,
        id: Date.now(),
        type: 'circle'
      };
      setAnnotations([...annotations, newCircle]);
    } else if (tool === 'pen') {
      setCurrentPath([pos.x, pos.y]);
    }
  };

  const handleKonvaMouseMove = (e: any) => {
    if (!isDrawing) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    if (tool === 'pen') {
      setCurrentPath([...currentPath, point.x, point.y]);
    } else {
      const newAnnotations = [...annotations];
      const lastAnnotation = newAnnotations[newAnnotations.length - 1];

      if (tool === 'rect') {
        lastAnnotation.width = point.x - lastAnnotation.x;
        lastAnnotation.height = point.y - lastAnnotation.y;
      } else if (tool === 'circle') {
        const radius = Math.sqrt(
          Math.pow(point.x - lastAnnotation.x, 2) + Math.pow(point.y - lastAnnotation.y, 2)
        );
        lastAnnotation.radius = radius;
      }

      setAnnotations(newAnnotations);
    }
  };

  const handleKonvaMouseUp = () => {
    if (tool === 'pen' && currentPath.length > 0) {
      const newLine = {
        points: currentPath,
        stroke: 'red',
        strokeWidth: 2,
        id: Date.now(),
        type: 'line'
      };
      setAnnotations([...annotations, newLine]);
      setCurrentPath([]);
    }
    setIsDrawing(false);
  };

  const handleKonvaSave = () => {
    if (!stageRef.current) return;

    setIsProcessing(true);
    const stage = stageRef.current as any;
    const dataURL = stage.toDataURL();
    setSelectedImage(dataURL);
    setIsProcessing(false);
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
      <div className="bg-slate-800 rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Продвинутый редактор изображений</h2>
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
              Выбрать изображение
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
                <div className="border border-slate-600 rounded-lg p-4 bg-slate-900">
                  <img
                    ref={imageRef}
                    src={selectedImage}
                    alt="Редактируемое изображение"
                    className="max-w-full h-auto"
                    style={{ maxHeight: '500px' }}
                  />
                  
                  <div className="flex gap-2 mt-4">
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
                <div className="border border-slate-600 rounded-lg p-4 bg-slate-900">
                  <div className="flex gap-2 mb-4">
                    <Button
                      onClick={() => setTool('select')}
                      variant={tool === 'select' ? 'default' : 'outline'}
                      size="sm"
                    >
                      Выбор
                    </Button>
                    <Button
                      onClick={() => setTool('rect')}
                      variant={tool === 'rect' ? 'default' : 'outline'}
                      size="sm"
                    >
                      Прямоугольник
                    </Button>
                    <Button
                      onClick={() => setTool('circle')}
                      variant={tool === 'circle' ? 'default' : 'outline'}
                      size="sm"
                    >
                      Круг
                    </Button>
                    <Button
                      onClick={() => setTool('pen')}
                      variant={tool === 'pen' ? 'default' : 'outline'}
                      size="sm"
                    >
                      Рисование
                    </Button>
                    <Button
                      onClick={() => setAnnotations([])}
                      variant="outline"
                      size="sm"
                      className="border-red-600 text-red-400"
                    >
                      Очистить
                    </Button>
                  </div>
                  
                  <Stage
                    width={800}
                    height={500}
                    ref={stageRef}
                    onMouseDown={handleKonvaMouseDown}
                    onMousemove={handleKonvaMouseMove}
                    onMouseup={handleKonvaMouseUp}
                  >
                    <Layer>
                      {image && (
                        <KonvaImage
                          image={image}
                          width={800}
                          height={500}
                          scaleX={800 / (image.width || 800)}
                          scaleY={500 / (image.height || 500)}
                        />
                      )}
                      
                      {annotations.map((annotation) => {
                        if (annotation.type === 'rect') {
                          return (
                            <Rect
                              key={annotation.id}
                              x={annotation.x}
                              y={annotation.y}
                              width={annotation.width}
                              height={annotation.height}
                              fill={annotation.fill}
                              stroke={annotation.stroke}
                              strokeWidth={annotation.strokeWidth}
                            />
                          );
                        } else if (annotation.type === 'circle') {
                          return (
                            <Circle
                              key={annotation.id}
                              x={annotation.x}
                              y={annotation.y}
                              radius={annotation.radius}
                              fill={annotation.fill}
                              stroke={annotation.stroke}
                              strokeWidth={annotation.strokeWidth}
                            />
                          );
                        } else if (annotation.type === 'line') {
                          return (
                            <Line
                              key={annotation.id}
                              points={annotation.points}
                              stroke={annotation.stroke}
                              strokeWidth={annotation.strokeWidth}
                              tension={0.5}
                              lineCap="round"
                              globalCompositeOperation="source-over"
                            />
                          );
                        }
                        return null;
                      })}
                      
                      {tool === 'pen' && currentPath.length > 0 && (
                        <Line
                          points={currentPath}
                          stroke="red"
                          strokeWidth={2}
                          tension={0.5}
                          lineCap="round"
                          globalCompositeOperation="source-over"
                        />
                      )}
                    </Layer>
                  </Stage>
                  
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={handleKonvaSave}
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
                  Сохранить изображение
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
