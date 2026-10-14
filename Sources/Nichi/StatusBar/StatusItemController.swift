import AppKit

/// Owns one `NSStatusItem` for one `Indicator`.
@MainActor
final class StatusItemController: NSObject {
    private(set) var indicator: Indicator
    private let statusItem: NSStatusItem
    private let allIndicators: () -> [Indicator]
    private let openSettings: () -> Void

    init(indicator: Indicator, allIndicators: @escaping () -> [Indicator], openSettings: @escaping () -> Void) {
        self.indicator = indicator
        self.allIndicators = allIndicators
        self.openSettings = openSettings
        statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
        super.init()
        refresh()
    }

    func update(indicator: Indicator) {
        self.indicator = indicator
        refresh()
    }

    func refresh(now: Date = .now) {
        let text = DateRenderer.string(for: now, indicator: indicator)
        guard let button = statusItem.button else { return }
        let font = NSFont.menuBarFont(ofSize: 0)
        let weighted = indicator.bold ? NSFontManager.shared.convert(font, toHaveTrait: .boldFontMask) : font
        if indicator.boxed {
            button.title = ""
            button.image = Self.boxedImage(text: text, font: weighted)
        } else {
            button.image = nil
            button.attributedTitle = NSAttributedString(string: text, attributes: [.font: weighted])
        }
        button.toolTip = DateRenderer.string(for: now, indicator: Indicator(localeID: indicator.localeID, calendarID: indicator.calendarID, style: .fullDate))
        statusItem.menu = buildMenu(now: now)
    }

    func remove() {
        NSStatusBar.system.removeStatusItem(statusItem)
    }

    private func buildMenu(now: Date) -> NSMenu {
        let menu = NSMenu()
        for item in allIndicators() {
            var full = item
            full.style = .fullDate
            let entry = NSMenuItem(title: DateRenderer.string(for: now, indicator: full), action: nil, keyEquivalent: "")
            entry.isEnabled = false
            menu.addItem(entry)
        }
        menu.addItem(.separator())
        menu.addItem(target(NSMenuItem(title: "Settings…", action: #selector(settings), keyEquivalent: ",")))
        let login = target(NSMenuItem(title: "Launch at Login", action: #selector(toggleLogin), keyEquivalent: ""))
        login.state = LaunchAtLogin.isEnabled ? .on : .off
        menu.addItem(login)
        menu.addItem(.separator())
        menu.addItem(NSMenuItem(title: "Quit Nichi", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q"))
        return menu
    }

    private func target(_ item: NSMenuItem) -> NSMenuItem {
        item.target = self
        return item
    }

    @objc private func settings() { openSettings() }

    @objc private func toggleLogin() {
        LaunchAtLogin.set(!LaunchAtLogin.isEnabled)
        refresh()
    }

    /// Template image: rounded rect outline with the text knocked out, so it tints with the menu bar.
    private static func boxedImage(text: String, font: NSFont) -> NSImage {
        let attrs: [NSAttributedString.Key: Any] = [.font: font]
        let size = (text as NSString).size(withAttributes: attrs)
        let pad: CGFloat = 4
        let imageSize = NSSize(width: ceil(size.width) + pad * 2, height: 18)
        let image = NSImage(size: imageSize, flipped: false) { rect in
            let path = NSBezierPath(roundedRect: rect.insetBy(dx: 0.5, dy: 0.5), xRadius: 4, yRadius: 4)
            NSColor.black.setFill()
            path.fill()
            let origin = NSPoint(x: (rect.width - size.width) / 2, y: (rect.height - size.height) / 2)
            (text as NSString).draw(at: origin, withAttributes: attrs)
            return true
        }
        // Punch the glyphs out of the filled box.
        let punched = NSImage(size: imageSize, flipped: false) { rect in
            image.draw(in: rect)
            guard let ctx = NSGraphicsContext.current?.cgContext else { return true }
            ctx.setBlendMode(.clear)
            let origin = NSPoint(x: (rect.width - size.width) / 2, y: (rect.height - size.height) / 2)
            (text as NSString).draw(at: origin, withAttributes: attrs)
            return true
        }
        punched.isTemplate = true
        return punched
    }
}
