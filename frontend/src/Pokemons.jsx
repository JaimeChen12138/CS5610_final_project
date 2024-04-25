import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { generatePath, Link } from "react-router-dom";
import "./Pokemons.css";

export default function Pokemons() {
  const [pokemons, setPokemons] = useState([]);
  const [pokemonInput, setPokemonInput] = useState({
    name: "",
    password: "",
    len: 0,
  });
  const [error, setError] = useState("");

  // **** add
  useEffect(() => {
    console.log("pokemonInput updated:", pokemonInput);
  }, [pokemonInput]);
  // ****

  async function getAllPokemons() {
    const response = await axios.get("/api/pokemon/");
    setPokemons(response.data);
  }

  const components = pokemons.map((pokemon) => (
    <div key={pokemon._id}>
      <Link to={"/pokemon/" + pokemon._id}>{pokemon.name}</Link>{" "}
      {pokemon.password} - {pokemon.len}
    </div>
  ));

  // const components = [];
  // for (let i = 0; i < pokemons.length; i++) {
  //   const pokemon = pokemons[i];
  //   const pokemonComponent = (
  //     <div>
  //       <Link to={"/pokemon/" + pokemon._id}>{pokemon.name}</Link>{" "}
  //       {pokemon.password} - {pokemon.len}
  //     </div>
  //   );
  //   components.push(pokemonComponent);
  // }

  function setPokemonName(event) {
    const pokemonName = event.target.value;
    setPokemonInput({
      ...pokemonInput,
      /*
            health: pokemonInput.health,
            color: pokemonInput.color,
            */
      name: pokemonName,
    });
  }

  function setPokemonColor(event) {
    const pokemonColor = event.target.value;
    setPokemonInput({
      ...pokemonInput,
      /*
            health: pokemonInput.health,
            name: pokemonInput.name,
            */
      password: pokemonColor,
    });
  }

  function setPokemonLength(event) {
    const curlength = event.target.value;
    setPokemonInput({
      ...pokemonInput,
      /*
            health: pokemonInput.health,
            color: pokemonInput.color,
            */
      len: curlength,
    });
  }

  /*
    element.setListener('input', function(event) {
        // do smething

    })
    */
  function generatePassword(length) {
    const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerCase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specialChars = "!@#$%^&*()-_=+[]{}|;:,.<>?";

    const allChars = upperCase + lowerCase + numbers + specialChars;

    let password = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allChars.length);
      password += allChars[randomIndex];
    }

    return password;
  }

  async function createNewPokemon() {
    // Basic validation
    if (!pokemonInput.name) {
      console.log("no name");
      setError("URLName is required !");
      return;
    }

    if (!pokemonInput.password) {
      if (!pokemonInput.len || pokemonInput.len < 4 || pokemonInput.len > 50) {
        console.log("invalid length");
        setError("the length should be between 4 and 50 and not empty");
        return;
      }

      const ps = generatePassword(pokemonInput.len);
      console.log("generating password");
      console.log(ps);

      const updatedPokemonInput = { ...pokemonInput, password: ps };

      console.log("Before POST, pokemonInput:", updatedPokemonInput);

      await axios.post("/api/pokemon/", updatedPokemonInput);

      setPokemonInput({
        name: "",
        password: "",
        len: 0,
      });
    } else {
      console.log("Password already provided, updating length");

      const updatedPokemonInput = {
        ...pokemonInput,
        len: pokemonInput.password.length,
      };

      await axios.post("/api/pokemon/", updatedPokemonInput);

      setPokemonInput({
        name: "",
        password: "",
        len: 0,
      });
    }

    await getAllPokemons();
  }

  // async function createNewPokemon() {
  //   if (!pokemonInput.name) {
  //     console.log("no name");
  //     setError("URLName is required !");

  //     return;
  //   } else if (!pokemonInput.password) {
  //     if (!pokemonInput.len || pokemonInput.len < 4 || pokemonInput.len > 50) {
  //       console.log("invalid length");
  //       setError("the length should be between 4 and 50 and not empty");
  //       return;
  //     }
  //     const ps = generatePassword(pokemonInput.len);

  //     console.log("generating password");
  //     console.log(ps);
  //     console.log("*************************");
  //     setPokemonInput((prevState) => ({
  //       ...prevState,
  //       password: ps,
  //     }));
  //   } else {
  //     console.log("Password already provided, updating length");
  //     setPokemonInput((prevState) => ({
  //       ...prevState,
  //       len: pokemonInput.password.length,
  //     }));
  //   }

  //   console.log("After updating password/len:", pokemonInput);
  //   setError("");
  //   const response = await axios.post("/api/pokemon/", pokemonInput);
  //   setPokemonInput({
  //     name: "",
  //     password: "",
  //     len: 0,
  //   });
  //   await getAllPokemons();
  // }

  return (
    <div className="main-container">
      {/* <Header /> */}
      <div className="password-list">{components}</div>

      <div>
        {error && <div className="error-message">{error}</div>}
        {/* Display error */}
        <div className="input-group">
          <span className="input-label">URLName:</span>
          <input
            className="input-field"
            value={pokemonInput.name}
            onInput={setPokemonName}
            type="text"
          ></input>
        </div>
        <div className="input-group">
          <span className="input-label">Password:</span>
          <input
            className="input-field"
            value={pokemonInput.password}
            onInput={setPokemonColor}
            type="text"
          ></input>
        </div>
        <div className="input-group">
          <span className="input-label">
            Length(Password's length used to generate random passowrd):
          </span>
          <input
            className="input-field"
            value={pokemonInput.len}
            onInput={setPokemonLength}
            type="number"
          ></input>
        </div>
        <div className="buttons">
          <button className="submit-button" onClick={createNewPokemon}>
            Submit New Password
          </button>
          <button className="fetch-button" onClick={getAllPokemons}>
            Click here to fetch all passwords
          </button>
        </div>
      </div>
    </div>
  );
}
