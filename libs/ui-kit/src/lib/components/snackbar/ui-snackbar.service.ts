import { Injectable, signal } from '@angular/core';

export type SnackbarType = 'success' | 'error' | 'warning';

export type SnackbarConfig = {
  message: string;
  type: SnackbarType;
  duration?: number;
}

export type SnackbarItem = {
  id: number;
} & Required<SnackbarConfig>

const LEAVE_ANIMATION_MS = 200;

@Injectable({ providedIn: 'root' })
export class UiSnackbarService {
  private readonly _snacks = signal<SnackbarItem[]>([]);

  private readonly _leavingIds = signal<ReadonlySet<number>>(new Set());

  readonly snacks = this._snacks.asReadonly();

  readonly leavingIds = this._leavingIds.asReadonly();

  private _nextId = 0;

  show(config: SnackbarConfig): void {
    const id = this._nextId++;
    const duration = config.duration ?? 5000;

    this._snacks.update(snacks => [...snacks, { ...config, id, duration }]);

    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
  }

  success(message: string, duration?: number): void {
    this.show({ message, type: 'success', duration });
  }

  error(message: string, duration?: number): void {
    this.show({ message, type: 'error', duration });
  }

  warning(message: string, duration?: number): void {
    this.show({ message, type: 'warning', duration });
  }

  dismiss(id: number): void {
    this._leavingIds.update(set => new Set([...set, id]));

    setTimeout(() => {
      this._snacks.update(snacks => snacks.filter(s => s.id !== id));
      this._leavingIds.update(set => {
        const next = new Set(set);
        next.delete(id);
        return next;
      });
    }, LEAVE_ANIMATION_MS);
  }
}
