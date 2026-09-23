package com.finsentinel.app

import android.content.ComponentName
import android.content.Intent
import android.os.Bundle
import android.provider.Settings
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.finsentinel.app.ui.theme.FINSENTINELTheme

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        if (!isNotificationAccessEnabled()) {
            try {
                val intent = Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)
                startActivity(intent)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }

        setContent {
            FINSENTINELTheme {
                NotificationAccessScreen(
                    isNotificationAccessEnabled = isNotificationAccessEnabled(),
                    onEnableClick = {
                        try {
                            val intent = Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)
                            startActivity(intent)
                        } catch (e: Exception) {
                            e.printStackTrace()
                        }
                    }
                )
            }
        }
    }

    override fun onResume() {
        super.onResume()

        setContent {
            FINSENTINELTheme {
                NotificationAccessScreen(
                    isNotificationAccessEnabled = isNotificationAccessEnabled(),
                    onEnableClick = {
                        try {
                            val intent = Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)
                            startActivity(intent)
                        } catch (e: Exception) {
                            e.printStackTrace()
                        }
                    }
                )
            }
        }
    }

    private fun isNotificationAccessEnabled(): Boolean {
        val packageName = packageName
        val enabledPackages = androidx.core.app.NotificationManagerCompat.getEnabledListenerPackages(this)
        return enabledPackages.contains(packageName)
    }
}

@Composable
fun NotificationAccessScreen(
    isNotificationAccessEnabled: Boolean,
    onEnableClick: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {

        Text(
            text = "FIN SENTINEL",
            style = MaterialTheme.typography.headlineLarge
        )

        Text(
            text = if (isNotificationAccessEnabled) {
                "Notification Access Enabled ✓"
            } else {
                "Notification Access is currently OFF"
            },
            style = MaterialTheme.typography.titleMedium,
            modifier = Modifier.padding(top = 20.dp)
        )

        Text(
            text = if (isNotificationAccessEnabled) {
                "FIN SENTINEL can now detect relevant EMI notifications from your phone."
            } else {
                "Enable notification access so FIN SENTINEL can detect EMI alerts automatically."
            },
            style = MaterialTheme.typography.bodyLarge,
            modifier = Modifier.padding(top = 16.dp)
        )

        if (!isNotificationAccessEnabled) {
            Button(
                onClick = onEnableClick,
                modifier = Modifier.padding(top = 24.dp)
            ) {
                Text("Enable Notification Access")
            }
        }
    }
}