package expo.modules.nichimidnight

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/** Re-renders the widgets and re-arms the midnight alarm on every event that can change the day. */
class MidnightReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    MidnightScheduler.refreshWidgets(context)
    MidnightScheduler.schedule(context)
  }
}
