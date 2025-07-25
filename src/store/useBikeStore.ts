import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as THREE from 'three';
import { RALColor, getColorById, DEFAULT_FRAME_COLOR_ID, DEFAULT_FORK_COLOR_ID, DEFAULT_LOGO_COLOR_ID } from '../data/ralColors';
import { TextureImage, LogoType, TabType, GradientSettings } from '../types/bike';
import { generateImageTexture } from '../utils/generateImageTexture';
import { useShallow } from 'zustand/shallow';
import { TEXTURE_SIZE } from '../utils/constants';

// Get default colors from main definitions
const DEFAULT_FRAME_COLOR = getColorById(DEFAULT_FRAME_COLOR_ID) || {
  code: 'RAL 1014',
  name: 'Oyster White', 
  hex: '#E9E5CE'
};

const DEFAULT_FORK_COLOR = getColorById(DEFAULT_FORK_COLOR_ID) || {
  code: 'RAL 1014',
  name: 'Oyster White',
  hex: '#E9E5CE'
};

// Generic texture data with aspect ratio configuration
export interface TextureData {
  images: TextureImage[];
  texture: THREE.Texture | null;
  aspectRatio: number; // width:height ratio (e.g., 1 for square, 10 for wide)
  processedImages: Record<string, HTMLImageElement>; // imageId -> processed HTMLImageElement
  gradient?: GradientSettings; // Optional gradient overlay/background
}

interface BikeState {
  // Navigation state
  activeTab: TabType;
  navigationCollapsed: boolean;
  logosCollapsed: boolean;
  
  // Color state
  frameColor: RALColor;
  forkColor: RALColor;
  selectedLogoColor: string;
  tireWallColor: 'black' | 'brown' | 'white' | 'light_brown';
  rimType: '35' | '50';
  
  // Logo state - now supports multiple logo types with aspect ratios
  logoTypes: {
    HEAD_TUBE: TextureData;
    DOWN_TUBE_LEFT: TextureData;
    DOWN_TUBE_RIGHT: TextureData;
  };
  selectedLogoType: LogoType | null;
  selectedLogoImageId: string | null;
  
  // Panel state
  rightPanelOpen: boolean;
  showLogoEditor: boolean;
  showBottomPanel: boolean;
  bottomPanelHeight: number;
  
  // Color selection state
  isColorSelectionOpen: boolean;
  selectedColorGroup: string | null;
  colorSelectionType: 'frame' | 'fork' | 'logo' | 'gradient' | null;
  gradientColorStopIndex: number | null; // Index of the gradient color stop being edited
  
  // Selection panel state
  selectionPanelType: 'color' | 'image';
  
  // New: metallic/matte toggle
  isFrameMetallic: boolean;
  
  // Actions
  setActiveTab: (tab: TabType) => void;
  toggleNavigationCollapsed: () => void;
  setLogosCollapsed: (collapsed: boolean) => void;
  setFrameColor: (color: RALColor) => void;
  setForkColor: (color: RALColor) => void;
  setSelectedLogoColor: (color: string) => void;
  setTireWallColor: (color: 'black' | 'brown' | 'white' | 'light_brown') => void;
  setRimType: (type: '35' | '50') => void;
  setSelectedLogoImageId: (imageId: string | null) => void;
  setSelectedLogoType: (logoType: LogoType | null) => void;
  setRightPanelOpen: (open: boolean) => void;
  setShowLogoEditor: (show: boolean) => void;
  setShowBottomPanel: (show: boolean) => void;
  setBottomPanelHeight: (height: number) => void;
  openColorSelection: (type: 'frame' | 'fork' | 'logo') => void;
  openGradientColorSelection: (colorStopIndex: number) => void;
  closeColorSelection: () => void;
  setSelectedColorGroup: (group: string | null) => void;
  handleColorChangeRequest: (imageId: string) => void;
  clearLogoSelection: () => void;
  setSelectionPanelType: (type: 'color' | 'image') => void;
  setFrameMetallic: (isMetallic: boolean) => void;
  
  // Logo management actions
  addLogoImage: (logoType: LogoType, image: Omit<TextureImage, 'id'>) => void;
  addLogoImageFromFile: (logoType: LogoType, file: File) => string;
  removeLogoImage: (logoType: LogoType, imageId: string) => void;
  updateLogoImage: (imageId: string, updates: Partial<TextureImage>) => void;
  updateLogoTypeImages: (logoType: LogoType, images: TextureImage[]) => void;
  setLogoTexture: (texture: THREE.Texture | null) => void;
  setLogoColor: (logoType: LogoType, imageId: string, color: RALColor) => void;
  
