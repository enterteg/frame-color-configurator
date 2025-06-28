import { useEffect, useCallback, useRef } from 'react';
import Konva from 'konva';

interface UseKonvaTransformerProps {
  selectedLogoImageId: string | null;
  activeTexture: { images: unknown[]; processedImages?: Record<string, HTMLImageElement> } | null;
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

  // Update transformer when selection changes or images become available
  useEffect(() => {
    if (!transformerRef.current || !stageRef.current) return;

    let timeoutId: NodeJS.Timeout;

    if (selectedLogoImageId) {
      // Check if the image is already processed to avoid unnecessary retries
      const imageIsProcessed = activeTexture?.processedImages?.[selectedLogoImageId];
      
      // Retry finding the node with exponential backoff to handle async image processing
      let retryCount = 0;
      const maxRetries = imageIsProcessed ? 3 : 10; // Fewer retries if image is already processed
      
      const findAndAttachNode = () => {
        const selectedNode = stageRef.current!.findOne(`#${selectedLogoImageId}`);
        
        if (selectedNode) {
          // Node found - attach transformer
          transformerRef.current!.nodes([selectedNode]);
          transformerRef.current!.getLayer()?.batchDraw();
        } else if (retryCount < maxRetries) {
          // Node not found yet - retry with increasing delay
          retryCount++;
          const delay = Math.min(50 * Math.pow(1.5, retryCount - 1), 1000); // Max 1 second delay
          timeoutId = setTimeout(findAndAttachNode, delay);
        } else {
          // Max retries reached - clear transformer
          transformerRef.current!.nodes([]);
          transformerRef.current!.getLayer()?.batchDraw();
        }
      };
      
      findAndAttachNode();
    } else {
      // No selection - clear transformer
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
    }

    // Cleanup function to prevent memory leaks
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [selectedLogoImageId, activeTexture?.processedImages]);

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

  // Helper function to immediately try attaching transformer
  const immediateAttachTransformer = useCallback((id: string) => {
    if (transformerRef.current && stageRef.current) {
      const node = stageRef.current.findOne(`#${id}`);
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer()?.batchDraw();
        return true; // Successfully attached
      }
    }
    return false; // Failed to attach
  }, []);

  const handleImageClick = useCallback((id: string) => {
    setSelectedLogoImageId(id);
    // Try immediate attachment for better UX (fallback to useEffect retry mechanism)
    immediateAttachTransformer(id);
  }, [setSelectedLogoImageId, immediateAttachTransformer]);

  return {
    stageRef,
    transformerRef,
    handleDrag,
    handleTransform,
    handleTransformChange,
    handleImageClick
  };
} 