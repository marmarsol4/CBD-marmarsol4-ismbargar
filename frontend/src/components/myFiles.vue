<script>
import { ref, onMounted, onUnmounted, nextTick  } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {       
    
    const myFiles = ref([]);
    const currentUser = ref(null);
    const selectedFilePerms = ref(null);
    const router = useRouter();
    const showSidebar = ref(false);
    const showSharedPopup = ref(false);
    const formattedDate = ref(null);
    const mode = ref(null);
    const selectedFile = ref(null);
    const isModalOpened = ref(false);
    const shareWith = ref(null);
    const sharePerm = ref(null);
    const modalElement = ref(null);

    const openModal = () => {
      isModalOpened.value = true;
    };
    const closeModal = () => {
      isModalOpened.value = false;
    };

    const submitHandler = ()=>{
      //here you do whatever
    }

    const toggleSharedPopup = () => {
      showSharedPopup.value = !showSharedPopup.value
    }

    const toggleSidebar = () => {
      showSidebar.value = !showSidebar.value;
    }

    const selectFile = async (file) => {
      showSidebar.value = true;
      selectedFile.value = file;
      selectedFilePerms.value = await verifyPerms(file, currentUser.value);
    }

    const closeSidebar = (event) => {
      const sidebar = document.querySelector('.sidebar');
      const modal = document.querySelector('.modal');
      const fileContainers = Array.from(document.querySelectorAll('.file-container'));
      const selectedFile = fileContainers.some(fileContainer => fileContainer.contains(event.target));
      if (sidebar && !sidebar.contains(event.target) && !modal && !selectedFile ) {
        showSidebar.value = false;
      }
    };

    const formatDate = (date) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
      return new Date(date).toLocaleDateString('es-ES', options);
    }

    const deleteFile = async (file) => {
      try {
        const confirmDelete = confirm("¿Estás seguro de que deseas eliminar este archivo?");
        if (!confirmDelete) return;
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/file', {
          body: JSON.stringify({ id: file._id }),
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: "include",
        });
        if (response.ok) {
          selectedFile.value = null;
          toggleSidebar();
          getMyFiles();
        }
      } catch (error) {
        console.log(error);
      }
    }

    const toggleLike = async (file) => {
      try {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/file/like', {
          body: JSON.stringify({ fileId: file._id }),
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: "include",
        });
        if (response.ok) {
          await getMyFiles();
        }else if (response.status === 401) {
          router.push({ name: 'login' });
        }
      } catch (error) {
        console.log(error);
      }
    }

    const verifyPerms = async (file, user) => {
      if (file.owner._id === user._id) {
        return 'owner';
      } 
      const perm = await file.sharedWith.find(x => x.user._id === user._id)
      if (perm) {
        return perm.perm;
      } else {
        return 'none';
      }
    }

    const changePerms = async (perm, username) => {
      try { 
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/file', {
          body: JSON.stringify({ username: username, fileId: selectedFile.value._id, perm: perm }),
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: "include",
        });
        if (response.ok) {
          await getMyFiles();
          selectedFile.value = myFiles.value.find(file => file._id === selectedFile.value._id);
        }
      } catch (error) {
        console.log(error);
      }
    }

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
          selectedFile.value = null;
          getMyFiles();
        }
      } catch (error) {
        console.log(error);
      }
    }

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
        } else if (response.status === 401){
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
        currentUser.value = data.currentUser;
        mode.value = data.mode;
        if (!data.files) return;
        const favs = await data.files.filter(file => currentUser.value.favorites.includes(file._id))
        const nofavs = await data.files.filter(file => !currentUser.value.favorites.includes(file._id))
        
        myFiles.value = [];
        myFiles.value.push(...favs);
        myFiles.value.push(...nofavs);

      } catch (error) {
        if (error.status === 401) {
          router.push({ name: 'login' });
        }
        console.log(error);
      }
    }

    const translatePerm = (perm) => {
      switch (perm) {
        case 'owner':
          return 'Propietario';
        case 'write':
          return 'Escritura';
        case 'read':
          return 'Lectura';
        case 'view':
          return 'Vista';
        default:
          return 'Ninguno';
      }
    }
    

    onMounted(() => {
      getMyFiles();
      document.addEventListener('click', closeSidebar);
    });

    onUnmounted(() => {
      document.removeEventListener('click', closeSidebar);
    });
    
    return {
      myFiles,
      showSidebar,
      showSharedPopup,
      selectedFile,
      selectedFilePerms,
      formattedDate,
      currentUser,
      mode,
      isModalOpened,
      shareWith,
      sharePerm,
      openModal,
      closeModal,
      submitHandler,
      changeMode,
      changePerms,
      getMyFiles,
      selectFile,
      toggleSidebar,
      toggleSharedPopup,
      toggleLike,
      formatDate,
      deleteFile,
      verifyPerms,
      logout,
      translatePerm,
    }
  }
}   
</script>
 
