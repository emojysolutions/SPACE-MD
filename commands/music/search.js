/**
 * SPACE-MD Music Player - Search Command
 * Search YouTube and pick a result to download
 */

const ytsr = require('ytsr');
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const ffmpeg = require('fluent-ffmpeg');
const sessionManager = require('../../utils/sessionManager');

const unlinkAsync = promisify(fs.unlink);

/**
 * Format number to human-readable (e.g., 1200000 -> 1.2M)
 */
function formatViews(views) {
  if (!views) return 'N/A';
  if (views >= 1000000000) return (views / 1000000000).toFixed(1) + 'B';
  if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
  if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
  return views.toString();
}

/**
 * Search YouTube for videos
 */
async function searchYouTube(query) {
  try {
    const searchResults = await ytsr(query, { limit: 5, safeSearch: true });
    const videos = searchResults.items.filter(item => item.type === 'video');
    return videos;
  } catch (error) {
    console.error('YouTube search error:', error);
    return [];
  }
}

/**
 * Download and convert YouTube video to MP3
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

/**
 * Sanitize filename to remove invalid characters
 */
function sanitizeFilename(name) {
  return name.replace(/[<>:"/\\|?*]/g, '_').substring(0, 200);
}

module.exports = {
  name: 'search',
  aliases: ['ytsearch', 'find'],
  category: 'music',
  description: 'Search YouTube and pick a result to download',
  usage: '!search <song name>',
  examples: [
    '!search Adele Hello',
    '!search Imagine Dragons Believer'
  ],
  cooldown: 5,
  adminOnly: false,
  
  execute: async (from, args, { sendMessage, sendAudio }) => {
    try {
      // Check if query is provided
      if (args.length === 0) {
        return await sendMessage(from, `❌ *Usage:* ${module.exports.usage}\n\n*Examples:*\n${module.exports.examples.join('\n')}`);
      }

      const query = args.join(' ');
      
      // Search YouTube
      await sendMessage(from, `🔍 *Searching YouTube...* 🔍\n_Please wait..._`);
      
      const results = await searchYouTube(query);
      
      if (results.length === 0) {
        return await sendMessage(from, `❌ No results found for "${query}". Try different keywords!`);
      }
      
      // Get top 3 results
      const topResults = results.slice(0, 3);
      
      // Store results in session
      sessionManager.set(from, 'search_results', topResults, 60000); // 60 seconds TTL
      
      // Format message with results
      let message = '🔍 *YouTube Search Results* 🔍\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
      
      topResults.forEach((video, index) => {
        const num = index + 1;
        const title = video.title;
        const channel = video.author ? video.author.name : 'Unknown';
        const duration = video.duration || 'N/A';
        const views = formatViews(video.views);
        
        message += `*${num}.* 🎵 ${title}\n`;
        message += `     🎤 ${channel} • ⏱️ ${duration} • 👁️ ${views}\n\n`;
      });
      
      message += '━━━━━━━━━━━━━━━━━━━━━━━━━\n';
      message += '_Reply with *1*, *2*, or *3* to download_';
      
      await sendMessage(from, message);
      
    } catch (error) {
      console.error('Search command error:', error);
      return await sendMessage(from, '❌ An error occurred during search. Please try again later.');
    }
  },
  
  /**
   * Handle user's selection from search results
   * This should be called when user replies with a number
   */
  handleSelection: async (from, selection, { sendMessage, sendAudio }) => {
    try {
      // Check if user has active search results
      if (!sessionManager.has(from, 'search_results')) {
        return await sendMessage(from, '⏰ Your search expired. Please search again with !search');
      }
      
      // Parse selection
      const selectedNum = parseInt(selection);
      
      if (isNaN(selectedNum) || selectedNum < 1 || selectedNum > 3) {
        return await sendMessage(from, '❌ Please reply with 1, 2, or 3 to pick a song.');
      }
      
      // Get search results
      const results = sessionManager.get(from, 'search_results');
      const selectedVideo = results[selectedNum - 1];
      
      if (!selectedVideo) {
        return await sendMessage(from, '❌ Invalid selection. Please try searching again.');
      }
      
      // Clear the search session
      sessionManager.delete(from, 'search_results');
      
      // Start download
      const videoUrl = selectedVideo.url;
      const videoTitle = selectedVideo.title;
      const channel = selectedVideo.author ? selectedVideo.author.name : 'Unknown';
      
      await sendMessage(from, `🎵 *Downloading:* ${videoTitle}... ⏳`);
      
      // Download and convert
      const sanitizedTitle = sanitizeFilename(videoTitle);
      const tempDir = path.join(__dirname, '../../tmp');
      
      // Create tmp directory if it doesn't exist
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      const outputPath = path.join(tempDir, `${sanitizedTitle}.mp3`);
      
      try {
        await downloadMusic(videoUrl, outputPath);
        
        // Send the audio file
        await sendAudio(from, outputPath, {
          mimetype: 'audio/mpeg',
          fileName: `${sanitizedTitle}.mp3`
        });
        
        await sendMessage(from, `✅ *Download Complete!* 🎉\n_Enjoy your music!_ 🎧`);
        
        // Clean up the file after sending
        try {
          await unlinkAsync(outputPath);
        } catch (cleanupError) {
          console.error('Failed to cleanup file:', cleanupError);
        }
        
      } catch (downloadError) {
        console.error('Download error:', downloadError);
        
        // Clean up if file was partially created
        if (fs.existsSync(outputPath)) {
          try {
            await unlinkAsync(outputPath);
          } catch (cleanupError) {
            console.error('Failed to cleanup file after error:', cleanupError);
          }
        }
        
        return await sendMessage(from, '❌ Download failed. Please try again or search for a different song.');
      }
      
    } catch (error) {
      console.error('Handle selection error:', error);
      return await sendMessage(from, '❌ An error occurred. Please try again later.');
    }
  }
};
