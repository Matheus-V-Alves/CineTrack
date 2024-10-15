import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const NotFound = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (count === 0) {
    navigate("/");
  }

  return (
    <>
      <div className="flex flex-col bg-background justify-center items-center h-screen">
        <h1 className="text-4xl text-text">Página não encontrada</h1>
        <p className="text-text text-xl">Você será redirecionado em {count} segundos</p>
      </div>
    </>
  );
};
