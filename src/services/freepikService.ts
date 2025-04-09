/**
 * Freepik Service (Fallback Only)
 * Provides fallback images without making external API calls
 */

// Fallback images used when the API is unavailable
const FALLBACK_IMAGES: Record<string, string[]> = {
  'Apartamento': [
    'https://img.freepik.com/premium-photo/modern-living-room-interior-design-with-sofa-decoration_41470-4024.jpg',
    'https://img.freepik.com/premium-photo/interior-living-room-modern-design_23-2150767930.jpg'
  ],
  'Cozinha': [
    'https://img.freepik.com/premium-photo/modern-kitchen-interior-design-with-white-wooden-details_23-2148318458.jpg',
    'https://img.freepik.com/premium-photo/modern-kitchen-interior-design_279525-195.jpg'
  ],
  'Comercial': [
    'https://img.freepik.com/premium-photo/coworking-space-with-desk-tables-room-with-window-view_31965-23771.jpg',
    'https://img.freepik.com/premium-photo/modern-office-interior-design_327072-11765.jpg'
  ],
  'Banheiro': [
    'https://img.freepik.com/premium-photo/modern-bathroom-interior-design_327072-11761.jpg',
    'https://img.freepik.com/premium-photo/modern-bathroom-interior-with-shower-cabin_1232-680.jpg'
  ],
  'Sala': [
    'https://img.freepik.com/premium-photo/modern-living-room-interior-design-with-sofa-tv-wall_41470-3542.jpg',
    'https://img.freepik.com/premium-photo/interior-room-with-sofa-empty-white-wall_41470-3468.jpg'
  ],
  'Todos': [
    'https://img.freepik.com/premium-photo/living-room-interior-wall-mockup-boho-style-3d-rendering_41470-4038.jpg',
    'https://img.freepik.com/premium-photo/modern-interior-design-living-room_269031-78.jpg'
  ]
};

// Types for API response structure maintained for compatibility
export interface FreepikImage {
  id: string;
  title: string;
  thumbnail: string;
  source: {
    url: string;
  };
  preview: {
    url: string;
  };
}

export interface FreepikSearchResponse {
  data: FreepikImage[];
  meta: {
    pagination: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
    };
  };
}

// Get a single image for a category
export const getFreepikImageByCategory = async (category: string): Promise<string> => {
  console.log(`Getting fallback image for category: ${category}`);
  
  // Return fallback image
  const fallbacks = FALLBACK_IMAGES[category] || FALLBACK_IMAGES['Todos'];
  return fallbacks[0];
};

// Get multiple images for a category
export const getMultipleFreepikImagesByCategory = async (category: string, count = 4): Promise<string[]> => {
  console.log(`Getting ${count} fallback images for category: ${category}`);
  
  // Return fallback images
  const fallbacks = FALLBACK_IMAGES[category] || FALLBACK_IMAGES['Todos'];
  const allFallbacks = [...fallbacks, ...FALLBACK_IMAGES['Todos']];
  
  // Return unique images up to count
  return [...new Set(allFallbacks)].slice(0, count);
};

// Mock search function that returns fallback data
export const searchFreepikImages = async (query: string, page = 1, limit = 20): Promise<FreepikSearchResponse> => {
  console.log(`Mock search for: ${query} (using fallbacks only)`);
  
  // Create mock image objects from fallbacks
  const mockImages: FreepikImage[] = Object.values(FALLBACK_IMAGES)
    .flat()
    .slice(0, limit)
    .map((url, index) => ({
      id: `fallback-${index}`,
      title: `Fallback Image ${index + 1}`,
      thumbnail: url,
      source: { url },
      preview: { url }
    }));
    
  return {
    data: mockImages,
    meta: {
      pagination: {
        total: mockImages.length,
        count: mockImages.length,
        per_page: limit,
        current_page: page,
        total_pages: 1
      }
    }
  };
};
