; Hi!XNS Windows Installer
; Run from project root: makensis build/windows/installer.nsi

Name "Hi!XNS"
OutFile "build\bin\HiXNS-Windows-x64-Setup.exe"
InstallDir "$PROGRAMFILES64\Hi!XNS"
RequestExecutionLevel admin
ManifestDPIAware true
ShowInstDetails show
ShowUninstDetails show

; CRITICAL: Change to project root so File paths resolve correctly
; This script lives at build/windows/installer.nsi, so go up 2 levels
!cd "..\.."

Section "Install"
  SetOutPath "$INSTDIR"

  ; Main application binary
  File "build\bin\hixns-agent.exe"

  ; Hermes Agent (Python source + scripts)
  SetOutPath "$INSTDIR\hermes-agent"
  File /r /x __pycache__ /x *.pyc "build\bin\hermes-agent\*.*"

  ; Hermes Python (embedded runtime + site-packages)
  SetOutPath "$INSTDIR\hermes-python"
  File /r /x __pycache__ /x *.pyc "build\bin\hermes-python\*.*"

  ; Start menu shortcut
  CreateDirectory "$SMPROGRAMS\Hi!XNS"
  CreateShortCut "$SMPROGRAMS\Hi!XNS\Hi!XNS.lnk" "$INSTDIR\hixns-agent.exe"

  ; Desktop shortcut
  CreateShortCut "$DESKTOP\Hi!XNS.lnk" "$INSTDIR\hixns-agent.exe"

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

  Delete "$SMPROGRAMS\Hi!XNS\Hi!XNS.lnk"
  RMDir "$SMPROGRAMS\Hi!XNS"
  Delete "$DESKTOP\Hi!XNS.lnk"

  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HiXNS"
SectionEnd
