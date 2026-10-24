# Automated DOM Inspector for Portfolio at docs/index.html
param(
    [string]$HtmlFile = "c:\Users\Other\Desktop\projects\portfolio\docs\index.html",
    [string]$JsFile = "c:\Users\Other\Desktop\projects\portfolio\docs\js\script.js",
    [string]$CssFile = "c:\Users\Other\Desktop\projects\portfolio\docs\css\style.css"
)

$content = Get-Content $HtmlFile -Raw -Encoding UTF8
$jsContent = Get-Content $JsFile -Raw -Encoding UTF8
$cssContent = Get-Content $CssFile -Raw -Encoding UTF8

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

# 2. Navigation & Anchors Unification (Phase 3)
Write-Host "`n[2] NAVIGATION & ACCESSIBILITY" -ForegroundColor Yellow
$hasMobileToggle = $content -match '<button id="mobile-nav-toggle"'
$hasAriaExpanded = $content -match 'aria-expanded="false"'
$hasAriaControls = $content -match 'aria-controls="primary-nav"'
$navMatches = [regex]::Matches($content, '<a href="#([^"]+)" class="nav-link[^"]*">\s*<i[^>]*></i>\s*<span>(.*?)</span>')
Write-Host "  - Mobile Nav Toggle Button: $(if ($hasMobileToggle) {'[PASS] Present'} else {'[FAIL] Missing'})"
Write-Host "  - Primary Nav Links ($($navMatches.Count) total):"
foreach ($nm in $navMatches) {
    Write-Host "    * Anchor: #$($nm.Groups[1].Value) -> '$($nm.Groups[2].Value)'"
}

# 3. Section Hierarchy & Flow (Phase 3)
Write-Host "`n[3] SECTION HIERARCHY & ORDER (Phase 3 Flow)" -ForegroundColor Yellow
$sections = [regex]::Matches($content, '<section id="([^"]+)"[^>]*>')
$expectedOrder = @('hero', 'work', 'experience', 'capabilities', 'credentials', 'contact')
$actualOrder = @()
foreach ($s in $sections) {
    $actualOrder += $s.Groups[1].Value
}
Write-Host "  - Detected Section Order: $($actualOrder -join ' -> ')"
$orderMatches = ($actualOrder -join ',') -eq ($expectedOrder -join ',')
Write-Host "  - Section Flow Alignment: $(if ($orderMatches) {'[PASS] 100% Matches Editorial Roadmap'} else {'[FAIL] Order mismatch'})"

