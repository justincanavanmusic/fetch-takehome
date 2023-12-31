import { AxiosResponse } from "axios"

export interface Dog {
  id: string
  img: string
  name: string
  age: number
  zip_code: string
  breed: string
}

export interface Location {
  zip_code: string
  latitude: number
  longitude: number
  city: string
  state: string
  county: string
}

export interface Coordinates {
  lat: number
  lon: number
}

export type DogSearch = {
  breeds?: string[]
  zipCodes?: string[]
  ageMin?: number | string
  ageMax?: number | string
  size?: number
  from?: number
  sort?: string
}

export type DogLocationSearch = {
  city?: string
  states?: string[]
  size?: number
  from?: number
}

export interface Match {
  match: string
}

export type DogsContextType = {
  breedSearch: string
  setBreedSearch: React.Dispatch<React.SetStateAction<string>>
  citySearch: string
  setCitySearch: React.Dispatch<React.SetStateAction<string>>
  zipSearch: string
  setZipSearch: React.Dispatch<React.SetStateAction<string>>
  stateSearch: string
  setStateSearch: React.Dispatch<React.SetStateAction<string>>
  ageMin: string | number
  setAgeMin: React.Dispatch<React.SetStateAction<string | number>>
  ageMax: string | number
  setAgeMax: React.Dispatch<React.SetStateAction<string | number>>
  favoriteDogsIds: string[]
  setFavoriteDogsIds: React.Dispatch<React.SetStateAction<string[]>>
  favoriteDogObjects: Dog[]
  favLocationArr: Location[]
  setMatchedDog: React.Dispatch<React.SetStateAction<Dog>>
  matchedZipCode: string
  setMatchedZipCode: React.Dispatch<React.SetStateAction<string>>
  fetchFavoriteDogs: (idArr: string[], id?: string) => Promise<void>
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  sortChoice: string
  setSortChoice: React.Dispatch<React.SetStateAction<string>>
  total: number
  setTotal: React.Dispatch<React.SetStateAction<number>>
  nextParams: string
  setNextParams: React.Dispatch<React.SetStateAction<string>>
  prevParams: string
  setPrevParams: React.Dispatch<React.SetStateAction<string>>
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
  setZipCodeArr: React.Dispatch<React.SetStateAction<string[]>>
  fetchLocations: (zipCodes: string[]) => Promise<any>
  fetchDogObjects: (ids: string[]) => Promise<void>
  searchByLocation: (
    params: DogLocationSearch
  ) => Promise<AxiosResponse<any, any> | undefined>
  matchedDog: Dog
  matchedLocationData: Location
  setMatchedLocationData: React.Dispatch<React.SetStateAction<Location>>
  filteredDogs: Dog[]
  setFilteredDogs: React.Dispatch<React.SetStateAction<Dog[]>>
  locationArr: Location[]
  setLocationArr: React.Dispatch<React.SetStateAction<Location[]>>
}
