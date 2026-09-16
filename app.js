/* =============================================================
   Rustamadji Gallery — Application Logic
   Security: OWASP Top 10 / SANS CWE Top 25 compliant
     • CWE-79  (XSS):     escapeHTML/escapeAttr on all dynamic content
     • CWE-20  (Input):   email regex, length limits, CRLF rejection
     • CWE-22  (Path):    safeImagePath allowlist
     • CWE-94  (Code):    no eval(), no Function() constructor
     • CWE-1022 (Tabnabbing): rel="noopener noreferrer" on external links
   ============================================================= */

'use strict';

(function () {
  // ─── SECURITY UTILITIES ──────────────────────────────────────

  function escapeHTML(unsafe) {
    if (unsafe === null || unsafe === undefined) return '';
    return String(unsafe)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function escapeAttr(unsafe) {
    return escapeHTML(unsafe).replace(/`/g, '&#96;');
  }

  function safeImagePath(path) {
    if (typeof path !== 'string') return '';
    var isRelativeImage = /^images\/[a-zA-Z0-9_\-]+\.(png|jpg|jpeg|webp|svg)$/.test(path);
    var isDataUri = /^data:image\/(png|jpeg|jpg|svg\+xml);base64,[A-Za-z0-9+\/=]+$/.test(path);
    var isSvgDataUri = path.indexOf('data:image/svg+xml;utf8,') === 0;
    return (isRelativeImage || isDataUri || isSvgDataUri) ? path : '';
  }

  function safeSlug(slug) {
    if (typeof slug !== 'string') return '';
    return /^[a-z0-9\-]{1,80}$/.test(slug) ? slug : '';
  }

  function isValidEmail(email) {
    if (typeof email !== 'string' || email.length > 254) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ─── CONFIG ──────────────────────────────────────────────────

  var CONFIG = {
    phone:    '+62-812-3456-7890',
    email:    'archive@rustamadji.id',
    whatsapp: '6281234567890'
  };

  var PORTRAIT = 'images/rustamadji-portrait.png';

  // ─── DATA ────────────────────────────────────────────────────

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

  var ARTWORKS = [
    {
      slug: 'kaliurang', title: 'Kaliurang', artist: 'rustamadji', year: 1982,
      medium: 'Oil on canvas', dimensions: '142 cm \u00d7 215.5 cm', featured: true,
      img: 'images/kaliurang.png',
      description: "A monumental portrait of Mount Merapi viewed from the resort village of Kaliurang on its southern slopes. The volcano\u2019s scarred, weathered flanks are rendered with extraordinary geological precision, framed by the silhouetted trunks of trees clinging to the foothills. At over two metres wide, this is one of Rustamadji\u2019s most ambitious landscapes \u2014 a direct confrontation with the mountain that defined his region, his climate, and his life\u2019s work."
    },
    {
      slug: 'kemarau', title: 'Kemarau', artist: 'rustamadji', year: 1995,
      medium: 'Oil on canvas', dimensions: '110 cm \u00d7 155 cm', featured: true,
      img: 'images/kemarau.png',
      description: "Kemarau \u2014 the dry season \u2014 transforms the foothills of Central Java into a study in ochre, dust, and patient endurance. Rustamadji renders the cracked earth and bleached fields with documentary honesty, while in the distance the blue ridge of mountains holds the promise of returning rain. A meditation on waiting; a portrait of Java\u2019s other half, often unseen in the postcards."
    },
    {
      slug: 'mengolah-tanah', title: 'Mengolah Tanah', artist: 'rustamadji', year: 1984,
      medium: 'Oil on canvas', dimensions: '108 cm \u00d7 143 cm', featured: true,
      img: 'images/mengolah-tanah.png',
      description: "Mengolah Tanah \u2014 Tilling the Earth \u2014 shows a farmer driving his pair of water buffalo through flooded paddy in the early light. Rustamadji\u2019s draughtsmanship is at its most assured here: the muscular tension of the animals, the farmer\u2019s grounded stance, the precise reflections splintered across the water. A working portrait of the daily labour that built Java\u2019s rice civilisation \u2014 observed without sentiment and rendered with dignity."
    },
    {
      slug: 'rembang-tebu', title: 'Rembang Tebu', artist: 'rustamadji', year: 1987,
      medium: 'Oil on canvas', dimensions: '140 cm \u00d7 200 cm', featured: true,
      img: 'images/rembang-tebu.png',
      description: "Sugar cane harvest in Rembang \u2014 Rustamadji\u2019s most ambitious figural composition, populating a two-metre canvas with the entire choreography of harvest labour. Workers shoulder bundled cane, children watch from the margins, cattle haul the load, and the railway tracks of colonial-era plantation infrastructure cut across the foreground. A culminating achievement of the painter\u2019s lifelong commitment to observing his people at their work."
    },
    {
      slug: 'candi-prambanan', title: 'Candi Prambanan', artist: 'rustamadji', year: 1988,
      medium: 'Oil on canvas', dimensions: '170 cm \u00d7 150 cm', featured: true,
      img: 'images/candi-prambanan.png',
      description: "The monumental Prambanan temple complex rises against a vast Javanese sky, its intricate stone latticework rendered with archaeological precision. Painted at the height of Rustamadji\u2019s mature period, this large-format canvas reframes a national heritage site as a study in scale, devotion, and the weight of centuries. The figures drifting across the foreground \u2014 small, anonymous, alive \u2014 establish the temple\u2019s overwhelming verticality."
    },
    {
      slug: 'prambanan-pepohonan', title: 'Prambanan dari Balik Pepohonan', artist: 'rustamadji', year: 1983,
      medium: 'Oil on canvas', dimensions: '110.5 cm \u00d7 155 cm', featured: true,
      img: 'images/prambanan-pepohonan.png',
      description: "Prambanan glimpsed through the trees \u2014 the temple half-veiled by tropical canopy, with a farmer driving his buffalo across the foreground and ducks settling in a roadside pool. Rustamadji here treats heritage as living landscape: not the official postcard view, but the temple as it appears to those who live alongside it. The framing trees, painted with extraordinary textural fidelity, give the composition its quiet authority."
    },
    {
      slug: 'desa-deles', title: 'Desa Deles', artist: 'rustamadji', year: 1983,
      medium: 'Oil on canvas', dimensions: '154 cm \u00d7 110 cm',
      img: 'images/desa-deles.png',
      description: "The conical silhouette of Mount Merapi presides over the village of Deles, framed in the foreground by the emerald foliage of Java\u2019s mid-altitude forests. A masterclass in atmospheric perspective: Rustamadji builds the mountain from delicate, accumulated glazes, achieving the soft volumetric mass that only patient observation can yield. The painting reads as both portrait and pilgrimage \u2014 Merapi as the family\u2019s lifelong companion."
    },
    {
      slug: 'baturraden', title: 'Baturraden', artist: 'rustamadji', year: 1987,
      medium: 'Oil on canvas', dimensions: '96 cm \u00d7 140 cm',
      img: 'images/baturraden.png',
      description: "A cascading waterfall in the Baturraden highlands of Central Java tumbles over moss-covered boulders into a shallow pool strewn with worn river stones. Rustamadji\u2019s brush captures the interplay of light, water, and stone with extraordinary fidelity \u2014 each rock is rendered with the patience of an observed witness, while the surrounding rainforest dissolves into atmospheric depth. A meditation on the persistence of water and the geology of waiting."
    },
    {
      slug: 'hutan-baturraden', title: 'Hutan Baturraden', artist: 'rustamadji', year: 1987,
      medium: 'Oil on canvas', dimensions: '140 cm \u00d7 98 cm',
      img: 'images/hutan-baturraden.png',
      description: "A mountain stream threads its way down the forested slopes of Baturraden, the water catching the filtered light that penetrates the canopy above. Rustamadji\u2019s restrained palette \u2014 deep greens, slate greys, the warm browns of wet stone \u2014 captures the particular twilight quality of Java\u2019s high forests. The vertical composition leads the eye upward along the water\u2019s path, inviting the slow looking the subject demands."
    },
    {
      slug: 'hutan-wonogiri', title: 'Hutan di Wonogiri', artist: 'rustamadji', year: 1996,
      medium: 'Oil on canvas', dimensions: '98 cm \u00d7 140 cm',
      img: 'images/hutan-wonogiri.png',
      description: "Late afternoon light pours through the trunks of a Wonogiri forest, illuminating one luminous tree as if from within. Painted in the painter\u2019s later years, this work deploys a remarkably reduced palette \u2014 mauves, soft yellows, the rust of fallen leaves \u2014 to convey the cathedral hush of mature woodland. A study in how light, given time and attention, becomes substance."
    },
    {
      slug: 'kali', title: 'Kali', artist: 'rustamadji', year: 1974,
      medium: 'Oil on canvas', dimensions: '98 cm \u00d7 140 cm',
      img: 'images/kali.png',
      description: "Among Rustamadji\u2019s earliest mature landscapes, this study of a Javanese river bend captures the particular density of tropical foliage at the close of day. A single shaft of light illuminating the central thicket transforms an ordinary stream into an almost devotional image. The work anticipates the atmospheric vocabulary the painter would refine across the following two decades."
    }
  ];

  // ─── DATA HELPERS ────────────────────────────────────────────

  function artistBySlug(s) {
    var safe = safeSlug(s);
    if (!safe) return null;
    for (var i = 0; i < ARTISTS.length; i++) if (ARTISTS[i].slug === safe) return ARTISTS[i];
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
    for (var i = 0; i < ARTWORKS.length; i++) if (ARTWORKS[i].slug === safe) return ARTWORKS[i];
    return null;
  }

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
      "</linearGradient></defs>" +
      "<rect width='100%' height='100%' fill='url(#g)'/>" +
      "<g font-family='Cormorant Garamond, Georgia, serif' text-anchor='middle' fill='" + color + "'>" +
      "<text x='50%' y='46%' font-size='46' font-style='italic'>" + title + "</text>" +
      "<text x='50%' y='54%' font-size='28' opacity='0.55' font-style='italic'>" + year + "</text>" +
      "</g></svg>";
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  function artworkImage(a) {
    var validated = safeImagePath(a.img);
    return validated || plaqueSvg({ title: a.title, year: a.year, color: a.color });
  }

  function artistImage(p) {
    var validated = safeImagePath(p.portrait);
    return validated || plaqueSvg({ title: p.name, year: '', color: p.color, w: 900, h: 1200 });
  }

  // ─── RENDERERS ───────────────────────────────────────────────

  function cardArtwork(a, priority) {
    var artist = artistBySlug(a.artist);
    var loading = priority ? 'eager' : 'lazy';
    return '<a href="#" data-artwork="' + escapeAttr(a.slug) + '" class="art-card">' +
      '<div class="art-frame aspect-4-5">' +
        '<img src="' + escapeAttr(artworkImage(a)) + '" alt="' + escapeAttr(a.title + ', ' + a.year) + '" loading="' + loading + '" referrerpolicy="no-referrer" />' +
      '</div>' +
      '<div class="art-meta">' +
        '<p class="eyebrow">' + escapeHTML(artist ? artist.name : '') + '</p>' +
        '<h3 class="art-title"><em>' + escapeHTML(a.title) + '</em><span class="year">, ' + escapeHTML(a.year) + '</span></h3>' +
        '<p class="art-details">' + escapeHTML(a.medium) + ' \u00b7 ' + escapeHTML(a.dimensions) + '</p>' +
      '</div>' +
    '</a>';
  }

  function cardArtist(p, i) {
    var index = String((i || 0) + 1);
    if (index.length === 1) index = '0' + index;
    return '<a href="#" data-artist="' + escapeAttr(p.slug) + '" class="art-card">' +
      '<div class="art-frame aspect-3-4">' +
        '<img src="' + escapeAttr(artistImage(p)) + '" alt="' + escapeAttr(p.name) + '" referrerpolicy="no-referrer" />' +
        '<span class="artist-card-number">' + index + '</span>' +
      '</div>' +
      '<div class="art-meta">' +
        '<p class="eyebrow">' + escapeHTML(p.movement) + '</p>' +
        '<h3 class="font-display text-3xl mt-1" style="color:var(--umber-800);">' + escapeHTML(p.name) + '</h3>' +
        '<p class="mt-3 text-sm leading-relaxed" style="color:var(--umber-500); max-width:28rem;">' + escapeHTML(p.shortBio) + '</p>' +
        '<span class="mt-5 btn-link">View profile <span aria-hidden="true">\u2192</span></span>' +
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

    var fbar = document.getElementById('filters');
    var allChip = '<a href="#" data-filter="" class="chip ' + (!filter ? 'is-active' : '') + '">All painters</a>';
    var artistChips = ARTISTS.map(function (a) {
      var active = filter === a.slug ? 'is-active' : '';
      return '<a href="#" data-filter="' + escapeAttr(a.slug) + '" class="chip ' + active + '">' + escapeHTML(a.name) + '</a>';
    }).join('');
    fbar.innerHTML = allChip + artistChips;

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

  /* ─── DIORAMA (animated exhibition walkthrough / video simulation) ─── */

  var DIORAMA_DURATION = 9500; // ms each slide plays \u2014 unhurried, contemplative pace
  var dioramaSequenceCache = null;
  var dioramaBuilt = false;
  var dioramaIndex = 0;
  var dioramaPlaying = false;
  var dioramaTimer = null;
  var dioramaSlideStart = 0;
  var dioramaRemaining = DIORAMA_DURATION;
  var dioramaReducedMotion = false;
  try {
    dioramaReducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  } catch (e) { dioramaReducedMotion = false; }

  // ─── Ambient sound (generative, mindful/nature-inspired, Web Audio API only) ───
  //
  // Design intent: not a "track" but a living bed of sound \u2014 the way a calm,
  // focus, or nature meditation app scores its scenes. A pentatonic scale is
  // used throughout (no semitone clashes are possible), so any notes that
  // happen to sound together are always consonant. Individual voices drift
  // in and out on their own independent, slightly randomised schedules
  // rather than moving in lockstep, so the texture never quite repeats and
  // never feels mechanical. A soft synthesised reverb gives everything a
  // sense of space, the way sound settles in a quiet room or open air.

  var DIORAMA_AMBIENT_LEVEL = 0.9; // master gain target when audible
  var dioramaSoundEnabled = true;  // default on; only actually starts on user gesture (Play)
  var dioramaAudioCtx = null;
  var dioramaAudioNodes = null;    // built lazily, started once, then only fades

  // Two-octave C major pentatonic, low\u2013mid register: no note in this set
  // ever clashes with another, however the generative voices happen to land.
  var DIORAMA_SCALE = [130.81, 146.83, 164.81, 196.00, 220.00, 261.63, 293.66, 329.63, 392.00, 440.00];

  /** Lazily create the shared AudioContext. Returns null if unsupported. */
  function dioramaGetAudioContext() {
    if (dioramaAudioCtx) return dioramaAudioCtx;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      dioramaAudioCtx = new AC();
    } catch (e) { dioramaAudioCtx = null; }
    return dioramaAudioCtx;
  }

  function dioramaRandBetween(min, max) { return min + Math.random() * (max - min); }

  /** A soft, warm noise buffer (leaky-integrated white noise) for a breath of air/texture. */
  function dioramaCreateNoiseBuffer(ctx, seconds) {
    var bufferSize = Math.floor(ctx.sampleRate * seconds);
    var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    var data = buffer.getChannelData(0);
    var lastOut = 0;
    for (var i = 0; i < bufferSize; i++) {
      var white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.02 * white) / 1.02;
      data[i] = lastOut * 3.5;
    }
    return buffer;
  }

  /** A synthesised soft-room impulse response, so the pad and chime have somewhere to breathe. */
  function dioramaCreateImpulseResponse(ctx, duration, decay) {
    var rate = ctx.sampleRate;
    var length = Math.max(1, Math.floor(rate * duration));
    var impulse = ctx.createBuffer(2, length, rate);
    for (var ch = 0; ch < 2; ch++) {
      var data = impulse.getChannelData(ch);
      for (var i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }
    return impulse;
  }

  /**
   * Create one generative "voice": a single sine tone whose gain and pitch
   * are silent by default. dioramaScheduleVoice keeps it drifting in and
   * out of audibility on its own unhurried, semi-random timetable.
   */
  function dioramaCreateVoice(ctx, destination, def) {
    var gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(destination);
    var osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = DIORAMA_SCALE[def.range[0]];
    osc.connect(gain);
    osc.start();
    return {
      ctx: ctx, osc: osc, gain: gain, range: def.range,
      minDur: def.minDur, maxDur: def.maxDur, fade: def.fade, peak: def.peak, rest: def.rest,
      timer: null
    };
  }

  /** Queue this voice's next note after a period of silence (its "rest"). */
  function dioramaScheduleVoice(voice) {
    clearTimeout(voice.timer);
    var restSecs = dioramaRandBetween(voice.rest[0], voice.rest[1]);
    voice.timer = setTimeout(function () { dioramaSoundVoiceNote(voice); }, restSecs * 1000);
  }

  /** Fade one note in, hold it, fade it back out, then schedule the next rest. Never clicks or jumps. */
  function dioramaSoundVoiceNote(voice) {
    var ctx = voice.ctx;
    var now = ctx.currentTime;
    var lo = voice.range[0], hi = voice.range[1];
    var idx = lo + Math.floor(Math.random() * (hi - lo + 1));
    var freq = DIORAMA_SCALE[idx];

    voice.osc.frequency.setValueAtTime(freq, now); // silent at this instant \u2014 safe to change pitch
    var hold = dioramaRandBetween(voice.minDur, voice.maxDur);
    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(0, now);
    voice.gain.gain.linearRampToValueAtTime(voice.peak, now + voice.fade);
    voice.gain.gain.setValueAtTime(voice.peak, now + voice.fade + hold);
    voice.gain.gain.linearRampToValueAtTime(0, now + voice.fade + hold + voice.fade);

    var totalMs = (voice.fade * 2 + hold) * 1000;
    voice.timer = setTimeout(function () { dioramaScheduleVoice(voice); }, totalMs);
  }

  /**
   * Build the ambient graph once: three independent voices drifting through
   * a pentatonic scale (never in lockstep, never dissonant), a slow-wandering
   * breath of filtered air, and a shared soft reverb so the whole thing sits
   * in space rather than sounding synthesised and dry.
   */
  function dioramaBuildAmbientGraph(ctx) {
    var master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    var convolver = ctx.createConvolver();
    convolver.buffer = dioramaCreateImpulseResponse(ctx, 3.2, 2.6);
    convolver.normalize = true;
    var reverbReturn = ctx.createGain();
    reverbReturn.gain.value = 0.55;
    convolver.connect(reverbReturn);
    reverbReturn.connect(master);
    var reverbSend = ctx.createGain();
    reverbSend.gain.value = 1;
    reverbSend.connect(convolver);

    var padFilter = ctx.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.value = 1400;
    padFilter.Q.value = 0.2;
    padFilter.connect(master);
    padFilter.connect(reverbSend);
    var padBus = ctx.createGain();
    padBus.gain.value = 1;
    padBus.connect(padFilter);

    // Low drone, mid voice, sparse high shimmer \u2014 each with its own tempo
    var voiceDefs = [
      { range: [0, 4], minDur: 18, maxDur: 32, fade: 4.0, peak: 0.050, rest: [4, 14] },
      { range: [2, 7], minDur: 12, maxDur: 20, fade: 3.0, peak: 0.042, rest: [3, 10] },
      { range: [6, 9], minDur: 6,  maxDur: 12, fade: 2.4, peak: 0.028, rest: [8, 20] }
    ];
    var voices = voiceDefs.map(function (def) { return dioramaCreateVoice(ctx, padBus, def); });
    voices.forEach(function (v) { dioramaScheduleVoice(v); });

    // A breath of air: filtered noise whose cutoff wanders very slowly, like a gentle, changing breeze
    var noiseSource = ctx.createBufferSource();
    noiseSource.buffer = dioramaCreateNoiseBuffer(ctx, 6);
    noiseSource.loop = true;
    var noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 450;
    noiseFilter.Q.value = 0.4;
    var noiseLFO = ctx.createOscillator();
    noiseLFO.type = 'sine';
    noiseLFO.frequency.value = 0.025; // roughly a 40-second wandering cycle
    var noiseLFOGain = ctx.createGain();
    noiseLFOGain.gain.value = 160; // sweeps the filter gently between ~290Hz and ~610Hz
    noiseLFO.connect(noiseLFOGain);
    noiseLFOGain.connect(noiseFilter.frequency);
    var noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.014;
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);
    noiseGain.connect(reverbSend);

    return {
      master: master, reverbSend: reverbSend, convolver: convolver,
      voices: voices, noiseSource: noiseSource, noiseLFO: noiseLFO
    };
  }

  /** Start the ambient graph (idempotent \u2014 builds and starts nodes only once per page load). */
  function dioramaStartAmbient() {
    var ctx = dioramaGetAudioContext();
    if (!ctx) return; // Web Audio unsupported; ambient sound silently unavailable
    if (ctx.state === 'suspended') ctx.resume().catch(function () {});
    if (!dioramaAudioNodes) {
      dioramaAudioNodes = dioramaBuildAmbientGraph(ctx);
      dioramaAudioNodes.noiseSource.start();
      dioramaAudioNodes.noiseLFO.start();
    }
  }

  /** Smoothly fade the ambient bed to a target level (click-free via linear ramp). */
  function dioramaFadeAmbientTo(target, duration) {
    if (!dioramaAudioNodes || !dioramaAudioCtx) return;
    var g = dioramaAudioNodes.master.gain;
    var now = dioramaAudioCtx.currentTime;
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    g.linearRampToValueAtTime(Math.max(0, target), now + duration);
  }

  /**
   * A single soft singing-bowl-like tone marking a slide change \u2014 one
   * fundamental plus a quiet, gently inharmonic partial for warmth, heard
   * mostly through the reverb so it feels distant rather than a "beep".
   * The note wanders across the same pentatonic scale as the pad, keyed
   * to the exhibition's position, so it varies but never clashes.
   */
  function dioramaPlayChime(sequenceIndex) {
    if (!dioramaSoundEnabled || !dioramaAudioNodes || !dioramaAudioCtx) return;
    var ctx = dioramaAudioCtx;
    var nodes = dioramaAudioNodes;
    var now = ctx.currentTime;
    var idx = 4 + ((Number(sequenceIndex) || 0) % 6);
    var fundamental = DIORAMA_SCALE[Math.min(idx, DIORAMA_SCALE.length - 1)];
    var partials = [{ mult: 1, level: 0.05 }, { mult: 2.756, level: 0.014 }];

    partials.forEach(function (partial) {
      var osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = fundamental * partial.mult;
      var g = ctx.createGain();
      g.gain.value = 0;
      osc.connect(g);
      g.connect(nodes.reverbSend);
      g.connect(nodes.master);
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(partial.level, now + 0.09);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 5.5);
      osc.start(now);
      osc.stop(now + 5.6);
    });
  }

  function dioramaSetSoundIcon(enabled) {
    var btn = document.getElementById('diorama-sound-toggle');
    if (!btn) return;
    var onIcon = btn.querySelector('[data-role="sound-on-icon"]');
    var offIcon = btn.querySelector('[data-role="sound-off-icon"]');
    if (onIcon) onIcon.classList.toggle('hidden', !enabled);
    if (offIcon) offIcon.classList.toggle('hidden', enabled);
    btn.setAttribute('aria-pressed', String(enabled));
    btn.setAttribute('aria-label', enabled ? 'Mute ambient sound' : 'Enable ambient sound');
  }

  function dioramaToggleSound() {
    dioramaSoundEnabled = !dioramaSoundEnabled;
    dioramaSetSoundIcon(dioramaSoundEnabled);
    if (dioramaSoundEnabled) {
      dioramaStartAmbient();
      if (dioramaPlaying) dioramaFadeAmbientTo(DIORAMA_AMBIENT_LEVEL, 1.6);
    } else {
      dioramaFadeAmbientTo(0, 1.0);
    }
  }


  /** Artworks in chronological order (earliest first), stable for same-year ties. */
  function dioramaSequence() {
    if (dioramaSequenceCache) return dioramaSequenceCache;
    dioramaSequenceCache = ARTWORKS
      .map(function (a, i) { return { a: a, i: i }; })
      .sort(function (x, y) { return (x.a.year - y.a.year) || (x.i - y.i); })
      .map(function (o) { return o.a; });
    return dioramaSequenceCache;
  }

  /** Truncate text to a short excerpt at a word boundary. */
  function excerpt(text, maxLen) {
    var s = String(text || '');
    if (s.length <= maxLen) return s;
    var cut = s.slice(0, maxLen);
    var lastSpace = cut.lastIndexOf(' ');
    if (lastSpace > 0) cut = cut.slice(0, lastSpace);
    return cut + '\u2026';
  }

  function dioramaCaptionHTML(a, index, total) {
    var artist = artistBySlug(a.artist);
    return '<p class="room">Room ' + (index + 1) + ' of ' + total + '</p>' +
      '<p class="year">' + escapeHTML(a.year) + '</p>' +
      '<h3>' + escapeHTML(a.title) + '</h3>' +
      '<p class="meta">' + escapeHTML(artist ? artist.name : '') + ' \u00b7 ' + escapeHTML(a.medium) + ' \u00b7 ' + escapeHTML(a.dimensions) + '</p>' +
      '<p class="excerpt">' + escapeHTML(excerpt(a.description, 150)) + '</p>' +
      '<a href="#" class="view-link" data-artwork="' + escapeAttr(a.slug) + '">View full details \u2192</a>';
  }

  function dioramaSetToggleIcon(isPlaying) {
    var toggle = document.getElementById('diorama-toggle');
    if (!toggle) return;
    var playIcon = toggle.querySelector('[data-role="play-icon"]');
    var pauseIcon = toggle.querySelector('[data-role="pause-icon"]');
    if (playIcon) playIcon.classList.toggle('hidden', isPlaying);
    if (pauseIcon) pauseIcon.classList.toggle('hidden', !isPlaying);
    toggle.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
  }

  /** Pause (or resume) the CSS-driven Ken Burns pan and progress-fill animations. */
  function dioramaSetAnimationPauseState(paused) {
    var activeImg = document.querySelector('.diorama-stage-img.is-active');
    if (activeImg) activeImg.classList.toggle('is-paused', paused);
    var curSeg = document.querySelector('.diorama-progress-seg.is-current');
    if (curSeg) curSeg.classList.toggle('is-paused', paused);
  }

  /**
   * Update the DOM to display a given slide index. Playback state
   * (timers, playing flag) is left untouched here so this can be
   * reused by both manual navigation and autoplay advance.
   */
  function dioramaShowSlide(index, resetTiming) {
    var seq = dioramaSequence();
    if (index < 0) index = seq.length - 1;
    if (index >= seq.length) index = 0;
    dioramaIndex = index;

    var imgs = document.querySelectorAll('.diorama-stage-img');
    for (var i = 0; i < imgs.length; i++) {
      var idx = parseInt(imgs[i].getAttribute('data-index'), 10);
      var isActive = idx === index;
      imgs[i].classList.toggle('is-active', isActive);
      imgs[i].classList.remove('is-paused');
      if (isActive && resetTiming) {
        imgs[i].style.animation = 'none';
        void imgs[i].offsetWidth;
        imgs[i].style.animation = '';
      }
    }

    var segs = document.querySelectorAll('#diorama-progress .diorama-progress-seg');
    for (var s = 0; s < segs.length; s++) {
      var segIdx = parseInt(segs[s].getAttribute('data-index'), 10);
      var fill = segs[s].querySelector('.fill');
      segs[s].classList.remove('is-complete', 'is-current', 'is-paused');
      if (segIdx < index) {
        fill.style.animation = 'none';
        segs[s].classList.add('is-complete');
      } else if (segIdx === index) {
        segs[s].classList.add('is-current');
        if (resetTiming) {
          fill.style.animation = 'none';
          void fill.offsetWidth;
          fill.style.animation = '';
        }
      } else {
        fill.style.animation = 'none';
      }
    }

    document.getElementById('diorama-caption').innerHTML = dioramaCaptionHTML(seq[index], index, seq.length);
    var counterEl = document.getElementById('diorama-counter');
    if (counterEl) counterEl.textContent = (index + 1) + ' / ' + seq.length;

    if (resetTiming) dioramaRemaining = DIORAMA_DURATION;
    if (resetTiming && dioramaBuilt) dioramaPlayChime(index);
  }

  /** Navigate to a specific slide (prev / next / progress-bar click). Always restarts that slide's timing. */
  function dioramaGoTo(index) {
    clearTimeout(dioramaTimer);
    dioramaShowSlide(index, true);
    dioramaSetAnimationPauseState(!dioramaPlaying);
    if (dioramaPlaying) dioramaArm();
  }

  /** Arm the autoplay timer for the current remaining duration on this slide. */
  function dioramaArm() {
    clearTimeout(dioramaTimer);
    dioramaSlideStart = Date.now();
    dioramaTimer = setTimeout(function () {
      dioramaShowSlide(dioramaIndex + 1, true);
      dioramaArm();
    }, dioramaRemaining);
  }

  function dioramaPlay() {
    if (!dioramaBuilt) return;
    dioramaPlaying = true;
    document.getElementById('diorama-player').classList.add('is-playing');
    dioramaSetToggleIcon(true);
    dioramaSetAnimationPauseState(false);
    dioramaArm();
    if (dioramaSoundEnabled) {
      dioramaStartAmbient();
      dioramaFadeAmbientTo(DIORAMA_AMBIENT_LEVEL, 2.2);
    }
  }

  function dioramaPause() {
    if (!dioramaPlaying) return;
    dioramaPlaying = false;
    var elapsed = Date.now() - dioramaSlideStart;
    dioramaRemaining = Math.max(300, dioramaRemaining - elapsed);
    clearTimeout(dioramaTimer);
    document.getElementById('diorama-player').classList.remove('is-playing');
    dioramaSetToggleIcon(false);
    dioramaSetAnimationPauseState(true);
    dioramaFadeAmbientTo(0, 1.4);
  }

  function dioramaTogglePlay() {
    if (dioramaPlaying) dioramaPause(); else dioramaPlay();
  }

  /**
   * Build the diorama player DOM once: progress segments and stage
   * images for every artwork, plus all listeners. The underlying
   * data never changes, so rebuilding on repeat visits is unnecessary
   * \u2014 revisiting the view just resumes from wherever playback was left.
   */
  function buildDioramaPlayer() {
    var seq = dioramaSequence();

    var progressHTML = seq.map(function (a, i) {
      return '<button type="button" class="diorama-progress-seg" data-index="' + i + '" role="tab" aria-label="' +
        escapeAttr('Jump to ' + a.title + ', ' + a.year) + '"><span class="fill"></span></button>';
    }).join('');
    document.getElementById('diorama-progress').innerHTML = progressHTML;

    var imagesHTML = seq.map(function (a, i) {
      return '<img class="diorama-stage-img" data-index="' + i + '" src="' + escapeAttr(artworkImage(a)) +
        '" alt="' + escapeAttr(a.title + ', ' + a.year) + '" referrerpolicy="no-referrer" loading="' + (i === 0 ? 'eager' : 'lazy') + '" />';
    }).join('');
    document.getElementById('diorama-stage-images').innerHTML = imagesHTML;

    var playerEl = document.getElementById('diorama-player');
    playerEl.style.setProperty('--slide-duration', (DIORAMA_DURATION / 1000) + 's');

    var segs = document.querySelectorAll('#diorama-progress .diorama-progress-seg');
    for (var s = 0; s < segs.length; s++) {
      segs[s].addEventListener('click', function () {
        var idx = parseInt(this.getAttribute('data-index'), 10);
        if (!isNaN(idx)) dioramaGoTo(idx);
      });
    }

    document.getElementById('diorama-prev').addEventListener('click', function () { dioramaGoTo(dioramaIndex - 1); });
    document.getElementById('diorama-next').addEventListener('click', function () { dioramaGoTo(dioramaIndex + 1); });
    document.getElementById('diorama-toggle').addEventListener('click', dioramaTogglePlay);
    document.getElementById('diorama-poster-btn').addEventListener('click', dioramaPlay);
    document.getElementById('diorama-sound-toggle').addEventListener('click', dioramaToggleSound);
    dioramaSetSoundIcon(dioramaSoundEnabled);

    // Delegated click for the "View full details" link inside the caption.
    // Caption HTML is replaced on every slide change, so binding on the
    // persistent parent avoids re-attaching (and leaking) a listener per slide.
    document.getElementById('diorama-caption').addEventListener('click', function (e) {
      var linkEl = e.target.closest('[data-artwork]');
      if (!linkEl) return;
      e.preventDefault();
      var slug = safeSlug(linkEl.getAttribute('data-artwork'));
      if (!slug) return;
      dioramaPause();
      renderArtwork(slug);
      showView('artwork');
    });

    // Keyboard transport, scoped to only fire while the diorama view is active
    document.addEventListener('keydown', function (e) {
      var view = document.querySelector('[data-view-target="diorama"]');
      if (!view || !view.classList.contains('is-active')) return;
      var tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.code === 'Space') { e.preventDefault(); dioramaTogglePlay(); }
      else if (e.code === 'ArrowRight') { dioramaGoTo(dioramaIndex + 1); }
      else if (e.code === 'ArrowLeft') { dioramaGoTo(dioramaIndex - 1); }
      else if (e.code === 'KeyM') { dioramaToggleSound(); }
    });

    dioramaShowSlide(0, true);
    dioramaSetAnimationPauseState(true); // start paused on the poster frame
    dioramaBuilt = true;
  }

  function ensureDioramaBuilt() {
    if (!dioramaBuilt) buildDioramaPlayer();
  }

  function renderArtist(slug) {
    var a = artistBySlug(slug);
    if (!a) return;
    var works = worksByArtist(slug);
    var bioHtml = a.bio.map(function (p, i) {
      var style = i === 0 ? 'font-family:var(--font-display); font-size:1.5rem; line-height:1.5; color:var(--umber-800);' : '';
      return '<p style="' + style + '">' + escapeHTML(p) + '</p>';
    }).join('');
    var firstName = escapeHTML(a.name.split(' ')[0]);

    var html = '<header class="container grid lg:grid-cols-12 gap-12 lg:gap-20 items-end">' +
      '<div class="lg:col-span-7">' +
        '<p class="eyebrow mb-6">' + escapeHTML(a.movement) + ' \u00b7 b. ' + escapeHTML(a.bornPlace) + '</p>' +
        '<h1 class="font-display text-5xl md:text-7xl lg:text-8xl leading-tight" style="color:var(--umber-800); letter-spacing:-0.025em; line-height:0.95;">' + escapeHTML(a.name) + '</h1>' +
        '<p class="mt-8 text-lg leading-relaxed" style="color:var(--umber-600); max-width:36rem;">' + escapeHTML(a.shortBio) + '</p>' +
      '</div>' +
      '<figure class="lg:col-span-5">' +
        '<div class="art-frame aspect-3-4">' +
          '<img src="' + escapeAttr(artistImage(a)) + '" alt="' + escapeAttr('Portrait of ' + a.name) + '" referrerpolicy="no-referrer" />' +
        '</div>' +
        '<figcaption class="mt-3 text-xs italic text-right" style="color:var(--umber-500);">' + escapeHTML(a.name) + ', portrait</figcaption>' +
      '</figure>' +
    '</header>' +
    '<section class="container mt-24 space-y-8 text-lg leading-relaxed" style="max-width:48rem; color:var(--umber-700);">' + bioHtml + '</section>' +
    '<section class="container mt-32">' +
      '<div class="flex items-end justify-between mb-12">' +
        '<div>' +
          '<p class="eyebrow mb-3">Selected works</p>' +
          '<h2 class="font-display text-4xl md:text-5xl" style="color:var(--umber-800);">In the studio of ' + firstName + '</h2>' +
        '</div>' +
        '<p class="text-xs tracking-widest uppercase md:block" style="color:var(--umber-500); display:none;">' + works.length + ' ' + (works.length === 1 ? 'work' : 'works') + '</p>' +
      '</div>' +
      '<div class="hairline mb-14"></div>';

    if (works.length) {
      html += '<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8" style="row-gap:4rem;">' +
        works.map(function (w, i) { return cardArtwork(w, i < 3); }).join('') +
      '</div>';
    } else {
      html += '<p class="italic" style="color:var(--umber-500);">Works for this painter are being prepared for the archive.</p>';
    }
    html += '</section>';

    document.getElementById('artist-profile').innerHTML = html;
    attachCardLinks();
  }

  function metaRow(label, value) {
    return '<div><dt class="eyebrow">' + escapeHTML(label) + '</dt><dd>' + escapeHTML(value) + '</dd></div>';
  }

  function renderArtwork(slug) {
    var a = artworkBySlug(slug);
    if (!a) return;
    var artist = artistBySlug(a.artist);
    var siblings = worksByArtist(a.artist).filter(function (x) { return x.slug !== slug; }).slice(0, 3);

    var html = '<div class="container artwork-detail-grid">' +
      '<figure class="lg:col-span-8">' +
        '<div class="artwork-image-wrap">' +
          '<img src="' + escapeAttr(artworkImage(a)) + '" alt="' + escapeAttr(a.title + ', ' + a.year) + '" referrerpolicy="no-referrer" />' +
        '</div>' +
      '</figure>' +
      '<div class="lg:col-span-4 lg:sticky lg:top-32 artwork-meta">' +
        '<p class="eyebrow">' + escapeHTML(artist ? artist.name : '') + ' \u00b7 ' + escapeHTML(a.year) + '</p>' +
        '<h1 class="font-display text-4xl md:text-5xl lg:text-6xl italic mt-3" style="color:var(--umber-800); line-height:1.05;">' + escapeHTML(a.title) + '</h1>' +
        '<dl class="mt-10 text-sm">' +
          metaRow('Painter', artist ? artist.name : a.artist) +
          metaRow('Year', String(a.year)) +
          metaRow('Medium', a.medium) +
          metaRow('Dimensions', a.dimensions) +
        '</dl>' +
        '<div class="hairline my-10"></div>' +
        '<p class="leading-relaxed" style="color:var(--umber-700);">' + escapeHTML(a.description) + '</p>' +
        '<a href="#" data-artist="' + escapeAttr(a.artist) + '" class="mt-10 btn-link" style="color:var(--ochre-600);">About ' + escapeHTML(artist ? artist.name : '') + ' \u2192</a>' +
      '</div>' +
    '</div>';

    if (siblings.length) {
      html += '<section class="container mt-40">' +
        '<p class="eyebrow mb-4">Also by ' + escapeHTML(artist ? artist.name : '') + '</p>' +
        '<div class="hairline mb-12"></div>' +
        '<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8" style="row-gap:4rem;">' +
          siblings.map(function (s) { return cardArtwork(s); }).join('') +
        '</div>' +
      '</section>';
    }

    document.getElementById('artwork-detail').innerHTML = html;
    attachCardLinks();
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

  // ─── ROUTING (allowlist) ────────────────────────────────────

  var VALID_VIEWS = ['home', 'biography', 'gallery', 'diorama', 'family', 'artist', 'artwork', 'contact'];

  function showView(name) {
    if (VALID_VIEWS.indexOf(name) === -1) return;
    var previouslyActive = document.querySelector('.view.is-active');
    var leavingDiorama = previouslyActive && previouslyActive.getAttribute('data-view-target') === 'diorama' && name !== 'diorama';
    if (leavingDiorama) dioramaPause();

    var views = document.querySelectorAll('.view');
    for (var i = 0; i < views.length; i++) views[i].classList.remove('is-active');
    var target = document.querySelector('[data-view-target="' + name + '"]');
    if (target) {
      target.classList.add('is-active');
      target.style.animation = 'none';
      void target.offsetWidth;
      target.style.animation = '';
    }
    var navLinks = document.querySelectorAll('.nav-link');
    for (var k = 0; k < navLinks.length; k++) {
      navLinks[k].classList.toggle('is-active', navLinks[k].getAttribute('data-view') === name);
    }
    document.getElementById('mobile-menu').classList.remove('is-open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (name === 'gallery') renderGallery();
    if (name === 'diorama') ensureDioramaBuilt();
    if (name === 'family')  renderFamily();
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-view]');
    if (a) {
      e.preventDefault();
      showView(a.getAttribute('data-view'));
    }
  });

  // ─── CONTACT WIRING & VALIDATION ─────────────────────────────

  function wireContact() {
    var phone = CONFIG.phone;
    var email = CONFIG.email;
    var safeWhatsapp = /^\d{10,15}$/.test(CONFIG.whatsapp) ? CONFIG.whatsapp : '';

    document.getElementById('row-wa').href = safeWhatsapp ? 'https://wa.me/' + safeWhatsapp : '#';
    document.getElementById('row-phone').href = 'tel:' + encodeURIComponent(phone);
    document.getElementById('row-email').href = 'mailto:' + encodeURIComponent(email) + '?subject=' + encodeURIComponent('Inquiry — Rustamadji Gallery');
    document.getElementById('phone-val').textContent = phone;
    document.getElementById('email-val').textContent = email;

    var fp = document.getElementById('footer-phone');
    fp.href = 'tel:' + encodeURIComponent(phone);
    fp.textContent = phone;
    var fe = document.getElementById('footer-email');
    fe.href = 'mailto:' + encodeURIComponent(email);
    fe.textContent = email;

    document.getElementById('cw-wa').href = safeWhatsapp ? 'https://wa.me/' + safeWhatsapp : '#';
    document.getElementById('cw-phone').href = 'tel:' + encodeURIComponent(phone);
    document.getElementById('cw-phone-val').textContent = phone;
    document.getElementById('cw-email').href = 'mailto:' + encodeURIComponent(email) + '?subject=' + encodeURIComponent('Inquiry — Rustamadji Gallery');
    document.getElementById('cw-email-val').textContent = email;
  }

  document.getElementById('chat-toggle').addEventListener('click', function () {
    document.getElementById('chat-panel').classList.toggle('is-open');
  });

  document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();
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
    var menu = document.getElementById('mobile-menu');
    menu.classList.toggle('is-open');
    this.setAttribute('aria-expanded', menu.classList.contains('is-open'));
  });

  window.addEventListener('scroll', function () {
    var nav = document.getElementById('nav');
    if (window.scrollY > 12) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }, { passive: true });

  // Pause the diorama when the tab is hidden (saves CPU/battery, avoids
  // a huge stale timeout firing all at once when the tab regains focus)
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && dioramaPlaying) dioramaPause();
  });

  // ─── BOOT ────────────────────────────────────────────────────

  document.getElementById('year').textContent = new Date().getFullYear();
  wireContact();
  renderHome();
  attachCardLinks();
})();
