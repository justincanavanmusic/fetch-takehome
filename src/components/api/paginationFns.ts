import { AxiosResponse } from "axios"
import { apiHelper } from "../utils/apiHelper"

export const fetchNextPage: (
  nextParams: string
) => Promise<AxiosResponse<any, any> | undefined> = async (
  nextParams: string
) => {
  try {
    const response: AxiosResponse<any, any> | undefined = await apiHelper({
      endpoint: nextParams,
      method: "GET",
    })
    return response
  } catch (error) {
    console.error("Error during fetch request!", error)
    throw error
  }
}

export const fetchPrevPage: (
  prevParams: string
) => Promise<AxiosResponse<any, any> | undefined> = async (
  prevParams: string
) => {
  try {
    const response: AxiosResponse<any, any> | undefined = await apiHelper({
      endpoint: prevParams,
      method: "GET",
    })
    return response
  } catch (error) {
    console.error("Error during fetch request!", error)
    throw error
  }
}
