import { useContext } from "react"
import { DogsContext } from "./context/DogContext"

const MatchedDog: React.FC = () => {
  const { matchedDog, matchedLocationData } = useContext(DogsContext)

  return (
    <div key={matchedDog.id} className="flex flex-col items-center py-4 w-full">
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
  )
}

export default MatchedDog
