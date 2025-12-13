import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MOCK_DATA_PATH = path.join(__dirname, '../mock/sample_index.json');

console.log('--- RegTech Mock Ingestion Pipeline ---');
console.log('1. Watching for new files in /uploads...');
console.log('2. Detected: DORA_Regulation_v2.1.pdf');
console.log('3. Parsing PDF structure...');
console.log('4. Generating embeddings via Gemini...');

// Simulate delay
setTimeout(() => {
    try {
        const raw = fs.readFileSync(MOCK_DATA_PATH, 'utf-8');
        const data = JSON.parse(raw);
        console.log(`5. Indexing ${data.length} vectors to ChromaDB/Pinecone...`);
        console.log('6. Success! Document available for search.');
    } catch (e) {
        console.error('Error reading mock data:', e);
    }
}, 2000);