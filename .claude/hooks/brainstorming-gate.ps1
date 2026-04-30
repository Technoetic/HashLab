# brainstorming-gate.ps1 - superpowers:brainstorming 강제 발동 게이트
# PreToolUse 훅: Step 030/110/111 진입 시 Skill(brainstorming) 호출 전까지 다른 도구 차단
param()

$ErrorActionPreference = "Continue"
$projectRoot  = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$stepArchive  = Join-Path $projectRoot "step_archive"
$progressFile = Join-Path $stepArchive  "progress.json"

# 브레인스토밍 강제 대상 Step
$enforcedSteps = @(30, 110, 111)

# 현재 Step 번호 파악
if (-not (Test-Path $progressFile)) { exit 0 }

try {
    $progress = Get-Content $progressFile -Raw | ConvertFrom-Json
} catch {
    exit 0
}

$currentStep = [int]$progress.current_step
if ($enforcedSteps -notcontains $currentStep) { exit 0 }

# 이미 brainstorming이 발동된 Step인지 플래그 확인
$flagFile = Join-Path $stepArchive (".brainstorming-fired-{0:D3}" -f $currentStep)
if (Test-Path $flagFile) { exit 0 }

# stdin에서 이벤트 JSON 읽기
$inputJson = $null
try {
    $inputJson = [Console]::In.ReadToEnd() | ConvertFrom-Json
} catch {
    exit 0
}

$toolName  = $inputJson.tool_name
$toolInput = $inputJson.tool_input

# Skill 도구로 superpowers:brainstorming을 호출하는 경우 → 플래그 생성 후 통과
if ($toolName -eq "Skill") {
    $skillName = $toolInput.skill
    if ($skillName -match "brainstorming") {
        New-Item -ItemType File -Path $flagFile -Force | Out-Null
        Write-Host "BRAINSTORMING GATE: superpowers:brainstorming fired for step $currentStep"
        exit 0
    }
}

# 그 외 모든 도구 호출 → 차단
$msg = @"
BRAINSTORMING GATE BLOCKED: Step $currentStep requires superpowers:brainstorming first.

You MUST invoke the Skill tool before any other tool:

  Skill(skill="superpowers:brainstorming")

Blocked tool: $toolName
Flag file (auto-created after skill fires): $flagFile
"@

Write-Host $msg
exit 2
