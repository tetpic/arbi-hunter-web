import { IPaginationRequest } from "types/types"

export interface IAlternatesGeoName {
  alternatenameid: number,
  isolanguage: string,
  alternatename: string,
}

export interface IGeoName {
  geonameid: number,
  name: string,
  asciiname: string,
  alternatenames: string,
  latitude: number,
  longitude: number,
  fclass: string,
  fcode: string,
  country: string,
  timezone: null,
  locName: string,
  alternates: IAlternatesGeoName[]
}

export interface ISearchCountryResult {
  country_code: string,
  country_name: string,
  geoname: IGeoName,
  name: string
}

export interface ISearchCountryRequest extends IPaginationRequest {
  search: string,
  lang?: string
}

export interface ISearchLocalyRequest extends IPaginationRequest{
  search: string,
  lang?: string,
  country?: string
}

export interface ISearchCityResult {
  id: number,
  name: string
}