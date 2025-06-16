import { create } from 'zustand';
import * as THREE from 'three';
import { RALColor, getColorById, DEFAULT_FRAME_COLOR_ID, DEFAULT_FORK_COLOR_ID, DEFAULT_LOGO_COLOR_ID } from '../data/ralColors';
import { LogoImage, LogoType } from '../types/bike';
import { generateLogoTexture, processImageWithTransformations } from '../utils/generateLogoTexture';

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

// Logo type data with aspect ratio configuration
export interface LogoTypeData {
  images: LogoImage[];
  texture: THREE.Texture | null;
  aspectRatio: number; // width:height ratio (e.g., 1 for square, 10 for wide)
}

// Texture constants
const TEXTURE_SIZE = 1024; // Always 1024×1024 regardless of logo type

interface BikeState {
  // Navigation state
  activeTab: 'frame' | 'fork' | 'logos' | null;
  navigationCollapsed: boolean;
  
  // Color state
  frameColor: RALColor;
  forkColor: RALColor;
  selectedLogoColor: string;
  
  // Logo state - now supports multiple logo types with aspect ratios
  logoTypes: {
    HEAD_TUBE: LogoTypeData;
    DOWN_TUBE_LEFT: LogoTypeData;
    DOWN_TUBE_RIGHT: LogoTypeData;
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
  colorSelectionType: 'frame' | 'fork' | 'logo' | null;
  
  // Actions
  setActiveTab: (tab: 'frame' | 'fork' | 'logos' | null) => void;
  toggleNavigationCollapsed: () => void;
  setFrameColor: (color: RALColor) => void;
  setForkColor: (color: RALColor) => void;
  setSelectedLogoColor: (color: string) => void;
  setSelectedLogoImageId: (imageId: string | null) => void;
  setSelectedLogoType: (logoType: LogoType | null) => void;
  setRightPanelOpen: (open: boolean) => void;
  setShowLogoEditor: (show: boolean) => void;
  setShowBottomPanel: (show: boolean) => void;
  setBottomPanelHeight: (height: number) => void;
  openColorSelection: (type: 'frame' | 'fork' | 'logo') => void;
  closeColorSelection: () => void;
  setSelectedColorGroup: (group: string | null) => void;
  handleColorChangeRequest: (imageId: string) => void;
  
  // Logo management actions
  addLogoImage: (logoType: LogoType, image: Omit<LogoImage, 'id'>) => void;
  addLogoImageFromFile: (logoType: LogoType, file: File) => string;
  removeLogoImage: (logoType: LogoType, imageId: string) => void;
  updateLogoImage: (logoType: LogoType, imageId: string, updates: Partial<LogoImage>) => void;
  updateLogoTypeImages: (logoType: LogoType, images: LogoImage[]) => void;
  setLogoTexture: (logoType: LogoType, texture: THREE.Texture | null) => void;
  setLogoColor: (logoType: LogoType, imageId: string, color: RALColor) => void;
  
  // Getters
  getCurrentLogoTexture: () => THREE.Texture | null;
  getCurrentCanvasSize: () => { width: number; height: number };
  getSelectedLogoImage: () => LogoImage | null;
  getHeadTubeLogoImages: () => LogoImage[];
  getDownTubeLeftLogoImages: () => LogoImage[];
  getDownTubeRightLogoImages: () => LogoImage[];
  
  // New actions
  setLogoTextureFromState: (logoType: LogoType) => Promise<void>;
  initializeAllLogoTextures: () => Promise<void>;
}

// Create default logo image configuration
const createDefaultLogoImage = (logoType: string, aspectRatio: number, name: string, url: string): LogoImage => {
  // Calculate canvas size from aspect ratio (base width = TEXTURE_SIZE)
  const canvasWidth = TEXTURE_SIZE;
  const canvasHeight = TEXTURE_SIZE / aspectRatio;
  
  return {
    id: `default_${logoType.toLowerCase()}_logo`,
    name: name,
    url: url,
    color: getColorById('9005') || { code: 'RAL 9005', name: 'Jet black', hex: '#0A0A0A' },
    x: canvasWidth / 2, // Center horizontally
    y: canvasHeight / 2, // Center vertically
    scaleX: 1,
    scaleY: 1,
    rotation: 0
  };
};

export const useBikeStore = create<BikeState>((set, get) => ({
  // Initial state
  activeTab: null,
  navigationCollapsed: false,
  frameColor: DEFAULT_FRAME_COLOR,
  forkColor: DEFAULT_FORK_COLOR,
  selectedLogoColor: '#000000',
  
  // Initialize logo types with proper canvas sizes and initial images
  logoTypes: {
    HEAD_TUBE: {
      images: [createDefaultLogoImage('HEAD_TUBE', 1, 'Loca front', '/textures/loca_half.png')],
      texture: null,
      aspectRatio: 1.2,
    },
    DOWN_TUBE_LEFT: {
      images: [createDefaultLogoImage('DOWN_TUBE_LEFT', 10, 'Loca half', '/textures/loca_half.png')],
      texture: null,
      aspectRatio: 8
    },
    DOWN_TUBE_RIGHT: {
      images: [createDefaultLogoImage('DOWN_TUBE_RIGHT', 10, 'Loca half', '/textures/loca_half.png')],
      texture: null,
      aspectRatio: 8
    }
  },
  selectedLogoType: null,
  selectedLogoImageId: null,
  
  rightPanelOpen: false,
  showLogoEditor: false,
  showBottomPanel: false,
  bottomPanelHeight: 520, // 400 (HEAD_TUBE height) + 120 (header + padding)
  isColorSelectionOpen: false,
  selectedColorGroup: null,
  colorSelectionType: null,

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

  setFrameColor: (color) => set({ frameColor: color }),
  
  setForkColor: (color) => set({ forkColor: color }),
  
  setSelectedLogoColor: (color) => set({ selectedLogoColor: color }),
  
  setSelectedLogoImageId: (imageId) => set({ 
    selectedLogoImageId: imageId,
    showBottomPanel: imageId !== null
  }),
  
  setSelectedLogoType: (logoType) => set((state) => { 
    const newState: Partial<BikeState> = {
      selectedLogoType: logoType,
      selectedLogoImageId: null,
      showBottomPanel: false
    };
    
    // Auto-select the single image if logo type has only one image
    if (logoType && state.logoTypes[logoType].images.length === 1) {
      newState.selectedLogoImageId = state.logoTypes[logoType].images[0].id;
      newState.showBottomPanel = true;
    }
    
    return newState;
  }),
  
  setRightPanelOpen: (open) => set({ rightPanelOpen: open }),
  
  setShowLogoEditor: (show) => set({ showLogoEditor: show }),
  
  setShowBottomPanel: (show) => set({ showBottomPanel: show }),
  
  setBottomPanelHeight: (height) => set({ bottomPanelHeight: height }),
  
  openColorSelection: (type) => set({
    isColorSelectionOpen: true,
    colorSelectionType: type,
    selectedColorGroup: null,
    rightPanelOpen: false,
    activeTab: type === 'logo' ? null : type
  }),
  
  closeColorSelection: () => set({
    isColorSelectionOpen: false,
    colorSelectionType: null,
    selectedColorGroup: null
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

  // Logo management actions
  addLogoImage: (logoType, image) => set((state) => {
    const newImage: LogoImage = {
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
    
    const newImage: LogoImage = {
      id,
      file,
      blobUrl,
      name: file.name,
      x: canvasWidth / 2,
      y: canvasHeight / 2,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      color: defaultColor,
    };

    set((state) => ({
      logoTypes: {
        ...state.logoTypes,
        [logoType]: {
          ...state.logoTypes[logoType],
          images: [...state.logoTypes[logoType].images, newImage]
        }
      },
      selectedLogoImageId: id,
      selectedLogoType: logoType,
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

  updateLogoImage: (logoType, imageId, updates) => set((state) => ({
    logoTypes: {
      ...state.logoTypes,
      [logoType]: {
        ...state.logoTypes[logoType],
        images: state.logoTypes[logoType].images.map(img =>
          img.id === imageId ? { ...img, ...updates } : img
        )
      }
    }
  })),

  setLogoTexture: (logoType, texture) => set((state) => ({
    logoTypes: {
      ...state.logoTypes,
      [logoType]: {
        ...state.logoTypes[logoType],
        texture
      }
    }
  })),

  // Logo color setter (from old store)
  setLogoColor: (logoType, imageId, color) => set((state) => {
    // Update the color in the images array
    const updatedImages = state.logoTypes[logoType].images.map(img =>
      img.id === imageId ? { ...img, color } : img
    );

    // Generate new texture with updated images
    generateLogoTexture({
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
    const texture = await generateLogoTexture({
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

  initializeAllLogoTextures: async () => {
    const state = get();
    for (const logoType of Object.keys(state.logoTypes) as LogoType[]) {
      // Process all images first
      const logoData = state.logoTypes[logoType];
      for (const image of logoData.images) {
        if (!image.processedImage) {
          const processedImage = await processImageWithTransformations(image);
          set(state => ({
            logoTypes: {
              ...state.logoTypes,
              [logoType]: {
                ...state.logoTypes[logoType],
                images: state.logoTypes[logoType].images.map(img =>
                  img.id === image.id ? { ...img, processedImage } : img
                )
              }
            }
          }));
        }
      }
      // Then generate texture
      await state.setLogoTextureFromState(logoType);
    }
  },
})); 