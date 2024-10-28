<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/valid-template-root -->
<template>
  <User />
  <p v-if="decodedToken">Token décodé : {{ decodedToken }}</p>
  <p v-else>Aucun token décodé.</p>
</template>

<script>
import { computed } from 'vue'; 
import { useStore } from 'vuex'; // Importer useStore pour accéder au store
import User from '@/components/User.vue';

export default {
  components: {
    User, 
  },

  setup() {
    const store = useStore(); // Accéder au store Vuex

    // Utiliser le getter getToken pour obtenir le token décodé
    const decodedToken = computed(() => store.getters.getToken.user_id);

    console.log(decodedToken.value); // Affiche la valeur décodée dans la console

    return {
      decodedToken, // Retourner decodedToken pour l'utiliser dans le template
    };
  },
};
</script>
