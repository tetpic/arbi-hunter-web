import styles from './index.module.scss'

import classNames from 'classnames'
import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import BackBtn from 'components/ui/BackBtn'
import UserPic from 'components/ui/UserPic'
import { IUserProfile } from 'data/interfaces/IUser'
import { useEffect, useState } from 'react'
import { FILES } from 'types/constants'
import { useThrottleFn } from '@react-cmpt/use-throttle'
import InfiniteScroll from 'react-infinite-scroll-component'
import Spinner from 'components/ui/Spinner'
import { useAppContext } from 'context/state'
import { IPagination } from 'types/types'
import P from '@/components/ui/P'

interface Props {
  onClose: ()=> void
}

export interface ICommunityMembersModalProps {
  members?: Map<number, IUserProfile>
  onSearch?: (page: number, search?: string) => Promise<IPagination<IUserProfile>>
}

export default function MembersModal(props: Props) {
  const appContext = useAppContext()
  const args: ICommunityMembersModalProps = appContext.modalArguments

  const [filtered, setFiltered] = useState<IUserProfile[]>([...args.members.values()])
  const [dataLength, setLength] = useState<number>(args.members.size)
  const [total, setTotal] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  
  const searchUsers = useThrottleFn((e: React.ChangeEvent<HTMLInputElement>)=>{
    const value = e.target?.value as string
    if(value.length > 0) {
      args.onSearch(1, value)
      .then(res=> {
        setFiltered(res.data)
      })
    }
    else {
      setFiltered([...args.members.values()])
    }
  }, 300)

  useEffect(()=>{
    args.onSearch(page)
    .then(res=> {
      res instanceof Object && setTotal(res.total)
      setFiltered([...args.members.values()])
      setLength(args.members.size)
    })
    .catch(_=> {
      
    })
  }, [page])


  const top = (<div className={styles.top}>
    <div className={styles.navigation}>
      <BackBtn className={styles.button} onClick={props.onClose} bgColor={'transparent'}/>
      <p className={styles.title}>Участники</p>
    </div>
    <input type="text" onChange={(e)=> searchUsers.callback(e)} className={styles.input} placeholder={'Поиск по участникам'}/>
  </div>)

  const body = (<div className={styles.bodyWrapper}>
    <InfiniteScroll 
    next={()=>setPage(p=> p+1)} 
    hasMore={dataLength < total} 
    height={'100%'}
    loader={<Spinner size={24}/>} 
    dataLength={dataLength}
    >
    {filtered.length > 0 &&filtered.map(member=> {
      return (
        <div className={styles.member} key={member.id}>
          <UserPic size={42} image={member.image&&FILES+member.image.source}/>
          <p className={styles.name}>{member.firstName} {member.lastName}</p>
          <p className={classNames(styles.status, styles[member.activityStatus])}>{member.activityStatus}</p>
        </div>
      )
    })
    ||
    <P useThemeColor className={'empty'}>Участников не найдено</P>
    }
  </InfiniteScroll>
  </div>)

  return (<ModalLayout mobileFullScreen className={styles.modalLayout}>
    <ModalBody className={styles.modalBody}>
      {top}
      {body}
    </ModalBody>
  </ModalLayout>)
}