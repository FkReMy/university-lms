#!/usr/bin/env python3
"""
University LMS - Live Integration Test
=======================================
Tests actual connectivity between running frontend and backend services.
This script requires both services to be running:
- Backend: http://localhost:8000
- Frontend: http://localhost:5173

Run this after starting both services to verify they can communicate.
"""

import asyncio
import json
import sys
from datetime import datetime
from typing import Dict, Any

try:
    import httpx
except ImportError:
    print("Error: httpx is required for live testing")
    print("Install it with: pip install httpx")
    sys.exit(1)


class LiveIntegrationTester:
    # Configuration constants
    DEFAULT_TIMEOUT = 5.0  # seconds
    
    def __init__(self, backend_url: str = "http://localhost:8000", 
                 frontend_url: str = "http://localhost:5173",
                 timeout: float = None):
        self.backend_url = backend_url
        self.frontend_url = frontend_url
        self.timeout = timeout or self.DEFAULT_TIMEOUT
        self.results = {
            "timestamp": datetime.now().isoformat(),
            "backend_url": backend_url,
            "frontend_url": frontend_url,
            "timeout": self.timeout,
            "tests": [],
            "summary": {"passed": 0, "failed": 0}
        }
    
    def print_header(self, text: str):
        """Print section header"""
        print(f"\n{'=' * 80}")
        print(f"{text.center(80)}")
        print(f"{'=' * 80}\n")
    
    def record_test(self, name: str, passed: bool, message: str = "", details: Any = None):
        """Record test result"""
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} - {name}")
        if message:
            print(f"  → {message}")
        if details:
            print(f"  → Details: {details}")
        
        self.results["tests"].append({
            "name": name,
            "passed": passed,
            "message": message,
            "details": details
        })
        
        if passed:
            self.results["summary"]["passed"] += 1
        else:
            self.results["summary"]["failed"] += 1
    
    async def test_backend_health(self):
        """Test backend health endpoint"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(f"{self.backend_url}/healthz", timeout=self.timeout)
                if response.status_code == 200:
                    data = response.json()
                    self.record_test(
                        "Backend Health Check",
                        True,
                        f"Status: {response.status_code}",
                        data
                    )
                    return True
                else:
                    self.record_test(
                        "Backend Health Check",
                        False,
                        f"Unexpected status: {response.status_code}"
                    )
                    return False
        except Exception as e:
            self.record_test(
                "Backend Health Check",
                False,
                f"Connection failed: {str(e)}"
            )
            return False
    
    async def test_backend_docs(self):
        """Test backend API documentation availability"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(f"{self.backend_url}/docs", timeout=self.timeout)
                if response.status_code == 200:
                    self.record_test(
                        "Backend API Docs",
                        True,
                        "OpenAPI docs accessible at /docs"
                    )
                else:
                    self.record_test(
                        "Backend API Docs",
                        False,
                        f"Status: {response.status_code}"
                    )
        except Exception as e:
            self.record_test(
                "Backend API Docs",
                False,
                str(e)
            )
    
    async def test_backend_openapi(self):
        """Test OpenAPI schema endpoint"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(f"{self.backend_url}/openapi.json", timeout=self.timeout)
                if response.status_code == 200:
                    schema = response.json()
                    paths = len(schema.get("paths", {}))
                    self.record_test(
                        "Backend OpenAPI Schema",
                        True,
                        f"{paths} endpoints documented"
                    )
                else:
                    self.record_test(
                        "Backend OpenAPI Schema",
                        False,
                        f"Status: {response.status_code}"
                    )
        except Exception as e:
            self.record_test(
                "Backend OpenAPI Schema",
                False,
                str(e)
            )
    
    async def test_backend_cors(self):
        """Test CORS configuration"""
        try:
            async with httpx.AsyncClient() as client:
                # Send OPTIONS request to test CORS preflight
                response = await client.options(
                    f"{self.backend_url}/api/v1/auth/login",
                    headers={
                        "Origin": self.frontend_url,
                        "Access-Control-Request-Method": "POST",
                        "Access-Control-Request-Headers": "Content-Type,Authorization"
                    },
                    timeout=self.timeout
                )
                
                cors_headers = {
                    k: v for k, v in response.headers.items() 
                    if k.lower().startswith("access-control")
                }
                
                if cors_headers:
                    self.record_test(
                        "Backend CORS Configuration",
                        True,
                        "CORS headers present",
                        cors_headers
                    )
                else:
                    self.record_test(
                        "Backend CORS Configuration",
                        False,
                        "No CORS headers found"
                    )
        except Exception as e:
            self.record_test(
                "Backend CORS Configuration",
                False,
                str(e)
            )
    
    async def test_backend_api_endpoints(self):
        """Test key backend API endpoints"""
        endpoints = [
            ("/api/v1/auth/login", "POST", "Auth Login"),
            ("/api/v1/users", "GET", "Users List"),
            ("/api/v1/courses", "GET", "Courses List"),
            ("/api/v1/departments", "GET", "Departments List"),
        ]
        
        async with httpx.AsyncClient() as client:
            for path, method, name in endpoints:
                try:
                    url = f"{self.backend_url}{path}"
                    if method == "GET":
                        response = await client.get(url, timeout=self.timeout)
                    else:
                        response = await client.post(url, json={}, timeout=self.timeout)
                    
                    # We expect 401/422 for most endpoints (no auth), not 404
                    if response.status_code in [200, 401, 422]:
                        self.record_test(
                            f"Backend Endpoint: {name}",
                            True,
                            f"{method} {path} → {response.status_code}"
                        )
                    elif response.status_code == 404:
                        self.record_test(
                            f"Backend Endpoint: {name}",
                            False,
                            f"Endpoint not found: {path}"
                        )
                    else:
                        self.record_test(
                            f"Backend Endpoint: {name}",
                            True,
                            f"{method} {path} → {response.status_code} (endpoint exists)"
                        )
                except Exception as e:
                    self.record_test(
                        f"Backend Endpoint: {name}",
                        False,
                        str(e)
                    )
    
    async def test_frontend_availability(self):
        """Test frontend availability"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(self.frontend_url, timeout=self.timeout, follow_redirects=True)
                if response.status_code == 200:
                    # Check if it's actually HTML
                    content_type = response.headers.get("content-type", "")
                    if "html" in content_type.lower():
                        self.record_test(
                            "Frontend Availability",
                            True,
                            f"Frontend serving HTML at {self.frontend_url}"
                        )
                    else:
                        self.record_test(
                            "Frontend Availability",
                            False,
                            f"Unexpected content-type: {content_type}"
                        )
                else:
                    self.record_test(
                        "Frontend Availability",
                        False,
                        f"Status: {response.status_code}"
                    )
        except Exception as e:
            self.record_test(
                "Frontend Availability",
                False,
                f"Cannot connect to frontend: {str(e)}"
            )
    
    async def test_frontend_assets(self):
        """Test frontend static assets"""
        assets = [
            "/vite.svg",
            "/favicon.ico",
        ]
        
        async with httpx.AsyncClient() as client:
            for asset in assets:
                try:
                    response = await client.get(
                        f"{self.frontend_url}{asset}",
                        timeout=self.timeout,
                        follow_redirects=True
                    )
                    if response.status_code == 200:
                        self.record_test(
                            f"Frontend Asset: {asset}",
                            True,
                            "Asset accessible"
                        )
                    else:
                        self.record_test(
                            f"Frontend Asset: {asset}",
                            False,
                            f"Status: {response.status_code} (may not exist)"
                        )
                except Exception as e:
                    self.record_test(
                        f"Frontend Asset: {asset}",
                        False,
                        str(e)
                    )
    
    async def run_all_tests(self):
        """Run all live integration tests"""
        self.print_header("University LMS - Live Integration Test")
        
        print(f"Backend URL:  {self.backend_url}")
        print(f"Frontend URL: {self.frontend_url}\n")
        
        # Backend tests
        self.print_header("Backend Service Tests")
        backend_healthy = await self.test_backend_health()
        
        if backend_healthy:
            await self.test_backend_docs()
            await self.test_backend_openapi()
            await self.test_backend_cors()
            await self.test_backend_api_endpoints()
        else:
            print("⚠️  Skipping additional backend tests (backend not responding)")
        
        # Frontend tests
        self.print_header("Frontend Service Tests")
        await self.test_frontend_availability()
        await self.test_frontend_assets()
        
        # Summary
        self.print_header("Test Summary")
        total = self.results["summary"]["passed"] + self.results["summary"]["failed"]
        passed = self.results["summary"]["passed"]
        failed = self.results["summary"]["failed"]
        
        print(f"✅ Passed: {passed}/{total}")
        print(f"❌ Failed: {failed}/{total}")
        
        success_rate = (passed / total * 100) if total > 0 else 0
        print(f"\nSuccess Rate: {success_rate:.1f}%")
        
        # Save report
        report_file = "live_integration_test_report.json"
        with open(report_file, "w") as f:
            json.dump(self.results, f, indent=2)
        
        print(f"\n📄 Report saved to: {report_file}")
        
        # Exit code
        return 0 if failed == 0 else 1


async def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Test live integration between frontend and backend"
    )
    parser.add_argument(
        "--backend",
        default="http://localhost:8000",
        help="Backend URL (default: http://localhost:8000)"
    )
    parser.add_argument(
        "--frontend",
        default="http://localhost:5173",
        help="Frontend URL (default: http://localhost:5173)"
    )
    parser.add_argument(
        "--timeout",
        type=float,
        default=5.0,
        help="Request timeout in seconds (default: 5.0)"
    )
    
    args = parser.parse_args()
    
    tester = LiveIntegrationTester(args.backend, args.frontend, args.timeout)
    exit_code = await tester.run_all_tests()
    sys.exit(exit_code)


if __name__ == "__main__":
    asyncio.run(main())
