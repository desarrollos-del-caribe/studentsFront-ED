import axios from "axios";
class GenericRequest {
  async Get(url: string) {
    try {
      const response = await axios.get(
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
