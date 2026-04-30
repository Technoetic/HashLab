# step-progress-writer.ps1 - Step 완료 상태 자동 기록 (Stop 훅)
# 전략: 매 턴 끝에 transcript 전체를 스캔해 모든 "Step NNN 완료" 패턴을 추출.
# 멱등 동작: 이미 completed_steps에 있으면 스킵. 누락된 과거 완료도 자동 복구.
param()

$ErrorActionPreference = "SilentlyContinue"
$logFile = Join-Path $PSScriptRoot "step-progress-writer.log"
function Write-WriterLog($msg) {
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path $logFile -Value "[$ts] $msg" -Encoding UTF8
}
Write-WriterLog "=== invoked ==="
$projectRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$stepArchive = Join-Path $projectRoot "step_archive"
$progressFile = Join-Path $stepArchive "progress.json"

# stdin 이벤트 JSON
$inputJson = $null
try {
    $raw = [Console]::In.ReadToEnd()
    if ($raw) { $inputJson = $raw | ConvertFrom-Json }
} catch {}

if (-not (Test-Path $progressFile)) { exit 0 }

$progress = Get-Content $progressFile -Raw -Encoding UTF8 | ConvertFrom-Json

# 1) 누적 응답 수집 (last_assistant_message + 전체 transcript 스캔)
$response = ""
if ($inputJson -and $inputJson.last_assistant_message) {
    $response += "`n" + $inputJson.last_assistant_message
}

if ($inputJson -and $inputJson.transcript_path -and (Test-Path $inputJson.transcript_path)) {
    try {
        # transcript 전체를 스캔 (JSONL). 파일이 클 수 있으나 Step당 KB 단위라 수용 가능
        $allLines = Get-Content $inputJson.transcript_path -Encoding UTF8
        foreach ($line in $allLines) {
            if (-not $line) { continue }
            try {
                $entry = $line | ConvertFrom-Json
                if ($entry.type -eq 'assistant' -and $entry.message.content) {
                    foreach ($block in $entry.message.content) {
                        if ($block.type -eq 'text' -and $block.text) {
                            $response += "`n" + $block.text
                        }
                    }
                }
            } catch {}
        }
    } catch {}
}

# 2) Step 완료 패턴 매칭 - 엄격한 명시 완료 보고만 허용
#    total_steps 범위를 벗어난 숫자는 무시 (본문 언급 오탐 방지)
$totalSteps = [int]$progress.total_steps
$foundSteps = New-Object System.Collections.Generic.HashSet[int]

# 패턴 A: "Step NNN/MMM 완료" - 슬래시 + 총수 필수 (가장 엄격)
$patternA = 'Step\s+(\d{1,3})\s*/\s*(\d{1,3})\s*완료'
foreach ($m in [regex]::Matches($response, $patternA, 'IgnoreCase')) {
    $stepNum = [int]$m.Groups[1].Value
    $declaredTotal = [int]$m.Groups[2].Value
    if ($stepNum -ge 1 -and $stepNum -le $totalSteps -and $declaredTotal -eq $totalSteps) {
        [void]$foundSteps.Add($stepNum)
    }
}

# 패턴 B: 줄 시작/이모지/화살표 뒤의 "Step NNN 완료" (총수 없는 약식 보고)
$patternB = '(?m)(?:^|[\s✅→])Step\s+(\d{1,3})\s+완료'
foreach ($m in [regex]::Matches($response, $patternB, 'IgnoreCase')) {
    $stepNum = [int]$m.Groups[1].Value
    if ($stepNum -ge 1 -and $stepNum -le $totalSteps) {
        [void]$foundSteps.Add($stepNum)
    }
}

# 3) 실존 Step 파일 검증: step_archive/stepNNN.md 파일이 실제 존재해야 완료로 인정
#    (대화 본문 오탐, 테스트 주입 문자열 차단)
$validSteps = New-Object System.Collections.Generic.HashSet[int]
foreach ($s in $foundSteps) {
    $stepFile = Join-Path $stepArchive ("step{0:D3}.md" -f $s)
    if (Test-Path $stepFile) {
        [void]$validSteps.Add($s)
    }
}

# 4) 기존 completed_steps와 병합
$existing = New-Object System.Collections.Generic.HashSet[int]
foreach ($s in @($progress.completed_steps)) { [void]$existing.Add([int]$s) }

$completedNew = @()
foreach ($s in $validSteps) {
    if (-not $existing.Contains($s)) { $completedNew += $s }
}

if ($completedNew.Count -gt 0) {
    $allCompleted = @($existing) + $completedNew | Sort-Object -Unique
    $progress.completed_steps = @($allCompleted)

    $maxCompleted = ($allCompleted | Measure-Object -Maximum).Maximum
    if ($maxCompleted -lt $progress.total_steps) {
        $progress.current_step = $maxCompleted + 1
    } else {
        $progress.current_step = $progress.total_steps
    }

    Write-WriterLog "Newly completed: $($completedNew -join ', ')"
    Write-WriterLog "Total: $($progress.completed_steps.Count)/$($progress.total_steps)"
}

# 4) 세션 이력 업데이트 (필드 없으면 생성)
if (-not $progress.PSObject.Properties.Name.Contains('session_history')) {
    $progress | Add-Member -NotePropertyName 'session_history' -NotePropertyValue @() -Force
}
$sessions = @($progress.session_history)
if ($sessions.Count -gt 0) {
    $lastSession = $sessions[-1]
    if ($lastSession) {
        $lastSession | Add-Member -NotePropertyName 'ended_at' -NotePropertyValue (Get-Date -Format 'yyyy-MM-ddTHH:mm:ss') -Force
        $lastSession | Add-Member -NotePropertyName 'steps_completed' -NotePropertyValue $completedNew.Count -Force
        $sessions[-1] = $lastSession
        $progress.session_history = $sessions
    }
}

$progress.last_updated = (Get-Date -Format 'yyyy-MM-ddTHH:mm:ss')
$progress | ConvertTo-Json -Depth 5 -Compress | Out-File -FilePath $progressFile -Encoding UTF8 -Force

Write-WriterLog "Progress saved"
exit 0
