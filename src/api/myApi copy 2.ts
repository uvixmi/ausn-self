/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** AccountCredentials */
export interface AccountCredentials {
  /**
   * Login
   * Логин от учетной записи
   */
  login: string
  /**
   * Password
   * Пароль от учетной записи
   */
  password: string
}

/** AccountDetails */
export interface AccountDetails {
  /**
   * Account Number
   * Номер счета пользователя. Обязателен для заполнения, если integration_type = 1. Также обязателен при прямом добавлении счета.
   */
  account_number?: string | null
  /**
   * Bank Bik
   * БИК банка. Обязателен для заполнения, если integration_type = 1 или 3. Также обязателен при прямом добавлении счета.
   */
  bank_bik: string
}

/** AccountIntegrationType */
export enum AccountIntegrationType {
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
}

/** BRNOkResponse */
export interface BRNOkResponse {
  /** Status */
  status: string
}

/** BankReferenceResponse */
export interface BankReferenceResponse {
  /**
   * Bik
   * БИК банка
   */
  bik: string
  /**
   * Bank Name
   * Наименование банка
   */
  bank_name: string
  /**
   * Bank Short Name
   * Короткое наименование банка
   */
  bank_short_name?: string | null
  /**
   * Cor Account
   * Корреспондентский счет
   */
  cor_account: string
}

/** BannerType */
export enum BannerType {
  UpdateData = "update_data",
  UpdateUserInfo = "update_user_info",
  NewUser = "new_user",
  Advertisement = "advertisement",
}

/** Body_create_client_marketplace_sources_marketplace_post */
export interface BodyCreateClientMarketplaceSourcesMarketplacePost {
  /**
   * Date Begin
   * Дата с которой необходимо подгружать отчеты по реализации
   */
  date_begin?: string | null
  /**
   * Shop Id
   *
   *                     Идентификатор магазина.
   *                     Обязательно для заполнения, если source_name = ozon или ya_market:
   *                     Для Ozon = Seller ID
   *                     Для Яндекс Маркет = ID магазина
   *
   */
  shop_id?: string | null
  /**
   * Password
   *
   *                     Пароль / токен доступа.
   *                     Обязательно для заполнения, если sync_type = 2
   *
   */
  password?: string | null
  /**
   * Saldo
   * Сумма, еще не поступившая на банковский счет от МП за предыдущий период. Не передается, если сальдо = 0. Отправляется только sync_type = 2, source_name = ozon или wbn
   */
  saldo?: number | null
  /**
   *
   *                     Тип синхронизации. Возможные значения:
   *
   *                     1 - Отчет по реализации (как при подгрузке табличной формы)
   *                     2 - API МП (как при автозагрузке по API)
   *                     3 - OAuth 2.0 (для последующей генерации ссылки)
   */
  sync_type: MarketplaceType
  /**
   *
   *                     Наименование маркетплейса
   *
   *                     Возможные варианты:
   *                         - если sync_type = 1:
   *                             - ozon
   *                             - wb
   *                         - если sync_type = 2:
   *                             - ozon
   *                             - wb
   *                         - если sync_type = 3:
   *                             - ya_market
   *
   */
  source_name: MarketplaceName
  /**
   * Marketplace File
   * Файл с отчетом по реализации из файла xlsx, закодированный в base64
   * @format binary
   */
  marketplace_file?: File
}

/** Body_create_client_ofd_sources_ofd_post */
export interface BodyCreateClientOfdSourcesOfdPost {
  /** Тип синхронизации. Возможные значения: 1 - Отчет по чекам (как при подгрузке табличной формы). 2 - API ОФД (как при автозагрузке) */
  ofd_type: OFDType
  /** Наименование ОФД. Возможные значения: Первый ОФД. ОФД.ру. Платформа ОФД. Яндекс ОФД. СБИС ОФД. Такском ОФД. Контур ОФД.Обязателен при source_type = ofd */
  ofd_source: OFDSource
  /**
   * Ofd File
   * Файл выгрузки по чекам. Обязателен для заполнения, если ofd_type = 1
   * @format binary
   */
  ofd_file?: File
}

/** Body_create_operations_from_file_operations_file_post */
export interface BodyCreateOperationsFromFileOperationsFilePost {
  /**
   * Account File
   * Файл с банковской выгрузкой формата .txt.
   * @format binary
   */
  account_file: File
}

/** Body_login_auth_post */
export interface BodyLoginAuthPost {
  /** Grant Type */
  grant_type?: string | null
  /** Username */
  username: string
  /** Password */
  password: string
  /**
   * Scope
   * @default ""
   */
  scope?: string
  /** Client Id */
  client_id?: string | null
  /** Client Secret */
  client_secret?: string | null
}

/**
 * ChangeTax
 * @example {"rate_reason":"01.200010002","reason_type":"nothing","tax_rate":3,"tax_system":"usn_d","year":2023}
 */
export interface ChangeTax {
  /**
   * Year
   * Год настройки СНО
   */
  year: number
  /** Система налогообложения. Возможные значения: usn_d - УСН Доходы. usn_d_r - УСН Доходы-Расходы. patent - Патент. eshn - ЕСХН. osn - Общая система НО.  */
  tax_system: TaxSystemType
  /**
   * Tax Rate
   * Налоговая ставка. Возможные значения: tax_system = usn_d - от 0 до 6. tax_system = usn_d_r - от 0 до 15.
   */
  tax_rate?: number | null
  /**
   * Rate Reason
   * Обоснование сниженной налоговой ставки. Формат XXXXYYYYZZZZ, где: XXXX - номер статьи, в которой указана сниженная ставка. YYYY - номер пункта. ZZZZ - номер подпункта. Допускаются цифры и символы.НЕ допускаются пробелы. Обязательно к заполнению, если передано: tax_system = usn_d И tax_rate < 6 ИЛИ tax_system = usn_d_r И tax_rate < 15
   */
  rate_reason?: string | null
  /** Причина снижения ставки. Возможные значения: crimea - Предприниматели Крыма и Севастополя. holidays - ИП на налоговых каникулах. */
  reason_type?: RateReasonType | null
}

/** ContributionsInfo */
export interface ContributionsInfo {
  /** Блок Фиксированные взносы */
  fixed_fees: FixedFeesInfo
  /** 1% с дохода */
  income_percentage?: IncomePercentage | null
}

/** CreateAccountIntegration */
export interface CreateAccountIntegration {
  /** Тип интеграции счета. Возможные значения: 1 - Директ-банк. 2 - API-метод. 3 - ЛК банка.  */
  integration_type: AccountIntegrationType
  /** Данные для доступа к подключению счета. Необязательно для API-метода. */
  account_credentials?: AccountCredentials | null
  /** Информация по счету пользователя. Необязательно для API-метода */
  account_details?: AccountDetails | null
}

/** CreateAccountResponse */
export interface CreateAccountResponse {
  /** Start Date */
  start_date?: string | null
  /** End Date */
  end_date?: string | null
  /** Account Number */
  account_number?: string | null
  /** Bank Name */
  bank_name?: string | null
  /** Bank Short Name */
  bank_short_name?: string | null
  /** Bank Bik */
  bank_bik?: string | null
  /**
   * Request Id
   * @format uuid
   */
  request_id: string
  /** Source Id */
  source_id?: string | null
}

/**
 * CreateOperation
 * @example {"amount":25000.9,"category":"debet","counterparty_name":"ИП Варягин","date":"2023-10-30","doc_number":"123","operation_type":1,"purpose":"Доход от продажи оборудования"}
 */
export interface CreateOperation {
  /** Признак дебетования. = credit - списание с расчетного счета клиента. = debet - поступление на расчетный счет клиента */
  category: OperationCategory
  /**
   * Operation Type
   * Признак налоговой базы. Возможные значения: Если category = debet: 1 - Доход. 2 - Не влияет на налоговую базу. Если category = credit: 2 - Не влияет на налоговую базу. 3 - Возврат покупателю.
   */
  operation_type: 1 | 2 | 3
  /**
   * Counterparty Name
   * Наименование контрагента
   */
  counterparty_name: string
  /**
   * Purpose
   * Назначение платежа
   */
  purpose: string
  /**
   * Amount
   * Сумма операции
   */
  amount: number
  /**
   * Date
   * Дата совершения операции
   * @format date
   */
  date: string
  /**
   * Doc Number
   * Номер документа
   */
  doc_number?: string | null
}

/** CreateSourceResponse */
export interface CreateSourceResponse {
  /**
   * Request Id
   * @format uuid
   */
  request_id: string
  /** Source Id */
  source_id?: string | null
}

/** CreateTaxPaymentOperation */
export interface CreateTaxPaymentOperation {
  /**
   * Date
   * Дата совершения операции
   * @format date
   */
  date: string
  /**
   * Doc Number
   * Номер документа
   */
  doc_number?: string | null
  /**
   * Tax Period
   * Год уплаты налога
   */
  tax_period: number
  /** Тип налога. Возможные значения: 1 - УСН. 2 - фиксированные взносы за ИП. 3 - 1% с дохода сверх 300 000 руб. 4 - ЕНС.  */
  tax_type: TaxType
  /** Amount */
  amount: number
}

/**
 * CreateTaxPaymentOperationsRequest
 * @example {"tax_payments":[{"amount":25000.9,"date":"2023-10-30","doc_number":"123","tax_period":2023,"tax_type":1}]}
 */
export interface CreateTaxPaymentOperationsRequest {
  /**
   * Tax Payments
   * Уплаты налога
   */
  tax_payments: CreateTaxPaymentOperation[]
}

/** CreateUser */
export interface CreateUser {
  /**
   * Email
   * Электронная почта пользователя
   */
  email: string
  /**
   * Phone Number
   * Номер телефона пользователя
   */
  phone_number?: string | null
}

/**
 * CreateUserLead
 * @example {"phone_number":"+79114651111","reason":"ens"}
 */
