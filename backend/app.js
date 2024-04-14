import express from 'express';  
import cors from 'cors';
import path from 'path';
import history from 'connect-history-api-fallback';
import { MongoClient } from 'mongodb';
import router from "./src/router.js";
import dotenv from 'dotenv';
import exp from 'constants';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';

dotenv.config();

const app = express();

app.set('serverPort', process.env.SERVER_PORT || 3000);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(express.static(path.join(__dirname, 'public')));
app.use(router);
app.use(history());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

const routes = router.stack
  .filter(layer => layer.route)
  .map(layer => ({
    method: Object.keys(layer.route.methods)[0].toUpperCase(),
    path: layer.route.path
  }));

// Imprimir las rutas
console.log('Rutas registradas:');
routes.forEach(route => {
  console.log(`${route.method} ${route.path}`);
});

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});



const serverPort = app.get('serverPort');
const mongoUri = process.env.MONGO_URI;

const connectDb = async () => {
  const client = await new MongoClient(mongoUri).connect();
  return client.db(process.env.MONGO_DATABASE); 
}
export const db = await connectDb();
passport.use(new LocalStrategy(
  async (username, password, done) => {
    const user = await db.collection('users').findOne({ username: username, password: password })
      return done(null, user);
    }

));
app.listen(serverPort, () => {
  console.log(`Servidor iniciado en el puerto ${serverPort}`);
}); 