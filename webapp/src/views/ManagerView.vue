<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/valid-template-root -->
<template>
    <Manager />
    <!-- <p v-if="decodedToken">Token décodé : {{ decodedToken }}</p>
    <p v-else>Aucun token décodé.</p> -->
  </template>
  
  <script>
  import { computed } from 'vue'; 
  import { useStore } from 'vuex'; // Importer useStore pour accéder au store
  import Manager from '@/components/Manger.vue';
  
  export default {
    components: {
      Manager, 
    },
  
    // setup() {
    //   const store = useStore(); 
  
     
    //   const decodedToken = computed(() => store.getters.getToken.user_id);
  
    //   console.log(decodedToken.value); 
  
    //   return {
    //     decodedToken,
    //   };
    // },
  };
  </script>
  