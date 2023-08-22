import request from 'utils/request'

export default class UserRepository {
  static async getCurrentUser(): Promise<any[]> {
    const res = await request<any[]>({
      method: 'get',
      url: '/api/auth/currentUser',
    })
    return res
  }

 
}

