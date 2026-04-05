import { API_BASE } from './api';

/**
 * Resolves a product image URL:
 * - Returns a placeholder when no image is provided.
 * - Returns external URLs unchanged.
 * - Prepends API_BASE to relative (backend-served) paths.
 *
 * @param img  Raw image string from the API (undefined | '' | '/uploads/...' | 'https://...')
 * @param size Placeholder size string, e.g. '80x80'. Defaults to '80x80'.
 */
export function getImageUrl(img: string | undefined, size = '80x80'): string {
    if (!img) {
        return `https://via.placeholder.com/${size}/f3f3f3/333?text=No+Image`;
    }
    if (img.startsWith('http')) return img;
    return `${API_BASE}${img}`;
}
