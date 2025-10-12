# Personal Website

A modern, responsive personal website built with Next.js, TypeScript, and Tailwind CSS. Features smooth animations, a beautiful UI, and external links integration.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design with glass morphism effects
- **Smooth Animations**: Powered by Framer Motion for delightful interactions
- **External Links**: Integrated social media and portfolio links
- **Performance Optimized**: Built with Next.js for optimal performance
- **TypeScript**: Full type safety and better development experience
- **Responsive Design**: Works perfectly on all device sizes
- **Dark Theme**: Beautiful dark gradient theme

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Inter & JetBrains Mono

## 📦 Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd personal-website
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 Customization

### Personal Information

Update the following files with your information:

- `app/layout.tsx` - Update metadata (title, description, etc.)
- `components/Hero.tsx` - Update name, title, and social links
- `components/About.tsx` - Update about section content
- `components/Skills.tsx` - Update skills and technologies
- `components/Projects.tsx` - Update projects with your work
- `components/Contact.tsx` - Update contact information

### Styling

- Modify `tailwind.config.js` for custom colors and themes
- Update `app/globals.css` for additional custom styles
- Adjust animations in individual components

### External Links

Update the following arrays in components:

- **Hero.tsx**: Social media links
- **Contact.tsx**: Contact information and social links
- **Projects.tsx**: GitHub and live demo links

## 📁 Project Structure

```
personal-website/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── About.tsx
│   ├── Contact.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── Navigation.tsx
│   ├── Projects.tsx
│   └── Skills.tsx
├── lib/
│   └── utils.ts
├── public/
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

Build the project:

```bash
npm run build
npm start
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📧 Contact

Your Name - your.email@example.com

Project Link: [https://github.com/yourusername/personal-website](https://github.com/yourusername/personal-website)
