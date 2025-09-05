const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Permitir que el app confíe en el proxy (necesario en Render)
// para que req.ip devuelva la IP real usando X-Forwarded-For.
app.enable('trust proxy');

app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get("/api/whoami", (req, res) => {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;
  const language = req.headers["accept-language"];
  const software = req.headers["user-agent"];

  res.json({
    ipaddress: ip,
    language: language,
    software: software,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
