import SwiftUI

struct IndicatorEditor: View {
    @Binding var indicator: Indicator

    var body: some View {
        Form {
            Section {
                LabeledContent("Preview") {
                    Text(DateRenderer.string(for: .now, indicator: indicator))
                        .font(.title2.monospaced())
                }
            }
            Section {
                Picker("Locale", selection: $indicator.localeID) {
                    ForEach(SuggestedLocales.all) { Text($0.name).tag($0.id) }
                    if !SuggestedLocales.all.contains(where: { $0.id == indicator.localeID }) {
                        Text(indicator.localeID).tag(indicator.localeID)
                    }
                }
                Picker("Calendar", selection: $indicator.calendarID) {
                    ForEach(SuggestedLocales.calendars, id: \.id) { Text($0.name).tag($0.id) }
                }
                if let hint = SuggestedLocales.all.first(where: { $0.id == indicator.localeID })?.companionCalendar,
                   hint != indicator.calendarID {
                    Button("Use \(hint) calendar for this locale") { indicator.calendarID = hint }
                        .buttonStyle(.link)
                }
                Picker("Display", selection: $indicator.style) {
                    ForEach(DisplayStyle.allCases) { Text($0.title).tag($0) }
                }
                if indicator.style == .custom {
                    TextField("ICU pattern", text: $indicator.customPattern)
                        .font(.body.monospaced())
                }
            }
            Section {
                Toggle("Bold", isOn: $indicator.bold)
                Toggle("Boxed", isOn: $indicator.boxed)
            }
        }
        .formStyle(.grouped)
    }
}
