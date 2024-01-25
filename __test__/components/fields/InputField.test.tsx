import '@testing-library/jest-dom'
import { render, screen, act, cleanup} from '@testing-library/react'
import InputField from '../../../components/fields/InputField'
import userEvent from '@testing-library/user-event'
import { Form, FormikProvider, useFormik } from 'formik'

function FormTestingPhoneNode() {
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

function FormTestingPriceFormattingNode(props: {price?: string}) {
  const formik = useFormik<{num: string}>({
    initialValues: {
      num: props.price||''
    },
    onSubmit: () => {}
  })
  return(<FormikProvider value={formik}>
    <Form>
      <InputField styleType={'default'} priceFormatting color={'default'} name={'num'}/>
    </Form>
  </FormikProvider>)
}
 
describe('PhoneInput', () => {
  it('renders an input', () => {
    render(<FormTestingPhoneNode/>)
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toBeVisible()
    expect(input).toHaveValue('+7000000000')
    act(() => {
      input.focus()
    })
    expect(input).toHaveFocus()
  })
  cleanup()
})

describe('PriceInput', () => {
  it('renders an input with price value', () => {
    render(<FormTestingPriceFormattingNode price={'1234'}/>)
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toBeVisible()
    expect(input).toHaveValue('1 234')
    cleanup()
  })

  it('not allow 0 to price input', () => {
    render(<FormTestingPriceFormattingNode price={''}/>)
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toBeVisible()
    act(()=> {      
      userEvent.keyboard('0').then(_=>
        expect(input).toHaveValue('')
      )
    })
    cleanup()
  })

  // it('allow 12 to price input', async() => {
  //   render(<FormTestingPriceFormattingNode price={''}/>)
  //   const input = screen.getByRole('textbox')
  //   expect(input).toBeInTheDocument()
  //   expect(input).toBeVisible()
  //   await userEvent.keyboard('12')
  //   act(()=> {
  //     dispatchEvent('keydown', ()=> {

  //     })
  //   })
  //   expect(input).toHaveValue('12123')      

  // })
})