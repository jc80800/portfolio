# DevPortfolio 🍊

A modern, responsive portfolio website built with React and Vite. Features a vibrant mango-pineapple theme with smooth animations and a clean, professional design.

## ✨ Features

- **Modern Design**: Clean, responsive layout with glassmorphism effects
- **Component-Based**: Modular React components with CSS Modules
- **Performance**: Optimized with Vite for fast development and builds
- **Accessible**: Semantic HTML and keyboard navigation support
- **SEO Ready**: Meta tags, Open Graph, and structured data
- **Mobile First**: Responsive design that works on all devices

## 🚀 Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: CSS Modules, CSS Variables
- **Fonts**: Inter (Google Fonts)
- **Build Tool**: Vite
- **Linting**: ESLint

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Header/         # Navigation header
│   ├── Hero/           # Hero section
│   ├── About/          # About section
│   ├── Projects/       # Projects showcase
│   └── Footer/         # Footer section
├── styles/             # Global styles
│   └── globals.css     # CSS variables & utilities
├── App.jsx             # Main app component
└── main.jsx            # Entry point
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/devportfolio.git
   cd devportfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🎨 Customization

### Colors & Theme

The color scheme is defined in `src/styles/globals.css` using CSS variables:

```css
:root {
  --mango-orange: #ff6b35;
  --golden-yellow: #fdcb6e;
  --orange: #f7931e;
  /* ... more variables */
}
```

### Content

Update the content in each component file:
- `src/components/Hero/Hero.jsx` - Hero section content
- `src/components/About/About.jsx` - About section content
- `src/components/Projects/Projects.jsx` - Project showcase
- `src/components/Footer/Footer.jsx` - Footer links and info

### SEO

Update meta tags in `index.html`:
- Title and description
- Open Graph tags
- Twitter Card tags
- Update URLs to your domain

## 📱 Responsive Design

The portfolio is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Netlify

1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify

### GitHub Pages

1. Add to package.json:
   ```json
   "homepage": "https://yourusername.github.io/devportfolio"
   ```
2. Install gh-pages: `npm install --save-dev gh-pages`
3. Add script: `"deploy": "gh-pages -d dist"`
4. Build and deploy: `npm run build && npm run deploy`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [Inter Font](https://rsms.me/inter/) - Typography
- [CSS Modules](https://github.com/css-modules/css-modules) - Styling

---

Made with ❤️ and 🍊 by Jason C. (where C. stands for Cursor! 🖱️✨)
