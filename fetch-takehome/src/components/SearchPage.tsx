import axios from "axios"
import { useEffect, useState } from "react"
import type { DogSearch, Dog } from "../types/types"

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
  const [sortChoice, setSortChoice] = useState<string>("")
  const [total, setTotal] = useState<number>(0)

  // const sortDogsAsc = (a: Dog, b: Dog) => {
  //   return a.name.localeCompare(b.name)
  // }

  // const sortDogsDesc = (a: Dog, b: Dog) => {
  //   return b.name.localeCompare(a.name)
  // }

  // const sortDogs = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   if (e.target.value === "asc") {
  //     const ascDogs = [...filteredDogs]
  //     ascDogs.sort(sortDogsAsc)
  //     setFilteredDogs(ascDogs)
  //   }
  //   if (e.target.value === "desc") {
  //     const descDogs = [...filteredDogs]
  //     descDogs.sort(sortDogsDesc)
  //     setFilteredDogs(descDogs)
  //   }
  // }

  // useEffect(() => {
  //   console.log("filteredDogs", filteredDogs)
  // }, [filteredDogs])

  // console.log('total', Math.ceil(total/25))
  const totalPages = Math.ceil(total / 25)

  useEffect(() => {
    console.log('currentPage', currentPage)
    console.log("totalPages", totalPages)
  }, [totalPages, currentPage])

  const handleChoiceSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "asc") {
      setSortChoice("asc")
    }
    if (e.target.value === "desc") {
      setSortChoice("desc")
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

  const fetchNextPage = async (page: number) => {
    console.log("urlParamsnextpg", nextParams)
    console.log("page", page)
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
            // sort: 'name:asc'
          },
        }
      )

      if (response.status) {
        console.log("response.data", response.data)
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
    console.log("urlParamsnextpg", nextParams)
    console.log("page", page)
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
            // sort: 'name:asc'
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
      }
      // console.log("response dogs", response)
    } catch (error) {
      console.error("Error during fetch request!", error)
    }
  }

  const handleSearch = async () => {
    const params: DogSearch = {}

    if (breedSearch) {
      params.breeds = [breedSearch]
    }
    if (zipSearch) {
      params.zipCodes = [zipSearch]
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
      params.sort = `name:${sortChoice}`
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

  return (
    <div>
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
      {/* <select className="w-24" onChange={(e) => sortDogs(e)}> */}
      <select className="w-24" onChange={(e) => handleChoiceSelection(e)}>
        <option value="none">None</option>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
      <button onClick={handleSearch}>Search</button>
      <div className="flex gap-4 flex-wrap">
        {filteredDogs &&
          filteredDogs.length > 1 &&
          filteredDogs.map((dog) => (
            <div key={dog.id} className="flex flex-col mt-6 w-[45%]">
              <div className="flex flex-col gap-1">
                <span>Name: {dog.name}</span>
                <span>Breed: {dog.breed}</span>
                <span>Age: {dog.age}</span>
                <span>Zip Code: {dog.zip_code}</span>
              </div>
              <img className="h-40 w-[7.5rem] object-cover" src={dog.img}></img>
            </div>
          ))}
        <button
          onClick={() => {
            setCurrentPage(currentPage - 1)
            fetchPrevPage(currentPage)
            // handleNextPage()
          }}
          disabled={currentPage <= 0}
        >
          Prev Page
        </button>
        <button
          onClick={() => {
            setCurrentPage(currentPage + 1)
            fetchNextPage(currentPage)
            // handleNextPage()
          }}
          disabled={currentPage >= totalPages-1}
        >
          Next page
        </button>
      </div>
    </div>
  )
}

export default SearchPage
