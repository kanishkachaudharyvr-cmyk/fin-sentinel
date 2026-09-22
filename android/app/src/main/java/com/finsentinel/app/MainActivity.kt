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

        setContent {
            FINSENTINELTheme {
                NotificationAccessScreen(
                    isNotificationAccessEnabled = isNotificationAccessEnabled(),
                    onEnableClick = {
                        val intent =
                            Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)
                        startActivity(intent)
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
                        val intent =
                            Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)
                        startActivity(intent)
                    }
                )
            }
        }
    }

    private fun isNotificationAccessEnabled(): Boolean {
        val enabledListeners =
            Settings.Secure.getString(
                contentResolver,
                "enabled_notification_listeners"
            ) ?: return false

        val componentName = ComponentName(
            this,
            NotificationListener::class.java
        )

        return enabledListeners.contains(componentName.flattenToString())
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