export interface CreateUserLead {
  /**
   * Phone Number
   * Телефон пользователя
   */
  phone_number?: string | null
  /** Причина интереса пользователя */
  reason: LeadReason
  /**
   * Description
   * Описание интереса пользователя
   */
  description?: string | null
}

/** DisableSource */
export interface DisableSource {
  /**
   * Disable Date
   * Дата отключения интеграции. Необязательна, если отключается источник с ошибкой
   */
  disable_date?: string | null
  /**
   * Source Id
   * ID отключаемого источника
   */
  source_id: string
}

/** DueDate */
export interface DueDate {
  /**
   * Year
   * Отчетный год
   */
  year: number
  /**
   * Date
   * Cрок действия по задачи по указанному отчетному году
   * @format date
   */
  date: string
}

/** ENSBalanceInfo */
export interface ENSBalanceInfo {
  /**
   * Opening Balance
   * Сальдо на 01.01
   */
  opening_balance: number
  /**
   * Closing Balance
   * Сальдо конечное
   */
  closing_balance: number
}

/** ENSInfo */
export interface ENSInfo {
  /**
   * Purpose
   * Назначение платежа
   * @default "Единый налоговый платеж"
   */
  purpose?: string
  /**
   * Receiver Inn
   * ИНН получателя
   * @default "7727406020"
   */
  receiver_inn?: string
  /**
   * Receiver Kpp
   * КПП получателя
   * @default "770801001"
   */
  receiver_kpp?: string
  /**
   * Receiver Bank Name
   * Наименование банка получателя
   * @default "ОТДЕЛЕНИЕ ТУЛА БАНКА РОССИИ//УФК по Тульской области, г Тула"
   */
  receiver_bank_name?: string
  /**
   * Receiver Bank Bik
   * БИК банка получателя
   * @default "017003983"
   */
  receiver_bank_bik?: string
  /**
   * Receiver Cor Account
   * Корр. счет банка получателя
   * @default "40102810445370000059"
   */
  receiver_cor_account?: string
  /**
   * Receiver Name
   * Наименование получателя
   * @default "Казначейство России (ФНС России)"
   */
  receiver_name?: string
  /**
   * Receiver Account
   * Номер счета получателя
   * @default "03100643000000018500"
   */
  receiver_account?: string
  /**
   * Kbk
   * Код бюджетной классификации
   * @default "18201061201010000510"
   */
  kbk?: string
}

/** FixedFeesInfo */
export interface FixedFeesInfo {
  /**
   * Accrued Ff
   * Начислены фикс. взносы
   */
  accrued_ff: number
  /**
   * Paid Ff
   * Уплачено фикс. взносов
   */
  paid_ff: number
  /**
   * Due Ff
   * Фикс. взносы к уплате
   */
  due_ff: number
  /**
   * Due Date Ff
   * Дата уплаты фикс. взносов. Всегда первый рабочий день года.
   * @format date
   */
  due_date_ff: string
}

/**
 * GenerateENSOrder
 * @example {"account_number":"40702810845370000004","amount":17800.55,"purpose":"Единый налоговый платеж"}
 */
export interface GenerateENSOrder {
  /**
   * Account Number
   * Номер счета списания
   */
  account_number: string
  /**
   * Purpose
   * Назначение платежа
   */
  purpose: string
  /**
   * Amount
   * Сумма операции
   */
  amount: number
}

/**
 * GenerateReportsRequest
 * @example {"period_type":1,"period_year":2023,"report_type":2}
 */
export interface GenerateReportsRequest {
  /** Тип запрашиваемого отчета. Возможные значения: 2 - Уведомления об исчисленных авансовых платежах по УСН. 3 - Налоговая декларация УСН.  */
  report_type: ReportType
  /** Тип налогового периода. Возможные значения: 1 - 1 квартал. 2 - 2 квартал. 3 - 3 квартал. 4 - 4 квартал. 6 - полугодие. 9 - 9 месяцев. 0 - весь год. Для Уведомления возможен выбор только 1-3 кварталов. Для декларации только 0 (весь год) */
  period_type: ReportPeriodType
  /**
   * Period Year
   * Год налогового периода
   */
  period_year: number
}

/** GetOperationsRequest */
export interface GetOperationsRequest {
  /**
   * Start Date
   * Начало периода совершения операций
   */
  start_date?: string | null
  /**
   * End Date
   * Окончание периода совершения операций
   */
  end_date?: string | null
  /**
   * Operations Types
   * Вид операции. Обязателен при использовании параметров description1 - доход. 2 - не влияет на налоговую базу. 3 - возврат покупателю. 4 - уплата налогов/взносов.
   */
  operations_types?: OperationType[] | null
  /**
   * Sources Ids
   * Идентификаторы источников данных
   */
  sources_ids?: string[] | null
  pagination: OperationsPagination
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[]
}

/** IncomePercentage */
export interface IncomePercentage {
  /**
   * Period Ip
   * Период, за который рассчитан 1% с дохода. Возможные значения: 1 - 1 квартал. 6 - полугодие. 9 - 9 месяцев. 0 - весь год.
   */
  period_ip: number
  /**
   * Accrued Ip
   * Начислен 1% с дохода за ближайший закрытый период
   */
  accrued_ip: number
  /**
   * Paid Ip
   * Уплачен 1% с дохода за за ближайший закрытый период
   */
  paid_ip: number
  /**
   * Due Ip
   * 1% с дохода к уплате за год
   */
  due_ip: number
  /**
   * Due Date Ip
   * Дата уплаты 1% с дохода (окончательная)
   * @format date
   */
  due_date_ip: string
}

/** InfoBannersResponse */
export interface InfoBannersResponse {
  /**
   * Banners
   * Информационные баннеры во всей системе
   */
  banners: UserInfoBanner[]
}

/** InnInfo */
export interface InnInfo {
  /**
   * Full Name
   * Полное имя
   */
  full_name: string
  /**
   * Lastname
   * Фамилия
   */
  lastname: string
  /**
   * Firstname
   * Имя
   */
  firstname: string
  /**
   * Patronymic
   * Отчество
   */
  patronymic?: string | null
  /**
   * Fns Code
   * Код ИФНС
   */
  fns_code: string
  /**
   * Fns Description
   * Название ИФНС
   */
  fns_description?: string | null
  /**
   * Fns Reg Date
   * Дата регистрации ИП в ФНС
   * @format date
   */
  fns_reg_date: string
}

/** InnInfoToSave */
export interface InnInfoToSave {
  /**
   * Inn
   * ИНН пользователя
   */
  inn: string
  /** Система налогообложения. Возможные значения: usn_d - УСН Доходы.  */
  tax_system: TaxSystemType
  /**
   * Tax Rate
   * Налоговая ставка. Возможные значения: tax_system = usn_d - от 0 до 6.
   */
  tax_rate: number
  /**
   * Rate Reason
   * Обоснование сниженной налоговой ставки. Формат XXXXYYYYZZZZ, где: XXXX - номер статьи, в которой указана сниженная ставка. YYYY - номер пункта. ZZZZ - номер подпункта. Допускаются цифры и символы.НЕ допускаются пробелы. Обязательно к заполнению, если передано: tax_system = usn_d И tax_rate < 6 ИЛИ tax_system = usn_d_r И tax_rate < 15
   */
  rate_reason?: string | null
  /** Причина снижения ставки. Возможные значения: crimea - Предприниматели Крыма и Севастополя. holidays - ИП на налоговых каникулах. nothing - СНО usn_d или usn_d_r (используется значение из tax_system). */
  reason_type?: RateReasonType
  /**
   * Start Year
   * Год начала расчета налогов
   */
  start_year: number
}

/** KudirFormat */
export enum KudirFormat {
  Pdf = "pdf",
  Xlsx = "xlsx",
}

/** LeadInfoToSave */
export interface LeadInfoToSave {
  /**
   * Inn
   * ИНН пользователя
   */
  inn: string
  /** Система налогообложения. Возможные значения: usn_d_r - УСН Доходы-Расходы. patent - Патент. eshn - ЕСХН. osn - Общая система НО.  */
  tax_system: TaxSystemType
  /**
   * Tax Rate
   * Налоговая ставка. Возможные значения: tax_system = usn_d_r - от 0 до 15.
   */
  tax_rate?: number | null
  /**
   * Rate Reason
   * Обоснование сниженной налоговой ставки. Формат XXXXYYYYZZZZ, где: XXXX - номер статьи, в которой указана сниженная ставка. YYYY - номер пункта. ZZZZ - номер подпункта. Допускаются цифры и символы.НЕ допускаются пробелы. Обязательно к заполнению, если передано: tax_system = usn_d И tax_rate < 6 ИЛИ tax_system = usn_d_r И tax_rate < 15
   */
  rate_reason?: string | null
  /** Причина снижения ставки. Возможные значения: crimea - Предприниматели Крыма и Севастополя. holidays - ИП на налоговых каникулах. nothing - СНО usn_d или usn_d_r (используется значение из tax_system).Если отправляются tax_system не usn_d или usn_d_r, значение отправлять не нужно. */
  reason_type?: RateReasonType | null
  /**
   * Start Year
   * Год начала расчета налогов
   */
  start_year: number
  /**
   * Phone Number
   * Телефон пользователя
   */
  phone_number?: string | null
}

/** LeadReason */
export enum LeadReason {
  Ens = "ens",
  Marketplace = "marketplace",
  Ofd = "ofd",
  ServiceDisable = "service_disable",
  Other = "other",
}

/** MarketplaceName */
export enum MarketplaceName {
  YaMarket = "ya_market",
  Wb = "wb",
  Ozon = "ozon",
}

/** MarketplaceType */
export enum MarketplaceType {
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
}

/** MarkupModeCode */
export enum MarkupModeCode {
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
}

