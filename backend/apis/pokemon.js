const express = require("express");
const router = express.Router();
const PokemonModel = require("../db/pokemon/pokemon.model");
const jwt = require("jsonwebtoken");
const { CommandStartedEvent } = require("mongodb");

const pokemonDb = [
  {
    name: "pikachu",
    color: "yellow",
    health: 100,
  },
  {
    name: "charizard",
    color: "red",
    health: 200,
  },
  {
    name: "squirtle",
    color: "yellow",
    health: 150,
  },
];

// POST localhost:8000/api/pokemon/
router.post("/", async function (request, response) {
  // ***************************** 老得正确的
  const newPokemon = request.body;
  // console.log(request.cookies);
  newPokemon.owner = request.cookies.username;
  console.log(newPokemon.owner);

  try {
    const createPokemonResponse = await PokemonModel.createPokemon(newPokemon);
    // console.log(createPokemonResponse);
    return response.send(
      "Pokemon Successfully Created: " + createPokemonResponse
    );
  } catch (error) {
    return response.status(500).send(error);
  }
  // ***************************************
});

router.get("/", async function (request, res) {
  const username = request.cookies.username; // login username
  console.log(username);

  if (!username) {
    return res.status(400).send("Missing or invalid username cookie.");
  }

  try {
    const passwords = await PokemonModel.findPokemonByOwner(username); // Find by owner
    res.send(passwords);
  } catch (error) {
    console.error("Error retrieving passwords:", error);
    res.status(500).send("Internal Server Error");
  }
});

// http://localhost:8000/api/pokemon/pikachu
/*

    request.params = {
        name: pikachu
    }

*/
router.get("/:id", function (request, response) {
  const pokemonId = request.params.id;

  PokemonModel.getPokemonById(pokemonId)
    .then(function (dbResponse) {
      response.send(dbResponse);
    })
    .catch(function (error) {
      response.status(500).send(error);
    });
});

//http://localhost:8000/api/pokemon/find?color=yellow&size=large
/*
    req.query = {
        color: 'yellow',
        size: 'large',
    }
*/
router.get("/find", function (req, res) {
  const color = req.query.color;

  if (!color) {
    return res.send(pokemonDb);
  }

  const output = [];

  for (let pokemon of pokemonDb) {
    if (pokemon.color === color) {
      output.push(pokemon);
    }
  }

  res.send(output);
});

// http://localhost:8000 + /api/pokemon + /
router.get("/pikachu", function (req, res) {
  res.send("This is the pikachu");
});

router.get("/", function (req, res) {
  res.send("This is the the base pokemon route");
});

router.delete("/:pokemonId", async function (req, response) {
  const pokemonId = req.params.pokemonId;

  const deleteResponse = await PokemonModel.deletePokemon(pokemonId);
  return response.send("Successfully delete pokemon!");
});

router.post("/", function (req, res) {
  res.send("This is how you'll create new pokemon");
});

module.exports = router;
