<script>
import { ref, watch } from 'vue';
export default {
  
    setup() {  

    const user = ref({
        username: '',
        password: '',
    });

    const error = ref('');

    const login = () => {
      error.value = '';
      fetch(import.meta.env.VITE_BACKEND_URL + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.value.username,
          password: user.value.password,
        })
      }).then(response => {
            if (response.status === 201) {
            } else {
                error.value = 'Error al iniciar sesión';
            }
        }).catch(error => {
                error.value = 'Error al iniciar sesión';
        })
    };



    return {
        user,
        error,
        login,
    }
  }
}   
</script>
 
<template>
  <div class="login-container">
    
  <h2>Iniciar sesión</h2>
  <form @submit.prevent="login">
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
    </div>

    <div style="display: flex; justify-content: center;">
      <button type="submit">Iniciar sesión</button>
    </div>
      
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
  
  ¿No tienes cuenta? <button type="button" @click="$router.push('/register')" style="margin:2%">Regístrate</button>
</template>

<style scoped>
.login-container {
  max-width: 40vw;
  width:100%;
  margin: 0 auto;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;

}

.login-container form{
  display: flex;
  flex-direction: column;
}

.login-container h2 {
  text-align: center;
}

.form {
  display: flex;
  justify-content: center;
}

.login-container form .form-group {
  display: flex;
  flex-direction: column; /* Hace que los hijos directos de .form-group se muestren en el mismo nivel */
}

.form-column{
  padding: 0;
}

.login-container form .form-group input {
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%; /* Opcional: asegura que los inputs ocupen todo el ancho disponible */
  box-sizing: border-box; /* Asegura que el padding no aumente el ancho del input */
}

.login-container form button {
  margin: 5%;
}


.login-container form .error {
  color: red;
  grid-column: 1 / -1; /* Ocupa todas las columnas disponibles */
  text-align: center; /* Centra el texto */
}

.login-container form .success {
  color: green;
}



.form-group {
  margin-bottom: 15px;
}

.error {
  color: red;
}
</style>