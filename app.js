const express = require('express');
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

// Define storage for the uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/markers', async (req, res) => {
  try {
    const markers = await prisma.markers.findMany();
    res.json(markers);
  } catch (error) {
    console.error('Error fetching markers from database:', error);
    res.status(500).send('Error fetching markers from database');
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'map.html'));
});

// Use upload middleware to handle file upload
app.post('/markers', upload.single('photo'), async (req, res) => {
  const { latitude, longitude, pollutionType, description } = req.body;
  const imageUrl = req.file ? req.file.path : null;

  try {
    const createdMarker = await prisma.markers.create({
      data: {
        latitude,
        longitude,
        pollutionType,
        description,
        photo: imageUrl
      }
    });
    console.log('Marker data uploaded successfully. Insert ID:', createdMarker.id);
    res.redirect('/');
  } catch (error) {
    console.error('Error uploading marker data:', error);
    res.status(500).send('Error uploading marker data.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
