import { create } from 'zustand';
import * as THREE from 'three';
import { RALColor, getColorById } from '../data/ralColors';
import { LogoImage } from '../types/bike';

// Default colors
const DEFAULT_FRAME_COLOR: RALColor = {
  code: 'RAL 1013',
  name: 'Oyster white',
  hex: '#E3D9C6'
};

const DEFAULT_FORK_COLOR: RALColor = {
  code: "RAL 3005",
  name: "Wine red",
  hex: "#5E2129",
};

// Logo type data
export interface LogoTypeData {
  images: LogoImage[];
  texture: THREE.Texture | null;
}

interface BikeState {
  // Navigation state
  activeTab: 'frame' | 'fork' | 'logos' | null;
  navigationCollapsed: boolean;
  
  // Color state
  frameColor: RALColor;
  forkColor: RALColor;
  selectedLogoColor: string;
  
  // Logo state - now supports multiple logo types
  logoTypes: {
    DOWN_TUBE: LogoTypeData;
    HEAD_TUBE: LogoTypeData;
  };
  selectedLogoType: 'DOWN_TUBE' | 'HEAD_TUBE' | null;
  selectedLogoImageId: string | null;
  
  // Panel state
  rightPanelOpen: boolean;
  showLogoEditor: boolean;
  showBottomPanel: boolean;
  
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
  setSelectedLogoType: (logoType: 'DOWN_TUBE' | 'HEAD_TUBE' | null) => void;
  setRightPanelOpen: (open: boolean) => void;
  setShowLogoEditor: (show: boolean) => void;
  setShowBottomPanel: (show: boolean) => void;
  openColorSelection: (type: 'frame' | 'fork' | 'logo') => void;
  closeColorSelection: () => void;
  setSelectedColorGroup: (group: string | null) => void;
  handleColorChangeRequest: (imageId: string) => void;
  
  // Logo management actions
  addLogoImage: (logoType: 'DOWN_TUBE' | 'HEAD_TUBE', image: Omit<LogoImage, 'id'>) => void;
  removeLogoImage: (logoType: 'DOWN_TUBE' | 'HEAD_TUBE', imageId: string) => void;
  updateLogoImage: (logoType: 'DOWN_TUBE' | 'HEAD_TUBE', imageId: string, updates: Partial<LogoImage>) => void;
  setLogoTexture: (logoType: 'DOWN_TUBE' | 'HEAD_TUBE', texture: THREE.Texture | null) => void;
  getCurrentLogoTexture: () => THREE.Texture | null;
}

export const useBikeStore = create<BikeState>((set, get) => ({
  // Initial state
  activeTab: null,
  navigationCollapsed: false,
  frameColor: DEFAULT_FRAME_COLOR,
  forkColor: DEFAULT_FORK_COLOR,
  selectedLogoColor: '#000000',
  
  // Initialize logo types with empty data
  logoTypes: {
    DOWN_TUBE: {
      images: [
        {
          id: 'default_base_texture',
          name: 'Default logo',
          url: '/textures/loca_half.png',
          color: getColorById('9005') || { code: 'RAL 9005', name: 'Jet black', hex: '#0A0A0A' },
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          rotation: 0
        }
      ],
      texture: null
    },
    HEAD_TUBE: {
      images: [],
      texture: null
    }
  },
  selectedLogoType: null,
  selectedLogoImageId: null,
  
  rightPanelOpen: false,
  showLogoEditor: false,
  showBottomPanel: false,
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
  
  setSelectedLogoType: (logoType) => set({ 
    selectedLogoType: logoType,
    selectedLogoImageId: null,
    showBottomPanel: false
  }),
  
  setRightPanelOpen: (open) => set({ rightPanelOpen: open }),
  
  setShowLogoEditor: (show) => set({ showLogoEditor: show }),
  
  setShowBottomPanel: (show) => set({ showBottomPanel: show }),
  
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

  removeLogoImage: (logoType, imageId) => set((state) => ({
    logoTypes: {
      ...state.logoTypes,
      [logoType]: {
        ...state.logoTypes[logoType],
        images: state.logoTypes[logoType].images.filter(img => img.id !== imageId)
      }
    },
    selectedLogoImageId: state.selectedLogoImageId === imageId ? null : state.selectedLogoImageId,
    showBottomPanel: state.selectedLogoImageId === imageId ? false : state.showBottomPanel
  })),

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

  getCurrentLogoTexture: () => {
    const state = get();
    if (state.selectedLogoType) {
      return state.logoTypes[state.selectedLogoType].texture;
    }
    return null;
  }
})); 