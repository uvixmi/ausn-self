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

/** AccountInfo */
export interface AccountInfo {
  /**
   * Account Number
   * Номер счета клиента
   */
  account_number: string
  /**
   * Bank Bik
   * БИК банка
   */
  bank_bik: string
  /**
   * Bank Name
   * Наименование банка
   */
  bank_name: string
  /**
   * Last Operation
   * Дата последней операции по счету
   * @format date
   */
  last_operation: string
}

/** AccountInfoFromFile */
export interface AccountInfoFromFile {
  /**
   * Start Date
   * @format date
   */
  start_date: string
  /**
   * End Date
   * @format date
   */
  end_date: string
  /** Account Number */
  account_number: string
}

/**
 * AccountType
 * An enumeration.
 */
export enum AccountType {
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
}

/** Body_create_client_account_sources_account_post */
export interface BodyCreateClientAccountSourcesAccountPost {
  /** Тип синхронизации. Возможные значения: 1 - Выписка в формате txt. 2 - Директ-банк. 3 - API-метод. 4 - решение ООО Звено. */
  account_type: AccountType
  /**
   * Account File
   * Файл с банковской выгрузкой формата .txt. Обязателен для заполнения, если account_type = 1
   * @format binary
   */
  account_file?: File
  /**
   * Login
   * Логин 1С: ДиректБанк. Обязателен для заполнения, если account_type = [2, 3, 4]
   */
  login?: any
  /**
   * Password
   * Пароль 1С: ДиректБанк. Обязателен для заполнения, если account_type = [2, 3, 4]
   */
  password?: any
  /**
   * Account Number
   * Номер счета клиента. Обязателен для заполнения, если account_type = 2
   */
  account_number?: any
  /**
   * Bank Bik
   * БИК банка. Обязателен для заполнения, если account_type = 2
   */
  bank_bik?: any
}

/** Body_create_client_ofd_sources_ofd_post */
export interface BodyCreateClientOfdSourcesOfdPost {
  /** Тип синхронизации. Возможные значения: 1 - Отчет по чекам (как при подгрузке табличной формы). 2 - API ОФД (как при автозагрузке) */
  ofd_type: OFDType
  /** Источник ОФД. Возможные значения:1. ofd_type = 1: Платформа, Яндекс, СБИС, Такском, Контур. 2. ofd_type = 2: ОФД.ру Первый.ОФД */
  ofd_source: OFDSource
  /**
   * Ofd File
   * Файл выгрузки по чекам. Обязателен для заполнения, если ofd_type = 1
   * @format binary
   */
  ofd_file?: File
  /**
   * Login
   * Логин. Обязателен для заполнения, если account_type = 2
   */
  login?: any
  /**
   * Password
   * Пароль / Токен доступа. Обязателен для заполнения, если account_type = 2
   */
  password?: any
  /**
   * Date Begin
   * Дата, с которой необходимо подгружать чеки. Обязательна для заполнения, если account_type = 2
   */
  date_begin?: any
}

/** Body_login_auth_post */
export interface BodyLoginAuthPost {
  /**
   * Grant Type
   * @pattern password
   */
  grant_type?: string
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
  client_id?: string
  /** Client Secret */
  client_secret?: string
}

/** ContributionsInfo */
export interface ContributionsInfo {
  /**
   * Fixed Fees
   * Блок Фиксированные взносы
   */
  fixed_fees: FixedFeesInfo
  /**
   * Income Percentage
   * 1% с дохода
   */
  income_percentage?: IncomePercentage
}

/** CreateAccountResponse */
export interface CreateAccountResponse {
  /**
   * Request Id
   * @format uuid
   */
  request_id: string
  account_info_from_file?: AccountInfoFromFile
}

/**
 * CreateOperation
 * @example {"category":"debet","counterparty_name":"ИП Варягин","purpose":"Доход от продажи оборудования","amount":25000.9,"date":"2023-10-30","doc_number":"123"}
 */
export interface CreateOperation {
  /** Признак дебетования */
  category: OperationCategory
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
  doc_number?: string
}

/**
 * CreateTaxPaymentOperation
 * @example {"date":"2023-10-30","doc_number":"123","tax_period":2023,"tax_type":1,"amount":25000.9}
 */
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
  doc_number?: string
  /**
   * Tax Period
   * Год уплаты налога
   */
  tax_period: number
  /** Тип налога. Возможные значения: 1 - УСН. 2 - фиксированные взносы за ИП. 3 - 1% с дохода сверх 300 000 руб. 4 - ЕНС. 5 - ПФР. 6 - ОМС.  */
  tax_type: TaxType
  /** Amount */
  amount: number
}

