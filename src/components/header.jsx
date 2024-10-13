import { Link } from "react-router-dom";

export const Header = () => {
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
      <div className="flex mb-2 lg:mb-0">
        <Link to={"/search"} className="flex items-center justify-center w-full">
        <input
          type="text"
          placeholder="Pesquisar"
          className="bg-background text-text p-2 rounded-lg w-full lg:min-w-80"
        />
        </Link>
      </div>
    </header>
  );
};
