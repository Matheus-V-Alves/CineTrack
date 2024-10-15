export const Loading = ({transparent=false}) => {
  return (
    <div className={`flex flex-1 flex-grow justify-center items-center h-full ${transparent ? 'bg-transparent' : 'bg-background'}`}>
    <div className={`animate-spin rounded-full size-16 border-y-4 border-secondary`}></div>
    </div>
  );
};