/** NoticeInfo */
export interface NoticeInfo {
  /**
   * Usn 1 Kv
   * Исчислено налога УСН за 1 квартал
   */
  usn_1_kv: number
  /**
   * Usn 2 Kv
   * Исчислено налога УСН за 2 квартал
   */
  usn_2_kv: number
  /**
   * Usn 3 Kv
   * Исчислено налога УСН за 3 квартал
   */
  usn_3_kv: number
  /**
   * Usn 4 Kv
   * Исчислено налога УСН за 4 квартал
   */
  usn_4_kv: number
}

/** OFDSource */
export enum OFDSource {
  ValueОФДРу = "ОФД.ру",
  ValueПервыйОФД = "Первый ОФД",
  ValueПлатформаОФД = "Платформа ОФД",
  ValueЯндексОФД = "Яндекс ОФД",
  ValueСБИСОФД = "СБИС ОФД",
  ValueТакскомОФД = "Такском ОФД",
  ValueКонтурОФД = "Контур ОФД",
}

/** OFDType */
export enum OFDType {
  Value1 = 1,
  Value2 = 2,
}

/** Operation */
export interface Operation {
  /**
   * Id
   * Идентификатор операции
   */
  id: string
  /**
   * Account Number
   * Номер счета операции
   */
  account_number?: string | null
  /**
   * Bank Bik
   * БИК банка клиента, по которому прошла операция
   */
  bank_bik?: string | null
  /**
   * Short Name
   * Сокращенное название
   */
  short_name?: string | null
  /**
   * Source Id
   * ID источника, по которому у клиента прошла операция
   */
  source_id: string
  /**
   * Source Name
   * Наименование источника, по счету которого у клиента прошла операция.
   */
  source_name: string
  /**
   * Counterparty Name
   * Наименование контрагента
   */
  counterparty_name: string
  /**
   * Purpose
   * Назначение платежа
   */
  purpose: string
  /**
   * Amount Doc
   * Сумма операции по документу
   */
  amount_doc: number
  /**
   * Currency Code
   * Валюта операции
   */
  currency_code?: string | null
  /** Признак дебетования. = credit - списание с расчетного счета клиента. = debet - поступление на расчетный счет клиента */
  category: OperationCategory
  /**
   * Date
   * Дата совершения операции
   * @format date
   */
  date: string
  /**
   * Признак, кто выполнил разметку операции.
   * 1 - авторазметка БРН. 2 - разметка пользователем. 3 - разметка бухгалтером.
   */
  markup_mode_code: MarkupModeCode
  /**
   * Doc Number
   * Номер документа
   */
  doc_number?: string | null
  markup: OperationMarkup
}

/** OperationCategory */
export enum OperationCategory {
  Debet = "debet",
  Credit = "credit",
}

/** OperationCreditDescription */
export enum OperationCreditDescription {
  ValueВозвратПокупателю = "Возврат покупателю",
  ValueОплатаПоставщику = "Оплата поставщику",
  ValueУплатаНалога = "Уплата налога",
  ValueРасчетыПоКредитамИЗаймам = "Расчеты по кредитам и займам",
  ValueВозвратЗаймаКонтрагенту = "Возврат займа контрагенту",
  ValueВозвратКредитаБанку = "Возврат кредита банку",
  ValueВыдачаЗаймаКонтрагенту = "Выдача займа контрагенту",
  ValueПрочиеРасчетыСКонтрагентами = "Прочие расчеты с контрагентами",
  ValueПереводНаДругойСчетОрганизации = "Перевод на другой счет организации",
  ValueСнятиеНаличных = "Снятие наличных",
  ValueПеречислениеПодотчетномуЛицу = "Перечисление подотчетному лицу",
  ValueПеречислениеЗаработнойПлатыПоВедомостям = "Перечисление заработной платы по ведомостям",
  ValueПеречислениеЗаработнойПлатыРаботнику = "Перечисление заработной платы работнику",
  ValueПеречислениеСотрудникуПоДоговоруПодряда = "Перечисление сотруднику по договору подряда",
  ValueПеречислениеДепонированнойЗаработнойПлаты = "Перечисление депонированной заработной платы",
  ValueПеречислениеДивидендов = "Перечисление дивидендов",
  ValueВыдачаЗаймаРаботнику = "Выдача займа работнику",
  ValueЛичныеСредстваПредпринимателя = "Личные средства предпринимателя",
  ValueПрочееСписание = "Прочее списание",
  ValueКомиссияБанка = "Комиссия банка",
  ValueУплатаНалогаЗаТретьихЛиц = "Уплата налога за третьих лиц",
}

/** OperationDebitDescription */
export enum OperationDebitDescription {
  ValueОплатаОтПокупателя = "Оплата от покупателя",
  ValueВозвратОтПоставщика = "Возврат от поставщика",
  ValueРасчетыПоКредитамИЗаймам = "Расчеты по кредитам и займам",
  ValueПолучениеЗаймаОтКонтрагента = "Получение займа от контрагента",
  ValueПолучениеКредитаВБанке = "Получение кредита в банке",
  ValueВозвратЗаймаКонтрагентом = "Возврат займа контрагентом",
  ValueПрочиеРасчетыСКонтрагентами = "Прочие расчеты с контрагентами",
  ValueОплатаОтФакторинговойКомпании = "Оплата от факторинговой компании",
  ValueПереводСДругогоСчета = "Перевод с другого счета",
  ValueВзносНаличными = "Взнос наличными",
  ValueИнкассация = "Инкассация",
  ValueПриобретениеИностраннойВалюты = "Приобретение иностранной валюты",
  ValueПоступленияОтПродажиИностраннойВалюты = "Поступления от продажи иностранной валюты",
  ValueПоступленияОтПродажПоПлатежнымКартамИБанковскимКредитам = "Поступления от продаж по платежным картам и банковским кредитам",
  ValueВозвратЗаймаРаботником = "Возврат займа работником",
  ValueЛичныеСредстваПредпринимателя = "Личные средства предпринимателя",
  ValueПрочееПоступление = "Прочее поступление",
}

/**
 * OperationMarkup
 * @example {"amount":500.9,"operation_type":2}
 */
export interface OperationMarkup {
  /**
   * Вид операции.
   * 1 - доход. 2 - не влияет на налоговую базу. 3 - возврат покупателю. 4 - уплата налогов/взносов.
   */
  operation_type: OperationType
  /**
   * Update Time
   * Дата обновления разметки
   */
  update_time?: string | null
  /**
   * Amount
   * Сумма, участвующая в разметке операции
   */
  amount: number
  /**
   * Commission
   * Сумма комиссии
   */
  commission?: number | null
  /** Description */
  description?: OperationDebitDescription | OperationCreditDescription | null
}

/** OperationType */
export enum OperationType {
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
}

/** OperationsPagination */
export interface OperationsPagination {
  /**
   * Page Number
   * Номер страницы
   */
  page_number: number
  /**
   * Row Count
   * Количество записей на странице
   */
  row_count: number
  /**
   * Request Id
   * Уникальный ID операции. Необходим для корректной работы фильтрации. Остается неизменным при пагинации, сбрасывается при изменении фильтров
   * @format uuid
   */
  request_id: string
}

/**
 * OperationsResponse
 * @example {"operations":[{"account_number":"40702810845370000004","amount_doc":1000.01,"category":"debet","counterparty_name":"Некоммерческая организация Потребительское общество взаимного страхования с \"Очень длинным названием\"","currency_code":"RUB","date":"2022-04-13","doc_number":"239","id":"0d8fce4c-8362-11ed-a1eb-0242ac120002","markup":{"amount":900.01,"description":"Оплата поставщику","operation_type":2},"markup_mode_code":1,"purpose":"Перевод денег на счет"}],"pages_count":7}
 */
export interface OperationsResponse {
  /**
   * Operations
   * Список операций
   */
  operations: Operation[]
  /**
   * Pages Count
   * Количество страниц
   */
  pages_count: number
}

/** PaymentOrder */
export interface PaymentOrder {
  /**
   * Uip
   * УИН/УИП
   * @default "0"
   */
  uip?: string
  /**
   * Amount
   * Сумма операции
   */
  amount: number
  /**
   * Purpose
   * Назначение платежа
   */
  purpose: string
  /**
   * Payer Inn
   * ИНН плательщика
   */
  payer_inn: string
  /**
   * Payer Kpp
   * КПП плательщика
   * @default "0"
   */
  payer_kpp?: string
  /**
   * Payer Account
   * Номер счета плательщика
   */
  payer_account: string
  /**
   * Payer Name
   * Наименование плательщика
   */
  payer_name: string
  /**
   * Payer Status
   * Статус плательщика
   * @default "01"
   */
  payer_status?: string
  /**
   * Receiver Inn
   * ИНН получателя
   * @default "7727406020"
   */
  receiver_inn?: string
  /**
   * Receiver Kpp
   * КПП получателя
   * @default "770801001"
   */
  receiver_kpp?: string
  /**
   * Receiver Bank Name
   * Наименование банка получателя
   * @default "ОТДЕЛЕНИЕ ТУЛА БАНКА РОССИИ//УФК по Тульской области, г Тула"
   */
  receiver_bank_name?: string
  /**
   * Receiver Bank Bik
   * БИК банка получателя
   * @default "017003983"
   */
  receiver_bank_bik?: string
  /**
   * Receiver Cor Account
   * Корр. счет банка получателя
   * @default "40102810445370000059"
   */
  receiver_cor_account?: string
  /**
   * Receiver Name
   * Наименование получателя
   * @default "Казначейство России (ФНС России)"
   */
  receiver_name?: string
  /**
   * Receiver Account
   * Номер счета получателя
   * @default "03100643000000018500"
   */
  receiver_account?: string
  /**
   * Kbk
   * Код бюджетной классификации
   * @default "18201061201010000510"
   */
  kbk?: string
  /**
   * Oktmo
   * ОКТМО
   * @default "0"
   */
  oktmo?: string
  /**
   * Payment Purpose
   * Основание платежа
   * @default "0"
   */
  payment_purpose?: string
  /**
   * Payment Period
   * Налоговый период
   * @default "0"
   */
  payment_period?: string
  /**
   * Document Number
   * Номер документа
   * @default "0"
   */
  document_number?: string
  /**
   * Document Date
   * Дата налогового документа
   * @default "0"
   */
  document_date?: string
}

