/**
 * Utilities for normalizing and formatting metrics data
 * These functions handle a wide range of input formats and edge cases
 */

/**
 * Normalizes health score to a percentage value (0-100)
 * Handles negative values, non-numeric values, and various scales
 */
export const normalizeHealthScore = (score: any): number => {
  // Handle missing or non-numeric data
  if (score === null || score === undefined || isNaN(Number(score))) {
    return 0;
  }

  // Convert to number if it's a string
  const numScore = typeof score === 'string' ? parseFloat(score) : score;

  // Handle negative values (display as 0%)
  if (numScore < 0) return 0;

  // If already in percentage range (0-100), use as is
  if (numScore >= 0 && numScore <= 100) {
    return Math.round(numScore);
  }

  // Handle percentages stored as basis points (0-10000)
  if (numScore > 100 && numScore <= 10000) {
    return Math.round(numScore / 100);
  }

  // For very large values, likely an error code or timestamp
  // Display as 0%
  if (numScore > 10000) {
    return 0;
  }

  // For very small values (likely a decimal percentage)
  if (numScore > 0 && numScore < 1) {
    return Math.round(numScore * 100);
  }

  // Default case - normalize to percentage
  return Math.min(100, Math.round(numScore));
};

/**
 * Normalizes CPU usage for display
 * Handles raw values, percentages, decimals
 */
export const normalizeCpuDisplay = (
  usage: any
): { value: number; formattedValue: string; percentage: number } => {
  // Handle missing or non-numeric data
  if (usage === null || usage === undefined || isNaN(Number(usage))) {
    return { value: 0, formattedValue: '0%', percentage: 0 };
  }

  // Convert to number if it's a string
  const numUsage = typeof usage === 'string' ? parseFloat(usage) : usage;

  // For small decimal values (0-1), convert to percentage
  if (numUsage >= 0 && numUsage <= 1) {
    return {
      value: numUsage,
      formattedValue: `${(numUsage * 100).toFixed(1)}%`,
      percentage: numUsage * 100,
    };
  }

  // For percentage values (1-100)
  if (numUsage > 1 && numUsage <= 100) {
    return {
      value: numUsage,
      formattedValue: `${numUsage.toFixed(1)}%`,
      percentage: numUsage,
    };
  }

  // For basis points (100-10000)
  if (numUsage > 100 && numUsage <= 10000) {
    return {
      value: numUsage,
      formattedValue: `${(numUsage / 100).toFixed(1)}%`,
      percentage: numUsage / 100,
    };
  }

  // For milliseconds or other raw values under 1000 - possibly MHz or similar
  if (numUsage > 100 && numUsage < 1000) {
    // Display as raw value with MHz unit
    return {
      value: numUsage,
      formattedValue: `${numUsage.toFixed(1)} MHz`,
      percentage: Math.min(100, numUsage / 10), // Scale to percentage
    };
  }

  // For values in milliseconds (high numbers)
  if (numUsage >= 1000) {
    // Scale to a percentage (assuming 10,000ms is 100%)
    const scaledPercentage = Math.min(100, numUsage / 100);
    return {
      value: numUsage,
      formattedValue: `${numUsage.toFixed(0)} ms`,
      percentage: scaledPercentage,
    };
  }

  // Default case
  return {
    value: numUsage,
    formattedValue: `${numUsage.toFixed(1)}`,
    percentage: Math.min(100, numUsage),
  };
};
