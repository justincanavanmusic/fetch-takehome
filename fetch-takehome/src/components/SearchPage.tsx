import axios from "axios"
import { useEffect, useState } from "react"
import type {
  DogSearch,
  Dog,
  DogLocationSearch,
  Location,
} from "../types/types"
import { fiftyStates } from "../fiftyStates"

const SearchPage = () => {
  const [breedSearch, setBreedSearch] = useState<string>("")
  const [zipSearch, setZipSearch] = useState<string>("")
  const [ageMin, setAgeMin] = useState<number | string>("")
  const [ageMax, setAgeMax] = useState<number | string>("")
  const [filteredDogs, setFilteredDogs] = useState<Dog[]>([
    {
      id: "",
      img: "",
      name: "",
      age: NaN,
      zip_code: "",
      breed: "",
    },
  ])

  const [currentPage, setCurrentPage] = useState<number>(0)
  const [nextParams, setNextParams] = useState<string>("")
  const [prevParams, setPrevParams] = useState<string>("")
  const [sortChoice, setSortChoice] = useState<string>("asc")
  const [total, setTotal] = useState<number>(0)
  const totalPages = Math.ceil(total / 25)
  const [favoriteDogs, setFavoriteDogs] = useState<string[]>([])
  const [matchedDog, setMatchedDog] = useState<Dog>({
    id: "",
    img: "",
    name: "",
    age: NaN,
    zip_code: "",
    breed: "",
  })
  const [searchByLocation, setSearchByLocation] = useState<boolean>(false)
  const [searchBy, setSearchBy] = useState<string>("Search by location")
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
  const [zipCodeArr, setZipCodeArr] = useState<string[]>([])

  useEffect(() => {
    console.log("filteredDogs", filteredDogs)
    console.log("matchedDog", matchedDog)
    console.log("favoriteDogs", favoriteDogs)
    console.log("zipCodeArr", zipCodeArr)
  }, [filteredDogs, favoriteDogs, matchedDog, zipCodeArr])
  let zipCodes: string[] = []

  const getLocations = (dogArr: Dog[]) => {
    console.log("dogArr", dogArr)

    dogArr.map((dog) => {
      zipCodes.push(dog.zip_code)
    })
    setZipCodeArr(zipCodes)
  }

  const handleLocationData = async () => {
    let locations = await fetchLocations(zipCodeArr)
    console.log("locations", locations)
    setLocationArr(locations)
  }
  useEffect(() => {
    handleLocationData()
  }, [zipCodeArr])

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
    setFavoriteDogs([...favoriteDogs, id])
    console.log("favoriteDogs", favoriteDogs)
  }

  const removeFromFavorites = (id: string) => {
    const result = favoriteDogs.filter((dogId) => dogId !== id)
    console.log("result", result)
    setFavoriteDogs(result)
  }

  const fetchNextPage = async (page: number) => {
    try {
      const response = await axios.get(
        `https://frontend-take-home-service.fetch.com${nextParams}`,
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
        console.log("response.data", response.data)

        setFilteredDogs(response.data)
        getLocations(response.data)
      }
    } catch (error) {
      console.error("Error during fetch request!", error)
    }
  }

  const fetchMatchedDog = async (id: string[]) => {
    console.log("id", id)
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
      console.log("matchedDog", response)
      setMatchedDog(response.data[0])
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

    if (breedSearch) {
      params.breeds = [breedSearch]
    }
    if (zipSearch) {
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
        console.log("response.data", response.data)

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

    const params: DogLocationSearch = {}

    if (citySearch) {
      params.city = citySearch
    }
    if (stateSearch) {
      params.states = [stateSearch]
    }

    try {
      const locationResponse = await axios.post(
        "https://frontend-take-home-service.fetch.com/locations/search",
        params,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
          params,
        }
      )
      console.log("locationResponse", locationResponse)
      if (locationResponse.status) {
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
        // console.log('lkocationre', locationResponse.status)
        // handleLocationData(locationResponse.data)
        return locationResponse.data
      }
    } catch (error) {
      console.log("Error fetching locations!")
    }
  }

  const handleSearchBy = () => {
    setSearchByLocation(!searchByLocation)

    if (searchByLocation) {
      setSearchBy("Search by location")
    }
    if (!searchByLocation) {
      setSearchBy("Search by dog")
    }
  }

  return (
    <div>
      <button onClick={handleSearchBy}>{searchBy}</button>
      {!searchByLocation ? (
        <>
          <input
            type="text"
            placeholder="Breed"
            value={breedSearch}
            onChange={(e) => setBreedSearch(e.target.value)}
          />
          <input
            type="text"
            placeholder="Zip Code"
            value={zipSearch}
            onChange={(e) => setZipSearch(e.target.value)}
          />
          <input
            type="text"
            placeholder="Min Age"
            value={ageMin}
            onChange={(e) => setAgeMin(e.target.value)}
          />
          <input
            type="text"
            placeholder="Max Age"
            value={ageMax}
            onChange={(e) => setAgeMax(e.target.value)}
          />
          <select className="w-24" onChange={(e) => handleChoiceSelection(e)}>
            <option value="none">None</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>{" "}
          <button onClick={handleSearch}>Search</button>
          {favoriteDogs.length > 0 && (
            <button onClick={() => findDogMatch(favoriteDogs)}>
              Find Your Match!
            </button>
          )}
        </>
      ) : (
        <>
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
          <button onClick={handleSearchByLocation}>Search</button>
          {favoriteDogs.length > 0 && (
            <button onClick={() => findDogMatch(favoriteDogs)}>
              Find Your Match!
            </button>
          )}
        </>
      )}

      {matchedDog.id && (
        <div key={matchedDog.id} className="flex flex-col mt-6 w-[45%]">
          <span>Name: {matchedDog.name}</span>
          <span>Breed: {matchedDog.breed}</span>
          <span>Age: {matchedDog.age}</span>
          {/* <span>Zip Code: {matchedDog.zip_code}</span> */}

          <img
            className="h-40 w-[7.5rem] object-cover"
            src={matchedDog.img}
          ></img>
        </div>
      )}
      <div className="flex gap-4 flex-wrap">
        {
          filteredDogs &&
            filteredDogs[0].id &&
            filteredDogs.map((dog, index) => (
              <div key={dog.id} className="flex flex-col mt-6 w-[45%]">
                <div className="flex flex-col gap-1">
                  <span>Name: {dog.name}</span>
                  <span>Breed: {dog.breed}</span>
                  <span>Age: {dog.age}</span>
                  {locationArr && locationArr[index] && (
                    <span> {`${locationArr[index].city}, ${locationArr[index].state}, ${locationArr[index].zip_code}`}</span>
                  )}
               
                </div>
                <img
                  className="h-40 w-[7.5rem] object-cover"
                  src={dog.img}
                ></img>
                <button onClick={() => addToFavorites(dog.id)}>
                  Add to favorites
                </button>
                {favoriteDogs.includes(dog.id) && (
                  <button onClick={() => removeFromFavorites(dog.id)}>
                    Remove from favorites
                  </button>
                )}
              </div>
            ))
          // : (
          //   <p>no dogs found</p>
          // )
        }
        {filteredDogs && filteredDogs[0].id ? (
          <>
            <button
              onClick={() => {
                setCurrentPage(currentPage - 1)
                fetchPrevPage(currentPage)
              }}
              disabled={currentPage <= 0}
            >
              Prev Page
            </button>
            <button
              onClick={() => {
                setCurrentPage(currentPage + 1)
                fetchNextPage(currentPage)
              }}
              disabled={currentPage >= totalPages - 1}
            >
              Next page
            </button>
            <p>
              Page {currentPage + 1} of {totalPages}
            </p>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default SearchPage