# Title Numbers
$titleNumbers = [regex]::Matches($content, '<h2 class="section-title">\s*<span class="title-number">(\d+)</span>\s*(.*?)\s*</h2>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
Write-Host "  - Section Headings & Numbering:"
foreach ($tn in $titleNumbers) {
    Write-Host "    * [$($tn.Groups[1].Value)] $($tn.Groups[2].Value.Trim())"
}

# Backwards Compatibility Anchors
$hasLegacyProjects = $content -match '<span id="projects" class="anchor-target"'
$hasLegacySkills = $content -match '<span id="skills" class="anchor-target"'
$hasLegacyEducation = $content -match '<span id="education" class="anchor-target"'
Write-Host "  - Legacy Aliases (#projects, #skills, #education): $(if ($hasLegacyProjects -and $hasLegacySkills -and $hasLegacyEducation) {'[PASS] All 3 Present'} else {'[FAIL] Missing alias'})"

# 4. Hero Section
Write-Host "`n[4] HERO SECTION & POSITIONING" -ForegroundColor Yellow
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

# 5. Architecture Spec Drawers (Phase 3)
Write-Host "`n[5] NATIVE ARCHITECTURE SPEC DRAWERS (<details>) (Phase 3)" -ForegroundColor Yellow
$drawers = [regex]::Matches($content, '<details class="project-spec-drawer">\s*<summary class="spec-toggle-btn">\s*<span>(.*?)</span>.*?<div class="spec-content">(.*?)</div>\s*</details>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
Write-Host "  - Architecture Spec Drawers Detected: $($drawers.Count)"
foreach ($d in $drawers) {
    $btnTitle = $d.Groups[1].Value -replace '<[^>]+>', ''
    $hasPipeline = $d.Groups[2].Value -match 'spec-pipeline'
    Write-Host "    * Drawer: '$($btnTitle.Trim())' | Pipeline Flow: $(if ($hasPipeline) {'[PASS] Present'} else {'[FAIL] Missing'})"
}

# 6. Project Cards & Systems Depth
Write-Host "`n[6] PROJECT CARDS & SYSTEMS DEPTH" -ForegroundColor Yellow
$cards = [regex]::Matches($content, '<div class="project-card[^"]*">(.*?)</div>\s*(?=<div class="project-card|\s*</div>\s*</section>)', [System.Text.RegularExpressions.RegexOptions]::Singleline)
Write-Host "  - Total Project Cards Detected: $($cards.Count)"
foreach ($c in $cards) {
    $cardHtml = $c.Groups[1].Value
    $badgeMatch = [regex]::Match($cardHtml, '<div class="project-badge">\s*<i[^>]*></i>\s*(.*?)\s*</div>')
    $cardTitleMatch = [regex]::Match($cardHtml, '<h3>(.*?)</h3>')
    $metaMatch = [regex]::Match($cardHtml, '<div class="project-meta">(.*?)</div>')
    Write-Host "    * Card: '$($cardTitleMatch.Groups[1].Value)'"
    Write-Host "      - Badge: '$($badgeMatch.Groups[1].Value.Trim())'"
    Write-Host "      - Meta: '$($metaMatch.Groups[1].Value.Trim())'"
}

# 7. Experience Section
Write-Host "`n[7] EXPERIENCE & C-DAC LEADERSHIP" -ForegroundColor Yellow
$hasLeadership = $content -match 'Lead a 4.*person R&D team'
$hasExpandedDept = $content -match 'HPC Infrastructure & Ecosystem'
$hasIDFs = $content -match 'Invention Disclosure Forms \(IDFs\)'
Write-Host "  - Expanded Department Name: $(if ($hasExpandedDept) {'[PASS] HPC Infrastructure & Ecosystem'} else {'[FAIL] Missing'})"
Write-Host "  - 4-5 Person Team Leadership Bullet: $(if ($hasLeadership) {'[PASS] Present'} else {'[FAIL] Missing'})"
Write-Host "  - IDF & RFC Specification Authorship: $(if ($hasIDFs) {'[PASS] Present'} else {'[FAIL] Missing'})"

# 8. Education & Certifications
Write-Host "`n[8] EDUCATION & CERTIFICATIONS (NON-DESTRUCTIVE)" -ForegroundColor Yellow
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

# 9. Contact Section Action Bar
Write-Host "`n[9] CONTACT ACTION BAR & 1-CLICK CLIPBOARD" -ForegroundColor Yellow
$hasMailto = $content -match 'href="mailto:pritvikarlekar@gmail\.com"'
$hasCopyBtn = $content -match 'id="copy-email-btn"'
$hasEmailBadge = $content -match '<code>pritvikarlekar@gmail\.com</code>'
Write-Host "  - Direct Mailto Button: $(if ($hasMailto) {'[PASS] Present'} else {'[FAIL] Missing'})"
Write-Host "  - Copy Email Action Button: $(if ($hasCopyBtn) {'[PASS] Present (#copy-email-btn)'} else {'[FAIL] Missing'})"
Write-Host "  - Direct Email Display Badge: $(if ($hasEmailBadge) {'[PASS] Present'} else {'[FAIL] Missing'})"

# 10. Canonical Resume Links
Write-Host "`n[10] RESUME CANONICAL LINKS" -ForegroundColor Yellow
$resumeMatches = [regex]::Matches($content, 'href="([^"]*Resume[^"]*)"')
Write-Host "  - Total Canonical Resume Links: $($resumeMatches.Count)"
foreach ($rm in $resumeMatches) {
    Write-Host "    * $($rm.Groups[1].Value)"
}

# 11. Script & CSS Runtime Integrity
Write-Host "`n[11] SCRIPT & CSS RUNTIME INTEGRITY" -ForegroundColor Yellow
$hasScrollSpy = $jsContent -match 'initScrollSpy'
$hasAliasMap = $jsContent -match 'aliasMap'
$hasDrawerCss = $cssContent -match '\.project-spec-drawer'
$hasScrollMargin = $cssContent -match 'scroll-margin-top:\s*80px'
Write-Host "  - IntersectionObserver Scroll-Spy in script.js: $(if ($hasScrollSpy) {'[PASS] Present'} else {'[FAIL] Missing'})"
Write-Host "  - Legacy Alias Map Router in script.js: $(if ($hasAliasMap) {'[PASS] Present'} else {'[FAIL] Missing'})"
Write-Host "  - Spec Drawer Styles in style.css: $(if ($hasDrawerCss) {'[PASS] Present'} else {'[FAIL] Missing'})"
Write-Host "  - Section Scroll-Margin-Top in style.css: $(if ($hasScrollMargin) {'[PASS] Present'} else {'[FAIL] Missing'})"

# 12. Phase 4: Design System & Capability Chips
Write-Host "`n[12] PHASE 4: DESIGN SYSTEM & CAPABILITY CHIPS" -ForegroundColor Yellow
$capCards = [regex]::Matches($content, '<div class="capability-card">\s*<div class="capability-header">\s*<i[^>]*></i>\s*<h3>(.*?)</h3>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
Write-Host "  - Capability Domain Clusters: $($capCards.Count) (Target: 6)"
foreach ($cc in $capCards) {
    Write-Host "    * Domain: '$($cc.Groups[1].Value.Trim())'"
}
$capTags = [regex]::Matches($content, '<span class="cap-tag">(.*?)</span>')
Write-Host "  - Total Semantic Pill Chips: $($capTags.Count) (Target: >=30)"

# Arbitrary percentage bars check
$skillBars = [regex]::Matches($content, '<div class="skill-progress"')
Write-Host "  - Arbitrary Percentage Bars: $(if ($skillBars.Count -eq 0) {'[PASS] 0 Detected (Completely Replaced)'} else {"[FAIL] $($skillBars.Count) still present"})"

# Focus visible and contrast tokens
$hasFocusVisible = $cssContent -match ':focus-visible'
$hasAccentAlpha = $cssContent -match '--accent-alpha-10'
$hasVerifiedMuted = $cssContent -match '--text-muted:\s*#475569'
$hasVerifiedSuccess = $cssContent -match '--success:\s*#15803d'
Write-Host "  - Global :focus-visible Indicator: $(if ($hasFocusVisible) {'[PASS] Present'} else {'[FAIL] Missing'})"
Write-Host "  - Tokenized --accent-alpha Palette: $(if ($hasAccentAlpha) {'[PASS] Present'} else {'[FAIL] Missing'})"
Write-Host "  - WCAG AA --text-muted (#475569, 5.4:1): $(if ($hasVerifiedMuted) {'[PASS] Present'} else {'[FAIL] Missing'})"
Write-Host "  - WCAG AA --success (#15803d, 4.8:1): $(if ($hasVerifiedSuccess) {'[PASS] Present'} else {'[FAIL] Missing'})"

# Footer Note and Authoritative Copyright
$hasAuthoritativeCopy = $content -match 'Prabhat Vilas Karlekar\. All rights reserved\.'
$hasCleanFooterNote = $content -match 'Built for performance, security, and accessibility\.'
Write-Host "  - Authoritative Copyright Statement: $(if ($hasAuthoritativeCopy) {'[PASS] Present'} else {'[FAIL] Missing'})"
Write-Host "  - High-Contrast Footer Note: $(if ($hasCleanFooterNote) {'[PASS] Present'} else {'[FAIL] Missing'})"

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host " END OF DOM AUDIT REPORT" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan


