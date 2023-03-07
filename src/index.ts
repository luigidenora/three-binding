import { AmbientLight, BoxGeometry, BufferGeometry, DirectionalLight, Line, LineBasicMaterial, Mesh, MeshLambertMaterial, PerspectiveCamera, Scene, Vector2, Vector3, WebGLRenderer } from "three";
import { Binding, DetectChangesMode } from "./Binding";

class BoxAutoUpdate extends Mesh {
    private static geometry = new BoxGeometry(0.2, 0.2, 0.2);
    public override parent: CustomScene;
    private _speed = new Vector3(Math.random(), Math.random(), Math.random());

    private get time(): number {
        return this.parent?.time ?? 0;
    }

    constructor(material: MeshLambertMaterial, colorIndex: number) {
        super(BoxAutoUpdate.geometry, material);
        this.position.set(Math.random() * 4 + 0.2, Math.random() * 8 - 4, Math.random() * 5);

        this.bindProperty("visible", () => this.parent?.colorVisibility[colorIndex] && this.parent?.showAutoUpdateObjects);

        this.bindProperty("scale", () => new Vector3().setScalar(0.2 + Math.abs(Math.sin(this._speed.length() * this.time)) * 0.8));

        this.bindCallback("rotation", () => {
            this.rotation.x = this._speed.x * this.time;
            this.rotation.y = this._speed.y * this.time;
            this.rotation.z = this._speed.z * this.time;
        });
    }
}

class BoxManualUpdate extends BoxAutoUpdate {

    constructor(material: MeshLambertMaterial, colorIndex: number) {
        super(material, colorIndex);
        this.detectChangesMode = DetectChangesMode.manual;
        this.position.x = -this.position.x;

        this.bindProperty("visible", () => !this.parent || (this.parent.colorVisibility[colorIndex] && this.parent.showManualUpdateObjects));
        
        setInterval(() => this.detectChanges(), 1000 / 2); //update like 2 fps
    }
}

class CustomScene extends Scene {
    public colorVisibility: boolean[] = [true, true, true];
    public showAutoUpdateObjects = true;
    public showManualUpdateObjects = true;
    public time = 0;

    constructor() {
        super();

        this.add(
            new DirectionalLight(0xffffff, 1).translateZ(1),
            new Line(new BufferGeometry().setFromPoints([new Vector2(0, Number.MIN_SAFE_INTEGER), new Vector2(0, Number.MAX_SAFE_INTEGER)]),
                new LineBasicMaterial({ color: 0xffffff }))
        );

        const material = [
            new MeshLambertMaterial({ color: 0xff0000 }),
            new MeshLambertMaterial({ color: 0x00ff00 }),
            new MeshLambertMaterial({ color: 0x0000ff }),
        ];
        for (let i = 0; i < 99; i++) {
            const index = i % 3;
            this.add(new BoxAutoUpdate(material[index], index));
            this.add(new BoxManualUpdate(material[index], index));
        }
    }
}

const camera = new PerspectiveCamera().translateZ(10);
const scene = new CustomScene();
const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.getElementById("canvas-container").appendChild(renderer.domElement);
const scenes = [scene];

function animate(time: number) {
    scene.time = time / 1000;
    Binding.autoCompute(scenes);
    renderer.render(scene, camera);
}

(window as any).scene = scene;