; Hi!XNS NSIS Installer Script
; Includes main binary + Hermes Agent environment
; Run from project root: makensis build/windows/installer.nsi

!include "MUI2.nsh"
!include "FileFunc.nsh"

!define PRODUCT_NAME "Hi!XNS"
!define PRODUCT_VERSION "0.9.5"
!define COMPANY_NAME "Hi!XNS"

Name "${PRODUCT_NAME}"
OutFile "build\bin\HiXNS-Windows-x64-Setup.exe"
InstallDir "$PROGRAMFILES64\${PRODUCT_NAME}"
RequestExecutionLevel admin
ManifestDPIAware true

!define MUI_WELCOMEPAGE_TITLE "Welcome to ${PRODUCT_NAME} Setup"
!define MUI_FINISHPAGE_RUN "$INSTDIR\${PRODUCT_NAME}.exe"

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_LANGUAGE "English"

Section "Hi!XNS Agent" SecMain
  SetOutPath "$INSTDIR"

  ; Main binary
  File "build\bin\hixns-agent.exe"

  ; Hermes Agent (Python source + scripts)
  SetOutPath "$INSTDIR\hermes-agent"
  File /r /x __pycache__ /x *.pyc "build\bin\hermes-agent\*.*"

  ; Hermes Python runtime (embedded Python + site-packages)
  SetOutPath "$INSTDIR\hermes-python"
  File /r /x __pycache__ /x *.pyc "build\bin\hermes-python\*.*"

  ; Start menu
  CreateDirectory "$SMPROGRAMS\${PRODUCT_NAME}"
  CreateShortcut "$SMPROGRAMS\${PRODUCT_NAME}\${PRODUCT_NAME}.lnk" "$INSTDIR\${PRODUCT_NAME}.exe"
  CreateShortcut "$DESKTOP\${PRODUCT_NAME}.lnk" "$INSTDIR\${PRODUCT_NAME}.exe"

  WriteUninstaller "$INSTDIR\Uninstall.exe"

  WriteRegStr HKLM "Software\${COMPANY_NAME}\${PRODUCT_NAME}" "InstallDir" "$INSTDIR"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "DisplayName" "${PRODUCT_NAME}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "UninstallString" '"$INSTDIR\Uninstall.exe"'
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "DisplayVersion" "${PRODUCT_VERSION}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "Publisher" "${COMPANY_NAME}"
SectionEnd

Section "Uninstall"
  RMDir /r "$INSTDIR\hermes-agent"
  RMDir /r "$INSTDIR\hermes-python"
  Delete "$INSTDIR\${PRODUCT_NAME}.exe"
  Delete "$INSTDIR\Uninstall.exe"
  RMDir "$INSTDIR"
  Delete "$SMPROGRAMS\${PRODUCT_NAME}\${PRODUCT_NAME}.lnk"
  RMDir "$SMPROGRAMS\${PRODUCT_NAME}"
  Delete "$DESKTOP\${PRODUCT_NAME}.lnk"
  DeleteRegKey HKLM "Software\${COMPANY_NAME}\${PRODUCT_NAME}"
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
SectionEnd