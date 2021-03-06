import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      pokemonData: []
    }
  },
  getters: {
    pokemon(state) {
      return state.pokemonData;
    }
  },
  mutations: {
    setPokemon(state, payload) {
      state.pokemonData = payload;
    }
  },
  actions: {
    async loadPokemonData(context) {

      let response, responseData;
      response = await fetch(
        'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0'
      );
      responseData = await response.json();

      //if (!response.ok) { ... }

      let pokemonData = []
      for(const pokemonIndex in responseData.results) {
        const pokemon = {
          id: parseInt(pokemonIndex) + 1,
          name: responseData.results[pokemonIndex].name,
          url: responseData.results[pokemonIndex].url,
          abilities: [],
          imgUrl: null
        }
        pokemonData.push(pokemon);
      }
      for(const pokemonIndex in pokemonData) {
        response = await fetch(
          pokemonData[pokemonIndex].url // https://pokeapi.co/api/v2/pokemon/0/
        );
        responseData = await response.json();
        pokemonData[pokemonIndex].imgUrl = responseData.sprites.other.dream_world.front_default;
        for(const abilityIndex in responseData.abilities) {
          pokemonData[pokemonIndex].abilities.push(
            responseData.abilities[abilityIndex].ability.name
          )
        }
      }
      context.commit('setPokemon', pokemonData);
    }
  }
})

export default store;
