const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.json({ message: 'API corriendo correctamente' });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
}); 