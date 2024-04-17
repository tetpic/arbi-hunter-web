import styles from './index.module.scss'
import ContentLayout from '@/components/layout/ContentLayout'





interface Props {
}

export default function TestStand(props: Props) {
    // console.count('page refreshed')


  return (
    <ContentLayout >
      <div className={styles.root}></div>
    </ContentLayout>
  )
}