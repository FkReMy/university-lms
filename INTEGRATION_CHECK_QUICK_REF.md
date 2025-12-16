# Integration Check Quick Reference

## 🚀 Quick Commands

### Static Check (No Services Required)
```bash
./run_integration_check.sh
```
**OR**
```bash
python3 integration_check.py
```

### Live Test (Services Must Be Running)
```bash
python3 live_integration_test.py
```

---

## ✅ What Gets Checked

| Category | Items Checked |
|----------|---------------|
| **Prerequisites** | Python 3.9+, Node.js 18+, npm |
| **Structure** | Backend/Frontend directories, Key folders |
| **Backend** | API routers, Models, Schemas, Configuration |
| **Frontend** | Components, Pages, Services, Store |
| **Integration** | API services, Axios config, Auth flow |
| **Configuration** | CORS, Environment variables |

---

## 📊 Health Score

| Score | Status | Meaning |
|-------|--------|---------|
| 90-100% | EXCELLENT ✨ | Production ready |
| 75-89% | GOOD ✅ | Minor issues |
| 60-74% | ACCEPTABLE ⚠️ | Needs attention |
| <60% | NEEDS WORK ❌ | Critical issues |

---

## 🔧 Common Issues & Fixes

### ❌ "Python 3 not found"
```bash
# Ubuntu/Debian
sudo apt install python3

# macOS
brew install python3
```

### ❌ "Node.js not found"
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# macOS
brew install node
```

### ⚠️ "node_modules not found"
```bash
cd university-lms-frontend
npm install
```

### ⚠️ "Backend App Creation FAIL"
```bash
cd university_lms_backend
pip install -r requirements.txt
```

### ❌ "Cannot connect to backend" (Live Test)
```bash
# Start backend in separate terminal
cd university_lms_backend
source venv/bin/activate
uvicorn app.main:app --reload
```

### ❌ "Cannot connect to frontend" (Live Test)
```bash
# Start frontend in separate terminal
cd university-lms-frontend
npm run dev
```

---

## 📁 Output Files

| File | Description |
|------|-------------|
| `integration_check_report.json` | Static check detailed results |
| `live_integration_test_report.json` | Live test results |

---

## 🎯 When to Run

- ✅ Before committing code
- ✅ After adding new API endpoints
- ✅ When setting up new environment
- ✅ Before deployment
- ✅ When debugging connectivity

---

## 📖 Full Documentation

See [INTEGRATION_CHECK_GUIDE.md](INTEGRATION_CHECK_GUIDE.md) for complete guide.

---

**Pro Tip:** Add to your pre-commit hook or CI/CD pipeline! 🚀
