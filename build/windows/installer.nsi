; Hi!XNS Windows Installer
; Minimal NSIS — installs app + Hermes environment

!include "FileFunc.nsh"

Name "Hi!XNS"
OutFile "build\bin\HiXNS-Windows-x64-Setup.exe"
InstallDir "$PROGRAMFILES64\HiXNS"
RequestExecutionLevel admin
ManifestDPIAware true
ShowInstDetails show
ShowUninstDetails show

Section "Install"
  SetOutPath "$INSTDIR"

  ; Main application
  File "build\bin\hixns-agent.exe"

  ; Hermes Agent (Python scripts)
  SetOutPath "$INSTDIR\hermes-agent"
  File /r /x __pycache__ /x *.pyc "build\bin\hermes-agent\*"

  ; Hermes Python (embedded runtime + packages)
  SetOutPath "$INSTDIR\hermes-python"
  File /r /x __pycache__ /x *.pyc "build\bin\hermes-python\*"

  ; Start menu shortcut
  CreateDirectory "$SMPROGRAMS\HiXNS"
  CreateShortCut "$SMPROGRAMS\HiXNS\HiXNS.lnk" "$INSTDIR\hixns-agent.exe"

  ; Desktop shortcut
  CreateShortCut "$DESKTOP\HiXNS.lnk" "$INSTDIR\hixns-agent.exe"

  ; Uninstaller
  WriteUninstaller "$INSTDIR\Uninstall.exe"

  ; Add/Remove Programs entry
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HiXNS" "DisplayName" "Hi!XNS AI Agent"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HiXNS" "UninstallString" '"$INSTDIR\Uninstall.exe"'
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HiXNS" "DisplayVersion" "0.9.5"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HiXNS" "Publisher" "Hi!XNS"
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HiXNS" "NoModify" 1
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HiXNS" "NoRepair" 1
SectionEnd

Section "Uninstall"
  RMDir /r "$INSTDIR\hermes-agent"
  RMDir /r "$INSTDIR\hermes-python"
  Delete "$INSTDIR\hixns-agent.exe"
  Delete "$INSTDIR\Uninstall.exe"
  RMDir "$INSTDIR"

  Delete "$SMPROGRAMS\HiXNS\HiXNS.lnk"
  RMDir "$SMPROGRAMS\HiXNS"
  Delete "$DESKTOP\HiXNS.lnk"

  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HiXNS"
SectionEnd