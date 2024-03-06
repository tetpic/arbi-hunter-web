import Validator from '../../utils/Validator'
//@ts-ignore
describe('Validator.required', () => {
  it('not valid if string is empty', () => {
    expect(Validator.required('')).toBe('Обязательное поле')
  })

  it('not valid if number is 0', () => {
    expect(Validator.required(0)).toBe('Обязательное поле')
  })

  it('not valid if string is 0', () => {
    expect(Validator.required('0')).toBe('Обязательное поле')
  })

  it('not valid if string is some 0', () => {
    expect(Validator.required('0000')).toBe('Обязательное поле')
  })

})