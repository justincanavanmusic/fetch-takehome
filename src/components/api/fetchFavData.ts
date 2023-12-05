import { AxiosResponse } from "axios"
import { apiHelper } from "../utils/apiHelper"

export const fetchFavDogObjs: (
  ids: string[]
) => Promise<AxiosResponse<any, any> | undefined> = async (ids: string[]) => {
  try {
    const response: AxiosResponse<any, any> | undefined = await apiHelper({
      endpoint: "dogs",
      method: "POST",
      params: "",
      body: ids,
    })

    return response
  } catch (error) {
    console.error("Error during favorite dog fetch", error)
  }
}
