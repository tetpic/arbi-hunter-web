import styles from './index.module.scss'

import { useEffect, useState } from 'react'
import Spinner from 'components/ui/Spinner'
import PersonalHeader from './PersonalHeader'
import PersonalBody from './PersonalBody'
import PersonalCard from './PersonalCard'
import { usePersonalContext } from 'context/personal_state'
import ContentItem from 'components/ui/Content/ContentItem'
import EditToolbar from './EditToolbar'
import classNames from 'classnames'
import { BackgroundCategoryType } from 'data/interfaces/IBackground'
import { ProfileType } from 'data/interfaces/IRegistration'
import { useUserContext } from 'context/user_state'
import Button from '@/components/ui/Button'
import useTranslation from 'next-translate/useTranslation'
import P from '@/components/ui/P'
import { useAppContext } from 'context/state'
import { AppTheme, ModalType, PurchaseType, SnackbarType} from 'types/enums'
import { PurchasePreviewModalArgs } from '@/components/modals/PurchasePreviewModal'
import { useTariffContext } from 'context/tariff_state'
import { useRouter } from 'next/router'
import { ShopPages } from '../shop'
import { IConfirmModalProps } from '@/components/modals/ConfirmModal'
import PurchaseRepository from 'data/repositories/PurchaseRepository'
import { clearObject, copyToClipboard } from 'utils/helpers'
import Spacer from '@/components/ui/Spacer'
import { Form, FormikProvider, useFormik } from 'formik'
import InputField from '@/components/fields/InputField'
import LocationDropDownInput from '@/components/fields/LocationDropdownInput'
import LocationRepository from 'data/repositories/LocationRepository'
import { ISearchCityResult } from 'data/interfaces/ILocation'
import { IUserProfile } from 'data/interfaces/IUser'
import RichTextField from '@/components/fields/RichTextField'
import HtmlText from '@/components/ui/HtmlText'
import MailConvertSvg from '@/components/svg/MailConvertSvg'
import PhoneSvg from '@/components/svg/PhoneSvg'
import TelegramSvg from '@/components/svg/TelegramSvg'
import Formatter from 'utils/formatter'
import Link from 'next/link'
import DoubleSvg from '@/components/svg/DoubleSvg'
import { colors } from 'styles/variables'
import { TranslateVacancyLookType } from 'utils/enumsTranslations'
import PencilSvg from '@/components/svg/PencilSvg'

interface Props {
  id?: number
  webView?: boolean
}