/** CreateUser */
export interface CreateUser {
  /**
   * Email
   * Электронная почта клиента
   */
  email: string
  /**
   * Phone Number
   * Номер телефона клиента
   */
  phone_number?: string
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

/** GeneratePaymentOrder */
export interface GeneratePaymentOrder {
  /**
   * Account Number
   * Номер счета списания
   */
  account_number: string
  /**
   * Тип налога
   * @default 4
   */
  tax_type?: TaxType
  /**
   * Tax Period
   * Год уплаты налога
   */
  tax_period: number
  /**
   * Amount
   * Сумма операции
   */
  amount: number
}

/**
 * GenerateReportsRequest
 * @example {"report_type":2,"period_type":1,"period_year":2023}
 */
export interface GenerateReportsRequest {
  /** Тип запрашиваемого отчета. Возможные значения: 1 - КУДиР в формате pdf. 2 - Уведомления об исчисленных авансовых платежах по УСН (pdf + xml). 3 - Налоговая декларация УСН (pdf + xml).  */
  report_type: ReportType
  /** Тип налогового периода. Возможные значения: 1 - 1 квартал. 2 - 2 квартал. 3 - 3 квартал. 4 - 4 квартал. 6 - полугодие. 9 - 9 месяцев. 0 - весь год.Для КУДиР возможен выбор любого периода. Для Уведомления только 1-3 кварталы. Для декларации только 0 (весь год) */
  period_type: ReportPeriodType
  /**
   * Period Year
   * Год налогового периода
   */
  period_year: number
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

/** InnInfo */
export interface InnInfo {
  /**
   * Firstname
   * Имя
   */
  firstname: string
  /**
   * Lastname
   * Фамилия
   */
  lastname: string
  /**
   * Patronymic
   * Отчество
   */
  patronymic?: string
  /**
   * Fns Code
   * Код ИФНС
   */
  fns_code: string
  /**
   * Fns Description
   * Название ИФНС
   */
  fns_description?: string
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
   * ИНН клиента
   */
  inn: string
  /**
   * Tax Rate
   * Налоговая ставка
   */
  tax_rate: number
  /**
   * Start Year
   * Год начала расчета налогов
   */
  start_year: number
}

/** LeadInfoToSave */
export interface LeadInfoToSave {
  /**
   * Inn
   * ИНН клиента
   */
  inn: string
  /**
   * Tax Rate
   * Налоговая ставка
   */
  tax_rate?: number
  /**
   * Start Year
   * Год начала расчета налогов
   */
  start_year: number
  /** Система налогообложения. Возможные значения: usn_d - УСН Доходы. usn_d_r - УСН Доходы-Расходы. patent - Патент. eshn - ЕСХН. osn - Общая система НО.  */
  tax_system: TaxSystemType
  /**
   * Phone Number
   * Телефон пользователя
   */
  phone_number?: string
}

/** MarketplaceInfo */
export interface MarketplaceInfo {
  /**
   * Marketplace Name
   * Наименование маркетплейса
   */
  marketplace_name: string
  /**
   * Marketplace Update
   * Дата последней успешной интеграции
   * @format date
   */
  marketplace_update: string
}

/**
 * MarkupModeCode
 * An enumeration.
 */
export enum MarkupModeCode {
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
}

/**
 * NotificationType
 * An enumeration.
 */
export enum NotificationType {
  ValueНалогУСН = "Налог УСН",
  ValueФиксированныеВзносы = "Фиксированные взносы",
  Value1СДохода = "1% с дохода",
  ValueОтчетность = "Отчетность",
  ValueИныеУведомления = "Иные уведомления",
}

/** OFDInfo */
export interface OFDInfo {
  /**
   * Ofd Name
   * Наименование ОФД
   */
  ofd_name: string
  /**
   * Ofd Update
   * Дата последней успешной интеграции
   * @format date
   */
  ofd_update: string
}

/**
 * OFDSource
 * An enumeration.
 */
export enum OFDSource {
  ValueОФДРу = "ОФД.ру",
  ValueПервыйОФД = "Первый ОФД",
  ValueПлатформа = "Платформа",
  ValueЯндекс = "Яндекс",
  ValueСБИС = "СБИС",
  ValueТакском = "Такском",
  ValueКонтур = "Контур",
}

/**
 * OFDType
 * An enumeration.
 */
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
  account_number?: string
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
  currency_code?: string
  /** Признак дебетования */
  category: OperationCategory
  /**
   * Date
   * Дата совершения операции
   * @format date
   */
  date: string
  /**
   * Признак, кто выполнил разметку операции.
   * 1 - авторазметка БРН. 2 - разметка клиентом. 3 - разметка бухгалтером.
   */
  markup_mode_code: MarkupModeCode
  /**
   * Doc Number
   * Номер документа
   */
  doc_number: string
  markup: OperationMarkup
}

/**
 * OperationCategory
 * An enumeration.
 */
export enum OperationCategory {
  Debet = "debet",
  Credit = "credit",
}

/**
 * OperationCreditDescription
 * An enumeration.
 */
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

/**
 * OperationDebitDescription
 * An enumeration.
 */
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
 * @example {"operation_type":2,"amount":500.9,"debit_description":"Личные средства предпринимателя"}
 */
export interface OperationMarkup {
  /**
   * Вид операции.
   * 1 - доход. 2 - не влияет на налоговую базу. 3 - возврат покупателю. 4 - уплата налогов/взносов.
   */
  operation_type: OperationType
  /** Описание операций 'Поступления'. Возможно использование только одного параметра description! При использовании обязательно задание параметра operation_type! */
  debit_description?: OperationDebitDescription
  /** Описание операций 'Списания'. Возможно использование только одного параметра description! При использовании обязательно задание параметра operation_type! */
  credit_description?: OperationCreditDescription
  /**
   * Amount
   * Сумма, участвующая в разметке операции
   */
  amount: number
}

/**
 * OperationType
 * An enumeration.
 */
export enum OperationType {
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
}

/**
 * OperationsResponse
 * @example {"operations":[{"id":"0d8fce4c-8362-11ed-a1eb-0242ac120002","account_number":"40702810845370000004","counterparty_name":"Некоммерческая организация Потребительское общество взаимного страхования с \"Очень длинным названием\"","purpose":"Перевод денег на счет","amount_doc":1000.01,"currency_code":"RUB","category":"debet","date":"2022-04-13","markup_mode_code":1,"doc_number":"239","markup":{"operation_type":2,"amount":900.01,"description":"Оплата поставщику"}}],"pages_count":7}
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
   * @default 0
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

/**
 * ReportPeriodType
 * An enumeration.
 */
export enum ReportPeriodType {
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
  Value6 = 6,
  Value9 = 9,
  Value0 = 0,
}

/**
 * ReportStatus
 * An enumeration.
 */
export enum ReportStatus {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
}

/**
 * ReportType
 * An enumeration.
 */
export enum ReportType {
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
}

/**
 * SourcesInfo
 * @example {"clients":[{"inn":"027710159721","lastname":"Пупкин","firstname":"Василий","patronymic":"Петрович","fns_reg_date":"2020-09-17","fns":{"code":"0550","description":"Межрайонная инспекция ФНС России № 4 по Республике Дагестан"},"tax":{"tax_system":"Usn6","tax_rate":6,"tax_date_begin":"2022-01-01","oktmo":"12345678"},"accounts":[{"account_number":"40817810570000123456","bank_bik":"044525092","bank_name":"АО КБ Модульбанк","last_operation":"2023-09-06"}],"marketplaces":[{"marketplace_name":"Озон","marketplace_update":"2023-10-01"}]}]}
 */
export interface SourcesInfo {
  /**
   * Client
   * Информация о клиенте (может содержать обновленные данные)
   */
  client: InnInfo
  /**
   * Tax System Info
   * Информация о системе налогообложения
   */
  tax_system_info: TaxSystemInfo
  /**
   * Accounts
   * Список подключенных счетов
   */
  accounts?: AccountInfo[]
  /**
   * Marketplaces
   * Список подключенных маркетплейсов
   */
  marketplaces?: MarketplaceInfo[]
  /**
   * Ofd
   * Список подключенных ОФД
   */
  ofd?: OFDInfo[]
  /**
   * Comment
   * Комментарий
   */
  comment?: string
}

/** TaskInfo */
export interface TaskInfo {
  /** Тип задачи. Возможные значения: usn - Налог УСН. fixed_fees - Фиксированные взносы. income_percentage - 1% с дохода. report - отчетность. other - иные уведомления. */
  type: NotificationType
  /**
   * Year
   * Год расчета
   */
  year: number
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
   * Amount
   * Сумма к уплате по данной задаче
   */
  amount?: number
  /**
   * Purpose
   * Назначение платежа
   */
  purpose?: string
}

/**
 * TaskResponse
 * @example {"tasks":[{"type":"usn","year":2023,"code":"ZN3","title":"Налог УСН за 9 месяцев","description":"Уплата УСН за 9 месяцев до 30 октября","date_begin":"2023-10-01","due_date":"2023-10-30","amount":25450.5,"purpose":"Налог при упрощенной системе налогообложения (доходы) за 9 месяцев 2023 г."},{"type":"fixed_fees","year":2023,"code":"SV4","title":"Фиксированные взносы ИП за год","description":"Страховые взносы единый тариф ИП до 31 декабря текущего года.","date_begin":"2023-01-01","due_date":"2023-12-31","amount":45842,"purpose":"Страховые взносы единый тариф ИП за 2023 год"},{"type":"report","year":2023,"code":"ZDO","title":"Декларация по УСН","description":"Отправка декларации за год","date_begin":"2024-01-01","due_date":"2024-04-29"}]}
 */
export interface TaskResponse {
  /**
   * Tasks
   * Задачи по уплате налогов
   */
  tasks: TaskInfo[]
}

/**
 * TaxCalculationResponse
 * @example {"is_relevant":true,"recalculation_date":"2023-12-04T09:02:29.604000","usn_taxes":{"tax_rate":6,"usn_1":{"tax_base":756221,"deductions":45373,"accrued_tax":0,"paid_tax":0,"due_tax":0,"due_date":"2023-04-28"},"usn_6":{"tax_base":2357528,"deductions":61578,"accrued_tax":79874,"paid_tax":72695.5,"due_tax":7178.5,"due_date":"2023-07-28"},"usn_9":{"tax_base":2857528,"deductions":104332,"accrued_tax":67120,"paid_tax":67120,"due_tax":0,"due_date":"2023-10-30"},"usn_0":{"tax_base":2917528,"deductions":104932,"accrued_tax":70120,"paid_tax":70120,"due_tax":0,"due_date":"2024-04-29"}},"contributions":{"fixed_fees":{"accrued_ff":41003.12,"paid_ff":2575.5,"due_ff":38427.62,"due_date_ff":"2024-01-09"},"income_percentage":{"period_ip":9,"accrued_ip":25575.28,"paid_ip":0,"due_ip":25575.28,"due_date_ip":"2024-07-01"}},"ens_balance":{"opening_balance":2000,"closing_balance":0}}
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
  /**
   * Usn Taxes
   * Налоги УСН
   */
  usn_taxes: USNTaxes
  /**
   * Contributions
   * Взносы
   */
  contributions: ContributionsInfo
  /**
   * Ens Balance
   * Сальдо ЕНС
   */
  ens_balance: ENSBalanceInfo
}

