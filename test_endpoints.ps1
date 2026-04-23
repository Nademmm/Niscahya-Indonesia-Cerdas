Write-Host "=== Testing Endpoints on localhost:3000 ===" -ForegroundColor Cyan
Write-Host ""

$endpoints = @(
    @{ Name = "Home"; Url = "http://localhost:3000/" },
    @{ Name = "Products List"; Url = "http://localhost:3000/products" },
    @{ Name = "Blog"; Url = "http://localhost:3000/blog" },
    @{ Name = "About"; Url = "http://localhost:3000/about" },
    @{ Name = "Contact"; Url = "http://localhost:3000/contact" },
    @{ Name = "Projects"; Url = "http://localhost:3000/projects" },
    @{ Name = "API Products"; Url = "http://localhost:3000/api/products" }
)

$allSuccess = $true

foreach ($endpoint in $endpoints) {
    try {
        $response = Invoke-WebRequest -Uri $endpoint.Url -Method GET -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        $statusCode = $response.StatusCode
        Write-Host "$($endpoint.Name): HTTP $statusCode" -ForegroundColor Green
    } catch {
        $errorMsg = $_.Exception.Message
        if ($_.Exception.Response) {
            $statusCode = [int]$_.Exception.Response.StatusCode
            Write-Host "$($endpoint.Name): HTTP $statusCode - ERROR" -ForegroundColor Red
            $allSuccess = $false
        } else {
            Write-Host "$($endpoint.Name): Connection Error - $errorMsg" -ForegroundColor Red
            $allSuccess = $false
        }
    }
}

Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
if ($allSuccess) {
    Write-Host "All routes working correctly" -ForegroundColor Green
} else {
    Write-Host "Some routes failed. See above." -ForegroundColor Red
}
