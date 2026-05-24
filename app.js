/* =============================================================
   Rustamadji Gallery — Application Logic
   
   Security features (OWASP Top 10 / SANS CWE Top 25):
   • CWE-79  (XSS): All dynamic content escaped via escapeHTML()
   • CWE-20  (Input Validation): Contact form validated client-side
   • CWE-22  (Path Traversal): Image paths validated against allowlist
   • CWE-94  (Code Injection): No eval(), no Function() constructor
   • CWE-918 (SSRF): All external links use rel="noopener noreferrer"
   • CWE-1021 (Clickjacking): CSP frame-ancestors set in HTML
   ============================================================= */

'use strict';

(function () {
  // ─────────────────────────────────────────────────────────────
  // SECURITY UTILITIES
  // ─────────────────────────────────────────────────────────────

  /**
   * Escape HTML to prevent XSS injection in template strings.
   * MUST be used for ANY value interpolated into innerHTML.
   * @see CWE-79 Cross-Site Scripting
   */
  function escapeHTML(unsafe) {
    if (unsafe === null || unsafe === undefined) return '';
    return String(unsafe)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Escape values used inside HTML attributes (extra defensive).
   */
  function escapeAttr(unsafe) {
    return escapeHTML(unsafe).replace(/`/g, '&#96;');
  }

  /**
   * Validate image paths against an allowlist of safe patterns.
   * Prevents path traversal and protocol injection.
   * @see CWE-22 Path Traversal
   */
  function safeImagePath(path) {
    if (typeof path !== 'string') return '';
    // Allow only: relative paths (images/...) or data: URIs we control
    var isRelativeImage = /^images\/[a-zA-Z0-9_\-]+\.(png|jpg|jpeg|webp|svg)$/.test(path);
    var isDataUri = /^data:image\/(png|jpeg|jpg|svg\+xml);base64,[A-Za-z0-9+\/=]+$/.test(path);
    var isSvgDataUri = path.indexOf('data:image/svg+xml;utf8,') === 0;
    if (isRelativeImage || isDataUri || isSvgDataUri) return path;
    return ''; // Reject anything else (http://, javascript:, file://, etc.)
  }

  /**
   * Validate slug format — alphanumeric and hyphens only.
   * Used for routing keys; prevents injection via URL/data.
   */
  function safeSlug(slug) {
    if (typeof slug !== 'string') return '';
    return /^[a-z0-9\-]{1,80}$/.test(slug) ? slug : '';
  }

  /**
   * RFC 5322-lite email validation (defense in depth on top of HTML5).
   * @see CWE-20 Improper Input Validation
   */
  function isValidEmail(email) {
    if (typeof email !== 'string' || email.length > 254) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ─────────────────────────────────────────────────────────────
  // CONFIGURATION
  // ─────────────────────────────────────────────────────────────

  var CONFIG = {
    phone:    '+62-812-3456-7890',
    email:    'archive@rustamadji.id',
    whatsapp: '6281234567890'
  };

  var PORTRAIT = 'images/rustamadji-portrait.png';

  // ─────────────────────────────────────────────────────────────
  // DATA
  // ─────────────────────────────────────────────────────────────

  var ARTISTS = [
    {
      slug: 'rustamadji',
      name: 'Rustamadji',
      role: 'Realist Painter',
      movement: 'Realism',
      bornPlace: 'Klaten, Central Java',
      bornDate: '19 January 1921',
      portrait: PORTRAIT,
      shortBio: "Indonesian master of realism. From the foothills of Klaten he painted landscapes, portraits, and the daily life of Java with an unwavering eye.",
      bio: [
        "Rustamadji was born on 19 January 1921 in Klaten, a regency in Central Java situated between the slopes of Mount Merapi and the cultural heart of Surakarta. The light, the rice fields, and the volcanic ridges of his birthplace would become recurring subjects throughout a lifetime of painting.",
        "Working firmly within the tradition of realism, Rustamadji devoted himself to observed truth — figures rendered with anatomical precision, landscapes built from patient layers of oil, and portraits that read like quiet biographies. He refused the shortcuts of stylisation; every brushstroke had to answer to nature.",
        "His life and work are documented in the monograph \"Meniti Bumi, Rustamadji Klaten / Walking the Earth, Rustamadji Klaten\", which traces his journey across Java and the friendships and apprenticeships that shaped his eye.",
        "Rustamadji raised two sons who became painters in their own right — Bodas Erlangga and Karang Sasongko — extending the family's commitment to disciplined, observation-led painting into a second generation."
      ]
    },
    {
      slug: 'bodas-erlangga',
      name: 'Bodas Erlangga',
      role: 'Painter',
      movement: 'Contemporary Realism',
      bornPlace: 'Klaten, Central Java',
      bornDate: '\u2014',
      portrait: null,
      color: '#5a4231',
      shortBio: "Son of Rustamadji. Carries his father's realist discipline into landscapes and portraits with a softer, more atmospheric palette.",
      bio: [
        "Bodas Erlangga grew up in the studio of his father Rustamadji, learning to grind pigments and stretch canvas before he could read a brand label. That early apprenticeship gave him an almost instinctive feel for surface, light, and the long patience that realist painting demands.",
        "His mature work pairs the rigorous draughtsmanship inherited from his father with a softer, more atmospheric palette \u2014 misted ricefields at dawn, figures dissolving into warm interior light, still lifes that hover between observation and reverie.",
        "Bodas exhibits regularly across Java and contributes to the ongoing documentation of the Rustamadji family archive."
      ]
    },
    {
      slug: 'karang-sasongko',
      name: 'Karang Sasongko',
      role: 'Painter',
      movement: 'Realism',
      bornPlace: 'Klaten, Central Java',
      bornDate: '\u2014',
      portrait: null,
      color: '#3f2e22',
      shortBio: "Son of Rustamadji. A realist with a sculptural sense of form \u2014 figures, horses, and the working life of Central Java.",
      bio: [
        "Karang Sasongko studied painting under his father from childhood, then continued formally at art academies in Java. Where his older brother turned to atmosphere, Karang gravitated to form: muscled animals, working figures, the architecture of the human body in motion.",
        "His canvases are built from dense layers of oil and an almost sculptural sense of edge. Horses, fishermen, and farmers recur as motifs \u2014 figures who, like his father's subjects, are observed rather than staged.",
        "Karang lives and works in Klaten, continuing the family studio tradition."
      ]
    }
  ];

  // Eleven authenticated works by Rustamadji, drawn from the family archive.
  // All measurements in centimetres. All works oil on canvas.
  var ARTWORKS = [
    {
      slug: 'kaliurang',
      title: 'Kaliurang',
      artist: 'rustamadji',
      year: 1982,
      medium: 'Oil on canvas',
      dimensions: '142 cm \u00d7 215.5 cm',
      featured: true,
      img: 'images/kaliurang.png',
      description: "A monumental portrait of Mount Merapi viewed from the resort village of Kaliurang on its southern slopes. The volcano\u2019s scarred, weathered flanks are rendered with extraordinary geological precision, framed by the silhouetted trunks of trees clinging to the foothills. At over two metres wide, this is one of Rustamadji\u2019s most ambitious landscapes \u2014 a direct confrontation with the mountain that defined his region, his climate, and his life\u2019s work."
    },
    {
      slug: 'kemarau',
      title: 'Kemarau',
      artist: 'rustamadji',
      year: 1995,
      medium: 'Oil on canvas',
      dimensions: '110 cm \u00d7 155 cm',
      featured: true,
      img: 'images/kemarau.png',
      description: "Kemarau \u2014 the dry season \u2014 transforms the foothills of Central Java into a study in ochre, dust, and patient endurance. Rustamadji renders the cracked earth and bleached fields with documentary honesty, while in the distance the blue ridge of mountains holds the promise of returning rain. A meditation on waiting; a portrait of Java\u2019s other half, often unseen in the postcards."
    },
    {
      slug: 'mengolah-tanah',
      title: 'Mengolah Tanah',
      artist: 'rustamadji',
      year: 1984,
      medium: 'Oil on canvas',
      dimensions: '108 cm \u00d7 143 cm',
      featured: true,
      img: 'images/mengolah-tanah.png',
      description: "Mengolah Tanah \u2014 Tilling the Earth \u2014 shows a farmer driving his pair of water buffalo through flooded paddy in the early light. Rustamadji\u2019s draughtsmanship is at its most assured here: the muscular tension of the animals, the farmer\u2019s grounded stance, the precise reflections splintered across the water. A working portrait of the daily labour that built Java\u2019s rice civilisation \u2014 observed without sentiment and rendered with dignity."
    },
    {
      slug: 'rembang-tebu',
      title: 'Rembang Tebu',
      artist: 'rustamadji',
      year: 1987,
      medium: 'Oil on canvas',
      dimensions: '140 cm \u00d7 200 cm',
      featured: true,
      img: 'images/rembang-tebu.png',
      description: "Sugar cane harvest in Rembang \u2014 Rustamadji\u2019s most ambitious figural composition, populating a two-metre canvas with the entire choreography of harvest labour. Workers shoulder bundled cane, children watch from the margins, cattle haul the load, and the railway tracks of colonial-era plantation infrastructure cut across the foreground. A culminating achievement of the painter\u2019s lifelong commitment to observing his people at their work."
    },
    {
      slug: 'candi-prambanan',
      title: 'Candi Prambanan',
      artist: 'rustamadji',
      year: 1988,
      medium: 'Oil on canvas',
      dimensions: '170 cm \u00d7 150 cm',
      featured: true,
      img: 'images/candi-prambanan.png',
      description: "The monumental Prambanan temple complex rises against a vast Javanese sky, its intricate stone latticework rendered with archaeological precision. Painted at the height of Rustamadji\u2019s mature period, this large-format canvas reframes a national heritage site as a study in scale, devotion, and the weight of centuries. The figures drifting across the foreground \u2014 small, anonymous, alive \u2014 establish the temple\u2019s overwhelming verticality."
    },
    {
      slug: 'prambanan-pepohonan',
      title: 'Prambanan dari Balik Pepohonan',
      artist: 'rustamadji',
      year: 1983,
      medium: 'Oil on canvas',
      dimensions: '110.5 cm \u00d7 155 cm',
      featured: true,
      img: 'images/prambanan-pepohonan.png',
      description: "Prambanan glimpsed through the trees \u2014 the temple half-veiled by tropical canopy, with a farmer driving his buffalo across the foreground and ducks settling in a roadside pool. Rustamadji here treats heritage as living landscape: not the official postcard view, but the temple as it appears to those who live alongside it. The framing trees, painted with extraordinary textural fidelity, give the composition its quiet authority."
    },
    {
      slug: 'desa-deles',
      title: 'Desa Deles',
      artist: 'rustamadji',
      year: 1983,
      medium: 'Oil on canvas',
      dimensions: '154 cm \u00d7 110 cm',
      img: 'images/desa-deles.png',
      description: "The conical silhouette of Mount Merapi presides over the village of Deles, framed in the foreground by the emerald foliage of Java\u2019s mid-altitude forests. A masterclass in atmospheric perspective: Rustamadji builds the mountain from delicate, accumulated glazes, achieving the soft volumetric mass that only patient observation can yield. The painting reads as both portrait and pilgrimage \u2014 Merapi as the family\u2019s lifelong companion."
    },
    {
      slug: 'baturraden',
      title: 'Baturraden',
      artist: 'rustamadji',
      year: 1987,
      medium: 'Oil on canvas',
      dimensions: '96 cm \u00d7 140 cm',
      img: 'images/baturraden.png',
      description: "A cascading waterfall in the Baturraden highlands of Central Java tumbles over moss-covered boulders into a shallow pool strewn with worn river stones. Rustamadji\u2019s brush captures the interplay of light, water, and stone with extraordinary fidelity \u2014 each rock is rendered with the patience of an observed witness, while the surrounding rainforest dissolves into atmospheric depth. A meditation on the persistence of water and the geology of waiting."
    },
    {
      slug: 'hutan-baturraden',
      title: 'Hutan Baturraden',
      artist: 'rustamadji',
      year: 1987,
      medium: 'Oil on canvas',
      dimensions: '140 cm \u00d7 98 cm',
      img: 'images/hutan-baturraden.png',
      description: "A mountain stream threads its way down the forested slopes of Baturraden, the water catching the filtered light that penetrates the canopy above. Rustamadji\u2019s restrained palette \u2014 deep greens, slate greys, the warm browns of wet stone \u2014 captures the particular twilight quality of Java\u2019s high forests. The vertical composition leads the eye upward along the water\u2019s path, inviting the slow looking the subject demands."
    },
    {
      slug: 'hutan-wonogiri',
      title: 'Hutan di Wonogiri',
      artist: 'rustamadji',
      year: 1996,
      medium: 'Oil on canvas',
      dimensions: '98 cm \u00d7 140 cm',
      img: 'images/hutan-wonogiri.png',
      description: "Late afternoon light pours through the trunks of a Wonogiri forest, illuminating one luminous tree as if from within. Painted in the painter\u2019s later years, this work deploys a remarkably reduced palette \u2014 mauves, soft yellows, the rust of fallen leaves \u2014 to convey the cathedral hush of mature woodland. A study in how light, given time and attention, becomes substance."
    },
    {
      slug: 'kali',
      title: 'Kali',
      artist: 'rustamadji',
      year: 1974,
      medium: 'Oil on canvas',
      dimensions: '98 cm \u00d7 140 cm',
      img: 'images/kali.png',
      description: "Among Rustamadji\u2019s earliest mature landscapes, this study of a Javanese river bend captures the particular density of tropical foliage at the close of day. A single shaft of light illuminating the central thicket transforms an ordinary stream into an almost devotional image. The work anticipates the atmospheric vocabulary the painter would refine across the following two decades."
    }
  ];

  // ─────────────────────────────────────────────────────────────
  // DATA HELPERS
  // ─────────────────────────────────────────────────────────────

  function artistBySlug(s) {
    var safe = safeSlug(s);
    if (!safe) return null;
    for (var i = 0; i < ARTISTS.length; i++) {
      if (ARTISTS[i].slug === safe) return ARTISTS[i];
    }
    return null;
  }

  function worksByArtist(s) {
    var safe = safeSlug(s);
    if (!safe) return [];
    return ARTWORKS.filter(function (a) { return a.artist === safe; });
  }

  function artworkBySlug(s) {
    var safe = safeSlug(s);
    if (!safe) return null;
    for (var i = 0; i < ARTWORKS.length; i++) {
      if (ARTWORKS[i].slug === safe) return ARTWORKS[i];
    }
    return null;
  }

  /** Build a parchment-tinted SVG placeholder. */
  function plaqueSvg(opts) {
    var title = String(opts.title || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    var year = String(opts.year || '');
    var color = /^#[0-9a-fA-F]{6}$/.test(opts.color) ? opts.color : '#5a4231';
    var w = Number(opts.w) || 800;
    var h = Number(opts.h) || 1000;
    var svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 " + w + " " + h + "'>" +
      "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>" +
      "<stop offset='0%' stop-color='#f5efe4'/>" +
      "<stop offset='60%' stop-color='" + color + "' stop-opacity='0.12'/>" +
      "<stop offset='100%' stop-color='" + color + "' stop-opacity='0.28'/>" +
      "</linearGradient><pattern id='grain' patternUnits='userSpaceOnUse' width='3' height='3'>" +
      "<circle cx='1' cy='1' r='0.5' fill='" + color + "' fill-opacity='0.18'/>" +
      "</pattern></defs>" +
      "<rect width='100%' height='100%' fill='url(#g)'/>" +
      "<rect width='100%' height='100%' fill='url(#grain)'/>" +
      "<g font-family='Cormorant Garamond, Georgia, serif' text-anchor='middle' fill='" + color + "'>" +
      "<text x='50%' y='46%' font-size='46' font-style='italic'>" + title + "</text>" +
      "<text x='50%' y='54%' font-size='28' opacity='0.55' font-style='italic'>" + year + "</text>" +
      "</g></svg>";
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  function artworkImage(a) {
    var validated = safeImagePath(a.img);
    if (validated) return validated;
    return plaqueSvg({ title: a.title, year: a.year, color: a.color });
  }

  function artistImage(p) {
    var validated = safeImagePath(p.portrait);
    if (validated) return validated;
    return plaqueSvg({ title: p.name, year: '', color: p.color, w: 900, h: 1200 });
  }

  // ─────────────────────────────────────────────────────────────
  // RENDERERS (all dynamic content escaped)
  // ─────────────────────────────────────────────────────────────

  function cardArtwork(a, priority) {
    var artist = artistBySlug(a.artist);
    var loading = priority ? 'eager' : 'lazy';
    return '<a href="#" data-artwork="' + escapeAttr(a.slug) + '" class="art-card group block cursor-pointer">' +
      '<div class="art-frame relative aspect-[4/5]">' +
        '<img src="' + escapeAttr(artworkImage(a)) + '" alt="' + escapeAttr(a.title + ', ' + a.year) + '" ' +
             'class="absolute inset-0 w-full h-full object-cover" loading="' + loading + '" ' +
             'referrerpolicy="no-referrer" />' +
      '</div>' +
      '<div class="pt-5">' +
        '<p class="eyebrow">' + escapeHTML(artist ? artist.name : '') + '</p>' +
        '<h3 class="font-display text-xl lg:text-2xl text-umber-800 mt-1 leading-tight">' +
          '<em class="not-italic">' + escapeHTML(a.title) + '</em>' +
          '<span class="text-umber-400 font-light italic">, ' + escapeHTML(a.year) + '</span>' +
        '</h3>' +
        '<p class="text-xs text-umber-500 mt-2 tracking-wide">' +
          escapeHTML(a.medium) + ' \u00b7 ' + escapeHTML(a.dimensions) +
        '</p>' +
      '</div>' +
    '</a>';
  }

  function cardArtist(p, i) {
    var index = String((i || 0) + 1);
    if (index.length === 1) index = '0' + index;
    return '<a href="#" data-artist="' + escapeAttr(p.slug) + '" class="group block cursor-pointer">' +
      '<div class="art-frame relative aspect-[3/4]">' +
        '<img src="' + escapeAttr(artistImage(p)) + '" alt="' + escapeAttr(p.name) + '" ' +
             'class="absolute inset-0 w-full h-full object-cover" referrerpolicy="no-referrer" />' +
        '<span class="absolute top-5 left-5 year-numeral text-parchment-100 text-4xl drop-shadow-lg">' + index + '</span>' +
      '</div>' +
      '<div class="pt-6">' +
        '<p class="eyebrow">' + escapeHTML(p.movement) + '</p>' +
        '<h3 class="font-display text-3xl text-umber-800 mt-1">' + escapeHTML(p.name) + '</h3>' +
        '<p class="mt-3 text-sm text-umber-500 max-w-md leading-relaxed">' + escapeHTML(p.shortBio) + '</p>' +
        '<span class="mt-5 inline-flex items-center gap-2 text-xs tracking-widest uppercase text-umber-700 group-hover:text-ochre-600 transition-colors">' +
          'View profile <span aria-hidden="true" class="transition-transform group-hover:translate-x-1">\u2192</span>' +
        '</span>' +
      '</div>' +
    '</a>';
  }

  function renderHome() {
    var featured = ARTWORKS.filter(function (a) { return a.featured; }).slice(0, 6);
    document.getElementById('featured-grid').innerHTML =
      featured.map(function (a, i) { return cardArtwork(a, i < 2); }).join('');
    var kids = ARTISTS.filter(function (a) { return a.slug !== 'rustamadji'; });
    document.getElementById('family-teaser').innerHTML =
      kids.map(function (p, i) { return cardArtist(p, i); }).join('');
  }

  function renderGallery(filter) {
    var items = filter ? ARTWORKS.filter(function (a) { return a.artist === filter; }) : ARTWORKS.slice();
    items.sort(function (a, b) { return b.year - a.year; });
    document.getElementById('gallery-count').textContent = items.length + ' paintings';
    document.getElementById('gallery-grid').innerHTML = items.map(function (a) { return cardArtwork(a); }).join('');

    // Build filter chips with escaped attributes
    var fbar = document.getElementById('filters');
    var allChip = '<a href="#" data-filter="" class="chip ' + (!filter ? 'is-active' : '') + '">All painters</a>';
    var artistChips = ARTISTS.map(function (a) {
      var active = filter === a.slug ? 'is-active' : '';
      return '<a href="#" data-filter="' + escapeAttr(a.slug) + '" class="chip ' + active + '">' + escapeHTML(a.name) + '</a>';
    }).join('');
    fbar.innerHTML = allChip + artistChips;

    // Style chips
    var chips = document.querySelectorAll('.chip');
    for (var i = 0; i < chips.length; i++) {
      var isActive = chips[i].classList.contains('is-active');
      chips[i].className = 'chip px-4 py-2 rounded-full text-xs tracking-widest uppercase border transition-colors ' +
        (isActive
          ? 'bg-umber-800 text-parchment-100 border-umber-800'
          : 'bg-transparent text-umber-700 border-umber-800/20 hover:border-umber-800/60');
    }

    // Filter handlers
    var filterEls = document.querySelectorAll('#filters .chip');
    for (var j = 0; j < filterEls.length; j++) {
      filterEls[j].addEventListener('click', function (e) {
        e.preventDefault();
        var f = this.getAttribute('data-filter') || null;
        renderGallery(f);
      });
    }
    attachCardLinks();
  }

  function renderFamily() {
    var kids = ARTISTS.filter(function (a) { return a.slug !== 'rustamadji'; });
    document.getElementById('family-grid').innerHTML = kids.map(function (p, i) { return cardArtist(p, i); }).join('');
  }

  function renderArtist(slug) {
    var a = artistBySlug(slug);
    if (!a) return;
    var works = worksByArtist(slug);
    var bioHtml = a.bio.map(function (p, i) {
      var cls = i === 0 ? 'font-display text-2xl leading-[1.5] text-umber-800' : '';
      return '<p class="' + cls + '">' + escapeHTML(p) + '</p>';
    }).join('');
    var firstName = escapeHTML(a.name.split(' ')[0]);

    var html = '<header class="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-12 gap-12 lg:gap-20 items-end">' +
      '<div class="lg:col-span-7">' +
        '<p class="eyebrow mb-6">' + escapeHTML(a.movement) + ' \u00b7 b. ' + escapeHTML(a.bornPlace) + '</p>' +
        '<h1 class="font-display text-5xl md:text-7xl lg:text-8xl text-umber-800 leading-[0.95] tracking-tight">' + escapeHTML(a.name) + '</h1>' +
        '<p class="mt-8 text-lg text-umber-600 leading-relaxed max-w-xl">' + escapeHTML(a.shortBio) + '</p>' +
      '</div>' +
      '<figure class="lg:col-span-5">' +
        '<div class="relative aspect-[3/4] bg-parchment-200">' +
          '<img src="' + escapeAttr(artistImage(a)) + '" alt="' + escapeAttr('Portrait of ' + a.name) + '" class="absolute inset-0 w-full h-full object-cover" referrerpolicy="no-referrer" />' +
        '</div>' +
        '<figcaption class="mt-3 text-xs text-umber-500 italic text-right">' + escapeHTML(a.name) + ', portrait</figcaption>' +
      '</figure>' +
    '</header>' +
    '<section class="mx-auto max-w-3xl px-6 lg:px-10 mt-24 space-y-8 text-lg text-umber-700 leading-relaxed">' + bioHtml + '</section>' +
    '<section class="mt-32 mx-auto max-w-7xl px-6 lg:px-10">' +
      '<div class="flex items-end justify-between mb-12">' +
        '<div>' +
          '<p class="eyebrow mb-3">Selected works</p>' +
          '<h2 class="font-display text-4xl md:text-5xl text-umber-800">In the studio of ' + firstName + '</h2>' +
        '</div>' +
        '<p class="text-xs tracking-widest uppercase text-umber-500 hidden md:block">' + works.length + ' ' + (works.length === 1 ? 'work' : 'works') + '</p>' +
      '</div>' +
      '<div class="hairline mb-14"></div>';

    if (works.length) {
      html += '<div class="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">' +
        works.map(function (w, i) { return cardArtwork(w, i < 3); }).join('') +
      '</div>';
    } else {
      html += '<p class="italic text-umber-500">Works for this painter are being prepared for the archive.</p>';
    }
    html += '</section>';

    document.getElementById('artist-profile').innerHTML = html;
    attachCardLinks();
    if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
  }

  function plaqueRow(label, value) {
    return '<div class="grid grid-cols-3 gap-4">' +
      '<dt class="eyebrow">' + escapeHTML(label) + '</dt>' +
      '<dd class="col-span-2 text-umber-800">' + escapeHTML(value) + '</dd>' +
    '</div>';
  }

  function renderArtwork(slug) {
    var a = artworkBySlug(slug);
    if (!a) return;
    var artist = artistBySlug(a.artist);
    var siblings = worksByArtist(a.artist).filter(function (x) { return x.slug !== slug; }).slice(0, 3);

    var html = '<div class="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">' +
      '<figure class="lg:col-span-8">' +
        '<div class="relative aspect-[4/3] bg-parchment-200 overflow-hidden">' +
          '<img src="' + escapeAttr(artworkImage(a)) + '" alt="' + escapeAttr(a.title + ', ' + a.year) + '" class="absolute inset-0 w-full h-full object-contain bg-umber-800/[0.03]" referrerpolicy="no-referrer" />' +
        '</div>' +
      '</figure>' +
      '<div class="lg:col-span-4 lg:sticky lg:top-32">' +
        '<p class="eyebrow">' + escapeHTML(artist ? artist.name : '') + ' \u00b7 ' + escapeHTML(a.year) + '</p>' +
        '<h1 class="font-display text-4xl md:text-5xl lg:text-6xl text-umber-800 leading-[1.05] mt-3 italic">' + escapeHTML(a.title) + '</h1>' +
        '<dl class="mt-10 space-y-5 text-sm">' +
          plaqueRow('Painter', artist ? artist.name : a.artist) +
          plaqueRow('Year', String(a.year)) +
          plaqueRow('Medium', a.medium) +
          plaqueRow('Dimensions', a.dimensions) +
        '</dl>' +
        '<div class="hairline my-10"></div>' +
        '<p class="text-umber-700 leading-relaxed">' + escapeHTML(a.description) + '</p>' +
        '<a href="#" data-artist="' + escapeAttr(a.artist) + '" class="mt-10 inline-flex items-center gap-2 text-xs tracking-widest uppercase text-ochre-600 hover:text-umber-800 transition-colors">' +
          'About ' + escapeHTML(artist ? artist.name : '') + ' \u2192' +
        '</a>' +
      '</div>' +
    '</div>';

    if (siblings.length) {
      html += '<section class="mt-40 mx-auto max-w-7xl px-6 lg:px-10">' +
        '<p class="eyebrow mb-4">Also by ' + escapeHTML(artist ? artist.name : '') + '</p>' +
        '<div class="hairline mb-12"></div>' +
        '<div class="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">' +
          siblings.map(function (s) { return cardArtwork(s); }).join('') +
        '</div>' +
      '</section>';
    }

    document.getElementById('artwork-detail').innerHTML = html;
    attachCardLinks();
    if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
  }

  function attachCardLinks() {
    var artworkLinks = document.querySelectorAll('[data-artwork]');
    for (var i = 0; i < artworkLinks.length; i++) {
      artworkLinks[i].addEventListener('click', function (e) {
        e.preventDefault();
        var slug = safeSlug(this.getAttribute('data-artwork'));
        if (!slug) return;
        renderArtwork(slug);
        showView('artwork');
      });
    }
    var artistLinks = document.querySelectorAll('[data-artist]');
    for (var j = 0; j < artistLinks.length; j++) {
      artistLinks[j].addEventListener('click', function (e) {
        e.preventDefault();
        var slug = safeSlug(this.getAttribute('data-artist'));
        if (!slug) return;
        if (slug === 'rustamadji') { showView('biography'); return; }
        renderArtist(slug);
        showView('artist');
      });
    }
  }

  // ─────────────────────────────────────────────────────────────
  // ROUTING — allowlist of valid views
  // ─────────────────────────────────────────────────────────────

  var VALID_VIEWS = ['home', 'biography', 'gallery', 'family', 'artist', 'artwork', 'contact'];

  function showView(name) {
    if (VALID_VIEWS.indexOf(name) === -1) return;
    var views = document.querySelectorAll('.view');
    for (var i = 0; i < views.length; i++) views[i].classList.remove('is-active');
    var target = document.querySelector('[data-view-target="' + name + '"]');
    if (target) {
      target.classList.add('is-active');
      target.style.animation = 'none';
      void target.offsetWidth; // force reflow
      target.style.animation = '';
    }
    var navLinks = document.querySelectorAll('.nav-link');
    for (var k = 0; k < navLinks.length; k++) {
      var active = navLinks[k].getAttribute('data-view') === name;
      navLinks[k].classList.toggle('text-umber-800', active);
      navLinks[k].classList.toggle('text-umber-500', !active);
    }
    document.getElementById('mobile-menu').classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (name === 'gallery') renderGallery();
    if (name === 'family')  renderFamily();
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-view]');
    if (a) {
      e.preventDefault();
      showView(a.getAttribute('data-view'));
    }
  });

  // ─────────────────────────────────────────────────────────────
  // CONTACT FORM — input validation + mailto: handoff
  // ─────────────────────────────────────────────────────────────

  function wireContact() {
    var phone = CONFIG.phone;
    var email = CONFIG.email;
    var whatsapp = CONFIG.whatsapp;

    // Validate WhatsApp number is digits only (defense in depth)
    var safeWhatsapp = /^\d{10,15}$/.test(whatsapp) ? whatsapp : '';

    // Contact page direct channels
    document.getElementById('row-wa').href = safeWhatsapp ? 'https://wa.me/' + safeWhatsapp : '#';
    document.getElementById('row-phone').href = 'tel:' + encodeURIComponent(phone);
    document.getElementById('row-email').href = 'mailto:' + encodeURIComponent(email) + '?subject=' + encodeURIComponent('Inquiry — Rustamadji Gallery');
    document.getElementById('phone-val').textContent = phone;
    document.getElementById('email-val').textContent = email;

    // Footer
    var fp = document.getElementById('footer-phone');
    fp.href = 'tel:' + encodeURIComponent(phone);
    fp.textContent = phone;
    var fe = document.getElementById('footer-email');
    fe.href = 'mailto:' + encodeURIComponent(email);
    fe.textContent = email;

    // Chat widget
    document.getElementById('cw-wa').href = safeWhatsapp ? 'https://wa.me/' + safeWhatsapp : '#';
    document.getElementById('cw-phone').href = 'tel:' + encodeURIComponent(phone);
    document.getElementById('cw-phone-val').textContent = phone;
    document.getElementById('cw-email').href = 'mailto:' + encodeURIComponent(email) + '?subject=' + encodeURIComponent('Inquiry — Rustamadji Gallery');
    document.getElementById('cw-email-val').textContent = email;
  }

  document.getElementById('chat-toggle').addEventListener('click', function () {
    document.getElementById('chat-panel').classList.toggle('hidden');
  });

  document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();
    // Defensive input validation — even though target is mailto:, we sanitise.
    var name    = String(document.getElementById('cf-name').value || '').trim().slice(0, 100);
    var from    = String(document.getElementById('cf-email').value || '').trim().slice(0, 254);
    var subject = String(document.getElementById('cf-subject').value || '').trim().slice(0, 200);
    var body    = String(document.getElementById('cf-message').value || '').trim().slice(0, 5000);
    var errEl   = document.getElementById('cf-error');

    if (!name || !from || !subject || !body) {
      errEl.textContent = 'Please fill in all fields.';
      return;
    }
    if (!isValidEmail(from)) {
      errEl.textContent = 'Please enter a valid email address.';
      return;
    }
    // Reject obvious header-injection attempts
    if (/[\r\n]/.test(name + from + subject)) {
      errEl.textContent = 'Invalid characters detected.';
      return;
    }
    errEl.textContent = '';

    var mail = 'mailto:' + encodeURIComponent(CONFIG.email) +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body + '\n\n— ' + name + ' <' + from + '>');
    window.location.href = mail;
  });

  document.getElementById('menu-btn').addEventListener('click', function () {
    document.getElementById('mobile-menu').classList.toggle('hidden');
  });

  window.addEventListener('scroll', function () {
    var nav = document.getElementById('nav');
    if (window.scrollY > 12) {
      nav.classList.add('bg-parchment-100/85', 'backdrop-blur-md', 'border-b', 'border-umber-800/10');
    } else {
      nav.classList.remove('bg-parchment-100/85', 'backdrop-blur-md', 'border-b', 'border-umber-800/10');
    }
  }, { passive: true });

  // ─────────────────────────────────────────────────────────────
  // BOOT
  // ─────────────────────────────────────────────────────────────

  document.getElementById('year').textContent = new Date().getFullYear();
  wireContact();
  renderHome();
  attachCardLinks();
  if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
})();