/** TaxSystemInfo */
export interface TaxSystemInfo {
  /** Система налогообложения. Возможные значения: usn_d - УСН Доходы. usn_d_r - УСН Доходы-Расходы. patent - Патент. eshn - ЕСХН. osn - Общая система НО.  */
  tax_system: TaxSystemType
  /**
   * Tax Rate
   * Налоговая ставка
   */
  tax_rate: number
  /**
   * Tax Date Begin
   * Дата начала применения СНО
   * @format date
   */
  tax_date_begin: string
  /**
   * Oktmo
   * Код ОКТМО
   */
  oktmo: string
}

/**
 * TaxSystemType
 * An enumeration.
 */
export enum TaxSystemType {
  UsnD = "usn_d",
  UsnDR = "usn_d_r",
  Osn = "osn",
  Eshn = "eshn",
  Patent = "patent",
}

/**
 * TaxType
 * An enumeration.
 */
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
  /**
   * Usn 1
   * УСН за 1 квартал
   */
  usn_1: USNTaxInfo
  /**
   * Usn 6
   * УСН за полугодие
   */
  usn_6: USNTaxInfo
  /**
   * Usn 9
   * УСН за 9 месяцев
   */
  usn_9: USNTaxInfo
  /**
   * Usn 0
   * УСН за год
   */
  usn_0: USNTaxInfo
}

