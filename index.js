const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Permitir que el app confíe en el proxy (necesario en Render/Heroku)
// para que req.ip devuelva la IP real usando X-Forwarded-For.
app.enable('trust proxy');

app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Ruta requerida por el desafío
app.get('/api/whoami', (req, res) => {
  // IP: preferimos x-forwarded-for (puede contener list), si no usar req.ip
  let ip = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress || '';
  // x-forwarded-for puede contener varias IPs: "client, proxy1, proxy2"
  if (ip && ip.indexOf(',') !== -1) {
    ip = ip.split(',')[0].trim();
  }

  // lenguaje preferido (tomamos el primero de la cabecera Accept-Language)
  const rawLang = req.headers['accept-language'] || '';
  const language = rawLang.split(',')[0];

  // software (user agent)
  const software = req.headers['user-agent'] || '';

  res.json({
    ipaddress: ip,
    language: language,
    software: software
  });
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
