class Vector {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }

    heading() {
        return Math.atan2(y, x);
    }

    add(other) {
        this.x += other.x;
        this.y += other.y;

        return this;
    }

    sub(other) {
        this.x -= other.x;
        this.y -= other.y;
        
        return this;
    }

    mult(n) {
        this.x *= n;
        this.y *= n;

        return this;
    }

    div(n) {
        this.x /= n;
        this.y /= n;

        return this;
    }

    distance(other) {
        return Math.sqrt((other.x - this.x) * (other.x - this.x) + (other.y - this.y) * (other.y - this.y));
    }

    setMag(n) {
        return this.normalise().mult(n);
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    normalise() {
        let m = this.magnitude();
        if(m > 0) {
            this.x /= m;
            this.y /= m;
        }

        return this;
    }

    magnitudeSq() {
        const x = this.x;
        const y = this.y;
        return x * x + y * y;
    }

    limit(limit) {
        const magSq = this.magnitudeSq();
        if(magSq > limit * limit) {
            this.div(Math.sqrt(magSq))
            .mult(limit);
        }
        return this;
    }

    static sub(v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }
}