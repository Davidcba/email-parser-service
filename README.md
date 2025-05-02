# Email JSON Extractor (NestJS)

This is a backend NestJS service that reads `.eml` email files and tries its best to extract some JSON from them — wherever that JSON may be hiding.

We're talking:

- A JSON file attached directly
- A JSON link inside the email body
- A link that goes to a webpage, which contains a link to the actual JSON

If any of those hit — boom — it returns the parsed JSON.

---

## How to Use It

Run the app locally:

```bash
npm install
npm run start
```

Then hit it with one of these:

---

### 1. JSON as Attachment

```bash
curl "http://localhost:3000/email/parse?path=test-emails/sample.eml"
```

`sample.eml` must have a `.json` file attached (like `data.json`).

---

### 2. JSON Link in Body

```bash
curl "http://localhost:3000/email/parse?path=test-emails/link-in-body.eml"
```

The email body should include something like:

```
https://jsonplaceholder.typicode.com/users/1
```

---

### 3. HTML Page → JSON Link

```bash
curl "http://localhost:3000/email/parse?path=test-emails/indirect-link.eml"
```

The email body should contain a link to a webpage:

```
https://your-glitch-site.glitch.me/
```

...and that page must have:

```html
<a href="https://jsonplaceholder.typicode.com/users/1">Get JSON</a>
```

---

## Folder Structure

```
test-emails/
├── sample.eml             # JSON attachment
├── link-in-body.eml       # Direct JSON link in body
└── indirect-link.eml      # Link → HTML → JSON
```

---

## How to Run Tests

Run all unit and e2e tests:

```bash
npm run test
```

To see coverage report:

```bash
npm run test -- --coverage
```

Coverage results will be printed in terminal and written to `/coverage/index.html` for full visual.

---

## Gotchas

- Must be a valid `.eml` format (use correct MIME parts)
- Glitch page must render plain `<a href="...">` tags — no JS
- JSON must be valid (obviously)

---

## Status

All 3 cases tested and working. Just drop your `.eml` in `test-emails/`, tweak, and go.
There are 3 files to test it, just check the URLS to see if they are still valid.