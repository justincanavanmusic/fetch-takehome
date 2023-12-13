import { useContext } from "react"
import { DogsContext } from "./context/DogContext"
import { AxiosResponse } from "axios"
import { fetchNextPage } from "./api/paginationFns"
import { responseCheck } from "./utils/responseCheck"
import { fetchPrevPage } from "./api/paginationFns"

const DogSearch = () => {
  const {
    currentPage,
    setCurrentPage,
    fetchFavoriteDogs,
    favoriteDogsIds,
    setFavoriteDogsIds,
    nextParams,
    setNextParams,
    prevParams,
    setPrevParams,
    total,
    filteredDogs,
    locationArr,
    fetchDogObjects,
  } = useContext(DogsContext)

  const totalPages = Math.ceil(total / 25)

  const addToFavorites = async (id: string): Promise<void> => {
    await fetchFavoriteDogs([...favoriteDogsIds], id)
    if (!favoriteDogsIds.includes(id)) {
      setFavoriteDogsIds([...favoriteDogsIds, id])
    }
  }
  const fetchNext = async (nextParams: string): Promise<void> => {
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

  const fetchPrev = async (prevParams: string): Promise<void> => {
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

  return (
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
  )
}

export default DogSearch
