# 💖 Interactive 3D Marriage Proposal Web App 💍

A stunning, cinematic, and interactive multi-sensory web experience built to make a marriage proposal unforgettable. Using **React**, **Three.js (React Three Fiber)**, and **GSAP**, this application guides your partner through a beautiful journey of love, leading to a magical, romantic 3D interactive proposal scene.

---

## 🌟 Key Features

### 🎬 1. Cinematic Hero Section (`Hero.tsx`)
- An emotional, animated welcome page with parallax scroll animations.
- Dynamic typography styled and timed perfectly with GSAP triggers.

### 📜 2. Interactive "Reasons I Love You" Timeline (`Reasons.tsx`)
- A visually engaging storytelling section detailing the moments and reasons that define your relationship.
- Smooth transitions and elegant fade-ins triggered as you scroll.

### 💫 3. The Grand Proposal Finale (`Proposal.tsx`)
- An interactive proposal section featuring two playfulness-oriented buttons ("Yes! 💕" and "No 😢").
- **Smart Escape Behavior**: The "No" button dynamically moves away from the cursor on hover, playfully guiding the user toward clicking "Yes!".
- Upon clicking **"Yes!"**, a gorgeous celebration triggers with colorful **confetti showers** (`canvas-confetti`) and transitions into the custom 3D romantic proposal stage.

---

## 🎭 3D Proposal Scene Details (`ProposeScene.tsx`)

At the heart of the celebration is an immersive 3D canvas rendering a highly detailed romantic environment:
- **Stylized Custom Characters**:
  - **Boy (Kneeling)**: Features customized short styled hair, responsive nodding animation, and extends his arm forward holding a beautiful, high-fidelity red rose.
  - **Girl (Ecstatic)**: Features long flowing hair with a detailed ponytail, heart-shaped eyes representing absolute joy, and pumps her hand high in a waving animation.
- **Cinematic Environment**:
  - **Flickering Candles**: 6 detailed candles surrounding the couple with realistic light flickering patterns created using double sine-wave frequencies.
  - **Ethereal Ground Mist**: A soft purple ground fog creating a dreamlike, floating-stage atmosphere.
  - **Glowing Moon**: A large glowing ivory moon with three nested semi-transparent halo spheres, casting soft backlighting onto the couple.
  - **Falling Rose Petals**: A customized particle system featuring 20 falling rose petals that drift left/right and tumble dynamically on their way down, looping seamlessly.
  - **Floating Hearts**: Sparkling, three-dimensional floating hearts that rise continuously from the couple.

---

## 🛠️ Technology Stack

- **Core**: React 19, TypeScript
- **3D Graphics**: Three.js, `@react-three/fiber` (R3F), `@react-three/drei`
- **Animation**: GSAP (GreenSock Animation Platform) + Custom `useFrame` physics loops
- **Styling**: Tailwind CSS v4, Vanilla CSS
- **Effects**: `canvas-confetti` for celebratory effects

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (version 18+ recommended).

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the local development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view and test the application!

### Building for Production

To create a highly optimized production build:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## 📂 Project Structure

```text
Proposal/
├── Frontend/
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # 3D Elements & Scenes (ProposeScene, DiamondRing, Heart)
│   │   ├── pages/          # Layout sections (Hero, Reasons, Proposal)
│   │   ├── styles/         # Custom CSS & Tailwind configs
│   │   ├── App.tsx         # Main layout coordinator
│   │   └── main.tsx        # Application entry point
│   ├── package.json        # Dependencies & scripts
│   └── vite.config.ts      # Vite bundler configuration
└── Readme.md               # Main documentation
```

---

## ❤️ Made with Love

*Designed to capture hearts and create a memory that lasts forever.*
