# BeefUp - Dynamic Calorie Tracker 🥩💪

A calorie tracker that doesn't just count numbers—it visualizes your progress.

## 💡 The Spark: How This Idea Came Up

Let's face it: most calorie trackers are glorified spreadsheets. They are boring, static, and feel like a chore. You log your food, see a number go up, and that's it. There's no emotional connection, no visual reward.

**BeefUp was born from a simple question:** *What if your calorie tracker felt like a video game character leveling up?*

We wanted to create an app where you don't just "hit a macro target"—you actually *see* the result. We wanted to gamify the process of getting healthy, making it engaging, dynamic, and specifically tailored to users who often feel left out by Western-centric apps.

## 🚀 What Makes It Dynamic?

Unlike traditional trackers that just show progress bars, BeefUp is **alive**:

*   **Visual Feedback Loop**: The core of the app is a dynamic stick figure that changes based on your input. As you hit your protein goals, your character visibly "beefs up," gaining muscle mass. If you're in a surplus, it reflects that. It's instant, visual gratification for your hard work.
*   **Real-Time Adaptation**: The interface reacts to your data. The aesthetics aren't static; they shift to match the "premium" feel of a high-end fitness tool, keeping you engaged.

## ✨ Unique Aspects

### 1. 🧠 AI-Powered Food Estimation (Gemini API)
Stop searching for "Mom's homemade paneer butter masala" and getting 50 different results with wild variations.
*   **Smart Estimation**: We use Google's Gemini AI to estimate calories and protein for *any* description.
*   **Natural Language**: Just type "2 homemade rotis and a bowl of dal" and let the AI do the math. No more weighing every gram if you don't want to.

### 2. 🇮🇳 Built for Indian Context
Most global apps fail when it comes to Indian food.
*   **Curated Database**: We have a built-in, verified database of common Indian meals (Roti, Dal, Paneer, Rice, etc.).
*   **Hybrid Search**: The app intelligently switches between our local Indian database for speed and accuracy, and Gemini AI for everything else.

### 3. 🎨 Premium Aesthetic
*   **Dark Mode First**: Designed with a sleek, modern dark theme that looks great on all devices.
*   **Glassmorphism & Micro-interactions**: Smooth animations and a polished UI make the act of logging food feel satisfying, not tedious.

## 🛠️ Tech Stack

*   **Frontend**: React (Vite) + TypeScript
*   **AI**: Google Gemini API
*   **Styling**: Vanilla CSS (Custom Design System)
*   **Icons**: Lucide React

## 🏃‍♂️ Run Locally

1.  **Clone the repo**
    ```bash
    git clone https://github.com/Abhaygithub7/Dynamic-Calorie-Tracker.git
    cd Dynamic-Calorie-Tracker
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**
    Create a `.env.local` file in the root directory and add your Gemini API key:
    ```env
    VITE_API_KEY=your_gemini_api_key_here
    ```

4.  **Run the app**
    ```bash
    npm run dev
    ```
