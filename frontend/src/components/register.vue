<script>
import { ref, onMounted } from 'vue';
export default {
  
    setup() {  

    const user = ref({
        username: '',
        password: '',
        email: '',
    });

    const passwordMatch = ref('');
    const error = ref('');

    const register = () => {
      fetch(import.meta.env.VITE_API_URL + '/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.value.username,
          password: user.value.password,
          email: user.value.email,
        
        }).then(response => {
            if (response.status === 201) {
            } else {
                throw new Error('Error al registrar');
            }
        }).catch(error => {
            console.error(error);
        })
      });
    };

    const confirmPassword = () => {
        if (user.value.password !== passwordMatch.value) {
            alert('Las contraseñas no coinciden');
        }
    };

    return {
        user,
        passwordMatch,
        error,
        confirmPassword,
        register,
    }
  }
}   
</script>
 
<template>
  <div class="register-container">
    
  <h2>Registro</h2>
  <form @submit.prevent="register">
    <div class="form">
    <div class="form-column">  
      <div class="form-group">
          <label for="username">Usuario:</label>
          <input type="text" id="username" v-model="user.username" required>
      </div>
      <div class="form-group">
          <label for="password">Contraseña:</label>
          <input type="password" id="password" v-model="user.password" required>
      </div>
    </div>

    <div class="form-column">
      <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="user.email" required>
      </div>

      <div class="form-group">
          <label for="confirmPassword">Confirmar Contraseña:</label>
          <input type="password" id="confirmPassword" v-model="passwordMatch" required>
      </div>
    </div>
    </div>

    <div style="display: flex; justify-content: center;">
      <button type="submit">Registrarse</button>
    </div>
      
    </form>

  Ya tienes cuenta<button type="button" @click="login">Iniciar Sesión</button>
    
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<style>
.register-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.register-container form{
  display: flex;
  flex-direction: column;
}

.register-container h2 {
  text-align: center;
}

.form {
  display: flex;
}

.register-container form .form-group {
  display: flex;
  flex-direction: column; /* Hace que los hijos directos de .form-group se muestren en el mismo nivel */
}



.register-container form .form-group input {
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%; /* Opcional: asegura que los inputs ocupen todo el ancho disponible */
  box-sizing: border-box; /* Asegura que el padding no aumente el ancho del input */
}

.register-container form button {
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
  cursor: pointer;
  justify-self: center; /* Centra los botones horizontalmente */
}

.register-container form button:hover {
  background-color: #e0e0e0;
}

.register-container form .error {
  color: red;
  grid-column: 1 / -1; /* Ocupa todas las columnas disponibles */
  text-align: center; /* Centra el texto */
}

.register-container form .success {
  color: green;
}



.form-group {
  margin-bottom: 15px;
}

.error {
  color: red;
}
</style>