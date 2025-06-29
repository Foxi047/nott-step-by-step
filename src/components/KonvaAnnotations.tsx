
import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect, Circle, Line, Arrow } from 'react-konva';
import useImage from '../hooks/use-image';
import { Button } from '@/components/ui/button';

interface KonvaAnnotationsProps {
  imageUrl: string;
  width?: number;
  height?: number;
}

export interface KonvaAnnotationsRef {
  getAnnotatedImage: () => string | null;
  clearAnnotations: () => void;
}

const KonvaAnnotations = forwardRef<KonvaAnnotationsRef, KonvaAnnotationsProps>(
  ({ imageUrl, width = 800, height = 500 }, ref) => {
    const [image] = useImage(imageUrl);
    const [annotations, setAnnotations] = useState<any[]>([]);
    const [tool, setTool] = useState<'select' | 'rect' | 'circle' | 'pen' | 'arrow'>('select');
    const [color, setColor] = useState('#ff0000');
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentPath, setCurrentPath] = useState<number[]>([]);
    const [canvasSize, setCanvasSize] = useState({ width, height });
    const stageRef = useRef(null);

    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff', '#000000'];

    // Calculate proper canvas dimensions maintaining aspect ratio
    const calculateCanvasSize = (img: HTMLImageElement) => {
      if (!img) return { width: 800, height: 500 };
      
      const maxWidth = Math.min(800, window.innerWidth - 100);
      const maxHeight = Math.min(500, window.innerHeight - 300);
      
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      
      let canvasWidth = maxWidth;
      let canvasHeight = maxWidth / aspectRatio;
      
      if (canvasHeight > maxHeight) {
        canvasHeight = maxHeight;
        canvasWidth = maxHeight * aspectRatio;
      }
      
      return { width: canvasWidth, height: canvasHeight };
    };

    // Update canvas size when image loads
    React.useEffect(() => {
      if (image) {
        const newSize = calculateCanvasSize(image);
        setCanvasSize(newSize);
      }
    }, [image]);

    useImperativeHandle(ref, () => ({
      getAnnotatedImage: () => {
        if (!stageRef.current) return null;
        try {
          const stage = stageRef.current as any;
          return stage.toDataURL();
        } catch (error) {
          console.error('Error getting annotated image:', error);
          return null;
        }
      },
      clearAnnotations: () => {
        setAnnotations([]);
        setCurrentPath([]);
      }
    }));

    const handleMouseDown = (e: any) => {
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
          stroke: color,
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
          stroke: color,
          strokeWidth: 2,
          id: Date.now(),
          type: 'circle'
        };
        setAnnotations([...annotations, newCircle]);
      } else if (tool === 'arrow') {
        const newArrow = {
          points: [pos.x, pos.y, pos.x, pos.y],
          stroke: color,
          strokeWidth: 3,
          fill: color,
          id: Date.now(),
          type: 'arrow'
        };
        setAnnotations([...annotations, newArrow]);
      } else if (tool === 'pen') {
        setCurrentPath([pos.x, pos.y]);
      }
    };

    const handleMouseMove = (e: any) => {
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
        } else if (tool === 'arrow') {
          lastAnnotation.points = [lastAnnotation.points[0], lastAnnotation.points[1], point.x, point.y];
        }

        setAnnotations(newAnnotations);
      }
    };

    const handleMouseUp = () => {
      if (tool === 'pen' && currentPath.length > 0) {
        const newLine = {
          points: currentPath,
          stroke: color,
          strokeWidth: 2,
          id: Date.now(),
          type: 'line'
        };
        setAnnotations([...annotations, newLine]);
        setCurrentPath([]);
      }
      setIsDrawing(false);
    };

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setTool('select')}
            variant={tool === 'select' ? 'default' : 'outline'}
            size="sm"
            className="min-w-[44px] min-h-[44px] sm:min-w-auto sm:min-h-auto"
          >
            <span className="hidden sm:inline">Выбор</span>
            <span className="sm:hidden">✋</span>
          </Button>
          <Button
            onClick={() => setTool('rect')}
            variant={tool === 'rect' ? 'default' : 'outline'}
            size="sm"
            className="min-w-[44px] min-h-[44px] sm:min-w-auto sm:min-h-auto"
          >
            <span className="hidden sm:inline">□</span>
            <span className="sm:hidden">□</span>
          </Button>
          <Button
            onClick={() => setTool('circle')}
            variant={tool === 'circle' ? 'default' : 'outline'}
            size="sm"
            className="min-w-[44px] min-h-[44px] sm:min-w-auto sm:min-h-auto"
          >
            <span className="hidden sm:inline">○</span>
            <span className="sm:hidden">○</span>
          </Button>
          <Button
            onClick={() => setTool('arrow')}
            variant={tool === 'arrow' ? 'default' : 'outline'}
            size="sm"
            className="min-w-[44px] min-h-[44px] sm:min-w-auto sm:min-h-auto"
          >
            <span className="hidden sm:inline">→</span>
            <span className="sm:hidden">→</span>
          </Button>
          <Button
            onClick={() => setTool('pen')}
            variant={tool === 'pen' ? 'default' : 'outline'}
            size="sm"
            className="min-w-[44px] min-h-[44px] sm:min-w-auto sm:min-h-auto"
          >
            <span className="hidden sm:inline">✏️</span>
            <span className="sm:hidden">✏️</span>
          </Button>
          <Button
            onClick={() => setAnnotations([])}
            variant="outline"
            size="sm"
            className="border-red-600 text-red-400 min-w-[44px] min-h-[44px] sm:min-w-auto sm:min-h-auto"
          >
            <span className="hidden sm:inline">Очистить</span>
            <span className="sm:hidden">🗑️</span>
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-slate-300 self-center">Цвет:</span>
          {colors.map((clr) => (
            <button
              key={clr}
              onClick={() => setColor(clr)}
              className={`w-8 h-8 sm:w-6 sm:h-6 rounded border-2 ${
                color === clr ? 'border-white' : 'border-slate-600'
              } min-w-[44px] min-h-[44px] sm:min-w-auto sm:min-h-auto`}
              style={{ backgroundColor: clr }}
            />
          ))}
        </div>
        
        <div className="border border-slate-600 rounded-lg p-4 bg-slate-900">
          <div className="flex justify-center">
            <div 
              className="max-w-full"
              style={{ 
                maxWidth: '100%',
                width: `${canvasSize.width}px`,
                height: 'auto'
              }}
            >
              <Stage
                width={canvasSize.width}
                height={canvasSize.height}
                ref={stageRef}
                onMouseDown={handleMouseDown}
                onMousemove={handleMouseMove}
                onMouseup={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
                className="max-w-full h-auto"
              >
                <Layer>
                  {image && (
                    <KonvaImage
                      image={image}
                      width={canvasSize.width}
                      height={canvasSize.height}
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
                    } else if (annotation.type === 'arrow') {
                      return (
                        <Arrow
                          key={annotation.id}
                          points={annotation.points}
                          stroke={annotation.stroke}
                          strokeWidth={annotation.strokeWidth}
                          fill={annotation.fill}
                          pointerLength={10}
                          pointerWidth={10}
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
                      stroke={color}
                      strokeWidth={2}
                      tension={0.5}
                      lineCap="round"
                      globalCompositeOperation="source-over"
                    />
                  )}
                </Layer>
              </Stage>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

KonvaAnnotations.displayName = 'KonvaAnnotations';

export default KonvaAnnotations;
