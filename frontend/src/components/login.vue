<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  
    setup() {  

    const user = ref({
        username: '',
        password: '',
    });

    const router = useRouter();

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
            if (response.status === 200) {
              router.push('/');
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
  <div class="container">
    <div class="login-container">
      
    <h2><span class="gradient-text">Inicio de sesión</span></h2>
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
        <button type="submit">Iniciar Sesión</button>
      </div>
      <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </div>
  <div>
    ¿No tienes cuenta? <button type="button" @click="$router.push('/register')" style="margin:2%;">Regístrate</button>
  </div>
</template>

<style scoped>
.login-container {
  padding: 2%;
  max-width: 40vw;
  width: 100%;
  border: 3px solid transparent;
  border-image: linear-gradient(90deg, #646cff, #C8B1E4);
  border-image-slice: 1;
}

.login-container form{
  display: flex;
  flex-direction: column;
  place-items: center;
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
  background-color: #f9f9f9;
  border: 1px solid #f9f9f9;
  color: black;
  width: 100%; /* Opcional: asegura que los inputs ocupen todo el ancho disponible */
  box-sizing: border-box; /* Asegura que el padding no aumente el ancho del input */
}

.login-container form button {
  margin: 5% 0;
}

.login-container form .error {
  grid-column: 1 / -1;
  text-align: center;
  width: fit-content;
  background-color: rgb(151, 47, 47);
  border-radius: 10px;
  padding: 1px 10px;
}

.login-container form .success {
  width: fit-content;
  background-color: rgb(29, 100, 29);
  border-radius: 10px;
  padding: 1px 10px;
}

.form-group {
  margin-bottom: 15px;
}

.error {
  text-align: center;
  width: fit-content;
  background-color: rgb(151, 47, 47);
  border-radius: 10px;
  padding: 1px 10px;
}

</style>