const express = require('express');
require('dotenv').config();
const cors = require('cors');  
const connectDB = require('./db/db.js');
const Routes = require('./Routes/routes.js');
const authRoutes = require ('./Routes/auth.js');


const PORT = process.env.PORT || 5000;  // PORT

// Middleware
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes );
app.use('/api/favorites', Routes);

// DataBase setup
connectDB();

// listening
app.listen(PORT, () => {
    console.log(`server running on port http://localhost:${PORT}`)
})