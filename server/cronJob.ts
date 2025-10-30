import * as stockManager from './stockManager';

async function runDailyProcessing() {
  console.log('[CRON] Running end-of-day processing...');
  try {
    await stockManager.processEndOfDay();
    console.log('[CRON] End-of-day processing completed successfully');
  } catch (error) {
    console.error('[CRON] Error during end-of-day processing:', error);
  }
}

// Run immediately on startup to catch any missed days
runDailyProcessing();

// Schedule to run every hour (will only process once per day due to internal check)
setInterval(runDailyProcessing, 60 * 60 * 1000);

console.log('[CRON] Daily processing scheduler initialized');
