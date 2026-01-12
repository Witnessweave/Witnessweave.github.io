#!/usr/bin/env python3
"""
LIFEQUEST SERVER — HTTP Server for LifeQuest Dashboard
LEDGER_ID: WV-LIFEQUEST-SERVER-2026
VERSE: "Run in such a way that you may obtain the prize." — 1 Corinthians 9:24

Simple HTTP server with API endpoints for the LifeQuest HTML dashboard.
"""

import json
import os
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from pathlib import Path

# Import LifeQuest core functions
from lifequest import log_event, get_progress, load_data

LIFEQUEST_DIR = Path(__file__).parent
PORT = 8080


class LifeQuestHandler(SimpleHTTPRequestHandler):
    """Custom handler for LifeQuest API endpoints and static files."""

    def __init__(self, *args, **kwargs):
        # Set the directory to serve files from
        super().__init__(*args, directory=str(LIFEQUEST_DIR), **kwargs)

    def do_GET(self):
        """Handle GET requests."""
        parsed = urlparse(self.path)

        if parsed.path == '/api/progress':
            self.send_json_response(get_progress())
        elif parsed.path == '/api/data':
            self.send_json_response(load_data())
        elif parsed.path == '/' or parsed.path == '':
            # Serve index.html for root
            self.path = '/index.html'
            super().do_GET()
        else:
            # Serve static files
            super().do_GET()

    def do_POST(self):
        """Handle POST requests."""
        parsed = urlparse(self.path)

        if parsed.path == '/api/log':
            # Read request body
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)

            try:
                data = json.loads(body.decode('utf-8'))
                description = data.get('description', '')
                category = data.get('category', 'faith')
                points = int(data.get('points', 10))
                tags = data.get('tags', [])

                if not description:
                    self.send_json_response({'error': 'Description required'}, status=400)
                    return

                result = log_event(description, category, points, tags)
                self.send_json_response(result)

            except json.JSONDecodeError:
                self.send_json_response({'error': 'Invalid JSON'}, status=400)
            except Exception as e:
                self.send_json_response({'error': str(e)}, status=500)
        else:
            self.send_json_response({'error': 'Not found'}, status=404)

    def send_json_response(self, data, status=200):
        """Send a JSON response."""
        response = json.dumps(data, indent=2)
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', len(response))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(response.encode('utf-8'))

    def do_OPTIONS(self):
        """Handle CORS preflight requests."""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def log_message(self, format, *args):
        """Custom log format."""
        print(f"[LifeQuest] {args[0]}")


def main():
    """Start the LifeQuest server."""
    print()
    print("=" * 60)
    print("  LIFEQUEST SERVER — Gospel-Aligned Life Gamification")
    print("=" * 60)
    print()
    print(f"  Starting server on http://localhost:{PORT}")
    print()
    print("  API Endpoints:")
    print("    GET  /api/progress  — Get current progress")
    print("    GET  /api/data      — Get raw data")
    print("    POST /api/log       — Log a new quest")
    print()
    print("  Press Ctrl+C to stop the server")
    print()
    print("  JESUS IS LORD")
    print("=" * 60)
    print()

    server = HTTPServer(('', PORT), LifeQuestHandler)

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n\n  Server stopped. Glory to God!")
        server.shutdown()


if __name__ == "__main__":
    main()
