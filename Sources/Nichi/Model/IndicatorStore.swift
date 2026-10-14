import Foundation
import Observation

@MainActor
@Observable
final class IndicatorStore {
    static let shared = IndicatorStore()
    private static let key = "indicators.v1"

    var indicators: [Indicator] {
        didSet { save() }
    }

    private let defaults: UserDefaults

    init(defaults: UserDefaults = .standard) {
        self.defaults = defaults
        if let data = defaults.data(forKey: Self.key),
           let decoded = try? JSONDecoder().decode([Indicator].self, from: data),
           !decoded.isEmpty {
            indicators = decoded
        } else {
            indicators = [.default]
        }
    }

    func add() {
        indicators.append(Indicator(localeID: "zh_Hans", calendarID: "gregorian"))
    }

    func remove(id: Indicator.ID) {
        guard indicators.count > 1 else { return }
        indicators.removeAll { $0.id == id }
    }

    private func save() {
        guard let data = try? JSONEncoder().encode(indicators) else { return }
        defaults.set(data, forKey: Self.key)
    }
}
