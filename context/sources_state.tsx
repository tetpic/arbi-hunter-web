import { ISource } from 'data/interfaces/Common'
import SourceRepository from 'data/repositories/SourceRepository'
import { createContext, useContext, useState } from 'react'

export type SourceType = 'vertical' | 'geos' | 'source'

interface IState {
  geos: Map<number, ISource>
  verticals: Map<number, ISource>
  sources: Map<number, ISource>
  init: (list?: SourceType[]) => void
}

const SourcesContext = createContext<Partial<IState>>({})

interface Props {
  children: React.ReactNode
}

export function SourcesWrapper(props: Props) {
  const [geos, setGeos] = useState<Map<number, ISource>>(new Map)
  const [verticals, setVerticals] = useState<Map<number, ISource>>(new Map)
  const [sources, setSources] = useState<Map<number, ISource>>(new Map)


  const getSources = async(type: SourceType) => {
    switch (type) {
      case 'geos':
        const geosList = await SourceRepository.getGeos()
        if(geosList) {
          setGeos(new Map(geosList.data.map(el=>[el.id, el])))
        }
        break
      case 'vertical':
        const verticalsList = await SourceRepository.getVerticals()
        if(verticalsList) {
          setVerticals(new Map(verticalsList.data.map(el=>[el.id, el])))
        }
        break
      case 'source':
        const sourcesList = await SourceRepository.sourcesList()
        if(sourcesList) {
          setSources(new Map(sourcesList.data.map(el=>[el.id, el])))
        }
        break
    }
  }


  const init = async (list?: SourceType[]) => {
    if(list && list.length>0) {
      list.forEach(el => {
        getSources(el)
      })
    }
    else {
      const [s, g, v] = await Promise.all([SourceRepository.sourcesList(), SourceRepository.getGeos(), SourceRepository.getVerticals()])
      if(s) {
        setSources(new Map(s.data.map(el=>[el.id, el])))
      }
      if(g) {
        setGeos(new Map(g.data.map(el=>[el.id, el])))
      }
      if(v) {
        setVerticals(new Map(v.data.map(el=>[el.id, el])))
      }

    }
  }


  const value: IState = {
    geos,
    verticals,
    sources,
    init
  }

  return (
    <SourcesContext.Provider value={value}>
      {props.children}
    </SourcesContext.Provider>
  )
}

export function useSourcesContext() {
  return useContext(SourcesContext)
}
