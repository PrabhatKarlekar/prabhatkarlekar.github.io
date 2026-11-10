# Prabhat Vilas Karlekar — Portfolio

Personal engineering portfolio and research showcase hosted via GitHub Pages at [prabhatkarlekar.github.io](https://prabhatkarlekar.github.io/).

## Focus Areas
- **High-Performance Computing & Distributed Systems** (C-DAC Pune)
- **Applied Cryptography & Privacy-Preserving AI** (OpenFHE Multi-Key CKKS, Federated Learning, Merkle Commitments)
- **Network Protocol Engineering & Simulation** (ns-3, Rust/Axum, Yew/WebAssembly, Ed25519)

## Architecture Highlights
- **Zero External JS/Icon Dependencies**: Pure vanilla JavaScript, semantic HTML5, custom CSS design tokens, and an inline SVG sprite (`0` icon CDN calls).
- **Accessibility & Progressive Enhancement**: WCAG 2.1 AA light/dark contrast, full visibility without JavaScript, keyboard navigation with skip links, and `prefers-reduced-motion` support.
- **Security Hardening**: Strict Content Security Policy (`script-src` hash pinning, zero `unsafe-inline`), `rel="noopener noreferrer"` on outbound links, and SHA-pinned GitHub Actions deployment workflow.

## Local Preview
Serve the static `docs/` directory using any local HTTP server:

```bash
python3 -m http.server 8000 --directory docs
```

Then open `http://localhost:8000/` in your browser.

