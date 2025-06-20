import axios, { type AxiosResponse } from "axios";

class GenericRequest {
  async Get<T>(url: string): Promise<AxiosResponse<T>> {
    try {
      const response = await axios.get<T>(
        `${import.meta.env.VITE_URL_API}/${url}`
      );
      return response;
    } catch (error) {
      console.error("Error en la solicitud GET:", error);
      throw error;
    }
  }
}

const GenericsRequests = new GenericRequest();
export default GenericsRequests;