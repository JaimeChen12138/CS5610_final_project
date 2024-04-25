const mongoose = require("mongoose");

const PokemonSchema = require("./pokemon.schema").PokemonSchema;

const PokemonModel = mongoose.model("PokemonModel", PokemonSchema);

function createPokemon(pokemon) {
  return PokemonModel.create(pokemon);
}

function returnAllPokemon() {
  return PokemonModel.find().exec();
}

function getPokemonById(id) {
  return PokemonModel.findById(id).exec();
}

function findPokemonByColor(pokeColor) {
  return PokemonModel.find({ password: pokeColor }).exec();
}

function findPokemonByOwner(username) {
  return PokemonModel.find({ owner: username }).exec();
}

function deletePokemon(pokemonId) {
  return PokemonModel.deleteOne({ _id: pokemonId }).exec();
}

function findPokemonByUsername(username) {
  return PokemonModel.find({ username: username }).exec();
}

module.exports = {
  createPokemon,
  returnAllPokemon,
  getPokemonById,
  findPokemonByColor,
  deletePokemon,
  findPokemonByUsername,
  findPokemonByOwner,
};
