#!/usr/bin/env python3
"""
Hardened Backend API Test Suite for G.M.B Travels Kashmir
- Uses argparse & env vars (no hardcoded secrets)
- Retries & timeouts for robustness
- Optional destructive tests (create/update/delete) are off by default
- Emits machine-readable JSON summary for CI
"""

import os
import sys
import json
import argparse
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

DEFAULT_BASE_URL = os.getenv("GMB_BASE_URL", "http://localhost:8000/api")
DEFAULT_ADMIN_USERNAME = os.getenv("GMB_ADMIN_USERNAME", "")
DEFAULT_ADMIN_PASSWORD = os.getenv("GMB_ADMIN_PASSWORD", "")
DEFAULT_TIMEOUT = float(os.getenv("GMB_HTTP_TIMEOUT", "15"))
DEFAULT_RETRIES = int(os.getenv("GMB_HTTP_RETRIES", "3"))

class APITester:
    def __init__(self, base_url: str, username: str, password: str, timeout: float, retries: int, destructive: bool):
        self.base_url = base_url.rstrip("/")
        self.username = username
        self.password = password
        self.timeout = timeout
        self.destructive = destructive
        self.session = requests.Session()
        retry_strategy = Retry(
            total=retries,
            backoff_factor=0.5,
            status_forcelist=[429, 500, 502, 503, 504],
            allowed_methods=["GET", "POST", "PUT", "DELETE", "PATCH"]
        )
        adapter = HTTPAdapter(max_retries=retry_strategy)
        self.session.mount("http://", adapter)
        self.session.mount("https://", adapter)
        self.results: List[Dict[str, Any]] = []
        self.admin_token: Optional[str] = None
        self.created_vehicle_id: Optional[str] = None

    def log(self, name: str, ok: bool, msg: str, extra: Optional[Dict[str, Any]] = None) -> bool:
        entry = {
            "test": name,
            "success": ok,
            "message": msg,
            "timestamp": datetime.utcnow().isoformat() + "Z",
        }
        if extra is not None:
            entry["extra"] = extra
        self.results.append(entry)
        status = "✅ PASS" if ok else "❌ FAIL"
        print(f"{status} {name}: {msg}")
        return ok

    # ---------- helpers ----------
    def _get(self, path: str, **kwargs):
        return self.session.get(f"{self.base_url}{path}", timeout=self.timeout, **kwargs)

    def _post(self, path: str, **kwargs):
        return self.session.post(f"{self.base_url}{path}", timeout=self.timeout, **kwargs)

    def _put(self, path: str, **kwargs):
        return self.session.put(f"{self.base_url}{path}", timeout=self.timeout, **kwargs)

    def _delete(self, path: str, **kwargs):
        return self.session.delete(f"{self.base_url}{path}", timeout=self.timeout, **kwargs)

    # ---------- tests ----------
    def test_health(self) -> bool:
        # Optional health check if the backend exposes it
        try:
            r = self._get("/health")
            if r.status_code == 200:
                return self.log("Health", True, "Health endpoint responded 200")
            else:
                return self.log("Health", False, f"Unexpected status {r.status_code}")
        except Exception as e:
            return self.log("Health", False, f"Exception: {e}")

    def test_admin_login(self) -> bool:
        try:
            r = self._post("/auth/login", json={"username": self.username, "password": self.password})
            if r.status_code != 200:
                return self.log("Admin Login", False, f"HTTP {r.status_code}: {r.text[:300]}")
            data = r.json()
            token = data.get("access_token") or data.get("token")
            if not token:
                return self.log("Admin Login", False, "No access_token in response", data)
            self.admin_token = token
            self.session.headers.update({"Authorization": f"Bearer {token}"})
            return self.log("Admin Login", True, "Authenticated as admin")
        except Exception as e:
            return self.log("Admin Login", False, f"Exception: {e}")

    def test_public_vehicles(self) -> bool:
        try:
            r = self._get("/vehicles")
            if r.status_code != 200:
                return self.log("Vehicles (Public)", False, f"HTTP {r.status_code}: {r.text[:300]}")
            data = r.json()
            ok = isinstance(data, dict) and data.get("status") == "success" and isinstance(data.get("data"), list)
            count = len(data.get("data", [])) if ok else 0
            return self.log("Vehicles (Public)", ok, f"Retrieved {count} vehicles", {"count": count})
        except Exception as e:
            return self.log("Vehicles (Public)", False, f"Exception: {e}")

    def test_admin_vehicles_get(self) -> bool:
        if not self.admin_token:
            return self.log("Vehicles (Admin GET)", False, "Missing admin token")
        try:
            r = self._get("/admin/vehicles")
            if r.status_code != 200:
                return self.log("Vehicles (Admin GET)", False, f"HTTP {r.status_code}: {r.text[:300]}")
            data = r.json()
            ok = isinstance(data, dict) and data.get("status") == "success" and isinstance(data.get("data"), list)
            return self.log("Vehicles (Admin GET)", ok, "Admin vehicles list fetched")
        except Exception as e:
            return self.log("Vehicles (Admin GET)", False, f"Exception: {e}")

    def test_admin_vehicle_crud(self) -> bool:
        if not self.admin_token:
            return self.log("Vehicles (Admin CRUD)", False, "Missing admin token")

        if not self.destructive:
            return self.log("Vehicles (Admin CRUD)", True, "Skipped (destructive tests disabled)")

        # Create
        try:
            payload = {
                "vehicleType": "sedan_dzire",
                "name": "CI Test Sedan Vehicle",
                "model": "CI Model",
                "capacity": "4 Passengers",
                "price": 12.0,
                "priceUnit": "per km",
                "features": ["AC", "GPS"],
                "specifications": {"fuelType": "petrol", "transmission": "manual"},
                "image": "https://example.com/img.jpg",
                "badge": "CI",
                "badgeColor": "bg-blue-500",
                "isActive": True,
                "isPopular": False,
                "sortOrder": 999,
                "description": "Created by CI tests"
            }
            r = self._post("/admin/vehicles", json=payload)
            if r.status_code != 200:
                return self.log("Vehicles (Create)", False, f"HTTP {r.status_code}: {r.text[:300]}")
            data = r.json()
            self.created_vehicle_id = data.get("data", {}).get("_id") or data.get("data", {}).get("id")
            if not self.created_vehicle_id:
                return self.log("Vehicles (Create)", False, "No id in response", data)
            self.log("Vehicles (Create)", True, f"Created vehicle id={self.created_vehicle_id}")
        except Exception as e:
            return self.log("Vehicles (Create)", False, f"Exception: {e}")

        # Update
        try:
            r = self._put(f"/admin/vehicles/{self.created_vehicle_id}", json={"price": 18.0, "name": "CI Updated"})
            ok = r.status_code == 200 and r.json().get("status") == "success"
            self.log("Vehicles (Update)", ok, f"Update status={r.status_code}")
            if not ok:
                return False
        except Exception as e:
            return self.log("Vehicles (Update)", False, f"Exception: {e}")

        # Delete
        try:
            r = self._delete(f"/admin/vehicles/{self.created_vehicle_id}")
            ok = r.status_code == 200 and r.json().get("status") == "success"
            self.log("Vehicles (Delete)", ok, f"Delete status={r.status_code}")
            return ok
        except Exception as e:
            return self.log("Vehicles (Delete)", False, f"Exception: {e}")

    def test_admin_protection(self) -> bool:
        # Ensure admin routes reject unauthenticated requests
        try:
            s = requests.Session()  # no auth
            r = s.get(f"{self.base_url}/admin/vehicles", timeout=self.timeout)
            if r.status_code in (401, 403):
                return self.log("Admin Protection", True, f"Blocked with {r.status_code}")
            return self.log("Admin Protection", False, f"Unexpected status {r.status_code}")
        except Exception as e:
            return self.log("Admin Protection", False, f"Exception: {e}")

    def run(self) -> bool:
        print("🚀 Running GMB Backend Test Suite (hardened)")
        sequence = [
            self.test_health,               # optional pass/fail
            self.test_admin_login,          # required
            self.test_public_vehicles,      # required
            self.test_admin_vehicles_get,   # required (needs auth)
            self.test_admin_protection,     # required
            self.test_admin_vehicle_crud,   # optional destructive
        ]
        passed = 0
        total = 0
        for test in sequence:
            total += 1
            try:
                if test():
                    passed += 1
            except Exception as e:
                self.log(test.__name__, False, f"Unhandled exception: {e}")
        print(f"\n📊 SUMMARY: {passed}/{total} passed ({(passed/total)*100:.1f}%)")
        return passed == total

