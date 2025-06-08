const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed'
        };
    }

    try {
        // Parse the request body
        const data = JSON.parse(event.body);
        const { timestamp, attempt, success } = data;

        // Path to the public tracker file
        const trackerPath = path.join(__dirname, '..', 'public', 'tracker.txt');

        // Format the log entry
        const logEntry = `${timestamp} | Attempt: ${attempt} | Success: ${success}\n`;

        // Append to the tracker file
        fs.appendFileSync(trackerPath, logEntry);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Attempt tracked successfully' })
        };
    } catch (error) {
        console.error('Error tracking attempt:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to track attempt' })
        };
    }
}; 