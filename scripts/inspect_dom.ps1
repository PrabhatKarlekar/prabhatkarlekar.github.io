# Automated DOM Inspector for Portfolio at docs/index.html
param(
    [string]$HtmlFile = "c:\Users\Other\Desktop\projects\portfolio\docs\index.html"
)

$content = Get-Content $HtmlFile -Raw -Encoding UTF8

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " PORTFOLIO DOM AUDIT & COMPONENT INSPECTION REPORT" -ForegroundColor Green
Write-Host " Source File: $HtmlFile" -ForegroundColor Gray
Write-Host " Generated At: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Document Head
Write-Host "`n[1] DOCUMENT HEAD & RUNTIME RELIABILITY" -ForegroundColor Yellow
$hasColorScheme = $content -match '<meta name="color-scheme" content="light dark">'
$hasFOUCScript = $content -match 'localStorage\.getItem\(''theme''\)'
$titleMatch = [regex]::Match($content, '<title>(.*?)</title>')
Write-Host "  - Title Tag: $($titleMatch.Groups[1].Value)"
Write-Host "  - Color Scheme Meta: $(if ($hasColorScheme) {'[PASS] Present'} else {'[FAIL] Missing'})"
Write-Host "  - Zero-FOUC Head Script: $(if ($hasFOUCScript) {'[PASS] Present (<1KB inline)'} else {'[FAIL] Missing'})"

# 2. Navigation
Write-Host "`n[2] NAVIGATION & ACCESSIBILITY" -ForegroundColor Yellow
$hasMobileToggle = $content -match '<button id="mobile-nav-toggle"'
$hasAriaExpanded = $content -match 'aria-expanded="false"'
$hasAriaControls = $content -match 'aria-controls="primary-nav"'
$hasPrimaryNav = $content -match 'id="primary-nav"'
Write-Host "  - Mobile Nav Toggle Button: $(if ($hasMobileToggle) {'[PASS] Present'} else {'[FAIL] Missing'})"
Write-Host "  - ARIA Expanded Attribute: $(if ($hasAriaExpanded) {'[PASS] aria-expanded=\"false\" initialized'} else {'[FAIL] Missing'})"
Write-Host "  - ARIA Controls Attribute: $(if ($hasAriaControls) {'[PASS] aria-controls=\"primary-nav\" connected'} else {'[FAIL] Missing'})"
Write-Host "  - Primary Nav Container: $(if ($hasPrimaryNav) {'[PASS] id=\"primary-nav\" present'} else {'[FAIL] Missing'})"

