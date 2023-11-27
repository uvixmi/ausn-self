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
   * БИК банка счета
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

/** CreateIncomeOperation */
export interface CreateIncomeOperation {
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
  doc_number?: string
  /**
   * Tax Period
   * Год уплаты налога
   */
  tax_period: number
  /** Тип налога. 1 - УСН. 2 - Фиксированные взносы за ИП. 3 - 1% с дохода сверх 300 000 руб. 4 - ЕНС. 5 - ПФР. 6 - ОМС */
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

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[]
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
  account_number: string
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

/** OperationMarkup */
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

/** OperationsResponse */
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

/** SourcesInfo */
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

/** TaxSystemInfo */
export interface TaxSystemInfo {
  /**
   * Tax System
   * Применяемая СНО
   */
  tax_system: string
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
  email: string
  /**
   * Phone Number
   * Номер телефона клиента
   */
  phone_number?: string
  /**
   * Additional Data
   * Дополнительная информация по пользователю
   */
  additional_data?: object
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
      this.request<Token, HTTPValidationError>({
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
      this.request<User, any>({
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
     * @summary Зарегистрироваться
     * @request POST:/users
     */
    createUserUsersPost: (data: CreateUser, params: RequestParams = {}) =>
      this.request<User, HTTPValidationError>({
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
     * @summary Получить информацию пользователя по ИНН. Доступно, только если пользователь уже не сохранил ИНН в ЛК.
     * @request GET:/users/inn_info
     * @secure
     */
    getInnInfoUsersInnInfoGet: (
      query: {
        /** Inn */
        inn: string
        /** Tax Rate */
        tax_rate: number
      },
      params: RequestParams = {}
    ) =>
      this.request<InnInfo, HTTPValidationError>({
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
     * @name SaveInnInfoUsersInnInfoPut
     * @summary Обновить информацию по ИНН. Доступно, только если пользователь уже не сохранил ИНН в ЛК.
     * @request PUT:/users/inn_info
     * @secure
     */
    saveInnInfoUsersInnInfoPut: (
      data: InnInfoToSave,
      params: RequestParams = {}
    ) =>
      this.request<User, HTTPValidationError>({
        path: `/users/inn_info`,
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
     * @name GetSourceInfoSourcesGet
     * @summary Получить информацию о подключенных счетах, макретплейсах и ОФД пользователя
     * @request GET:/sources
     * @secure
     */
    getSourceInfoSourcesGet: (params: RequestParams = {}) =>
      this.request<SourcesInfo, any>({
        path: `/sources`,
        method: "GET",
        secure: true,
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
        /** Inn */
        inn: string
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
      this.request<OperationsResponse, HTTPValidationError>({
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
     * @name CreateOperationIncomeOperationsIncomePost
     * @summary Добавить статью дохода
     * @request POST:/operations/income
     * @secure
     */
    createOperationIncomeOperationsIncomePost: (
      data: CreateIncomeOperation,
      params: RequestParams = {}
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/operations/income`,
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
     * @name CreateOperationTaxPaymentOperationsTaxPaymentPost
     * @summary Добавить уплату налога
     * @request POST:/operations/tax_payment
     * @secure
     */
    createOperationTaxPaymentOperationsTaxPaymentPost: (
      data: CreateTaxPaymentOperation,
      params: RequestParams = {}
    ) =>
      this.request<any, HTTPValidationError>({
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
     * @name GeneratePaymentOrderOperationsPaymentOrderPost
     * @summary Сформировать платежное поручение
     * @request POST:/operations/payment_order
     * @secure
     */
    generatePaymentOrderOperationsPaymentOrderPost: (
      data: GeneratePaymentOrder,
      params: RequestParams = {}
    ) =>
      this.request<PaymentOrder, HTTPValidationError>({
        path: `/operations/payment_order`,
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
     * @name UpdateOperationOperationsOperationIdPut
     * @summary Переразметить операцию
     * @request PUT:/operations/{operation_id}
     * @secure
     */
    updateOperationOperationsOperationIdPut: (
      operationId: string,
      data: OperationMarkup,
      params: RequestParams = {}
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/operations/${operationId}`,
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
     * @tags Operations
     * @name RecalculateTaxesOperationsRecalculateTaxesPut
     * @summary Обновить расчет налога. (для обновления берется ИНН пользователя)
     * @request PUT:/operations/recalculate_taxes
     * @secure
     */
    recalculateTaxesOperationsRecalculateTaxesPut: (
      params: RequestParams = {}
    ) =>
      this.request<any, any>({
        path: `/operations/recalculate_taxes`,
        method: "PUT",
        secure: true,
        format: "json",
        ...params,
      }),
  }
}

export const api = new Api({ baseUrl: "http://109.95.209.141:7777" })
