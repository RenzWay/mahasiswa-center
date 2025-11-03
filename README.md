# 🎓 Mahasiswa Center

> A modern web app designed to help university students manage their academic life more efficiently.

![Status](https://img.shields.io/badge/status-beta-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)

## 📖 Overview

**Mahasiswa Center** is an all-in-one productivity platform built specifically for university students. Manage your
tasks, schedules, notes, and get personalized insights — all from a single, beautifully designed dashboard.

Whether you're juggling multiple courses, group projects, or exam preparations, Mahasiswa Center helps you stay
organized and focused on what matters most: your academic success.

## ✨ Features

### 🏠 Dashboard

- Personalized overview of your academic activities
- Quick access to recent notes and upcoming tasks
- Statistics and insights about your productivity

### ✅ Task Management

- Create, organize, and track your academic tasks
- Set priorities and deadlines
- Mark tasks as complete and monitor progress

### 📅 Schedule

- Manage your class schedules and academic calendar
- Set reminders for important events
- Visualize your weekly/monthly commitments

### 📝 Notes

- Create and organize course notes
- Rich text editor for better formatting
- Quick search and categorization

### 🔐 Authentication

- Secure login with Google OAuth
- Fast and seamless authentication experience

### 🎨 Modern UI/UX

- Smooth animations and transitions
- Responsive design for all devices
- Intuitive navigation and user experience

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google OAuth credentials (for authentication)

### Installation

1. Clone the repository

```bash
git clone https://github.com/RenzWay/mahasiswa-center.git
cd mahasiswa-center
```

2. Install dependencies

```bash
npm install
# or
bun add
```

3. Set up environment variables

```bash
cp .env.local
```

Add your Google OAuth credentials to `.env`:

```
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
```

4. Run the development server

```bash
npm run dev
# or
bun run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Tech Stack

- **Frontend**: React/Next.js
- **Authentication**: Google OAuth 2.0
- **Styling**: Tailwind CSS / CSS Modules
- **State Management**: React Context / Redux
- **Database**: [Your database choice]

## 🔄 Development Status

This project is currently in **beta** stage. We're actively working on:

- Improving UI/UX design
- Adding new features
- Fixing bugs and optimizing performance
- Gathering user feedback

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Roadmap

- [ ] Enhanced UI/UX improvements
- [ ] Collaborative notes feature
- [ ] Mobile app development
- [ ] Integration with university systems
- [ ] Pomodoro timer for study sessions
- [ ] Grade calculator and GPA tracker

## 🐛 Known Issues

As this is a beta version, you might encounter some UI/UX inconsistencies. We're working hard to improve the overall
experience. Please report any issues you find!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

For questions, suggestions, or feedback:

[//]: # (- Email: your.email@example.com)

- GitHub Issues: [Create an issue](https://github.com/yourusername/mahasiswa-center/issues)

## 🙏 Acknowledgments

- Thanks to all contributors who help improve this project
- Inspired by the needs of university students everywhere
- Built with love for the academic community

---

Made with ❤️ for students, by students