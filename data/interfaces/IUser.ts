export interface IUser {
  name: string
  id: number,
  phone: string,
  language: string,//'ru' - add enums
  email: string|null,
  regType: string,//'site' - add enums
  socialId: null,
  isRegistrationCompleted: false,
  balance: 0,
  blockComment: null,
  blocked: false,
  blockedAt: null,
  blockedUntil: null,
  createdAt: "2023-08-22T11:40:00.308Z",
  updatedAt: "2023-08-22T11:40:00.308Z",
  deletedAt: null,
  profiles: []
}