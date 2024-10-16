import { useContext, useEffect, useState } from "react";
import { SearchContext } from "../context/SearchContext";
import moviesService from "@/services/MoviesService";
import { MovieCard } from "@/components/movie-card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

function Search() {
  const { searchTerm } = useContext(SearchContext);
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (searchTerm) {
      fetchMovies(searchTerm, currentPage);
    }
  }, [searchTerm, currentPage]);

  const fetchMovies = (searchTerm, page) => {
    moviesService.searchMovies(searchTerm, page).then((query) => {
      console.log("Filmes encontrados:", query.data.results);
      console.log("Página:", query.data.page);
      console.log("Total de páginas:", query.data.total_pages);
      setMovies(query.data.results);
      setTotalPages(query.data.total_pages); // Atualiza o total de páginas
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page); // Atualiza a página atual
  };

  const renderPaginationItems = () => {
    const pages = [];
    const maxPagesToShow = 2; // Define quantas páginas ao redor da atual você quer mostrar

    // Adiciona a primeira página com elipses, se necessário
    if (currentPage > maxPagesToShow + 1) {
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
        </PaginationItem>
      );
      if (currentPage > maxPagesToShow + 2) {
        pages.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // Páginas próximas à atual
    for (
      let i = Math.max(1, currentPage - maxPagesToShow);
      i <= Math.min(totalPages, currentPage + maxPagesToShow);
      i++
    ) {
      pages.push(
        <PaginationItem key={i} active={i === currentPage}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            className={i === currentPage ? "bg-secondary select-none cursor-pointer" : "select-none cursor-pointer"}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Adiciona a última página com elipses, se necessário
    if (currentPage < totalPages - maxPagesToShow) {
      if (currentPage < totalPages - maxPagesToShow - 1) {
        pages.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  if (!searchTerm) {
    return (
      <div className="flex flex-col flex-1 flex-grow bg-background text-text justify-center items-center min-h-screen py-8">
        <h1 className="mb-4 text-2xl">Digite algo para pesquisar</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 flex-grow bg-background text-text justify-center items-center min-h-screen py-8">
      {movies.length === 0 ? (
        <p className="text-2xl font-medium">Nenhum filme encontrado ({searchTerm})</p>
      ):(
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} id={movie.id} />
        ))}
      </div>
      )}
      {movies.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        >
          <PaginationContent>
            {/* Botão Anterior */}
            <PaginationItem disabled={currentPage === 1}>
              <PaginationPrevious className={currentPage === 1 ? "cursor-not-allowed hover:bg-background select-none" : "select-none cursor-pointer"}
                    onClick={() => {
                      if (currentPage > 1) handlePageChange(currentPage - 1);
                    }}
              />
            </PaginationItem>

            {/* Renderização das páginas */}
            {renderPaginationItems()}

            {/* Botão Próximo */}
            <PaginationItem disabled={currentPage === totalPages}>
              <PaginationNext className={currentPage === totalPages ? "cursor-not-allowed hover:bg-background select-none" : "select-none cursor-pointer"}
                onClick={() => {
                  if (currentPage < totalPages) handlePageChange(currentPage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

export default Search;
