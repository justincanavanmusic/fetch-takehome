import { AxiosResponse } from "axios"
import { apiHelper } from "../utils/apiHelper"
import { DogLocationSearch } from "../../types/types"

export const searchByLocation = async (params: DogLocationSearch) => {
  try {
    const response: AxiosResponse<any, any> | undefined = await apiHelper({
      endpoint: "locations/search",
      method: "POST",
      params: "",
      body: params,
    })
    return response
  } catch (error) {
    console.error("Error during location search!")
  }
}
