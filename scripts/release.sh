#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

log(){ printf '\n==> %s\n' "$*"; }
warn(){ printf '\n[WARN] %s\n' "$*" >&2; }
err(){ printf '\n[ERR] %s\n' "$*" >&2; }

log "Project: $(pwd)"
log "Node/npm: $(node -v 2>/dev/null || echo missing) / $(npm -v 2>/dev/null || echo missing)"

log "1) Typecheck"
npm run check

log "2) Ensure web app running on :8081"
if ss -ltn 2>/dev/null | grep -q ':8081'; then
  echo "already listening on :8081"
else
  nohup npm run web:8081 > /tmp/my-life-app-web.log 2>&1 &
  echo "started web pid=$!"
  sleep 12
fi
ss -ltn 2>/dev/null | grep ':8081' || warn "port 8081 not listening yet (see /tmp/my-life-app-web.log)"

log "3) Git status / push (optional)"
git branch --show-current 2>/dev/null || true
git remote -v 2>/dev/null || true
if [ -n "${GITHUB_TOKEN:-}" ]; then
  if [[ "${GITHUB_TOKEN}" == *"<"* || "${GITHUB_TOKEN}" == *">"* || "${GITHUB_TOKEN}" == *"PAT"*توکن* ]]; then
    warn "GITHUB_TOKEN looks like a placeholder; set a real GitHub Personal Access Token and re-run."
  else
    REPO_URL="${GITHUB_REPO_URL:-https://github.com/itButane/my-life-app.git}"
    AUTH_URL="https://x-access-token:${GITHUB_TOKEN}@github.com/${REPO_URL#https://github.com/}"
    log "Pushing to GitHub using GITHUB_TOKEN -> ${REPO_URL}"
    git push "${AUTH_URL}" HEAD:main -u || warn "git push failed"
    git remote set-url origin "${REPO_URL}" 2>/dev/null || true
  fi
else
  warn "GITHUB_TOKEN not set; skipping git push. (GitHub no longer accepts account passwords.)"
  echo "  To push: GITHUB_TOKEN=<real_pat> GITHUB_REPO_URL=https://github.com/itButane/<repo>.git ./scripts/release.sh"
fi

log "4) EAS project info"
npx --yes eas-cli@latest whoami || warn "eas whoami failed (login/token issue)"
npx --yes eas-cli@latest project:info || warn "eas project:info failed"

log "5) EAS Android APK build (cloud)"
if [ -n "${EXPO_TOKEN:-}" ]; then
  if [[ "${EXPO_TOKEN}" == *"<"* || "${EXPO_TOKEN}" == *">"* || "${EXPO_TOKEN}" == *"توکن"* ]]; then
    warn "EXPO_TOKEN looks like a placeholder; unsetting it. Generate a real token at https://expo.dev/accounts/itbutane/settings/access-tokens"
    unset EXPO_TOKEN
  else
    echo "EXPO_TOKEN is set; attempting non-interactive build..."
  fi
fi
set +e
EXPO_DEBUG="${EXPO_DEBUG:-0}" npx --yes eas-cli@latest build -p android --profile apk --non-interactive --clear-cache
EAS_RC=$?
set -e
if [ $EAS_RC -eq 0 ]; then
  log "EAS build submitted/succeeded. Use the download URL above and set it in app profile (http://localhost:8081/profile -> APK share)."
  exit 0
fi
err "EAS build failed (exit $EAS_RC)."
echo "403 on upload is typically Expo account/service-side (email/Terms/EAS access, permissions, quota, or session/token). It cannot be fixed by local project config alone."
echo "Use a real token (terminal-only run): EXPO_TOKEN=<real_token> EXPO_DEBUG=1 ./scripts/release.sh"
echo "Or login interactively once: npx eas-cli login  (then ./scripts/release.sh)"

log "6) Local Android build fallback (requires Android SDK + JDK)"
if [ -n "${ANDROID_HOME:-}${ANDROID_SDK_ROOT:-}" ] && command -v java >/dev/null 2>&1; then
  log "Prebuilding native android project..."
  npx expo prebuild -p android --non-interactive || warn "expo prebuild failed"
  if [ -d android ]; then
    (cd android && ./gradlew assembleRelease) && echo "APK (if built): android/app/build/outputs/apk/release/"
  fi
else
  warn "ANDROID_HOME/ANDROID_SDK_ROOT not set; local APK build unavailable on this machine."
fi

log "Done (with errors above if any). Web app: http://localhost:8081  | Profile/APK share: http://localhost:8081/profile"
exit $EAS_RC
