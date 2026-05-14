; Hi!XNS Agent — Inno Setup 安装脚本
; 使用: iscc scripts/installer.iss

#define MyAppName "Hi!XNS"
#define MyAppVersion "0.1.0"
#define MyAppPublisher "Hi!XNS"
#define MyAppURL "https://hixns.com"
#define MyAppExeName "hixns-agent.exe"

[Setup]
AppId={{A3F8E2D1-7B4C-4E5F-9A6D-1C2B3D4E5F6A}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
DefaultDirName={autopf}\{#MyAppName}
DefaultGroupName={#MyAppName}
DisableProgramGroupPage=yes
OutputDir=..\build\installer
OutputBaseFilename=HiXNS-Setup-{#MyAppVersion}
SetupIconFile=..\src-tauri\icons\icon.ico
UninstallDisplayIcon={app}\{#MyAppExeName}
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=lowest
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
; 安装界面语言
ShowLanguageDialog=auto

[Languages]
Name: "chinesesimplified"; MessagesFile: "compiler:Languages\ChineseSimplified.isl"
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
; 主程序
Source: "..\build\windows-amd64\hixns-agent.exe"; DestDir: "{app}"; Flags: ignoreversion

; 内嵌 Hermes Agent (完整 venv)
Source: "..\build\windows-amd64\bundled\hermes-agent\*"; DestDir: "{app}\bundled\hermes-agent"; Flags: ignoreversion recursesubdirs createallsubdirs; Excludes: "__pycache__,*.pyc"

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; IconFilename: "{app}\{#MyAppExeName}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; IconFilename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent

[UninstallDelete]
Type: filesandordirs; Name: "{app}\bundled"