/**
 * UpdateReportRequest
 * @example {"report_type":2,"period_type":1,"period_year":2023,"report_status":2}
 */
export interface UpdateReportRequest {
  /** Тип запрашиваемого отчета. Возможные значения: 1 - КУДиР в формате pdf. 2 - Уведомления об исчисленных авансовых платежах по УСН (pdf + xml). 3 - Налоговая декларация УСН (pdf + xml).  */
  report_type: ReportType
  /** Тип налогового периода. Возможные значения: 1 - 1 квартал. 2 - 2 квартал. 3 - 3 квартал. 4 - 4 квартал. 6 - полугодие. 9 - 9 месяцев. 0 - весь год.Для КУДиР возможен выбор любого периода. Для Уведомления только 1-3 кварталы. Для декларации только 0 (весь год) */
  period_type: ReportPeriodType
  /**
   * Period Year
   * Год налогового периода
   */
  period_year: number
  /** Новый статус отчета. Возможные значения: 0 - отчет не сформирован. 1 - отчет сформирован и передан клиенту. 2 - отчет отправлен в ФНС. 3 - отчет принят ФНС. 4 - отчет не принят ФНС (ошибка в отчете). В данном методе используются статусы 2, 3, 4. */
  report_status: ReportStatus
}

/** User */
export interface User {
  /**
   * Id
   * @format uuid
   */
  id: string
  /**
   * Firstname
   * Имя
   */
  firstname?: string
  /**
   * Lastname
   * Фамилия
   */
  lastname?: string
  /**
   * Patronymic
   * Отчество
   */
  patronymic?: string
  /**
   * Inn
   * ИНН клиента
   */
  inn?: string
  /**
   * Tax Rate
   * Налоговая ставка
   */
  tax_rate?: number
  /**
   * Fns Code
   * Код ИФНС
   */
  fns_code?: string
  /**
   * Fns Description
   * Название ИФНС
   */
  fns_description?: string
  /**
   * Fns Reg Date
   * Дата регистрации ИП в ФНС
   * @format date
   */
  fns_reg_date?: string
  /**
   * Email
   * Электронная почта клиента
   */
  email?: string
  /**
   * Phone Number
   * Номер телефона клиента
   */
  phone_number?: string
  /**
   * Is Lead
   * Является ли клиент лидом
   * @default false
   */
  is_lead?: boolean
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
 * @title AKB - FastAPI Project
 * @version 0.1.0
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
     * No description
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
     * No description
     *
     * @tags Users
     * @name CreateUserUsersPost
     * @summary Зарегистрироваться. Шаг регистрации 1.
     * @request POST:/users
     */
    createUserUsersPost: (data: CreateUser, params: RequestParams = {}) =>
      this.request<User, HTTPValidationError | void>({
        path: `/users`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name GetInnInfoUsersInnInfoGet
     * @summary Получить информацию пользователя по ИНН. Шаг регистрации 2. Доступно, только если пользователь не имеет сохраненного ИНН в ЛК.
     * @request GET:/users/inn_info
     * @secure
     */
    getInnInfoUsersInnInfoGet: (
      query: {
        /**
         * Inn
         * ИНН клиента
         */
        inn: string
      },
      params: RequestParams = {}
    ) =>
      this.request<InnInfo, HTTPValidationError | void>({
        path: `/users/inn_info`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name SaveTaxInfoUsersTaxInfoPut
     * @summary Сохранить налоговую информацию по клиенту. Шаг регистрации 3. Доступно, только если пользователь не имеет сохраненного ИНН в ЛК.
     * @request PUT:/users/tax_info
     * @secure
     */
    saveTaxInfoUsersTaxInfoPut: (
      data: InnInfoToSave,
      params: RequestParams = {}
    ) =>
      this.request<User, HTTPValidationError | void>({
        path: `/users/tax_info`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name SaveLeadInfoUsersLeadInfoPut
     * @summary Сохранить лида по клиенту. Метод нужен для сохранения лида клиента, который не проходит по СНО.
     * @request PUT:/users/lead_info
     * @secure
     */
    saveLeadInfoUsersLeadInfoPut: (
      data: LeadInfoToSave,
      params: RequestParams = {}
    ) =>
      this.request<User, HTTPValidationError | void>({
        path: `/users/lead_info`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  }
  sources = {
    /**
     * No description
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
     * No description
     *
     * @tags Sources
     * @name CreateClientAccountSourcesAccountPost
     * @summary Добавление счета клиента
     * @request POST:/sources/account
     * @secure
     */
    createClientAccountSourcesAccountPost: (
      data: BodyCreateClientAccountSourcesAccountPost,
      params: RequestParams = {}
    ) =>
      this.request<CreateAccountResponse, HTTPValidationError | void>({
        path: `/sources/account`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Sources
     * @name CreateClientOfdSourcesOfdPost
     * @summary Добавление ОФД клиента
     * @request POST:/sources/ofd
     * @secure
     */
    createClientOfdSourcesOfdPost: (
      data: BodyCreateClientOfdSourcesOfdPost,
      params: RequestParams = {}
    ) =>
      this.request<any, HTTPValidationError | void>({
        path: `/sources/ofd`,
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
     * No description
     *
     * @tags Operations
     * @name GetOperationsOperationsGet
     * @summary Получить список размеченных операций
     * @request GET:/operations
     * @secure
     */
    getOperationsOperationsGet: (
      query: {
        /** Account Number */
        account_number?: string
        /**
         * Start Date
         * @format date
         */
        start_date?: string
        /**
         * End Date
         * @format date
         */
        end_date?: string
        /** An enumeration. */
        operation_type?: OperationType
        /** An enumeration. */
        debit_description?: OperationDebitDescription
        /** An enumeration. */
        credit_description?: OperationCreditDescription
        /** Page Number */
        page_number: number
        /** Row Count */
        row_count: number
        /**
         * Request Id
         * @format uuid
         */
        request_id: string
      },
      params: RequestParams = {}
    ) =>
      this.request<OperationsResponse, HTTPValidationError | void>({
        path: `/operations`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Operations
     * @name DeleteOperationsOperationsDelete
     * @summary Удалить операции
     * @request DELETE:/operations
     * @secure
     */
    deleteOperationsOperationsDelete: (
      data: string[],
      params: RequestParams = {}
    ) =>
      this.request<any, HTTPValidationError | void>({
        path: `/operations`,
        method: "DELETE",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
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
     * No description
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
      data: OperationMarkup,
      params: RequestParams = {}
    ) =>
      this.request<any, HTTPValidationError | void>({
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
     * No description
     *
     * @tags Operations
     * @name CreateOperationTaxPaymentOperationsTaxPaymentPost
     * @summary Добавить уплату налога
     * @request POST:/operations/tax_payment
     * @secure
     */
    createOperationTaxPaymentOperationsTaxPaymentPost: (
      data: CreateTaxPaymentOperation,
      params: RequestParams = {}
    ) =>
      this.request<any, HTTPValidationError | void>({
        path: `/operations/tax_payment`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Operations
     * @name RecalculateTaxesOperationsRecalculateTaxesPut
     * @summary Обновить расчет налога. (для обновления берется ИНН пользователя)
     * @request PUT:/operations/recalculate_taxes
     * @deprecated
     * @secure
     */
    recalculateTaxesOperationsRecalculateTaxesPut: (
      params: RequestParams = {}
    ) =>
      this.request<any, void>({
        path: `/operations/recalculate_taxes`,
        method: "PUT",
        secure: true,
        format: "json",
        ...params,
      }),
  }
  taxes = {
    /**
     * No description
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
      this.request<TaxCalculationResponse, HTTPValidationError | void>({
        path: `/taxes/calculation`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Taxes
     * @name GeneratePaymentOrderTaxesPaymentOrderPost
     * @summary Сформировать платежное поручение
     * @request POST:/taxes/payment_order
     * @secure
     */
    generatePaymentOrderTaxesPaymentOrderPost: (
      data: GeneratePaymentOrder,
      params: RequestParams = {}
    ) =>
      this.request<PaymentOrder, HTTPValidationError | void>({
        path: `/taxes/payment_order`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  }
  tasks = {
    /**
     * No description
     *
     * @tags Tasks
     * @name GetTasksTasksGet
     * @summary Получить задачи клиента
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
     * No description
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
      this.request<any, HTTPValidationError | void>({
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
     * No description
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
      this.request<void, HTTPValidationError | void>({
        path: `/reports`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  }
}

export const api = new Api({ baseUrl: "https://api-dev.buh.app" })
