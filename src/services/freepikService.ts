
/**
 * Freepik API Service
 * Handles fetching images from Freepik using the provided API key
 */

const FREEPIK_API_KEY = 'FPSX80bb47dc58434c429607e62268e0e346';
const FREEPIK_API_URL = 'https://api.freepik.com/v1';

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

export const searchFreepikImages = async (query: string, page = 1, limit = 20): Promise<FreepikSearchResponse> => {
  try {
    const response = await fetch(
      `${FREEPIK_API_URL}/resources/search?query=${encodeURIComponent(
        query
      )}&page=${page}&limit=${limit}`,
      {
        headers: {
          'Accept-Language': 'pt-BR',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Freepik-API-Key': FREEPIK_API_KEY
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Freepik API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching images from Freepik:', error);
    return { data: [], meta: { pagination: { total: 0, count: 0, per_page: 0, current_page: 0, total_pages: 0 } } };
  }
};

export const getFreepikImageByCategory = async (category: string): Promise<string> => {
  try {
    // Enhanced mapping for categories to get more relevant premium images
    const searchTerms: Record<string, string> = {
      'Apartamento': 'modern luxury apartment interior design',
      'Cozinha': 'luxury modern kitchen design interior',
      'Comercial': 'elegant commercial office space interior',
      'Banheiro': 'luxury bathroom interior design marble',
      'Sala': 'contemporary luxury living room interior',
      'Todos': 'luxury interior design home'
    };

    const searchTerm = searchTerms[category] || `${category} interior design premium`;
    const response = await searchFreepikImages(searchTerm, 1, 5);
    
    if (response.data && response.data.length > 0) {
      // Return the preview URL of the first image
      return response.data[0].preview.url;
    }
    
    return '';
  } catch (error) {
    console.error('Error getting Freepik image by category:', error);
    return '';
  }
};

// Function to get multiple premium images for a category
export const getMultipleFreepikImagesByCategory = async (category: string, count = 4): Promise<string[]> => {
  try {
    const searchTerms: Record<string, string> = {
      'Apartamento': 'modern luxury apartment interior design',
      'Cozinha': 'luxury modern kitchen design interior',
      'Comercial': 'elegant commercial office space interior',
      'Banheiro': 'luxury bathroom interior design marble',
      'Sala': 'contemporary luxury living room interior',
      'Todos': 'luxury interior design home'
    };

    const searchTerm = searchTerms[category] || `${category} interior design premium`;
    const response = await searchFreepikImages(searchTerm, 1, count + 2); // Fetch a few extra in case some fail
    
    if (response.data && response.data.length > 0) {
      // Return up to 'count' preview URLs
      return response.data.slice(0, count).map(img => img.preview.url);
    }
    
    return [];
  } catch (error) {
    console.error('Error getting multiple Freepik images by category:', error);
    return [];
  }
};
