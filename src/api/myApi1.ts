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

/** CreateUser */
export interface CreateUser {
  /** Email */
  email: string
  /** Phone Number */
  phone_number?: string
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[]
}

/** InnInfo */
export interface InnInfo {
  /** Firstname */
  firstname: string
  /** Lastname */
  lastname: string
  /** Patronymic */
  patronymic?: string
  /** Fns Code */
  fns_code: string
  /** Fns Description */
  fns_description?: string
  /**
   * Fns Reg Date
   * @format date
   */
  fns_reg_date: string
}

/** InnInfoToSave */
export interface InnInfoToSave {
  /** Firstname */
  firstname: string
  /** Lastname */
  lastname: string
  /** Patronymic */
  patronymic?: string
  /** Fns Code */
  fns_code: string
  /** Fns Description */
  fns_description?: string
  /**
   * Fns Reg Date
   * @format date
   */
  fns_reg_date: string
  /** Inn */
  inn: string
  /** Tax Rate */
  tax_rate: number
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
  /** Firstname */
  firstname?: string
  /** Lastname */
  lastname?: string
  /** Patronymic */
  patronymic?: string
  /** Inn */
  inn?: string
  /** Tax Rate */
  tax_rate?: number
  /** Fns Code */
  fns_code?: string
  /** Fns Description */
  fns_description?: string
  /**
   * Fns Reg Date
   * @format date
   */
  fns_reg_date?: string
  /** Email */
  email: string
  /** Phone Number */
  phone_number?: string
  /** Additional Data */
  additional_data?: object
  /**
   * Created At
   * @format date-time
   */
  created_at: string
  /**
   * Updated At
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
    headers: {
      "Content-Type": ContentType.Json,
    },
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
}

export const api = new Api({ baseUrl: "http://109.95.209.141:7777" })
