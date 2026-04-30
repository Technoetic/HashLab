# Claude Code Hooks — Policy Matrix

이 디렉토리의 훅은 두 부류로 나뉩니다: **blocking**과 **observing**.
omc(`scripts/run.cjs`)의 **fail-open 철학**을 참고하여 정책을 명시합니다.

## Policy Types

- **blocking**: 실패 시 `exit 1`로 이후 도구 실행을 차단. 반드시 사용자 개입이 필요한 경우에만.
- **observing**: 실패/경고를 로그에 기록하되 `exit 0` 반환. 사용자 흐름을 절대 차단하지 않음.

## Hook Matrix

| Hook | Type | Exit Policy | Trigger |
|:---|:---:|:---|:---|
| axe-core-validator.ps1 | observing | exit 0 (warn only) | manual |
| biome-validator.ps1 | observing | exit 0 | PostToolUse Edit/Write |
| build-validator.ps1 | observing | exit 0 (PASS/FAIL 로그) | PostToolUse Bash |
| c8-validator.ps1 | observing | exit 0 | manual |
| dependency-checker.ps1 | **blocking** | exit 1 on missing core dep | SessionStart |
| destructive-guard.ps1 | **blocking** | exit 2 on risky command | PreToolUse Bash |
| evaluator-trigger.ps1 | observing | exit 0 | PostToolUse Read |
| formatting-validator.ps1 | observing | exit 0 | PostToolUse Edit |
| harness-logger.ps1 | observing | exit 0 | Stop |
| html-bundler.ps1 | observing | exit 0 (PASS/FAIL 로그) | manual |
| jscpd-validator.ps1 | observing | exit 0 | manual |
| knip-validator.ps1 | observing | exit 0 | manual |
| lhci-validator.ps1 | observing | exit 0 | manual |
| linting-validator.ps1 | observing | exit 0 | PostToolUse Edit |
| madge-validator.ps1 | observing | exit 0 | manual |
| playwright-validator.ps1 | observing | exit 0 | SessionStart |
| **pre-compact.ps1** | observing | exit 0, critical state 재주입 | PreCompact |
| refactoring-validator.ps1 | observing | exit 0 | manual |
| research-chunk-validator.ps1 | observing | exit 0 (warn on BOM/CRLF) | PostToolUse Write |
| semgrep-validator.ps1 | observing | exit 0 | manual |
| session-start.ps1 | observing | exit 0 | SessionStart |
| step-dependency-gate.ps1 | **blocking** | exit 1 on missing prerequisite | PreToolUse Bash |
| step-progress-loader.ps1 | observing | exit 0 | SessionStart |
| step-progress-writer.ps1 | observing | exit 0 | Stop |
| stylelint-validator.ps1 | observing | exit 0 | PostToolUse Edit |
| tokei-validator.ps1 | observing | exit 0 | manual |
| type-safety-validator.ps1 | observing | exit 0 | manual |
| ui-regression-validator.ps1 | observing | exit 0 | manual |
| vitest-validator.ps1 | observing | exit 0 | manual |

## Design Principles (omc-inspired)

1. **Fail-Open by Default** — 관찰형 훅은 어떤 에러가 나도 사용자 흐름을 막지 않는다.
2. **Blocking은 예외** — dependency 누락, destructive 명령, Step 의존성 위반 세 경우만.
3. **Log before Block** — blocking 훅도 차단 전에 반드시 `.log` 파일에 이유 기록.
4. **Critical State Preservation** — PreCompact 시 progress.json/baseline.json/eval_r*.md 재주입.

## Log Files

모든 훅은 동일 디렉토리에 `{hook-name}.log` 파일로 기록. 로그 형식:
```
[yyyy-MM-dd HH:mm:ss] === Hook Start ===
[yyyy-MM-dd HH:mm:ss] PASS/WARN/FAIL: message
[yyyy-MM-dd HH:mm:ss] === Hook Complete ===
```
