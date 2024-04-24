<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
export default {
  setup() {       
    
    const myFiles = ref([]);
    const router = useRouter();

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

    onMounted(() => {
      getMyFiles();
    });

    return {
      myFiles,
      getMyFiles,
      logout
    }
  }
}   
</script>
 
<template>
  <div>
    <h1>My Files</h1>
    
    <div v-for="file in myFiles" :key="file.id">
      <p>{{'files/'+file.contentType.toLowerCase()+'.png'}}</p>
       <img :src="'/files/'+file.contentType.toLowerCase()+'.png'" alt="file.filename" width="100" height="100"  onerror="this.onerror=null;console.log(this.src);this.src='https://i.pinimg.com/736x/dd/18/b3/dd18b311f3ceaa8579f5c420ead9b4a1.jpg';"> 
       <!--this.src='files/default.png';" -->
      <p>{{ file.filename }}</p>
    </div>
    <button @click="logout">Logout</button>
  </div>
</template>

<style>

</style>