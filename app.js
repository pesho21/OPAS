const express = require('express');
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

app.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    console.log(req);
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file.');
  }
});

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

app.post('/markers', upload.single('photo'), async (req, res) => {
  const { latitude, longitude, pollutionType, description, photo} = req.body;
  try {
    const createdMarker = await prisma.markers.create({
      data: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        pollutionType,
        description,
        photo 
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