export default function PersonalPage(props: Props) {
  const {t} = useTranslation()
  const personalContext = usePersonalContext()
  const appContext = useAppContext()
  const theme = appContext.theme
  const tariffContext = useTariffContext()
  const [isEditing, setIsEditing] = useState(false)
  const userContext = useUserContext()
  const isTabletWidth = appContext.size.isTabletWidth
  const currentProfile = userContext.currentProfile
  const router = useRouter()
  const isMy = currentProfile?.id === personalContext?.currentProfile?.id

  const formik = useFormik<Pick<IUserProfile, 'company'|'cityId'|'bio'|'phone'>>({
    initialValues: {
      company: userContext?.currentProfile?.company || '',
      cityId: userContext?.currentProfile?.cityId || null,
      bio: userContext?.currentProfile?.bio || '',
      phone: userContext?.currentProfile?.phone || '',

    },
    onSubmit: () => {}
  })

  const saveBranding = () => {
    if(personalContext.currentProfile?.profileType === ProfileType.Employee ) {
      userContext.editCurrentProfile({...clearObject(userContext.currentProfile), bio: formik.values.bio, })
      .then(res => {
        if(res) {
          personalContext.setPersonalPage({profile: res})
          setIsEditing(!isEditing)
        }
      }) 
      return
    }
    personalContext.updatePersonalPage()
    .then(res => {
      const personalTariff = [...tariffContext?.packets.values()][0]
      if(res === null && personalTariff.price < userContext.user.balance) {
        const _args : PurchasePreviewModalArgs = {
          tariff: [...tariffContext.packets.values()][0], 
          onBuy: (data) => {
            PurchaseRepository.purchaseItem({...clearObject(data), tariffId: personalTariff.id})
            .then(res => {
              personalContext.updatePersonalPage()
              .then(_ => {
                setIsEditing(!isEditing)
                appContext.showSnackbar(t('shop_tariffPurchased'), SnackbarType.success)
              })
              .catch(e=> {
                return null
              })
            })
          },
          tariffs: tariffContext?.packets,
        }
        isTabletWidth
          ? appContext.showBottomSheet<PurchasePreviewModalArgs>(ModalType.PurchasePreviewModal, _args, 360)
          : appContext.showModal<PurchasePreviewModalArgs>(ModalType.PurchasePreviewModal, _args)
        return
      }
      else if(res === null && personalTariff.price > userContext.user.balance) {
        const _args : IConfirmModalProps = {
          text: t('shop_insufficientBalance'),
          maxWidth: 320,
          callback: () => {
            router.push({pathname: '/shop', query: {page: ShopPages.Balance}})
          }
        }
        isTabletWidth
          ? appContext.showBottomSheet<IConfirmModalProps>(ModalType.ConfirmModal, _args, 180)
          : appContext.showModal<IConfirmModalProps>(ModalType.ConfirmModal, _args)
        return
      }
      else {
        setIsEditing(!isEditing)
      }
      return true
    }
    )
    .then(_ => {
      if(personalContext.currentProfile?.profileType === ProfileType.Hirer 
        && (formik.values.cityId !== userContext.currentProfile?.cityId||formik.values.company !== userContext.currentProfile?.company)) {
        userContext.editCurrentProfile(clearObject(formik.values))
        .then(res => {
          if(res) {
            personalContext.setCurrentProfile(res)
          }
        })
      }
    })
  }

  const cityHandler = (c: ISearchCityResult) => {
    formik.setFieldValue('cityId', c.id)
  }

  useEffect(()=>{
    personalContext.setPersonalPage({profileId: props.id}) 
    .then(res => {
      if(res) {
        formik.setFieldValue('company', res.company)
      }
      personalContext.setBackgrounds(res)
    })
    tariffContext?.setActiveSubscriptions?.([PurchaseType.PersonalPage])
    tariffContext?.setPackets?.([PurchaseType.PersonalPage])
  }, [])

  if(personalContext.loading) {
    return <Spinner size={24} />
  }

  if(personalContext.personalPage === null) {
    return <div className={styles.root}>
      <Spinner size={24} />
    </div>
  }

  const isHeaderExist = (
    (personalContext.currentProfile?.profileType === ProfileType.Hirer 
      && personalContext.backgrounds?.get(BackgroundCategoryType.Places) 
      && personalContext.currentProfile?.logo)
    ||
    (personalContext.currentProfile?.profileType === ProfileType.Employee 
      && personalContext.backgrounds?.get(BackgroundCategoryType.Places)) 
  )

  const hirerEditor = (<>
    {isEditing && !isTabletWidth &&
      <ContentItem className={classNames(styles.bodyItem, isEditing&&styles.bodyItem_edit)}>
        <EditToolbar/>
      </ContentItem>
    }
    <ContentItem  className={styles.bodyItem}>
      {personalContext.blocks.size > 0 &&
      <PersonalBody isEditing={!props.id && isEditing && !isTabletWidth} webView={props.webView}/>
      ||
      <div className={styles.emptyWrapper}>
        <P styleType={['w500', 'medium']}>{t('personal_noInfo')}</P>
      </div>
      }
    </ContentItem>
  </>)

  const employeeEditor = (<>
    {isEditing &&
    <FormikProvider value={formik} >
      <Form className={styles.employeeForm}>
        <P styleType={['medium', 'w500', 'greyLight']}>{t('personal_about')}</P>
        <Spacer basis={16}/>
        <RichTextField name={'bio'} hideButtons={{helpers: true, color: true}}/>
        <Spacer basis={16}/>
      </Form>
    </FormikProvider>
    ||
    <>
    <P 
    className={classNames(styles.lookType, styles[personalContext.currentProfile?.vacancyLookType])}
    >
      {TranslateVacancyLookType(personalContext.currentProfile?.vacancyLookType, personalContext.currentProfile?.profileType, t)}
    </P>
    <ContentItem  className={styles.bodyItem}>
      <P styleType={['large', 'w600']} useThemeColor>{t('personal_contacts')}</P>
      <Spacer basis={16}/>
      <div className={styles.contacts}>
        {personalContext.currentProfile?.email &&
        <Link className={styles.contact} href={`mailto:${personalContext.currentProfile?.email}`}>
          <P styleType={['medium', 'alignCenter']} useThemeColor >
            <Button styleType={['icon', 'grey']} altStyleType={['icon', 'whitePurple', 'invertSvg']}><MailConvertSvg/></Button>
            {personalContext.currentProfile?.email}
            <Button className={styles.copy} onClick={() => copyToClipboard(personalContext.currentProfile?.email)}>
              <DoubleSvg color={colors.blue}/>
            </Button>
          </P>
        </Link>
        }
        {personalContext.currentProfile?.phone &&
        <Link className={styles.contact} href={`tel:${personalContext.currentProfile?.phone}`}> 
        <P styleType={['medium', 'alignCenter']} useThemeColor >
          <Button styleType={['icon', 'grey']} altStyleType={['icon', 'whitePurple', 'invertSvg']}><PhoneSvg/></Button>
          {Formatter.formatPhone(personalContext.currentProfile?.phone)}
          <Button className={styles.copy} onClick={() => copyToClipboard(personalContext.currentProfile?.phone)}>
            <DoubleSvg color={colors.blue}/>
          </Button>
        </P>
        </Link>
        }
        
        {personalContext.currentProfile?.telegramNickname &&
        <Link className={styles.contact} href={`tg://resolve?domain=${personalContext.currentProfile?.telegramNickname}`}>
          <P styleType={['medium', 'alignCenter']} useThemeColor >
            <Button styleType={['icon', 'grey']} altStyleType={['icon', 'whitePurple', 'invertSvg']}><TelegramSvg/></Button>
            {personalContext.currentProfile?.telegramNickname}
            <Button className={styles.copy} onClick={() => copyToClipboard(personalContext.currentProfile?.telegramNickname)}>
              <DoubleSvg color={colors.blue}/>
            </Button>
          </P>
        </Link>
        }
      </div>
      <Spacer basis={36}/>
      <P styleType={['large', 'w600']} useThemeColor>{t('personal_about')}</P>
      <Spacer basis={16}/>
      <HtmlText text={personalContext.currentProfile?.bio}/>
    </ContentItem>
    </>
    }
  </>)

  return (<div className={styles.root}> 
    {isMy && !isEditing && isTabletWidth && !props.webView &&
      <Button 
      className={styles.mobileEditButton} 
      styleType={['icon', 'black', 'svg24']} 
      altStyleType={['icon', 'whitePurple', 'svg24']}
      onClick={() => setIsEditing(!isEditing)}
      >
        <PencilSvg color={theme === AppTheme.Light ?colors.black : colors.white}/>
      </Button>
    }

    {!isEditing && !props.webView
      &&
      <PersonalHeader 
      showMobileBack
      isEditing={!props.id&&isEditing}/>
      ||
      isEditing && <PersonalHeader 
      showMobileBack 
      isEditing={!props.id&&isEditing}/>
    }
    {!props.webView &&
      <PersonalCard 
      save={() => personalContext.updatePersonalPage()} 
      isEditable={!props.id} 
      noHeader={!isHeaderExist}
      isEditing={!props.id&&isEditing} 
      switchMode={() => !props.id&&setIsEditing(!isEditing)}
      />
     }

    {isEditing && personalContext.currentProfile?.profileType === ProfileType.Hirer &&
      <FormikProvider value={formik}>
        <Form className={styles.form}>
          <InputField 
          label={t('company')} 
          labelType={'top'} 
          styleType={'default'} 
          color={'white'} 
          name={'company'}
          />
          <LocationDropDownInput
          onSetOption={cityHandler} 
          name={'cityName'} 
          value = {personalContext.currentProfile?.city?.locName}
          labelName={t('city')}
          requestFn={() => LocationRepository.searchCity({country: personalContext.currentProfile?.country?.country})} 
          />
        </Form>
      </FormikProvider>
    }
    {personalContext.currentProfile?.profileType === ProfileType.Hirer && hirerEditor}
    {personalContext.currentProfile?.profileType === ProfileType.Employee && employeeEditor}
    {isEditing &&
      <Button 
      styleType={['gradient']} 
      onClick={saveBranding} 
      className={styles.saveButton}
      >
        {t('save')}
      </Button>
    }
  </div>)
}