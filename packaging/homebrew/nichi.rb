cask "nichi" do
  version "__VERSION__"
  sha256 "__SHA256__"

  url "https://github.com/ardasatata/nichi/releases/download/v#{version}/Nichi-#{version}.dmg"
  name "Nichi"
  desc "Minimal menu bar day and date indicator"
  homepage "https://github.com/ardasatata/nichi"

  depends_on macos: ">= :sequoia"

  app "Nichi.app"

  zap trash: "~/Library/Preferences/com.ardasatata.nichi.plist"
end
