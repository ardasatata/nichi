import Foundation
import Testing
@testable import Nichi

struct DateRendererTests {
    // Thursday, 15 October 2026, noon UTC
    private let date = Date(timeIntervalSince1970: 1_792_065_600)
    private let utc = TimeZone(identifier: "UTC")!

    private func render(_ locale: String, _ style: DisplayStyle, calendar: String = "gregorian", pattern: String = "") -> String {
        var indicator = Indicator(localeID: locale, calendarID: calendar, style: style)
        indicator.customPattern = pattern
        return DateRenderer.string(for: date, indicator: indicator, timeZone: utc)
    }

    @Test func japaneseKanjiOnly() {
        #expect(render("ja_JP", .weekdayNarrow) == "木")
    }

    @Test func japaneseFullWeekday() {
        #expect(render("ja_JP", .weekdayFull) == "木曜日")
    }

    @Test func japaneseMonthDay() {
        #expect(render("ja_JP", .monthDay) == "10月15日")
    }

    @Test func japaneseEra() {
        #expect(render("ja_JP", .eraDate, calendar: "japanese").contains("令和8年"))
    }

    @Test func japaneseFullDate() {
        #expect(render("ja_JP", .fullDate).replacingOccurrences(of: " ", with: "") == "2026年10月15日木曜日")
    }

    @Test func chineseWeekday() {
        #expect(render("zh_Hans", .weekdayFull) == "星期四")
    }

    @Test func koreanWeekday() {
        #expect(render("ko_KR", .weekdayNarrow) == "목")
    }

    @Test func thaiBuddhistYear() {
        #expect(render("th_TH", .fullDate, calendar: "buddhist").contains("2569"))
    }

    @Test func customPattern() {
        #expect(render("ja_JP", .custom, pattern: "M/d(EEEEE)") == "10/15(木)")
    }

    @MainActor
    @Test func storeRoundTrip() {
        let suite = UserDefaults(suiteName: "nichi.tests.\(UUID().uuidString)")!
        let store = IndicatorStore(defaults: suite)
        store.add()
        let reloaded = IndicatorStore(defaults: suite)
        #expect(reloaded.indicators == store.indicators)
        #expect(reloaded.indicators.count == 2)
    }
}
