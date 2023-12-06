import axios, { AxiosRequestConfig } from "axios"

function fixEndpoint(endpoint: string) {
  return endpoint.startsWith("/") ? endpoint : "/" + endpoint
}

function isValidBody(body: unknown) {
  //   console.log(body)
  return true
}

export async function apiHelper({
  endpoint,
  method = "GET",
  params,
  body,
}: {
  endpoint: string
  method?: "GET" | "POST"
  params?: unknown
  body?: unknown
}) {
  try {
    const baseUrl = "https://frontend-take-home-service.fetch.com"
    const options: AxiosRequestConfig = {
      method,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
      params,
    }
    const url = baseUrl + fixEndpoint(endpoint)

    if (body !== undefined) {
      //   if (!isValidBody(body)) {
      options.data = JSON.stringify(body)
      //   }
    }

    let response = await axios(url, options)

    return response
  } catch (error) {
    console.error("apiHelper not working", error)
  }
}
