export type NotifyVariant = "success" | "error" | "warning" | "info";

export interface NotifyOptions {
  id?: string;
  title?: string;
  duration?: number;
}

export interface ToastItem {
  id: string;
  variant: NotifyVariant;
  message: string;
  title?: string;
  duration: number;
}

type Subscriber = (toasts: ToastItem[]) => void;

class NotifyManager {
  private toasts: ToastItem[] = [];
  private subscribers: Set<Subscriber> = new Set();
  private counter = 0;

  private notifySubscribers() {
    this.subscribers.forEach((sub) => sub([...this.toasts]));
  }

  public subscribe(subscriber: Subscriber): () => void {
    this.subscribers.add(subscriber);
    subscriber([...this.toasts]);
    return () => {
      this.subscribers.delete(subscriber);
    };
  }

  public add(variant: NotifyVariant, message: string, options?: NotifyOptions): string {
    const id = options?.id || `toast-${++this.counter}-${Date.now()}`;
    const duration = options?.duration ?? 4000;

    const existingIndex = this.toasts.findIndex((t) => t.id === id);
    const newToast: ToastItem = {
      id,
      variant,
      message,
      title: options?.title,
      duration,
    };

    if (existingIndex > -1) {
      this.toasts[existingIndex] = newToast;
    } else {
      this.toasts = [newToast, ...this.toasts];
    }

    this.notifySubscribers();
    return id;
  }

  public dismiss(id?: string): void {
    if (id) {
      this.toasts = this.toasts.filter((t) => t.id !== id);
    } else {
      this.toasts = [];
    }
    this.notifySubscribers();
  }

  public success(message: string, options?: NotifyOptions): string {
    return this.add("success", message, options);
  }

  public error(message: string, options?: NotifyOptions): string {
    return this.add("error", message, options);
  }

  public warning(message: string, options?: NotifyOptions): string {
    return this.add("warning", message, options);
  }

  public info(message: string, options?: NotifyOptions): string {
    return this.add("info", message, options);
  }
}

export const notify = new NotifyManager();
