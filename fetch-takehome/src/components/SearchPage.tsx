import axios from "axios"
import { useEffect, useState, useContext } from "react"

import type {
  DogSearch,
  Dog,
  DogLocationSearch,
  Location,
} from "../types/types"
import LogOut from "./Logout"
import { GlobalContext } from "../App"

// import { logout } from "../queries/Logout"
import { fiftyStates } from "../fiftyStates"

const SearchPage = () => {
  const [breedSearch, setBreedSearch] = useState<string>("")
  const [zipSearch, setZipSearch] = useState<string>("")
  const [ageMin, setAgeMin] = useState<number | string>("")
  const [ageMax, setAgeMax] = useState<number | string>("")
  const [filteredDogs, setFilteredDogs] = useState<Dog[]>([])

  const [currentPage, setCurrentPage] = useState<number>(0)
  const [nextParams, setNextParams] = useState<string>("")
  const [prevParams, setPrevParams] = useState<string>("")
  const [sortChoice, setSortChoice] = useState<string>("asc")
  const [total, setTotal] = useState<number>(0)
  const totalPages = Math.ceil(total / 25)
  const [favoriteDogs, setFavoriteDogs] = useState<string[]>([])
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

  useEffect(() => {
    // console.log("filteredDogs", filteredDogs)
    // console.log("matchedDog", matchedDog)
    console.log("favoriteDogs", favoriteDogs)
    console.log("matchLocationData", matchedLocationData)
    console.log("citySearch", citySearch)
    console.log("zipSearch", zipSearch)
    // console.log("zipCodeArr", zipCodeArr)
  }, [
    filteredDogs,
    favoriteDogs,
    matchedDog,
    zipCodeArr,
    matchedLocationData,
    citySearch,
    zipSearch,
  ])

  let zipCodes: string[] = []
  let favZipCodes: string[] = []

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
    console.log("dog.zip", dog.zip_code)

    setMatchedZipCode(dog.zip_code)
  }

  const handleLocationData = async () => {
    let locations = await fetchLocations(zipCodeArr)
    setLocationArr(locations)
  }

  const handleFavLocationData = async () => {
    let locations = await fetchLocations(favZipCodeArr)
    console.log("favLocations", locations)
    setFavLocationArr(locations)
  }

  const handleMatchedLocationData = async () => {
    let location = await fetchLocations([matchedZipCode])
    console.log("location", location)
    setMatchedLocationData(location[0])
  }

  useEffect(() => {
    if (zipCodeArr) {
      handleLocationData()
    }
  }, [zipCodeArr])

  useEffect(() => {
    if (favZipCodeArr) {
      handleFavLocationData()
    }
  }, [favZipCodeArr])

  useEffect(() => {
    if (matchedZipCode) {
      handleMatchedLocationData()
    }
  }, [matchedZipCode])

  const handleChoiceSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "asc") {
      setSortChoice("asc")
    }
    if (e.target.value === "desc") {
      setSortChoice("desc")
    }
    if (e.target.value === "none") {
      setSortChoice("")
    }
  }

  const fetchFavDogObjects = async (ids: string[]) => {
    try {
      const response = await axios.post(
        "https://frontend-take-home-service.fetch.com/dogs",
        ids,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      if (response.status) {
        console.log("response.data", response.data)
        getFavLocations(response.data)
        return response.data
      }
    } catch (error) {
      console.error("Error during favorite dog fetch", error)
    }
  }

  const fetchFavoriteDogs = async () => {
    console.log("favoriteDogs", favoriteDogs)
    let dogObjs = await fetchFavDogObjects(favoriteDogs)
    console.log("dogObjs", dogObjs)
    setFavoriteDogObjects(dogObjs)
  }

  useEffect(() => {
    fetchFavoriteDogs()
    // }
  }, [favoriteDogs])

  const fetchDogBreeds = async () => {
    try {
      const response = await axios.get(
        "https://frontend-take-home-service.fetch.com/dogs/breeds",
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      if (!response.status) {
        throw new Error("Fetch request failed!")
      } else {
        return response.data
      }
    } catch (error) {
      console.error("Error during fetch request!", error)
      throw error
    }
  }

  useEffect(() => {
    fetchDogBreeds()
  }, [])

  const addToFavorites = (id: string) => {
    if (!favoriteDogs.includes(id)) {
      setFavoriteDogs([...favoriteDogs, id])
    }
  }

  const removeFromFavorites = (id: string) => {
    const result = favoriteDogs.filter((dogId) => dogId !== id)
    console.log("result", result)

    setFavoriteDogs(result)

    // fetchFavoriteDogs()
  }

  const fetchNextPage = async (page: number) => {
    const params: DogSearch = {
      size: 25,
      from: page * 25,
    }

    // if (zipSearch) {
    //   let zipCodes = await handleLocationData()
    //   console.log('zipCodes', zipCodes)
    //   params.zipCodes = zipCodes
    // }
    // console.log('nextParams', nextParams)

    try {
      const response = await axios.get(
        `https://frontend-take-home-service.fetch.com${nextParams}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
          params,
        }
      )
      console.log("response", response)

      if (response.status) {
        fetchDogObjects(response.data.resultIds)

        if (response.data.next) {
          
          setNextParams(response.data.next)
        }
        if (response.data.prev) {
          setPrevParams(response.data.prev)
        }
      }
    } catch (error) {
      console.error("Error during fetch request!", error)
      throw error
    }
  }

  const fetchPrevPage = async (page: number) => {
    try {
      const response = await axios.get(
        `https://frontend-take-home-service.fetch.com${prevParams}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
          params: {
            size: 25,
            from: page * 25,
          },
        }
      )

      if (response.status) {
        fetchDogObjects(response.data.resultIds)

        if (response.data.next) {
          setNextParams(response.data.next)
        }
        if (response.data.prev) {
          setPrevParams(response.data.prev)
        }
      }
    } catch (error) {
      console.error("Error during fetch request!", error)
      throw error
    }
  }

  const fetchDogObjects = async (ids: string[]) => {
    let idsArr: string[]

    if (ids.length > 100) {
      idsArr = ids.slice(0, 100)
    } else {
      idsArr = ids
    }

    try {
      const response = await axios.post(
        "https://frontend-take-home-service.fetch.com/dogs",

        idsArr,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      if (response.status) {
        setFilteredDogs(response.data)
        getLocations(response.data)
      }
    } catch (error) {
      console.error("Error during fetch request!", error)
    }
  }

  const fetchMatchedDog = async (id: string[]) => {
    try {
      const response = await axios.post(
        "https://frontend-take-home-service.fetch.com/dogs",
        id,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      if (response.status) {
        console.log("response.data[]", response.data)
        getMatchedLocation(response.data[0])
        setMatchedDog(response.data[0])
      }
    } catch (error) {
      console.error("Error fetching matched dog!", error)
    }
  }

  const findDogMatch = async (dogIds: string[]) => {
    try {
      const response = await axios.post(
        "https://frontend-take-home-service.fetch.com/dogs/match",
        dogIds,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      if (response.status) {
        fetchMatchedDog([response.data.match])
      }
    } catch (error) {
      console.error("Error fetching dog matches!", error)
    }
  }

  const handleSearch = async () => {
    if (currentPage !== 0) {
      setCurrentPage(0)
    }

    const params: DogSearch = {}

    if (citySearch || stateSearch) {
      let filteredZips = await handleSearchByLocation()
      // if (citySearch) {
      //   setCitySearch("")
      // }
      // if (stateSearch) {
      //   setStateSearch("")
      // }
      params.zipCodes = [filteredZips]
      // console.log("filteredZips", filteredZips)
      fetchLocations([filteredZips])
    }

    if (breedSearch) {
      params.breeds = [breedSearch]
    }
    if (zipSearch) {
      console.log("zipSearch", zipSearch)
      params.zipCodes = [zipSearch]
      fetchLocations([zipSearch])
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

    try {
      const response = await axios.get(
        "https://frontend-take-home-service.fetch.com/dogs/search",
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
          params,
        }
      )
      if (response.status) {
        setTotal(response.data.total)
        setNextParams(response.data.next)
        fetchDogObjects(response.data.resultIds)
      }

      if (!response.status) {
        throw new Error("Fetch request failed!")
      }
    } catch (error) {
      console.log("Error during search fetch!")
    }
  }

  const handleSearchByLocation = async () => {
    if (currentPage !== 0) {
      setCurrentPage(0)
    }

    const params: DogLocationSearch = {
      size: 50,
    }

    if (citySearch) {
      params.city = citySearch
    }
    if (stateSearch) {
      params.states = [stateSearch]
    }

    try {
      const locationResponse = await axios.post(
        "https://frontend-take-home-service.fetch.com/locations/search", params,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        
        }
      )

      if (locationResponse.status) {
        console.log("locationResponse", locationResponse)
        let zipCodes = locationResponse.data.results.map(
          (location: Location) => location.zip_code
        )
        // setZipCodeArr(zipCodes)
        // console.log('zipCodes', zipCodes)

        setZipSearch(zipCodes)
        return zipCodes
      }
    } catch (error) {
      console.error("Error during location search!")
    }
  }

  const fetchLocations = async (zipCodes: string[]) => {
    try {
      const locationResponse = await axios.post(
        "https://frontend-take-home-service.fetch.com/locations",
        zipCodes,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      if (locationResponse.status) {
        // handleLocationData(locationResponse.data)
        return locationResponse.data
      }
    } catch (error) {
      console.error("Error fetching locations!", error)
    }
  }

  // const handleSearchBy = () => {
  //   setSearchByLocation(!searchByLocation)

  //   if (searchByLocation) {
  //     setSearchBy("Search by location")
  //   }
  //   if (!searchByLocation) {
  //     setSearchBy("Search by dog")
  //   }
  // }

  return (
    <div className="flex flex-col gap-2 mt-4 ">
      {/* <button onClick={handleSearchBy}>{searchBy}</button>
      {!searchByLocation ? ( */}
      <h1 className="text-center">Search for Dogs!</h1>
      <LogOut />

      <>
        <div className="flex justify-center flex-wrap gap-2">
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
            placeholder="Zip Code"
            value={zipSearch}
            onChange={(e) => setZipSearch(e.target.value)}
          />
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
            className="w-36 border-2 border-black"
            onChange={(e) => handleChoiceSelection(e)}
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
        </div>
      </>
      {matchedDog.id && (
        <div key={matchedDog.id} className="flex flex-col mt-6 w-[45%]">
          <span>Name: {matchedDog.name}</span>
          <span>Breed: {matchedDog.breed}</span>
          <span>Age: {matchedDog.age}</span>
          {matchedLocationData && (
            <span>
              {`${matchedLocationData.city}, ${matchedLocationData.state}, ${matchedLocationData.zip_code}`}
            </span>
          )}

          <img
            className="h-40 w-[7.5rem] object-cover"
            src={matchedDog.img}
          ></img>
        </div>
      )}
      {favoriteDogObjects.length > 0 && (
        <div className="min-w-[300px] w-[95%] mx-auto border-black border-2 flex flex-col pb-6 items-center">
          <h2>Favorite Dogs!</h2>
          <button
            className="border-2 w-[300px] mx-auto border-black"
            onClick={() => findDogMatch(favoriteDogs)}
          >
            Find Your Match!
          </button>
          <div className="w-full flex flex-wrap justify-center gap-8">
            {favoriteDogObjects.map((favDog, index) => (
              <div
                key={favDog.id}
                className="flex flex-col mt-6 w-[45%] border-2 border-black items-center rounded-md"
              >
                <div className="flex flex-col gap-1 pl-2">
                  <span>Name: {favDog.name}</span>
                  <span>Breed: {favDog.breed}</span>
                  <span>Age: {favDog.age}</span>
                  {favLocationArr && favLocationArr[index] && (
                    <span>
                      {" "}
                      {`${favLocationArr[index].city}, ${favLocationArr[index].state}, ${favLocationArr[index].zip_code}`}
                    </span>
                  )}

                  <img
                    className="h-40 w-[7.5rem] object-cover"
                    src={favDog.img}
                  ></img>

                  <button
                    className="border px-1 mb-2 w-32 border-black"
                    onClick={() => removeFromFavorites(favDog.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <input
          type="text"
          placeholder="City"
          value={citySearch}
          onChange={(e) => setCitySearch(e.target.value)}
        />
        <select
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
        {/* <input
          type="text"
          placeholder="Min Age"
          value={ageMin}
          onChange={(e) => setAgeMin(e.target.value)}
        /> */}
        {/* <button onClick={handleSearchByLocation}>Filter</button> */}
      </div>

      {filteredDogs.length > 0 && (
        <div className="flex gap-4 justify-center flex-wrap">
          <h2 className="w-full text-center"> View All Dogs!</h2>

          {filteredDogs.map((dog, index) => (
            <div
              key={dog.id}
              className="flex flex-col mt-6 w-[45%] border-2 border-black items-center rounded-md"
            >
              <div className="flex flex-col gap-1 pl-2">
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
                className="h-40 w-[7.5rem] rounded-sm object-cover"
                src={dog.img}
              ></img>
              <div className="flex flex-col justify-center gap-1 my-2">
                <button
                  className="border px-1 w-32 border-black"
                  onClick={() => addToFavorites(dog.id)}
                >
                  Add to Favorites
                </button>
                {/* {favoriteDogs.includes(dog.id) && (
                    <button
                      className="border px-1 w-32 border-black"
                      onClick={() => removeFromFavorites(dog.id)}
                    >
                      Remove
                    </button>
                  )} */}
              </div>
            </div>
          ))}
          {/* {filteredDogs.length>0 && ( */}
          <div className="w-full flex justify-evenly mb-2">
            <button
              className="border-2 px-1 border-black"
              onClick={() => {
                setCurrentPage(currentPage - 1)
                fetchPrevPage(currentPage)
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
                fetchNextPage(currentPage)
              }}
              disabled={currentPage >= totalPages - 1}
            >
              Next page
            </button>
          </div>
          {/* )} */}
        </div>
      )}
    </div>
  )
}

export default SearchPage
