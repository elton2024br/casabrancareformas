
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
    // Map categories to relevant search terms for better results
    const searchTerms: Record<string, string> = {
      'Apartamento': 'modern apartment interior',
      'Cozinha': 'modern kitchen design',
      'Comercial': 'commercial office space',
      'Banheiro': 'luxury bathroom interior',
      'Sala': 'contemporary living room',
      'Todos': 'interior design'
    };

    const searchTerm = searchTerms[category] || category;
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
