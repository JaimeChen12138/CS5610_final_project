const Schema = require("mongoose").Schema;

exports.PokemonSchema = new Schema(
  {
    name: String,
    len: {
      type: Number,
    },

    password: {
      type: String,
    },
    owner: {
      type: String,
    },
    lastUpdated: {
      type: Date,
    },
  },
  { collection: "myPokemonSpr2023" }
);
