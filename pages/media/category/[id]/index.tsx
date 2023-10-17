import { IArticle } from 'data/interfaces/IArticle'
import ArticlesRepository from 'data/repositories/ArticlesRepository'
import { useEffect } from 'react'
import { CookiesType } from 'types/enums'


interface Query {
  id: string
  articles: IArticle[]
}


interface Props extends Query {
}

export const getServerSideProps = (async (context: { query: Query; req: { cookies: { [x: string]: any } } }) => {
  const {id} = context.query  
  const profileType = context.req.cookies[CookiesType.profileType]
  const language = context.req.cookies[CookiesType.language]
  const token = context.req.cookies[CookiesType.accessToken]
  if(profileType && language) {
    // try{
      const articles = await ArticlesRepository.getNews(null, {categories: Number(id)})
      // const idInt = Number(id)
      // const course = await CoursesRepository.getCourseById(idInt, token)
      // const modules = await CoursesRepository.getCourseModules(idInt, language, token)
      // const blocks = await CoursesRepository.getCourseBlock(profileType, language, idInt, token).then(res=>res.data)
      return {props: {id, articles: articles.data}}
    // }
    // catch(err){
      // return {props: {id}}
    // }
  }
}) 

export default function Category(props: Props) {

  useEffect(()=>{
    ArticlesRepository.getNews(null, {categories: Number(props.id)})
    .then(res=> {
      
    })
    

  }, [])



  return (<div> 
    {props.id}

  </div>)
}