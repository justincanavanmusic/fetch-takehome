import { createContext } from "react"
// import type { DogContextType } from "../types/project-types/projectTypes"
import { DogsContextType } from "../../types/types"

export const DogsContext = createContext<DogsContextType>({} as DogsContextType)
