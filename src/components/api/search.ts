import { AxiosResponse } from "axios"
import { apiHelper } from "../utils/apiHelper"
import type { DogSearch } from "../../types/types"

export const search = async (params: DogSearch) => {
  try {
    const response: AxiosResponse<any, any> | undefined = await apiHelper({
      endpoint: "dogs/search",
      method: "GET",
      params: params,
    })
    return response
  } catch (error) {
    console.error("Error during search fetch!", error)
  }
}
