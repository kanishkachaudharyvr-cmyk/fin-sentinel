import re
from datetime import date, timedelta
from dateutil import parser as date_parser

CURRENCY_RE = re.compile(r"(?:₹|Rs\.?|INR|रु)\s*([\d,]+(?:\.\d+)?)", re.I)
DATE_RE = re.compile(r"\b(\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?|\d{1,2}\s+(?:Jan|January|Feb|February|Mar|March|Apr|April|May|Jun|June|Jul|July|Aug|August|Sep|September|Oct|October|Nov|November|Dec|December))\b", re.I)


def extract_amount(text: str):
    match = CURRENCY_RE.search(text)
    if not match:
        return None
    return float(match.group(1).replace(",", ""))


def extract_due_date(text: str, today=None):
    today = today or date.today()
    lower = text.lower()
    if "tomorrow" in lower or "कल" in text:
        return today + timedelta(days=1)
    match = DATE_RE.search(text)
    if match:
        raw = match.group(1)
        try:
            parsed = date_parser.parse(raw, dayfirst=True, default=today.replace(day=1))
            return parsed.date()
        except (ValueError, OverflowError):
            pass
    day = re.search(r"(?:due|on|को)\s*(?:on|तारीख)?\s*(\d{1,2})(?:st|nd|rd|th)?", lower)
    if day:
        return date(today.year, today.month, min(int(day.group(1)), 28))
    return None


def classify(text: str):
    lower = text.lower()
    if any(token in lower for token in ("debited", "deducted", "paid", "भुगतान")):
        return "PAYMENT_DEBITED"
    if any(token in lower for token in ("due", "emi", "repay", "reminder", "कल", "तारीख")):
        return "PAYMENT_REMINDER"
    if any(token in lower for token in ("disbursed", "credited", "loan approved")):
        return "LOAN_DISBURSED"
    return "NON_FINANCIAL"


def infer_lender(sender: str, text: str):
    value = f"{sender} {text}".lower()
    for tokens, name in ((("lazypay", "lazy pay", "lazypy"), "LazyPay"), (("kreditbee", "kredit"), "KreditBee"), (("amazon", "amzpay"), "Amazon Pay"), (("slice",), "Slice"), (("hdfc", "hdfcbk"), "HDFC Bank")):
        if any(token in value for token in tokens):
            return name
    return sender.split("-")[-1].upper() or "Unknown lender"


def parse_notification(sender: str, text: str):
    return {"sender": sender, "text": text, "amount": extract_amount(text), "due_date": extract_due_date(text), "intent": classify(text), "lender_name": infer_lender(sender, text), "language": "Hindi" if re.search(r"[\u0900-\u097F]", text) else "English"}
