import { ISearchLocalyRequest, ISearchCityResult, ISearchCountryRequest, ISearchCountryResult } from 'data/interfaces/ILocation'
import request from 'utils/request'
import {AxiosRequestConfig} from 'axios'
import { Languages } from 'types/enums'

export default class LocationRepository {
  static async searchCountry(data: ISearchCountryRequest, config?: AxiosRequestConfig): Promise<ISearchCountryResult[]> {
    const res = await request<ISearchCountryResult[]>({
      method: 'get',
      url: '/api/location/country',
      data: {
        ...data,
        lang: data.lang?data.lang:Languages.ru
      },
      config

    })
    return res
  }

  static async searchCity(data: ISearchLocalyRequest, config?: AxiosRequestConfig): Promise<ISearchCityResult[]> {
    const res = await request<any>({
      method: 'get',
      url: '/api/location/city',
      data,
      config
    })
    return res
  }
}