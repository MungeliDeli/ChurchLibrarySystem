require('dotenv').config();
const { S3Client, PutObjectCommand, DeleteObjectCommand, ListBucketsCommand } = require('@aws-sdk/client-s3');

console.log('--- S3 Connection Diagnostic Script ---');

// 1. Check Env Vars
const requiredVars = ['AWS_REGION', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_S3_BUCKET_NAME'];
let missingVars = false;
requiredVars.forEach(varName => {
    if (!process.env[varName]) {
        console.error(`❌ Missing Environment Variable: ${varName}`);
        missingVars = true;
    } else {
        console.log(`✅ ${varName} is set`);
    }
});

// Also check S3_BUCKET_NAME as fallback used in code
if (!process.env.AWS_S3_BUCKET_NAME && process.env.S3_BUCKET_NAME) {
    console.log(`✅ S3_BUCKET_NAME is set (used as fallback)`);
}

if (missingVars) {
    console.error('Aborting due to missing environment variables.');
    process.exit(1);
}

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || process.env.S3_BUCKET_NAME;

// 2. Initialize Client
console.log(`Attempting to connect to region: ${process.env.AWS_REGION}`);
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

async function runDiagnostics() {
    try {
        // 3. List Buckets (validates creds)
        console.log('Attempting to list buckets...');
        const listRes = await s3Client.send(new ListBucketsCommand({}));
        console.log('✅ Successfully listed buckets.');

        const bucketExists = listRes.Buckets.some(b => b.Name === BUCKET_NAME);
        if (bucketExists) {
            console.log(`✅ Targeted bucket '${BUCKET_NAME}' found in account.`);
        } else {
            console.warn(`⚠️ Targeted bucket '${BUCKET_NAME}' NOT found in account listing. Check bucket name or permission boundary.`);
        }

        // 4. Test Upload
        console.log(`Attempting to upload a test file to '${BUCKET_NAME}'...`);
        const testKey = 'test-connection-file.txt';
        await s3Client.send(new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: testKey,
            Body: 'Hello S3!',
            ContentType: 'text/plain'
        }));
        console.log('✅ Successfully uploaded test file.');

        // 5. Test Delete
        console.log('Attempting to delete test file...');
        await s3Client.send(new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: testKey
        }));
        console.log('✅ Successfully deleted test file.');

        console.log('--- DIAGNOSTICS PASSED: S3 Connection is working ---');

    } catch (error) {
        console.error('--- DIAGNOSTICS FAILED ---');
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);
        if (error.$metadata) {
            console.error('HTTP Status:', error.$metadata.httpStatusCode);
        }
        process.exit(1);
    }
}

runDiagnostics();
