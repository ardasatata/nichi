// Renders the 日 app icon into the asset catalog, the docs site and the mobile app.
// Usage: swift scripts/make-icon.swift
import AppKit

func render(size: Int) -> Data {
    let s = CGFloat(size)
    let image = NSImage(size: NSSize(width: s, height: s), flipped: false) { rect in
        // Apple icon grid: artwork inset ~10% with a continuous-corner squircle.
        let body = rect.insetBy(dx: s * 0.098, dy: s * 0.098)
        let path = NSBezierPath(roundedRect: body, xRadius: body.width * 0.225, yRadius: body.width * 0.225)
        let ctx = NSGraphicsContext.current!.cgContext
        ctx.saveGState()
        ctx.setShadow(offset: CGSize(width: 0, height: -s * 0.012), blur: s * 0.03,
                      color: NSColor.black.withAlphaComponent(0.3).cgColor)
        NSColor.black.setFill(); path.fill()
        ctx.restoreGState()

        NSGradient(colors: [NSColor(srgbRed: 0.93, green: 0.27, blue: 0.22, alpha: 1),
                            NSColor(srgbRed: 0.66, green: 0.10, blue: 0.14, alpha: 1)])!
            .draw(in: path, angle: -90)

        // Soft top highlight.
        ctx.saveGState(); path.addClip()
        NSGradient(colors: [NSColor.white.withAlphaComponent(0.22), .clear])!
            .draw(in: NSRect(x: body.minX, y: body.midY, width: body.width, height: body.height / 2), angle: -90)
        ctx.restoreGState()

        let font = NSFont(name: "HiraMinProN-W6", size: body.height * 0.72)
            ?? NSFont.systemFont(ofSize: body.height * 0.7, weight: .heavy)
        let attrs: [NSAttributedString.Key: Any] = [.font: font, .foregroundColor: NSColor.white]
        let glyph = "日" as NSString
        let gs = glyph.size(withAttributes: attrs)
        glyph.draw(at: NSPoint(x: body.midX - gs.width / 2, y: body.midY - gs.height / 2 - body.height * 0.01),
                   withAttributes: attrs)
        return true
    }
    let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: size, pixelsHigh: size, bitsPerSample: 8,
                               samplesPerPixel: 4, hasAlpha: true, isPlanar: false,
                               colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
    rep.size = NSSize(width: size, height: size)
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
    image.draw(in: NSRect(x: 0, y: 0, width: s, height: s))
    NSGraphicsContext.restoreGraphicsState()
    return rep.representation(using: .png, properties: [:])!
}

func bitmap(size: Int, draw: (CGFloat) -> Void) -> Data {
    let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: size, pixelsHigh: size, bitsPerSample: 8,
                               samplesPerPixel: 4, hasAlpha: true, isPlanar: false,
                               colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
    rep.size = NSSize(width: size, height: size)
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
    draw(CGFloat(size))
    NSGraphicsContext.restoreGraphicsState()
    return rep.representation(using: .png, properties: [:])!
}

func drawGlyph(in size: CGFloat, fraction: CGFloat) {
    let font = NSFont(name: "HiraMinProN-W6", size: size * fraction) ?? NSFont.systemFont(ofSize: size * fraction, weight: .heavy)
    let attrs: [NSAttributedString.Key: Any] = [.font: font, .foregroundColor: NSColor.white]
    let glyph = "日" as NSString
    let gs = glyph.size(withAttributes: attrs)
    glyph.draw(at: NSPoint(x: size / 2 - gs.width / 2, y: size / 2 - gs.height / 2 - size * 0.01), withAttributes: attrs)
}

/// Full-bleed square for iOS / Expo `icon` (the system applies the mask).
func renderMobileIcon(size: Int) -> Data {
    bitmap(size: size) { s in
        NSGradient(colors: [NSColor(srgbRed: 0.93, green: 0.27, blue: 0.22, alpha: 1),
                            NSColor(srgbRed: 0.66, green: 0.10, blue: 0.14, alpha: 1)])!
            .draw(in: NSRect(x: 0, y: 0, width: s, height: s), angle: -90)
        drawGlyph(in: s, fraction: 0.72)
    }
}

/// Transparent glyph kept inside the Android adaptive-icon safe zone (inner ~66%).
func renderAdaptiveForeground(size: Int) -> Data {
    bitmap(size: size) { s in drawGlyph(in: s, fraction: 0.5) }
}

let fm = FileManager.default
let set = "Resources/Assets.xcassets/AppIcon.appiconset"
try fm.createDirectory(atPath: set, withIntermediateDirectories: true)
try fm.createDirectory(atPath: "docs", withIntermediateDirectories: true)

var images: [[String: String]] = []
for base in [16, 32, 128, 256, 512] {
    for scale in [1, 2] {
        let px = base * scale
        let name = "icon_\(base)x\(base)@\(scale)x.png"
        try render(size: px).write(to: URL(fileURLWithPath: "\(set)/\(name)"))
        images.append(["idiom": "mac", "size": "\(base)x\(base)", "scale": "\(scale)x", "filename": name])
    }
}
let contents: [String: Any] = ["images": images, "info": ["version": 1, "author": "xcode"]]
try JSONSerialization.data(withJSONObject: contents, options: [.prettyPrinted, .sortedKeys])
    .write(to: URL(fileURLWithPath: "\(set)/Contents.json"))
try render(size: 512).write(to: URL(fileURLWithPath: "docs/icon.png"))
try render(size: 64).write(to: URL(fileURLWithPath: "docs/favicon.png"))
try fm.createDirectory(atPath: "mobile/assets", withIntermediateDirectories: true)
try renderMobileIcon(size: 1024).write(to: URL(fileURLWithPath: "mobile/assets/icon.png"))
try renderAdaptiveForeground(size: 1024).write(to: URL(fileURLWithPath: "mobile/assets/adaptive-icon.png"))
print("icons written")
