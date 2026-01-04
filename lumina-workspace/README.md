# ⚡ Lumina Workspace (Client)

<div align="center">

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-6.0-purple?logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Google GenAI](https://img.shields.io/badge/AI-Google_GenAI-orange?logo=google)

**Your robust, AI-powered knowledge management interface.**

[View in AI Studio](https://ai.studio/apps/drive/1rHhTKvwqHJncGIUHxx1q1yN3Td4Lafws)

</div>

---

## 📋 Table of Contents

- [Introduction](#-introduction)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running Locally](#-running-locally)
- [Building for Production](#-building-for-production)

## 📖 Introduction

This is the client-side application for **Lumina Workspace**, built with React 19 and Vite. It integrates Google's GenAI to provide intelligent features within a Notion-style interface.

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (Latest LTS version recommended)
- **npm** or **yarn**

## 💻 Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd lumina-workspace
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## ⚙️ Configuration

This project uses Google's Generative AI. You need to configure your API key.

1. Create a `.env.local` file in the root of the project (if it doesn't exist).
2. Add your Gemini API key:

   ```env
   # .env.local
   GEMINI_API_KEY=your_actual_api_key_here
   ```
   *(Note: The project is configured to read `GEMINI_API_KEY` directly).*

## 🚀 Running Locally

Start the development server:

```bash
npm run dev
```

The application will typically be available at `http://localhost:5173`.

## 🏗️ Building for Production

To create a production-ready build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```
