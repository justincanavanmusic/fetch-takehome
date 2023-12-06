import { AxiosResponse } from "axios"
import { apiHelper } from "../utils/apiHelper"

export const fetchDogBreeds = async () => {
  try {
    let response: AxiosResponse<any, any> | undefined = await apiHelper({
      endpoint: "dogs/breeds",
      method: "GET",
    })

    if (response) {
      if (response.status === 200) {
        return response.data
      } else {
        console.error("response", response)
      }
    }

  } catch (error) {
    console.error("Couldn't fetch dog breeds", error)
  }
}
