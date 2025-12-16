# University LMS - Integration Check Guide

This guide explains how to perform a comprehensive frontend and backend integration check for the University LMS system.

## 📋 Overview

The integration check system consists of three main tools:

1. **Static Integration Check** (`integration_check.py`) - Validates project structure, configuration, and code without running services
2. **Live Integration Test** (`live_integration_test.py`) - Tests actual connectivity between running services
3. **Quick Runner** (`run_integration_check.sh`) - Convenience script to run checks easily

## 🚀 Quick Start

### Static Check (No Services Required)

Run the static integration check to validate your project structure and configuration:

```bash
# From project root
./run_integration_check.sh

# Or directly with Python
python3 integration_check.py
```

This check validates:
- ✅ Prerequisites (Python, Node.js, npm)
- ✅ Project directory structure
- ✅ Backend configuration and code structure
- ✅ Frontend configuration and build setup
- ✅ API service integration points
- ✅ CORS configuration
- ✅ Authentication flow components

### Live Integration Test (Services Must Be Running)

First, start both services in separate terminals:

**Terminal 1 - Backend:**
```bash
cd university_lms_backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd university-lms-frontend
npm run dev
```

**Terminal 3 - Run Live Tests:**
```bash
python3 live_integration_test.py

# Or with custom URLs
python3 live_integration_test.py --backend http://localhost:8000 --frontend http://localhost:5173
```

Live tests validate:
- ✅ Backend health endpoint
- ✅ Backend API documentation
- ✅ CORS configuration
- ✅ Key API endpoints (auth, users, courses, etc.)
- ✅ Frontend availability
- ✅ Frontend static assets

## 📊 Understanding Results

### Static Check Results

The static check produces colored terminal output and a JSON report:

```
✅ Check Name: PASS - Description
⚠️  Check Name: WARN - Warning message
❌ Check Name: FAIL - Error details
```

A detailed JSON report is saved to `integration_check_report.json`:

```json
{
  "timestamp": "2025-12-16T...",
  "checks": {
    "Check Name": {
      "status": "PASS|WARN|FAIL",
      "message": "Details..."
    }
  },
  "summary": {
    "passed": 45,
    "failed": 2,
    "warnings": 5
  }
}
```

### Health Score

The integration health score is calculated as:
```
Health = (Passed + Warnings * 0.5) / Total * 100%
```

- **90-100%**: EXCELLENT ✨ - System is production-ready
- **75-89%**: GOOD ✅ - Minor issues to address
- **60-74%**: ACCEPTABLE ⚠️ - Some attention needed
- **<60%**: NEEDS ATTENTION ❌ - Critical issues present

### Live Test Results

Live tests show real-time connectivity status:

```
✅ PASS - Backend Health Check
  → Status: 200
  → Details: {"status": "ok"}

❌ FAIL - Frontend Availability
  → Cannot connect to frontend: Connection refused
```

Results are saved to `live_integration_test_report.json`.

## 🔍 What Each Check Does

### 1. Prerequisites Check
- Verifies Python 3.9+ is installed
- Verifies Node.js v18+ is installed
- Verifies npm is available

### 2. Directory Structure Check
- Validates backend directory exists
- Validates frontend directory exists
- Checks for key subdirectories (app/, src/, etc.)

### 3. Backend Configuration Check
- Validates `requirements.txt` exists and has dependencies
- Checks `.env.example` is present and documented
- Verifies `main.py` contains FastAPI app factory

### 4. Backend API Structure Check
- Scans for API router files in `app/api/v1/`
- Validates presence of key routers (auth, users, courses, etc.)
- Counts total API endpoints

### 5. Backend Models & Schemas Check
- Validates database models directory
- Validates Pydantic schemas directory
- Counts model and schema files

### 6. Frontend Configuration Check
- Validates `package.json` exists with proper scripts
- Checks for `vite.config.js`
- Looks for `.env.example` (optional but recommended)

### 7. Frontend Structure Check
- Validates React component structure
- Checks for pages directory
- Validates services and store directories

