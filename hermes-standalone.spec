# -*- mode: python ; coding: utf-8 -*-


a = Analysis(
    ['/tmp/hermes_entry.py'],
    pathex=['/root/hixns-desktop/bundled/hermes-agent', '/root/hixns-desktop/bundled/hermes-agent/venv/lib/python3.11/site-packages'],
    binaries=[],
    datas=[],
    hiddenimports=['hermes_cli', 'hermes_cli.main'],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='hermes-standalone',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
