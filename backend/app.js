import express from 'express';  
import cors from 'cors';
import path from 'path';
import history from 'connect-history-api-fallback';
import { MongoClient } from 'mongodb';
import router from "./src/router.js";
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.set('serverPort', process.env.SERVER_PORT || 3000);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(express.static(path.join(__dirname, 'public')));
app.use(history());
app.use(router);

const serverPort = app.get('serverPort');
const mongoUri = process.env.MONGO_URI;

const connectDb = async () => {
  
  const client = await new MongoClient(mongoUri).connect();
  const db = client.db(process.env.MONGO_DATABASE);
  
  app.listen(serverPort, () => {
    console.log(`Servidor iniciado en el puerto ${serverPort}`);
  }); 
}
connectDb();