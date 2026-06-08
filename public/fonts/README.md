Place the font files you want to self-host in this folder and commit them to the repo (WOFF2 recommended).

Suggested filenames used by the project (update `src/app/globals.css` if you choose different names):

- Inter-Regular.woff2
- Inter-Variable.woff2 (optional)
- SpaceGrotesk-Regular.woff2
- SpaceGrotesk-700.woff2 (optional)

How to obtain fonts:

- Download from Google Fonts and build WOFF2 using a font conversion tool, or
- Use the font vendor's web license to generate woff2 files.

Notes:

- WOFF2 offers the best compression and is widely supported.
- If you can't add font files to the repo, host them on your own CDN and update `src/app/globals.css` to point to that URL.
