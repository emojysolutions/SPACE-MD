/**
 * Formatting Utilities for SPACE-MD
 * Shared functions for formatting data
 */

/**
 * Format number to human-readable (e.g., 1200000 -> 1.2M)
 * @param {number} views - Number of views
 * @returns {string} Formatted view count
 */
function formatViews(views) {
  if (!views) return 'N/A';
  if (views >= 1000000000) return (views / 1000000000).toFixed(1) + 'B';
  if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
  if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
  return views.toString();
}

/**
 * Convert seconds to MM:SS format
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 */
function formatDuration(seconds) {
  if (!seconds) return 'N/A';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Sanitize filename to remove invalid characters
 * @param {string} name - Original filename
 * @returns {string} Sanitized filename
 */
function sanitizeFilename(name) {
  return name.replace(/[<>:"/\\|?*]/g, '_').substring(0, 200);
}

module.exports = {
  formatViews,
  formatDuration,
  sanitizeFilename
};
