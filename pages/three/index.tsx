import ThreePage from 'components/for_pages/three/Page'
// import dynamic from 'next/dynamic'
// const ThreePage = dynamic(()=>import('components/for_pages/three/Page'), {ssr: false})



interface Props {
}

export default function Three(props: Props) {
  return (
    <div>
        <ThreePage/>
    </div>
  )
}