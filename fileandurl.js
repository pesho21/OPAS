const { Storage } = require('@google-cloud/storage');
const path = require('path');


const projectId = 'your-project-id';
const keyFilename = path.join(__dirname, 'path/to/your/service-account-key.json');


const storage = new Storage({ projectId, keyFilename });


const bucketName = 'your-bucket-name';
const fileName = 'file.txt'; 


const expiresIn = 60 * 60; 


async function uploadFileAndGenerateSignedUrl() {
  try {
    
    const filePath = 'path/to/your/local/file.txt'; 

    
    const destFileName = fileName;

    
    await storage.bucket(bucketName).upload(filePath, {
      destination: destFileName,
    });

    console.log(`File ${filePath} uploaded to ${bucketName}/${destFileName}.`);

    
    const options = {
      version: 'v4', 
      action: 'read',
      expires: Date.now() + expiresIn * 1000, 
    };

    // Generate the signed URL
    const [url] = await storage.bucket(bucketName).file(fileName).getSignedUrl(options);

    console.log('Signed URL:', url);
  } catch (err) {
    console.error('Error uploading file and generating signed URL:', err);
  }
}

uploadFileAndGenerateSignedUrl();
