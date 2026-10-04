#!/usr/bin/env python3
"""Render a reviewed Nginx release pointer; no credentials are read or emitted."""
import argparse
import ipaddress
import re
from pathlib import Path


def render(frontends, backends, previous=None):
    def upstream(name, addresses, port):
        for address in addresses:
            try:
                ipaddress.ip_address(address)
            except ValueError:
                if not re.fullmatch(r"(?:blue|green)-(?:frontend|backend)-[ab]", address):
                    raise ValueError("Only private release aliases or IPs are allowed")
        failures = "max_fails=1 fail_timeout=1s" if name == "web_release" else "max_fails=2 fail_timeout=5s"
        servers = "\n".join(f"  server {address}:{port} {failures}" + (" resolve" if re.fullmatch(r"(?:blue|green)-(?:frontend|backend)-[ab]", address) else "") + ";" for address in addresses)
        return f"upstream {name} {{\n  zone {name} 64k;\n  least_conn;\n{servers}\n  keepalive 32;\n}}\n"
    config = upstream("web_release", frontends, 3000) + upstream("api_release", backends, 8080)
    # Archived content-hashed chunks are the rollback compatibility layer.
    # Never route an old browser to a stopped prior slot; an unarchived asset
    # should be a plain 404 rather than turning the site into a 502.
    fallback = ""
    old_assets = ""
    config += f"""
server {{
  listen 3000;
  location = /edge-health {{ access_log off; return 200 'ready'; }}
  # Static chunks from verified releases are archived in the existing mount.
  # Old browser documents still work after the legacy app is retired.
  location /_next/static/ {{
    alias /etc/nginx/releases/static/;
    add_header Cache-Control "public, max-age=31536000, immutable";
    add_header Strict-Transport-Security "max-age=31536000" always;
    error_page 404 = @current_assets;
  }}
  location @current_assets {{ {fallback} proxy_pass http://web_release; }}
  location / {{ proxy_pass http://web_release; }}
  {old_assets}
}}
server {{
  listen 8080;
  location / {{ proxy_pass http://api_release; }}
}}
"""
    return config


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--frontend", nargs="+", required=True)
    parser.add_argument("--backend", nargs="+", required=True)
    parser.add_argument("--previous", nargs="*")
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    Path(args.output).write_text(render(args.frontend, args.backend, args.previous), encoding="utf-8")