### 8. Frontend API Services Check
- Validates API service files exist
- Checks for axios instance configuration
- Verifies key API service files (auth, user, course, etc.)

### 9. Backend Import Check
- Attempts to import and create FastAPI app
- Counts registered routes
- Validates key endpoints are registered

### 10. Frontend Build Check
- Checks if `node_modules` exists
- Validates dependencies are installed

### 11. CORS Configuration Check
- Validates CORS settings in `.env.example`
- Checks for ALLOWED_ORIGINS configuration
- Verifies ALLOWED_METHODS are set

### 12. Authentication Flow Check
- Validates backend auth router
- Checks frontend auth API client
- Verifies auth store exists

## 🛠️ Troubleshooting

### "Python 3 not found"
Install Python 3.9 or higher:
```bash
# Ubuntu/Debian
sudo apt install python3 python3-pip

# macOS
brew install python3

# Windows
# Download from python.org
```

### "Node.js not found"
Install Node.js v18 or higher:
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# macOS
brew install node

# Windows
# Download from nodejs.org
```

### "Backend App Creation FAIL"
This usually means missing dependencies. Install them:
```bash
cd university_lms_backend
pip install -r requirements.txt
```

### "Frontend Dependencies WARN"
Install frontend dependencies:
```bash
cd university-lms-frontend
npm install
```

### "Cannot connect to backend" (Live Test)
Make sure the backend is running:
```bash
cd university_lms_backend
source venv/bin/activate
uvicorn app.main:app --reload
```

### "Cannot connect to frontend" (Live Test)
Make sure the frontend dev server is running:
```bash
cd university-lms-frontend
npm run dev
```

### "CORS Configuration FAIL" (Live Test)
Check your backend `.env` file has:
```bash
ALLOWED_ORIGINS=http://localhost:5173
ALLOWED_METHODS=GET,POST,PUT,PATCH,DELETE,OPTIONS
ALLOWED_HEADERS=Authorization,Content-Type
```

## 🎯 Best Practices

### When to Run Checks

**Static Check:**
- Before committing code changes
- After adding new API endpoints
- When setting up a new environment
- Before deployment

**Live Test:**
- After starting services locally
- To verify CORS configuration
- When debugging frontend-backend connectivity
- Before integration testing

### CI/CD Integration

Add to your CI pipeline:

```yaml
# .github/workflows/integration-check.yml
name: Integration Check

on: [push, pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Set up Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Run integration check
        run: python3 integration_check.py
```

## 📝 Report Files

### integration_check_report.json
Complete results from static check:
- Timestamp of check
- All check results with status and messages
- Summary statistics
- Can be archived for historical comparison

### live_integration_test_report.json
Results from live connectivity tests:
- Backend and frontend URLs tested
- Each test result with details
- HTTP response codes and headers
- Summary of passed/failed tests

## 🔄 Continuous Monitoring

For production environments, consider:

1. **Health Check Endpoints**: The backend `/healthz` endpoint should be monitored
2. **Automated Testing**: Run live tests in staging environments regularly
3. **Alerting**: Set up alerts for failed integration checks
4. **Logging**: Keep integration check reports for trend analysis

## 📚 Additional Resources

- [Backend README](university_lms_backend/README.md) - Backend setup guide
- [Frontend README](university-lms-frontend/README.md) - Frontend setup guide
- [Root README](README.md) - Full project documentation
- [System Check Report](SYSTEM_CHECK_REPORT.md) - Previous system analysis

## 💡 Tips

1. **Run checks frequently** - Catch integration issues early
2. **Keep .env.example updated** - Document all required variables
3. **Fix warnings** - They often indicate real issues
4. **Automate in CI** - Prevent broken integrations from being merged
5. **Compare reports** - Track integration health over time

## ❓ Support

If you encounter issues not covered in this guide:

1. Check the detailed error messages in the JSON reports
2. Review the [System Check Report](SYSTEM_CHECK_REPORT.md) for known issues
3. Ensure all prerequisites are properly installed
4. Verify environment variables are correctly configured
5. Check that services are running on expected ports

---

**Last Updated**: December 2025  
**Maintainer**: University LMS Team
