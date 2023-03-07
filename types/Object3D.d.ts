import { Object3D as Object3DBase } from "three/index";
import { BindingPrototype, DetectChangesMode } from "../src/Binding";

export class Object3D extends Object3DBase implements BindingPrototype {
    override parent: Object3D;
    override children: Object3D[];
    detectChangesMode: DetectChangesMode;
    detectChanges(): void;
    bindProperty<T extends keyof this>(property: T, getCallback: () => this[T]): this;
    bindCallback(key: string, callback: () => void): this;
    unbindProperty<T extends keyof this>(property: T): this;
}
