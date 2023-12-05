import { AxiosResponse } from "axios"

export const responseCheck = (response: AxiosResponse<any, any>) => {
  if (response.status === 200) {
    return true
  } else {
    console.error("Response is invalid, here's the status:", response.status)
    return false
  }
}
