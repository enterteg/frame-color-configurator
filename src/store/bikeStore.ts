import { create } from 'zustand';
import { BikeColors, LogoImage, LogoType } from '../types/bike';
import { DEFAULT_FRAME_COLOR_ID, DEFAULT_FORK_COLOR_ID, DEFAULT_LOGO_COLOR_ID, getColorById, RALColor } from '../data/ralColors';

export type ActiveTab = 'frame' | 'logos';

interface BikeStore {
  // Tab state
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  // Color state - using color IDs
  colors: BikeColors;
  setFrameColor: (colorId: string) => void;
  setForkColor: (colorId: string) => void;

  // Logo state
  logoImages: LogoImage[];
  selectedLogoImageId: string | null;
  selectedLogoType: LogoType;
  logosSectionExpanded: boolean;

  // Logo actions
  addLogoImage: (file: File, logoType: LogoType) => string;
  updateLogoImage: (id: string, updates: Partial<LogoImage>) => void;
  deleteLogoImage: (id: string) => void;
  setSelectedLogoImageId: (id: string | null) => void;
  setSelectedLogoType: (type: LogoType) => void;
  setLogosSectionExpanded: (expanded: boolean) => void;
  setLogoColor: (id: string, color: RALColor) => void;

  // Computed getters
  getHeadTubeLogoImages: () => LogoImage[];
  getDownTubeLogoImages: () => LogoImage[];
  getSelectedLogoImage: () => LogoImage | null;
}

export const useBikeStore = create<BikeStore>((set, get) => ({
  // Tab state
  activeTab: 'frame',
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Color state - using color IDs
  colors: {
    frameColorId: DEFAULT_FRAME_COLOR_ID,
    forkColorId: DEFAULT_FORK_COLOR_ID,
  },
  setFrameColor: (colorId) =>
    set((state) => ({
      colors: { ...state.colors, frameColorId: colorId },
    })),
  setForkColor: (colorId) =>
    set((state) => ({
      colors: { ...state.colors, forkColorId: colorId },
    })),

  // Logo state
  logoImages: [],
  selectedLogoImageId: null,
  selectedLogoType: 'HEAD_TUBE',
  logosSectionExpanded: true,

  // Logo actions
  addLogoImage: (file: File, logoType: LogoType) => {
    const id = `${logoType}_${crypto.randomUUID()}`;
    const blobUrl = URL.createObjectURL(file);
    const defaultColor = getColorById(DEFAULT_LOGO_COLOR_ID);
    
    if (!defaultColor) {
      throw new Error('Default logo color not found');
    }
    
    const newImage: LogoImage = {
      id,
      file,
      blobUrl,
      x: 200,
      y: 50,
      width: 100,
      height: 50,
      rotation: 0,
      scale: 1,
      color: defaultColor,
    };

    set((state) => ({
      logoImages: [...state.logoImages, newImage],
      selectedLogoImageId: id,
      selectedLogoType: logoType,
    }));

    return id;
  },

  updateLogoImage: (id, updates) =>
    set((state) => ({
      logoImages: state.logoImages.map((img) =>
        img.id === id ? { ...img, ...updates } : img
      ),
    })),

  deleteLogoImage: (id) => {
    const logoImage = get().logoImages.find(img => img.id === id);
    if (logoImage && logoImage.blobUrl) {
      URL.revokeObjectURL(logoImage.blobUrl);
    }
    
    set((state) => ({
      logoImages: state.logoImages.filter((img) => img.id !== id),
      selectedLogoImageId: state.selectedLogoImageId === id ? null : state.selectedLogoImageId,
    }));
  },

  setSelectedLogoImageId: (id) => set({ selectedLogoImageId: id }),
  setSelectedLogoType: (type) => set({ selectedLogoType: type }),
  setLogosSectionExpanded: (expanded) => set({ logosSectionExpanded: expanded }),
  
  setLogoColor: (id, color) =>
    set((state) => ({
      logoImages: state.logoImages.map((img) =>
        img.id === id ? { ...img, color } : img
      ),
    })),

  // Computed getters
  getHeadTubeLogoImages: () => get().logoImages.filter(img => img.id.includes('HEAD_TUBE')),
  getDownTubeLogoImages: () => get().logoImages.filter(img => img.id.includes('DOWN_TUBE')),
  getSelectedLogoImage: () => {
    const { logoImages, selectedLogoImageId } = get();
    return logoImages.find(img => img.id === selectedLogoImageId) || null;
  },
})); 