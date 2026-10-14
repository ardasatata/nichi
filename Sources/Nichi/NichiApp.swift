import SwiftUI

@main
struct NichiApp: App {
    @NSApplicationDelegateAdaptor(AppDelegate.self) private var delegate

    var body: some Scene {
        // Settings are shown from AppDelegate.showSettings(); a scene is required by App.
        Settings { EmptyView() }
    }
}
