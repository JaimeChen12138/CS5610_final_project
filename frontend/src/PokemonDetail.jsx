import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

export default function PokemonDetail() {

    const [pokemonDetails, setPokemonDetails] = useState({});
    const navigate = useNavigate();
    const params = useParams()

    async function fetchAndSetPokemon() {
        const pokemonResponse = await axios.get('/api/pokemon/' + params.pokemonId)
        setPokemonDetails(pokemonResponse.data)
    }

    useEffect(function() {
        fetchAndSetPokemon()
    }, []);

    async function deletePokemon() {
        const response = await axios.delete('/api/pokemon/' + params.pokemonId)
        navigate('/');
    }

    // if(pokemonDetails.name) return (<div>Loading...</div>);

    return (
        <div>
            <div>Name: {pokemonDetails.name}</div>
            <div>Color: {pokemonDetails.color}</div>
            <div>Health: {pokemonDetails.health}</div>
            <button onClick={deletePokemon}>Delete Me!</button>
        </div>

    )


}