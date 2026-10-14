package expo.modules.nichimidnight

import expo.modules.kotlin.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class NichiMidnightModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("NichiMidnight")

    Function("schedule") {
      val context = appContext.reactContext ?: throw Exceptions.ReactContextLost()
      MidnightScheduler.schedule(context)
    }
  }
}
