const fs = require('fs');
const path = require('path');

function analyzeTrackerData() {
    const trackerPath = path.join(__dirname, 'netlify', 'public', 'tracker.txt');

    if (!fs.existsSync(trackerPath)) {
        console.log('No tracking data found');
        return;
    }

    const data = fs.readFileSync(trackerPath, 'utf8');
    const attempts = data.trim().split('\n');

    // Group attempts by date
    const attemptsByDate = {};
    attempts.forEach(attempt => {
        const date = attempt.split('T')[0];
        if (!attemptsByDate[date]) {
            attemptsByDate[date] = [];
        }
        attemptsByDate[date].push(attempt);
    });

    // Analyze each day's data
    Object.entries(attemptsByDate).forEach(([date, dayAttempts]) => {
        const stats = {
            totalAttempts: dayAttempts.length,
            successfulAttempts: dayAttempts.filter(line => line.includes('Success: true')).length,
            failedAttempts: dayAttempts.filter(line => line.includes('Success: false')).length,
            uniqueAttempts: new Set(dayAttempts.map(line => line.split('|')[1].trim())).size
        };

        console.log(`\nAnalytics for ${date}:`);
        console.log('------------------------');
        console.log(`Total Attempts: ${stats.totalAttempts}`);
        console.log(`Successful Attempts: ${stats.successfulAttempts}`);
        console.log(`Failed Attempts: ${stats.failedAttempts}`);
        console.log(`Unique Passwords Tried: ${stats.uniqueAttempts}`);
        console.log('------------------------\n');

        // Show recent attempts for this day
        console.log('Recent Attempts:');
        console.log('------------------------');
        dayAttempts.slice(-5).forEach(attempt => {
            console.log(attempt);
        });
    });
}

// Analyze all tracking data
analyzeTrackerData(); 