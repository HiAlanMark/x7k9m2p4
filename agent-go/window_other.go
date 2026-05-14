//go:build !windows

package main

// 非 Windows 平台不需要窗口操作
func removeWindowFrame()    {}
func minimizeWindow()       {}
func toggleMaximizeWindow() {}
