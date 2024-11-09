import axios from "axios";

// Cria uma instância personalizada do Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Define a URL base da API
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`, // Define a chave de API
  },
});

// Adicione o console.log para verificar as variáveis de ambiente
console.log("API URL:", import.meta.env.VITE_API_URL);
console.log("API Token:", import.meta.env.VITE_API_TOKEN);

// Interceptor de resposta para capturar erros
api.interceptors.response.use(
  response => response.data,
  error => {
    // Captura erros e evita exibir detalhes sensíveis no console
    if (error.response && error.response.status === 401) {
      console.error('Erro de autorização: chave de API inválida ou expirada.');
    } else {
      console.error('Erro ao fazer a requisição:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
