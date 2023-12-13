import LogOut from "./Logout"
import { fiftyStates } from "../fiftyStates"
import { useContext } from "react"
import { DogsContext } from "./context/DogContext"
import { DogSearch, DogLocationSearch } from "../types/types"
import { Location } from "../types/types"
import { search } from "./api/search"
import { responseCheck } from "./utils/responseCheck"
import { handleChoiceSelection } from "./utils/handleChoice"

const SearchInputs = () => {
  const {
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
  } = useContext(DogsContext)

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
      try {
        let locations = await fetchLocations([zipSearch])
        setZipCodeArr(locations)
      } catch (error) {
        console.error("Couldn't fetch locations!", error)
      }
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

  const handleChoice = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let choiceSelection = handleChoiceSelection(e)
    choiceSelection && setSortChoice(choiceSelection)
  }

  return (
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
          {/* <input
            className="border-2 border-black"
            type="text"
            placeholder="City"
            value={citySearch}
            onChange={(e) => setCitySearch(e.target.value)}
          /> */}
          <input
            className="border-2 border-black"
            type="text"
            placeholder="Zip Code"
            value={zipSearch}
            onChange={(e) => setZipSearch(e.target.value)}
          />
          {/* <select
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
          </select> */}
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
  )
}

export default SearchInputs
