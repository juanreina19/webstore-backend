require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

// Conectar base de datos al cargar la función
connectDB(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB conectado"))
    .catch(err => console.error("❌ Error MongoDB:", err));

// 👉 Exportar la app en lugar de app.listen
module.exports = app;