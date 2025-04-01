import { useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import './CharacterDetail.css';
import { useEffect, useState } from 'react';

const CharacterDetail = () => {
  const { id } = useParams();
  
  // Fetch character data
  const { data: character, loading: charLoading } = useFetch(
    `https://rickandmortyapi.com/api/character/${id}`
  );

  // Fetch origin details (if available)
  const { data: origin, loading: originLoading } = useFetch(
    character?.origin?.url
  );

  // Fetch location details
  const { data: location, loading: locLoading } = useFetch(
    character?.location?.url
  );

  // Fetch episodes
  const [episodes, setEpisodes] = useState<any[]>([]);
  useEffect(() => {
    if (character?.episode) {
      Promise.all(
        character.episode.slice(0, 5).map((url: string) => 
          fetch(url).then(res => res.json()))
      ).then(data => setEpisodes(data));
    }}, [character]);

  if (charLoading) return <p>Loading character...</p>;

  return (
    <div className="character-detail">
      {/* Header Section */}
      <div className="header">
        <img src={character.image} alt={character.name} />
        <div className="info">
          <h1>{character.name}</h1>
          <p>Status: {character.status}</p>
          <p>Species: {character.species}</p>
          <p>Gender: {character.gender}</p>
        </div>
      </div>

      {/* Origin/Location Section */}
      <div className="section">
        <h2>📍 Location Details</h2>
        <div className="grid">
          <div>
            <h3>Origin</h3>
            <p>{character.origin.name}</p>
            {origin && !originLoading && (
              <p>Dimension: {origin.dimension || "Unknown"}</p>)}
          </div>
          <div>
            <h3>Current Location</h3>
            <p>{character.location.name}</p>
            {location && !locLoading && (
              <>
                <p>Dimension: {location.dimension || "Unknown"}</p>
                <p>Residents: {location.residents?.length}</p>
              </>)}
          </div>
        </div>
      </div>

      {/* Episodes Section */}
      <div className="section">
        <h2>📺 Featured Episodes ({episodes.length})</h2>
        <ul className="episodes">
          {episodes.map((ep) => (
          <li key={ep.id}>
           {ep.episode} - {ep.name} (Aired: {ep.air_date})
          </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CharacterDetail;