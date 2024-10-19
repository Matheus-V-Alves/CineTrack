import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
  import MoviesService from "@/services/MoviesService";
  import { Label } from "@/components/ui/label";
  import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
  import { Filter } from "lucide-react";
  import { useEffect, useState } from "react";
  import { Checkbox } from "./ui/checkbox";
  import { Button } from "./ui/button";
  
  export const SearchFilters = ({ aplicarFiltros }) => {
    const [genres, setGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedRating, setSelectedRating] = useState("");
  
    useEffect(() => {
      getGenres().then((response) => {
        setGenres(response.data.genres);
      });
    }, []);
  
    const handleGenreClick = (checked, genreId) => {
      if (checked) {
        setSelectedGenres((prevGenres) => [...prevGenres, genreId]);
      } else {
        setSelectedGenres((prevGenres) => prevGenres.filter((g) => g !== genreId));
      }
    };
  
    const handleRatingChange = (value) => {
      setSelectedRating(value);
    };
  
    const handleClearFilters = () => {
      setSelectedGenres([]);
      setSelectedRating("");
    };
  
    const handleFilter = (event) => {
      event.preventDefault();
      const filtros = {
        generos: selectedGenres,
        nota: selectedRating,
      };
      aplicarFiltros(filtros);
    };
  
    return (
      <Dialog>
        <DialogTrigger>
          <div>
            <button className="flex flex-col items-center mr-2">
              <Filter size="2em" />
              <p>Filtros</p>
            </button>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filtros</DialogTitle>
            <DialogDescription>
              Selecione os filtros que deseja aplicar à sua busca
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-4" onSubmit={handleFilter}>
            <div>
              <h2 className="font-medium text-lg">Gêneros</h2>
              <div className="grid grid-cols-3 gap-1">
                {genres.map((genre) => (
                  <div key={genre.id} className="flex items-center gap-1">
                    <Checkbox
                      id={genre.id}
                      onCheckedChange={(checked) => handleGenreClick(checked, genre.id)}
                      checked={selectedGenres.includes(genre.id)}
                    />
                    <Label htmlFor={genre.id}>{genre.name}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-medium text-lg">Notas</h2>
              <div className="flex gap-4 mt-2">
                <RadioGroup
                  className="flex gap-6"
                  onValueChange={handleRatingChange}
                  value={selectedRating}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="<5" id="<5" />
                    <Label htmlFor="<5">Abaixo de 5</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="5+" id="5+" />
                    <Label htmlFor="5+">5+</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="7+" id="7+" />
                    <Label htmlFor="7+">7+</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </form>
          <DialogFooter>
            <Button onClick={handleClearFilters}>Limpar filtros</Button>
            <Button onClick={handleFilter}>Aplicar filtros</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  
  const getGenres = async () => {
    return await MoviesService.getGenres();
  };
  