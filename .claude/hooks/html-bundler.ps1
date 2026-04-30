# html-bundler.ps1 - HTML 번들러 (src/ -> dist/index.html)
# src/index.html + src/js/*.js + src/css/*.css -> dist/index.html 단일 파일
param()

$ErrorActionPreference = "Continue"
$projectRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent

$srcDir = Join-Path $projectRoot "src"
$distDir = Join-Path $projectRoot "dist"
$srcHtml = Join-Path $srcDir "index.html"

function Write-Log($msg) {
    Write-Host $msg
}

Write-Log "=== HTML Bundler Start ==="

# src/index.html 확인
if (-not (Test-Path $srcHtml)) {
    Write-Log "ERROR: src/index.html not found"
    exit 1
}

# dist 디렉토리 생성
if (-not (Test-Path $distDir)) {
    New-Item -ItemType Directory -Path $distDir -Force | Out-Null
}

$html = Get-Content $srcHtml -Raw -Encoding UTF8

# CSS 파일 인라인화
$cssFiles = Get-ChildItem -Path (Join-Path $srcDir "css") -Filter "*.css" -ErrorAction SilentlyContinue | Sort-Object Name
if ($cssFiles) {
    $cssContent = ""
    foreach ($cssFile in $cssFiles) {
        Write-Log "Bundling CSS: $($cssFile.Name)"
        $cssContent += "/* === $($cssFile.Name) === */`n"
        $cssContent += (Get-Content $cssFile.FullName -Raw -Encoding UTF8)
        $cssContent += "`n"
    }
    
    # <link> 태그를 <style>로 교체
    $html = $html -replace '(?s)<link[^>]*rel="stylesheet"[^>]*href="css/[^"]*"[^>]*/?\s*>', ''
    
    # </head> 앞에 <style> 삽입
    $styleTag = "<style>`n$cssContent</style>"
    $html = $html -replace '(</head>)', "$styleTag`n`$1"
}

# JS 파일 인라인화 (의존성 순서: domain -> ui -> data -> app)
$jsDir = Join-Path $srcDir "js"
if (Test-Path $jsDir) {
    # 하위 디렉토리 포함 재귀 수집, tests 제외
    $jsFilesAll = Get-ChildItem -Path $jsDir -Filter "*.js" -Recurse -ErrorAction SilentlyContinue | Where-Object { $_.FullName -notmatch '\\tests\\' }

    # 로드 순서 제어: domain -> data -> ui -> app.js (app.js는 최후)
    function Get-LoadPriority($path) {
        if ($path -match '\\app\.js$')    { return 9 }
        if ($path -match '\\js\\ui\\')    { return 3 }
        if ($path -match '\\js\\data\\')  { return 2 }
        if ($path -match '\\js\\domain\\'){ return 1 }
        return 5
    }
    $jsFiles = $jsFilesAll | Sort-Object @{Expression={Get-LoadPriority $_.FullName}}, Name

    if ($jsFiles) {
        $jsContent = ""
        foreach ($jsFile in $jsFiles) {
            Write-Log "Bundling JS: $($jsFile.FullName.Substring($srcDir.Length+1))"
            $fileContent = Get-Content $jsFile.FullName -Raw -Encoding UTF8

            # ES module export/import 제거 (multiline 모드)
            # export class/function/const -> class/function/const
            $fileContent = [regex]::Replace($fileContent, '(?m)^\s*export\s+(default\s+)?', '')
            # import X from "..."; / import { X } from "..."; / import "...";
            $fileContent = [regex]::Replace($fileContent, '(?m)^\s*import\s+.*?from\s+[''"].*?[''"]\s*;?\s*$', '')
            $fileContent = [regex]::Replace($fileContent, '(?m)^\s*import\s+[''"].*?[''"]\s*;?\s*$', '')
            # 여러 줄에 걸친 import { a, b, c } from "..." 처리
            $fileContent = [regex]::Replace($fileContent, '(?s)^\s*import\s+\{[^}]+\}\s+from\s+[''"][^''"]+[''"]\s*;?\s*', '', [System.Text.RegularExpressions.RegexOptions]::Multiline)

            $jsContent += "// === $($jsFile.FullName.Substring($srcDir.Length+1)) ===`n"
            $jsContent += $fileContent
            $jsContent += "`n"
        }

        # <script> 태그 제거 (type=module 포함)
        $html = $html -replace '(?s)<script[^>]*src="js/[^"]*"[^>]*>\s*</script>', ''

        # </body> 앞에 일반 <script> 삽입 (type=module 아님, 번들된 단일 script)
        $scriptTag = "<script>`n$jsContent</script>"
        $html = $html -replace '(</body>)', "$scriptTag`n`$1"
    }
}

# dist/index.html 출력
$distHtml = Join-Path $distDir "index.html"
[System.IO.File]::WriteAllText($distHtml, $html, [System.Text.UTF8Encoding]::new($false))

$fileSize = [math]::Round((Get-Item $distHtml).Length / 1024, 2)
Write-Log "=== HTML Bundler Complete ==="
Write-Log "Output: dist/index.html (${fileSize}KB)"
Write-Log "file:// compatible: YES"

exit 0
