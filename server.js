const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://root:CRSqb3US3rFvggqSbWlnxx0n2K59vNrXuFa6HZbymyvHRahys7TCZPPcEI9TwAct@h40wwsg0kcckcc0w4skwk4s8:27017/?directConnection=true';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch((err) => {
    console.error('MongoDB bağlantı hatası:', err);
    process.exit(1);
  });

const historySchema = new mongoose.Schema({
}, { 
  timestamps: true,
  strict: false
});

const History = mongoose.model('History', historySchema);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.post('/api/history', async (req, res) => {
  try {
    const data = req.body;
    
    const history = new History(data);
    await history.save();
    
    res.status(201).json({
      success: true,
      message: 'Veri başarıyla kaydedildi',
      data: history
    });
  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Veri kaydedilirken hata oluştu',
      error: error.message
    });
  }
});

app.get('/api/history', async (req, res) => {
  try {
    const histories = await History.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: histories.length,
      data: histories
    });
  } catch (error) {
    console.error('Listeleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Kayıtlar listelenirken hata oluştu',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});

