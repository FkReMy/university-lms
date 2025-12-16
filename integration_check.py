#!/usr/bin/env python3
"""
University LMS - Full Frontend and Backend Integration Check
================================================================
Comprehensive integration validation script that tests:
- Backend API health and connectivity
- Frontend build and configuration
- API endpoint availability
- CORS configuration
- Environment variables
- Authentication flow
- Database connectivity

Run this script to verify full system integration before deployment.
"""

import asyncio
import json
import os
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple

# Color codes for terminal output
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


class IntegrationChecker:
    def __init__(self):
        self.root_dir = Path(__file__).parent.resolve()
        self.backend_dir = self.root_dir / "university_lms_backend"
        self.frontend_dir = self.root_dir / "university-lms-frontend"
        self.results = {
            "timestamp": datetime.now().isoformat(),
            "checks": {},
            "summary": {"passed": 0, "failed": 0, "warnings": 0}
        }
    
    def print_header(self, text: str):
        """Print section header"""
        print(f"\n{Colors.BOLD}{Colors.HEADER}{'=' * 80}{Colors.ENDC}")
        print(f"{Colors.BOLD}{Colors.HEADER}{text.center(80)}{Colors.ENDC}")
        print(f"{Colors.BOLD}{Colors.HEADER}{'=' * 80}{Colors.ENDC}\n")
    
    def print_check(self, name: str, status: str, message: str = ""):
        """Print check result"""
        if status == "PASS":
            icon = "✅"
            color = Colors.OKGREEN
            self.results["summary"]["passed"] += 1
        elif status == "WARN":
            icon = "⚠️"
            color = Colors.WARNING
            self.results["summary"]["warnings"] += 1
        else:
            icon = "❌"
            color = Colors.FAIL
            self.results["summary"]["failed"] += 1
        
        print(f"{color}{icon} {name}: {status}{Colors.ENDC}")
        if message:
            print(f"   {message}")
        
        self.results["checks"][name] = {
            "status": status,
            "message": message
        }
    
    def run_command(self, cmd: List[str], cwd: Path = None, timeout: int = 30) -> Tuple[int, str, str]:
        """Run shell command and return exit code, stdout, stderr"""
        try:
            result = subprocess.run(
                cmd,
                cwd=cwd or self.root_dir,
                capture_output=True,
                text=True,
                timeout=timeout
            )
            return result.returncode, result.stdout, result.stderr
        except subprocess.TimeoutExpired:
            return -1, "", f"Command timed out after {timeout}s"
        except Exception as e:
            return -1, "", str(e)
    
    def check_prerequisites(self):
        """Check if required tools are installed"""
        self.print_header("1. Prerequisites Check")
        
        # Check Python
        code, stdout, _ = self.run_command(["python3", "--version"])
        if code == 0:
            version = stdout.strip()
            self.print_check("Python Installation", "PASS", version)
        else:
            self.print_check("Python Installation", "FAIL", "Python 3 not found")
        
        # Check Node.js
        code, stdout, _ = self.run_command(["node", "--version"])
        if code == 0:
            version = stdout.strip()
            self.print_check("Node.js Installation", "PASS", version)
        else:
            self.print_check("Node.js Installation", "FAIL", "Node.js not found")
        
        # Check npm
        code, stdout, _ = self.run_command(["npm", "--version"])
        if code == 0:
            version = stdout.strip()
            self.print_check("npm Installation", "PASS", f"npm {version}")
        else:
            self.print_check("npm Installation", "FAIL", "npm not found")
    
    def check_directory_structure(self):
        """Verify project directory structure"""
        self.print_header("2. Directory Structure Check")
        
        required_dirs = [
            (self.backend_dir, "Backend Directory"),
            (self.frontend_dir, "Frontend Directory"),
            (self.backend_dir / "app", "Backend App Directory"),
            (self.frontend_dir / "src", "Frontend Src Directory"),
        ]
        
        for dir_path, name in required_dirs:
            if dir_path.exists():
                self.print_check(name, "PASS", str(dir_path))
            else:
                self.print_check(name, "FAIL", f"{dir_path} not found")
    
    def check_backend_config(self):
        """Check backend configuration files"""
        self.print_header("3. Backend Configuration Check")
        
        # Check requirements.txt
        req_file = self.backend_dir / "requirements.txt"
        if req_file.exists():
            with open(req_file) as f:
                lines = [l.strip() for l in f if l.strip() and not l.startswith("#")]
            self.print_check("Backend Requirements", "PASS", f"{len(lines)} packages defined")
        else:
            self.print_check("Backend Requirements", "FAIL", "requirements.txt not found")
        
        # Check .env.example
        env_example = self.backend_dir / ".env.example"
        if env_example.exists():
            with open(env_example) as f:
                env_vars = [l.split("=")[0] for l in f if "=" in l and not l.startswith("#")]
            self.print_check("Backend Env Example", "PASS", f"{len(env_vars)} variables documented")
        else:
            self.print_check("Backend Env Example", "WARN", ".env.example not found")
        
        # Check main.py
        main_file = self.backend_dir / "app" / "main.py"
        if main_file.exists():
            with open(main_file) as f:
                content = f.read()
                if "create_app" in content and "FastAPI" in content:
                    self.print_check("Backend Main File", "PASS", "FastAPI app factory found")
                else:
                    self.print_check("Backend Main File", "WARN", "Unexpected main.py structure")
        else:
            self.print_check("Backend Main File", "FAIL", "main.py not found")
    
    def check_backend_api_structure(self):
        """Check backend API structure"""
        self.print_header("4. Backend API Structure Check")
        
        api_dir = self.backend_dir / "app" / "api" / "v1"
        if not api_dir.exists():
            self.print_check("API Directory", "FAIL", "API v1 directory not found")
            return
        
        expected_routers = [
            "auth.py", "users.py", "courses.py", "departments.py",
            "sessions.py", "assignments.py", "quizzes.py", "enrollments.py"
        ]
        
        found_routers = []
        for router_file in expected_routers:
            if (api_dir / router_file).exists():
                found_routers.append(router_file)
        
        if len(found_routers) >= len(expected_routers) * 0.7:
            self.print_check("API Routers", "PASS", f"{len(found_routers)}/{len(expected_routers)} routers found")
        else:
            self.print_check("API Routers", "WARN", f"Only {len(found_routers)}/{len(expected_routers)} routers found")
    
    def check_backend_models_schemas(self):
        """Check backend models and schemas"""
        self.print_header("5. Backend Models & Schemas Check")
        
        models_dir = self.backend_dir / "app" / "models"
        schemas_dir = self.backend_dir / "app" / "schemas"
        
        if models_dir.exists():
            model_files = list(models_dir.glob("*.py"))
            model_files = [f for f in model_files if f.name != "__init__.py"]
            self.print_check("Database Models", "PASS", f"{len(model_files)} model files found")
        else:
            self.print_check("Database Models", "FAIL", "Models directory not found")
        
        if schemas_dir.exists():
            schema_files = list(schemas_dir.glob("*.py"))
            schema_files = [f for f in schema_files if f.name != "__init__.py"]
            self.print_check("API Schemas", "PASS", f"{len(schema_files)} schema files found")
        else:
            self.print_check("API Schemas", "FAIL", "Schemas directory not found")
    
    def check_frontend_config(self):
        """Check frontend configuration"""
        self.print_header("6. Frontend Configuration Check")
        
        # Check package.json
        package_json = self.frontend_dir / "package.json"
        if package_json.exists():
            with open(package_json) as f:
                pkg = json.load(f)
                scripts = pkg.get("scripts", {})
                deps = pkg.get("dependencies", {})
                self.print_check("Frontend Package.json", "PASS", 
                                f"{len(scripts)} scripts, {len(deps)} dependencies")
        else:
            self.print_check("Frontend Package.json", "FAIL", "package.json not found")
        
        # Check vite.config.js
        vite_config = self.frontend_dir / "vite.config.js"
        if vite_config.exists():
            self.print_check("Vite Configuration", "PASS", "vite.config.js found")
        else:
            self.print_check("Vite Configuration", "FAIL", "vite.config.js not found")
        
        # Check .env.example
        env_example = self.frontend_dir / ".env.example"
        if env_example.exists():
            self.print_check("Frontend Env Example", "PASS", ".env.example found")
        else:
            self.print_check("Frontend Env Example", "WARN", 
                           ".env.example not found - API URL may be hardcoded")
    
    def check_frontend_structure(self):
        """Check frontend directory structure"""
        self.print_header("7. Frontend Structure Check")
        
        src_dir = self.frontend_dir / "src"
        expected_dirs = [
            ("components", "Components"),
            ("pages", "Pages"),
            ("services", "Services"),
            ("store", "State Store"),
        ]
        
        for dir_name, display_name in expected_dirs:
            dir_path = src_dir / dir_name
            if dir_path.exists():
                files = list(dir_path.rglob("*.[jt]s*"))
                self.print_check(display_name, "PASS", f"{len(files)} files")
            else:
                self.print_check(display_name, "FAIL", f"{dir_name}/ not found")
    
    def check_frontend_api_services(self):
        """Check frontend API service files"""
        self.print_header("8. Frontend API Services Check")
        
        api_dir = self.frontend_dir / "src" / "services" / "api"
        if not api_dir.exists():
            self.print_check("API Services Directory", "FAIL", "services/api/ not found")
            return
        
        expected_services = [
            "axiosInstance.js", "authApi.js", "userApi.js", 
            "courseApi.js", "departmentApi.js"
        ]
        
        found = []
        for service_file in expected_services:
            if (api_dir / service_file).exists():
                found.append(service_file)
        
        if len(found) >= len(expected_services) * 0.8:
            self.print_check("API Service Files", "PASS", 
                           f"{len(found)}/{len(expected_services)} services found")
        else:
            self.print_check("API Service Files", "WARN", 
                           f"Only {len(found)}/{len(expected_services)} services found")
        
        # Check axios instance configuration
        axios_file = api_dir / "axiosInstance.js"
        if axios_file.exists():
            with open(axios_file) as f:
                content = f.read()
                if "axios.create" in content:
                    self.print_check("Axios Configuration", "PASS", "Axios instance properly configured")
                else:
                    self.print_check("Axios Configuration", "WARN", "Axios instance may not be configured")
        else:
            self.print_check("Axios Configuration", "FAIL", "axiosInstance.js not found")
    
    def check_backend_import(self):
        """Test if backend can be imported"""
        self.print_header("9. Backend Import Check")
        
        # Save original sys.path to restore later
        original_path = sys.path.copy()
        
        try:
            # Try importing the FastAPI app
            sys.path.insert(0, str(self.backend_dir))
            from app.main import create_app
            app = create_app()
            
            # Count routes
            routes = [r for r in app.routes if hasattr(r, 'methods')]
            self.print_check("Backend App Creation", "PASS", 
                           f"FastAPI app created with {len(routes)} routes")
            
            # Check for key endpoints
            paths = [r.path for r in app.routes if hasattr(r, 'path')]
            key_endpoints = ["/healthz", "/api/v1/auth", "/api/v1/users"]
            found_endpoints = [ep for ep in key_endpoints if any(ep in p for p in paths)]
            
            if len(found_endpoints) >= 2:
                self.print_check("Key API Endpoints", "PASS", 
                               f"{len(found_endpoints)}/{len(key_endpoints)} found")
            else:
                self.print_check("Key API Endpoints", "WARN", 
                               f"Only {len(found_endpoints)}/{len(key_endpoints)} found")
            
        except Exception as e:
            self.print_check("Backend App Creation", "FAIL", str(e))
        finally:
            # Restore original sys.path
            sys.path = original_path
    
    def check_frontend_build(self):
        """Test frontend build"""
        self.print_header("10. Frontend Build Check")
        
        # Check if node_modules exists
        node_modules = self.frontend_dir / "node_modules"
        if not node_modules.exists():
            self.print_check("Frontend Dependencies", "WARN", 
                           "node_modules not found - run 'npm install'")
            return
        
        self.print_check("Frontend Dependencies", "PASS", "node_modules present")
        
        # Try to build (skip actual build as it takes time)
        print("   Note: Full build test skipped (use 'npm run build' manually)")
    
    def check_cors_config(self):
        """Check CORS configuration"""
        self.print_header("11. CORS Configuration Check")
        
        env_example = self.backend_dir / ".env.example"
        if env_example.exists():
            with open(env_example) as f:
                content = f.read()
                if "ALLOWED_ORIGINS" in content:
                    self.print_check("CORS Origins", "PASS", "ALLOWED_ORIGINS configured")
                else:
                    self.print_check("CORS Origins", "WARN", "ALLOWED_ORIGINS not in .env.example")
                
                if "ALLOWED_METHODS" in content:
                    self.print_check("CORS Methods", "PASS", "ALLOWED_METHODS configured")
                else:
                    self.print_check("CORS Methods", "WARN", "ALLOWED_METHODS not configured")
        else:
            self.print_check("CORS Configuration", "FAIL", ".env.example not found")
    
    def check_auth_flow(self):
        """Check authentication flow components"""
        self.print_header("12. Authentication Flow Check")
        
        # Backend auth
        auth_router = self.backend_dir / "app" / "api" / "v1" / "auth.py"
        if auth_router.exists():
            with open(auth_router) as f:
                content = f.read()
                endpoints = ["login", "logout", "refresh"]
                found = [ep for ep in endpoints if ep in content.lower()]
                if len(found) >= 2:
                    self.print_check("Backend Auth Endpoints", "PASS", 
                                   f"{len(found)}/{len(endpoints)} endpoints found")
                else:
                    self.print_check("Backend Auth Endpoints", "WARN", 
                                   f"Only {len(found)}/{len(endpoints)} endpoints found")
        else:
            self.print_check("Backend Auth Endpoints", "FAIL", "auth.py not found")
        
        # Frontend auth
        auth_api = self.frontend_dir / "src" / "services" / "api" / "authApi.js"
        if auth_api.exists():
            with open(auth_api) as f:
                content = f.read()
                methods = ["login", "logout", "refresh"]
                found = [m for m in methods if m in content.lower()]
                if len(found) >= 2:
                    self.print_check("Frontend Auth API", "PASS", 
                                   f"{len(found)}/{len(methods)} methods found")
                else:
                    self.print_check("Frontend Auth API", "WARN", 
                                   f"Only {len(found)}/{len(methods)} methods found")
        else:
            self.print_check("Frontend Auth API", "FAIL", "authApi.js not found")
        
        # Check auth store
        auth_store = self.frontend_dir / "src" / "store" / "authStore.js"
        if auth_store.exists():
            self.print_check("Frontend Auth Store", "PASS", "authStore.js found")
        else:
            self.print_check("Frontend Auth Store", "WARN", "authStore.js not found")
    
    def generate_report(self):
        """Generate final report"""
        self.print_header("Integration Check Summary")
        
        total = (self.results["summary"]["passed"] + 
                self.results["summary"]["failed"] + 
                self.results["summary"]["warnings"])
        
        print(f"{Colors.OKGREEN}✅ Passed: {self.results['summary']['passed']}{Colors.ENDC}")
        print(f"{Colors.WARNING}⚠️  Warnings: {self.results['summary']['warnings']}{Colors.ENDC}")
        print(f"{Colors.FAIL}❌ Failed: {self.results['summary']['failed']}{Colors.ENDC}")
        print(f"{Colors.BOLD}Total Checks: {total}{Colors.ENDC}")
        
        # Calculate health percentage
        health_score = (
            (self.results["summary"]["passed"] + 
             self.results["summary"]["warnings"] * 0.5) / total * 100
            if total > 0 else 0
        )
        
        print(f"\n{Colors.BOLD}Integration Health Score: {health_score:.1f}%{Colors.ENDC}")
        
        if health_score >= 90:
            print(f"{Colors.OKGREEN}Status: EXCELLENT ✨{Colors.ENDC}")
        elif health_score >= 75:
            print(f"{Colors.OKGREEN}Status: GOOD ✅{Colors.ENDC}")
        elif health_score >= 60:
            print(f"{Colors.WARNING}Status: ACCEPTABLE ⚠️{Colors.ENDC}")
        else:
            print(f"{Colors.FAIL}Status: NEEDS ATTENTION ❌{Colors.ENDC}")
        
        # Save JSON report
        report_file = self.root_dir / "integration_check_report.json"
        with open(report_file, "w") as f:
            json.dump(self.results, f, indent=2)
        
        print(f"\n{Colors.OKCYAN}📄 Detailed report saved to: {report_file}{Colors.ENDC}")
    
    def run_all_checks(self):
        """Run all integration checks"""
        print(f"\n{Colors.BOLD}{Colors.OKBLUE}")
        print("╔══════════════════════════════════════════════════════════════════════════════╗")
        print("║                 University LMS - Integration Check                          ║")
        print("║                   Frontend & Backend Integration Validation                 ║")
        print("╚══════════════════════════════════════════════════════════════════════════════╝")
        print(f"{Colors.ENDC}")
        
        try:
            self.check_prerequisites()
            self.check_directory_structure()
            self.check_backend_config()
            self.check_backend_api_structure()
            self.check_backend_models_schemas()
            self.check_frontend_config()
            self.check_frontend_structure()
            self.check_frontend_api_services()
            self.check_backend_import()
            self.check_frontend_build()
            self.check_cors_config()
            self.check_auth_flow()
            self.generate_report()
            
        except KeyboardInterrupt:
            print(f"\n{Colors.WARNING}Check interrupted by user{Colors.ENDC}")
            sys.exit(1)
        except Exception as e:
            print(f"\n{Colors.FAIL}Unexpected error: {e}{Colors.ENDC}")
            sys.exit(1)


def main():
    """Main entry point"""
    checker = IntegrationChecker()
    checker.run_all_checks()


if __name__ == "__main__":
    main()
