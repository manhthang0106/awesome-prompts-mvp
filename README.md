# Awesome ChatGPT Prompts MVP

A curated collection of ChatGPT prompts with advanced search, filtering, and multi-platform AI integration. This is a simplified MVP version inspired by [f/awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts).

## ✨ Features

- 🔍 **Prompt Browser & Search** - Browse and search through curated ChatGPT prompts
- 🎴 **Interactive Prompt Cards** - Beautiful grid-based card layout with previews
- 🤖 **Multi-Platform AI Integration** - Direct integration with ChatGPT, Claude, GitHub Copilot, Grok, Perplexity, and Mistral
- 📋 **Copy & Share** - One-click copy prompts to clipboard
- 🌓 **Dark Mode** - Light/dark theme support with localStorage persistence
- 👨‍💻 **Developer Mode** - Toggle between general and developer-specific prompts
- 🌐 **Language & Tone Customization** - Customize response language and tone
- 🔧 **Dynamic Variable Inputs** - Support for prompts with customizable variables (e.g., `${Position:Software Engineer}`)
- 🔍 **Modal Preview** - Full-screen modal view for reading and customizing prompts
- 📊 **CSV Data Source** - Prompts stored in CSV for easy management

## 🚀 Getting Started

### Prerequisites

- Ruby 2.7+
- Bundler
- Jekyll 3.10+

### Installation

1. Clone the repository:
```bash
git clone https://github.com/manhthang0106/awesome-prompts-mvp.git
cd awesome-prompts-mvp
```

2. Install dependencies:
```bash
bundle install
```

3. Run the development server:
```bash
bundle exec jekyll serve
```

4. Open your browser and navigate to:
```
http://localhost:4000/awesome-prompts-mvp/
```

## 📁 Project Structure

```
.
├── _config.yml          # Jekyll configuration
├── Gemfile              # Ruby dependencies
├── index.html           # Main HTML structure
├── style.css            # Complete CSS styling
├── script.js            # JavaScript functionality
├── prompts.csv          # Prompts data (CSV format)
└── README.md            # Project documentation
```

## 💾 Data Format

Prompts are stored in `prompts.csv` with the following structure:

```csv
act,prompt,for_devs
"Linux Terminal","I want you to act as a linux terminal...",TRUE
"Travel Guide","I want you to act as a travel guide...",FALSE
```

**Columns:**
- `act` - The prompt title/role
- `prompt` - The full prompt text (supports variables like `${Position:Software Engineer}`)
- `for_devs` - Boolean (TRUE/FALSE) indicating if it's developer-specific

## 🎯 Usage

### Adding New Prompts

1. Open `prompts.csv`
2. Add a new line with the format: `"Title","Prompt text",TRUE/FALSE`
3. Use `${Variable:Default}` syntax for dynamic variables
4. Save and refresh the page

### Customizing Themes

Edit CSS variables in `style.css`:

```css
:root {
    --bg-color-light: #ffffff;
    --bg-color-dark: #1a1a1a;
    --accent-color: #10b981;
    --accent-color-hover: #059669;
}
```

### Using Variables in Prompts

Prompts can include dynamic variables:

```
"I want you to act as an interviewer for the ${Position:Software Engineer} position..."
```

Users can customize these values in the modal before copying or using the prompt.

## 🌐 GitHub Pages Deployment

1. Push your changes to GitHub
2. Go to repository Settings → Pages
3. Select source: `main` branch, `/ (root)` folder
4. Save and wait for deployment
5. Your site will be available at: `https://manhthang0106.github.io/awesome-prompts-mvp/`

## 🛠️ Technologies Used

- **Jekyll 3.10.0** - Static site generator
- **GitHub Pages** - Free hosting
- **Vanilla JavaScript** - No frameworks, pure JS
- **CSS Custom Properties** - For theming
- **LocalStorage** - For preferences persistence

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Credits

Inspired by [f/awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts)

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch
3. Add your prompts to `prompts.csv`
4. Submit a pull request

## 📧 Support

If you have any questions or issues, please open an issue on GitHub.

---

**Built with ❤️ using Jekyll and GitHub Pages**
