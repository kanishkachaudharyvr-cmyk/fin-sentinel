package com.finsentinel.app

import android.app.Notification
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log

class NotificationListener : NotificationListenerService() {

    override fun onNotificationPosted(sbn: StatusBarNotification) {

        val packageName = sbn.packageName
        val extras = sbn.notification.extras

        val title = extras.getCharSequence(Notification.EXTRA_TITLE)
            ?.toString()
            ?: ""

        val text = extras.getCharSequence(Notification.EXTRA_TEXT)
            ?.toString()
            ?: ""

        val bigText = extras.getCharSequence(Notification.EXTRA_BIG_TEXT)
            ?.toString()
            ?: ""

        // Combine notification text
        val fullText = "$title $text $bigText"

        Log.d(
            "FIN_SENTINEL",
            "Notification received | App: $packageName | Text: $fullText"
        )

        // Check whether notification looks like an EMI notification
        if (isEMINotification(fullText)) {

            val amount = extractAmount(fullText)
            val dueDate = extractDueDate(fullText)

            Log.d(
                "FIN_SENTINEL",
                "EMI DETECTED | Amount: ₹$amount | Due Date: $dueDate"
            )
        }
    }

    private fun isEMINotification(text: String): Boolean {

        val lowerText = text.lowercase()

        val keywords = listOf(
            "emi",
            "installment",
            "instalment",
            "loan payment",
            "loan repayment",
            "repayment",
            "pay later",
            "due date",
            "monthly payment"
        )

        return keywords.any { keyword ->
            lowerText.contains(keyword)
        }
    }

    private fun extractAmount(text: String): String {

        // Matches:
        // ₹2,499
        // ₹2499
        // Rs. 2499
        // Rs 2,499
        // INR 2499

        val pattern = Regex(
            """(?:₹|rs\.?|inr)\s?([0-9]+(?:,[0-9]{3})*(?:\.[0-9]{1,2})?)""",
            RegexOption.IGNORE_CASE
        )

        val match = pattern.find(text)

        return match?.groupValues?.get(1) ?: "Not detected"
    }

    private fun extractDueDate(text: String): String {

        // Matches:
        // 28-09-2026
        // 28/09/2026
        // 28-9-2026
        // 28/9/2026

        val datePattern = Regex(
            """\b([0-3]?\d[-/][0-1]?\d[-/]\d{4})\b"""
        )

        val match = datePattern.find(text)

        if (match != null) {
            return match.groupValues[1]
        }

        // Also check for formats such as:
        // 28 September 2026
        // 28 Sep 2026

        val monthPattern = Regex(
            """\b([0-3]?\d)\s+(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})\b""",
            RegexOption.IGNORE_CASE
        )

        val monthMatch = monthPattern.find(text)

        if (monthMatch != null) {
            return monthMatch.value
        }

        return "Not detected"
    }

    override fun onNotificationRemoved(sbn: StatusBarNotification) {

        Log.d(
            "FIN_SENTINEL",
            "Notification removed from: ${sbn.packageName}"
        )
    }
}