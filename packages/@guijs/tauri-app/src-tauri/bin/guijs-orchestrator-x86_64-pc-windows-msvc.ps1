#!/usr/bin/env pwsh

# capture arguments
$mode = $args[0]
$path = $args[1]

# define process names
$appName = "guijs"
$webviewProcessName = "Win32WebViewHost"

# enable loopback
CheckNetIsolation.exe LoopbackExempt -a -n="Microsoft.Win32WebViewHost_cw5n1h2txyewy"

# if argument mode equals run
if ($mode -eq "run") {
    # start the server process without opening a new window
    $path_id = Start-Process -FilePath $path -PassThru -NoNewWindow 
    
    # get the guijs process and wait until it stops before executing the rest of the code
    Get-Process -Name $appName, msiexec -ErrorAction SilentlyContinue | Wait-Process  
    
    # stop the server process
    Stop-Process -Id $path_id

    # stop the webview process
    Stop-Process -Id $webviewProcessName

    # stop the powershell process
    Stop-process -Id $PID
    
}