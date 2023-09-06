import classNames from 'classnames'
import TextAreaField from 'components/fields/TextAreaField'
import ArrowDownSvg from 'components/svg/ArrowDownSvg'
import Accordeon from 'components/ui/Accordeon'
import Button from 'components/ui/Button'
import { Form, FormikProvider, useFormik } from 'formik'
import { useState } from 'react'
import styles from './index.module.scss'

interface Props {
}

interface ItemProps {
  name: string
}

function Item(props: ItemProps) {
  const [isActive, setActive] = useState<boolean>(false)

  const submit = (data: ItemProps) => {
    
  }

  const formik = useFormik<ItemProps>({
    initialValues: {
      name: ''
    },
    onSubmit: submit
  })

  return (
    <Accordeon 
    isActive={isActive}
    classNames={{content: styles.itemContent, root: styles.itemRoot}}
    body={
      <div
      onClick={()=>setActive(!isActive)}
      className={styles.item}
      >
        Приглашение на Телефонное интервью 
        <ArrowDownSvg className={classNames(styles.arrow, isActive&&styles.arrow_active)}/>
      </div>
    } 
    >
      <>
      <FormikProvider value={formik}>
        <Form className={styles.form}>
          <TextAreaField name={props.name} autoSize/>
          <Button className={styles.button}>Сохранить</Button>
        </Form>
      </FormikProvider>
      </>
    </Accordeon>
  )
}

export default function Patterns(props: Props) {

  return (<div className={styles.root}> 
    <Item name={'test'}/>
    <Item name={'test'}/>
    <Item name={'test'}/>
    <Item name={'test'}/>
  </div>)
}