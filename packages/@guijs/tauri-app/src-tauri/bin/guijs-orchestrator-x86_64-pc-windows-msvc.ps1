#!/usr/bin/env pwsh

$mode = $args[0]
$path = $args[1]
$appName = "guijs"

if ($mode -eq "run") {
    $path_id = Start-Process -FilePath $path -PassThru -NoNewWindow 
    
    Get-Process -Name $appName, msiexec -ErrorAction SilentlyContinue | Wait-Process  
    Stop-Process -Id $path_id
    stop-process -Id $PID
}