def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="GMB Backend Test Suite (hardened)")
    p.add_argument("--base-url", default=DEFAULT_BASE_URL, help="Base API URL (default from GMB_BASE_URL)")
    p.add_argument("--username", default=DEFAULT_ADMIN_USERNAME, help="Admin username (default from GMB_ADMIN_USERNAME)")
    p.add_argument("--password", default=DEFAULT_ADMIN_PASSWORD, help="Admin password (default from GMB_ADMIN_PASSWORD)")
    p.add_argument("--timeout", type=float, default=DEFAULT_TIMEOUT, help="HTTP timeout seconds")
    p.add_argument("--retries", type=int, default=DEFAULT_RETRIES, help="HTTP retry attempts")
    p.add_argument("--destructive", action="store_true", help="Run create/update/delete tests")
    p.add_argument("--json-out", default="gmb_test_results.json", help="Write JSON summary to file")
    return p.parse_args()

def main():
    args = parse_args()
    tester = APITester(
        base_url=args.base_url,
        username=args.username,
        password=args.password,
        timeout=args.timeout,
        retries=args.retries,
        destructive=args.destructive
    )
    ok = tester.run()
    summary = {
        "base_url": args.base_url,
        "destructive": args.destructive,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "results": tester.results
    }
    with open(args.json_out, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)
    print(f"\n📝 Wrote JSON results to {args.json_out}")
    sys.exit(0 if ok else 1)

if __name__ == "__main__":
    main()
