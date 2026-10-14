import AppKit
import SwiftUI
import Observation

@MainActor
final class AppDelegate: NSObject, NSApplicationDelegate {
    private let store = IndicatorStore.shared
    private var controllers: [Indicator.ID: StatusItemController] = [:]
    private var dayObserver: DayChangeObserver?

    func applicationDidFinishLaunching(_ notification: Notification) {
        rebuild()
        dayObserver = DayChangeObserver { [weak self] in self?.refreshAll() }
        observeStore()
    }

    private func observeStore() {
        withObservationTracking {
            _ = store.indicators
        } onChange: { [weak self] in
            Task { @MainActor in
                self?.rebuild()
                self?.observeStore()
            }
        }
    }

    private func rebuild() {
        let current = store.indicators
        let ids = Set(current.map(\.id))
        for (id, controller) in controllers where !ids.contains(id) {
            controller.remove()
            controllers[id] = nil
        }
        // Recreate in order so status items keep the configured ordering.
        for controller in controllers.values { controller.remove() }
        controllers.removeAll()
        for indicator in current.reversed() {
            controllers[indicator.id] = StatusItemController(
                indicator: indicator,
                allIndicators: { [store] in store.indicators },
                openSettings: { [weak self] in self?.showSettings() }
            )
        }
    }

    private func refreshAll() {
        for controller in controllers.values { controller.refresh() }
    }

    private var settingsWindow: NSWindow?

    func showSettings() {
        if settingsWindow == nil {
            let window = NSWindow(contentViewController: NSHostingController(rootView: SettingsView(store: store)))
            window.title = "Nichi Settings"
            window.styleMask = [.titled, .closable]
            window.isReleasedWhenClosed = false
            window.center()
            settingsWindow = window
        }
        NSApp.activate()
        settingsWindow?.makeKeyAndOrderFront(nil)
    }
}
