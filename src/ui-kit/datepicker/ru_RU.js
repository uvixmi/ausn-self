"use strict"

var _interopRequireDefault =
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("@babel/runtime/helpers/interopRequireDefault").default
Object.defineProperty(exports, "__esModule", {
  value: true,
})
exports.default = void 0
// eslint-disable-next-line @typescript-eslint/no-var-requires
var _ru_RU = _interopRequireDefault(require("rc-picker/lib/locale/ru_RU"))
// eslint-disable-next-line @typescript-eslint/no-var-requires
var _ru_RU2 = _interopRequireDefault(require("../../time-picker/locale/ru_RU"))
/** Created by Andrey Gayvoronsky on 13/04/16. */

// Merge into a locale object
export const locale = {
  lang: Object.assign(
    {
      placeholder: "Выберите дату",
      yearPlaceholder: "Выберите год",
      quarterPlaceholder: "Выберите квартал",
      monthPlaceholder: "Выберите месяц",
      weekPlaceholder: "Выберите неделю",
      rangePlaceholder: ["Начальная дата", "Конечная дата"],
      rangeYearPlaceholder: ["Начальный год", "Год окончания"],
      rangeMonthPlaceholder: ["Начальный месяц", "Конечный месяц"],
      rangeWeekPlaceholder: ["Начальная неделя", "Конечная неделя"],
      shortWeekDays: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
      shortMonths: [
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь",
      ],
    },
    _ru_RU.default
  ),
  timePickerLocale: Object.assign({}, _ru_RU2.default),
}
