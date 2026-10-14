package expo.modules.nichimidnight

import android.app.AlarmManager
import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import java.time.ZoneId
import java.time.ZonedDateTime

internal object MidnightScheduler {
  const val ACTION_MIDNIGHT = "expo.modules.nichimidnight.MIDNIGHT"

  // expo-widgets generates one provider class per widget name: <package>.<name>Provider.
  private val widgetNames = (1..4).map { "NichiSlot$it" }

  /**
   * Inexact alarm shortly after the next local midnight. `setAndAllowWhileIdle` needs no
   * exact-alarm permission, so the day can flip a few minutes late under Doze.
   */
  fun schedule(context: Context) {
    val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
    val zone = ZoneId.systemDefault()
    val triggerAt = ZonedDateTime.now(zone)
      .toLocalDate()
      .plusDays(1)
      .atStartOfDay(zone)
      .toInstant()
      .toEpochMilli() + 5_000L
    alarmManager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, pendingIntent(context))
  }

  /** Asks every placed Nichi widget to re-render; they pick today's entry themselves. */
  fun refreshWidgets(context: Context) {
    val manager = AppWidgetManager.getInstance(context)
    for (name in widgetNames) {
      val provider = ComponentName(context.packageName, "${context.packageName}.${name}Provider")
      val ids = manager.getAppWidgetIds(provider)
      if (ids.isEmpty()) continue
      val update = Intent(AppWidgetManager.ACTION_APPWIDGET_UPDATE).apply {
        component = provider
        putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids)
      }
      context.sendBroadcast(update)
    }
  }

  private fun pendingIntent(context: Context): PendingIntent {
    val intent = Intent(ACTION_MIDNIGHT).setClass(context, MidnightReceiver::class.java)
    return PendingIntent.getBroadcast(
      context,
      0,
      intent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )
  }
}