<template>
  <div style="display:flex; justify-content: center; align-items: center;"><h1 style="margin-right:10px ;">Tus archivos</h1> <button style="margin-left: 10px" @click="logout"><span class="material-symbols-outlined">logout</span></button></div>
  <div style="display:flex; flex-direction: column; align-items: center;">
    <div style="display: flex; justify-content: space-between; width:85%;">
      <span> Modo actual: {{ mode }}<button @click="changeMode(mode)" style="margin-left: 20px;"><span class="material-symbols-outlined">sync</span></button></span>
      <button><span class="material-symbols-outlined">add</span></button>
      
    </div>
    <div class="container">
    <div class="files-container">
      <div class="file-container" v-for="file in myFiles" :key="file.id" @click="selectFile(file)">
        <img class="file-img" :src="'/files/'+file.contentType.toLowerCase()+'.png'" alt="file.filename" width="100" height="100"  onerror="this.onerror=null;console.log(this.src);this.src='files/default.png';"> 
        <div style="display:flex; align-items: center;">
          <p class="filename">{{ file.filename }} </p>
          <span v-if="currentUser?.favorites.includes(file._id)" class="material-symbols-outlined filledHeart">favorite</span>
        </div>
      </div>
    </div>
    
    <div class="sidebar-overlay" v-if="showSidebar && selectedFile" @click="closeSidebar"></div>
      <div class="sidebar" :class="{ 'show': showSidebar }">
        <ul>
          <li>Archivo: {{ selectedFile?.filename }}</li>
          <li>Autor: {{ selectedFile?.owner.username }} ({{ selectedFile?.owner.email }})</li>
          <li>Fecha de subida: {{ formatDate(selectedFile?.uploadDate)}}</li>

          <li style="display: inline-flex; justify-content: space-around; width: 90%;">
            <button v-if="['owner'].includes(selectedFilePerms)" @click="openModal"><span class="material-symbols-outlined">groups</span></button>
            <button v-if="['owner','write','read'].includes(selectedFilePerms)"><span class="material-symbols-outlined">download</span></button>
            <button @click="toggleLike(selectedFile)">
              <span v-if="!currentUser?.favorites.includes(selectedFile?._id)" class="material-symbols-outlined">favorite</span>
              <span v-else class="material-symbols-outlined filledHeart">favorite</span>
            </button>
            <button v-if="['owner','write'].includes(selectedFilePerms)" @click="deleteFile(selectedFile)"><span class="material-symbols-outlined">delete</span></button>
          </li>
        </ul>
      </div>
    </div>

    <Modal class="modal" ref="modalElement" :isOpen="isModalOpened" @modal-close="closeModal" @submit="submitHandler" name="first-modal">
      <template #header><strong>Compartir</strong></template>
      <template #content>
        <p>Compartido con:</p>
        <div style="display:flex; flex-direction: column; justify-content: center; align-items: center; border: 10px white;width: 90%">
          <div v-for="shared in selectedFile?.sharedWith" :key="shared.user._id" style="width: 90%; justify-content: center; align-items: center;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="flex-grow: 1; display:flex; justify-content: end;">{{ shared.user.username }}</div>
              <div style="margin: 0 5px;">-</div>
              <div>{{shared.perm === "view"?'&nbsp;&nbsp;&nbsp;':""}} {{ translatePerm(shared.perm) }}</div>
              <span class="material-symbols-outlined" @click="changePerms('none',shared.user.username)" style="color:red; margin-left:5px; cursor:pointer;">close</span>
            </div>
          </div>

        </div>
      </template>
      <template #footer>
        <div style="margin-top:20px">
          <input type="text" v-model="shareWith" placeholder="Compartir con..." style="margin-right:5px"/>
          <select v-model="sharePerm">
            <option value="view">Vista</option>
            <option value="read">Lectura</option>
            <option value="write">Escritura</option>
          </select>
          <button @click="changePerms(sharePerm, shareWith)" style="margin-top:10px">Compartir</button>
        </div>
      </template>
    </Modal>

  </div>
</template>

<style scoped>

.container {
  display: flex;
  align-items: center;
}
.files-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  flex-wrap: wrap;
}

.file-container {
  margin: 10px;
  padding: 10px;
  border: 1px solid #C8B1E4;
  border-radius: 10px;
  width: 150px;
  height: auto;
}

.file-img {
  margin-bottom: 10px;
  justify-self: flex-start;
}
.filename {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  width: 100%;
  margin: 0;
}

.sidebar {
  width: 300px;
  height: 100vh;
  height: 100%;
  background-color: #2F184B;
  transition: right 0.3s ease;
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
  overflow-x: hidden;
}

.sidebar {
  position: fixed;
  top: 0;
  right: -300px;
  width: 300px;
  height: 100%;
  background-color: #2F184B;
  transition: right 0.3s ease;
}

.sidebar.show {
  right: 0;
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
  display: block;
}

.material-symbols-outlined {
  font-variation-settings:
  'FILL' 0,
  'wght' 400,
  'GRAD' 0,
  'opsz' 24
}

.filledHeart {
  font-variation-settings:
  'FILL' 1
}

</style>