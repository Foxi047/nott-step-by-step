
import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect, Circle, Line } from 'react-konva';
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
    const [tool, setTool] = useState<'select' | 'rect' | 'circle' | 'pen'>('select');
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentPath, setCurrentPath] = useState<number[]>([]);
    const stageRef = useRef(null);

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
        }

        setAnnotations(newAnnotations);
      }
    };

    const handleMouseUp = () => {
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

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
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
        
        <div className="border border-slate-600 rounded-lg p-4 bg-slate-900">
          <Stage
            width={width}
            height={height}
            ref={stageRef}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
          >
            <Layer>
              {image && (
                <KonvaImage
                  image={image}
                  width={width}
                  height={height}
                  scaleX={width / (image.width || width)}
                  scaleY={height / (image.height || height)}
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
        </div>
      </div>
    );
  }
);

KonvaAnnotations.displayName = 'KonvaAnnotations';

export default KonvaAnnotations;
