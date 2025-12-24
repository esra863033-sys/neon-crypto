const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); // Statik dosyalar için

// --- MİKROSERVİS 1: KRİPTO FİYAT SERVİSİ ---
// Görevi: Sadece coin fiyatını USD cinsinden bulmak.
app.get('/api/crypto-price', async (req, res) => {
    try {
        const coin = req.query.coin || 'bitcoin';
        // CoinGecko ücretsiz API
        const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`);
        
        if (!response.data[coin]) {
            return res.status(404).json({ error: 'Coin bulunamadı' });
        }
        
        res.json({ 
            service: 'CryptoService', 
            coin: coin, 
            usd_price: response.data[coin].usd 
        });
    } catch (error) {
        console.error("Kripto API Hatası:", error.message);
        res.status(500).json({ error: 'Kripto servisi yanıt vermiyor.' });
    }
});

// --- MİKROSERVİS 2: DÖVİZ DÖNÜŞTÜRME SERVİSİ ---
// Görevi: Verilen USD miktarını hedef para birimine çevirmek.
app.get('/api/convert-currency', async (req, res) => {
    try {
        const amount = req.query.amount;
        const target = req.query.target || 'TRY';

        if (!amount) return res.status(400).json({ error: 'Miktar belirtilmedi' });

        // Frankfurter ücretsiz Döviz API
        const response = await axios.get(`https://api.frankfurter.app/latest?from=USD&to=${target}`);
        
        const rate = response.data.rates[target];
        const convertedValue = amount * rate;

        res.json({ 
            service: 'CurrencyService', 
            original_usd: amount,
            target_currency: target,
            rate: rate,
            converted_value: convertedValue.toFixed(2)
        });

    } catch (error) {
        console.error("Döviz API Hatası:", error.message);
        res.status(500).json({ error: 'Döviz servisi yanıt vermiyor.' });
    }
});

// Frontend'i sunma
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server http://localhost:${PORT} adresinde çalışıyor...`);
});
