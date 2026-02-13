/**
 * Time Command
 * Returns the current date and time
 */

module.exports = {
  name: 'time',
  triggers: ['time', 'date', 'datetime', 'clock'],
  description: 'Get current date and time',
  
  execute: (from, msgBody) => {
    const now = new Date();
    
    const dateOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    const timeOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    
    const date = now.toLocaleDateString('en-US', dateOptions);
    const time = now.toLocaleTimeString('en-US', timeOptions);
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    return `🕐 *Current Date & Time*\n\n📅 ${date}\n⏰ ${time}\n🌍 Timezone: ${timezone}`;
  }
};
