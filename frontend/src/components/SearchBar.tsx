import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string, type: string, city: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [city, setCity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, type, city);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 mb-6">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="İsim ara..."
        className="border rounded px-3 py-2"
      />
      <select value={type} onChange={e => setType(e.target.value)} className="border rounded px-3 py-2">
        <option value="">Tür</option>
        <option value="DOG">Köpek</option>
        <option value="CAT">Kedi</option>
        <option value="BIRD">Kuş</option>
        <option value="OTHER">Diğer</option>
      </select>
      <input
        type="text"
        value={city}
        onChange={e => setCity(e.target.value)}
        placeholder="Şehir ara..."
        className="border rounded px-3 py-2"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Ara</button>
    </form>
  );
};

export default SearchBar;