/** RateReasonType */
export enum RateReasonType {
  Nothing = "nothing",
  Crimea = "crimea",
  TaxHolidays = "tax_holidays",
}

/** ReportFormat */
export enum ReportFormat {
  Pdf = "pdf",
  Xml = "xml",
}

/** ReportInfo */
export interface ReportInfo {
  /**
   * Code
   * Номер отчета в разделе  “Уведомления об исчисленных суммах налога”
   */
  code?: string | null
  /** Тип отчета. Возможные значения: notice_1_kv - Уведомление за 1 квартал. notice_2_kv - Уведомление за 2 квартал. notice_3_kv - Уведомление за 3 квартал. declaration - Декларация.  */
  type: TaskReportType
  /** Новый статус отчета. Возможные значения: 0 - отчет НЕ сформирован. 1 - отчет сформирован и передан клиенту. 2 - отчет принят ФНС (через ЭЦП). 3 - отчет НЕ принят ФНС. 4 - отчет принят ФНС (сдал самостоятельно). */
  report_status: ReportStatus
  /**
   * Date Update
   * Дата последнего присвоения статуса
   */
  date_update?: string | null
  /**
   * Amount
   * Сумма из “Уведомления об исчисленных суммах налога”
   */
  amount?: number | null
}

/** ReportPeriodType */
export enum ReportPeriodType {
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
  Value6 = 6,
  Value9 = 9,
  Value0 = 0,
}

/** ReportResponse */
export interface ReportResponse {
  /**
   * Report Code
   * ID сформированного уведомления / декларации
   */
  report_code: string
}

/** ReportStatus */
export enum ReportStatus {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
}

/** ReportType */
export enum ReportType {
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
}

/**
 * ReportsInfoResponse
 * @example {"reports_info":[{"amount":0,"code":"000000011","date_update":"2023-04-21","report_status":3,"type":"notice_1_kv"},{"amount":79874,"code":"000000015","date_update":"2023-07-23","report_status":3,"type":"notice_2_kv"},{"amount":-12754,"code":"000000020","date_update":"2023-10-29","report_status":1,"type":"notice_3_kv"},{"report_status":0,"type":"declaration"}]}
 */
export interface ReportsInfoResponse {
  /**
   * Reports Info
   * Информация об уведомлениях и декларации за текущий год
   */
  reports_info: ReportInfo[]
}

/** RequestState */
export enum RequestState {
  InProgress = "in_progress",
  Completed = "completed",
  Failed = "failed",
}

/** ResultInfo */
export interface ResultInfo {
  /**
   * Id
   * @format uuid
   */
  id: string
  /** Source Id */
  source_id?: string | null
  status: RequestState
  /** Message */
  message?: string | null
  /** Message Key */
  message_key?: string | null
  /** Link */
  link?: string | null
}

/** SNOReference */
export interface SNOReference {
  /**
   * Title
   * Название СНО
   */
  title: string
  /** Ключ TaxSystemType. */
  key: TaxSystemType | null
  /**
   * Range Start
   * Начало диапазона процентов СНО
   */
  range_start: number | null
  /**
   * Range End
   * Конец диапазона процентов СНО
   */
  range_end: number | null
}

/**
 * SNOReferencesResponse
 * @example {"references":[{"key":"usn_d","range_end":6,"range_start":0,"title":"УСН «Доходы»"},{"key":"usn_d_r","range_end":15,"range_start":0,"title":"УСН «Доходы минус расходы»"},{"key":"eshn","title":"Единый сельскохозяйственный налог (ЕСХН)"},{"key":"patent","title":"ПСН (Патентная система налогообложения)"},{"key":"osn","title":"ОСНО (Основная система налогообложения)"}]}
 */
export interface SNOReferencesResponse {
  /**
   * References
   * Список СНО
   */
  references: SNOReference[]
}

/** Source */
export interface Source {
  /**
   * Id
   * ID источника данных. Отсутствует при state = [in_progress, failed]
   */
  id?: string | null
  /** Тип источника. Возможные значения:  */
  type: SourceType
  /**
   * Name
   * Наименование источника.
   */
  name: OFDSource | MarketplaceName | string
  /**
   * Short Name
   * Коротокое название источника. Пока реализовано только для банков.
   */
  short_name?: string | null
  /**
   * Sub Name
   * Дополнительное наименование. Если type = 1 - номер счета, если type = 3 и name = Ozon - клиентский идентификатор Озон.
   */
  sub_name?: string | null
  /**
   * Bank Bik
   * БИК банка
   */
  bank_bik?: string | null
  /**
   * Last Info
   * Дата последней операции по источнику
   */
  last_info?: string | null
  /**
   * Disable Date
   * Дата закрытия источника.
   */
  disable_date?: string | null
  /**
   * Is Integrated
   * Признак интегрированного источника
   */
  is_integrated: boolean
  /**
   * Is Main
   * Признак основного источника (банковского счета)
   */
  is_main?: boolean | null
  /** Статус подключения источника. Список возможных значений: in_progress - в процессе. failed - ошибка. completed - завершен (источники в данном статусе не идут в выдачу). */
  state?: RequestState
  /**
   * Reason
   * Описание статуса подключения источника. Может содержать результат выполнения в случае неудачи.
   */
  reason?: string | null
  /**
   * Link
   * Ссылка на продолжение интеграции, является отдельным промежуточным результатом добавления интегрируемого источника.
   */
  link?: string | null
}

/** SourceType */
export enum SourceType {
  Account = "account",
  Ofd = "ofd",
  Marketplace = "marketplace",
  Hand = "hand",
}

/**
 * SourcesInfo
 * @example {"clients":[{"accounts":[{"account_number":"40817810570000123456","bank_bik":"044525092","bank_name":"АО КБ Модульбанк","last_operation":"2023-09-06"}],"firstname":"Василий","fns":{"code":"0550","description":"Межрайонная инспекция ФНС России № 4 по Республике Дагестан"},"fns_reg_date":"2020-09-17","inn":"027710159721","lastname":"Пупкин","marketplaces":[{"marketplace_name":"Озон","marketplace_update":"2023-10-01"}],"patronymic":"Петрович","tax":{"oktmo":"12345678","tax_date_begin":"2022-01-01","tax_rate":6,"tax_system":"Usn6"}}]}
 */
export interface SourcesInfo {
  /**
   * Sources
   * Список источников
   */
  sources?: Source[]
  /**
   * Comment
   * Комментарий
   */
  comment?: string | null
}

/** TaskInfo */
export interface TaskInfo {
  /** Тип задачи. Возможные значения: usn - Налог УСН. fixed_fees - Фиксированные взносы. income_percentage - 1% с дохода. report - отчетность. other - иные уведомления. */
  type: TaskType
  /**
   * Year
   * Год расчета
   */
  year: number
  /**
   * Task Code
   * Кодовое обозначение задачи
   */
  task_code: string
  /**
   * Title
   * Заголовок задачи
   */
  title: string
  /**
   * Description
   * Описание задачи
   */
  description: string
  /**
   * Date Begin
   * Дата начала демонстрации задачи
   * @format date
   */
  date_begin: string
  /**
   * Due Date
   * Крайник срок действия по задаче (крайний срок уплаты/сдачи отчетности)
   * @format date
   */
  due_date: string
  /**
   * Tax Base
   * Налоговая база
   */
  tax_base?: number | null
  /**
   * Tax Base Now
   * Налоговая база (текущий расчет)
   */
  tax_base_now?: number | null
  /**
   * Due Amount
   * Сумма к уплате по данной задаче
   */
  due_amount?: number | null
  /**
   * Accrued Amount
   * Сумма “начислено всего” по данной задаче
   */
  accrued_amount?: number | null
  /**
   * Accrued Amount Now
   * Сумма “начислено всего” согласно текущему расчету
   */
  accrued_amount_now?: number | null
  /**
   * Accrued Amount Kv
   * Исчислен налог поквартально
   */
  accrued_amount_kv?: number | null
  /**
   * Paid Amount
   * Сумма “уплачено ранее” по данной задаче
   */
  paid_amount?: number | null
  /**
   * Report Code
   * ID сформированного уведомления / декларации
   */
  report_code?: string | null
  /**
   * Report Update
   * Дата последнего формирования  уведомления / декларации
   */
  report_update?: string | null
  /**
   * Purpose
   * Назначение платежа
   */
  purpose?: string | null
}

/** TaskReference */
export interface TaskReference {
  /** Тип задачи. Возможные значения: usn - Налог УСН. fixed_fees - фиксированные взносы. income_percentage - 1% c дохода. report  - отчетность. other - иные уведомления */
  type: TaskType
  /**
   * Code
   * Кодовое обозначение задачи
   */
  code: string
  /**
   * Title
   * Заголовок задачи
   */
  title: string
  /**
   * Description
   * Описание задачи
   */
  description: string
  /**
   * Date Begin
   * Дата начала демонстрации задачи. Формат - MM-DD.
   */
  date_begin?: string | null
  /**
   * Date End
   * Дата окончания демонстрации задачи. Формат - MM-DD.
   */
  date_end?: string | null
  /**
   * Due Dates
   * Крайний срок действия по задачи (крайний срок уплаты / сдачи отчетности)
   */
  due_dates: DueDate[]
  /**
   * Source Of Amount
   * Источник суммы к уплате по данной задаче
   */
  source_of_amount?: string | null
  /**
   * Purpose
   * Назначение платежа (используется для создания платежного поручения)
   */
  purpose?: string | null
}

