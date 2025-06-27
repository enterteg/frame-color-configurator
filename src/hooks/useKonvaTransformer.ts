import { useEffect, useCallback, useRef } from 'react';
import Konva from 'konva';

interface UseKonvaTransformerProps {
  selectedLogoImageId: string | null;
  activeTexture: { images: unknown[] } | null;
  updateTextureImage: (id: string, updates: Partial<{ x: number; y: number; scaleX: number; scaleY: number; rotation: number }>) => void;
  debouncedTextureUpdate: () => void;
  setSelectedLogoImageId: (id: string | null) => void;
}

export function useKonvaTransformer({
  selectedLogoImageId,
  activeTexture,
  updateTextureImage,
  debouncedTextureUpdate,
  setSelectedLogoImageId
}: UseKonvaTransformerProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  // Update transformer when selection changes
  useEffect(() => {
    if (transformerRef.current && stageRef.current) {
      if (selectedLogoImageId) {
        const selectedNode = stageRef.current.findOne(`#${selectedLogoImageId}`);
        if (selectedNode) {
          transformerRef.current.nodes([selectedNode]);
          transformerRef.current.getLayer()?.batchDraw();
        } else {
          transformerRef.current.nodes([]);
          transformerRef.current.getLayer()?.batchDraw();
        }
      } else {
        transformerRef.current.nodes([]);
        transformerRef.current.getLayer()?.batchDraw();
      }
    }
  }, [selectedLogoImageId]);

  // Handle logo transform
  const handleTransform = useCallback((id: string, newAttrs: Partial<{ x: number; y: number; scaleX: number; scaleY: number; rotation: number }>) => {
    if (!activeTexture) return;
    
    // Update the image in the store
    updateTextureImage(id, newAttrs);
    
    // Trigger debounced texture update
    debouncedTextureUpdate();
  }, [activeTexture, updateTextureImage, debouncedTextureUpdate]);

  // Handle logo drag
  const handleDrag = useCallback((id: string, e: Konva.KonvaEventObject<DragEvent>) => {
    const newAttrs = {
      x: e.target.x(),
      y: e.target.y()
    };
    handleTransform(id, newAttrs);
  }, [handleTransform]);

  // Handle logo transform change
  const handleTransformChange = useCallback((id: string, e: Konva.KonvaEventObject<Event>) => {
    const node = e.target;
    const newAttrs = {
      x: node.x(),
      y: node.y(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY(),
      rotation: node.rotation()
    };
    handleTransform(id, newAttrs);
  }, [handleTransform]);

  const handleImageClick = useCallback((id: string) => {
    setSelectedLogoImageId(id);
  }, [setSelectedLogoImageId]);

  return {
    stageRef,
    transformerRef,
    handleDrag,
    handleTransform,
    handleTransformChange,
    handleImageClick
  };
} 