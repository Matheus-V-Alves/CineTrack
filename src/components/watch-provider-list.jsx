import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const WatchProviderList = ({ watchProviders, tag }) => {
  if (!watchProviders) {
    return <p className="text-text font-bold"> {tag + ' Indisponível'}</p>;
  }

  return (
    <>
      <p className="text-text font-bold"> {tag}</p>
      <div className="flex items-center flex-wrap gap-4 my-2">
        {watchProviders.map((provider) => (
          <TooltipProvider key={provider.provider_id}>
            <Tooltip>
              <TooltipTrigger>
                {" "}
                <img
                  src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                  alt={provider.provider_name}
                  className="w-16 rounded-2xl hover:scale-105"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{provider.provider_name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}{" "}
      </div>
    </>
  );
};
