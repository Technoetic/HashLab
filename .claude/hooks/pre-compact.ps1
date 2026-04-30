# pre-compact.ps1
# PreCompact Hook - critical state 재주입
# omc 철학 반영: 컨텍스트 압축 시 progress/baseline/failure_patterns 보존

$ErrorActionPreference = 'Continue'
$logFile = Join-Path $PSScriptRoot 'pre-compact.log'
$timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
Add-Content -Path $logFile -Value "[$timestamp] === Pre-Compact Start ===" -Encoding UTF8

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$critical = @(
    'step_archive\progress.json',
    'step_archive\baseline.json',
    'step_archive\outputs\eval_r3.md'
)

$reminders = @()
foreach ($rel in $critical) {
    $full = Join-Path $repoRoot $rel
    if (Test-Path $full) {
        try {
            $content = Get-Content $full -Raw -Encoding UTF8 -ErrorAction Stop
            if ($content.Length -gt 4000) {
                $content = $content.Substring(0, 4000) + "`n... [truncated]"
            }
            $reminders += "<remember priority>`n[$rel]`n$content`n</remember>"
            Add-Content -Path $logFile -Value "[$timestamp] Preserved: $rel ($($content.Length) chars)" -Encoding UTF8
        } catch {
            Add-Content -Path $logFile -Value "[$timestamp] WARN read failed: $rel - $_" -Encoding UTF8
        }
    }
}

if ($reminders.Count -gt 0) {
    Write-Output ($reminders -join "`n`n")
}

Add-Content -Path $logFile -Value "[$timestamp] === Pre-Compact Complete (preserved $($reminders.Count)) ===" -Encoding UTF8
exit 0
