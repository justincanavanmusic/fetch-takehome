import { useEffect, useState } from "react"
import type {
  DogSearch,
  Dog,
  Location,
  DogLocationSearch,
} from "../types/types"
import LogOut from "./Logout"
import { fiftyStates } from "../fiftyStates"
import { AxiosResponse } from "axios"
import { responseCheck } from "./utils/responseCheck"
import { fetchNextPage, fetchPrevPage } from "./api/paginationFns"
import { handleChoiceSelection } from "./utils/handleChoice"
import { fetchFavDogObjs } from "./api/fetchFavData"
import { fetchDogBreeds } from "./api/fetchBreeds"
import { fetchDogObjs } from "./api/fetchDogObjs"
import { fetchMatch } from "./api/fetchMatchedDog"
import { findMatch } from "./api/findMatch"
import { search } from "./api/search"
import { fetchLocationData } from "./api/getLocations"
import { searchByLocation } from "./api/searchByLocation"
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
  // const [searchByLocation, setSearchByLocation] = useState<boolean>(false)
  // const [searchBy, setSearchBy] = useState<string>("Search by location")
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

  const getMatchedLocation = (dog: Dog) => {
    setMatchedZipCode(dog.zip_code)
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

  const handleChoice = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let choiceSelection = handleChoiceSelection(e)
    choiceSelection && setSortChoice(choiceSelection)
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

  const removeFromFavorites = (id: string) => {
    const result = favoriteDogsIds.filter((dogId) => dogId !== id)

    setFavoriteDogsIds(result)

    if (result.length === 0) {
      fetchFavoriteDogs()
    }
  }

  const fetchDogObjects = async (ids: string[]) => {
    const response = await fetchDogObjs(ids)

    if (response) {
      const isResponse200 = responseCheck(response)
      if (isResponse200) {
        setFilteredDogs(response.data)
        getLocations(response.data)
      }
    }
  }

  const fetchMatchedDog = async (id: string[]) => {
    const response: AxiosResponse<any, any> | undefined = await fetchMatch(id)
    if (response) {
      const isResponse200: boolean = responseCheck(response)
      if (isResponse200) {
        getMatchedLocation(response.data[0])
        setMatchedDog(response.data[0])
      }
    }
  }

  const findDogMatch = async (dogIds: string[]) => {
    const response = await findMatch(dogIds)

    if (response) {
      const isResponse200 = responseCheck(response)
      if (isResponse200) {
        fetchMatchedDog([response.data.match])
      }
    }
  }

  const handleSearch = async () => {
    if (currentPage !== 0) {
      setCurrentPage(0)
    }

    const params: DogSearch = {}

    if (breedSearch) {
      params.breeds = [breedSearch]
    }
    if (zipSearch) {
      params.zipCodes = [zipSearch]
      let locations = await fetchLocations([zipSearch])
      setZipCodeArr(locations)
    }
    if (ageMin) {
      if (typeof ageMin === "string") {
        params.ageMin = parseInt(ageMin)
      } else {
        params.ageMin = ageMin
      }
    }
    if (ageMax) {
      if (typeof ageMax === "string") {
        params.ageMax = parseInt(ageMax)
      } else {
        params.ageMax = ageMax
      }
    }
    if (sortChoice) {
      params.sort = `breed:${sortChoice}`
    }

    //there was a CORS issue when sending an array of multiple zip codes so I had to take this functionality out.

    if (citySearch || stateSearch) {
      try {
        const filteredZips: string[] | undefined =
          await handleSearchByLocation()

        params.zipCodes = filteredZips

        if (filteredZips) {
          await fetchLocations(filteredZips)
        }
      } catch (error) {
        console.error("Couldn't fetch locations", error)
      }
    }

    const response = await search(params)

    if (response) {
      const isResponse200 = responseCheck(response)
      if (isResponse200) {
        setTotal(response.data.total)
        setNextParams(response.data.next)
        fetchDogObjects(response.data.resultIds)
        if (response.data.total === 0) {
          setErrorMessage("No Dogs Found :(")
        }
        if (response.data.total > 0) {
          setErrorMessage("")
        }
      }

      if (!response.status) {
        throw new Error("Fetch request failed!")
      }
    }
  }

  const handleSearchByLocation: () => Promise<
    string[] | undefined
  > = async () => {
    const params: DogLocationSearch = {
      size: 10000,
      from: currentPage * 25,
    }

    if (citySearch) {
      params.city = citySearch
    }
    if (stateSearch) {
      params.states = [stateSearch]
    }

    const response = await searchByLocation(params)

    if (response) {
      const isResponse200: boolean = responseCheck(response)
      if (isResponse200) {
        let zipCodes: string[] = response.data.results.map(
          (location: Location) => location.zip_code
        )

        return zipCodes
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
    <div className="flex flex-col gap-2 mt-4 ">
      <div className="flex flex-col items-start">
        <h1 className="pl-4 text-[1.5rem]">Search for Dogs!</h1>
        <LogOut />

        <>
          <div className="flex justify-center pt-4 flex-wrap gap-2">
            <input
              className="border-2 border-black "
              type="text"
              placeholder="Breed"
              value={breedSearch}
              onChange={(e) => setBreedSearch(e.target.value)}
            />
            <input
              className="border-2 border-black"
              type="text"
              placeholder="City"
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
            />
            <input
              className="border-2 border-black"
              type="text"
              placeholder="Zip Code"
              value={zipSearch}
              onChange={(e) => setZipSearch(e.target.value)}
            />
            <select
              className="border-2 border-black"
              placeholder="State"
              value={stateSearch}
              onChange={(e) => setStateSearch(e.target.value)}
            >
              {fiftyStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            <input
              className="border-2 border-black"
              type="text"
              placeholder="Min Age"
              value={ageMin}
              onChange={(e) => setAgeMin(e.target.value)}
            />
            <input
              className="border-2 border-black"
              type="text"
              placeholder="Max Age"
              value={ageMax}
              onChange={(e) => setAgeMax(e.target.value)}
            />
            <span className="w-full text-center">Sort By Breed:</span>
            <select
              data-testid="sortChoiceSelect"
              className="w-36 border-2 border-black"
              onChange={(e) => handleChoice(e)}
            >
              <option value="none">None</option>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>{" "}
            <div className="w-full flex justify-center">
              <button
                className="border-2 border-black w-24"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
            {favoriteDogsIds.length === 0 && (
              <hr className="w-[80%] mt-4 border-black "></hr>
            )}
          </div>
        </>
      </div>
      {errorMessage && (
        <div className="w-full text-center mt-4">{errorMessage}</div>
      )}
      {matchedDog.id && (
        <div
          key={matchedDog.id}
          className="flex flex-col items-center py-4 w-full"
        >
          <hr className="w-[80%] mt-4 mb-2 border-black "></hr>
          <h1 className="text-[1.5rem] mb-4">Your Match!</h1>
          <div className="flex flex-col border-2 py-2 border-black items-center w-64 xs:w-[350px] sm:w-[500px] rounded-md xs:text-[1.2rem] sm:text-[1.5rem] sm:flex-row sm:justify-between sm:items-start px-2">
            <div className="flex flex-col">
              <span>Name: {matchedDog.name}</span>
              <span>Breed: {matchedDog.breed}</span>
              <span>Age: {matchedDog.age}</span>
              {matchedLocationData && (
                <span>
                  {`${matchedLocationData.city}, ${matchedLocationData.state}, ${matchedLocationData.zip_code}`}
                </span>
              )}
            </div>

            <img
              className="h-40 w-[7.5rem] xs:h-48 xs:w-36 sm:h-60 sm:w-[11.25rem] lg:h-72 lg:w-[13.5rem] object-cover rounded-md "
              src={matchedDog.img}
            ></img>
          </div>
        </div>
      )}
      {favoriteDogObjects.length > 0 && (
        <div className="min-w-[300px] w-[95%] mx-auto flex flex-col pb-6 items-center">
          {/* <hr className="w-[80%] border-black"></hr> */}
          <h2 className="text-[1.5rem] mt-4">Your Favorite Dogs!</h2>
          <button
            className="border-2 my-2 px-4 mx-auto border-black"
            onClick={() => findDogMatch(favoriteDogsIds)}
          >
            Find Your Match!
          </button>
          <div className="w-full pb-4 border-2 border-black flex flex-wrap justify-center gap-8">
            {favoriteDogObjects.map((favDog, index) => (
              <div
                key={favDog.id}
                className="flex flex-col mt-6 w-[80%] sm:w-[450px] border-2 border-black rounded-md"
              >
                <div className="flex flex-col gap-1 pl-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between px-2">
                    <div className="flex flex-col xs:text-[1.2rem] sm:text-[1.5rem] justify-start py-1">
                      <span>Name: {favDog.name}</span>
                      <span>Breed: {favDog.breed}</span>
                      <span>Age: {favDog.age}</span>
                      {favLocationArr && favLocationArr[index] && (
                        <span>
                          {" "}
                          {`${favLocationArr[index].city}, ${favLocationArr[index].state}, ${favLocationArr[index].zip_code}`}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-center sm:py-2">
                      <img
                        className="h-40 w-[7.5rem] xs:h-48 xs:w-36 sm:h-60 sm:w-[11.25rem] lg:h-72 lg:w-[13.5rem] object-cover rounded-md "
                        src={favDog.img}
                      ></img>
                    </div>
                  </div>
                  <div className="w-full flex justify-center">
                    <button
                      className="border px-1 mb-2 w-32 border-black"
                      onClick={() => removeFromFavorites(favDog.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredDogs.length > 0 && (
        <div className="flex gap-4 justify-center flex-wrap">
          <h2 className="w-full text-center text-[1.5rem]"> View All Dogs!</h2>

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
                // fetchPrevPage()
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
  )
}

export default SearchPage
