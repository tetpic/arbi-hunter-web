export enum FilterItems {
  Experience = 'experience',
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
