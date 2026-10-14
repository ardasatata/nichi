import AppKit

/// Fires `onChange` whenever the displayed date may have changed.
@MainActor
final class DayChangeObserver {
    private var tokens: [(NotificationCenter, NSObjectProtocol)] = []

    init(onChange: @escaping @MainActor () -> Void) {
        let names: [(NotificationCenter, Notification.Name)] = [
            (.default, .NSCalendarDayChanged),
            (.default, .NSSystemClockDidChange),
            (.default, NSNotification.Name.NSSystemTimeZoneDidChange),
            (.default, NSLocale.currentLocaleDidChangeNotification),
            (NSWorkspace.shared.notificationCenter, NSWorkspace.didWakeNotification),
        ]
        for (center, name) in names {
            let token = center.addObserver(forName: name, object: nil, queue: .main) { _ in
                MainActor.assumeIsolated { onChange() }
            }
            tokens.append((center, token))
        }
    }

    isolated deinit {
        for (center, token) in tokens { center.removeObserver(token) }
    }
}
