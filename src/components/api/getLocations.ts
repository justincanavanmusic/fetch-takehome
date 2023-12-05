import { AxiosResponse } from "axios"
import { apiHelper } from "../utils/apiHelper"

export const fetchLocationData: (
  zipCodes: string[]
) => Promise<AxiosResponse<any, any> | undefined> = async (
  zipCodes: string[]
) => {
  try {
    const response: AxiosResponse<any, any> | undefined = await apiHelper({
      endpoint: "locations",
      method: "POST",
      params: "",
      body: zipCodes,
    })
    return response
  } catch (error) {
    console.error("Error fetching locations!", error)
  }
}