/**
 * TaskReferencesResponse
 * @example {"tasks":[{"amount":"ЕНП до 28 числа_9 месяцев","code":"ZN3","date_begin":"01.10","date_end":"31.12","description":"Уплата налога УСН за 9 месяцев","due_dates":[{"date":"2023-10-30","year":2023},{"date":"2024-10-28","year":2024},{"date":"2025-10-28","year":2025}],"purpose":"Единый налоговый платеж по сроку *due_date*","title":"УСН за 9 месяцев","type":"usn"},{"amount":"ЕНП до 31.12_год","code":"SV","date_begin":"01.01","date_end":"31.12","description":"Уплата страхового взноса за ИП в совокупном фиксированном размере за год","due_dates":[{"date":"2024-01-09","year":2023},{"date":"2025-01-08","year":2024},{"date":"2025-12-31","year":2025}],"purpose":"Единый налоговый платеж по сроку *due_date*","title":"Фиксированные взносы","type":"fixed_fees"},{"code":"ZDP","date_begin":"01.01","description":"Подготовка декларации по УСН за прошедший год","due_dates":[{"date":"2024-04-25","year":2023},{"date":"2025-04-25","year":2024},{"date":"2026-04-27","year":2025}],"title":"Подготовить декларацию","type":"usn"},{"amount":"Исчислен налог_9 месяцев","code":"OUV3","description":"Отправка уведомления по ЕНП за 3-ий квартал","due_dates":[{"date":"2023-10-25","year":2023},{"date":"2024-10-25","year":2024},{"date":"2025-10-27","year":2025}],"title":"Отправить уведомление за 3-ий квартал","type":"usn"}]}
 */
export interface TaskReferencesResponse {
  /**
   * Tasks
   * Задачи по  уплате налогов
   */
  tasks: TaskReference[]
}

/** TaskReportType */
export enum TaskReportType {
  Notice1Kv = "notice_1_kv",
  Notice2Kv = "notice_2_kv",
  Notice3Kv = "notice_3_kv",
  Declaration = "declaration",
}

/**
 * TaskResponse
 * @example {"tasks":[{"accrued_amount":94327,"date_begin":"2024-01-01","description":"Уплата налога по упрощенной системе налогообложения","due_amount":34327,"due_date":"2024-04-28","paid_amount":60000,"purpose":"Единый налоговый платеж по сроку 28 апреля 2024 г.","task_code":"ZN4","title":"Налог УСН за 2023 год","type":"usn","year":2023},{"accrued_amount":33667.56,"date_begin":"2024-01-01","description":"Уплата страхового взноса с дохода свыше 300 000 ₽","due_amount":23667.46,"due_date":"2024-07-01","paid_amount":10000.1,"purpose":"Единый налоговый платеж по сроку 1 июля 2024 г.","task_code":"ZV%4","title":"1% с дохода за 2023 год","type":"income_percentage","year":2023},{"date_begin":"2024-01-01","description":"Сдача налоговой декларации по упрощенной системе налогообложения","due_date":"2024-04-25","task_code":"ZDP","title":"Декларация УСН за 2023 год","type":"report","year":2024},{"accrued_amount":-12508,"date_begin":"2023-10-01","description":"Сдача уведомления об исчисленных авансовых платежах по налогу","due_date":"2023-10-25","task_code":"UV3","title":"Уведомление по УСН за III кв 2023 года ","type":"report","year":2023},{"accrued_amount":77017,"date_begin":"2023-07-01","description":"Сдача уведомления об исчисленных авансовых платежах по налогу","due_date":"2023-07-25","task_code":"UV2","title":"Уведомление по УСН за II кв 2023 года ","type":"report","year":2023},{"accrued_amount":1409,"date_begin":"2023-04-01","description":"Сдача уведомления об исчисленных авансовых платежах по налогу","due_date":"2023-04-25","report_code":"00024","task_code":"UV1","title":"Уведомление по УСН за I кв 2023 года ","type":"report","year":2023},{"accrued_amount":45842,"date_begin":"2023-01-01","description":"Уплата страхового взноса за ИП в совокупном фиксированном размере","due_amount":40000,"due_date":"2024-01-09","paid_amount":5842,"purpose":"Единый налоговый платеж по сроку 9 января 2024 г.","task_code":"SV","title":"Фиксированные взносы за 2023 год","type":"fixed_fees","year":2023},{"accrued_amount":49500,"date_begin":"2024-01-01","description":"Уплата страхового взноса за ИП в совокупном фиксированном размере","due_amount":49500,"due_date":"2025-01-08","paid_amount":0,"purpose":"Единый налоговый платеж по сроку 8 января 2025 г.","task_code":"SV","title":"Фиксированные взносы за 2024 год","type":"fixed_fees","year":2024}]}
 */
export interface TaskResponse {
  /**
   * Tasks
   * Задачи по уплате налогов. Задачи в списке упорядочены по полю due_date.
   */
  tasks: TaskInfo[]
  /**
   * Is Relevant
   * Актуальность расчета налогов
   */
  is_relevant: boolean
}

/** TaskType */
export enum TaskType {
  Usn = "usn",
  FixedFees = "fixed_fees",
  IncomePercentage = "income_percentage",
  Report = "report",
  Other = "other",
}

/**
 * TaxCalculationResponse
 * @example {"contributions":{"fixed_fees":{"accrued_ff":41003.12,"due_date_ff":"2024-01-09","due_ff":38427.62,"paid_ff":2575.5},"income_percentage":{"accrued_ip":25575.28,"due_date_ip":"2024-07-01","due_ip":25575.28,"paid_ip":0,"period_ip":9}},"ens_balance":{"closing_balance":0,"opening_balance":2000},"is_relevant":true,"recalculation_date":"2023-12-04T09:02:29.604000","usn_taxes":{"notices":{"usn_1_kv":0,"usn_2_kv":79874,"usn_3_kv":-12754,"usn_4_kv":3000},"tax_rate":6,"usn_0":{"accrued_tax":70120,"deductions":104932,"due_date":"2024-04-29","due_tax":0,"paid_tax":70120,"tax_base":2917528},"usn_1":{"accrued_tax":0,"deductions":45373,"due_date":"2023-04-28","due_tax":0,"paid_tax":0,"tax_base":756221},"usn_6":{"accrued_tax":79874,"deductions":61578,"due_date":"2023-07-28","due_tax":7178.5,"paid_tax":72695.5,"tax_base":2357528},"usn_9":{"accrued_tax":67120,"deductions":104332,"due_date":"2023-10-30","due_tax":0,"paid_tax":67120,"tax_base":2857528}}}
 */
export interface TaxCalculationResponse {
  /**
   * Is Relevant
   * Актуальность расчета налогов. true - если не стоит в очереди на перерасчет. false - если стоит в очереди на перерасчет.
   */
  is_relevant: boolean
  /**
   * Recalculation Date
   * Дата и время последнего перерасчета налогов
   * @format date-time
   */
  recalculation_date: string
  /** Налоги УСН */
  usn_taxes: USNTaxes
  /** Взносы */
  contributions: ContributionsInfo
  /** Сальдо ЕНС */
  ens_balance: ENSBalanceInfo
}

/** TaxLimit */
export interface TaxLimit {
  /**
   * Year
   * Год, за который установлены лимиты
   */
  year: number
  /**
   * Fixed Fees
   * Фиксированные взносы за ИП
   */
  fixed_fees: number
  /**
   * Income Percentage
   * Предельная величина взносов 1% с дохода
   */
  income_percentage: number
  /**
   * Rate Increase
   * Сумма лимита на повышение ставки УСН
   */
  rate_increase: number
  /**
   * Max Income
   * Сумма максимального дохода УСН
   */
  max_income: number
}

/** TaxLimitsResponse */
export interface TaxLimitsResponse {
  /** Limits */
  limits: TaxLimit[]
}

/** TaxSystemType */
export enum TaxSystemType {
  UsnD = "usn_d",
  UsnDR = "usn_d_r",
  Osn = "osn",
  Eshn = "eshn",
  Patent = "patent",
}

/** TaxType */
export enum TaxType {
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
}

/** Token */
export interface Token {
  /** Access Token */
  access_token: string
  /** Token Type */
  token_type: string
}

/** USNTaxInfo */
export interface USNTaxInfo {
  /**
   * Tax Base
   * Налоговая база за полугодие
   */
  tax_base: number
  /**
   * Deductions
   * Вычеты за 1 квартал
   */
  deductions: number
  /**
   * Accrued Tax
   * Исчислен налог УСН
   */
  accrued_tax: number
  /**
   * Paid Tax
   * Уплачен налог УСН
   */
  paid_tax: number
  /**
   * Due Tax
   * Налог УСН к уплате
   */
  due_tax: number
  /**
   * Due Date
   * Дата уплаты налога. В зависимости от accrueds_period: 1/4 - YYYY-04-28. 2 - YYYY-07-28. 3 - YYYY-10-28
   * @format date
   */
  due_date: string
}

/** USNTaxes */
export interface USNTaxes {
  /**
   * Tax Rate
   * Ставка налога
   */
  tax_rate: number
  /** Уведомления по УСН */
  notices: NoticeInfo
  /** УСН за 1 квартал */
  usn_1: USNTaxInfo
  /** УСН за полугодие */
  usn_6: USNTaxInfo
  /** УСН за 9 месяцев */
  usn_9: USNTaxInfo
  /** УСН за год */
  usn_0: USNTaxInfo
}

/** UpdateOperationMarkup */
export interface UpdateOperationMarkup {
  /**
   * Вид операции.
   * 1 - доход. 2 - не влияет на налоговую базу. 3 - возврат покупателю. 4 - уплата налогов/взносов.
   */
  operation_type: OperationType
  /**
   * Amount
   * Сумма, участвующая в разметке операции
   */
  amount: number
}

