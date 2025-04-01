/**
 * Convert hex color to RGB array.
 *
 * @param hex the hexadecimal color string
 * @returns the array of integer values for red, green and blue equivalent
 */
export function hexToRgb(hex: string | undefined): number[] {
  if (!hex) return [0, 0, 0] // Default to black if no color provided

  hex = hex.replace(/^#/, '')
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }

  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  return [r, g, b]
}

// Calculate luminance according to WCAG formula
function calculateLuminance(rgb: number[]): number {
  // Convert RGB to linear values
  const [r, g, b] = rgb.map((channel) => {
    const value = channel / 255
    return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4)
  })

  // Calculate luminance using RGB coefficients
  return r * 0.2126 + g * 0.7152 + b * 0.0722
}

// Calculate contrast ratio between two luminance values
function getContrastRatio(luminance1: number, luminance2: number): number {
  const lighter = Math.max(luminance1, luminance2)
  const darker = Math.min(luminance1, luminance2)
  return (lighter + 0.05) / (darker + 0.05)
}

// Get contrast color that meets WCAG standards
export function getContrastColor(rgb: number[], contrastThreshold = 4.5): string {
  const bgLuminance = calculateLuminance(rgb)

  // Calculate contrast with white and black
  const blackLuminance = 0
  const whiteLuminance = 1

  const blackContrast = getContrastRatio(bgLuminance, blackLuminance)
  const whiteContrast = getContrastRatio(bgLuminance, whiteLuminance)

  // Return the color with better contrast
  return whiteContrast >= contrastThreshold && whiteContrast > blackContrast ? '#ffffff' : '#000000'
}
