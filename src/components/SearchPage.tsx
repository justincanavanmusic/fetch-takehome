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
  const totalPages = Math.ceil(total / 25)
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

  //pagination functions

  const fetchNext = async (nextParams: string) => {
    let response: AxiosResponse<any, any> | undefined =
      await fetchNextPage(nextParams)
    if (response) {
      const isResponse200 = responseCheck(response)
      if (isResponse200) {
        try {
          await fetchDogObjects(response.data.resultIds)
        } catch (error) {
          console.error(`Couldn't fetch dog objects`, error)
        }
        if (response.data.next) {
          setNextParams(response.data.next)
        }
        if (response.data.prev) {
          setPrevParams(response.data.prev)
        }
      }
    }
  }

  const fetchPrev = async (prevParams: string) => {
    const response: AxiosResponse<any, any> | undefined =
      await fetchPrevPage(prevParams)
    if (response) {
      const isResponse200 = responseCheck(response)
      if (isResponse200) {
        try {
          await fetchDogObjects(response.data.resultIds)
        } catch (error) {
          console.error(`Couldn't fetch dog objects`, error)
        }

        if (response.data.next) {
          setNextParams(response.data.next)
        }
        if (response.data.prev) {
          setPrevParams(response.data.prev)
        }
      }
    }
  }

  //location functions

  const getLocations = (dogArr: Dog[]) => {
    dogArr.map((dog) => {
      zipCodes.push(dog.zip_code)
    })
    setZipCodeArr(zipCodes)
  }

  const getFavLocations = (dogArr: Dog[]) => {
    dogArr.map((dog) => {
      favZipCodes.push(dog.zip_code)
    })
    setFavZipCodeArr(favZipCodes)
  }

  //fetch locations

  useEffect(() => {
    if (zipCodeArr.length > 0) {
      // console.log("handleLocationData")
      // console.log("zipCodeArr", zipCodeArr)
      handleLocationData()
    }
  }, [zipCodeArr])

  useEffect(() => {
    if (favZipCodeArr.length > 0) {
      // console.log("handleFavLocationData")
      // console.log("favZipCodeArr", favZipCodeArr)
      handleFavLocationData()
    }
  }, [favZipCodeArr])

  useEffect(() => {
    if (matchedZipCode.length > 0) {
      // console.log("handleMatchedLocationData")
      handleMatchedLocationData()
    }
  }, [matchedZipCode])

  const handleLocationData = async () => {
    let locations = await fetchLocations(zipCodeArr)
    setLocationArr(locations)
  }

  const handleFavLocationData = async () => {
    let locations = await fetchLocations(favZipCodeArr)
    setFavLocationArr(locations)
  }

  const handleMatchedLocationData = async () => {
    let location = await fetchLocations([matchedZipCode])
    setMatchedLocationData(location[0])
  }

  // fav dog fns

  const fetchFavDogObjects = async (ids: string[]) => {
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

  const fetchFavoriteDogs = async () => {
    try {
      let dogObjs = await fetchFavDogObjects(favoriteDogsIds)
      setFavoriteDogObjects(dogObjs)
    } catch (error) {
      console.error("Couldn't fetch favorite dog objects", error)
    }
  }

  useEffect(() => {
    if (favoriteDogsIds.length > 0) {
      fetchFavoriteDogs()
    }
  }, [favoriteDogsIds])

  useEffect(() => {
    if (filteredDogs.length > 0) {
      fetchDogBreeds()
    }
  }, [filteredDogs])

  const addToFavorites = (id: string) => {
    if (!favoriteDogsIds.includes(id)) {
      setFavoriteDogsIds([...favoriteDogsIds, id])
    }
  }

  const fetchDogObjects = async (ids: string[]) => {
    const response = await fetchDogObjs(ids)

    if (response) {
      const isResponse200: boolean = responseCheck(response)
      if (isResponse200) {
        setFilteredDogs(response.data)
        getLocations(response.data)
      }
    }
  }

  const fetchLocations = async (zipCodes: string[]) => {
    const response = await fetchLocationData(zipCodes)

    if (response) {
      const isResponse200: boolean = responseCheck(response)
      if (isResponse200) {
        return response.data
      }
    }
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
        setMatchedZipCode,
        fetchFavoriteDogs,
        currentPage,
        setCurrentPage,
        sortChoice,
        setSortChoice,
        setTotal,
        setNextParams,
        setErrorMessage,
        setZipCodeArr,
        fetchLocations,
        fetchDogObjects,
        searchByLocation,
        matchedDog,
        matchedLocationData,
      }}
    >
      <div className="flex flex-col gap-2 mt-4 ">
        <SearchInputs />

        {errorMessage && (
          <div className="w-full text-center mt-4">{errorMessage}</div>
        )}
        {matchedDog.id && <MatchedDog />}
        {favoriteDogObjects.length > 0 && <FavoriteDogs />}

        {filteredDogs.length > 0 && (
          <div className="flex gap-4 justify-center flex-wrap">
            <h2 className="w-full text-center text-[1.5rem]">
              {" "}
              View All Dogs!
            </h2>

            {filteredDogs.map((dog, index) => (
              <div
                key={dog.id}
                className="flex justify-between flex-col mt-6 w-[45%] border-2 border-black items-center rounded-md"
              >
                <div className="w-full flex flex-col md:flex-row justify-between">
                  <div className="flex flex-col gap-1 xs:text-[1.2rem]  pl-2">
                    <span>Name: {dog.name}</span>
                    <span>Breed: {dog.breed}</span>
                    <span>Age: {dog.age}</span>
                    {locationArr && locationArr[index] && (
                      <span>
                        {" "}
                        {`${locationArr[index].city}, ${locationArr[index].state}, ${locationArr[index].zip_code}`}
                      </span>
                    )}
                  </div>
                  <img
                    className="mx-auto h-40 w-[7.5rem] xs:h-48 xs:w-36 sm:h-60 md:m-1 sm:w-[11.25rem] lg:h-72 lg:w-[13.5rem] rounded-md object-cover"
                    src={dog.img}
                  ></img>
                </div>
                <div className="flex flex-col items-center gap-1 my-2 w-full">
                  <button
                    className="border px-1 w-32 border-black"
                    onClick={() => addToFavorites(dog.id)}
                  >
                    Add to Favorites
                  </button>
                </div>
              </div>
            ))}
            <div className="w-full flex justify-evenly mb-2">
              <button
                className="border-2 px-1 border-black"
                onClick={() => {
                  setCurrentPage(currentPage - 1)
                  fetchPrev(prevParams)
                }}
                disabled={currentPage <= 0}
              >
                Prev Page
              </button>
              <p>
                Page {currentPage + 1} of {totalPages}
              </p>
              <button
                className="border-2 px-1 border-black"
                onClick={() => {
                  setCurrentPage(currentPage + 1)
                  fetchNext(nextParams)
                }}
                disabled={currentPage >= totalPages - 1}
              >
                Next page
              </button>
            </div>
          </div>
        )}
      </div>
    </DogsContext.Provider>
  )
}

export default SearchPage
