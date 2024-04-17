import { db } from '../../app.js';
  
export const mongoRegisterUser = async (req, res) => {
    try {
        const usersCollection = db.collection('users');
        const { username, email, password } = req.body;
        await usersCollection.insertOne({ username, email, password });
        return res.status(201).json({ message: 'Usuario registrado exitosamente.' });  
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor.' });
    } 
};