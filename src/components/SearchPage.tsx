import { useEffect, useState } from "react"
import type { Dog, Location } from "../types/types"
import { AxiosResponse } from "axios"
import { responseCheck } from "./utils/responseCheck"
import { fetchNextPage, fetchPrevPage } from "./api/paginationFns"
import { fetchFavDogObjs } from "./api/fetchFavData"
import { fetchDogBreeds } from "./api/fetchBreeds"
import { fetchDogObjs } from "./api/fetchDogObjs"
import { fetchLocationData } from "./api/getLocations"
import { searchByLocation } from "./api/searchByLocation"
import MatchedDog from "./MatchedDog"
import FavoriteDogs from "./FavoriteDogs"
import SearchInputs from "./SearchInputs"
import { DogsContext } from "./context/DogContext"
import DogSearch from "./DogSearch"
//NOTE: there was a CORS issue when sending an array of multiple zip codes so I took out the location filtering as it was only working for the first page (25 dogs). Once I used the "next" end point that was supplied is when I receieved the CORS errors.

const SearchPage: React.FC = () => {
  const [breedSearch, setBreedSearch] = useState<string>("")
  const [zipSearch, setZipSearch] = useState<string>("")
  const [ageMin, setAgeMin] = useState<number | string>("")
  const [ageMax, setAgeMax] = useState<number | string>("")
  const [filteredDogs, setFilteredDogs] = useState<Dog[]>([])
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [sortChoice, setSortChoice] = useState<string>("asc")
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [nextParams, setNextParams] = useState<string>("")
  const [prevParams, setPrevParams] = useState<string>("")
  const [total, setTotal] = useState<number>(0)
  const [favoriteDogsIds, setFavoriteDogsIds] = useState<string[]>([])
  const [favoriteDogObjects, setFavoriteDogObjects] = useState<Dog[]>([])

  const [matchedDog, setMatchedDog] = useState<Dog>({} as Dog)
  const [matchedLocationData, setMatchedLocationData] = useState<Location>(
    {} as Location
  )
  const [citySearch, setCitySearch] = useState<string>("")
  const [stateSearch, setStateSearch] = useState<string>("")
  const [locationArr, setLocationArr] = useState<Location[]>([
    {
      zip_code: "",
      latitude: NaN,
      longitude: NaN,
      city: "",
      state: "",
      county: "",
    },
  ])
  const [favLocationArr, setFavLocationArr] = useState<Location[]>([])
  const [zipCodeArr, setZipCodeArr] = useState<string[]>([])
  const [favZipCodeArr, setFavZipCodeArr] = useState<string[]>([])
  const [matchedZipCode, setMatchedZipCode] = useState<string>("")
  let zipCodes: string[] = []
  let favZipCodes: string[] = []

  //fetch dog objs

  const fetchDogObjects = async (ids: string[]) => {
    const response = await fetchDogObjs(ids)

    if (response) {
      const isResponse200: boolean = responseCheck(response)
      if (isResponse200) {
        await fetchDogBreeds()
        setFilteredDogs(response.data)
        getLocations(response.data)
      }
    }
  }

  //fav location functions

  const getFavLocations = (dogArr: Dog[]) => {
    dogArr.map((dog) => {
      favZipCodes.push(dog.zip_code)
    })
    handleFavLocationData(favZipCodes)
    setFavZipCodeArr(favZipCodes)
  }

  const handleFavLocationData = async (favZipCodes: string[]) => {
    let locations = await fetchLocations(favZipCodes)
    setFavLocationArr(locations)
  }

  // fav dog fns

  const fetchFavDogObjects = async (ids: string[]): Promise<any> => {
    const response: AxiosResponse<any, any> | undefined =
      await fetchFavDogObjs(ids)

    if (response) {
      const isResponse200 = responseCheck(response)
      if (isResponse200) {
        getFavLocations(response.data)
        return response.data
      }
    }
  }

  const fetchFavoriteDogs = async (
    idArr: string[],
    id?: string
  ): Promise<void> => {
    try {
      if (id) {
        let dogIds = [...idArr, id]
        let dogObjs = await fetchFavDogObjects(dogIds)
        setFavoriteDogObjects(dogObjs)
      } else {
        let dogObjs = await fetchFavDogObjects(idArr)
        setFavoriteDogObjects(dogObjs)
      }
    } catch (error) {
      console.error("Couldn't fetch favorite dog objects", error)
    }
  }

  //location fns

  const fetchLocations = async (zipCodes: string[]): Promise<any> => {
    const response = await fetchLocationData(zipCodes)

    if (response) {
      const isResponse200: boolean = responseCheck(response)
      if (isResponse200) {
        return response.data
      }
    }
  }

  const handleLocationData = async (zipCodes: string[]) => {
    let locations = await fetchLocations(zipCodes)
    setLocationArr(locations)
  }

  const getLocations = (dogArr: Dog[]) => {
    dogArr.map((dog) => {
      zipCodes.push(dog.zip_code)
    })
    handleLocationData(zipCodes)
    setZipCodeArr(zipCodes)
  }


  return (
    <DogsContext.Provider
      value={{
        breedSearch,
        setBreedSearch,
        citySearch,
        setCitySearch,
        zipSearch,
        setZipSearch,
        stateSearch,
        setStateSearch,
        ageMin,
        setAgeMin,
        ageMax,
        setAgeMax,
        favoriteDogsIds,
        setFavoriteDogsIds,
        favoriteDogObjects,
        favLocationArr,
        setMatchedDog,
        matchedZipCode,
        setMatchedZipCode,
        fetchFavoriteDogs,
        currentPage,
        setCurrentPage,
        sortChoice,
        setSortChoice,
        total,
        setTotal,
        nextParams,
        setNextParams,
        setErrorMessage,
        setZipCodeArr,
        fetchLocations,
        fetchDogObjects,
        searchByLocation,
        matchedDog,
        matchedLocationData,
        setMatchedLocationData,
        filteredDogs,
        setFilteredDogs,
        locationArr,
        setLocationArr,
        prevParams,
        setPrevParams,
      }}
    >
      <div className="flex flex-col gap-2 mt-4 ">
        <SearchInputs />

        {errorMessage && (
          <div className="w-full text-center mt-4">{errorMessage}</div>
        )}
        {matchedDog.id && <MatchedDog />}
        {favoriteDogObjects.length > 0 && <FavoriteDogs />}

        {filteredDogs.length > 0 && <DogSearch />}
      </div>
    </DogsContext.Provider>
  )
}

export default SearchPage
