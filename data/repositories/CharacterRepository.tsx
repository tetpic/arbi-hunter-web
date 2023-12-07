import { ICharCategory, ICharItem, IUserCharacter } from 'data/interfaces/ICharacter'
import request from 'utils/request'

export default class CharacterRepository {

  static async getCurrentUserChar(): Promise<IUserCharacter|null> {
    const res = await request({
      method: 'get',
      url: '/api/character/current',
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async createCharacter(): Promise<any|null> {
    const res = await request({
      method: 'post',
      url: '/api/character',
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async fetchCharacterCategoryList(): Promise<ICharCategory[]|null> {
    const res = await request({
      method: 'get',
      url: '/api/character-item-category',
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async fetchItemsList(data?: {categoryId?: number, characterId?: number, }): Promise<ICharItem[]|null> {
    const res = await request({
      method: 'get',
      url: '/api/character-item',
      data
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async updateCharacter(itemsIds: number[], characterId: number): Promise<any|null> {
    const res = await request({
      method: 'patch',
      url: `/api/character/${characterId}`,
      data: {itemsIds}
    })
    if(res.err) {
      return null
    }
    return res
  }


}
