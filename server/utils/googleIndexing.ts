import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { JWT } from 'google-auth-library';

// Load environment variables
dotenv.config();

// Define possible paths to the key file
const possiblePaths = [
  // Path in VPS
  '/root/Study-Guru-FullStack-with-auth/study-guru-458720-adb5efdd1791.json',
  // Relative path from current working directory
  path.resolve(process.cwd(), 'study-guru-458720-adb5efdd1791.json'),
  // Path relative to the module directory
  path.resolve(import.meta.dirname, '../../study-guru-458720-adb5efdd1791.json')
];

// Define key file interface
interface ServiceAccountKey {
  client_email: string;
  private_key: string;
  [key: string]: any;
}

// Try to find the key file
let keyFilePath: string | null = null;
let key: ServiceAccountKey | null = null;

for (const filePath of possiblePaths) {
  console.log(`Checking for Google API key file at: ${filePath}`);
  if (fs.existsSync(filePath)) {
    console.log(`Found Google API key file at: ${filePath}`);
    keyFilePath = filePath;
    try {
      key = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      break;
    } catch (error) {
      console.error(`Error reading key file at ${filePath}:`, error);
    }
  }
}

// Create JWT client if key was found
let jwtClient: JWT | null = null;
if (key) {
  try {
    jwtClient = new google.auth.JWT(
      key.client_email,
      undefined,
      key.private_key,
      ['https://www.googleapis.com/auth/indexing'],
      undefined
    );
    console.log('Successfully initialized Google JWT client');
  } catch (error) {
    console.error('Error creating JWT client:', error);
  }
} else {
  console.error('Could not find or parse Google API key file in any location');
}

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
    
    // Check if JWT client was properly initialized
    if (!jwtClient) {
      throw new Error('Google API client not initialized. Check if key file exists and is valid.');
    }
    
    // Authorize the client
    const tokens = await new Promise<any>((resolve, reject) => {
      jwtClient!.authorize((err: Error | null, tokens: any) => {
        if (err) {
          console.error('JWT authorization error:', err);
          reject(err);
          return;
        }
        console.log('JWT authorization successful');
        resolve(tokens);
      });
    });
    
    // Use the indexing API
    const indexing = google.indexing({ version: 'v3', auth: jwtClient });
    const result = await indexing.urlNotifications.publish({
      requestBody: {
        url: url,
        type: 'URL_UPDATED'
      }
    });
    
    console.log('Successfully submitted URL to Google Indexing API:', url);
    return result.data;
  } catch (error) {
    console.error('Error submitting URL to Google Indexing API:', error);
    throw error;
  }
}



