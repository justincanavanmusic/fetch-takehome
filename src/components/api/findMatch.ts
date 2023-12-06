import { AxiosResponse } from "axios"
import { apiHelper } from "../utils/apiHelper"

export const findMatch: (
  dogIds: string[]
) => Promise<AxiosResponse<any, any> | undefined> = async (
  dogIds: string[]
) => {
  try {
    const response: AxiosResponse<any, any> | undefined = await apiHelper({
      endpoint: "dogs/match",
      method: "POST",
      params: "",
      body: dogIds,
    })
    return response
  } catch (error) {
    console.error("Error fetching dog matches!", error)
  }
}
