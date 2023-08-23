export enum ModalType {
  RegistrationModal = 'registrationModal',
  SpecializationModal = 'specializationModal'
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




