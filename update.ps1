# 一键更新脚本：把本地改动提交并推送到 GitHub
# 用法：在项目目录运行  .\update.ps1            （自动生成提交说明）
#       或            .\update.ps1 "完成17-4页面"

param([string]$Message)

$ErrorActionPreference = "Continue"
Set-Location $PSScriptRoot

# 1. 检查有没有改动
$changes = git status --porcelain
if (-not $changes) {
    Write-Host "没有需要提交的改动，已是最新状态。" -ForegroundColor Yellow
    exit 0
}

# 2. 没有指定说明时，用改动的文件名自动生成
if (-not $Message) {
    $names = $changes | ForEach-Object { $_.Substring(3).Trim([char]34) }
    $Message = "更新：" + ($names -join "、")
}

# 3. 提交
git add -A
git commit -m $Message | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "提交失败，请检查 Git 报错。" -ForegroundColor Red
    exit 1
}
Write-Host "已提交：$Message" -ForegroundColor Green

# 4. 推送（本机 SSH 22 端口不通，统一走 HTTPS + schannel 证书后端）
git -c http.sslBackend=schannel push origin main
if ($LASTEXITCODE -eq 0) {
    Write-Host "已推送到 GitHub：https://github.com/523zyx/zyx" -ForegroundColor Green
} else {
    Write-Host "推送失败，检查网络后重试：git -c http.sslBackend=schannel push origin main" -ForegroundColor Red
    exit 1
}