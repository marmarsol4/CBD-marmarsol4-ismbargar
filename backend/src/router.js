import { Router } from 'express';
import { mongoRegisterUser, mongooseRegisterUser } from './controllers/userController.js';
import passport from 'passport';

const router = new Router();

router.get('/', (req, res) => {
    res.send('Hello World');
});

router.get('/mongo/register/', mongoRegisterUser);
router.get('/mongoose/register/', mongooseRegisterUser);

router.post('/login', passport.authenticate('local'), (req, res) => {
    res.status(200);
});

router.post('/logout', (req, res) => {
    req.logout();
    res.status(200).json({ message: 'Deslogueo exitoso' });
});
  
export default router;