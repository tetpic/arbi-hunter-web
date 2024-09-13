import styles from './index.module.scss'

import classNames from 'classnames'
import ArrowDownSvg from 'components/svg/ArrowDownSvg'
import Accordeon from 'components/ui/Accordeon'
import Button from 'components/ui/Button'
import { Form, FormikProvider, useFormik } from 'formik'
import { useState } from 'react'
import { IPattern, IPatternBase } from 'data/interfaces/IPattern'
import { TranslatePatternType } from 'utils/enumsTranslations'
import RichTextField from 'components/fields/RichTextField'
import RadioListField from 'components/fields/RadioListField'
import { usePatternContext } from 'context/pattern_state'
import P from '@/components/ui/P'
import { useAppContext } from 'context/state'
import { AppTheme } from 'types/enums'
import { colors } from 'styles/variables'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  pattern?: IPattern
  new?: boolean
}


export default function PatternItem(props: Props) {
  const {t} = useTranslation()
  const [isActive, setActive] = useState<boolean>(false)
  const patternContext = usePatternContext()
  const appContext = useAppContext()
  const isLightTheme = appContext.theme === AppTheme.Light

  const submit = (data: IPatternBase) => {
    if(props.new||!props.pattern.profileId) {
      patternContext.createPattern(data)
    }
    else {
      patternContext.editPattern(data, props.pattern?.id)
    }
  }

  const formik = useFormik<IPatternBase>({
    initialValues: {
      type: props.pattern?.type||[...patternContext.patternsNotExist.values()][0],
      template: props.pattern?.template||''
    },
    onSubmit: submit
  })

  return (  <Accordeon 
    isActive={isActive}
    classNames={{content: styles.itemContent, root: styles.itemRoot}}
    body={
      <P
      useThemeColor
      styleType={['medium', 'w500']}
      onClick={()=>setActive(!isActive)}
      className={styles.item}
      >
        {props.new?t('profile_createPattern'):TranslatePatternType(props.pattern?.type, t)}
        <ArrowDownSvg className={classNames(styles.arrow, isActive&&styles.arrow_active)} color={isLightTheme&&colors.black} />
      </P>
    } 
    >
      <>
      <FormikProvider value={formik}>
        <Form className={styles.form}>
          {props.new && patternContext.patternsNotExist.size>0 &&
          <RadioListField 
          name={'type'} 
          itemCircleClassname={styles.circle}
          wrapperClassName={styles.wrapper}
          itemClassName={styles.radio}
          activeItemClassName={styles.radioActive}
          itemLabelClassName={styles.radioLabel}
          options={
            [...patternContext.patternsNotExist.values()].map(el=> {return {value: el, label: TranslatePatternType(el, t)}})
          }
          />
        }
          <RichTextField value={formik.values.template} name={'template'}/>
          <Button className={styles.button}>{t('save')}</Button>
        </Form>
      </FormikProvider>
      </>
    </Accordeon>)
}


