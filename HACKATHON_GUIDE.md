# 🚀 FIN SENTINEL - Round 2 Hackathon Game Plan

## 1. The GitHub Submission
Your repository is completely ready. I have already generated a professional `README.md` in your project folder.
**Action:** Run `git push origin main` in your terminal to upload the new README to GitHub, then submit your GitHub link to the judges.

## 2. The Updated PPT (Slide Deck)
The judges want to see the progress you've made since Round 1. Update your slides to include:
- **"What we actually built" slide:** Add a screenshot of your live Vercel dashboard.
- **The Architecture slide:** Show the flow: *Android Phone (Interceptor) ➔ Local Python Engine (Graph Logic) ➔ Vercel Web Dashboard*.
- **Privacy Emphasis:** Emphasize that you achieved "Zero-Trust" privacy by reading SMS notifications locally on the phone rather than asking users for sensitive net-banking passwords.

## 3. The 7-8 Minute Demo Video (CRITICAL)
Do not just scroll through code. Show the **impact** of what you built. Use screen recording software (like OBS Studio or Windows Game Bar). Cast your Android phone to your PC screen (using Windows Phone Link or scrcpy) so the judges can see both your phone and dashboard side-by-side.

### 🎬 Video Script Flow (7 Minutes):

* **0:00 - 1:00 (The Hook & Problem):** 
  - Introduce "FIN SENTINEL". 
  - Explain the problem: People take on too many EMIs (Buy-Now-Pay-Later) and don't realize they are drowning in debt until they default.

* **1:00 - 2:00 (The Solution):** 
  - Explain your unique approach. 
  - Instead of asking for bank passwords, you built an Android app that securely and privately reads EMI SMS notifications right on the device.

* **2:00 - 5:00 (The Live Demo - *The Wow Moment*):** 
  - Show the empty Vercel dashboard on your laptop.
  - Send a fake EMI SMS to your phone (e.g., *"Rs 4,500 EMI deducted for HDFC Bank"*).
  - Show the Android app intercepting it.
  - Switch back to the dashboard and watch the calendar, cash-flow graph, and notifications **instantly update live on the screen**.
  - Click on the **Simulator Tab** and show how a user can test adding a ₹5,000 EMI to see if their Debt-to-Income (DTI) ratio enters the "Danger Zone" before taking a loan.

* **5:00 - 6:30 (Under the Hood):** 
  - Briefly open VS Code. 
  - Show the Python FastAPI graph engine and explain how you built the API to sync the phone to the web dashboard in real-time.

* **6:30 - 7:30 (Future Roadmap):** 
  - Mention future plans: offline on-device LLMs (so data never leaves the phone), connecting to the Account Aggregator framework, and predictive cash-flow AI.

### 🛑 Pre-Recording Checklist:
1. Make sure your Python backend is running (`uvicorn main:app --reload --port 8000`).
2. Make sure your tunnel is running (`npx -y localtunnel --port 8000 --subdomain finsentinel-hackathon`).
3. Make sure the Android app is running on your phone.
4. Record, upload to YouTube as **Unlisted**, and submit!

Good luck, team Mystic Merge! Build. Demonstrate. Deliver. 🚀
