import MoviesService from "@/services/MoviesService";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { useEffect, useState } from "react";
import { ErrorDialog } from "./error-dialog";
import { Loading } from "./loading";
import { InfoIcon } from "lucide-react";
import { Button } from "./ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { WatchProviderList } from "./watch-provider-list";

export const WatchProviders = ({ id }) => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getWatchProviders(id)
      .then((data) => {
        setProviders(data.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <Loading transparent={true} />;
  }

  if (error) {
    return (
      <ErrorDialog
        error={error}
        title="Erro ao buscar provedores de streaming"
      />
    );
  }

  if (!providers || (!providers.flatrate && !providers.buy && !providers.rent)) {
    return null;
  }

  return (
    <div className="mt-8">
      <Collapsible>
        <CollapsibleTrigger>
          <h1 className="text-text text-2xl font-bold flex items-center">
            Onde assistir?
            <Button variant="ghost" size="sm">
              <CaretSortIcon className="h-6 w-6" />
              <span className="sr-only">Toggle</span>
            </Button>
            <a
              href="https://www.justwatch.com/"
              target="_BLANK"
              className="text-gray-600 font-normal hover:text-gray-700 text-base"
            >
              JustWatch <InfoIcon className="inline-block w-4" />
            </a>
          </h1>
        </CollapsibleTrigger>
        <WatchProviderList watchProviders={providers.flatrate} tag="Assinatura" />
        {isEqual(providers.buy, providers.rent) ? (
          <CollapsibleContent>
            <WatchProviderList watchProviders={providers.buy} tag="Comprar / Alugar" />
          </CollapsibleContent>
        ) : (
          <>
            <CollapsibleContent>
                <WatchProviderList watchProviders={providers.buy} tag="Comprar" />
            </CollapsibleContent>
            <CollapsibleContent>
                <WatchProviderList watchProviders={providers.rent} tag="Alugar" />
            </CollapsibleContent>
          </>
        )}
      </Collapsible>
    </div>
  );
};

const isEqual = (a, b) => {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!isEqual(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }

  if (
    typeof a === "object" &&
    typeof b === "object" &&
    a !== null &&
    b !== null
  ) {
    let aProps = Object.getOwnPropertyNames(a);
    let bProps = Object.getOwnPropertyNames(b);

    if (aProps.length !== bProps.length) return false;
    for (let i = 0; i < aProps.length; i++) {
      let propName = aProps[i];
      if (!isEqual(a[propName], b[propName])) {
        return false;
      }
    }
    return true;
  }
  return a === b;
};

const getWatchProviders = async (id) => {
  return await MoviesService.getWatchProviders(id);
};
