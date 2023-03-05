import { Object3D as Object3DBase } from "three/index";
import { BindingCallbacks, BindingPrototype, DetectChangesMode } from "../src/Binding";

export class Object3D extends Object3DBase implements BindingPrototype {
    override parent: Object3D;
    override children: Object3D[];
    detectChangesMode: DetectChangesMode;
    detectChanges(): void;
    bindProperty<T extends keyof this>(property: T, getCallback: () => this[T]): this;
    bindPropertyCallback<T extends keyof this>(property: T, getCallback: () => this[T], setCallbackValue: (value: this[T]) => void): this;
    unbindProperty<T extends keyof this>(property: T): this;
    dispose(): void;
}
