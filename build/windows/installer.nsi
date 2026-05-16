; Hi!XNS NSIS Installer Script
; Includes main binary + Hermes Agent environment

!include "MUI2.nsh"
!include "FileFunc.nsh"

; Product info
!define PRODUCT_NAME "Hi!XNS"
!define PRODUCT_VERSION "0.9.5"
!define COMPANY_NAME "Hi!XNS"
!define OUTPUT_FILE "HiXNS-Windows-x64-Setup.exe"

; Build paths (passed from CI)
!ifndef PROJECT_ROOT
  !define PROJECT_ROOT "."
!endif
!ifndef BUILD_DIR
  !define BUILD_DIR "build/bin"
!endif

; Installer settings
Name "${PRODUCT_NAME}"
OutFile "${OUTPUT_FILE}"
InstallDir "$PROGRAMFILES64\${PRODUCT_NAME}"
RequestExecutionLevel admin
ManifestDPIAware true

; Pages
; !define MUI_ICON "${PROJECT_ROOT}\build\appicon.ico"
; !define MUI_UNICON "${PROJECT_ROOT}\build\appicon.ico"
!define MUI_WELCOMEPAGE_TITLE "欢迎安装 ${PRODUCT_NAME}"
!define MUI_FINISHPAGE_RUN "$INSTDIR\${PRODUCT_NAME}.exe"

!insertmacro MUI_PAGE_WELCOME
; !insertmacro MUI_PAGE_LICENSE "LICENSE"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

!insertmacro MUI_LANGUAGE "English"
!insertmacro MUI_LANGUAGE "SimpChinese"

; Installation
Section "Hi!XNS Agent" SecMain
  SetOutPath "$INSTDIR"
  
  ; Main application
  File "${PROJECT_ROOT}\${BUILD_DIR}\hixns-agent.exe"
  
  ; Hermes Agent environment
  SetOutPath "$INSTDIR\hermes-agent"
  File /r "${PROJECT_ROOT}\${BUILD_DIR}\hermes-agent\*.*"
  
  ; Hermes Python environment
  SetOutPath "$INSTDIR\hermes-python"
  File /r "${PROJECT_ROOT}\${BUILD_DIR}\hermes-python\*.*"
  
  ; Create start menu shortcut
  CreateDirectory "$SMPROGRAMS\${PRODUCT_NAME}"
  CreateShortcut "$SMPROGRAMS\${PRODUCT_NAME}\${PRODUCT_NAME}.lnk" "$INSTDIR\${PRODUCT_NAME}.exe"
  CreateShortcut "$DESKTOP\${PRODUCT_NAME}.lnk" "$INSTDIR\${PRODUCT_NAME}.exe"
  
  ; Write uninstaller
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  
  ; Write registry info
  WriteRegStr HKLM "Software\${COMPANY_NAME}\${PRODUCT_NAME}" "InstallDir" "$INSTDIR"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "DisplayName" "${PRODUCT_NAME}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "UninstallString" "$\"$INSTDIR\Uninstall.exe$\""
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "DisplayVersion" "${PRODUCT_VERSION}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "Publisher" "${COMPANY_NAME}"
SectionEnd

; Uninstall
Section "Uninstall"
  ; Remove files
  RMDir /r "$INSTDIR\hermes-agent"
  RMDir /r "$INSTDIR\hermes-python"
  Delete "$INSTDIR\${PRODUCT_NAME}.exe"
  Delete "$INSTDIR\Uninstall.exe"
  RMDir "$INSTDIR"
  
  ; Remove shortcuts
  Delete "$SMPROGRAMS\${PRODUCT_NAME}\${PRODUCT_NAME}.lnk"
  RMDir "$SMPROGRAMS\${PRODUCT_NAME}"
  Delete "$DESKTOP\${PRODUCT_NAME}.lnk"
  
  ; Remove registry
  DeleteRegKey HKLM "Software\${COMPANY_NAME}\${PRODUCT_NAME}"
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
SectionEnd
