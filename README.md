# three-binding

Adds some functions to **Object3D**. <br />

## Main functions

```javascript
bindProperty(property: string, getCallback: () => any, bindAfterParentAdded?: boolean): this;
```
*Bind an expression to a property.* <br />
**property**: Property name and binding unique key. <br />
**getCallback**: Callback that returns the value to bind. <br />
**bindAfterParentAdded**: If true you can use 'parent' property in the getCallback, avoiding null exception. Default: true. 
<br />
<br />

```javascript
bindCallback(key: string, callback: () => void, bindAfterParentAdded?: boolean): this;
```
*Bind a callback.* <br />
**key**: Binding unique key. <br />
**callback**: Binding callback.<br />
**bindAfterParentAdded**: If true you can use 'parent' property in the callback, avoiding null exception. Default: true.
<br />
<br />

```javascript
unbindByKey(key: string): this;
```
*Remove a binding by a key.* <br />
**key**: Binding unique key. <br />
**callback**: Binding callback.<br />
**bindAfterParentAdded**: If true you can use 'parent' property in the callback, avoiding null exception. Default: true.
<br />
<br />

### Example
```javascript
const materialRed = new MeshBasicMaterial(0xff0000);
const materialYellow = new MeshBasicMaterial(0xffff00);
const mesh = new Mesh(new BufferGeometry());
mesh.bindProperty("material", () => mesh.isActive ? materialYellow : materialRed);
mesh.isActive = true; // this will change material
mesh.bindCallback("position", () => this.position.set(Math.random(), Math.random(), Math.random());
mesh.unbindByKey("material").unbindByKey("position");
``` 
<br />
<br />

## Manual changes detection

```javascript
detectChangesMode: DetectChangesMode;
```
*If 'manual' you need to call detectChanges() manually. Used to increase performance. Default: auto.* <br />
<br />

```javascript
detectChanges(): void;
```
*Executes all callbacks bound to this object (children excluded).* <br />
<br />

### Example
```javascript
const group = new Group();
group.detectChangesMode = DetectChangesMode.manual; //this must be done before create any binding for this group.
group.bindProperty("visible", () => this.children.count > 1);
group.detectChanges();
``` 
<br />
<br />

## How it works

To let all binding work you need to use **computeAutoBinding** function, it will resolve all binded expressions for every Object3D with the auto detection. <br />
I suggest to use it in animation cycle, before render.

```javascript
computeAutoBinding(): void;
```
*Executes all callbacks bound to objects with detectChangesMode set to 'auto'.* <br />
**scenes**: Scene or Scene array where execute bound callbacks. <br />
<br />

# Complete examples
[Arkanoid example](https://github.com/agargaro/three-binding-examples/blob/main/src/arkanoid.ts "Arkanoid") <br />
[Bouncing spheres in a box](https://github.com/agargaro/three-binding-examples/blob/main/src/bouncingSpheresInBox.ts "Bouncing spheres in a box") <br />
<br />
<br />

# How to override Object3D types if use typescript 

soon
