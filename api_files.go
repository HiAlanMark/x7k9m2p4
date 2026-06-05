package main

import (
	"encoding/json"
	"fmt"
	"io"
	"mime"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

func handleFilesRouter(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(204)
		return
	}

	path := r.URL.Path

	switch {
	case path == "/v1/agent/files" && r.Method == http.MethodGet:
		handleFilesList(w, r)
	case path == "/v1/agent/files" && r.Method == http.MethodDelete:
		handleFilesDelete(w, r)
	case strings.HasSuffix(path, "/files/read"):
		handleFilesRead(w, r)
	case strings.HasSuffix(path, "/files/write"):
		handleFilesWrite(w, r)
	case strings.HasSuffix(path, "/files/mkdir"):
		handleFilesMkdir(w, r)
	case strings.HasSuffix(path, "/files/rename"):
		handleFilesRename(w, r)
	case strings.HasSuffix(path, "/files/move"):
		handleFilesMove(w, r)
	case strings.HasSuffix(path, "/files/copy"):
		handleFilesCopy(w, r)
	case strings.HasSuffix(path, "/files/stat"):
		handleFilesStat(w, r)
	case strings.HasSuffix(path, "/files/upload"):
		handleFilesUpload(w, r)
	case strings.HasSuffix(path, "/files/download"):
		handleFilesDownload(w, r)
	default:
		jsonError(w, "文件操作不支持: "+r.Method+" "+path, 404)
	}
}

func resolveFilePath(queryKey string, r *http.Request) (string, error) {
	raw := r.URL.Query().Get(queryKey)
	if raw == "" {
		return "", fmt.Errorf("missing query parameter: %s", queryKey)
	}
	if strings.HasPrefix(raw, "~") {
		raw = filepath.Join(getHome(), raw[1:])
	}
	abs, err := filepath.Abs(raw)
	if err != nil {
		return "", err
	}
	return abs, nil
}

func resolveBodyPath(key string, r *http.Request) (string, error) {
	var body map[string]any
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		return "", err
	}
	raw, _ := body[key].(string)
	if raw == "" {
		return "", fmt.Errorf("missing field: %s", key)
	}
	if strings.HasPrefix(raw, "~") {
		raw = filepath.Join(getHome(), raw[1:])
	}
	abs, err := filepath.Abs(raw)
	if err != nil {
		return "", err
	}
	return abs, nil
}

func handleFilesList(w http.ResponseWriter, r *http.Request) {
	dirPath, err := resolveFilePath("path", r)
	if err != nil {
		jsonError(w, err.Error(), 400)
		return
	}

	entries, err := os.ReadDir(dirPath)
	if err != nil {
		jsonError(w, "无法读取目录: "+err.Error(), 500)
		return
	}

	type FileEntry struct {
		Name    string    `json:"name"`
		Path    string    `json:"path"`
		IsDir   bool      `json:"is_dir"`
		Size    int64     `json:"size,omitempty"`
		ModTime time.Time `json:"mod_time"`
	}

	var files []FileEntry
	for _, entry := range entries {
		info, err := entry.Info()
		if err != nil {
			continue
		}
		files = append(files, FileEntry{
			Name:    entry.Name(),
			Path:    filepath.Join(dirPath, entry.Name()),
			IsDir:   entry.IsDir(),
			Size:    info.Size(),
			ModTime: info.ModTime(),
		})
	}

	parent := filepath.Dir(dirPath)
	jsonResponse(w, map[string]any{
		"path":    dirPath,
		"parent":  parent,
		"entries": files,
	})
}

func handleFilesRead(w http.ResponseWriter, r *http.Request) {
	filePath, err := resolveFilePath("path", r)
	if err != nil {
		jsonError(w, err.Error(), 400)
		return
	}

	data, err := os.ReadFile(filePath)
	if err != nil {
		jsonError(w, "无法读取文件: "+err.Error(), 500)
		return
	}

	jsonResponse(w, map[string]any{
		"path":      filePath,
		"content":   string(data),
		"size":      len(data),
		"is_binary": !isLikelyText(data),
	})
}

func handleFilesWrite(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Path    string `json:"path"`
		Content string `json:"content"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		jsonError(w, "无效 JSON", 400)
		return
	}

	filePath := expandHome(body.Path)
	filePath, err := filepath.Abs(filePath)
	if err != nil {
		jsonError(w, "无效路径", 400)
		return
	}

	os.MkdirAll(filepath.Dir(filePath), 0755)

	if err := os.WriteFile(filePath, []byte(body.Content), 0644); err != nil {
		jsonError(w, "写入失败: "+err.Error(), 500)
		return
	}

	jsonResponse(w, map[string]any{
		"success": true,
		"path":    filePath,
		"bytes":   len(body.Content),
	})
}

func handleFilesMkdir(w http.ResponseWriter, r *http.Request) {
	dirPath, err := resolveBodyPath("path", r)
	if err != nil {
		jsonError(w, err.Error(), 400)
		return
	}

	err = os.MkdirAll(dirPath, 0755)
	jsonResponse(w, map[string]any{
		"path":    dirPath,
		"created": err == nil,
	})
}

func handleFilesRename(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Path    string `json:"path"`
		NewName string `json:"new_name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		jsonError(w, "无效 JSON", 400)
		return
	}

	oldPath := expandHome(body.Path)
	oldPath, _ = filepath.Abs(oldPath)
	newPath := filepath.Join(filepath.Dir(oldPath), body.NewName)

	err := os.Rename(oldPath, newPath)
	if err != nil {
		jsonError(w, "重命名失败: "+err.Error(), 500)
		return
	}

	jsonResponse(w, map[string]any{
		"path":     newPath,
		"old_path": oldPath,
	})
}

