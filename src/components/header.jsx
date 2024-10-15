import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { SearchContext } from "../context/SearchContext";

export const Header = () => {
  const { setSearchTerm } = useContext(SearchContext); // Usando o contexto
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate(); // Hook para redirecionar

  const handleSearch = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      setSearchTerm(inputValue);
      navigate("/search"); // Redireciona para a página de busca
    }
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
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleSearch} // Captura a tecla Enter
          className="bg-background text-text p-2 rounded-lg w-full lg:min-w-80"
        />
      </div>
    </header>
  );
};
