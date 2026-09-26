package com.finsentinel.app

import android.app.Notification
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.delay
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.concurrent.TimeUnit

class NotificationListener : NotificationListenerService() {

    private val client = OkHttpClient.Builder()
        .connectTimeout(10, TimeUnit.SECONDS)
        .writeTimeout(10, TimeUnit.SECONDS)
        .readTimeout(10, TimeUnit.SECONDS)
        .build()

    // CONFIGURABLE BACKEND URL
    // Change this to your local IP (e.g. http://192.168.1.5:8000) or your production domain
    private val BACKEND_URL = "https://finsentinel-hackathon.loca.lt"
    
    private val scope = CoroutineScope(Dispatchers.IO)
    private val jsonMediaType = "application/json; charset=utf-8".toMediaType()

    override fun onListenerConnected() {
        super.onListenerConnected()
        startHeartbeat()
    }

    private fun startHeartbeat() {
        scope.launch {
            while (true) {
                try {
                    val request = Request.Builder()
                        .url("$BACKEND_URL/api/device/heartbeat")
                        .addHeader("Bypass-Tunnel-Reminder", "true")
                        .post("{}".toRequestBody(jsonMediaType))
                        .build()
                    client.newCall(request).execute().use { response ->
                        if (!response.isSuccessful) {
                            Log.e("FIN_SENTINEL", "Heartbeat failed: ${response.code}")
                        }
                    }
                } catch (e: Exception) {
                    Log.e("FIN_SENTINEL", "Heartbeat error: ${e.message}")
                }
                delay(30000) // Send heartbeat every 30 seconds
            }
        }
    }

    override fun onNotificationPosted(sbn: StatusBarNotification) {
        val packageName = sbn.packageName
        val extras = sbn.notification.extras

        val title = extras.getCharSequence(Notification.EXTRA_TITLE)?.toString() ?: ""
        val text = extras.getCharSequence(Notification.EXTRA_TEXT)?.toString() ?: ""
        val bigText = extras.getCharSequence(Notification.EXTRA_BIG_TEXT)?.toString() ?: ""

        val fullText = "$title $text $bigText"

        Log.d("FIN_SENTINEL", "Notification received | App: $packageName | Text: $fullText")

        val isEmi = isEMINotification(fullText)
        var amount: String? = null
        var dueDate: String? = null

        if (isEmi) {
            amount = extractAmount(fullText)
            dueDate = extractDueDate(fullText)
            Log.d("FIN_SENTINEL", "EMI DETECTED | Amount: ₹$amount | Due Date: $dueDate")
        }
        
        sendStructuredEvent(packageName, title, fullText, isEmi, amount, dueDate)
    }

    private fun sendStructuredEvent(
        packageName: String,
        title: String,
        text: String,
        isEmi: Boolean,
        amountStr: String?,
        dueDate: String?
    ) {
        scope.launch {
            try {
                val json = JSONObject().apply {
                    put("source", getAppName(packageName))
                    put("packageName", packageName)
                    put("title", title)
                    put("text", text)
                    put("isEmi", isEmi)
                    
                    val amountVal = amountStr?.replace(",", "")?.toDoubleOrNull()
                    if (amountVal != null) {
                        put("amount", amountVal)
                    } else {
                        put("amount", JSONObject.NULL)
                    }
                    
                    put("dueDate", dueDate ?: JSONObject.NULL)
                    
                    val detectedAt = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.US).format(Date())
                    put("detectedAt", detectedAt)
                }

                val body = json.toString().toRequestBody(jsonMediaType)
                val request = Request.Builder()
                    .url("$BACKEND_URL/api/device/notifications")
                    .addHeader("Bypass-Tunnel-Reminder", "true")
                    .post(body)
                    .build()

                client.newCall(request).execute().use { response ->
                    if (response.isSuccessful) {
                        Log.d("FIN_SENTINEL", "Event sent successfully")
                    } else {
                        Log.e("FIN_SENTINEL", "Event failed: ${response.code}")
                    }
                }
            } catch (e: Exception) {
                Log.e("FIN_SENTINEL", "Network error sending event: ${e.message}")
            }
        }
    }

    private fun getAppName(packageName: String): String {
        return try {
            val pm = packageManager
            val info = pm.getApplicationInfo(packageName, 0)
            pm.getApplicationLabel(info).toString()
        } catch (e: Exception) {
            packageName
        }
    }

    private fun isEMINotification(text: String): Boolean {
        val lowerText = text.lowercase()
        val keywords = listOf(
            "emi", "installment", "instalment", "loan payment",
            "loan repayment", "repayment", "pay later", "due date", "monthly payment"
        )
        return keywords.any { keyword -> lowerText.contains(keyword) }
    }

    private fun extractAmount(text: String): String {
        val pattern = Regex("""(?:₹|rs\.?|inr)\s?([0-9]+(?:,[0-9]{3})*(?:\.[0-9]{1,2})?)""", RegexOption.IGNORE_CASE)
        val match = pattern.find(text)
        return match?.groupValues?.get(1) ?: "Not detected"
    }

    private fun extractDueDate(text: String): String {
        val datePattern = Regex("""\b([0-3]?\d[-/][0-1]?\d[-/]\d{4})\b""")
        val match = datePattern.find(text)
        if (match != null) {
            return match.groupValues[1]
        }
        val monthPattern = Regex("""\b([0-3]?\d)\s+(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})\b""", RegexOption.IGNORE_CASE)
        val monthMatch = monthPattern.find(text)
        if (monthMatch != null) {
            return monthMatch.value
        }
        return "Not detected"
    }

    override fun onNotificationRemoved(sbn: StatusBarNotification) {
        Log.d("FIN_SENTINEL", "Notification removed from: ${sbn.packageName}")
    }
}