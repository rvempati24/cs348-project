import os
from flask import Flask, send_from_directory

app = Flask(__name__)
OUT_DIR = os.path.join(os.path.dirname(__file__), 'out')


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    # Exact file match (handles _next/static assets, favicon, etc.)
    if path and os.path.isfile(os.path.join(OUT_DIR, path)):
        return send_from_directory(OUT_DIR, path)
    # Directory-style route: visits/ -> out/visits/index.html
    if path and os.path.isfile(os.path.join(OUT_DIR, path, 'index.html')):
        return send_from_directory(os.path.join(OUT_DIR, path), 'index.html')
    # Flat-file route: visits -> out/visits.html
    if path and os.path.isfile(os.path.join(OUT_DIR, path + '.html')):
        return send_from_directory(OUT_DIR, path + '.html')
    # Root
    return send_from_directory(OUT_DIR, 'index.html')


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)
