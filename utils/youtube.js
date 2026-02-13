/**
 * YouTube Utilities for SPACE-MD Music Commands
 * Shared functions for YouTube search and download
 */

const ytsr = require('ytsr');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');

/**
 * Search YouTube for videos
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of video results
 */
async function searchYouTube(query) {
  try {
    const searchResults = await ytsr(query, { limit: 5 });
    const videos = searchResults.items.filter(item => item.type === 'video');
    return videos;
  } catch (error) {
    console.error('YouTube search error:', error);
    return [];
  }
}

/**
 * Download and convert YouTube video to MP3
 * @param {string} videoUrl - YouTube video URL
 * @param {string} outputPath - Output file path
 * @returns {Promise<string>} Path to downloaded file
 */
async function downloadMusic(videoUrl, outputPath) {
  return new Promise((resolve, reject) => {
    const stream = ytdl(videoUrl, {
      quality: 'highestaudio',
      filter: 'audioonly'
    });

    ffmpeg(stream)
      .audioBitrate(128)
      .save(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', (err) => reject(err));
  });
}

module.exports = {
  searchYouTube,
  downloadMusic
};
