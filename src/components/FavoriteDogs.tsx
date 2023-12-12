import { Dog } from "../types/types"
import { findMatch } from "./api/findMatch"
import { responseCheck } from "./utils/responseCheck"
import { AxiosResponse } from "axios"
import { fetchMatch } from "./api/fetchMatchedDog"
import { useContext } from "react"
import { DogsContext } from "./context/DogContext"


// type FavoriteDogProps = {
//   favoriteDogsIds: string[]
//   favoriteDogObjects: Dog[]
//   favLocationArr: Location[]
//   setMatchedDog: React.Dispatch<React.SetStateAction<Dog>>
//   setMatchedZipCode: React.Dispatch<React.SetStateAction<string>>
//   setFavoriteDogsIds: React.Dispatch<React.SetStateAction<string[]>>
//   fetchFavoriteDogs: () => Promise<void>
// }

const FavoriteDogs: React.FC = () => {
  const {
    favoriteDogsIds,
    favoriteDogObjects,
    favLocationArr,
    setMatchedDog,
    setMatchedZipCode,
    setFavoriteDogsIds,
    fetchFavoriteDogs,
    setMatchedLocationData,
    fetchLocations
  
  } = useContext(DogsContext)

  const handleMatchedLocationData = async (dog:Dog) => {
    let location = await fetchLocations([dog.zip_code])
    setMatchedLocationData(location[0])
  }

  const getMatchedLocation = (dog: Dog) => {
    handleMatchedLocationData(dog)
    setMatchedZipCode(dog.zip_code)
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
      const isResponse200: boolean = responseCheck(response)
      if (isResponse200) {
        fetchMatchedDog([response.data.match])
      }
    }
  }

  const removeFromFavorites = (id: string) => {
    const result = favoriteDogsIds.filter((dogId: string) => dogId !== id)

    setFavoriteDogsIds(result)

    if (result.length === 0) {
      fetchFavoriteDogs()
    }
  }

  return (
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
        {favoriteDogObjects.map((favDog: Dog, index: number) => (
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
  )
}
export default FavoriteDogs
