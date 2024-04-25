<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
export default {
  setup() {       
    
    const myFiles = ref([]);
    const router = useRouter();
    const showSidebar = ref(true);
    const formattedDate = ref(null);
    ///const selectedFile = ref(null);
    const selectedFile = ref({
            "_id": "662a8267ecbd1a33e33aff24",
            "length": 910440,
            "chunkSize": 261120,
            "uploadDate": "2024-04-25T16:18:47.341Z",
            "filename": "PAI-3-VPNSSLRoadWarrior-Especificacion.pdf",
            "contentType": "pdf",
            "owner": {
                "_id": "662a789aecbd1a33e33aff23",
                "username": "admin",
                "email": "ismbargar@alum.us.es",
                "password": "$2b$10$3Ujg0ZlgdhNmD3isyDKJuOdKwAAs5DBb46OdcQLDErZ9FuDl5E7Ii",
                "favorites": []
            },
            "sharedWith": []
        });

    const toggleSidebar = () => {
      showSidebar.value = !showSidebar.value;
    }

    const selectFile = (file) => {
      showSidebar.value = true;
      selectedFile.value = file;
    }

    const closeSidebar = (event) => {
      const sidebar = document.querySelector('.sidebar');
      const fileContainers = Array.from(document.querySelectorAll('.file-container'));
      const selectedFile = fileContainers.some(fileContainer => fileContainer.contains(event.target));
      
      if (sidebar && !sidebar.contains(event.target) && !selectedFile ) {
        showSidebar.value = false;
      }
    };

    onMounted(() => {
      getMyFiles();
      document.addEventListener('click', closeSidebar);
    });

    onUnmounted(() => {
      document.removeEventListener('click', closeSidebar);
    });
    
    const logout = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: "include",
        });
        if (response.ok) {
          router.push({ name: 'login' });
        }else if (response.status === 401){
          router.push({ name: 'login' });
        }
      } catch (error) {
        console.log(error);
      }
    }

    const getMyFiles = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/file', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: "include",
        });
        const data = await response.json();
        myFiles.value = data.files;
      } catch (error) {
        console.log(error);
      }
    }

    const formatDate = (date) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString('es-ES', options);
    }


    return {
      myFiles,
      showSidebar,
      selectedFile,
      formattedDate,
      getMyFiles,
      selectFile,
      toggleSidebar,
      formatDate,
      logout
    }
  }
}   
</script>
 
<template>
  <h1>My Files</h1>
  <div class="container">
  <div class="files-containter">
    <div class="file-container" v-for="file in myFiles" :key="file.id" @click="selectFile(file)">
       <img class="file-img" :src="'/files/'+file.contentType.toLowerCase()+'.png'" alt="file.filename" width="100" height="100"  onerror="this.onerror=null;console.log(this.src);this.src='files/default.png';"> 
       <!--this.src='https://i.pinimg.com/736x/dd/18/b3/dd18b311f3ceaa8579f5c420ead9b4a1.jpg';" -->
      <p class="filename">{{ file.filename }}</p>
    </div>
  </div>
  
  <div class="sidebar-overlay" v-if="showSidebar" @click="closeSidebar"></div>
    <div class="sidebar" :class="{ 'show': showSidebar }">
      <ul>
        <li>Archivo: {{ selectedFile.filename }}</li>
        <li>Autor: {{ selectedFile.owner.username }} ({{ selectedFile.owner.email }})</li>
        <li>Fecha de subida: {{ formatDate(selectedFile.uploadDate)}}</li>

        <li style="display: inline-flex; justify-content: space-between; width: 80%;">
          <button><span class="material-symbols-outlined">groups</span></button>
          <button><span class="material-symbols-outlined">download</span></button>
          <button><span class="material-symbols-outlined">delete</span></button>
        </li>
      </ul>
    </div>
  </div>
  <button @click="logout"><span class="material-symbols-outlined">logout</span></button>
</template>

<style scoped>

.container{
  display: flex;
  align-items: center;
}
.files-containter{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  flex-wrap: wrap;
}

.file-container{
  margin: 10px;
  padding: 10px;
  border: 1px solid black;
  border-radius: 10px;
  width: 150px;
  height: 150px;
}

.file-img{
  margin-bottom: 10px;
  justify-self: flex-start;
}

.filename{
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  text-wrap: wrap;
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.sidebar {
  width: 300px;
  height: 100vh;
  height: 100%;
  background-color: #2F184B;
  transition: right 0.3s ease; /* Transición suave al cambiar la propiedad right */
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: none;
}

.sidebar.show + .sidebar-overlay {
  display: block;
}

.sidebar ul {
  list-style-type: none; 
  padding: 0; 
}

.sidebar ul li {
  padding: 10px;
}

.container {
  position: relative;
  overflow-x: hidden; /* Para ocultar el desplazamiento horizontal cuando se mueve el contenido */
}

.sidebar {
  position: fixed;
  top: 0;
  right: -300px; /* Inicialmente fuera del área visible */
  width: 300px;
  height: 100%;
  background-color: #2F184B;
  transition: right 0.3s ease; /* Transición suave al cambiar la propiedad right */
}

.sidebar.show {
  right: 0; /* Mostrar la barra lateral */
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: none;
}

.sidebar.show + .sidebar-overlay {
  display: block; /* Mostrar el overlay cuando la barra lateral está abierta */
}

</style>