# Rustamadji Gallery

**A family archive of Indonesian realism**

Online gallery and archive for painter Rustamadji of Klaten (b. 1921) and his sons, Bodas Erlangga and Karang Sasongko — three generations of realist painting from Central Java.

![Rustamadji Gallery Preview](https://via.placeholder.com/1200x630/f5efe4/1a1410?text=Rustamadji+Gallery)

---

## 🎨 Features

- **Zero-build static site** — pure HTML/CSS/JS, no Node.js or npm required
- **Single-page application** with smooth client-side routing between 6 pages
- **Museum-editorial aesthetic** — parchment background, serif typography, paper grain texture
- **Fully responsive** — mobile-first design with Tailwind CSS
- **6 complete pages**:
  - Home (hero + featured works + family teaser)
  - Biography (Rustamadji's life story)
  - Gallery (filterable catalogue of all artworks)
  - Family (profiles of Bodas Erlangga & Karang Sasongko)
  - Individual artist pages with their works
  - Contact (direct channels + email form)
- **Floating chat widget** with WhatsApp / Phone / Email quick links
- **Easy to scale** — add artworks by editing a single JavaScript array

---

## 📂 File Structure

```
rustamadji-gallery/
├── index.html          # Main HTML (151 KB, self-contained with embedded portrait)
├── style.css           # Global styles (4 KB)
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

**That's it.** No build tools, no dependencies, no package.json. Just open `index.html` in a browser.

---

## 🚀 Quick Start

### Local Development

1. **Clone or download** this repository
2. **Open `index.html`** in any modern browser (Chrome, Firefox, Safari, Edge)
3. **Done.** The site is fully functional locally.

> **Note:** `style.css` must be in the same folder as `index.html`.

### Live Preview

Double-click `index.html`, or:
```bash
# macOS
open index.html

# Linux
xdg-open index.html

# Windows
start index.html
```

---

## 🎨 Customization

### 1. Edit Contact Information

Open `index.html`, find the `CONFIG` object near line 400:

```javascript
const CONFIG = {
  phone:    '+62-812-3456-7890',      // ← Change this
  email:    'archive@rustamadji.id',  // ← Change this
  whatsapp: '6281234567890',          // ← Change this (format: country code + number, no +)
};
```

Save. Contact info auto-updates across the entire site (nav, footer, chat widget, contact page).

---

### 2. Change Colors & Fonts

Open `style.css`, edit the `:root` variables:

```css
:root {
  /* Colors */
  --color-parchment-100: #f5efe4;  /* Background */
  --color-umber-800: #1a1410;      /* Text */
  --color-ochre-500: #b8924a;      /* Accent (buttons, links) */
  
  /* Fonts */
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body:    'Inter', system-ui, sans-serif;
  --font-mono:    'JetBrains Mono', monospace;
}
```

**Example: Dark mode** — change background to dark:
```css
--color-parchment-100: #1a1410;  /* Dark background */
--color-umber-800: #f5efe4;      /* Light text */
```

**Example: System fonts** — remove Google Fonts dependency:
```css
--font-display: Georgia, serif;
--font-body:    system-ui, sans-serif;
--font-mono:    'Courier New', monospace;
```

---

### 3. Add New Artworks

Open `index.html`, find the `ARTWORKS` array (around line 450):

```javascript
ARTWORKS.push({
  slug: 'new-painting',              // Unique ID (lowercase, hyphens)
  title: 'New Painting Title',       // Display name
  artist: 'rustamadji',              // Artist slug: rustamadji | bodas-erlangga | karang-sasongko
  year: 1980,                        // Year painted
  medium: 'Oil on canvas',           // Medium
  dimensions: '100 cm x 140 cm',     // Size
  featured: true,                    // Show on homepage? (optional)
  color: '#5a4231',                  // SVG placeholder tint color (optional)
  img: '/path/to/image.jpg',         // Image path (optional — uses SVG plaque if missing)
  description: 'Description of the painting goes here.'
});
```

**Image options:**
- **Real scan**: `img: '/images/new-painting.jpg'` (put image file in same folder)
- **No image yet**: omit `img` — auto-generates a parchment-style SVG plaque with title/year
- **Embedded base64**: `img: 'data:image/jpeg;base64,...'` (self-contained, no external file)

Save and refresh. The new artwork appears in:
- Gallery page (with correct filter)
- Artist's individual page
- "Also by [artist]" sections

---

### 4. Edit Artist Biographies

In `index.html`, find the `ARTISTS` array (~line 380):

```javascript
{
  slug: 'rustamadji',
  name: 'Rustamadji',
  role: 'Realist Painter',
  movement: 'Realism',
  bornPlace: 'Klaten, Central Java',
  bornDate: '19 January 1921',
  portrait: null,  // or '/images/portrait.jpg'
  shortBio: 'One-sentence bio for cards.',
  bio: [
    'First paragraph of biography...',
    'Second paragraph...',
    'Third paragraph...'
  ]
}
```

Edit the `bio` array. Each string is a paragraph.

---

## 🌐 Deployment

### Option 1: GitHub Pages (Recommended)

1. **Create a new GitHub repository** (public or private)
2. **Upload files**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/rustamadji-gallery.git
   git push -u origin main
   ```
3. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Deploy from `main` branch, root folder
   - Save
4. **Done.** Site is live at `https://YOUR_USERNAME.github.io/rustamadji-gallery/`

### Option 2: Netlify

1. **Drag & drop** the entire folder to [Netlify Drop](https://app.netlify.com/drop)
2. **Done.** Instant deployment with a random URL (e.g. `https://random-name-123.netlify.app`)
3. **Optional**: Configure custom domain in Netlify dashboard

### Option 3: Vercel

1. Install [Vercel CLI](https://vercel.com/download): `npm i -g vercel`
2. In project folder: `vercel`
3. Follow prompts. Deploy completes in ~10 seconds.
4. **Done.** Live at `https://project-name.vercel.app`

### Option 4: Any Web Host

Upload via FTP/SFTP to any hosting provider (shared hosting, VPS, etc.). Just upload both files to the public folder (e.g. `public_html/`).

---

## 🎯 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**Progressive enhancement**: Works on older browsers but with reduced animations/effects.

---

## 🛠 Tech Stack

- **HTML5** — semantic markup
- **CSS3** — custom properties (CSS variables), Flexbox, Grid
- **Tailwind CSS** (CDN) — utility classes
- **Vanilla JavaScript** — no frameworks, no build step
- **Google Fonts** — Cormorant Garamond (display), Inter (body), JetBrains Mono (labels)
- **Lucide Icons** (CDN) — UI icons

**Total dependencies**: 3 CDN links. Zero npm packages. Zero build process.

---

## 📸 Screenshots

> **TODO**: Add actual screenshots after first deploy.
>
> Suggested structure:
> - `screenshots/home.png` — Hero section
> - `screenshots/gallery.png` — Gallery grid
> - `screenshots/biography.png` — Biography page
> - `screenshots/mobile.png` — Mobile view

---

## 🔄 Future Enhancements

Ideas for v2 (requires backend or static site generator):

- [ ] **CMS integration** (Sanity, Strapi, or Contentful) for non-technical content updates
- [ ] **Search functionality** across artworks and biographies
- [ ] **Multi-language support** (English / Bahasa Indonesia toggle)
- [ ] **Image optimization** with next-gen formats (WebP, AVIF)
- [ ] **Analytics** (Google Analytics or Plausible)
- [ ] **SEO metadata** per page (Open Graph, Twitter Cards)
- [ ] **Newsletter signup** with email service integration
- [ ] **Print shop integration** (sell reproductions)

---

## 📝 License

**Code**: MIT License (see [LICENSE](LICENSE) if you add one)

**Artwork & Content**: © Rustamadji Family Estate. All rights reserved.

The source code for this website is open source and free to use. However, the paintings, photographs, and biographical content remain the copyright of the Rustamadji family estate. Please contact the archive before reproducing any artwork images.

---

## 👤 Contact

For inquiries about the archive, exhibition loans, prints, or permissions:

- **Email**: archive@rustamadji.id
- **Phone**: +62-812-3456-7890
- **WhatsApp**: [Open chat](https://wa.me/6281234567890)
- **Location**: Klaten, Central Java, Indonesia

---

## 🙏 Credits

- **Design & Development**: Built with care for the Rustamadji family archive
- **Typography**: [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) by Christian Thalmann, [Inter](https://rsms.me/inter/) by Rasmus Andersson
- **Icons**: [Lucide](https://lucide.dev/)
- **Framework**: [Tailwind CSS](https://tailwindcss.com/)

---

## 📚 Reference

The biography and artwork documentation on this site draw from:

> *Meniti Bumi, Rustamadji Klaten / Walking the Earth, Rustamadji Klaten* — family monograph

---

**Built with respect for three generations of observation-led painting.**

*Klaten, Central Java · 1921–present*