func handleFilesMove(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Path string `json:"path"`
		Dest string `json:"dest"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		jsonError(w, "无效 JSON", 400)
		return
	}

	src := expandHome(body.Path)
	dst := expandHome(body.Dest)

	err := os.Rename(src, dst)
	if err != nil {
		jsonError(w, "移动失败: "+err.Error(), 500)
		return
	}

	jsonResponse(w, map[string]any{
		"path":     dst,
		"old_path": src,
	})
}

func handleFilesCopy(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Src string `json:"src"`
		Dst string `json:"dst"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		jsonError(w, "无效 JSON", 400)
		return
	}

	src := expandHome(body.Src)
	dst := expandHome(body.Dst)

	var err error
	srcInfo, _ := os.Stat(src)
	if srcInfo != nil && srcInfo.IsDir() {
		err = copyDir(src, dst)
	} else {
		err = copyFile(src, dst)
	}

	if err != nil {
		jsonError(w, "复制失败: "+err.Error(), 500)
		return
	}

	jsonResponse(w, map[string]any{
		"success": true,
		"src":     src,
		"dst":     dst,
	})
}

func handleFilesStat(w http.ResponseWriter, r *http.Request) {
	filePath, err := resolveFilePath("path", r)
	if err != nil {
		jsonError(w, err.Error(), 400)
		return
	}

	info, err := os.Stat(filePath)
	if err != nil {
		jsonError(w, "无法获取文件信息: "+err.Error(), 404)
		return
	}

	jsonResponse(w, map[string]any{
		"path":     filePath,
		"name":     info.Name(),
		"is_dir":   info.IsDir(),
		"size":     info.Size(),
		"mod_time": info.ModTime(),
		"mode":     info.Mode().String(),
	})
}

func handleFilesDelete(w http.ResponseWriter, r *http.Request) {
	filePath, err := resolveFilePath("path", r)
	if err != nil {
		jsonError(w, err.Error(), 400)
		return
	}

	var delErr error
	info, _ := os.Stat(filePath)
	if info != nil && info.IsDir() {
		delErr = os.RemoveAll(filePath)
	} else {
		delErr = os.Remove(filePath)
	}

	if delErr != nil {
		jsonError(w, "删除失败: "+delErr.Error(), 500)
		return
	}

	jsonResponse(w, map[string]any{
		"deleted": filePath,
	})
}

func handleFilesUpload(w http.ResponseWriter, r *http.Request) {
	dirPath := r.URL.Query().Get("path")
	if dirPath == "" {
		dirPath = "."
	}
	dirPath = expandHome(dirPath)

	if err := r.ParseMultipartForm(32 << 20); err != nil {
		jsonError(w, "解析上传失败: "+err.Error(), 400)
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		jsonError(w, "获取上传文件失败: "+err.Error(), 400)
		return
	}
	defer file.Close()

	dstPath := filepath.Join(dirPath, header.Filename)
	dst, err := os.Create(dstPath)
	if err != nil {
		jsonError(w, "创建文件失败: "+err.Error(), 500)
		return
	}
	defer dst.Close()

	written, err := io.Copy(dst, file)
	if err != nil {
		jsonError(w, "写入文件失败: "+err.Error(), 500)
		return
	}

	jsonResponse(w, map[string]any{
		"path":    dstPath,
		"name":    header.Filename,
		"size":    written,
		"success": true,
	})
}

func handleFilesDownload(w http.ResponseWriter, r *http.Request) {
	filePath, err := resolveFilePath("path", r)
	if err != nil {
		jsonError(w, err.Error(), 400)
		return
	}

	file, err := os.Open(filePath)
	if err != nil {
		jsonError(w, "无法打开文件: "+err.Error(), 404)
		return
	}
	defer file.Close()

	info, _ := file.Stat()
	contentType := mime.TypeByExtension(filepath.Ext(filePath))
	if contentType == "" {
		contentType = "application/octet-stream"
	}

	w.Header().Set("Content-Type", contentType)
	w.Header().Set("Content-Disposition", "attachment; filename=\""+filepath.Base(filePath)+"\"")
	if info != nil {
		w.Header().Set("Content-Length", fmt.Sprintf("%d", info.Size()))
	}
	io.Copy(w, file)
}

func expandHome(path string) string {
	if strings.HasPrefix(path, "~") {
		return filepath.Join(getHome(), path[1:])
	}
	abs, _ := filepath.Abs(path)
	return abs
}

func isLikelyText(data []byte) bool {
	if len(data) == 0 {
		return true
	}
	for _, b := range data[:min(len(data), 512)] {
		if b == 0 {
			return false
		}
	}
	return true
}

func copyFile(src, dst string) error {
	in, err := os.Open(src)
	if err != nil {
		return err
	}
	defer in.Close()

	if err := os.MkdirAll(filepath.Dir(dst), 0755); err != nil {
		return err
	}

	out, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer out.Close()

	_, err = io.Copy(out, in)
	return err
}

func copyDir(src, dst string) error {
	if err := os.MkdirAll(dst, 0755); err != nil {
		return err
	}

	entries, err := os.ReadDir(src)
	if err != nil {
		return err
	}

	for _, entry := range entries {
		srcPath := filepath.Join(src, entry.Name())
		dstPath := filepath.Join(dst, entry.Name())

		if entry.IsDir() {
			if err := copyDir(srcPath, dstPath); err != nil {
				return err
			}
		} else {
			if err := copyFile(srcPath, dstPath); err != nil {
				return err
			}
		}
	}
	return nil
}
