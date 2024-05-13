import translateEnum from './translations'

export enum ModalType {
  RegistrationModal = 'registrationModal',
  SpecializationModal = 'specializationModal',
  SkillsModal = 'skillsModal',
  LanguageModal = 'languageModal',
  SourcesModal= 'sourcesModal',
  OptionsModal = 'optionsModal',
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
  DetailsModal = 'detailsModal',
  ChatsFolderModal = 'chatsFolderModal',
  AddPortfolioModal='addPortfolioModal',
  StoriesViewerModal = 'storiesViewerModal',
  MediaCategoryModal= 'mediaCategoryModal',
  MobileSideBarModal = 'mobileSideBarModal',
  ResponseModal= 'responseModal',
  ImageViewerModal = 'imageViewerModal',
  ChatFilterModal = 'chatFilterModal',
  CourseFeedbackModal = 'courseFeedbackModal',
  ApplicationModal = 'applicationModal',
  ApplicationSuccessModal = 'applicationSuccessModal',
  SearchFilterModal = 'searchFilterModal',
  AddPersonalBlockModal = 'addPersonalBlockModal',
  RecruitingFiltersModal = 'recruitingFiltersModal',
  CoursesCategoriesModal = 'coursesCategoriesModal',
  UserImageModal = 'userImageModal',
  BackgroundPickModal = 'backgroundPickModal',
  NewPasswordModal = 'newPasswordModal',
  ProfileTypeSwitcher = 'profileTypeSwitcher',
  CompensationModal = 'compensationModal',
  ChangeLanguageModal= 'changeLanguageModal',
  CountryModal = 'countryModal',
  CityModal = 'cityModal',
  BackgroundSwitchModal = 'backgroundSwitchModal',
  PurchasePreviewModal = 'purchasePreviewModal',
  RefillBalanceModal = 'refillBalanceModal',
  CharacterCartModal = 'characterCartModal',
  AlertModal = 'alertModal',
  SearchModal = 'searchModal',
  AddFavoritesFolder = 'AddFavoritesFolder',
  FavoritesSettingModal = 'FavoritesSettingModal',
  ChooseFolderToSave = 'ChooseFolderToSave',
  HirerFieldsModal = 'hirerFieldsModal',
  SalaryModal = 'salaryModal',
  ForwardMessageModal = 'forwardMessageModal',
}

export enum AppTheme {
  Light= 'light',
  Dark= 'dark',
  Beer= 'beer',
  Dracula= 'dracula',
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
  language = 'language',
  NEXT_LOCALE = 'NEXT_LOCALE',
  theme='theme',
  
}

export enum PaymentType {
  CARD= 'bankCard',
  CRYPTO = 'crypto'
}

export enum LocalStorageKey {
  addresses = 'addresses',
  currentAddressId = 'currentAddressId'
}
export enum Preset {
  //80
  smallIconResize,
  smallIconCrop,

  //150
  iconResize,
  iconCrop,

  //300
  xsResize,
  xsCrop,

  //400
  sResize,
  sCrop,

  //600
  smResize,
  smCrop,

  //800
  mdResize,
  mdCrop,
  
  //1000
  bannerResize,
  bannerCrop,

  //1200
  lgResize,
  lgCrop,

  //1800
  xlResize,
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
  // Commission = 'commission',
  // Gybrid = 'gybrid',
  // Piecework = 'piecework',
  Contract = 'contract'
}

export const CompensationTypeTranslated = translateEnum(CompensationType, [/*'Оклад', 'Комиссия', 'Гибрид(оклад + процент)', 'Сдельная',*/ 'Договорная'])

export enum Currency {
  RUB = 'RUB',
  USD = 'USD',
  EUR = 'EUR',
  GRN = 'UAH'
}

export enum EducationTypes {
  No= 'no',
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
  NoExperience = 'noExperience',
  From1to3 = 'from1to3',
  From3to6 = 'from3to6',
  From6 = 'from6',
}

export const WorkExperienceTranslate = translateEnum(WorkExperience, ['Без опыта', '1-3 года', '3-6 лет', 'от 6 лет'])


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
  CourseCompilation = 'courseCompilation',
  Knowledge = 'knowledge',
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
  Consider = 'consider',
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

export enum PersonalBlockType {
  Text = 'text',
  Image = 'image',
  Gallery = 'gallery',
  Video = 'video',
  Location = 'location',
  Separator = 'separator',
  Banner = 'banner',
  Social = 'social',
  Columns = 'columns',
  Collage = 'collage',
  VideoText = 'videoText',
  Html = 'html',
  Divider='divider'
}

export enum LoginType {
  Phone= 'phone',
  Email = 'email'
}

export enum TariffType {
  Standard='standard',
  StandardPlus = 'standard_plus',
  Vip='vip',
}

export enum ModerationStatusType {
  Moderation = 'moderation',
  ManualModeration = 'manualModeration',
  Rejected = 'rejected',
  Approved = 'approved'
}

export enum InterfaceLanguage {
  English= 'en',
  Russian='ru',
  Ukranian='ua'
}

export enum SearchIn {
  Name = 'name',
  Company = 'company'
}

export enum PurchaseType {
  Character = 'character',
  CharacterItem = 'characterItem',
  VacancyTariff = 'vacancyTariff',
  CvTariff = 'cvTariff',
  ContactsOpen = 'contactsOpen',
  AddContactsOpen = 'addContactsOpen',
  PersonalPage = 'personalPage'
}

