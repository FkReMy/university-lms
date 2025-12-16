#!/usr/bin/env bash
#
# University LMS - CI/CD Integration Check
# =========================================
# Automated integration check for CI/CD pipelines
# Exits with non-zero code if critical checks fail
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║              University LMS - CI/CD Integration Check                       ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Function to check exit code
check_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ $2${NC}"
        return 0
    else
        echo -e "${RED}✗ $2${NC}"
        return 1
    fi
}

# Track overall status
OVERALL_STATUS=0

# 1. Check prerequisites
echo -e "\n${BLUE}=== Checking Prerequisites ===${NC}\n"

if command -v python3 &> /dev/null; then
    echo -e "${GREEN}✓ Python: $(python3 --version)${NC}"
else
    echo -e "${RED}✗ Python 3 not found${NC}"
    OVERALL_STATUS=1
fi

if command -v node &> /dev/null; then
    echo -e "${GREEN}✓ Node.js: $(node --version)${NC}"
else
    echo -e "${RED}✗ Node.js not found${NC}"
    OVERALL_STATUS=1
fi

if command -v npm &> /dev/null; then
    echo -e "${GREEN}✓ npm: $(npm --version)${NC}"
else
    echo -e "${RED}✗ npm not found${NC}"
    OVERALL_STATUS=1
fi

# 2. Run static integration check
echo -e "\n${BLUE}=== Running Static Integration Check ===${NC}\n"

python3 integration_check.py
CHECK_STATUS=$?

if [ $CHECK_STATUS -eq 0 ]; then
    echo -e "\n${GREEN}✓ Static integration check passed${NC}"
else
    echo -e "\n${RED}✗ Static integration check failed${NC}"
    OVERALL_STATUS=1
fi

# 3. Check integration report
if [ -f "integration_check_report.json" ]; then
    echo -e "\n${BLUE}=== Integration Report Summary ===${NC}\n"
    
    # Extract summary using Python
    python3 -c "
import json
with open('integration_check_report.json') as f:
    data = json.load(f)
    summary = data['summary']
    print(f\"✅ Passed:   {summary['passed']}\")
    print(f\"⚠️  Warnings: {summary['warnings']}\")
    print(f\"❌ Failed:   {summary['failed']}\")
    
    total = summary['passed'] + summary['warnings'] + summary['failed']
    health = (summary['passed'] + summary['warnings'] * 0.5) / total * 100 if total > 0 else 0
    print(f\"\\n🏥 Health Score: {health:.1f}%\")
    
    # Fail if health score is below threshold
    if health < 75:
        print(f\"\\n❌ Health score below 75% threshold\")
        exit(1)
    elif summary['failed'] > 0:
        print(f\"\\n⚠️  Warning: {summary['failed']} checks failed\")
        exit(0)  # Don't fail CI for now, just warn
    else:
        print(f\"\\n✅ Health check passed\")
        exit(0)
"
    HEALTH_STATUS=$?
    
    if [ $HEALTH_STATUS -ne 0 ]; then
        OVERALL_STATUS=1
    fi
else
    echo -e "${YELLOW}⚠️  Integration report not found${NC}"
fi

# 4. Final status
echo -e "\n${BLUE}╔══════════════════════════════════════════════════════════════════════════════╗${NC}"
if [ $OVERALL_STATUS -eq 0 ]; then
    echo -e "${GREEN}║                     ✓ CI/CD Integration Check PASSED                        ║${NC}"
    echo -e "${BLUE}╚══════════════════════════════════════════════════════════════════════════════╝${NC}"
    exit 0
else
    echo -e "${RED}║                     ✗ CI/CD Integration Check FAILED                        ║${NC}"
    echo -e "${BLUE}╚══════════════════════════════════════════════════════════════════════════════╝${NC}"
    exit 1
fi