  // Getters
  getCurrentLogoTexture: () => THREE.Texture | null;
  getCurrentCanvasSize: () => { width: number; height: number };
  getSelectedLogoImage: () => TextureImage | null;
  getHeadTubeLogoImages: () => TextureImage[];
  getDownTubeLeftLogoImages: () => TextureImage[];
  getDownTubeRightLogoImages: () => TextureImage[];
  
  // New actions
  setLogoTextureFromState: (logoType: LogoType) => Promise<void>;


  // Configuration actions
  saveConfiguration: () => string;
  loadConfiguration: (config: string) => void;

  // New action
  resetStore: () => void;

  // New: frameTexture state
  frameTexture: TextureData;

  // New actions for frameTexture management
  addFrameTextureImage: (image: Omit<TextureImage, 'id'>) => void;
  updateFrameTextureImage: (imageId: string, updates: Partial<TextureImage>) => void;
  removeFrameTextureImage: (imageId: string) => void;
  setFrameTexture: (texture: THREE.Texture | null) => void;
  reorderFrameTextureImages: (images: TextureImage[]) => void;

  // Generic texture image update action
  updateTextureImage: (imageId: string, updates: Partial<TextureImage>) => void;

  // Processed images management actions
  setLogoProcessedImages: (logoType: LogoType, processedImages: Record<string, HTMLImageElement>) => void;
  setFrameProcessedImages: (processedImages: Record<string, HTMLImageElement>) => void;
  setLogoTypeTexture: (logoType: LogoType, texture: THREE.Texture | null) => void;

  // Gradient management actions
  setFrameGradient: (gradient: GradientSettings | undefined) => void;
  updateFrameGradient: (updates: Partial<GradientSettings>) => void;
  updateGradientColorStop: (index: number, color: RALColor) => void;
}

// Create default logo image configuration
const createDefaultLogoImage = (logoType: string, aspectRatio: number, name: string, url: string): TextureImage => {
  // Calculate canvas size from aspect ratio (base width = TEXTURE_SIZE)
  const canvasWidth = TEXTURE_SIZE;
  const canvasHeight = TEXTURE_SIZE / aspectRatio;
  
  // Calculate texture capture area offset (same logic as useCanvasCalculations)
  const STAGE_PADDING = canvasHeight * 0.2;
  const TEXTURE_OFFSET_X = STAGE_PADDING;
  const TEXTURE_OFFSET_Y = STAGE_PADDING;
  
  return {
    id: `default_${logoType.toLowerCase()}_logo`,
    name: name,
    url: url,
    color: getColorById('9005') || { code: 'RAL 9005', name: 'Jet black', hex: '#0A0A0A' },
    x: TEXTURE_OFFSET_X + canvasWidth / 2, // Center horizontally within texture capture area
    y: TEXTURE_OFFSET_Y + canvasHeight / 2, // Center vertically within texture capture area
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    zIndex: 0
  };
};

