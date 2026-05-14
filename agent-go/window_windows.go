//go:build windows

package main

import (
	"log"
	"syscall"
	"unsafe"
)

var (
	user32                  = syscall.NewLazyDLL("user32.dll")
	procFindWindow          = user32.NewProc("FindWindowW")
	procGetWindowLong       = user32.NewProc("GetWindowLongPtrW")
	procSetWindowLong       = user32.NewProc("SetWindowLongPtrW")
	procSetWindowPos        = user32.NewProc("SetWindowPos")
	procShowWindow          = user32.NewProc("ShowWindow")
	procGetForegroundWindow = user32.NewProc("GetForegroundWindow")
	procIsZoomed            = user32.NewProc("IsZoomed")
)

const (
	// GWL_STYLE is -16, but Go uintptr is unsigned.
	// Use two's complement: ^uintptr(15) == 0xFFFFFFFFFFFFFF0 on 64-bit
	gwlStyle uintptr = ^uintptr(15) // -16 as uintptr

	wsCaption     = 0x00C00000
	wsSysMenu     = 0x00080000
	wsThickFrame  = 0x00040000
	wsMinimizeBox = 0x00020000
	wsMaximizeBox = 0x00010000

	swpFrameChanged  = 0x0020
	swpNoMove        = 0x0002
	swpNoSize        = 0x0001
	swpNoZOrder      = 0x0004
	swpNoOwnerZOrder = 0x0200

	swMinimize = 6
	swMaximize = 3
	swRestore  = 9
)

func findHiXNSWindow() uintptr {
	title, _ := syscall.UTF16PtrFromString("Hi!XNS")
	hwnd, _, _ := procFindWindow.Call(0, uintptr(unsafe.Pointer(title)))
	if hwnd != 0 {
		return hwnd
	}
	hwnd, _, _ = procGetForegroundWindow.Call()
	return hwnd
}

func removeWindowFrame() {
	hwnd := findHiXNSWindow()
	if hwnd == 0 {
		log.Println("[Hi!XNS] 未找到窗口句柄")
		return
	}

	style, _, _ := procGetWindowLong.Call(hwnd, gwlStyle)
	newStyle := style &^ wsCaption &^ wsSysMenu
	newStyle = newStyle | wsThickFrame | wsMinimizeBox | wsMaximizeBox

	procSetWindowLong.Call(hwnd, gwlStyle, newStyle)
	procSetWindowPos.Call(hwnd, 0, 0, 0, 0, 0,
		swpFrameChanged|swpNoMove|swpNoSize|swpNoZOrder|swpNoOwnerZOrder)

	log.Println("[Hi!XNS] 系统标题栏已移除")
}

func minimizeWindow() {
	hwnd := findHiXNSWindow()
	if hwnd != 0 {
		procShowWindow.Call(hwnd, swMinimize)
	}
}

func toggleMaximizeWindow() {
	hwnd := findHiXNSWindow()
	if hwnd == 0 {
		return
	}
	isMax, _, _ := procIsZoomed.Call(hwnd)
	if isMax != 0 {
		procShowWindow.Call(hwnd, swRestore)
	} else {
		procShowWindow.Call(hwnd, swMaximize)
	}
}
