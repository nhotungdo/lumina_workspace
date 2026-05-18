# 📝 Lumina Notes App

![Flutter](https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white)
![Dart](https://img.shields.io/badge/Dart-0175C2?style=for-the-badge&logo=dart&logoColor=white)
![Bloc](https://img.shields.io/badge/Bloc-000000?style=for-the-badge&logo=bloc&logoColor=white)

A modern, production-ready Notes Application built with **Flutter** following **Clean Architecture** principles. It features a premium UI/UX design inspired by Google Keep, Notion, and Evernote, conforming to Material Design 3 guidelines.

---

## 🌟 Key Features

- **Modern & Responsive UI**: Beautiful interfaces supporting Mobile, Tablet, and Desktop (Windows/macOS/Web) with adaptive layouts.
- **Dynamic Theming**: Full support for System, Light, and Dark modes with smooth transitions.
- **State Management**: Robust architecture powered by `flutter_bloc`.
- **Advanced Navigation**: Type-safe and declarative routing using `go_router`.
- **Note Management**: Create, edit, pin, favorite, and delete notes. Notes in trash can be restored.
- **Masonry Layout**: Staggered grid view for notes presentation.
- **Rich Searching**: Real-time search by title and content.
- **Interactive Animations**: Premium micro-interactions using `flutter_animate`.
- **Productivity Statistics**: Data visualization using `fl_chart`.
- **Categories & Tags**: Organize notes effectively.
- **Mock Data Engine**: Pre-configured mock state to run and test out of the box without backend dependencies.

## 🛠️ Tech Stack & Packages

- **Framework**: [Flutter](https://flutter.dev/) (SDK ^3.11.0)
- **State Management**: `flutter_bloc`, `equatable`
- **Routing**: `go_router`
- **Typography**: `google_fonts` (Inter & Poppins)
- **UI Components**: `flutter_staggered_grid_view`
- **Animations**: `flutter_animate`
- **Charts**: `fl_chart`
- **Formatting**: `intl`
- **Local Storage**: `shared_preferences`

## 📂 Project Architecture

This project is organized using a feature-driven, clean architecture approach:

```text
lib/
├── blocs/          # BLoC state management (auth, notes, theme)
├── core/           # Core configurations (theme, colors)
├── mock/           # Mock data for quick testing
├── models/         # Domain entities (User, Note, Category, Reminder)
├── routes/         # go_router configurations
├── screens/        # UI Screens divided by feature
│   ├── auth/       # Login, Register
│   ├── category/   # Category management
│   ├── favorite/   # Favorite notes
│   ├── home/       # Main dashboard
│   ├── note/       # Create & View details
│   ├── onboarding/ # Welcome slider
│   ├── profile/    # User profile
│   ├── reminder/   # Notifications
│   ├── search/     # Search interface
│   ├── settings/   # App configuration
│   ├── splash/     # Splash screen
│   ├── statistics/ # Productivity charts
│   └── trash/      # Deleted notes
├── widgets/        # Reusable UI components
└── main.dart       # App entry point
```

## 🚀 Getting Started

### Prerequisites
- Flutter SDK `^3.11.0` or higher
- Dart SDK installed
- An IDE (VS Code, Android Studio, etc.)

### Installation

1. Clone this repository (or navigate to the workspace).
2. Install dependencies:
   ```bash
   cd notes_app
   flutter pub get
   ```
3. Run the application (choose your target device):
   ```bash
   flutter run
   # Or for desktop explicitly:
   flutter run -d windows
   ```

## 🎨 UI Showcase

*   **Splash & Onboarding**: Smooth hero animations and fade transitions to welcome the user.
*   **Authentication**: Glassmorphism cards with smooth gradients for login and registration.
*   **Dashboard (Home)**: Categorized and pinned notes in a beautiful masonry grid.
*   **Editor**: Clean, distraction-free environment for capturing ideas.
*   **Statistics**: Visual representation of productivity.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
