import { Mesh as MeshBase } from "three/index";
import { Object3D } from "three";
import { BindingPrototype, DetectChangesMode } from "../src/Binding";

export class Mesh extends MeshBase implements BindingPrototype {
    override parent: Object3D;
    override children: Object3D[];
    detectChangesMode: DetectChangesMode;
    detectChanges(): void;
    bindProperty<T extends keyof this>(property: T, getCallback: () => this[T]): this;
    bindCallback(key: string, callback: () => void): this;
    unbindProperty<T extends keyof this>(property: T): this;
}
