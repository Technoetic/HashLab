# step-context-injector.ps1 - 다음 실행할 step 번호를 Claude 컨텍스트에 주입
# SessionStart 훅: hookSpecificOutput.additionalContext로 step 진행 지시 전달

param()

$ErrorActionPreference = "Continue"
$projectRoot  = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$stepArchive  = Join-Path $projectRoot "step_archive"
$progressFile = Join-Path $stepArchive  "progress.json"

if (-not (Test-Path $progressFile)) {
    $currentStep = 1
    $totalSteps  = 114
    $completedCount = 0
} else {
    try {
        $progress = Get-Content $progressFile -Raw | ConvertFrom-Json
        $currentStep = [int]$progress.current_step
        $totalSteps  = [int]$progress.total_steps
        $completedCount = $progress.completed_steps.Count
    } catch {
        $currentStep = 1
        $totalSteps  = 114
        $completedCount = 0
    }
}

$stepFile = "step_archive/step{0:D3}.md" -f $currentStep

$context = @"
[STEP HARNESS AUTO-RESUME]
Progress: $completedCount/$totalSteps completed.
Next step to execute: step$('{0:D3}' -f $currentStep) ($stepFile)

CLAUDE.md MANDATORY RULE:
1. Read $stepFile (Read tool, single file).
2. Execute its instructions immediately.
3. On completion, report "Step $('{0:D3}' -f $currentStep)/$totalSteps 완료" then auto-advance.
4. Continue without user confirmation through step$('{0:D3}' -f $totalSteps).

Begin step$('{0:D3}' -f $currentStep) NOW unless the user explicitly redirected.
"@

$payload = @{
    hookSpecificOutput = @{
        hookEventName     = "SessionStart"
        additionalContext = $context
    }
} | ConvertTo-Json -Depth 5 -Compress

Write-Output $payload
exit 0
