import ThreePage from 'components/for_pages/three/Page'
import ContentLayout from 'components/layout/ContentLayout'
// import dynamic from 'next/dynamic'
// const ThreePage = dynamic(()=>import('components/for_pages/three/Page'), {ssr: false})



interface Props {
}

export default function Three(props: Props) {
  return (
    <ContentLayout>
      <ThreePage/>
    </ContentLayout>
  )
}