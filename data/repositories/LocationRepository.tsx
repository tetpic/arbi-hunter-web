import { ISearchLocalyRequest, ISearchCityResult, ISearchCountryRequest, ISearchCountryResult, IGeoName } from 'data/interfaces/ILocation'
import request from 'utils/request'
import {AxiosRequestConfig} from 'axios'
import { Languages } from 'types/enums'

export default class LocationRepository {
  static async searchCountry(data: Partial<ISearchCountryRequest>, config?: AxiosRequestConfig): Promise<ISearchCountryResult[]> {
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

  static async searchCity(data: Partial<ISearchLocalyRequest>, config?: AxiosRequestConfig): Promise<ISearchCityResult[]> {
    const res = await request<any>({
      method: 'get',
      url: '/api/location/city',
      data: {
        ...data,
        lang: data.lang?data.lang:Languages.ru
      },
      config
    })
    return res
  }

  static async getById(id: number): Promise<IGeoName|null> {
    const res = await request({
      method: 'get',
      url: `/api/location/${id}`,
      data: {
        lang: Languages.ru
      }
    })
    if(res.err) {
      return null
    }
    return res
  }
}