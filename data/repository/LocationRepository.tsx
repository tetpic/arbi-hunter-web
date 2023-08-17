import { ISearchCityRequest, ISearchCityResult, ISearchCountryRequest, ISearchCountryResult } from 'data/interfaces/ILocation'
import request from 'utils/request'
import {AxiosRequestConfig} from 'axios'

export default class LocationRepository {
  static async searchCountry(data: ISearchCountryRequest, config?: AxiosRequestConfig): Promise<ISearchCountryResult[]> {
    const res = await request<ISearchCountryResult[]>({
      method: 'get',
      url: `/api/location/country?page=${data.page}&limit=${data.limit}&search=${data.search}&lang=${data.lang?data.lang:'ru'}`,
      config

    })
    return res
  }

  static async searchCity(data: ISearchCityRequest, config?: AxiosRequestConfig): Promise<ISearchCityResult[]> {
    const res = await request<any>({
      method: 'post',
      url: `api/location/city?page=${data.limit}&limit=${data.limit}&search=${data.search}&lang=${data.lang}&country=${data.country}`,
      config
    })
    return res
  }
}