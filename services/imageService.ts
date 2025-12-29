import { GITHUB_USERNAME, GITHUB_REPO, GITHUB_BRANCH, GITHUB_IMAGE_PATH, TOTAL_GROUPS, IMAGES_PER_USER } from '../constants';
import { Demographics } from '../types';

/**
 * Constructs the raw GitHub content URL for an image.
 * Assumes image names are like 'img_001.jpg', 'img_002.jpg', etc.
 */
export const getImageUrl = (imageId: string): string => {
  // Pad the ID if your filenames are padded (e.g., img_001.jpg)
  // Assuming the ID passed is already the filename or we construct it.
  // Let's assume the ID is just the number string "1", "500".
  
  // Format: img_{number}.jpg (e.g. img_001.jpg) based on standard datasets. 
  // If filenames are different, adjust here.
  const paddedId = imageId.padStart(3, '0');
  const filename = `${paddedId}.jpg`; // Based on typical dataset structures, or user requirement. 
  // Note: The prompt didn't specify the exact filename format, just "Image ID".
  // I will assume a standard numeric format. If files are just "1.jpg", remove padStart.
  
  return `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${GITHUB_BRANCH}/${GITHUB_IMAGE_PATH}/${filename}`;
};

/**
 * Determines which group of images to assign to a user.
 * 
 * Logic:
 * 1. Demographic Strata: Gender (2) * Age (6) = 12 Strata.
 * 2. In a real backend, we would ask "What is the next group for Strata X?".
 * 3. Client-side simulation: We can't know the global state. 
 *    We will rely on the Backend API response for the group number.
 *    If API is missing, we pick a random group to ensure the app functions.
 */
export const getImagesForGroup = (groupId: number): string[] => {
  // Group 1: Images 1-10
  // Group 2: Images 11-20
  // ...
  // Group 50: Images 491-500
  
  const startId = (groupId - 1) * IMAGES_PER_USER + 1;
  const images: string[] = [];

  for (let i = 0; i < IMAGES_PER_USER; i++) {
    images.push((startId + i).toString());
  }

  return images;
};

/**
 * Helper to get a group ID based on simple hashing if backend is unavailable.
 * This is a fallback to try and distribute users if the backend logic isn't strictly enforced.
 */
export const generateFallbackGroup = (): number => {
  return Math.floor(Math.random() * TOTAL_GROUPS) + 1;
};
