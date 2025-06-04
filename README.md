# Hypertrophy Hub

A sleek and modern workout tracking application designed for strength training and muscle building. Built with React, TypeScript, and Tailwind CSS.

![Hypertrophy Hub](https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)

## Features

- 🏋️‍♂️ Three-day split workout program focusing on:
  - Monday: Chest & Triceps
  - Wednesday: Shoulders & Abs
  - Friday: Arms & Secondary Chest
- ⏱️ Built-in rest timer with customizable durations
- 📊 Workout history tracking
- 💪 Support for various exercise types:
  - Weight and reps
  - Bodyweight exercises
  - Timed exercises
  - AMRAP (As Many Reps As Possible)
- 📱 Responsive design for all devices
- 🎯 Progress tracking for each workout session

## Sitemap

```
Home Screen
├── Workout Selection
│   ├── Monday - Chest & Triceps
│   │   └── Exercise Session
│   │       ├── Exercise Details
│   │       ├── Set Logging
│   │       ├── Rest Timer
│   │       └── Completion Modal
│   ├── Wednesday - Shoulders & Abs
│   │   └── Exercise Session
│   │       ├── Exercise Details
│   │       ├── Set Logging
│   │       ├── Rest Timer
│   │       └── Completion Modal
│   └── Friday - Arms & Secondary Chest
│       └── Exercise Session
│           ├── Exercise Details
│           ├── Set Logging
│           ├── Rest Timer
│           └── Completion Modal
└── Workout History
    └── Daily Logs
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Lucide Icons

## Project Structure

```
src/
├── components/         # React components
├── data/              # Workout plans and configuration
├── App.tsx            # Main application component
└── index.css          # Global styles and Tailwind imports
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.