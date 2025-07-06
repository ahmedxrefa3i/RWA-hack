const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// تحميل مفتاح Firebase الخاص
const serviceAccount = require('./service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// API بسيطة تتحقق من الباسورد وترد بالرابط
app.post('/get-link', async (req, res) => {
  const { password } = req.body;

  try {
    const docRef = db.collection('passwords').doc(password);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(401).json({ error: 'Wrong password' });
    }

    const data = doc.data();
    res.json({ link: data.link }); // الرابط المشفر
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
