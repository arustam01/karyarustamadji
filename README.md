# Rustamadji Gallery

**A family archive of Indonesian realism**

Official online gallery and archive for painter **Rustamadji of Klaten** (b. 19 January 1921), Indonesian master of realism, and his sons **Bodas Erlangga** and **Karang Sasongko** — three generations of disciplined, observation-led painting from Central Java.

🌐 **Live site**: https://arustam01.github.io/karyarustamadji/

---

## ✨ Features

- **11 authenticated paintings** by Rustamadji with full catalogue details
- **Zero-build static site** — pure HTML/CSS/JS, no Node.js or npm required
- **Single-page application** with smooth client-side routing
- **Museum-editorial aesthetic** — parchment background, serif typography, paper grain texture
- **Fully responsive** — mobile-first design with Tailwind CSS
- **Hardened security** — OWASP Top 10 / SANS CWE Top 25 compliant (see [Security](#-security))
- **Accessible** — WCAG 2.1 AA: skip links, ARIA labels, reduced-motion support, keyboard navigation
- **Floating chat widget** with WhatsApp / Phone / Email quick links

---

## 📂 File Structure

```
karyarustamadji/
├── index.html          # Markup + security headers (CSP, etc.)
├── app.js              # Application logic with input validation & XSS protection
├── style.css           # Global styles (design tokens, animations)
├── images/             # Painting & portrait files
│   ├── rustamadji-portrait.png
│   ├── baturraden.png
│   ├── candi-prambanan.png
│   ├── desa-deles.png
│   ├── hutan-baturraden.png
│   ├── hutan-wonogiri.png
│   ├── kali.png
│   ├── kaliurang.png
│   ├── kemarau.png
│   ├── mengolah-tanah.png
│   ├── prambanan-pepohonan.png
│   └── rembang-tebu.png
├── .gitignore
├── README.md
└── LICENSE
```

---

## 🔒 Security

This site is hardened against the **OWASP Top 10 (2021)** and **SANS CWE Top 25** vulnerabilities.

### Defenses Implemented

| Risk | CWE | Mitigation |
|------|-----|------------|
| **Cross-Site Scripting (XSS)** | CWE-79 | All dynamic content escaped via `escapeHTML()` before insertion. No `eval()`, no `Function()` constructor. Image paths validated against an allowlist regex. |
| **Clickjacking** | CWE-1021 | CSP `frame-ancestors 'none'` prevents the site being embedded in `<iframe>` on other domains. |
| **Code Injection** | CWE-94 | All user-controllable data passes through `escapeAttr()` / `escapeHTML()`. CSP restricts script sources to pinned CDNs. |
| **Improper Input Validation** | CWE-20 | Contact form validates email format, enforces length limits (100/254/200/5000 chars), and rejects CRLF injection attempts. |
| **Path Traversal** | CWE-22 | Image paths validated against `^images/[a-zA-Z0-9_\-]+\.(png\|jpg\|jpeg\|webp\|svg)$`. Data URIs restricted to image types only. |
| **Vulnerable Components** | CWE-1357 | CDN dependency (Lucide) pinned to specific version (`@0.408.0`) rather than `latest`. |
| **Information Disclosure** | CWE-200 | `referrerpolicy="no-referrer"` on all external resources. `Referrer-Policy: strict-origin-when-cross-origin`. |
| **Insecure Protocols** | A02:2021 | CSP `upgrade-insecure-requests` forces HTTPS. GitHub Pages enforces HTTPS by default. |
| **MIME Sniffing** | CWE-430 | `X-Content-Type-Options: nosniff` prevents browsers guessing content types. |
| **External Link Hijacking** | CWE-1022 | All `target="_blank"` links use `rel="noopener noreferrer"`. |

### Content Security Policy

```
default-src 'self';
script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://unpkg.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com data:;
img-src 'self' data: blob:;
connect-src 'self';
base-uri 'self';
form-action 'self' mailto:;
frame-ancestors 'none';
object-src 'none';
upgrade-insecure-requests;
```

> **Note on `'unsafe-inline'`**: Required because Tailwind CDN injects styles dynamically. For maximum security in production, compile Tailwind locally to eliminate this directive.

### Permissions Policy

Disables unused browser APIs by default:
```
geolocation=(), microphone=(), camera=(), payment=(), usb=(), fullscreen=(self)
```

### Testing the Security Posture

Recommended tools after deployment:
- **[Mozilla Observatory](https://observatory.mozilla.org/)** — overall security grading
- **[Security Headers](https://securityheaders.com/)** — header analysis
- **[CSP Evaluator](https://csp-evaluator.withgoogle.com/)** — CSP review

---

## 🚀 Quick Start

### Local Development

1. **Clone** the repository:
   ```bash
   git clone https://github.com/arustam01/karyarustamadji.git
   cd karyarustamadji
   ```
2. **Open `index.html`** in any modern browser, OR serve over HTTP for CSP to behave naturally:
   ```bash
   # Python 3
   python3 -m http.server 8000

   # Node
   npx serve .
   ```
3. Visit `http://localhost:8000`.

> Opening the file via `file://` will trigger some CSP warnings — these are harmless locally, but always test via HTTP before deploy.

---

## 🎨 Customization

### Edit Contact Information

In `app.js`, near the top:
```javascript
var CONFIG = {
  phone:    '+62-812-3456-7890',
  email:    'archive@rustamadji.id',
  whatsapp: '6281234567890'   // digits only, country code + number
};
```

### Add a New Artwork

In `app.js`, push to the `ARTWORKS` array:
```javascript
ARTWORKS.push({
  slug:        'new-painting',          // lowercase, hyphens only
  title:       'Title of the Painting',
  artist:      'rustamadji',            // rustamadji | bodas-erlangga | karang-sasongko
  year:        1980,
  medium:      'Oil on canvas',
  dimensions:  '100 cm × 140 cm',
  featured:    true,                    // optional — homepage display
  img:         'images/new-painting.png',
  description: 'Curatorial description here.'
});
```

Then drop the image file into `images/new-painting.png`. That's it.

### Change Colors / Fonts

Edit CSS variables in `style.css`:
```css
:root {
  --color-parchment-100: #f5efe4;  /* Background */
  --color-umber-800:    #1a1410;   /* Text */
  --color-ochre-500:    #b8924a;   /* Accent */
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body:    'Inter', system-ui, sans-serif;
}
```

---

## 🌐 Deployment

### GitHub Pages (current setup)

1. Push to `main` branch
2. Settings → Pages → Source: `Deploy from a branch` → `main` / `/ (root)`
3. Live at `https://USERNAME.github.io/REPO/`

### Custom Domain

1. In repo Settings → Pages → Custom domain: `www.karyarustamadji.com`
2. At domain registrar, add DNS records:
   - **CNAME**: `www` → `arustam01.github.io`
   - **A records** (for apex domain): point to GitHub Pages IPs:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
3. Wait ~24 hours for DNS propagation.

---

## 📚 The Archive

### Painter

**Rustamadji Klaten** (b. 19 January 1921)
- Indonesian master of realism
- Documented in *Meniti Bumi / Walking the Earth, Rustamadji Klaten*
- Subjects: Javanese landscapes, portraits, working life, Hindu temples

### Catalogue (11 works currently online)

| Title | Year | Dimensions |
|-------|------|------------|
| Kali | 1974 | 98 × 140 cm |
| Kaliurang | 1982 | 142 × 215.5 cm |
| Desa Deles | 1983 | 154 × 110 cm |
| Prambanan dari Balik Pepohonan | 1983 | 110.5 × 155 cm |
| Mengolah Tanah | 1984 | 108 × 143 cm |
| Baturraden | 1987 | 96 × 140 cm |
| Hutan Baturraden | 1987 | 140 × 98 cm |
| Rembang Tebu | 1987 | 140 × 200 cm |
| Candi Prambanan | 1988 | 170 × 150 cm |
| Kemarau | 1995 | 110 × 155 cm |
| Hutan di Wonogiri | 1996 | 98 × 140 cm |

All works oil on canvas.

---

## 🛠 Tech Stack

- **HTML5** — semantic markup, ARIA landmarks
- **CSS3** — custom properties, Flexbox, Grid, `prefers-reduced-motion`
- **Vanilla JavaScript** (IIFE, strict mode) — no frameworks
- **Tailwind CSS** (CDN) — utility classes
- **Google Fonts** — Cormorant Garamond, Inter, JetBrains Mono
- **Lucide Icons** (v0.408.0, pinned) — UI icons

**Zero npm dependencies. Zero build step.**

---

## 📝 License

**Code**: MIT License — see [LICENSE](LICENSE)

**Artwork & biographical content**: © Rustamadji Family Estate. All rights reserved. Use of artwork images or biographical text requires written permission. Contact `archive@rustamadji.id`.

---

## 👤 Contact

- **Email**: archive@rustamadji.id
- **Phone**: +62-812-3456-7890
- **Location**: Klaten, Central Java, Indonesia

---

## 🙏 Credits

- **Typography**: [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond), [Inter](https://rsms.me/inter/)
- **Icons**: [Lucide](https://lucide.dev/)
- **Framework**: [Tailwind CSS](https://tailwindcss.com/)
- **Reference monograph**: *Meniti Bumi, Rustamadji Klaten / Walking the Earth, Rustamadji Klaten*

---

*Klaten, Central Java · 1921–present*
