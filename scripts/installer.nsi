!include "MUI2.nsh"
!include "x64.nsh"

Name "Hi!XNS"
OutFile "..\build\bin\HiXNS-Windows-x64-Setup.exe"
InstallDir "$PROGRAMFILES64\HiXNS"
RequestExecutionLevel admin

!define MUI_ABORTWARNING

!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

!insertmacro MUI_LANGUAGE "English"

Section "Hi!XNS"
  SetOutPath "$INSTDIR"
  File "..\build\bin\hixns-agent.exe"
  File /r "..\build\bin\hermes-agent"
  File /r "..\build\bin\hermes-python"
  WriteUninstaller "$INSTDIR\uninstall.exe"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HiXNS" "DisplayName" "Hi!XNS"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HiXNS" "UninstallString" "$INSTDIR\uninstall.exe"
SectionEnd

Section "Start Menu Shortcuts"
  CreateDirectory "$SMPROGRAMS\Hi!XNS"
  CreateShortCut "$SMPROGRAMS\Hi!XNS\Hi!XNS.lnk" "$INSTDIR\hixns-agent.exe"
  CreateShortCut "$SMPROGRAMS\Hi!XNS\Uninstall.lnk" "$INSTDIR\uninstall.exe"
SectionEnd

Section "Desktop Shortcut"
  CreateShortCut "$DESKTOP\Hi!XNS.lnk" "$INSTDIR\hixns-agent.exe"
SectionEnd

Section "Uninstall"
  RMDir /r "$INSTDIR\hermes-agent"
  RMDir /r "$INSTDIR\hermes-python"
  Delete "$INSTDIR\hixns-agent.exe"
  Delete "$INSTDIR\uninstall.exe"
  RMDir "$INSTDIR"
  Delete "$DESKTOP\Hi!XNS.lnk"
  Delete "$SMPROGRAMS\Hi!XNS\Hi!XNS.lnk"
  Delete "$SMPROGRAMS\Hi!XNS\Uninstall.lnk"
  RMDir "$SMPROGRAMS\Hi!XNS"
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\HiXNS"
SectionEnd
