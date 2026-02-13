const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const fs = require('fs');
const path = require('path');
const { uploadMedia, sendDocument, sendMessage } = require('../../utils/api');

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

/**
 * Sanitize filename to remove invalid characters
 * @param {string} filename - Original filename
 * @returns {string} Sanitized filename
 */
function sanitizeFilename(filename) {
  return filename
    .replace(/[<>:"/\\|?*]/g, '') // Remove invalid filename characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .substring(0, 100); // Limit length
}

/**
 * Format duration in seconds to MM:SS format
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 */
function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Delete a file if it exists
 * @param {string} filePath - Path to file
 */
function deleteFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error(`Failed to delete file ${filePath}:`, error.message);
  }
}

module.exports = {
  name: 'play',
  aliases: ['music', 'song', 'yt', 'youtube'],
  category: 'music',
  description: 'Download music from YouTube',
  usage: '!play <YouTube URL>',
  cooldown: 15, // 15 second cooldown (downloads are heavy)
  adminOnly: false,

  /**
   * Execute the play command
   * @param {string} from - Sender phone number
   * @param {Array<string>} args - Command arguments
   * @param {Object} context - Additional context (sendMessage, sendAudio, etc.)
   */
  execute: async (from, args, context = {}) => {
    try {
      // Check if URL is provided
      if (args.length === 0) {
        const helpMessage = `❌ *Please provide a YouTube URL!*

📝 *Usage:*
\`!play <YouTube URL>\`

📌 *Example:*
\`!play https://youtube.com/watch?v=dQw4w9WgXcQ\`

⚠️ *Disclaimer:* Downloading copyrighted content may violate YouTube's Terms of Service. Use this feature responsibly and only for content you have rights to download.`;

        if (context.sendMessage) {
          await context.sendMessage(from, helpMessage);
        } else {
          await sendMessage(from, helpMessage);
        }
        return;
      }

      const url = args[0];

      // Validate YouTube URL
      if (!ytdl.validateURL(url)) {
        const errorMessage = `❌ *That doesn't look like a valid YouTube URL.*

📝 *Usage:* \`!play https://youtube.com/watch?v=...\`

💡 *Tip:* Make sure you're using a complete YouTube video URL.`;

        if (context.sendMessage) {
          await context.sendMessage(from, errorMessage);
        } else {
          await sendMessage(from, errorMessage);
        }
        return;
      }

      // Get video info
      let info;
      try {
        info = await ytdl.getInfo(url);
      } catch (error) {
        const errorMessage = `❌ *Failed to fetch video information.*

This could be due to:
• Video is private or restricted
• Video has been deleted
• Age-restricted content
• Geographic restrictions

Please try a different video.`;

        if (context.sendMessage) {
          await context.sendMessage(from, errorMessage);
        } else {
          await sendMessage(from, errorMessage);
        }
        return;
      }

      const title = info.videoDetails.title;
      const duration = parseInt(info.videoDetails.lengthSeconds);
      const channel = info.videoDetails.author.name;
      const formattedDuration = formatDuration(duration);

      // Check duration limit (10 minutes = 600 seconds)
      if (duration > 600) {
        const errorMessage = `⚠️ *Video is too long!*

⏱️ *Video Duration:* ${formattedDuration}
⏱️ *Maximum Duration:* 10:00

Please choose a shorter video to download.`;

        if (context.sendMessage) {
          await context.sendMessage(from, errorMessage);
        } else {
          await sendMessage(from, errorMessage);
        }
        return;
      }

      // Send download start message
      const downloadingMessage = `🎵 *SPACE-MD Music Player* 🎵
━━━━━━━━━━━━━━━━━━━━
🎶 *Title:* ${title}
🎤 *Artist:* ${channel}
⏱️ *Duration:* ${formattedDuration}
📥 *Quality:* 128kbps MP3
━━━━━━━━━━━━━━━━━━━━
_Downloading your track..._ ⏳`;

      if (context.sendMessage) {
        await context.sendMessage(from, downloadingMessage);
      } else {
        await sendMessage(from, downloadingMessage);
      }

      // Create temp directory if it doesn't exist
      const tempDir = path.join(__dirname, '../../temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      // Download and convert to MP3
      const sanitizedTitle = sanitizeFilename(title);
      const outputPath = path.join(tempDir, `${Date.now()}_${sanitizedTitle}.mp3`);

      const stream = ytdl(url, {
        filter: 'audioonly',
        quality: 'highestaudio'
      });

      await new Promise((resolve, reject) => {
        ffmpeg(stream)
          .audioBitrate(128)
          .toFormat('mp3')
          .save(outputPath)
          .on('end', () => {
            console.log('Download and conversion completed');
            resolve();
          })
          .on('error', (error) => {
            console.error('FFmpeg error:', error);
            reject(error);
          });
      });

      // Upload and send the file
      try {
        const mediaId = await uploadMedia(outputPath, 'audio/mpeg');
        const filename = `${sanitizedTitle}.mp3`;
        const caption = `✅ *Download Complete!* 🎉
━━━━━━━━━━━━━━━━━━━━
🎶 ${title}
🎤 ${channel} • ${formattedDuration}
━━━━━━━━━━━━━━━━━━━━
_Enjoy your music!_ 🎧`;

        await sendDocument(from, mediaId, caption, filename);
      } catch (uploadError) {
        console.error('Upload error:', uploadError);
        const errorMessage = `❌ *Failed to send the audio file.*

The download completed, but there was an error sending the file. This might be due to:
• WhatsApp API rate limits
• File size restrictions
• Network issues

Please try again later.`;

        if (context.sendMessage) {
          await context.sendMessage(from, errorMessage);
        } else {
          await sendMessage(from, errorMessage);
        }
      } finally {
        // Clean up: delete the temp file
        deleteFile(outputPath);
      }

    } catch (error) {
      console.error('Play command error:', error);
      
      const errorMessage = `❌ *An unexpected error occurred.*

Error: ${error.message}

Please try again or contact support if the issue persists.`;

      if (context.sendMessage) {
        await context.sendMessage(from, errorMessage);
      } else {
        await sendMessage(from, errorMessage);
      }
    }
  }
};
