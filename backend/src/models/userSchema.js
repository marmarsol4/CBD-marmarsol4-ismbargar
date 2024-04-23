import { mongoose } from '../../app.js';

const userSchema = new mongoose.Schema({
    username: { type: String,  required: [true, "El nombre de usuario es obligatorio"], 
        validate: [
        {
            validator: (value) => {
                return /^[a-zA-Z0-9_]{4,16}$/.test(value);
            }, message: `El nombre de usuario debe tener entre 4 y 16 caracteres y solo puede contener letras, números y guiones bajos`
        },
        {
            validator: async function(value) {
                const existingUser = await this.constructor.findOne({ username: value });
                return !existingUser;
            },message: "El nombre de usuario ya está en uso"
        }
    ]},
    password: { type: String, required: [true, "La contraseña es obligatoria"], minLength: [12, "La contraseña debe tener al menos 12 caracteres"],
        validate: [{
            validator: (value) => {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/.test(value);
            }, message: `La contraseña debe tener al menos una letra minúscula, una letra mayúscula, un número y un caracter especial`
        },{
            validator: (value) => {
                return !/\s/.test(value);
            }, message: `La contraseña no puede contener espacios`
        },
        {  
            validator: (value) => {
                return value.trim().length > 0;
            }, message: `La contraseña no puede estar vacía`
        },
    ]},
    email: { type: String, unique: true, required: [true, "El email es obligatorio"], 
        validate: [{
            validator: (value) => {
                return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
            }, message: props => `${props.value} no es un correo electrónico válido.`
        },
        {
            validator: async function(value) {
                const existingUser = await this.constructor.findOne({ email: value });
                return !existingUser;
            },message: "El correo ya está en uso"
        }
    ]},
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File', default: [] }],
});

export default mongoose.model('User', userSchema);