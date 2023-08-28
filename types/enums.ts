export enum ModalType {
  RegistrationModal = 'registrationModal',
  SpecializationModal = 'specializationModal',
  SkillsModal = 'skillsModal',
  LanguageModal = 'languageModal'
}

export enum SnackbarType {
  error,
  success,
}

export enum CookiesType {
  accessToken = 'accessToken',
  sessionId = 'x-session',
  uuid = 'uuid',
  address = 'address'
}

export enum LocalStorageKey {
  addresses = 'addresses',
  currentAddressId = 'currentAddressId'
}

export enum Preset {
  /** 250px */
  xsResize,
  /** 250px */
  xsCrop,

  /** 500px */
  smResize,
  /** 500px */
  smCrop,

  /** 800px */
  mdResize,
  /** 800px */
  mdCrop,

  /** 1200px */
  lgResize,
  /** 1200px */
  lgCrop,

  /** 1800px */
  xlResize,
  /** 1800px */
  xlCrop,
}


export enum FileUploadAcceptType {
  Image = 'image',
  Video = 'video',
  Document = 'document',
  Scan = 'scan',
  Media = 'media',
  Archives = 'archives'
}

export enum Genders {
  Male = 'male',
  Female = 'female'
}

export enum Answer {
  Yes = 'yes',
  No = 'no'
}

export enum CompensationType {
  Salary = 'salary',
  Commission = 'commission',
  Gybrid = 'gybrid',
  Piecework = 'piecework',
  Contract = 'contract'
}

export enum Currency {
  RUB = 'RUB',
  USD = 'USD',
  EUR = 'EUR',
}

export enum EducationTypes {
  Secondary= 'secondary',
  SecondarySpecial= 'secondarySpecial',
  IncompleteHigher= 'incompleteHigher',
  Higher= 'higher',
  Bachelor= 'bachelor',
  Master= 'master',
  PhD= 'PhD',
  Doctor= 'doctor',
}

export enum LanguagesLevel {
  Elementary = 'elementary', 
  Intermediate = 'intermediate', 
  Advanced = 'advanced', 
  Proficient = 'proficient'
}

export enum Languages {
  en ='en',
  de ='de',
  fr ='fr',
  cs ='cs',
  nl ='nl',
  et ='et',
  pt ='pt',
  it ='it',
  ja ='ja',
  ko ='ko',
  lv ='lv',
  es ='es',
  uk ='uk',
  zh ='zh',
  ru ='ru',
}


export enum VacancyLookType {
  ActivelyLooking = 'activelyLooking',
  PassivelyLooking = 'passivelyLooking',
  NotLooking = 'notLooking'
}

export enum  EmploymentType {
  PartTime = 'partTime',
  FullTime = 'fullTime',
  Project = 'project',
}

export enum ScheduleType {
  FullDay = 'fullDay', 
  Flexible = 'flexible', 
  Remote = 'remote'
}

export enum HirerRole {
  Admin = 'admin',
  Manager = 'manager'
}

export enum ActivityStatus {
  Online = 'online',
  Offline = 'offline'
}


export enum LanguageKnowLevel {
  Beginner = 'elementary',
  Intermediate = 'intermediate',
  Advanced = 'advanced',
  Professional = 'proficient',
}


