<div align="center">
<img width="1200" height="475" alt="EDU SPARK" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# EDU SPARK - AI-Powered Learning Platform

An intelligent educational platform providing personalized learning experiences with AI-generated lessons, practice questions, exam preparation, and gamified learning modules.

## Features

✨ **Smart Learning**
- AI-powered lesson generation for topics
- Adaptive difficulty levels
- Study plans with structured learning paths
- Quick revision summaries

📊 **Performance Tracking**
- Real-time progress analytics
- Performance metrics and trends
- Streak tracking and motivation
- Achievement badges and rewards

📝 **Practice & Assessment**
- AI-generated MCQ questions
- Customized question paper generation
- Difficulty-based practice modes
- Instant feedback on answers

🎮 **Gamification**
- Achievement system with badges
- Streak tracking
- Leaderboards
- Progress visualization

📱 **User Experience**
- Modern dark-themed UI with glassmorphism
- Smooth animations and transitions
- Real-time notifications
- Responsive mobile design

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Motion/Framer Motion
- **Routing**: React Router v7
- **Build**: Vite
- **AI**: NVIDIA API / Mistral AI
- **State Management**: React Context API

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── PerformanceStats.tsx
│   ├── StudyPlan.tsx
│   ├── AchievementBadge.tsx
│   ├── NotificationCenter.tsx
│   ├── ErrorBoundary.tsx
│   └── Skeleton.tsx
├── contexts/            # React Context providers
│   ├── StudentContext.tsx
│   └── NotificationContext.tsx
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── Practice.tsx
│   ├── Analytics.tsx
│   ├── PaperGen.tsx
│   └── GamifiedLearning.tsx
├── services/           # API and service layers
│   └── ai.ts
├── data/              # Static data
│   └── syllabus.ts
├── utils/             # Utility functions
│   └── helpers.ts
└── config/            # Configuration
    └── constants.ts
```

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd EDU\ SPARK
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env.local`:
```env
VITE_AI_API_KEY=your_api_key_here
VITE_AI_MODEL=qwen/qwen-2.5-coder-32b
VITE_AI_BASE_URL=https://integrate.api.nvidia.com/v1
```

4. Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Clean build artifacts
npm run clean
```

## Key Components

### PerformanceStats
Displays user performance metrics including topics completed, tests attempted, learning time, and current streak.

```tsx
<PerformanceStats />
```

### StudyPlan
Generates and displays a structured learning plan for a topic.

```tsx
<StudyPlan topic="Polynomials" daysAvailable={7} />
```

### NotificationCenter
Global notification system for user feedback.

```tsx
const { addNotification } = useNotification();
addNotification("Content loaded!", "success");
```

### AchievementBadge
Displays achievement badges for gamification.

```tsx
<AchievementBadge achievement={achievement} size="md" />
```

## Context API

### StudentContext
Manages student profile, performance metrics, and learning progress.

```tsx
const { studentInfo, performance, recordTopicCompletion } = useStudent();
```

### NotificationContext
Global notification management.

```tsx
const { addNotification } = useNotification();
```

## Utility Functions

### helpers.ts
- `formatTime()` - Format milliseconds to readable time
- `calculateProgress()` - Calculate percentage progress
- `getMotivationalQuote()` - Get random motivation quote
- `debounce()` - Debounce function calls
- `groupBy()` - Group array by key

## AI Services

### generateLessonContent()
Generate AI-powered lesson explanations.

```tsx
const lesson = await generateLessonContent("Polynomials", "Mathematics");
```

### generatePracticeQuestions()
Create customized practice MCQs.

```tsx
const questions = await generatePracticeQuestions("Algebra", "Mathematics", "medium", 5);
```

### generateQuestionPaper()
Generate complete question papers.

```tsx
const paper = await generateQuestionPaper({
  board: "CBSE",
  subject: "Mathematics",
  chapters: ["Algebra", "Geometry"],
  totalMarks: 100
});
```

## Curriculum Data

The platform includes comprehensive CBSE curriculum for:
- **Class 10**: Mathematics, Science, English, Social Science
- **Class 12**: Mathematics, Physics, Chemistry, Biology

Each subject contains detailed units, topics, and subtopics with video counts and question counts.

## Performance Tracking

The app tracks:
- Topics completed
- Tests attempted
- Average score
- Total learning minutes
- Current streak
- Last active date

All data is persisted to localStorage.

## Configuration

Configure app settings in `src/config/constants.ts`:

```tsx
export const CONFIG = {
  APP_NAME: 'EDU SPARK',
  FEATURES: {
    AI_LESSONS: true,
    GAMIFICATION: true,
    // ... more flags
  },
  LIMITS: {
    SESSION_TIMEOUT: 30 * 60 * 1000,
    // ... more limits
  }
};
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

Apache 2.0

## Support

For issues and feature requests, please open an issue in the repository.

---

**EDU SPARK** - Empowering Education with AI 🚀

