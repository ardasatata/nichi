import Foundation

enum DateRenderer {
    static func string(for date: Date, indicator: Indicator, timeZone: TimeZone = .current) -> String {
        let locale = Locale(identifier: indicator.localeID)
        var calendar = SuggestedLocales.calendar(for: indicator.calendarID)
        calendar.locale = locale
        calendar.timeZone = timeZone

        let formatter = DateFormatter()
        formatter.locale = locale
        formatter.calendar = calendar
        formatter.timeZone = timeZone

        switch indicator.style {
        case .weekdayNarrow: formatter.dateFormat = "EEEEE"
        case .weekdayShort: formatter.dateFormat = "EEE"
        case .weekdayFull: formatter.dateFormat = "EEEE"
        case .dayNumber: apply(template: "d", to: formatter, locale: locale)
        case .monthDay: apply(template: "MMMd", to: formatter, locale: locale)
        case .monthDayWeekday: apply(template: "Md E", to: formatter, locale: locale)
        case .fullDate:
            formatter.dateStyle = .full
            formatter.timeStyle = .none
        case .eraDate: apply(template: "GyMMMdE", to: formatter, locale: locale)
        case .custom:
            formatter.dateFormat = indicator.customPattern.isEmpty ? "EEEEE" : indicator.customPattern
        }
        return formatter.string(from: date)
    }

    private static func apply(template: String, to formatter: DateFormatter, locale: Locale) {
        formatter.dateFormat = DateFormatter.dateFormat(fromTemplate: template, options: 0, locale: locale) ?? template
    }
}
