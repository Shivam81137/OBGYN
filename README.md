# Conceptual OBGYN — Ready to Revise 🩺

**Conceptual OBGYN** is a modern, high-yield clinical revision platform built for medical students, interns, and postgraduate aspirants (NEET UG, NEET PG, and INI-CET).

---

## ✨ Features

- **TORCH Infections 3D Clinical Masterclass**:
  - Interactive 3D Fetal Brain MRI visualizer (Periventricular vs. Diffuse Parenchymal calcifications).
  - 3D Transplacental Immunoglobulin barrier simulation (IgG vs. IgM passage kinetics).
  - Interactive Diagnostic Serology algorithm & IgG Avidity index interpreter.
  - 24 Active-Recall Q&A Flashcards extracted from faculty textbook Chapter 20.
- **NEET UG & NEET PG Exam Pathways**:
  - One-click pathway hub for pre-med and postgraduate study engines.
  - Interactive student dashboard & platform admin metric controls.
- **Executive Monochrome Theme Engine**:
  - Pro-level Black & White luxury design system (`Plus Jakarta Sans` & `Inter` typography).
  - Native Light & Dark Mode toggle support with WCAG AAA high-contrast colors.
- **Progressive Web App (PWA)**:
  - Mobile touch-optimized bottom bar and offline-ready service worker architecture.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm** or **yarn** / **pnpm**

### 2. Installation & Setup

```bash
# Clone the repository
git clone https://github.com/Shivam81137/OBGYN.git
cd OBGYN

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
├── public/                # Static assets & PDF documents
│   └── pdf/               # TORCH Infections textbook chapter PDF
├── src/
│   ├── app/
│   │   ├── (student)/     # Student Dashboard route group
│   │   ├── admin/         # NEET PG Admin Engine route
│   │   ├── torch-infections/ # TORCH 3D Masterclass module
│   │   ├── globals.css    # Executive Monochrome design tokens
│   │   └── layout.tsx     # Root layout with fonts & ThemeProvider
│   └── components/
│       ├── synapsis/      # Navbar, HeroSection, Footer, ThemeToggle
│       └── torch/         # 3D WebGL Canvas & Diagnostic Algorithm
├── prisma/                # Database schema
├── tailwind.config.ts     # Design tokens & color palette
└── next.config.ts         # Next.js configuration
```

---

## 🛠️ Built With

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescript.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **3D Visualizations**: [Three.js](https://threejs.org/) / `@react-three/fiber`
- **Animations**: [Framer Motion](https://www.framer-motion.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📄 License

Distributed under the MIT License.
