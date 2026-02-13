/**
 * SPACE-MD Music Player - Play Command
 * Download music by song name or YouTube URL
 */

const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { searchYouTube, downloadMusic } = require('../../utils/youtube');
const { formatViews, formatDuration, sanitizeFilename } = require('../../utils/formatters');

const unlinkAsync = promisify(fs.unlink);

// Constants
const MAX_DURATION_SECONDS = 600; // 10 minutes

module.exports = {
  name: 'play',
  aliases: ['music', 'song', 'yt', 'youtube', 'dl'],
  category: 'music',
  description: 'Download music by song name or YouTube URL',
  usage: '!play <song name or YouTube URL>',
  examples: [
    '!play Blinding Lights The Weeknd',
    '!play Shape of You Ed Sheeran',
    '!play https://youtube.com/watch?v=dQw4w9WgXcQ'
  ],
  cooldown: 15,
  adminOnly: false,
  
  execute: async (from, args, { sendMessage, sendAudio, sendDocument }) => {
    try {
      // Check if query is provided
      if (args.length === 0) {
        return await sendMessage(from, `❌ *Usage:* ${module.exports.usage}\n\n*Examples:*\n${module.exports.examples.join('\n')}`);
      }

      const query = args.join(' ');
      
      // Check if it's a URL or a search query
      const isUrl = ytdl.validateURL(query);
      
      let videoUrl;
      let videoInfo;
      let videoTitle;
      let channel;
      let duration;
      let views;
      
      if (isUrl) {
        // Direct URL mode
        videoUrl = query;
        
        try {
          videoInfo = await ytdl.getInfo(videoUrl);
          videoTitle = videoInfo.videoDetails.title;
          channel = videoInfo.videoDetails.author.name;
          duration = formatDuration(parseInt(videoInfo.videoDetails.lengthSeconds));
          views = formatViews(parseInt(videoInfo.videoDetails.viewCount));
        } catch (error) {
          return await sendMessage(from, '❌ Invalid YouTube URL or video not accessible. Please check the link and try again.');
        }
      } else {
        // Search mode
        await sendMessage(from, `🎵 *SPACE-MD Music Player* 🎵\n━━━━━━━━━━━━━━━━━━━━\n🔍 Searching: "${query}"\n\n_Please wait..._`);
        
        const results = await searchYouTube(query);
        
        if (results.length === 0) {
          return await sendMessage(from, `❌ No results found for "${query}". Try different keywords!`);
        }
        
        const video = results[0];
        videoUrl = video.url;
        videoTitle = video.title;
        channel = video.author ? video.author.name : 'Unknown';
        
        // Parse duration from video object
        if (video.duration) {
          // ytsr returns duration in format like "4:22"
          const parts = video.duration.split(':').map(Number);
          const totalSeconds = parts.length === 2 
            ? parts[0] * 60 + parts[1]
            : parts[0] * 3600 + parts[1] * 60 + parts[2];
          duration = video.duration;
          
          // Check if video is too long
          if (totalSeconds > MAX_DURATION_SECONDS) {
            return await sendMessage(from, '⚠️ That track is over 10 minutes. Try a shorter one!');
          }
        } else {
          duration = 'N/A';
        }
        
        views = video.views ? formatViews(video.views) : 'N/A';
        
        // Show found result
        await sendMessage(from, 
          `🎵 *Found:* ${videoTitle}\n` +
          `🎤 *Channel:* ${channel}\n` +
          `⏱️ *Duration:* ${duration}\n` +
          `👁️ *Views:* ${views}\n` +
          `━━━━━━━━━━━━━━━━━━━━\n` +
          `📥 _Downloading as MP3..._`
        );
      }
      
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
        
        return await sendMessage(from, '❌ Download failed. Please try again or use a different song.');
      }
      
    } catch (error) {
      console.error('Play command error:', error);
      return await sendMessage(from, '❌ An error occurred. Please try again later.');
    }
  }
};
