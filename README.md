<!-- <div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/4cb31533-b3a1-49de-b8dc-46a8a147ee0f

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev` -->

# 🚀 HR AI Screening System

> **Smart CV Evaluation Powered by Google Gemini AI**

<div align="center">

![React](https://img.shields.io/badge/React-19.0-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.2-646cff?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-06b6d4?logo=tailwindcss&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-AI%20Powered-4285f4?logo=google&logoColor=white)

**⚡ Lightning-fast CV screening with intelligent AI analysis**

</div>

---

## ✨ Key Features

### 📋 **Smart Job Profile Creation**
- Create and save multiple job profiles
- Define job titles, required skills, and experience levels
- Store profiles for reuse across multiple recruitment cycles
- Support for custom requirements

### 🤖 **AI-Powered CV Analysis**
- Powered by **Google Gemini AI** for intelligent evaluation
- Automatic CV parsing and analysis
- Smart skill matching algorithm
- Real-time evaluation feedback

### 📊 **Comprehensive Evaluation Results**
- **Match Score**: Percentage match with job requirements
- **Key Strengths**: Highlighted candidate strengths
- **Areas for Improvement**: Identified skill gaps
- **Summary**: Quick overview of candidate fit

### 🎯 **Advanced Filtering**
- Filter results by:
  - ✅ Accepted candidates
  - ❌ Rejected candidates
  - 📋 All candidates
- Quick status overview with visual indicators

### 💬 **Direct Communication**
- One-click WhatsApp integration
- Pre-formatted acceptance/rejection messages
- Personalized candidate communication
- Professional message templates

### 🌍 **Bilingual Support**
- 🇸🇦 **Arabic** - Full RTL support
- 🇬🇧 **English** - Complete English interface
- Seamless language switching

### 🎨 **Modern UI/UX**
- Clean, intuitive interface
- Smooth animations with Motion library
- Dark/Light mode toggle (coming soon)
- Responsive design for all devices
- Beautiful icon system with Lucide React

### 📁 **Batch Processing**
- Upload multiple CVs at once
- Simultaneous evaluation of all files
- Progress tracking
- Clear results organization

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19 + TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS 4.1 |
| **Animations** | Motion |
| **Icons** | Lucide React |
| **AI Engine** | Google Gemini API |
| **Backend** | Express.js |
| **Environment** | Node.js |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- Gemini API Key (get it from [Google AI Studio](https://aistudio.google.com))

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd HR

# 2. Install dependencies
npm install

# 3. Set up environment variables
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# 4. Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 📦 Available Scripts

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run TypeScript type checking
npm run clean    # Clean build artifacts
```

---

## 🎯 Workflow

```
1. CREATE JOB PROFILE
   ↓
2. UPLOAD CVs
   ↓
3. START EVALUATION
   ↓
4. REVIEW RESULTS
   ↓
5. ACCEPT/REJECT/CONTACT
```

---

## 📊 Evaluation Criteria

The AI analyzes CVs based on:

- ✓ **Skills Match** - Presence of required skills
- ✓ **Experience** - Years of relevant experience
- ✓ **Education** - Relevant qualifications
- ✓ **Work History** - Career progression
- ✓ **Language Proficiency** - Required language skills
- ✓ **Additional Requirements** - Custom criteria

---

## 🔐 Security & Privacy

- ✅ API keys stored locally in `.env.local`
- ✅ CVs processed securely via Gemini API
- ✅ Never stores personal CV data
- ✅ HTTPS ready for production
- ✅ No data logging or retention

---

## 🌐 Deployment

### Deploy on Vercel (Recommended)

```bash
# 1. Push to GitHub
git push origin main

# 2. Import on Vercel
# Visit vercel.com > Import Project

# 3. Add environment variables
# GEMINI_API_KEY = your_api_key

# 4. Deploy!
```

[Deploy to Vercel](https://vercel.com/new)

---

## 📝 File Structure

```
src/
├── App.tsx                 # Main application component
├── main.tsx               # Entry point
├── index.css              # Global styles
├── types.ts               # TypeScript definitions
└── services/
    └── geminiService.ts   # AI evaluation logic
```

---

## 🎨 UI Components Included

- Job Profile Manager
- CV Upload Zone
- Evaluation Results Display
- Filter Controls
- Status Indicators
- Loading States
- Error Handling
- Empty States

---

## 🚀 Performance

- ⚡ **Fast Loading**: < 1s initial load
- ⚡ **Optimized Build**: < 300KB gzipped
- ⚡ **Smooth Animations**: 60 FPS
- ⚡ **Mobile Ready**: Fully responsive

---

## 🤝 Integration Support

- ✅ **Google Gemini API**
- ✅ **WhatsApp Business API** (ready to integrate)
- ✅ **Email Service** (extensible)
- ✅ **PDF Processing**

---

## 🐛 Troubleshooting

### "GEMINI_API_KEY is not defined"
- Ensure `.env.local` file exists
- Verify key is set correctly
- Restart development server

### CVs not uploading
- Check file format (PDF support)
- Verify file size
- Check API quota

### Poor match scores
- Review job requirements
- Verify CV quality
- Check API response

---

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Google Gemini API](https://ai.google.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💼 Author

**Made by Mohammed Mahmoud Mahdi**

---

<div align="center">

### ⭐ If you find this helpful, please consider giving it a star!

[GitHub](javascript:void(0)) • [Live Demo](javascript:void(0)) • [Report Issues](javascript:void(0))

**Happy Recruiting! 🎉**

</div>
