import { useState, useEffect } from 'react';
import useFetch, { useFetchLocations } from '../hooks/useFetch';
import CharacterCard from '../components/CharacterCard';

const Home = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    gender: '',
    species: '',
    type: '',
    location: '' // New filter
  });

  // Fetch all locations
  const { locations } = useFetchLocations();

  // Fetch characters with filters
  const apiUrl = `https://rickandmortyapi.com/api/character/?page=${page}&name=${search}&status=${filters.status}&gender=${filters.gender}&species=${filters.species}&type=${filters.type}`;
  const { data, loading } = useFetch(apiUrl);

  // Filter characters by location if selected
  const filteredCharacters = filters.location
    ? data?.results?.filter((character: any) => 
        character.location.name.toLowerCase().includes(filters.location.toLowerCase())
      )
    : data?.results;

  return (
    <div>
      <div className='search-container'>
        <input 
          className='search-bar'
          type="text" 
          placeholder="Search characters..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      <div className="filters">
      <select onChange={(e) => setFilters({...filters, status: e.target.value})}>
          <option value="">All Status</option>
          <option value="alive">Alive</option>
          <option value="dead">Dead</option>
        </select>

        <select onChange={(e) => setFilters({...filters, gender: e.target.value})}>
          <option value="">All Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        
        {/* Location Filter Dropdown */}
        <select
          onChange={(e) => setFilters({...filters, location: e.target.value})}
        >
          <option value="">All Locations</option>
          {locations?.map((loc: any) => (
            <option key={loc.id} value={loc.name}>
              {loc.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid">
          {filteredCharacters?.map((character: any) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      )}
    </div>
  );
};


export default Home;