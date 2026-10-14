import Foundation

struct SuggestedLocale: Identifiable, Hashable, Sendable {
    let id: String
    let name: String
    /// Calendar that usually pairs well with this locale, offered as a hint in the UI.
    let companionCalendar: String?
}

enum SuggestedLocales {
    static let all: [SuggestedLocale] = [
        .init(id: "ja_JP", name: "日本語 (Japanese)", companionCalendar: "japanese"),
        .init(id: "zh_Hans", name: "简体中文 (Chinese, Simplified)", companionCalendar: "chinese"),
        .init(id: "zh_Hant", name: "繁體中文 (Chinese, Traditional)", companionCalendar: "chinese"),
        .init(id: "ko_KR", name: "한국어 (Korean)", companionCalendar: nil),
        .init(id: "th_TH", name: "ไทย (Thai)", companionCalendar: "buddhist"),
        .init(id: "he_IL", name: "עברית (Hebrew)", companionCalendar: "hebrew"),
        .init(id: "ar", name: "العربية (Arabic)", companionCalendar: "islamic-umalqura"),
        .init(id: "fa_IR", name: "فارسی (Persian)", companionCalendar: "persian"),
        .init(id: "hi_IN", name: "हिन्दी (Hindi)", companionCalendar: nil),
        .init(id: "vi_VN", name: "Tiếng Việt (Vietnamese)", companionCalendar: nil),
        .init(id: "en_US", name: "English (US)", companionCalendar: nil),
    ]

    static let calendars: [(id: String, name: String)] = [
        ("gregorian", "Gregorian"),
        ("japanese", "Japanese (令和)"),
        ("chinese", "Chinese lunar"),
        ("buddhist", "Buddhist"),
        ("hebrew", "Hebrew"),
        ("islamic-umalqura", "Islamic (Umm al-Qura)"),
        ("persian", "Persian"),
    ]

    static func calendar(for id: String) -> Calendar {
        let identifier: Calendar.Identifier = switch id {
        case "japanese": .japanese
        case "chinese": .chinese
        case "buddhist": .buddhist
        case "hebrew": .hebrew
        case "islamic-umalqura": .islamicUmmAlQura
        case "persian": .persian
        default: .gregorian
        }
        return Calendar(identifier: identifier)
    }
}
