import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { SearchContext } from "../context/SearchContext";
import { Search } from "lucide-react";
import { Button } from "./ui/button";

export const Header = () => {
  const { setSearchTerm } = useContext(SearchContext); // Usando o contexto
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate(); // Hook para redirecionar

  const handleSearchInput = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    setSearchTerm(inputValue); // Atualiza o termo de busca no contexto
    navigate("/search"); // Redireciona para a página de busca
  };

  return (
    <header className="flex bg-secondary p-2 px-6 lg:justify-between gap-4 flex-col lg:flex-row">
      <div className="flex items-center">
        <Link to={"/"} className="flex items-center">
          {" "}
          <img
            src="/icon.png"
            alt="Ícone do app"
            className="drop-shadow-[0_4px_4px_rgba(0,0,0,0.75)] size-16"
          />
          <p className="text-text font-bold text-3xl">Moovie</p>
        </Link>
      </div>
      <div className="flex mb-2 lg:my-2">
        <input
          type="text"
          placeholder="Pesquisar"
          value={inputValue}
          id="search"
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleSearchInput}
          className="bg-background text-text p-2 px-4 rounded-l-lg w-full lg:min-w-80 peer focus:outline-none focus:border focus:border-text"
        />
        <label
          htmlFor="search"
          className="flex items-center bg-background text-text p-2 rounded-r-lg cursor-pointer peer-focus:border peer-focus:border-text"
          onClick={handleSearch}
        >
          <Search />
        </label>
      </div>
    </header>
  );
};
