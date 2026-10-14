import SwiftUI

struct SettingsView: View {
    @Bindable var store: IndicatorStore
    @State private var selection: Indicator.ID?

    var body: some View {
        NavigationSplitView {
            List(selection: $selection) {
                ForEach(store.indicators) { indicator in
                    Text(DateRenderer.string(for: .now, indicator: indicator))
                        .tag(indicator.id)
                }
                .onMove { store.indicators.move(fromOffsets: $0, toOffset: $1) }
            }
            .toolbar {
                ToolbarItemGroup {
                    Button("Add", systemImage: "plus") { store.add() }
                    Button("Remove", systemImage: "minus") {
                        if let selection { store.remove(id: selection) }
                    }
                    .disabled(store.indicators.count < 2 || selection == nil)
                }
            }
            .navigationSplitViewColumnWidth(min: 120, ideal: 140)
        } detail: {
            if let index = store.indicators.firstIndex(where: { $0.id == selection }) {
                IndicatorEditor(indicator: $store.indicators[index])
            } else {
                Text("Select an indicator").foregroundStyle(.secondary)
            }
        }
        .frame(width: 560, height: 380)
        .onAppear { selection = selection ?? store.indicators.first?.id }
    }
}
