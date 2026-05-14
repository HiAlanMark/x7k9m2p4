; Hi!XNS Agent — Inno Setup 安装脚本
; 构建: iscc scripts/installer.iss

#define MyAppName "Hi!XNS"
#define MyAppVersion "0.4.1"
#define MyAppPublisher "Hi!XNS"
#define MyAppURL "https://hixns.com"
#define MyAppExeName "hixns-agent.exe"
#define MyAppMutex "HiXNS_Agent_Mutex"

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
SetupIconFile=..\src-tauri\icons\icon.ico
UninstallDisplayIcon={app}\{#MyAppExeName}
UninstallDisplayName={#MyAppName}
OutputDir=..\build\installer
OutputBaseFilename=HiXNS-Setup-{#MyAppVersion}
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=lowest
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
; 版本信息
VersionInfoVersion={#MyAppVersion}
VersionInfoCompany={#MyAppPublisher}
VersionInfoDescription={#MyAppName} AI Agent
VersionInfoCopyright=Copyright (c) 2025 {#MyAppPublisher}
VersionInfoProductName={#MyAppName}
VersionInfoProductVersion={#MyAppVersion}
; 升级时覆盖安装（同 AppId 自动检测旧版本）
UsePreviousAppDir=yes
CloseApplications=yes
RestartApplications=no

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[CustomMessages]
english.CreateDesktopIcon=创建桌面快捷方式
english.LaunchAfterInstall=安装完成后启动 {#MyAppName}
english.StartWithWindows=开机自动启动

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"
Name: "startupicon"; Description: "{cm:StartWithWindows}"; Flags: unchecked

[Files]
; 主程序
Source: "..\build\windows-amd64\hixns-agent.exe"; DestDir: "{app}"; Flags: ignoreversion

; 嵌入式 Python 运行时 (用户无需安装Python)
Source: "..\build\windows-amd64\bundled\python\*"; DestDir: "{app}\bundled\python"; Flags: ignoreversion recursesubdirs createallsubdirs skipifsourcedoesntexist

; Hermes Agent 核心 (AI引擎)
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
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchAfterInstall}"; Flags: nowait postinstall skipifsilent

[UninstallDelete]
Type: filesandordirs; Name: "{app}\bundled"
Type: filesandordirs; Name: "{app}\logs"
Type: filesandordirs; Name: "{app}\data"

[Code]
// 安装前：检测旧版本并关闭正在运行的实例
function InitializeSetup(): Boolean;
var
  ResultCode: Integer;
  UninstStr: String;
begin
  Result := True;

  // 检查是否正在运行
  if CheckForMutexes('{#MyAppMutex}') then
  begin
    MsgBox('检测到 {#MyAppName} 正在运行，安装程序将自动关闭它。', mbInformation, MB_OK);
    Exec('taskkill', '/f /im {#MyAppExeName}', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
    Sleep(1500);
  end;

  // 检查是否有旧版本安装
  if RegQueryStringValue(HKCU, 'Software\Microsoft\Windows\CurrentVersion\Uninstall\{{A3F8E2D1-7B4C-4E5F-9A6D-1C2B3D4E5F6A}_is1', 'DisplayVersion', UninstStr) then
  begin
    if UninstStr <> '{#MyAppVersion}' then
    begin
      MsgBox('检测到旧版本 ' + UninstStr + '，将自动升级到 {#MyAppVersion}。', mbInformation, MB_OK);
    end;
  end;
end;
