import { IThreeModelProps } from 'components/ui/ThreeModel'
import styles from './index.module.scss'
import ThreeModelVariant from '..'
import { useEffect, useRef, useState } from 'react'
import Button from 'components/ui/Button'

interface Props {
}

function generateVariants(obj: {[key: string]: number[]}) {
  const entries = Object.entries(obj)
  const combinations: any[] = []
  entries.forEach(([k, v]) => {
    v.forEach((el: any)=> {
      combinations.push({
        model: 'man', 
        face: 0,
        body: 0,
        head: 0,
        eye: 0, 
        hair: 0,
        [k]: el, 
       })
    })
  })
  return combinations
} 

const nodesVariants = {
  face: [0, 1],
  cap:[0,1,2,3],
  head: [0,1,2,3,4,5,6,7,8],
  glasses: [0,1,2,3],  
  chain: [0,1,2,3,4,5],
  jacket: [0,1,2,3,4,5,6],
  hair: [0, 1, 2, 3, 5],
}

export default function ThreePage(props: Props) {

  const [page, setPage] = useState<number>(0)
  const [combinations, setCombinations] = useState<any[]>([])
  const generatedRef = useRef(generateVariants(nodesVariants))



  // function generateCombinations(obj: any) {
  //   const keys = Object.keys(obj)
  //   const combinations: any[] = []
  
  //   function backtrack(combination: any, index: number) {
  //     if (index === keys.length) {
  //       combinations.push({ ...combination })
  //       return
  //     }
  
  //     const key = keys[index]
  //     const values = obj[key]
  
  //     for (const value of values) {
  //       combination[key] = value
  //       backtrack(combination, index + 1)
  //     }
  //   }
  //   backtrack({}, 0)
  //   return combinations
  // }



  useEffect(()=>{
    setCombinations(generatedRef.current.slice(page*10, (page*10)+10))
  }, [page])

  const variant4: IThreeModelProps = {
    model: 'woman',
    body: 0,
    bodyVariant: 0,
    hair: 0,
    cap: 0,
    chain: 0,
    chainVariant: 0,
    face: 0,
    glasses: 0, 
    jacket: 0,
    jacketVariant: 0,
    eye: 0
  }

  return (<>
  <div className={styles.buttons}>
    <Button className={styles.btn}  onClick={()=>page > 0&&setPage(page-1)}>Предыдущая страница</Button>
    <p>страница {page}</p>
    <Button className={styles.btn} onClick={()=>page+1 < (~~generatedRef.current.length/10)&&setPage(page+1)}>Следующая страница</Button>
  </div>
  <div className={styles.root}> 
  
    {combinations&&combinations.map(el=> {
      return (<ThreeModelVariant {...el}/>)
    })}
    
  </div>
    </>
  )
}