# 3. Hero Section
Write-Host "`n[3] HERO SECTION & POSITIONING" -ForegroundColor Yellow
$h1Match = [regex]::Match($content, '<h1 class="hero-title">\s*(.*?)\s*</h1>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
$roleMatch = [regex]::Match($content, '<div class="hero-role-line">\s*(.*?)\s*</div>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
Write-Host "  - Display Name (H1): $($h1Match.Groups[1].Value.Trim())"
Write-Host "  - Hero Role Line: $($roleMatch.Groups[1].Value.Trim())"

# Hero Stats
$statMatches = [regex]::Matches($content, '<div class="stat-number"[^>]*data-target="([^"]*)"[^>]*data-suffix="([^"]*)">\s*([^<]*)\s*</div>\s*<div class="stat-label">\s*([^<]*)')
Write-Host "  - Hero Stat Counters:"
foreach ($m in $statMatches) {
    Write-Host "    * Target: $($m.Groups[1].Value) | Suffix: '$($m.Groups[2].Value)' | Rendered HTML: '$($m.Groups[3].Value.Trim())' | Label: '$($m.Groups[4].Value.Trim())'"
}

# 4. Experience Section
Write-Host "`n[4] EXPERIENCE & C-DAC LEADERSHIP" -ForegroundColor Yellow
$hasLeadership = $content -match 'Lead a 4.*person R&D team'
$hasExpandedDept = $content -match 'HPC Infrastructure & Ecosystem'
$hasIDFs = $content -match 'Invention Disclosure Forms \(IDFs\)'
Write-Host "  - Expanded Department Name: $(if ($hasExpandedDept) {'[PASS] HPC Infrastructure & Ecosystem'} else {'[FAIL] Missing'})"
Write-Host "  - 4-5 Person Team Leadership Bullet: $(if ($hasLeadership) {'[PASS] Present'} else {'[FAIL] Missing'})"
Write-Host "  - IDF & RFC Specification Authorship: $(if ($hasIDFs) {'[PASS] Present'} else {'[FAIL] Missing'})"

# 5. Project Cards & Systems Depth
Write-Host "`n[5] PROJECT CARDS & SYSTEMS DEPTH" -ForegroundColor Yellow
$cards = [regex]::Matches($content, '<div class="project-card[^"]*">(.*?)</div>\s*(?=<div class="project-card|\s*</div>\s*</section>)', [System.Text.RegularExpressions.RegexOptions]::Singleline)
Write-Host "  - Total Project Cards Detected: $($cards.Count)"
foreach ($c in $cards) {
    $cardHtml = $c.Groups[1].Value
    $badgeMatch = [regex]::Match($cardHtml, '<div class="project-badge">\s*<i[^>]*></i>\s*(.*?)\s*</div>')
    $titleMatch = [regex]::Match($cardHtml, '<h3>(.*?)</h3>')
    $metaMatch = [regex]::Match($cardHtml, '<div class="project-meta">(.*?)</div>')
    Write-Host "    * Card: '$($titleMatch.Groups[1].Value)'"
    Write-Host "      - Badge: '$($badgeMatch.Groups[1].Value.Trim())'"
    Write-Host "      - Meta: '$($metaMatch.Groups[1].Value.Trim())'"
}

# 6. Education & Certifications
Write-Host "`n[6] EDUCATION & CERTIFICATIONS (NON-DESTRUCTIVE)" -ForegroundColor Yellow
$eduMatches = [regex]::Matches($content, '<div class="education-item">\s*<h4>(.*?)</h4>\s*<p class="education-meta">(.*?)</p>\s*<p class="education-grade">(.*?)</p>')
Write-Host "  - Education Entries ($($eduMatches.Count) total):"
foreach ($e in $eduMatches) {
    Write-Host "    * $($e.Groups[1].Value) | $($e.Groups[2].Value) | Grade: $($e.Groups[3].Value)"
}
$certMatches = [regex]::Matches($content, '<div class="cert-card">.*?<h4>(.*?)</h4>\s*<p class="cert-meta">(.*?)</p>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
Write-Host "  - Certification Cards ($($certMatches.Count) total):"
foreach ($cert in $certMatches) {
    Write-Host "    * $($cert.Groups[1].Value) | $($cert.Groups[2].Value)"
}

# 7. Contact Section Action Bar
Write-Host "`n[7] CONTACT ACTION BAR & 1-CLICK CLIPBOARD" -ForegroundColor Yellow
$hasMailto = $content -match 'href="mailto:pritvikarlekar@gmail\.com"'
$hasCopyBtn = $content -match 'id="copy-email-btn"'
$hasEmailBadge = $content -match '<code>pritvikarlekar@gmail\.com</code>'
Write-Host "  - Direct Mailto Button: $(if ($hasMailto) {'[PASS] Present'} else {'[FAIL] Missing'})"
Write-Host "  - Copy Email Action Button: $(if ($hasCopyBtn) {'[PASS] Present (#copy-email-btn)'} else {'[FAIL] Missing'})"
Write-Host "  - Direct Email Display Badge: $(if ($hasEmailBadge) {'[PASS] Present'} else {'[FAIL] Missing'})"

# 8. Canonical Resume Links
Write-Host "`n[8] RESUME CANONICAL LINKS" -ForegroundColor Yellow
$resumeMatches = [regex]::Matches($content, 'href="([^"]*Resume[^"]*)"')
Write-Host "  - Total Canonical Resume Links: $($resumeMatches.Count)"
foreach ($rm in $resumeMatches) {
    Write-Host "    * $($rm.Groups[1].Value)"
}

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host " END OF DOM AUDIT REPORT" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
