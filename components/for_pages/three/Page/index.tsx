import { IThreeModelProps } from 'components/ui/ThreeModel'
import styles from './index.module.scss'
import ThreeModelVariant from '..'
import { useEffect, useRef, useState } from 'react'
import Button from 'components/ui/Button'

interface Props {
}

function generateVariants(obj: {[key: string]: number[]}, type: 'man'|'woman') {
  const entries = Object.entries(obj)
  const combinations: any[] = []
  const [size, ...params] = entries
  size[1].forEach(s=> {
    params.forEach(([k, v]) => {
      v.forEach((el: any)=> {
        combinations.push({
          model: type,
          face: 0,
          body: s,
          head: 0,
          eye: 0, 
          hair: k==='cap'?0:1,
          // jacket: 5,
          size: s,
          [k]: el, 
        })
      })
    })
  })
  return combinations
} 


// cap меняют почему-то расположение моделей относительно камеры
const nodesVariants = {
  size: [0,1,2],
  // body: [0],
  face: [0,1],
  head: [0,1,2],
  glasses: [0,1,2,3],  
  chain: [0,1,2,3,4,5],
  jacket: [0,1,2,3,4,5,6],
  hair: [0,1,2,3,5],
  cap:[0,1,2,3],
}

const womanNodesVariants = {
  size: [0,1,2],
  // body: [0],
  head: [0,1],
  face: [0],
  // cap: [0,1,2,3],
  chain: [0,1,2,3,4],
  glasses: [0,1,2,3],
  hair: [0,1,2,3,4,5,6,7,8],
  jacket: [0,1,2,3,4,5],
}

export default function ThreePage(props: Props) {

  const [page, setPage] = useState<number>(0)
  const [combinations, setCombinations] = useState<any[]>([])
  const generatedRef = useRef([...generateVariants(nodesVariants, 'man'), ...generateVariants(womanNodesVariants, 'woman')])



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
    model: 'man',
    body: 1,
    size: 1,
    hair: 1,
    // cap: 0,
    chain: 1,
    face: 0,
    glasses: 1, 
    jacket: 1,
    eye: 0,
    head: 0,
    color: 1,
  }


  return (<>
  <div className={styles.buttons}>
    <Button className={styles.btn}  onClick={()=>page > 0&&setPage(page-1)}>Предыдущая страница</Button>
    <p>страница {page}</p>
    <Button className={styles.btn} onClick={()=>page+1 < (~~generatedRef.current.length/10)&&setPage(page+1)}>Следующая страница</Button>
  </div>
  <div className={styles.root}> 
  
    {combinations&&combinations.map(el=> {
      return (
        <ThreeModelVariant {...el}/>
      )
    })} 
    
  </div>
    </>
  )
}