/**
 * UpdateReportRequest
 * @example {"period_type":1,"period_year":2023,"report_code":"000000010","report_status":2,"report_type":2}
 */
export interface UpdateReportRequest {
  /** Тип запрашиваемого отчета. Возможные значения: 1 - КУДиР. 2 - Уведомления об исчисленных авансовых платежах по УСН. 3 - Налоговая декларация УСН.  */
  report_type: ReportType
  /** Тип налогового периода. Возможные значения: 1 - 1 квартал. 2 - 2 квартал. 3 - 3 квартал. 4 - 4 квартал. 6 - полугодие. 9 - 9 месяцев. 0 - весь год. Для Уведомления возможен выбор только 1-3 кварталов. Для декларации только 0 (весь год) */
  period_type: ReportPeriodType
  /**
   * Period Year
   * Год налогового периода
   */
  period_year: number
  /**
   * Report Code
   * Код отчета в БРН. Передается обязательно, если по отчету ранее формировались документы (если по этому отчету в методе GET-/reports_info возвращается поле code). Не передается, если отчета НЕТ в разделе “Уведомления об исчисленных суммах налога”
   */
  report_code?: string | null
  /** Новый статус отчета. Возможные значения: 2 - отчет принят в ФНС (через ЭЦП). 3 - отчет не принят ФНС. 4 - отчет принят ФНС (сдал самостоятельно).  */
  report_status: UpdateRepostStatus
}

/** UpdateRepostStatus */
export enum UpdateRepostStatus {
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
}

/** User */
export interface User {
  /**
   * Id
   * @format uuid
   */
  id: string
  /**
   * Full Name
   * Полное имя
   */
  full_name?: string | null
  /**
   * Lastname
   * Фамилия
   */
  lastname?: string | null
  /**
   * Firstname
   * Имя
   */
  firstname?: string | null
  /**
   * Patronymic
   * Отчество
   */
  patronymic?: string | null
  /**
   * Inn
   * ИНН пользователя
   */
  inn?: string | null
  /**
   * Tax System
   * Применяемая СНО
   */
  tax_system?: string | null
  /**
   * Tax Rate
   * Налоговая ставка
   */
  tax_rate?: number | null
  /**
   * Rate Reason
   * Обоснование сниженной налоговой ставки
   */
  rate_reason?: string | null
  /**
   * Tax Date Begin
   * Дата начала работы в сервисе
   */
  tax_date_begin?: string | null
  /**
   * Oktmo
   * Код ОКТМО
   */
  oktmo?: string | null
  /**
   * Hashed Id
   * Захэшированный ID пользователя. Необходим для работы с Carrot Quest
   */
  hashed_id?: string | null
  /**
   * Fns Code
   * Код ИФНС
   */
  fns_code?: string | null
  /**
   * Fns Description
   * Название ИФНС
   */
  fns_description?: string | null
  /**
   * Fns Reg Date
   * Дата регистрации ИП в ФНС
   */
  fns_reg_date?: string | null
  /**
   * Last Closed Year
   * Год последней сданной декларации
   */
  last_closed_year?: string | null
  /**
   * Email
   * Электронная почта пользователя
   */
  email?: string | null
  /**
   * Phone Number
   * Номер телефона пользователя
   */
  phone_number?: string | null
  /**
   * Is Lead
   * Является ли пользователь лидом
   * @default false
   */
  is_lead?: boolean | null
  /**
   * Is Disabled
   * Отключена ли бухгалтерия у пользователя
   * @default false
   */
  is_disabled?: boolean | null
  /**
   * Created At
   * Дата создания пользователя
   * @format date-time
   */
  created_at: string
  /**
   * Updated At
   * Дата последнего обновления
   * @format date-time
   */
  updated_at: string
}

/** UserInfoBanner */
export interface UserInfoBanner {
  /** Id */
  id: string
  banner_type: BannerType
  /** Title */
  title: string
  /** Description */
  description: string
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[]
  /** Message */
  msg: string
  /** Error Type */
  type: string
}

export type QueryParamsType = Record<string | number, any>
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean
  /** request path */
  path: string
  /** content type of request body */
  type?: ContentType
  /** query params */
  query?: QueryParamsType
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat
  /** request body */
  body?: unknown
  /** base url */
  baseUrl?: string
  /** request cancellation token */
  cancelToken?: CancelToken
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">
  securityWorker?: (
    securityData: SecurityDataType | null
  ) => Promise<RequestParams | void> | RequestParams | void
  customFetch?: typeof fetch
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D
  error: E
}

type CancelToken = Symbol | string | number

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = ""
  private securityData: SecurityDataType | null = null
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"]
  private abortControllers = new Map<CancelToken, AbortController>()
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams)

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  }

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig)
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data
  }

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key)
    return `${encodedKey}=${encodeURIComponent(
      typeof value === "number" ? value : `${value}`
    )}`
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key])
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key]
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&")
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {}
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key]
    )
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key)
      )
      .join("&")
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery)
    return queryString ? `?${queryString}` : ""
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key]
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`
        )
        return formData
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  }

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    }
  }

  protected createAbortSignal = (
    cancelToken: CancelToken
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken)
      if (abortController) {
        return abortController.signal
      }
      return void 0
    }

    const abortController = new AbortController()
    this.abortControllers.set(cancelToken, abortController)
    return abortController.signal
  }

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken)

    if (abortController) {
      abortController.abort()
      this.abortControllers.delete(cancelToken)
    }
  }

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {}
    const requestParams = this.mergeRequestParams(params, secureParams)
    const queryString = query && this.toQueryString(query)
    const payloadFormatter = this.contentFormatters[type || ContentType.Json]
    const responseFormat = format || requestParams.format

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${
        queryString ? `?${queryString}` : ""
      }`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      }
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>
      r.data = null as unknown as T
      r.error = null as unknown as E

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data
              } else {
                r.error = data
              }
              return r
            })
            .catch((e) => {
              r.error = e
              return r
            })

      if (cancelToken) {
        this.abortControllers.delete(cancelToken)
      }

      if (!response.ok) throw data
      return data
    })
  }
}

