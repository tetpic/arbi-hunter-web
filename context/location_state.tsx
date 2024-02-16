import { IGeoName, ISearchCityResult, ISearchCountryRequest, ISearchLocalyRequest } from 'data/interfaces/ILocation'
import LocationRepository from 'data/repositories/LocationRepository'
import { createContext, useContext, useEffect, useState } from 'react'

interface IState {
  cities: Map<number, ISearchCityResult>
  countries: Map<number, IGeoName>
  getCountries: (data: Partial<ISearchCountryRequest>|null, countries?: IGeoName[])=> void
  getCities: (data: Partial<ISearchLocalyRequest>, countries: string[], cts?: ISearchCityResult[])=> void
  clearCities: ()=>void
}



const LocationContext = createContext<Partial<IState>>({})

interface Props {
  children: React.ReactNode
  initials?: {cities?: number[], countries?: number[]}
}

export function LocationWrapper(props: Props) {
  const [cities, setCities] = useState<Map<number, ISearchCityResult>>(new Map())
  const [countries, setCountries] = useState<Map<number, IGeoName>>(new Map())



  const getCities = async(data: Partial<ISearchLocalyRequest>, countries: string[], cts?: ISearchCityResult[]) => {
    if(cts && cts.length > 0) {
      setCities(state=> {
        cts.forEach(el=> {
          state.set(el.id, el)
        })
        return new Map(state)
      })
      return
    }

    const _cities:Map<number, ISearchCityResult> = new Map
    const res = await Promise.all(countries.map(el=> LocationRepository.searchCity({...data, country: el})));
    
    [].concat(...res).forEach(c=> {
      _cities.set(c.id, c)
    })

    setCities(_cities)
  }

  const getCountries = (data: Partial<ISearchCountryRequest>|null, countries?: IGeoName[]) => {
    if(countries && countries.length > 0) {
      setCountries(state=> {
        countries.forEach(el=> {
          state.set(el.geonameid, el)
        })
        return new Map(state)
      })
      return
    }
    LocationRepository.searchCountry(data).then(res => {
      setCountries(state => {
        res.forEach(el=> {
          state.set(el.geoname.geonameid, el.geoname)
        })
        return new Map(state)
      })
    })
  }

  const clearCities = () => {
    setCities(new Map())
  }

  const getInitialGeonames = async() => {
    if(props.initials?.countries?.length>0) {
      const _countries = await Promise.all(props.initials.countries.map(el=> LocationRepository.getById(el)))
      const _arr: IGeoName[] = []
      setCountries(state=> {
        _arr.concat(..._countries).forEach(c=> {
          state.set(c.geonameid, c)
        })
        return new Map(state)
      })
    }
    if(props.initials?.cities?.length>0) {
      const _cities = await Promise.all(props.initials.cities.map(el=> LocationRepository.getById(el)))
      const _arr: IGeoName[] = []
      setCities(state=> {
        _arr.concat(..._cities).forEach((c)=> {
          state.set(c.geonameid, {id: c.geonameid, name: c.locName})
        })
        return new Map(state)
      })
    }
  }

  useEffect(()=>{
    debugger
    if(props?.initials?.countries || props?.initials?.cities) {
      getInitialGeonames()
    }

  }, [])

  const value: IState = {
    cities,
    countries,
    getCities,
    getCountries,
    clearCities
  }

  return (
    <LocationContext.Provider value={value}>
      {props.children}
    </LocationContext.Provider>
  )
}

export function useLocationContext() {
  return useContext(LocationContext)
}
