import { Actor, CollisionType, Vector } from "excalibur";
import { Resources } from "./resources.js";
import { Runner } from "./runner"

export class Bal extends Actor {
    constructor() {
        super({
            width: Resources.Bal.width / 4, height: Resources.Bal.height - 100, anchor: new Vector(0.5, 0.5)
        })
    }

    onInitialize(engine) {
        this.graphics.use(Resources.Bal.toSprite());
        this.body.collisionType = CollisionType.Active;
        this.body.useGravity = false;

        this.on('collisionstart', (event) => this.hitSomething(event));
    }

    onPreUpdate(engine, delta) {
        this.vel.x = -engine.speed;
    }

    hitSomething(event) {
        if (event.other.owner instanceof Runner) {
            const runner = event.other.owner;
            if (runner.lives > 1) {
                runner.lives -= 1;
                runner.scene?.engine.ui.updateLives(runner.lives);

                let flashes = 3;
                let flashInterval = setInterval(() => {
                    runner.graphics.opacity = runner.graphics.opacity === 1 ? 0.2 : 1;
                    flashes--;
                    if (flashes <= 0) {
                        clearInterval(flashInterval);
                        runner.graphics.opacity = 1;
                    }
                }, 100);

                this.kill();
                runner.vel = new Vector(100, runner.vel.y);

            } else {
                runner.lives = 0;
                runner.scene?.engine.ui.updateLives(runner.lives);
                runner.kill();
            }
        }
    }
}