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
    lat: number;
    lon: number;

}

export type DogSearch = {
    breeds?: string[],
    zipCodes?: string[],
    ageMin?: number | string,
    ageMax?: number | string,
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