export const useBikeStore = create<BikeState>()(
  persist(
    (set, get) => ({
      // Initial state
      activeTab: null,
      navigationCollapsed: false,
      logosCollapsed: true,
      frameColor: DEFAULT_FRAME_COLOR,
      forkColor: DEFAULT_FORK_COLOR,
      selectedLogoColor: '#000000',
      tireWallColor: 'brown',
      rimType: '50',
      
      // Initialize logo types with proper canvas sizes and initial images
      logoTypes: {
        HEAD_TUBE: {
          images: [createDefaultLogoImage('HEAD_TUBE', 1, 'Loca front', '/textures/logos/loca_circles.png')],
          texture: null,
          aspectRatio: 1.2,
          processedImages: {},
        },
        DOWN_TUBE_LEFT: {
          images: [createDefaultLogoImage('DOWN_TUBE_LEFT', 10, 'Loca half', '/textures/logos/loca_half.png')],
          texture: null,
          aspectRatio: 8,
          processedImages: {},
        },
        DOWN_TUBE_RIGHT: {
          images: [createDefaultLogoImage('DOWN_TUBE_RIGHT', 10, 'Loca half', '/textures/logos/loca_half.png')],
          texture: null,
          aspectRatio: 8,
          processedImages: {},
        }
      },
      selectedLogoType: null,
      selectedLogoImageId: null,
      
      rightPanelOpen: false,
      showLogoEditor: false,
      showBottomPanel: false,
      bottomPanelHeight: 300, // 400 (HEAD_TUBE height) + 120 (header + padding)
      isColorSelectionOpen: false,
      selectedColorGroup: null,
      colorSelectionType: null,
      gradientColorStopIndex: null,
      selectionPanelType: 'color',
      // New: metallic/matte toggle
      isFrameMetallic: true,

      // New: frameTexture state
      frameTexture: {
        images: [],
        texture: null,
        aspectRatio: 1, // 1:1 for square
        processedImages: {},
      },

      // Actions
      setActiveTab: (tab) => set(() => {
        const newState: Partial<BikeState> = { activeTab: tab };
        
        if (tab === 'logos') {
          newState.rightPanelOpen = true;
          newState.showLogoEditor = true;
          newState.isColorSelectionOpen = false;
        } else if (tab === 'frame' || tab === 'fork') {
          newState.showLogoEditor = false;
          newState.isColorSelectionOpen = false;
          newState.rightPanelOpen = false;
          newState.showBottomPanel = false;
          // Clear selected logo state when switching to frame/fork
          newState.selectedLogoImageId = null;
          newState.selectedLogoType = null;
        } else {
          newState.rightPanelOpen = false;
          newState.showLogoEditor = false;
          newState.isColorSelectionOpen = false;
          newState.showBottomPanel = false;
          // Clear selected logo state for null tab as well
          newState.selectedLogoImageId = null;
          newState.selectedLogoType = null;
        }
        
        return newState;
      }),

      toggleNavigationCollapsed: () => set((state) => ({ 
        navigationCollapsed: !state.navigationCollapsed 
      })),

      setLogosCollapsed: (collapsed) => set({ logosCollapsed: collapsed }),

      setFrameColor: (color) => set({ frameColor: color }),
      
      setForkColor: (color) => set({ forkColor: color }),
      
      setSelectedLogoColor: (color) => set({ selectedLogoColor: color }),
      
      setTireWallColor: (color) => set({ tireWallColor: color }),
      
      setRimType: (type) => set({ rimType: type }),
      
      setSelectedLogoImageId: (imageId) => set({ 
        selectedLogoImageId: imageId,
        showBottomPanel: imageId !== null
      }),
      
      setSelectedLogoType: (logoType) => set(() => { 
        const newState: Partial<BikeState> = {
          selectedLogoType: logoType,
          selectedLogoImageId: null,
          showBottomPanel: false
        };
        return newState;
      }),
      
      setRightPanelOpen: (open) => set({ rightPanelOpen: open }),
      
      setShowLogoEditor: (show) => set({ showLogoEditor: show }),
        
      setShowBottomPanel: (show) => set(() => {
        // If closing the bottom panel and color picker is open for logo, close the color picker too
        if (!show) {
          return {
            showBottomPanel: false,
            activeTab: null,
            isColorSelectionOpen: false,
            colorSelectionType: null,
            selectedColorGroup: null,
            selectionPanelType: undefined
          };
        }
        return {
          showBottomPanel: true
        };
      }),
      
      setBottomPanelHeight: (height) => set({ bottomPanelHeight: height }),
      
      openColorSelection: (type) => set({
        isColorSelectionOpen: true,
        colorSelectionType: type,
        selectedColorGroup: null,
        rightPanelOpen: false,
        activeTab: type === 'logo' ? 'logos' : type,
        selectionPanelType: 'color'
      }),

      openGradientColorSelection: (colorStopIndex) => set({
        isColorSelectionOpen: true,
        colorSelectionType: 'gradient',
        gradientColorStopIndex: colorStopIndex,
        selectedColorGroup: null,
        rightPanelOpen: false,
        activeTab: 'frame',
        selectionPanelType: 'color'
      }),
      
      closeColorSelection: () => set({
        isColorSelectionOpen: false,
        colorSelectionType: null,
        selectedColorGroup: null,
        gradientColorStopIndex: null
      }),
      
      setSelectedColorGroup: (group) => set({ selectedColorGroup: group }),
      
      handleColorChangeRequest: () => {
        set({
          isColorSelectionOpen: true,
          colorSelectionType: 'logo',
          selectedColorGroup: null,
          rightPanelOpen: false
        });
      },

      clearLogoSelection: () => set({
        selectedLogoType: null,
        selectedLogoImageId: null,
        showBottomPanel: false
      }),

      setSelectionPanelType: (type: 'color' | 'image') => set({ selectionPanelType: type }),

      // Logo management actions
      addLogoImage: (logoType, image) => set((state) => {
        const newImage: TextureImage = {
          ...image,
          id: `${logoType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
        
        return {
          logoTypes: {
            ...state.logoTypes,
            [logoType]: {
              ...state.logoTypes[logoType],
              images: [...state.logoTypes[logoType].images, newImage]
            }
          }
        };
      }),

      // Update logo type images
      updateLogoTypeImages: (logoType, images) => set((state) => ({
        logoTypes: {
          ...state.logoTypes,
          [logoType]: {
            ...state.logoTypes[logoType],
            images
          }
        }
      })),

      // File-based logo addition with proper cleanup (from old store)
      addLogoImageFromFile: (logoType, file) => {
        const id = `${logoType}_${crypto.randomUUID()}`;
        const blobUrl = URL.createObjectURL(file);
        const defaultColor = getColorById(DEFAULT_LOGO_COLOR_ID) || getColorById('9005') || { 
          code: 'RAL 9005', 
          name: 'Jet black', 
          hex: '#0A0A0A' 
        };
        
        // Calculate canvas size from aspect ratio
        const aspectRatio = get().logoTypes[logoType].aspectRatio;
        const canvasWidth = TEXTURE_SIZE;
        const canvasHeight = TEXTURE_SIZE / aspectRatio;
        
        // Calculate texture capture area offset (same logic as useCanvasCalculations)
        const STAGE_PADDING = canvasHeight * 0.2;
        const TEXTURE_OFFSET_X = STAGE_PADDING;
        const TEXTURE_OFFSET_Y = STAGE_PADDING;
        
        const newImage: TextureImage = {
          id,
          file,
          blobUrl,
          name: file.name,
          x: TEXTURE_OFFSET_X + canvasWidth / 2, // Center within texture capture area
          y: TEXTURE_OFFSET_Y + canvasHeight / 2, // Center within texture capture area
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          color: defaultColor,
          zIndex: 0,
        };

        set((state) => ({
          logoTypes: {
            ...state.logoTypes,
            [logoType]: {
              ...state.logoTypes[logoType],
              images: [...state.logoTypes[logoType].images, newImage]
            }
          }
        }));

        return id;
      },

      removeLogoImage: (logoType, imageId) => {
        // Clean up blob URL if it exists (from old store)
        const state = get();
        const logoImage = state.logoTypes[logoType].images.find(img => img.id === imageId);
        if (logoImage && logoImage.blobUrl) {
          URL.revokeObjectURL(logoImage.blobUrl);
        }
        
        set((state) => ({
          logoTypes: {
            ...state.logoTypes,
            [logoType]: {
              ...state.logoTypes[logoType],
              images: state.logoTypes[logoType].images.filter(img => img.id !== imageId)
            }
          },
          selectedLogoImageId: state.selectedLogoImageId === imageId ? null : state.selectedLogoImageId,
          showBottomPanel: state.selectedLogoImageId === imageId ? false : state.showBottomPanel
        }));
      },

      updateLogoImage: (imageId, updates) => set((state) => {
        const type = state.selectedLogoType;
        if (!type) return {};
        return {
          logoTypes: {
            ...state.logoTypes,
            [type]: {
              ...state.logoTypes[type],
              images: state.logoTypes[type].images.map(img =>
                img.id === imageId ? { ...img, ...updates } : img
              )
            }
          }
        };
      }),

      setLogoTexture: (texture) => set((state) => {
        const type = state.selectedLogoType;
        if (!type) return {};
        return {
          logoTypes: {
            ...state.logoTypes,
            [type]: {
              ...state.logoTypes[type],
              texture
            }
          }
        };
      }),

      // Logo color setter (from old store)
      setLogoColor: (logoType, imageId, color) => set((state) => {
        // Update the color in the images array
        const updatedImages = state.logoTypes[logoType].images.map(img =>
          img.id === imageId ? { ...img, color } : img
        );

        // Generate new texture with updated images
        generateImageTexture({
          width: TEXTURE_SIZE,
          height: TEXTURE_SIZE,
          images: updatedImages,
        }).then(texture => {
          set(state => ({
            logoTypes: {
              ...state.logoTypes,
              [logoType]: {
                ...state.logoTypes[logoType],
                images: updatedImages,
                texture
              }
            }
          }));
        });

        // Return immediate state update
        return {
          logoTypes: {
            ...state.logoTypes,
            [logoType]: {
              ...state.logoTypes[logoType],
              images: updatedImages
            }
          }
        };
      }),

      // Getters
      getCurrentLogoTexture: () => {
        const state = get();
        if (state.selectedLogoType) {
          return state.logoTypes[state.selectedLogoType].texture;
        }
        return null;
      },

      getCurrentCanvasSize: () => {
        const state = get();
        if (state.selectedLogoType) {
          return { width: TEXTURE_SIZE, height: TEXTURE_SIZE / state.logoTypes[state.selectedLogoType].aspectRatio };
        }
        return { width: 0, height: 0 };
      },

      // Computed getters (from old store)
      getSelectedLogoImage: () => {
        const { logoTypes, selectedLogoType, selectedLogoImageId } = get();
        if (!selectedLogoType || !selectedLogoImageId) return null;
        return logoTypes[selectedLogoType].images.find(img => img.id === selectedLogoImageId) || null;
      },

      getHeadTubeLogoImages: () => get().logoTypes.HEAD_TUBE.images,
      
      getDownTubeLeftLogoImages: () => get().logoTypes.DOWN_TUBE_LEFT.images,
      
      getDownTubeRightLogoImages: () => get().logoTypes.DOWN_TUBE_RIGHT.images,

      setLogoTextureFromState: async (logoType: LogoType) => {
        const state = get();
        const logoData = state.logoTypes[logoType];
        if (!logoData) return;
        const width = TEXTURE_SIZE;
        const height = TEXTURE_SIZE
        const texture = await generateImageTexture({
          width,
          height,
          images: logoData.images,
        });
        set((state) => ({
          logoTypes: {
            ...state.logoTypes,
            [logoType]: {
              ...state.logoTypes[logoType],
              texture,
            },
          },
        }));
      },



      saveConfiguration: () => {
        const state = get();
        const config = {
          frameColor: state.frameColor,
          forkColor: state.forkColor,
          isFrameMetallic: state.isFrameMetallic,
          tireWallColor: state.tireWallColor,
          rimType: state.rimType,
          logoTypes: {
            HEAD_TUBE: {
              ...state.logoTypes.HEAD_TUBE,
              images: state.logoTypes.HEAD_TUBE.images.map(img => ({
                id: img.id,
                name: img.name,
                url: img.url,
                color: img.color,
                x: img.x,
                y: img.y,
                scaleX: img.scaleX,
                scaleY: img.scaleY,
                rotation: img.rotation,
                zIndex: img.zIndex,
              }))
            },
            DOWN_TUBE_LEFT: {
              ...state.logoTypes.DOWN_TUBE_LEFT,
              images: state.logoTypes.DOWN_TUBE_LEFT.images.map(img => ({
                id: img.id,
                name: img.name,
                url: img.url,
                color: img.color,
                x: img.x,
                y: img.y,
                scaleX: img.scaleX,
                scaleY: img.scaleY,
                rotation: img.rotation,
                zIndex: img.zIndex,
              }))
            },
            DOWN_TUBE_RIGHT: {
              ...state.logoTypes.DOWN_TUBE_RIGHT,
              images: state.logoTypes.DOWN_TUBE_RIGHT.images.map(img => ({
                id: img.id,
                name: img.name,
                url: img.url,
                color: img.color,
                x: img.x,
                y: img.y,
                scaleX: img.scaleX,
                scaleY: img.scaleY,
                rotation: img.rotation,
                zIndex: img.zIndex,
              }))
            },
          },
          frameTexture: {
            ...state.frameTexture,
            images: state.frameTexture.images.map(img => ({
              id: img.id,
              name: img.name,
              url: img.url,
              // Note: frame textures don't have individual colors
              x: img.x,
              y: img.y,
              scaleX: img.scaleX,
              scaleY: img.scaleY,
              rotation: img.rotation,
              zIndex: img.zIndex,
            })),
            gradient: state.frameTexture.gradient // Save gradient settings
          },
          selectedLogoType: state.selectedLogoType,
          selectedLogoImageId: state.selectedLogoImageId,
        };
        return JSON.stringify(config, null, 2); // Pretty print JSON
      },

      loadConfiguration: (configString: string) => {
        try {
          const config = JSON.parse(configString);
          
          // Update the state with the loaded configuration
          set((state) => ({
            frameColor: config.frameColor || state.frameColor,
            forkColor: config.forkColor || state.forkColor,
            isFrameMetallic: config.isFrameMetallic ?? state.isFrameMetallic,
            tireWallColor: config.tireWallColor || state.tireWallColor,
            rimType: config.rimType || state.rimType,
            logoTypes: {
              ...state.logoTypes,
              HEAD_TUBE: {
                ...state.logoTypes.HEAD_TUBE,
                images: config.logoTypes?.HEAD_TUBE?.images || state.logoTypes.HEAD_TUBE.images
              },
              DOWN_TUBE_LEFT: {
                ...state.logoTypes.DOWN_TUBE_LEFT,
                images: config.logoTypes?.DOWN_TUBE_LEFT?.images || state.logoTypes.DOWN_TUBE_LEFT.images
              },
              DOWN_TUBE_RIGHT: {
                ...state.logoTypes.DOWN_TUBE_RIGHT,
                images: config.logoTypes?.DOWN_TUBE_RIGHT?.images || state.logoTypes.DOWN_TUBE_RIGHT.images
              }
            },
            frameTexture: {
              ...state.frameTexture,
              images: config.frameTexture?.images || state.frameTexture.images,
              gradient: config.frameTexture?.gradient || state.frameTexture.gradient
            },
            selectedLogoType: config.selectedLogoType ?? state.selectedLogoType,
            selectedLogoImageId: config.selectedLogoImageId ?? state.selectedLogoImageId,
          }));

          // Note: textures will be automatically re-processed by useTextureProcessingManager
        } catch (error) {
          console.error('Failed to load configuration:', error);
          throw new Error('Invalid configuration format');
        }
      },

      // New action
      setFrameMetallic: (isMetallic) => set({ isFrameMetallic: isMetallic }),

      // New action
      resetStore: () => {
        // Remove persisted data
        if (typeof window !== 'undefined') {
          localStorage.removeItem('bike-store');
        }
        // Reset all state to initial values
        window.location.reload();
      },

      // New actions for frameTexture management
      addFrameTextureImage: (image: Omit<TextureImage, 'id'>) => set((state) => {
        const newImage: TextureImage = {
          ...image,
          id: `FRAME_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
        return {
          frameTexture: {
            ...state.frameTexture,
            images: [...state.frameTexture.images, newImage]
          }
        };
      }),
      updateFrameTextureImage: (imageId: string, updates: Partial<TextureImage>) => set((state) => ({
        frameTexture: {
          ...state.frameTexture,
          images: state.frameTexture.images.map(img =>
            img.id === imageId ? { ...img, ...updates } : img
          )
        }
      })),
      removeFrameTextureImage: (imageId: string) => set((state) => ({
        frameTexture: {
          ...state.frameTexture,
          images: state.frameTexture.images.filter(img => img.id !== imageId)
        }
      })),
      setFrameTexture: (texture: THREE.Texture | null) => set((state) => ({
        frameTexture: {
          ...state.frameTexture,
          texture
        }
      })),
      reorderFrameTextureImages: (images: TextureImage[]) => set((state) => ({
        frameTexture: {
          ...state.frameTexture,
          images
        }
      })),

      // Generic texture image update action
      updateTextureImage: (imageId: string, updates: Partial<TextureImage>) => set((state) => {
        // Check if this is a frame texture image
        const isFrameTextureImage = state.frameTexture.images.some(img => img.id === imageId);
        if (isFrameTextureImage) {
          return {
            frameTexture: {
              ...state.frameTexture,
              images: state.frameTexture.images.map(img =>
                img.id === imageId ? { ...img, ...updates } : img
              )
            }
          };
        } else if (state.selectedLogoType) {
          const type = state.selectedLogoType;
          return {
            logoTypes: {
              ...state.logoTypes,
              [type]: {
                ...state.logoTypes[type],
                images: state.logoTypes[type].images.map(img =>
                  img.id === imageId ? { ...img, ...updates } : img
                )
              }
            }
          };
        }
        return {};
      }),

      // Processed images management actions
      setLogoProcessedImages: (logoType: LogoType, processedImages: Record<string, HTMLImageElement>) => set((state) => ({
        logoTypes: {
          ...state.logoTypes,
          [logoType]: {
            ...state.logoTypes[logoType],
            processedImages
          }
        }
      })),

      setFrameProcessedImages: (processedImages: Record<string, HTMLImageElement>) => set((state) => ({
        frameTexture: {
          ...state.frameTexture,
          processedImages
        }
      })),

      setLogoTypeTexture: (logoType: LogoType, texture: THREE.Texture | null) => set((state) => ({
        logoTypes: {
          ...state.logoTypes,
          [logoType]: {
            ...state.logoTypes[logoType],
            texture
          }
        }
      })),

      // Gradient management actions
      setFrameGradient: (gradient: GradientSettings | undefined) => set((state) => ({
        frameTexture: {
          ...state.frameTexture,
          gradient
        }
      })),

      updateFrameGradient: (updates: Partial<GradientSettings>) => set((state) => ({
        frameTexture: {
          ...state.frameTexture,
          gradient: state.frameTexture.gradient ? {
            ...state.frameTexture.gradient,
            ...updates
          } : undefined
        }
      })),

      updateGradientColorStop: (index: number, color: RALColor) => set((state) => {
        if (!state.frameTexture.gradient) return state;
        
        const updatedColorStops = [...state.frameTexture.gradient.colorStops];
        updatedColorStops[index] = {
          ...updatedColorStops[index],
          color: color
        };
        
        return {
          frameTexture: {
            ...state.frameTexture,
            gradient: {
              ...state.frameTexture.gradient,
              colorStops: updatedColorStops
            }
          }
        };
      }),
    }),
    {
      name: 'bike-store',
      partialize: (state) => ({
        frameColor: state.frameColor,
        forkColor: state.forkColor,
        isFrameMetallic: state.isFrameMetallic,
        tireWallColor: state.tireWallColor,
        rimType: state.rimType,
        logoTypes: {
          HEAD_TUBE: {
            ...state.logoTypes.HEAD_TUBE,
            images: state.logoTypes.HEAD_TUBE.images.map(img => ({
              id: img.id,
              name: img.name,
              url: img.url,
              color: img.color,
              x: img.x,
              y: img.y,
              scaleX: img.scaleX,
              scaleY: img.scaleY,
              rotation: img.rotation,
              zIndex: img.zIndex,
            }))
          },
          DOWN_TUBE_LEFT: {
            ...state.logoTypes.DOWN_TUBE_LEFT,
            images: state.logoTypes.DOWN_TUBE_LEFT.images.map(img => ({
              id: img.id,
              name: img.name,
              url: img.url,
              color: img.color,
              x: img.x,
              y: img.y,
              scaleX: img.scaleX,
              scaleY: img.scaleY,
              rotation: img.rotation,
              zIndex: img.zIndex,
            }))
          },
          DOWN_TUBE_RIGHT: {
            ...state.logoTypes.DOWN_TUBE_RIGHT,
            images: state.logoTypes.DOWN_TUBE_RIGHT.images.map(img => ({
              id: img.id,
              name: img.name,
              url: img.url,
              color: img.color,
              x: img.x,
              y: img.y,
              scaleX: img.scaleX,
              scaleY: img.scaleY,
              rotation: img.rotation,
              zIndex: img.zIndex,
            }))
          },
        },
        frameTexture: {
          ...state.frameTexture,
          images: state.frameTexture.images.map(img => ({
            id: img.id,
            name: img.name,
            url: img.url,
            // Note: frame textures don't have individual colors
            x: img.x,
            y: img.y,
            scaleX: img.scaleX,
            scaleY: img.scaleY,
            rotation: img.rotation,
            zIndex: img.zIndex,
          })),
          gradient: state.frameTexture.gradient // Save gradient settings
        },
        selectedLogoType: state.selectedLogoType,
        selectedLogoImageId: state.selectedLogoImageId,
      }),
    }
  )
);

// Selector hook for active texture (logo or frame) with shallow memoization
export function useActiveTexture() {
  return useBikeStore(useShallow(
    state => {
      if (state.activeTab === 'logos') {
        const type = state.selectedLogoType;
        return type ? state.logoTypes[type] : null;
      } else if (state.activeTab === 'frame' && state.frameTexture.images.length > 0) {
        return state.frameTexture;
      }
      return null;
    })
  );
} 