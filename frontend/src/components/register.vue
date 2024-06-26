<script>
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {

    const user = ref({
      username: "",
      password: "",
      email: "",
    });

    const router = useRouter();
    const passwordMatch = ref("");
    const errorMessage = ref([]);
    const successMessage = ref("");
    const mode = ref('');

    onMounted(() => {
      getMode();
    });

    const getMode = async () =>{
      fetch(import.meta.env.VITE_BACKEND_URL + '/mode', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
      }).then(response => {
        if (response.ok) {
          response.json().then(data => {
            mode.value = data.mode;
          });
        }
      }).catch(error => {
        console.log(error);
      })
    }

    const register = () => {
      if (errorMessage.value.includes("Las contraseñas no coinciden")) {
        return;
      }
      errorMessage.value = [];
      fetch(import.meta.env.VITE_BACKEND_URL + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.value.username,
          password: user.value.password,
          email: user.value.email,
        }),
      })
        .then((response) => {
          if (response.status === 201) {
            successMessage.value = "Usuario registrado correctamente";
            setTimeout(() => {
              router.push("/login");
            }, 2000);
          } else {
            errorMessage.value = [];
            response.json().then((data) => {
              console.log(data);
              if (data.message) {
                errorMessage.value.push(...data.message);
                
              } else {
                data.errors.forEach((error) => {
                  errorMessage.value.push(error.msg);
                });
              }
            });
            throw new Error("Error al registrar");
          }
        })
        .catch((error) => {
          console.error(error);
        });
      };

    watch(passwordMatch, (value) => {
      if (value !== user.value.password && value !== "") {
        if (!errorMessage.value.includes("Las contraseñas no coinciden")) {
          errorMessage.value.unshift("Las contraseñas no coinciden");
        }
      } else {
        errorMessage.value = errorMessage.value.filter(
          (error) => error !== "Las contraseñas no coinciden"
        );
      }
    });

    const changeMode = async () => {
      try {
          const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/changeMode', {
          body: JSON.stringify({ mode: mode.value ==='mongoose'? 'MongoDB' : 'mongoose'}),
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: "include",
        });
    
        if (response.ok) {
          await getMode();
        }
      } catch (error) {
        console.log(error);
      }
    }

    return {
      user,
      passwordMatch,
      errorMessage,
      successMessage,
      mode,
      register,
      changeMode
    };
  },
};
</script>

<template>
  <div style="margin-bottom: 2%;">
    <span> Modo actual: {{ mode }}<button @click="changeMode(mode)" style="margin-left: 20px;"><span class="material-symbols-outlined">sync</span></button></span>
  </div>

  <div class="container">
    <div class="register-container">
      <h2><span class="gradient-text">Registro</span></h2>
      <form @submit.prevent="register">
        <p v-if="successMessage" class="success">{{ successMessage }}</p>
        <div class="form">
          <div class="form-column" style="margin-right: 2%">
            <div class="form-group">
              <label for="username">Usuario:</label>
              <input type="text" id="username" v-model="user.username" required/>
            </div>
            <div class="form-group">
              <label for="password">Contraseña:</label>
              <input
                type="password"
                id="password"
                v-model="user.password"
                required
              />
            </div>
          </div>

          <div class="form-column" style="margin-left: 2%">
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" id="email" v-model="user.email" required />
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirmar Contraseña:</label>
              <input
                type="password"
                id="confirmPassword"
                v-model="passwordMatch"
                required
              />
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: center">
          <button type="submit">Registrarse</button>
        </div>
        <div v-if="errorMessage.length !== 0" class="error">
          <p v-for="error in errorMessage">{{ error }}</p>
        </div>
      </form> 
    </div>
  </div>
  <div>
    ¿Ya tienes cuenta? <button type="button" @click="$router.push('/login')" style="margin: 2%">Iniciar Sesión</button>
  </div>
</template>

<style scoped>
.register-container {
  padding: 2%;
  max-width: 40vw;
  width: 100%;
  border: 3px solid transparent;
  border-image: linear-gradient(90deg, #646cff, #C8B1E4);
  border-image-slice: 1;
}

.register-container form {
  display: flex;
  flex-direction: column;
  place-items: center;
}

.register-container h2 {
  text-align: center;
}

.form {
  display: flex;
  justify-content: center;
}

.register-container form .form-group {
  display: flex;
  flex-direction: column;
}

.register-container form .form-group input {
  padding: 5px;
  border-radius: 5px;
  background-color: #f9f9f9;
  border: 1px solid #f9f9f9;
  color: black;
  width: 100%;
  box-sizing: border-box;
}

.register-container form button {
  margin: 5%;
}

.register-container form .error {
  grid-column: 1 / -1;
  text-align: center;
  width: fit-content;
  background-color: rgb(151, 47, 47);
  border-radius: 10px;
  padding: 1px 10px;
}

.register-container form .success {
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
  margin-top: 15px;
}

</style>