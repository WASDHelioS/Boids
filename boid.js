class Boid {
    constructor(width, height) {
        this.width = width;
        this.height = height

        this.position = new Vector(Math.floor(Math.random() * this.width), Math.floor(Math.random() * this.height));
        this.velocity = new Vector(Math.round(Math.random()) * 2 - 1, Math.round(Math.random()) * 2 - 1);
        this.acceleration = new Vector(0,0);

        this.range = 50;
        this.separation = 25;

        this.triangleSize = 10;

        this.maxspeed = 8;    // Maximum speed
        this.maxforce = 0.2; // Maximum steering force

        this.history = [];
    }


    applyForce(force) {
        this.acceleration.add(force);
    }

    flock(boids) {


        let sep = this.separate(boids);   // Separation
        let ali = this.align(boids);      // Alignment
        let coh = this.cohesion(boids);   // Cohesion
        // Arbitrarily weight these forces
        sep.mult(1.5);
        ali.mult(1.0);
        coh.mult(1.0);
        // Add the force vectors to acceleration
        this.applyForce(sep);
        this.applyForce(ali);
        this.applyForce(coh);
    }

    update() {
        this.velocity.setMag(this.maxspeed / 2);

        this.velocity.add(this.acceleration);

        this.velocity.limit(this.maxspeed);

        this.position.add(this.velocity);


        this.acceleration.mult(0);

        if (this.position.x <= 5) {
            this.position.x = this.width - 5;
        } else if (this.position.x >= this.width - 5) {
            this.position.x = 5;
        }
        if (this.position.y <= 5) {
            this.position.y = this.height - 5;
        } else if (this.position.y >= this.height - 5) {
            this.position.y = 5;
        }

    }

    separate(boids) {
        let steer = new Vector(0, 0);
        let count = 0;

        for (let i = 0; i < boids.length; i++) {
            let d = this.distance(boids[i]);
            if ((d > 0) && (d < this.separation)) {
                let diff = Vector.sub(this.position, boids[i].position);
                diff.normalise();
                diff.div(d);        
                steer.add(diff);
                count++;            
            }
        }
        if (count > 0) {
            steer.div(count);
        }

        if (steer.magnitude() > 0) {
            steer.normalise();
            steer.mult(this.maxspeed);
            steer.sub(this.velocity);
            steer.limit(this.maxforce);
        }
        return steer;
    }

    align(boids) {
        let sum = new Vector(0, 0);
        let count = 0;
        for (let i = 0; i < boids.length; i++) {
            let d = this.distance(boids[i]);
            if ((d > 0) && (d < this.range)) {
                sum.add(boids[i].velocity);
                count++;
            }
        }
        if (count > 0) {
            sum.div(count);
            sum.normalise();
            sum.mult(this.maxspeed);
            let steer = Vector.sub(sum, this.velocity);
            steer.limit(this.maxforce);
            return steer;
        } else {
            return new Vector(0, 0);
        }
    }

    cohesion(boids) {
        let sum = new Vector(0, 0);
        let count = 0;
        for (let i = 0; i < boids.length; i++) {
            let d = this.distance(boids[i]);
            if ((d > 0) && (d < this.range)) {
                sum.add(boids[i].position);
                count++;
            }
        }
        if (count == 0) return new Vector(0, 0);
        sum.div(count);
        let result = Vector.sub(sum, this.position);
        result.normalise();
        result.mult(this.maxspeed);
        result = Vector.sub(result, this.velocity);
        result.limit(this.maxforce);
        return result;

    }

    distance(boid) {
        return this.position.distance(boid.position);
    }

    draw() {
        //ctx.translate(this.position.x, this.position.y);
        //ctx.rotate( this.velocity.heading() - radians(90));

        ctx.fillStyle = "WHITE";
        ctx.fillRect(this.position.x,this.position.y, 4,4);

        //this.drawTrail();
    }
}