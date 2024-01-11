import '@testing-library/jest-dom'
import { render, screen, act } from '@testing-library/react'
import InputField from '.'
import { Form, FormikProvider, useFormik } from 'formik'

function TestingNode() {
  const formik = useFormik<{phone: string}>({
    initialValues: {
      phone: '+7000000000'
    },
    onSubmit: () => {}
  })
  return(<FormikProvider value={formik}>
    <Form>
      <InputField styleType={'default'} type='phone' color={'default'} name={'phone'}/>
    </Form>
  </FormikProvider>)
}
 
describe('Page', () => {
  it('renders an input', () => {
    render(<TestingNode/>)
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toBeVisible()
    expect(input).toHaveValue('+7000000000')
    act(() => {
      input.focus()
    })
    expect(input).toHaveFocus()
  })
})