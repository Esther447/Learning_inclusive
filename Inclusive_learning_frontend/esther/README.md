# Inclusive Learning & Skills Platform

An inclusive online learning platform designed to provide equal access to education for people with disabilities in Rwanda. The platform offers interactive courses, mentorship, and comprehensive accessibility features.

## Project Overview

This platform addresses the critical need for accessible education and skills development for people with disabilities in Rwanda. It integrates multiple accessibility features to support learners with visual, hearing, speech, mobility, and cognitive impairments.

## Features

### Accessibility Features
- **Visual Accessibility**: Screen reader support, text-to-speech, high contrast themes, braille display support
- **Hearing Accessibility**: Real-time captions, transcripts, sign language video integration
- **Speech Accessibility**: Voice output communication, symbol-based input
- **Mobility Accessibility**: Full keyboard navigation, voice command navigation, switch control
- **Cognitive Accessibility**: Simplified navigation, chunked content, visual cues, reminders

### Core Functionality
- User registration and authentication (Learner, Mentor, Administrator roles)
- Course enrollment and management
- Interactive learning modules
- Progress tracking and certifications
- Mentorship and peer support groups
- Accessible content creation tools

## Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI)
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Accessibility**: React Aria Components
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd esther
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── accessibility/      # Accessibility services (TTS, captions, keyboard nav)
├── components/         # Reusable UI components
├── context/           # React context providers
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── services/          # API services
├── store/             # Zustand state management
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Accessibility Standards

This project adheres to **WCAG 2.1 AA** standards to ensure maximum accessibility for all users.

## Project Information

- **Project Title**: Inclusive Learning & Skills Platform
- **Prepared by**: Esther Mushimiyimana
- **Organization**: ALU Student Project
- **Date Created**: 22 September 2025
- **Development Model**: Agile

## License

This project is part of an ALU Student Project.

## References

- [UNESCO Guidelines for Inclusion of Learners with Disabilities](https://www.unesco.org/en/articles/revised-guidelines-inclusion-learners-disabilities-open-and-distance-learning-odl)
- [National Union of Disability Organisations of Rwanda (NUDOR)](https://www.nudor.org/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
