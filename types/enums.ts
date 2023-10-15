

export enum ModalType {
  RegistrationModal = 'registrationModal',
  SpecializationModal = 'specializationModal',
  SkillsModal = 'skillsModal',
  LanguageModal = 'languageModal',
  SourcesModal= 'sourcesModal',
  CvVcOptionsModal = 'cvOptionsModal',
  ProposalModal= 'proposalModal',
  ProposalTextModal= 'proposalTextModal',
  ConfirmModal= 'confirmModal',
  VcResponsesFilterModal= 'vcResponsesFilterModal',
  CongratulationsModal = 'congratulationsModal',
  CreateNewCommunityModal= 'createNewCommunityModal',
  EditCommunityModal='editCommunityModal',
  CommunityNewsViewModal = 'communityNewsViewModal',
  MediaItemActionsModal = 'mediaItemActionsModal',
  CreateCommunityArticleModal = 'createCommunityArticleModal',
  MembersModal = 'membersModal',
  DetailsModal = 'detailsModal'
}

export enum SnackbarType {
  error,
  success,
}

export enum CookiesType {
  accessToken = 'accessToken',
  sessionId = 'x-session',
  uuid = 'uuid',
  address = 'address',
  profileType = 'profile-type',
  language = 'language'
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
  Manager = 'manager',
  Admin = 'admin',
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

export enum WorkExperiencePresense {
  Present = 'present',
  Absent = 'absent',
}

export enum WorkExperience {
  From1to3 = 'from1to3',
  From3to6 = 'from3to6',
  From6 = 'from6',
}


export enum HirerRolePermission {
  ChangeEmail = 'changeEmail',
  ChangePassword = 'changePassword',
  ViewStats = 'viewStats',
  CreateVacancies = 'createVacancies',
  ManageApplications = 'manageApplications',
  EditCompanyProfile = 'editCompanyProfile',
  EditCompanyBlog = 'editCompanyBlog'
}

export enum CategoryType {
  News = 'news',
  Course = 'course',
  CourseNews = 'courseNews',
  CourseCompilation = 'courseCompilation'
}

export enum AcceptApplicationType {
  PhoneInterview = 'phoneInterview',
  Interview = 'interview',
  WorkApplication = 'workApplication',
  GoingToWork = 'goingToWork',
  Esmitate = 'esmitate'
}

export enum PatternTypes {
  Interview = 'interview',
  InfoRequest = 'infoRequest',
  Rejection = 'rejection'
}

export enum  DataNotifyType {
  UserRegistered = 'userRegistered',
  ChatMessage = 'chatMessage',
  NewApplication = 'newApplication',
  NewProposal = 'newProposal'

}
  
export enum ProposalRequestType {
  New = 'new',
  Rejection = 'rejection',
  Interview = 'interview',
  InfoRequest = 'infoRequest',
}

export enum ApplicationBSSelectType {
  ThisVacancy= 'thisVacancy',
  AnotherVacancy = 'anotherVacancy',
  Reject = 'reject'
}

export enum ApplicationStatus {
  Applied = 'applied',
  Accepted = 'accepted',
  Rejected = 'rejected',
}

export enum CourseStepAnswerType {
  Multiple= 'multiple',
  Single = 'single'
}

export enum CoursesStepType {
  Info= 'info',
  Question ='question'
}

export enum MessageType  {
  Text = 'text',
  Asset = 'asset',
  Application = 'application',
  Proposal = 'proposal',
  Voice = 'voice'
}

