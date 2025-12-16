#!/usr/bin/env bash
#
# University LMS - Quick Integration Check
# =========================================
# Convenience wrapper for running the Python integration check script.
# This script can be run from anywhere in the project.
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║              University LMS - Integration Check Runner                      ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed. Please install Python 3.9+ to run this check.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Found Python: $(python3 --version)${NC}"
echo ""

# Run the integration check
echo -e "${BLUE}Running integration checks...${NC}"
echo ""

cd "$SCRIPT_DIR"
python3 integration_check.py "$@"

exit_code=$?

if [ $exit_code -eq 0 ]; then
    echo ""
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                    Integration Check Completed ✓                            ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════════════════════════╝${NC}"
else
    echo ""
    echo -e "${RED}╔══════════════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║                Integration Check Failed - See Errors Above                  ║${NC}"
    echo -e "${RED}╚══════════════════════════════════════════════════════════════════════════════╝${NC}"
fi

exit $exit_code
