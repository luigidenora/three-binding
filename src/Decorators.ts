import { Mesh } from '../types/three';

/**
 * A decorator that binds a property of a Mesh to a function that returns its value.
 * @param config An optional configuration object that specifies whether to bind the property after the parent is added.
 * @returns A function that applies the decorator to the target object, property key and descriptor.
 * @example
 * Here's a simple example:
 * ```
 * class Box extends Mesh {
 *  @BindProperty() get isActive() {
 *       return this.parent.activeObject === this;
 *   }
 * }
 * ```
 */
export const BindProperty = <T extends Mesh>(config?: { bindAfterParentAdded?: boolean }): Function =>
  function (target: Object, key: keyof T, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function () {
      (this as any).bindProperty(key, () => originalMethod.apply(this), config.bindAfterParentAdded);
    };
  };

/**
 * A decorator that binds a callback function to a property of a Mesh.
 * @param property The name of the property to bind the callback to.
 * @param config An optional configuration object that specifies whether to bind the callback after the parent is added.
 * @returns A function that applies the decorator to the target object, property key and descriptor.
 * @example
 * Here's a simple example:
 * ```
 * class Box extends Mesh {
 *  @BindCallback("materialColor") myCustomMethod() {
 *      this.material.color.set(this._colors[this.isActive ? 2 : this.isHovered ? 1 : 0]);
 *  }
 * }
 * ```
 */
export const BindCallback = <T extends Mesh>(property: string, config?: { bindAfterParentAdded?: boolean }): Function =>
  function (target: Object, key: keyof T, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function () {
      (this as any).bindCallback(property, () => originalMethod.apply(this), config.bindAfterParentAdded);
    };
  };
