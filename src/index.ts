import { BoxGeometry, Mesh, MeshNormalMaterial, OrthographicCamera, Scene, SphereGeometry, Vector3, WebGLRenderer } from "three";
import { Binding, DetectChangesMode } from "./Binding";

class BoxManual extends Mesh {
    public override detectChangesMode = DetectChangesMode.manual;

    constructor(material: MeshNormalMaterial) {
        super();
        this.geometry = new BoxGeometry(0.2, 0.2, 0.2);
        this.material = material;
        this.bindProperty("position", () => new Vector3(-Math.sin(this.rotation.x), -Math.cos(this.rotation.y)));
        this.bindProperty("visible", () => this.rotation.x % 2 > 0.4);

        setInterval(() => this.detectChanges(), 1000);
    }

    public animate(time: number) {
        this.rotation.x = time / 2000;
        this.rotation.y = time / 1000;
    }
}

class SphereAuto extends Mesh {

    constructor(material: MeshNormalMaterial) {
        super();
        this.geometry = new SphereGeometry(0.2, 50, 50);
        this.material = material;
        this.bindProperty("position", () => new Vector3(Math.sin(this.rotation.x), Math.cos(this.rotation.y)));
        this.bindProperty("visible", () => this.rotation.x % 2 > 0.3);
    }

    public animate(time: number) {
        this.rotation.x = time / 2000;
        this.rotation.y = time / 1000;
    }
}

const camera = new OrthographicCamera(-5, 5, 5 / 16 * 9, -5 / 16 * 9, 1, 1000);
camera.position.z = 100;
const scene = new Scene();
const material = new MeshNormalMaterial()
scene.add(new BoxManual(material), new SphereAuto(material));
const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation);
document.getElementById("canvas-container").appendChild(renderer.domElement);

function animation(time: number) {
    Binding.autoCompute(scene);
    (scene.children[0] as BoxManual).animate(time);
    (scene.children[1] as SphereAuto).animate(time);
    renderer.render(scene, camera);
}

(window as any).Binding = Binding; //DEBUG
