import express from 'express';  
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import path from 'path';
import history from 'connect-history-api-fallback';
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import router from './src/router.js';
import passport from './src/config/passport.js';

dotenv.config();  
const app = express();

app.set('serverPort', process.env.SERVER_PORT || 3000);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(router);
app.use(history());

// const routes = router.stack
//   .filter(layer => layer.route)
//   .map(layer => ({
//     method: Object.keys(layer.route.methods)[0].toUpperCase(),
//     path: layer.route.path
//   }));

// // Imprimir las rutas
// console.log('Rutas registradas:');
// routes.forEach(route => {
//   console.log(`${route.method} ${route.path}`);
// });

const serverPort = app.get('serverPort');
const mongoUri = process.env.MONGO_URI;

const mongoConnectDb = async () => {
  const client = await new MongoClient(mongoUri).connect();
  return client.db(process.env.MONGO_DATABASE); 
}
export const db = await mongoConnectDb();
//await db.collection('users').drop();

const mongooseConnectDb = async () => {
  await mongoose.connect(mongoUri + "/" + process.env.MONGO_DATABASE);
  const mongooseDb = mongoose.connection;
  mongooseDb.on('error', console.error.bind(console, 'Error de conexión a MongoDB con Mongoose:'));
}
await mongooseConnectDb();

export let mongooseMode = false; 
export const mongooseModeChange = (mode) => {mongooseMode = mode;}

export { mongoose };

app.listen(serverPort, () => {
  console.log(`Servidor iniciado en el puerto ${serverPort}`);
}); 