import { Euler, Object3D, Quaternion, Scene, Vector2, Vector3 } from "three";

export enum DetectChangesMode {
  auto,
  manual
}

export interface BindingCallbacks<T = any> {
  getValueCallback: () => T;
  setValueCallback: (value: T) => void;
}

export class Binding {
  private static _boundObjects: { [index: number]: { [index: number]: Object3D } } = {};
  private static _boundObjectsUnknownScene: { [index: number]: Object3D } = {};

  public static create<T>(key: string, getValueCallback: () => T, setValueCallback: (value: T) => void, obj: Object3D): void {
    if (!obj) {
      console.error("Error creating binding. Obj is mandatory.");
      return;
    }

    const bindingCallback: BindingCallbacks = { setValueCallback, getValueCallback };

    if (obj.detectChangesMode === DetectChangesMode.auto) {
      const scene = this.getSceneFromObj(obj);
      if (scene) {
        const sceneBound = this._boundObjects[scene.id] ?? (this._boundObjects[scene.id] = {});
        sceneBound[obj.id] = obj;
      } else {
        this._boundObjectsUnknownScene[obj.id] = obj;
      }
    }

    const objBoundCallbacks = (obj as any)._boundCallbacks ?? ((obj as any)._boundCallbacks = {});
    objBoundCallbacks[key] = bindingCallback;
    this.executeCallback(bindingCallback);
  }

  private static getSceneFromObj(obj: Object3D): Scene {
    while (obj) {
      if ((obj as Scene).isScene) {
        return obj as Scene;
      }
      obj = obj.parent;
    }
  }

  private static executeCallback(bindingCallback: BindingCallbacks): void {
    bindingCallback.setValueCallback(bindingCallback.getValueCallback());
  }

  private static executeAllCallbacks(obj: Object3D): void {
    const callbacks = (obj as any)._boundCallbacks as { [x: string]: BindingCallbacks };
    for (const key in callbacks) {
      this.executeCallback(callbacks[key]);
    }
  }

  public static unbindByKey(obj: Object3D, key: string): void {
    delete (obj as any)._boundCallbacks[key];
  }

  public static unbindAll(obj: Object3D): void {
    if (obj.detectChangesMode === DetectChangesMode.auto) {
      const scene = this.getSceneFromObj(obj);
      delete this._boundObjects[scene.id][obj.id];
      delete this._boundObjectsUnknownScene[obj.id];
    }
    (obj as any)._boundCallbacks = {};
  }

  public static compute(obj: Object3D): void {
    this.executeAllCallbacks(obj);
  }

  public static computeByScene(scene: Scene): void {
    this.moveUnknownBoundObj();
    const boundScene = this._boundObjects[scene.id];
    if (boundScene) {
      for (const objKey in boundScene) {
        this.executeAllCallbacks(boundScene[objKey]);
      }
    }
  }

  private static moveUnknownBoundObj(): void {
    for (const objKey in this._boundObjectsUnknownScene) {
      const obj = this._boundObjectsUnknownScene[objKey];
      const scene = this.getSceneFromObj(obj);
      if (scene) {
        const sceneBound = this._boundObjects[scene.id] ?? (this._boundObjects[scene.id] = {});
        sceneBound[objKey] = this._boundObjectsUnknownScene[objKey];
        delete this._boundObjectsUnknownScene[objKey];
      }
    }
  }
}

export interface BindingPrototype {
  detectChangesMode: DetectChangesMode;
  detectChanges(): void;
  bindProperty<T extends keyof this>(property: T, getCallback: () => this[T]): this;
  bindPropertyCallback<T extends keyof this>(property: T, getCallback: () => this[T], setCallbackValue: (value: this[T]) => void): this;
  unbindProperty<T extends keyof this>(property: T): this;
  dispose(): void;
}

Object3D.prototype.detectChangesMode = DetectChangesMode.auto; //TODO lock change

Object3D.prototype.detectChanges = function () {
  Binding.compute(this);
};

Object3D.prototype.bindProperty = function (property, getValue) {
  if ((this[property] as Vector3).isVector3 || (this[property] as Vector2).isVector2 ||
    (this[property] as Quaternion).isQuaternion || (this[property] as Euler).isEuler) {
    Binding.create(property, getValue, (value) => { (this[property] as any).copy(value) }, this);
  } else {
    Binding.create(property, getValue, (value) => { this[property] = value }, this);
  }
  return this;
};

Object3D.prototype.bindPropertyCallback = function (property, getValue, setValue) {
  Binding.create(property, getValue, setValue, this);
  return this;
};

Object3D.prototype.unbindProperty = function (property) {
  Binding.unbindByKey(this, property);
  return this;
};

const disposeBase = Object3D.prototype.dispose;
Object3D.prototype.dispose = function () {
  disposeBase && disposeBase();
  Binding.unbindAll(this);
};
