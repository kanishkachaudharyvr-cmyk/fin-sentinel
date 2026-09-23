# 🛡️ FIN SENTINEL 
**Detect. Predict. Protect. — Built by The Mystic Merge for MUSA CODEX 2026**

FIN SENTINEL is a privacy-first, AI-driven financial early-warning system. It securely intercepts loan/EMI SMS notifications directly on the user's Android device and reconstructs their repayment obligations into a live, interactive web dashboard—without requiring access to sensitive bank credentials or third-party aggregators.

## 🚀 The MVP Architecture
Our Hackathon MVP consists of three core components:

1. **Android Sensor (`/android`)**
   - Built natively in Kotlin.
   - Leverages `NotificationListenerService` to passively scan incoming SMS notifications for EMI/loan keywords.
   - Extracts `lender`, `amount`, and `due date` completely on-device.
   - Pushes sanitized, structured JSON payloads to the backend.

2. **FastAPI Graph Engine (`/main.py`)**
   - A lightweight Python backend running locally/tunneled.
   - Deduplicates incoming events using NetworkX graph theory to prevent double-counting.
   - Calculates the user's real-time Debt-to-Income (DTI) ratio.

3. **Next.js Dashboard (`/components`)**
   - A responsive frontend deployed on Vercel.
   - Visualizes cash-flow forecasts, repayment calendars, and real-time alerts.
   - Includes a "Before-You-Borrow" Simulator to instantly calculate the impact of a new loan on the user's DTI before they commit.
   - Features a localized Voice Assistant (English, Hindi, Marathi) powered by the local data graph.

## 🛠️ How to Run Locally

### 1. Python Backend
```bash
pip install fastapi uvicorn sqlalchemy pydantic networkx okhttp3
uvicorn main:app --reload --port 8000
```

### 2. Tunnel to Public Internet
```bash
npx -y localtunnel --port 8000 --subdomain finsentinel-hackathon
```

### 3. Vercel Frontend
Ensure your Vercel deployment has the Environment Variable `NEXT_PUBLIC_API_BASE_URL` set to the Localtunnel URL generated above.

### 4. Android App
1. Open the `/android` folder in Android Studio.
2. Update `BACKEND_URL` in `NotificationListener.kt` to the Localtunnel URL.
3. Build and install on an Android device.

## 💡 Future Roadmap
- **Deep Integration:** Connecting to Account Aggregator (AA) frameworks for holistic net-worth tracking.
- **Advanced Predictive AI:** Forecasting future cash-flow crunches based on recurring spending behaviors.
- **Offline LLM:** Moving the natural-language query assistant entirely onto the Android device for 100% zero-trust privacy.

---
*Built with ❤️ for MUSA Codex 2026.*
