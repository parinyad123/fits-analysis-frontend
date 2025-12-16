// lib/utils/image.utils.ts

/**
 * Get full plot URL from backend
 * Handles multiple path formats from API
 */
export function getPlotUrl(relativePath: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';
    
    // Remove leading slash
    let cleanPath = relativePath.trim();
    if (cleanPath.startsWith('/')) {
        cleanPath = cleanPath.substring(1);
    }
    
    // Convert /api/v1/plots/ to /storage/plots/
    if (cleanPath.startsWith('api/v1/plots/')) {
        cleanPath = cleanPath.replace('api/v1/plots/', 'storage/plots/');
    }
    
    // Ensure it starts with storage/plots/
    if (!cleanPath.startsWith('storage/plots/')) {
        cleanPath = `storage/plots/${cleanPath}`;
    }
    
    return `${baseUrl}/${cleanPath}`;
}

/**
 * Extract plot filename from URL or path
 */
export function getPlotFilename(path: string): string {
    const parts = path.split('/');
    return parts[parts.length - 1];
}

/**
 * Get plot type from path
 */
export function getPlotType(path: string): 'psd' | 'power_law' | 'bending_power_law' | 'unknown' {
    const match = path.match(/\/(psd|power_law|bending_power_law)\//);
    return match ? (match[1] as any) : 'unknown';
}