/**
 * @title AKB
 * @version 0.1.21
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  auth = {
    /**
     * No description
     *
     * @tags Authentication
     * @name LoginAuthPost
     * @summary Login
     * @request POST:/auth
     */
    loginAuthPost: (data: BodyLoginAuthPost, params: RequestParams = {}) =>
      this.request<Token, HTTPValidationError | void>({
        path: `/auth`,
        method: "POST",
        body: data,
        type: ContentType.UrlEncoded,
        format: "json",
        ...params,
      }),
  }
  users = {
    /**
     * @description Метод реализует базовый механизм регистрации в сервисе. При вызове метода на почту пользователя направляется письмо с дальнейшей инструкцией по регистрации. Актуально только для поэтапной регистрации.
     *
     * @tags Users
     * @name CreateUserUsersRegistrationPost
     * @summary Зарегистрироваться. Шаг регистрации 1.
     * @request POST:/users/registration
     */
    createUserUsersRegistrationPost: (
      data: CreateUser,
      params: RequestParams = {}
    ) =>
      this.request<User, HTTPValidationError | void>({
        path: `/users/registration`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Метод реализует второй шаг регистрации в сервисе. При вызове метода в БРН происходит инициализация карточки клиента с базовой информацией по нему. Актуально только для поэтапной регистрации.
     *
     * @tags Users
     * @name GetInnInfoUsersRegistrationInnInfoGet
     * @summary Получить информацию пользователя по ИНН. Шаг регистрации 2. Доступно, только если пользователь не имеет сохраненного ИНН в ЛК.
     * @request GET:/users/registration/inn_info
     * @secure
     */
    getInnInfoUsersRegistrationInnInfoGet: (
      query: {
        /**
         * Inn
         * ИНН пользователя
         */
        inn: string
      },
      params: RequestParams = {}
    ) =>
      this.request<InnInfo, void | HTTPValidationError>({
        path: `/users/registration/inn_info`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Метод реализует третий шаг регистрации в сервисе. При вызове метода в БРН сохраняется необходимая информация для дальнейшей работы сервиса. Актуально только для поэтапной регистрации.
     *
     * @tags Users
     * @name SaveTaxInfoUsersRegistrationTaxInfoPut
     * @summary Сохранить налоговую информацию по пользователю. Шаг регистрации 3. Доступно, только если пользователь не имеет сохраненного ИНН в ЛК.
     * @request PUT:/users/registration/tax_info
     * @secure
     */
    saveTaxInfoUsersRegistrationTaxInfoPut: (
      data: InnInfoToSave,
      params: RequestParams = {}
    ) =>
      this.request<User, HTTPValidationError | void>({
        path: `/users/registration/tax_info`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Метод реализует альтернативный шаг регистрации в сервисе. При вызове метода в БРН сохраняется информация по лиду пользователя. Дальнейшая работа в сервисе не предусмотрена, после сохранения лида вся функциональность сервиса становится недоступной. Актуально только для поэтапной регистрации.
     *
     * @tags Users
     * @name SaveLeadInfoUsersRegistrationLeadInfoPut
     * @summary Сохранить лида по пользователю. Альтернативный шаг регистрации 3. Метод нужен для сохранения лида пользователя, который не проходит по СНО.
     * @request PUT:/users/registration/lead_info
     * @secure
     */
    saveLeadInfoUsersRegistrationLeadInfoPut: (
      data: LeadInfoToSave,
      params: RequestParams = {}
    ) =>
      this.request<User, void | HTTPValidationError>({
        path: `/users/registration/lead_info`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Метод возвращает информацию по зарегистрированному пользователю. Данный должен вызываться после каждой авторизации пользователя, а также при открытии страницы сервиса впервые при запуске сервиса.
     *
     * @tags Users
     * @name CurrentUserUsersGet
     * @summary Получить текущего пользователя
     * @request GET:/users
     * @secure
     */
    currentUserUsersGet: (params: RequestParams = {}) =>
      this.request<User, void>({
        path: `/users`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Метод реализует сохранение лида по пользователю, использующему сервис.
     *
     * @tags Users
     * @name SaveUserLeadUsersLeadPut
     * @summary Сохранить лида по пользователю
     * @request PUT:/users/lead
     * @secure
     */
    saveUserLeadUsersLeadPut: (
      data: CreateUserLead,
      params: RequestParams = {}
    ) =>
      this.request<any, HTTPValidationError | void>({
        path: `/users/lead`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Метод реализует изменение настроен СНО пользователя.
     *
     * @tags Users
     * @name ChangeTaxUsersChangeTaxPut
     * @summary Изменение настроек системы налогообложения
     * @request PUT:/users/change_tax
     * @secure
     */
    changeTaxUsersChangeTaxPut: (data: ChangeTax, params: RequestParams = {}) =>
      this.request<any, void>({
        path: `/users/change_tax`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Метод реализует отключение пользователя от сервиса бухгалтерии. Повторное подключение сервиса реализуется через повторную регистрацию.
     *
     * @tags Users
     * @name DisableUserUsersDisablePut
     * @summary Отключить текущего пользователя от сервиса бухгалтерии
     * @request PUT:/users/disable
     * @secure
     */
    disableUserUsersDisablePut: (params: RequestParams = {}) =>
      this.request<any, void>({
        path: `/users/disable`,
        method: "PUT",
        secure: true,
        format: "json",
        ...params,
      }),
  }
  sources = {
    /**
     * @description Метод возвращает информацию об источниках данных пользователя. Данный метод следует вызывать при открытии страниц, содержащих информацию об источниках пользователя. В источниках в том числе возвращаются те, что в данный момент находятся в обработке системой (например, недавно добавленные счета). Также метод возвращает информацию по клиенту на тот случай, если информация, получаемая по ИНН, как-то отличается от данных, выданных ранее. Данная информация также обновляется и внутри сервиса, после выполнения данного метода получение текущего пользователя также выдаст актуальную информацию.
     *
     * @tags Sources
     * @name GetSourcesInfoSourcesGet
     * @summary Получить информацию о подключенных счетах, макретплейсах и ОФД пользователя
     * @request GET:/sources
     * @secure
     */
    getSourcesInfoSourcesGet: (params: RequestParams = {}) =>
      this.request<SourcesInfo, void>({
        path: `/sources`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Метод возвращает информацию по статусу добавления источника данных в мастер системе
     *
     * @tags Sources
     * @name GetSourceRequestStateSourcesRequestIdStateGet
     * @summary Получить статус запроса добавления источника данных
     * @request GET:/sources/{request_id}/state
     * @secure
     */
    getSourceRequestStateSourcesRequestIdStateGet: (
      requestId: string,
      params: RequestParams = {}
    ) =>
      this.request<ResultInfo, void | HTTPValidationError>({
        path: `/sources/${requestId}/state`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Данный метод реализует отключение источника данных. По отключенному источнику данных приостанавливается интеграция. Данные по нему возвращаться будут, однако новых в систему поступать не будет.
     *
     * @tags Sources
     * @name DisableSourceSourcesDisablePut
     * @summary Отключить источник данных
     * @request PUT:/sources/disable
     * @secure
     */
    disableSourceSourcesDisablePut: (
      data: DisableSource,
      params: RequestParams = {}
    ) =>
      this.request<any, void>({
        path: `/sources/disable`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Данный метод реализует добавление счета для отображение его в источниках данных.
     *
     * @tags Sources
     * @name CreateClientAccountSourcesAccountPost
     * @summary Добавление счета пользователя напрямую
     * @request POST:/sources/account
     * @secure
     */
    createClientAccountSourcesAccountPost: (
      data: AccountDetails,
      params: RequestParams = {}
    ) =>
      this.request<CreateAccountResponse, void>({
        path: `/sources/account`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Данный метод реализует добавление прямой интеграции с банком по счету клиента.
     *
     * @tags Sources
     * @name CreateUserAccountIntegrationSourcesAccountIntegrationPost
     * @summary Добавление интеграции счета пользователя
     * @request POST:/sources/account/integration
     * @secure
     */
    createUserAccountIntegrationSourcesAccountIntegrationPost: (
      data: CreateAccountIntegration,
      params: RequestParams = {}
    ) =>
      this.request<CreateAccountResponse, void>({
        path: `/sources/account/integration`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Данный метод реализует добавление ОФД пользователя.
     *
     * @tags Sources
     * @name CreateClientOfdSourcesOfdPost
     * @summary Добавление ОФД пользователя
     * @request POST:/sources/ofd
     * @secure
     */
    createClientOfdSourcesOfdPost: (
      data: BodyCreateClientOfdSourcesOfdPost,
      query?: {
        /** Login */
        login?: string | null
        /** Password */
        password?: string | null
        /** Date Begin */
        date_begin?: string | null
      },
      params: RequestParams = {}
    ) =>
      this.request<CreateSourceResponse, void>({
        path: `/sources/ofd`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Данный метод реализует добавление маркетплейс пользователя.
     *
     * @tags Sources
     * @name CreateClientMarketplaceSourcesMarketplacePost
     * @summary Добавление маркетплейс пользователя
     * @request POST:/sources/marketplace
     * @secure
     */
    createClientMarketplaceSourcesMarketplacePost: (
      data: BodyCreateClientMarketplaceSourcesMarketplacePost,
      params: RequestParams = {}
    ) =>
      this.request<CreateSourceResponse, void>({
        path: `/sources/marketplace`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),
  }
  operations = {
    /**
     * @description Метод возвращает размеченные и обработанные операции по заданным фильтрам. Данные операции формируют налоговую базу пользователя. Есть возможность фильтрации операций по номеру счета, периоду совершения операций, а также по типу размеченной операции.
     *
     * @tags Operations
     * @name GetOperationsOperationsPost
     * @summary Получить список размеченных операций
     * @request POST:/operations
     * @secure
     */
    getOperationsOperationsPost: (
      data: GetOperationsRequest,
      params: RequestParams = {}
    ) =>
      this.request<OperationsResponse, HTTPValidationError | void>({
        path: `/operations`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Данный метод реализует удаление операции пользователем.
     *
     * @tags Operations
     * @name DeleteOperationOperationsDelete
     * @summary Удалить операцию
     * @request DELETE:/operations
     * @secure
     */
    deleteOperationOperationsDelete: (
      query: {
        /** Operation Id */
        operation_id: string
      },
      params: RequestParams = {}
    ) =>
      this.request<any, HTTPValidationError | void>({
        path: `/operations`,
        method: "DELETE",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Данный метод реализует ручное добавление операций пользователем.
     *
     * @tags Operations
     * @name CreateOperationOperationsByHandPost
     * @summary Добавить операцию вручную
     * @request POST:/operations/by_hand
     * @secure
     */
    createOperationOperationsByHandPost: (
      data: CreateOperation,
      params: RequestParams = {}
    ) =>
      this.request<any, HTTPValidationError | void>({
        path: `/operations/by_hand`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Данный метод реализует добавление операций пользователя из выгруженной банковской выписки.
     *
     * @tags Operations
     * @name CreateOperationsFromFileOperationsFilePost
     * @summary Добавить операции из банковской выписки
     * @request POST:/operations/file
     * @secure
     */
    createOperationsFromFileOperationsFilePost: (
      data: BodyCreateOperationsFromFileOperationsFilePost,
      params: RequestParams = {}
    ) =>
      this.request<CreateAccountResponse, void>({
        path: `/operations/file`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Данный метод реализует обновление разметки операции пользователем.
     *
     * @tags Operations
     * @name UpdateOperationOperationsMarkupPut
     * @summary Переразметить операцию
     * @request PUT:/operations/markup
     * @secure
     */
    updateOperationOperationsMarkupPut: (
      query: {
        /** Operation Id */
        operation_id: string
      },
      data: UpdateOperationMarkup,
      params: RequestParams = {}
    ) =>
      this.request<any, void>({
        path: `/operations/markup`,
        method: "PUT",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Данный метод реализует ручное добавление операции уплаты налога.
     *
     * @tags Operations
     * @name CreateOperationTaxPaymentOperationsTaxPaymentPost
     * @summary Добавить уплату налога
     * @request POST:/operations/tax_payment
     * @secure
     */
    createOperationTaxPaymentOperationsTaxPaymentPost: (
      data: CreateTaxPaymentOperationsRequest,
      params: RequestParams = {}
    ) =>
      this.request<any, void | HTTPValidationError>({
        path: `/operations/tax_payment`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Метод возвращает размеченные и обработанные операции по заданным фильтрам. Данные операции формируют налоговую базу пользователя. Есть возможность фильтрации операций по номеру счета, периоду совершения операций, а также по типу размеченной операции.
     *
     * @tags Operations
     * @name GetOperationByIdOperationsOperationIdGet
     * @summary Получить список размеченных операций
     * @request GET:/operations/{operation_id}
     * @secure
     */
    getOperationByIdOperationsOperationIdGet: (
      operationId: string,
      params: RequestParams = {}
    ) =>
      this.request<Operation, void | HTTPValidationError>({
        path: `/operations/${operationId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  }
  taxes = {
    /**
     * @description Метод возвращает справочник по СНО.В некоторых СНО имеется диапазон значений процента НО.
     *
     * @tags Taxes
     * @name GetSnoReferencesTaxesSystemsGet
     * @summary Получить справочник по системам налогообложения
     * @request GET:/taxes/systems
     */
    getSnoReferencesTaxesSystemsGet: (params: RequestParams = {}) =>
      this.request<SNOReferencesResponse, void>({
        path: `/taxes/systems`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Метод возвращает информацию по рассчитанным налогам и взносам по налоговой базе пользователя. Метод возвращает подсчеты, а также информацию об их актуальности. Каждое изменение налоговой базы инициирует процесс пересчета. В зависимости от полученного статуса по актуальности также меняется и взаимодействие пользователя с сервисом (например, ему предлагается заново сгенерировать декларацию по доходам).
     *
     * @tags Taxes
     * @name GetTaxCalculationTaxesCalculationGet
     * @summary Получить рассчитанные налоги и взносы
     * @request GET:/taxes/calculation
     * @secure
     */
    getTaxCalculationTaxesCalculationGet: (
      query: {
        /**
         * Year
         * Год расчета налогов
         */
        year: number
      },
      params: RequestParams = {}
    ) =>
      this.request<TaxCalculationResponse, void | HTTPValidationError>({
        path: `/taxes/calculation`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Данный метод возвращает информацию, необходимую для формирования платежного поручения на уплату налога.
     *
     * @tags Taxes
     * @name GetEnsInfoTaxesEnsRequisitesGet
     * @summary Получить информацию для формирования платежного поручения
     * @request GET:/taxes/ens_requisites
     * @secure
     */
    getEnsInfoTaxesEnsRequisitesGet: (params: RequestParams = {}) =>
      this.request<ENSInfo, void>({
        path: `/taxes/ens_requisites`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Данный метод возвращает заполненное платежное поручение на уплату налога.
     *
     * @tags Taxes
     * @name GenerateEnsOrderTaxesEnsOrderPost
     * @summary Сформировать платежное поручение
     * @request POST:/taxes/ens_order
     * @secure
     */
    generateEnsOrderTaxesEnsOrderPost: (
      data: GenerateENSOrder,
      params: RequestParams = {}
    ) =>
      this.request<PaymentOrder, HTTPValidationError | void>({
        path: `/taxes/ens_order`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Данный метод возвращает заполненное платежное поручение на уплату налога в формате txt.
     *
     * @tags Taxes
     * @name GenerateEnsOrderTxtTaxesEnsOrderTxtPost
     * @summary Сформировать платежное поручение, получить файл txt
     * @request POST:/taxes/ens_order/txt
     * @secure
     */
    generateEnsOrderTxtTaxesEnsOrderTxtPost: (
      data: GenerateENSOrder,
      params: RequestParams = {}
    ) =>
      this.request<string, HTTPValidationError>({
        path: `/taxes/ens_order/txt`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Taxes
     * @name RecalculationTaxesTaxesRecalculationPut
     * @summary Обновление расчета налога
     * @request PUT:/taxes/recalculation
     * @secure
     */
    recalculationTaxesTaxesRecalculationPut: (params: RequestParams = {}) =>
      this.request<BRNOkResponse, void>({
        path: `/taxes/recalculation`,
        method: "PUT",
        secure: true,
        format: "json",
        ...params,
      }),
  }
  tasks = {
    /**
     * @description Метод возвращает информацию о предстоящих задачах - налогах и взносах к уплате, сроках сдачи уведомлений и деклараций. Актуальность данной информации зависит от статуса расчета налоговой базы (taxes/calculation).
     *
     * @tags Tasks
     * @name GetTasksTasksGet
     * @summary Получить задачи пользователя
     * @request GET:/tasks
     * @secure
     */
    getTasksTasksGet: (params: RequestParams = {}) =>
      this.request<TaskResponse, void>({
        path: `/tasks`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Метод возвращает дополнительную информацию по задачам налоговой отчетности - статусы сдачи, суммы в уведомлениях. Данную информацию возможно запрашивать для указанного налогового периода (года). Актуальность данной информации зависит от статуса расчета налоговой базы (taxes/calculation).
     *
     * @tags Tasks
     * @name GetTasksReportsInfoTasksReportsInfoGet
     * @summary Получить дополнительную информацию по задачам налоговой отчетности
     * @request GET:/tasks/reports_info
     * @secure
     */
    getTasksReportsInfoTasksReportsInfoGet: (
      query: {
        /** Year */
        year: number
      },
      params: RequestParams = {}
    ) =>
      this.request<ReportsInfoResponse, HTTPValidationError | void>({
        path: `/tasks/reports_info`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Метод возвращает справочник задач пользователя для их типизации и отображения справки по ним.
     *
     * @tags Tasks
     * @name GetTasksReferencesTasksReferencesGet
     * @summary Получить справочник задачи пользователя
     * @request GET:/tasks/references
     */
    getTasksReferencesTasksReferencesGet: (params: RequestParams = {}) =>
      this.request<TaskReferencesResponse, void>({
        path: `/tasks/references`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Данный метод реализует механизм изменения статуса приема деклараций и уведомлений в ЛК клиента.
     *
     * @tags Tasks
     * @name UpdateReportStatusTasksStatusPut
     * @summary Обновить статус задачи
     * @request PUT:/tasks/status
     * @secure
     */
    updateReportStatusTasksStatusPut: (
      data: UpdateReportRequest,
      params: RequestParams = {}
    ) =>
      this.request<any, void>({
        path: `/tasks/status`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  }
  reports = {
    /**
     * @description Данный метод реализует генерацию отчетности пользователя (уведомления и декларации). Сгенерированная отчетность при этом запросе хранится на сервере и возвращается пользователю отдельным запросом. Актуальность сформированной отчетности зависит от статуса расчета налоговой базы (taxes/calculation).
     *
     * @tags Reports
     * @name GenerateReportsReportsPost
     * @summary Сгенерировать отчетность выбранного типа за выбранный период
     * @request POST:/reports
     * @secure
     */
    generateReportsReportsPost: (
      data: GenerateReportsRequest,
      params: RequestParams = {}
    ) =>
      this.request<ReportResponse, HTTPValidationError | void>({
        path: `/reports`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Данный метод реализует генерацию и возврат КУДиР пользователя. Сгенерированная отчетность при этом НЕ хранится на сервере. Актуальность сформированной отчетности зависит  от статуса расчета налоговой базы (taxes/calculation).
     *
     * @tags Reports
     * @name GetKudirReportReportsKudirGet
     * @summary Получить КУДиР за выбранный период
     * @request GET:/reports/kudir
     * @secure
     */
    getKudirReportReportsKudirGet: (
      query: {
        /**
         * Period Type
         * Тип налогового периода. Возможные значения: 1 - 1 квартал. 2 - 2 квартал. 3 - 3 квартал. 4 - 4 квартал. 6 - полугодие. 9 - 9 месяцев. 0 - весь год.
         */
        period_type: ReportPeriodType
        /**
         * Period Year
         * Год налогового периода
         */
        period_year: number
        /**
         * Kudir Format
         * Формат КУДиР. Возможные значения: pdf. xlsx.
         * @default "pdf"
         */
        kudir_format?: KudirFormat
      },
      params: RequestParams = {}
    ) =>
      this.request<void, HTTPValidationError | void>({
        path: `/reports/kudir`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Данный метод возвращает сгенерированный файл в отчетности в формате pdf / xml.
     *
     * @tags Reports
     * @name GetReportByIdReportsReportIdReportFormatGet
     * @summary Получить сгенерированный файл отчетности в выбранном формате
     * @request GET:/reports/{report_id}.{report_format}
     * @secure
     */
    getReportByIdReportsReportIdReportFormatGet: (
      reportId: string,
      reportFormat: ReportFormat,
      params: RequestParams = {}
    ) =>
      this.request<void, HTTPValidationError | void>({
        path: `/reports/${reportId}.${reportFormat}`,
        method: "GET",
        secure: true,
        ...params,
      }),
  }
  banners = {
    /**
     * No description
     *
     * @tags Banners
     * @name GetUserBannersBannersGet
     * @summary Получить информационные баннеры пользователя
     * @request GET:/banners
     * @secure
     */
    getUserBannersBannersGet: (
      query: {
        /**
         * Current Date
         * Текущая дата на клиенте. Требуется, чтобы избежать разницы временных зон
         * @format date
         */
        current_date: string
      },
      params: RequestParams = {}
    ) =>
      this.request<InfoBannersResponse, void | HTTPValidationError>({
        path: `/banners`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Данный метод реализует обновление статуса баннера пользователя - на данный момент возможность скрыть баннер.
     *
     * @tags Banners
     * @name UpdateUserBannerStateBannersPut
     * @summary Обновить статус информационного баннера у пользователя
     * @request PUT:/banners
     * @secure
     */
    updateUserBannerStateBannersPut: (
      query: {
        /** Banner Id */
        banner_id: string
      },
      params: RequestParams = {}
    ) =>
      this.request<any, void | HTTPValidationError>({
        path: `/banners`,
        method: "PUT",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  }
  references = {
    /**
     * @description Метод возвращает информацию по банку по БИК.
     *
     * @tags References
     * @name GetBankInfoReferencesBankInfoGet
     * @summary Получить информацию по банку по БИК
     * @request GET:/references/bank_info
     * @secure
     */
    getBankInfoReferencesBankInfoGet: (
      query: {
        /**
         * Bik
         * БИК банка
         */
        bik: string
      },
      params: RequestParams = {}
    ) =>
      this.request<BankReferenceResponse, HTTPValidationError | void>({
        path: `/references/bank_info`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Метод возвращает лимиты по налогам и взносам. При отправке пустого списка years, вернутся лимиты за текущий год - 1, текущий год и текущий год + 1
     *
     * @tags References
     * @name GetTaxLimitsReferencesTaxLimitsGet
     * @summary Получить лимиты по налогам и взносам
     * @request GET:/references/tax_limits
     * @secure
     */
    getTaxLimitsReferencesTaxLimitsGet: (
      query?: {
        /**
         * Years
         * Годы, за которые необходимо предоставить лимиты.
         */
        years?: number[]
      },
      params: RequestParams = {}
    ) =>
      this.request<TaxLimitsResponse, HTTPValidationError | void>({
        path: `/references/tax_limits`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  }
}

export const api = new Api({ baseUrl: "https://api-dev.buh.app" })
