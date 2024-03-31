export const CONTENT = {
  TITLE_ADD_SOURCE: "Добавить данные",
  TITLE_BANK_STATEMENT: "Выписка из банка",
  DESCRIPTION_BANK_STATEMENT: "Загрузить выписку в формате\u00A01С\u00A0(.txt)",
  TEXT_UPLOAD_DESCRIPTION_OFD_XLSX: "Загрузить выписку в формате .xlsx",
  TITLE_BANK_INTEGRATION: "Интеграция с банком",
  DESCRIPTION_BANK_INTEGRATION: "Модульбанк, Тинькофф, Точка",
  TITLE_ONLINE_CASHIER: "Онлайн-касса",
  DESCRIPTION_ONLINE_CASHIER:
    "ОФД.ру, Первый ОФД, Платформа, СБИС, Контур и т.д.",
  TITLE_MARKETPLACE_INTEGRATION: "Интеграция с маркетплейсом",
  DESCRIPTION_MARKETPLACE_INTEGRATION: "Ozon, Wildberries",
  NOTIFICATION_PROCESSING_SUCCESS: "Данные сохранены",
  NOTIFICATION_PROCESSING_FAILED: "Не удалось сохранить. Попробуйте еще раз",
  NOTIFICATION_INTEGRATE_ALPHA_FAILED:
    "Ошибка генерации ссылки. Повторите попытку",
  NOTIFICATION_INTEGRATE_OTHER_FAILED:
    "Ошибка сохранения данных. Повторите попытку",

  TEXT_UPLOAD_BANK_STATEMENT:
    "Подгрузите выписку в формате .txt (1С), сформированную в ЛК банка. Файл должен содержать все входящие и исходящие операции по одному счету ИП",
  TEXT_UPLOAD_TITLE: "Выберите или перетащите файлы",
  TEXT_LOADING_TITLE: "Загрузка..",
  TEXT_ERROR_TITLE: "Не удалось загрузить данные",
  TEXT_LOADED_TITLE: "Документ загружен",
  TEXT_LOADED_DESCRIPTION:
    "После успешной обработки данные отобразятся в разделе Операции",
  TEXT_UPLOAD_DESCRIPTION: "Загрузите файл в формате .txt",
  BUTTON_BACK: "Назад",
  TEXT_UPLOAD_BANK_INTEGRATION: "Выберите банк",
  TEXT_UPLOAD_ONLINE_CASHIER: "Выберите оператора фискальных данных",
  TEXT_UPLOAD_MARKETPLACE_INTEGRATION: "Выберите маркетплейс",
  INPUT_FAULT_ACCOUNT: "Поле заполнено некорректно",
  BANK_ALPHA: "Альфа-Банк",
  BANK_TINKOFF: "Тинькофф",
  BANK_MODUL: "Модульбанк",
  BANK_TOCHKA: "Точка",
  CASHIER_OFD: "OFD.ru",
  CASHIER_FIRST: "Первый ОФД",
  CASHIER_PLATFORM: "Платформа",
  CASHIER_YANDEX: "Яндекс ОФД",
  CASHIES_SBIS: "СБИС ОФД",
  CASHIER_TAXCOM: "Такском ОФД",
  CASHIER_KONTUR: "Контур",
  CASHIER_OTHER: "Другая касса",
  MARKETPLACE_OZON: "Ozon",
  MARKETPLACE_WB: "Wildberries",
  MARKETPLACE_YANDEX: "Яндекс.Маркет",
  MARKETPLACE_OTHER: "Другой маркетплейс",
  MARKETPLACE_OTHER_SHORT: "Другой",
  DATA_ACCOUNT: "Номер счета: ",
  DATA_BANKNAME: "Наименование банка: ",
  DATA_STATEMENT_BEGIN: "Дата начала выписки: ",
  DATA_STATEMENT_END: "Дата окончания выписки: ",
  BUTTON_GENERATE_LINK: "Сгенерировать ссылку",
  BUTTON_INTEGRATE_BANK: "Подключить",
  TEXT_ALPHA_INTEGRATE: "Синхронизация с Альфа-Банк",
  TEXT_OTHER_INTEGRATE: "Укажите данные для подключения",
  TEXT_OFD_DESCRIPTION: "Укажите данные для подключения ОФД",
  TEXT_OFD_DIFFERENT_DESCRIPTION: "Подгрузите отчёт по чекам в формате .xlsx",
  TEXT_OFD_LOGIN: "Логин / электронная почта",
  TEXT_OFD_OTHER:
    "К сожалению, синхронизация с другими ОФД сейчас не поддерживается, но вы можете указать название кассы и мы постараемся добавить её в наш сервис.",
  TEXT_OFD_OTHER_INPUT: "Название желаемой кассы",
  BUTTON_OFD_OTHER_SEND: "Отправить",
  BUTTON_OFD_OTHER_ADD: "Добавить доход",
  TEXT_OFD_OTHER_DESCRIPTION: "Добавить наличную выручку можно вручную.",
  TEXT_OTHER_INTEGRATE_DESCRIPTION:
    "Логин и пароль для подключения через 1С:ДиректБанк необходимо взять в ЛК Банка.",
  TEXT_OFD_SOURCE_DESCRIPTION:
    "Логин и пароль для интеграции с онлайн-кассой необходимо взять в ЛК ОФД.",
  ALPHA_INTEGRATE_DESCRIPTION:
    "Мы сгенерируем ссылку для предоставления доступа к данным. Ссылка отобразится в Источники данных. Для успешного подключения перейдите по ссылке и предоставьте доступ.",
  TEXT_LOGIN: "Логин",
  TEXT_PASSWORD: "Пароль",
  TEXT_BANK_BIK: "БИК банка",
  TEXT_BANK_ACCOUNT: "Номер банковского счета",
  TEXT_MARKETPLACE_ID_INPUT: "ID клиента",
  TEXT_MARKETPLACE_KEY_INPUT: "Ключ (токен подключения)",
  TEXT_MARKETPLACE_OZON_DESCRIPTION:
    "ID клиента и ключ для подключения через API необходимо сгенерировать в ЛК OZON.",
  TEXT_MARKETPLACE_WB_DESCRIPTION:
    "Ключ для подключения через API необходимо сгенерировать в ЛК Wildberries",
  TEXT_MARKETPLACE_YANDEX:
    "Мы сгенерируем ссылку для предоставления доступа к данным. Ссылка отобразится в Источники данных. Для успешного подключения перейдите по ссылке и предоставьте доступ.",
  TEXT_MARKETPLACE_YANDEX_DESCRIPTION:
    "Как только мы получим доступ, ваши продажи на Яндекс.Маркет отобразятся в разделе Операции",
  TEXT_MARKETPLACE_OTHER:
    "К сожалению, синхронизация с другими маркетплейсами сейчас не поддерживается, но вы можете указать название и мы постараемся добавить его в наш сервис.",
  TEXT_MARKETPLACE_OTHER_DESCRIPTION:
    "Добавить удержанные суммы (комиссии, доставка, хранение, маркетинг) можно вручную.",
  TEXT_MARKETPLACE_OTHER_INPUT: "Название желаемого маркетплейса",
  NECESSARY: " *",
  LINK_INSTRUCTIONS: " Инструкция →",
  INPUT_ERROR_HINT: "Это поле обязательно для заполнения",
  INPUT_PLACEHOLDER: "Введите",
}
