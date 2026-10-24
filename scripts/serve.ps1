# Lightweight local HTTP server for previewing the portfolio in any browser
param(
    [int]$Port = 8000,
    [string]$Root = "docs"
)

$targetPath = Join-Path $PSScriptRoot "..\$Root"
$targetPath = [System.IO.Path]::GetFullPath($targetPath)

if (-not (Test-Path $targetPath)) {
    Write-Error "Root directory not found: $targetPath"
    exit 1
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")

try {
    $listener.Start()
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host " Portfolio Local Dev Server Running" -ForegroundColor Green
    Write-Host " URL: http://localhost:$Port/" -ForegroundColor Yellow
    Write-Host " Serving files from: $targetPath" -ForegroundColor Gray
    Write-Host " Press Ctrl+C to stop the server" -ForegroundColor Gray
    Write-Host "==========================================================" -ForegroundColor Cyan

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $relPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($relPath) -or $relPath.EndsWith('/')) {
            $relPath += "index.html"
        }

        # URL decode path
        $relPath = [System.Uri]::UnescapeDataString($relPath)
        $filePath = Join-Path $targetPath $relPath

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".json" { "application/json" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".svg"  { "image/svg+xml" }
                ".ico"  { "image/x-icon" }
                ".pdf"  { "application/pdf" }
                ".txt"  { "text/plain; charset=utf-8" }
                default { "application/octet-stream" }
            }

            $response.ContentType = $contentType
            $response.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate")
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $relPath")
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $response.Close()
    }
} catch {
    Write-Host "Server stopped: $_" -ForegroundColor Yellow
} finally {
    $listener.Stop()
    $listener.Close()
}
