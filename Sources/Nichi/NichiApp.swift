import SwiftUI

@main
struct NichiApp: App {
    @NSApplicationDelegateAdaptor(AppDelegate.self) private var delegate

    var body: some Scene {
        Settings {
            SettingsView(store: IndicatorStore.shared)
        }
    }
}
