
/**
 * Freepik API Service
 * Handles fetching images from Freepik using the provided API key
 */

const FREEPIK_API_KEY = 'FPSX80bb47dc58434c429607e62268e0e346';
const FREEPIK_API_URL = 'https://api.freepik.com/v1';

// Add retry functionality for more robust API calls
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

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

// Helper function to add delay between retries
const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Improved search function with retry mechanism
export const searchFreepikImages = async (query: string, page = 1, limit = 20): Promise<FreepikSearchResponse> => {
  let retries = 0;
  
  while (retries < MAX_RETRIES) {
    try {
      console.log(`Attempting to fetch Freepik images for: ${query} (attempt ${retries + 1})`);
      
      const response = await fetch(
        `${FREEPIK_API_URL}/resources/search?query=${encodeURIComponent(
          query
        )}&page=${page}&limit=${limit}`,
        {
          headers: {
            'Accept-Language': 'en-US', // Changed to English for better results
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Freepik-API-Key': FREEPIK_API_KEY,
            'Origin': window.location.origin,
          },
          mode: 'cors',
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Freepik API error: ${response.status}`, errorText);
        throw new Error(`Freepik API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Freepik API success, received data:', data);
      return data;
    } catch (error) {
      console.error(`Error fetching images from Freepik (attempt ${retries + 1}):`, error);
      retries++;
      
      // If we've reached max retries, return empty data
      if (retries >= MAX_RETRIES) {
        console.log('Max retries reached, returning empty data');
        return { data: [], meta: { pagination: { total: 0, count: 0, per_page: 0, current_page: 0, total_pages: 0 } } };
      }
      
      // Wait before retrying
      await delay(RETRY_DELAY * retries);
    }
  }

  // This should never be reached due to the return in the catch block, but TypeScript needs it
  return { data: [], meta: { pagination: { total: 0, count: 0, per_page: 0, current_page: 0, total_pages: 0 } } };
};

// Use fallback images if API fails
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

export const getFreepikImageByCategory = async (category: string): Promise<string> => {
  try {
    // Enhanced mapping for categories to get more relevant premium images
    const searchTerms: Record<string, string> = {
      'Apartamento': 'modern luxury apartment interior design premium',
      'Cozinha': 'luxury modern kitchen design interior premium',
      'Comercial': 'elegant commercial office space interior premium',
      'Banheiro': 'luxury bathroom interior design marble premium',
      'Sala': 'contemporary luxury living room interior premium',
      'Todos': 'luxury interior design home premium'
    };

    const searchTerm = searchTerms[category] || `${category} interior design premium`;
    const response = await searchFreepikImages(searchTerm, 1, 5);
    
    if (response.data && response.data.length > 0) {
      // Return the preview URL of the first image
      return response.data[0].preview.url;
    }
    
    // If no results from API, use fallback
    const fallbacks = FALLBACK_IMAGES[category] || FALLBACK_IMAGES['Todos'];
    return fallbacks[0];
  } catch (error) {
    console.error('Error getting Freepik image by category:', error);
    // Return fallback image
    const fallbacks = FALLBACK_IMAGES[category] || FALLBACK_IMAGES['Todos'];
    return fallbacks[0];
  }
};

// Function to get multiple premium images for a category
export const getMultipleFreepikImagesByCategory = async (category: string, count = 4): Promise<string[]> => {
  try {
    const searchTerms: Record<string, string> = {
      'Apartamento': 'modern luxury apartment interior design premium',
      'Cozinha': 'luxury modern kitchen design interior premium',
      'Comercial': 'elegant commercial office space interior premium',
      'Banheiro': 'luxury bathroom interior design marble premium',
      'Sala': 'contemporary luxury living room interior premium',
      'Todos': 'luxury interior design home premium'
    };

    const searchTerm = searchTerms[category] || `${category} interior design premium`;
    const response = await searchFreepikImages(searchTerm, 1, count + 2); // Fetch a few extra in case some fail
    
    if (response.data && response.data.length > 0) {
      // Return up to 'count' preview URLs
      return response.data.slice(0, count).map(img => img.preview.url);
    }
    
    // If no results from API, use fallbacks
    const fallbacks = FALLBACK_IMAGES[category] || FALLBACK_IMAGES['Todos'];
    return [...fallbacks, ...FALLBACK_IMAGES['Todos']].slice(0, count);
  } catch (error) {
    console.error('Error getting multiple Freepik images by category:', error);
    // Return fallback images
    const fallbacks = FALLBACK_IMAGES[category] || FALLBACK_IMAGES['Todos'];
    return [...fallbacks, ...FALLBACK_IMAGES['Todos']].slice(0, count);
  }
};
