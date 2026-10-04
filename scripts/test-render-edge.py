#!/usr/bin/env python3
"""Regression checks for public read routing and cache isolation in render-edge."""
from pathlib import Path
import runpy
import unittest


render = runpy.run_path(str(Path(__file__).with_name("render-edge.py")))["render"]


class EdgeRendererTests(unittest.TestCase):
    def setUp(self):
        self.config = render(["10.0.0.11", "10.0.0.12"], ["10.0.0.21", "10.0.0.22"])

    def test_only_public_read_endpoints_are_accelerated(self):
        self.assertIn("/api/backend/(?:jurusan|news|teachers|prestasi|bkk/jobs|bkk/partners|ekskul|fasilitas|documents|dtp|alumni|trial-class/event)$", self.config)
        self.assertIn("if ($request_method = GET) { return 418; }", self.config)
        self.assertIn("proxy_pass http://api_release;", self.config)
        self.assertIn("proxy_pass http://web_release;", self.config)
        self.assertNotIn("api/backend/admin", self.config)

    def test_public_pages_are_short_lived_and_personalized_requests_bypass(self):
        self.assertIn("proxy_cache_valid 200 15s;", self.config)
        self.assertIn("proxy_cache_bypass $http_cookie $http_authorization $http_rsc $http_next_router_prefetch;", self.config)
        self.assertIn("proxy_no_cache $http_cookie $http_authorization $http_rsc $http_next_router_prefetch $upstream_http_set_cookie;", self.config)
        self.assertIn('s-maxage=15, stale-while-revalidate=30', self.config)

    def test_upstream_addresses_are_validated(self):
        with self.assertRaises(ValueError):
            render(["attacker.example"], ["10.0.0.21"])


if __name__ == "__main__":
    unittest.main()
