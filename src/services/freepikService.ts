
/**
 * Freepik API Service
 * This service handles communication with the Freepik API to fetch premium images
 */

const API_KEY = "FPSX80bb47dc58434c429607e62268e0e346";
const BASE_URL = "https://api.freepik.com/v1";

export interface FreepikImage {
  id: string;
  title: string;
  description: string;
  url: string;
  previewUrl: string;
  width: number;
  height: number;
  contributor: string;
  premium: boolean;
}

interface FreepikSearchResponse {
  data: FreepikImage[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

export const searchFreepikImages = async (
  query: string, 
  limit: number = 20, 
  offset: number = 0
): Promise<FreepikImage[]> => {
  try {
    const response = await fetch(`${BASE_URL}/search?query=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Freepik-API-Key': API_KEY,
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Freepik API error:", errorData);
      throw new Error(`API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }
    
    const data: FreepikSearchResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching Freepik images:", error);
    return [];
  }
};

export const getFreepikImage = async (id: string): Promise<FreepikImage | null> => {
  try {
    const response = await fetch(`${BASE_URL}/resources/${id}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Freepik-API-Key': API_KEY,
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Freepik API error:", errorData);
      throw new Error(`API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }
    
    const data: FreepikImage = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Freepik image:", error);
    return null;
  }
};
