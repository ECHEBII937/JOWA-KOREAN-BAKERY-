# Jowa Korean Food & Bakery: Website

A static, single-page website for Jowa, a Korean bakery and food court at Kapsoya Business Park, Eldoret. No build step, no frameworks, no backend.

## Quick start

1. Unzip the folder.
2. Double-click `index.html` to open it in a browser.

To publish it, upload the whole folder to any static host (Netlify, GitHub Pages, cPanel `public_html`, etc.). Keep the folder structure as it is.

## Folder structure

```
jowa-website/
├── index.html        All page content and sections
├── README.md         This file
├── css/
│   └── style.css     All styling, colours and responsive rules
├── js/
│   └── main.js       Sprinkles animation, nav, menu tabs, lightbox, form
└── images/           Logo and food photos
```

## Page sections

| Section | Anchor | Notes |
|---|---|---|
| Hero | `#top` | Falling sprinkles; click the logo for a sprinkle burst |
| About | (below the scrolling strip) | Story and the reservation note |
| Menu | `#menu` | Filter tabs: All / Bakery / Korean meals / Drinks |
| Saturday chicken | `#saturday` | Poster banner and order button |
| Gallery | `#gallery` | Click a photo to enlarge; Esc or click to close |
| Reserve | `#reserve` | Form that opens WhatsApp |
| Contact | `#contact` | Maps, phone, Instagram |

## Common edits

**Change the WhatsApp / phone number**
- `js/main.js`: edit `var WHATSAPP = '254743277790';` (country code, no `+` or leading 0).
- `index.html`: search for `0743 277 790` and `tel:+254743277790`.

**Add or edit a menu item**
In `index.html`, copy an `<article class="card" ...>` block inside `#grid`. Set `data-c` to `bakery`, `korean` or `drinks`, change the image, title and text, and set `data-item` on the button. To make the item selectable in the form, add a matching `<option>` in the `#item` select. The `data-item` text must match the option text exactly.

**Add prices**
Add a line such as `<p class="price">KES 150</p>` inside a card's text block, then style `.price` in `css/style.css`.

**Replace a photo**
Drop a new image into `images/` with the same file name, or update the `src` in `index.html`. Keep photos under about 1000 px wide so the page loads fast on mobile data.

**Change brand colours**
Edit the variables at the top of `css/style.css`:

```
--pink:#EE2579;  --choc:#4A1C0F;  --sun:#FBBF14;  --cream:#FFF7EE;  --sky:#5BC8F5;  --lime:#8DC63F;
```

**Change opening hours / add a section**
Add a new `<div>` inside the `.cards` block in the `#contact` section. No opening hours are included yet because none were provided.

## How the reservation form works

There is no server. When the customer submits, the form checks the fields, then opens WhatsApp with the order already written out. The customer must tap Send. If you want orders emailed or saved to a sheet instead, connect the form to a service such as Formspree, Google Apps Script or EmailJS and replace the `submit` handler in `js/main.js`.

## Notes

- Fonts (Bagel Fat One, Gowun Dodum) load from Google Fonts. Offline, the site falls back to system fonts.
- Animations stop automatically for visitors who have "reduce motion" turned on.
- Works on current Chrome, Edge, Firefox and Safari, on desktop and mobile.

## Contact details used on the site

- Address: Kapsoya Business Park, Eldoret, Kenya
- Phone / reservations: 0743 277 790 (kimchi and kimbap need a reservation)
- Instagram: https://www.instagram.com/_jowaa_/
