export enum FilterItems {
  Experience = 'experienceInfo',
  Age = 'age',
  Education = 'education',
  Gender = 'gender',
  New = 'onlyNew'
}



export interface FilterItem {
  // active: boolean, 
  type: FilterItems
  items?: string[], 
  translatedItems?: string[]
  translatedActiveItem?: string
  activeItem?: string|null
  translation: string
}
