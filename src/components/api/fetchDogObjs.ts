import { AxiosResponse } from "axios"
import { apiHelper } from "../utils/apiHelper"

export const fetchDogObjs: (
  ids: string[]
) => Promise<AxiosResponse<any, any> | undefined> = async (ids: string[]) => {
  let idsArr: string[]

  if (ids.length > 100) {
    idsArr = ids.slice(0, 100)
  } else {
    idsArr = ids
  }

  try {
    const response: AxiosResponse<any, any> | undefined = await apiHelper({
      endpoint: "dogs",
      method: "POST",
      params: "",
      body: idsArr,
    })
    return response
  } catch (error) {
    console.error("Couldn't fetch dog objects", error)
  }
}
