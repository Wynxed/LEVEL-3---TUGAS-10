const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

mongoose.connect('mongodb://localhost/pijarcamp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const produkSchema = new mongoose.Schema({
    nama_produk: String,
    keterangan: String,
    harga: Number,
    jumlah: Number,
});

const Produk = mongoose.model('Produk', produkSchema);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', async (req, res) => {
    try {
        const produkList = await Produk.find();
        res.render('index', { produkList });
    } catch (err) {
        console.error(err);
        res.status(500).send('Terjadi kesalahan pada server.');
    }
});

app.post('/add', async (req, res) => {
    const { nama_produk, keterangan, harga, jumlah } = req.body;
    const produk = new Produk({ nama_produk, keterangan, harga, jumlah });

    try {
        await produk.save();
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Terjadi kesalahan pada server.');
    }
});

app.get('/delete/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await Produk.findByIdAndDelete(id);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Terjadi kesalahan pada server.');
    }
});

app.get('/edit/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const produk = await Produk.findById(id);
        res.render('edit', { produk });
    } catch (err) {
        console.error(err);
        res.status(500).send('Terjadi kesalahan pada server.');
    }
});

app.post('/update/:id', async (req, res) => {
    const id = req.params.id;
    const { nama_produk, keterangan, harga, jumlah } = req.body;

    try {
        await Produk.findByIdAndUpdate(id, { nama_produk, keterangan, harga, jumlah });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Terjadi kesalahan pada server.');
    }
});

app.listen(3000, () => {
    console.log('Server berjalan pada http://localhost:3000');
});