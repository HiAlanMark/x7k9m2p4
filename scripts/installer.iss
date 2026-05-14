; Hi!XNS Agent — Inno Setup 安装脚本
; 构建: iscc scripts/installer.iss

#define MyAppName "Hi!XNS"
#define MyAppVersion "0.3.0"
#define MyAppPublisher "Hi!XNS"
#define MyAppURL "https://hixns.com"
#define MyAppExeName "hixns-agent.exe"

[Setup]
AppId={{A3F8E2D1-7B4C-4E5F-9A6D-1C2B3D4E5F6A}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
DefaultDirName={autopf}\{#MyAppName}
DefaultGroupName={#MyAppName}
DisableProgramGroupPage=yes
; 安装/卸载图标
SetupIconFile=..\src-tauri\icons\icon.ico
UninstallDisplayIcon={app}\{#MyAppExeName}
UninstallDisplayName={#MyAppName}
; 输出
OutputDir=..\build\installer
OutputBaseFilename=HiXNS-Setup-{#MyAppVersion}
; 压缩
Compression=lzma2/ultra64
SolidCompression=yes
; 界面
WizardStyle=modern
WizardImageFile=compiler:WizModernImage.bmp
WizardSmallImageFile=compiler:WizModernSmallImage.bmp
; 权限
PrivilegesRequired=lowest
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
; 语言
ShowLanguageDialog=auto
; 版本信息
VersionInfoVersion={#MyAppVersion}
VersionInfoCompany={#MyAppPublisher}
VersionInfoDescription={#MyAppName} AI Agent
VersionInfoCopyright=Copyright (c) 2025 {#MyAppPublisher}
VersionInfoProductName={#MyAppName}
VersionInfoProductVersion={#MyAppVersion}

[Languages]
Name: "chinesesimplified"; MessagesFile: "compiler:Languages\ChineseSimplified.isl"
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"
Name: "startupicon"; Description: "开机自动启动"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
; 主程序
Source: "..\build\windows-amd64\hixns-agent.exe"; DestDir: "{app}"; Flags: ignoreversion

; 内嵌 Hermes Agent (完整 venv) — 仅当目录存在时打包
Source: "..\build\windows-amd64\bundled\hermes-agent\*"; DestDir: "{app}\bundled\hermes-agent"; Flags: ignoreversion recursesubdirs createallsubdirs skipifsourcedoesntexist; Excludes: "__pycache__,*.pyc"

[Icons]
; 开始菜单
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; IconFilename: "{app}\{#MyAppExeName}"
Name: "{group}\卸载 {#MyAppName}"; Filename: "{uninstallexe}"
; 桌面
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; IconFilename: "{app}\{#MyAppExeName}"; Tasks: desktopicon
; 开机启动
Name: "{userstartup}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: startupicon

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent

[UninstallDelete]
Type: filesandordirs; Name: "{app}\bundled"
Type: filesandordirs; Name: "{app}\logs"
Type: filesandordirs; Name: "{app}\data"

[Code]
// 安装前检查是否已运行，提示关闭
function InitializeSetup(): Boolean;
var
  ResultCode: Integer;
begin
  Result := True;
  if CheckForMutexes('HiXNS_Agent_Mutex') then
  begin
    if MsgBox('{#MyAppName} 正在运行，需要先关闭才能继续安装。' + #13#10 + '是否立即关闭？',
              mbConfirmation, MB_YESNO) = IDYES then
    begin
      Exec('taskkill', '/f /im {#MyAppExeName}', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
      Sleep(1000);
    end
    else
      Result := False;
  end;
end;
