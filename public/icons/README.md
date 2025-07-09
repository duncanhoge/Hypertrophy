# PWA Icons

This directory should contain the PWA icons for Hypertrophy Hub. 

## Required Icons

The following icon files need to be generated using the Dumbbell design:

- `icon-72x72.png` - 72x72 pixels
- `icon-96x96.png` - 96x96 pixels  
- `icon-128x128.png` - 128x128 pixels
- `icon-144x144.png` - 144x144 pixels
- `icon-152x152.png` - 152x152 pixels
- `icon-192x192.png` - 192x192 pixels
- `icon-384x384.png` - 384x384 pixels
- `icon-512x512.png` - 512x512 pixels

## Design Specifications

- **Background**: Black (#000000)
- **Icon**: Gold dumbbell (#FFD700 with gradient)
- **Style**: Centered dumbbell icon with subtle shadow
- **Format**: PNG with transparency support

## Generation

Use the `generateDumbbellSVG()` function from `src/utils/iconGenerator.ts` to create the SVG, then convert to PNG at the required sizes.

The SVG includes:
- Gradient gold coloring
- Drop shadow effects
- Responsive sizing
- Proper proportions for each icon size

## Temporary Placeholder

Until the actual PNG files are generated, the PWA will use fallback icons. The manifest.json is configured to reference these files once they're created.