import { ref, type Ref } from 'vue'

// Global toast instance (set by App.vue mounting HxToast)
let toastInstance: Ref<any> | null = null

export function setToastInstance(instance: any) {
  toastInstance = ref(instance)
}

export function useToast() {
  return {
    show: (options: any) => toastInstance?.value?.show(options),
    success: (title: string, message?: string, duration?: number) =>
      toastInstance?.value?.success(title, message, duration),
    error: (title: string, message?: string, duration?: number) =>
      toastInstance?.value?.error(title, message, duration),
    warning: (title: string, message?: string, duration?: number) =>
      toastInstance?.value?.warning(title, message, duration),
    info: (title: string, message?: string, duration?: number) =>
      toastInstance?.value?.info(title, message, duration),
    remove: (id: number) => toastInstance?.value?.remove(id),
  }
}
