import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

// Path to your service account key file
const keyFilePath = path.resolve(process.cwd(), 'study-guru-458720-49962f48e6ea.json');
const key = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));

// Create a JWT client using the service account credentials
const jwtClient = new google.auth.JWT(
  key.client_email,
  undefined,  // Use undefined instead of null to satisfy TypeScript
  key.private_key,
  ['https://www.googleapis.com/auth/indexing'],
  null  // Changed back to null as in the example
);

/**
 * @swagger
 * tags:
 *   name: Google Indexing
 *   description: Google Search Console Indexing API operations
 */

/**
 * @swagger
 * /api/google/index:
 *   post:
 *     summary: Submit URL to Google for indexing
 *     tags: [Google Indexing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *                 description: The URL to be indexed by Google
 *     responses:
 *       200:
 *         description: URL successfully submitted for indexing
 *       400:
 *         description: Invalid URL or request
 *       401:
 *         description: Unauthorized - missing or invalid credentials
 *       500:
 *         description: Server error
 */

/**
 * Notifies Google to index a new URL
 * @param url The URL to be indexed
 * @returns Promise with the API response
 */
export async function notifyGoogleIndexing(url: string): Promise<any> {
  try {
    console.log(`Attempting to notify Google Indexing API for URL: ${url}`);
    
    // Get tokens through authorization
    const tokens = await new Promise((resolve, reject) => {
      jwtClient.authorize((err, tokens) => {
        if (err) {
          console.error('JWT authorization error:', err);
          reject(err);
          return;
        }
        console.log('JWT authorization successful');
        resolve(tokens);
      });
    });
    
    // Create the indexing client
    const indexing = google.indexing({
      version: 'v3',
      auth: jwtClient
    });
    
    // Submit the URL for indexing
    console.log(`Submitting URL: ${url} to Google Indexing API`);
    const response = await indexing.urlNotifications.publish({
      requestBody: {
        url: url,
        type: "URL_UPDATED"
      }
    });
    
    console.log(`Successfully submitted ${url} to Google Indexing API`);
    return response.data;
  } catch (error) {
    console.error('Error submitting URL to Google Indexing API:', error);
    throw error;
  }
}







