import { AxiosResponse } from "axios"
import { apiHelper } from "../utils/apiHelper"

export const fetchMatch = async (id: string[]) => {
  try {
    const response: AxiosResponse<any, any> | undefined = await apiHelper({
      endpoint: "dogs",
      method: "POST",
      params: "",
      body: id,
    })
    return response
  } catch (error) {
    console.error("Error fetching matched dog", error)
  }
}
