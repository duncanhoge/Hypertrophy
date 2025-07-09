/**
 * Icon Generator Utility
 * 
 * This utility generates PWA icons using the Dumbbell icon from Lucide React.
 * Since we can't generate actual PNG files in this environment, this provides
 * the structure and logic for icon generation.
 */

export interface IconSize {
  size: number;
  filename: string;
}

export const ICON_SIZES: IconSize[] = [
  { size: 72, filename: 'icon-72x72.png' },
  { size: 96, filename: 'icon-96x96.png' },
  { size: 128, filename: 'icon-128x128.png' },
  { size: 144, filename: 'icon-144x144.png' },
  { size: 152, filename: 'icon-152x152.png' },
  { size: 192, filename: 'icon-192x192.png' },
  { size: 384, filename: 'icon-384x384.png' },
  { size: 512, filename: 'icon-512x512.png' },
];

/**
 * Generate SVG icon with Dumbbell shape
 */
export function generateDumbbellSVG(size: number): string {
  const iconSize = Math.floor(size * 0.6); // Icon takes 60% of canvas
  const strokeWidth = Math.max(2, Math.floor(size / 64)); // Responsive stroke width
  
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FFE55C;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#FFD700;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#B7A000;stop-opacity:1" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.3"/>
        </filter>
      </defs>
      
      <!-- Background circle -->
      <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="#000000"/>
      
      <!-- Dumbbell icon centered -->
      <g transform="translate(${(size-iconSize)/2}, ${(size-iconSize)/2})">
        <!-- Left weight -->
        <rect x="0" y="${iconSize*0.25}" width="${iconSize*0.2}" height="${iconSize*0.5}" 
              fill="url(#goldGradient)" filter="url(#shadow)" rx="${iconSize*0.05}"/>
        
        <!-- Left connector -->
        <rect x="${iconSize*0.15}" y="${iconSize*0.4}" width="${iconSize*0.15}" height="${iconSize*0.2}" 
              fill="url(#goldGradient)" filter="url(#shadow)" rx="${iconSize*0.02}"/>
        
        <!-- Center bar -->
        <rect x="${iconSize*0.3}" y="${iconSize*0.45}" width="${iconSize*0.4}" height="${iconSize*0.1}" 
              fill="url(#goldGradient)" filter="url(#shadow)" rx="${iconSize*0.02}"/>
        
        <!-- Right connector -->
        <rect x="${iconSize*0.7}" y="${iconSize*0.4}" width="${iconSize*0.15}" height="${iconSize*0.2}" 
              fill="url(#goldGradient)" filter="url(#shadow)" rx="${iconSize*0.02}"/>
        
        <!-- Right weight -->
        <rect x="${iconSize*0.8}" y="${iconSize*0.25}" width="${iconSize*0.2}" height="${iconSize*0.5}" 
              fill="url(#goldGradient)" filter="url(#shadow)" rx="${iconSize*0.05}"/>
      </g>
    </svg>
  `;
}

/**
 * Instructions for generating actual PNG icons
 * 
 * To generate the actual PNG files for the PWA:
 * 1. Use the generateDumbbellSVG function to create SVG content
 * 2. Convert SVG to PNG using a tool like:
 *    - Online converters (svg2png.com)
 *    - Node.js with sharp or canvas libraries
 *    - Design tools like Figma, Sketch, or Adobe Illustrator
 * 3. Save files in public/icons/ directory with the correct filenames
 * 4. Ensure all sizes are generated for optimal PWA support
 */

export const ICON_GENERATION_INSTRUCTIONS = `
To generate PWA icons:

1. Create the public/icons directory
2. For each size in ICON_SIZES, generate a PNG file using the SVG from generateDumbbellSVG()
3. Save with the specified filename in public/icons/

Example file structure:
public/
  icons/
    icon-72x72.png
    icon-96x96.png
    icon-128x128.png
    icon-144x144.png
    icon-152x152.png
    icon-192x192.png
    icon-384x384.png
    icon-512x512.png

The SVG uses a gold dumbbell on black background matching the app's theme.
`;