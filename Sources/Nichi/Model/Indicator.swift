import Foundation

enum DisplayStyle: String, Codable, CaseIterable, Identifiable, Sendable {
    case weekdayNarrow
    case weekdayShort
    case weekdayFull
    case dayNumber
    case monthDay
    case monthDayWeekday
    case fullDate
    case eraDate
    case custom

    var id: String { rawValue }

    var title: String {
        switch self {
        case .weekdayNarrow: "Weekday – single character"
        case .weekdayShort: "Weekday – short"
        case .weekdayFull: "Weekday – full"
        case .dayNumber: "Day number"
        case .monthDay: "Month and day"
        case .monthDayWeekday: "Month/day with weekday"
        case .fullDate: "Full date"
        case .eraDate: "Date with era"
        case .custom: "Custom pattern"
        }
    }
}

struct Indicator: Codable, Identifiable, Hashable, Sendable {
    var id = UUID()
    var localeID = "ja_JP"
    var calendarID = "gregorian"
    var style = DisplayStyle.weekdayNarrow
    var customPattern = "EEEEE"
    var bold = false
    var boxed = false

    static let `default` = Indicator()
}
