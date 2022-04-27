class QuadTree {
    constructor(boids, width, height) {
        this.node = new Node(0,0,width, height, 0, null);

        this.maxSize = 10;
        this.maxDepth = 5;

        this.init(boids);

        this.width = width;
        this.height = height;
    }

    init(boids) {
        for(var boid of boids) {
            var currentNode = this.findCurrentNode(boid.position);
            this.addBoid(currentNode, boid);
        }
    }

    removeBoid(boid) {
        var currentNode = this.findCurrentNode(boid.position);
        currentNode.removeBoid(boid);
    }

    findCurrentNode(position) {
        var currentNode = this.node;
        while(currentNode.children) {
            currentNode = currentNode.findNextNode(position);
        }
        return currentNode;
    }

    addABoid(boid) {
        var currentNode = this.findCurrentNode(boid.position);
        this.addBoid(currentNode, boid);
    }

    removeBoid(boid) {
        var currentNode = this.findCurrentNode(boid.position);
        currentNode.removeBoid(boid);
    }

    addBoid(currentNode, boid) {
        currentNode.addBoid(boid);

        if(currentNode.getSize() > this.maxSize && currentNode.depth < this.maxDepth) {
            currentNode.split();
        }
    }

    clean(node) {
        if(node.children) {
            this.clean(node.topleft);
            this.clean(node.topright);
            this.clean(node.bottomleft);
            this.clean(node.bottomright);
            
            if(!node.children && node != null) {
                return;
            }
            node.merge(this.maxSize);
        }
        return;
    }

    showAll(node, ctx) {
        var currentNode = node;
        currentNode.show(ctx);

        if(currentNode.children) {
            for(var node of currentNode.getChildren()) {
                this.showAll(node, ctx);
            }
        }
    }

    findBoidsNear(position, range) {
        var currentNode = this.findCurrentNode(position);
        var aggr = [];
        var nodes = [];
        nodes.push(currentNode);

        aggr.push(...currentNode.getBoids());

        if(position.x + range < this.width) {
            var tempNode = this.findCurrentNode(new Vector(position.x + range, position.y));
            if(!nodes.includes(tempNode)) {
                nodes.push(tempNode);
                aggr.push(...tempNode.getBoids());
            }
        }
        if(position.x - range > 0) {
            var tempNode = this.findCurrentNode(new Vector(position.x - range, position.y));
            if(!nodes.includes(tempNode)) {
                nodes.push(tempNode);
                aggr.push(...tempNode.getBoids());

            }
        }
        if(position.y + range < this.height) {
            var tempNode = this.findCurrentNode(new Vector(position.x, position.y + range));
            if(!nodes.includes(tempNode)) {
                nodes.push(tempNode);
                aggr.push(...tempNode.getBoids());

            }
        }
        if(position.y - range > 0) {
            var tempNode = this.findCurrentNode(new Vector(position.x, position.y - range));
            if(!nodes.includes(tempNode)) {
                nodes.push(tempNode);
                aggr.push(...tempNode.getBoids());

            }
        }
        
        if(position.x + range/2 < this.width && position.y + range/2 < this.height) {
            var tempNode = this.findCurrentNode(new Vector(position.x + range/2, position.y + range/2));
            if(!nodes.includes(tempNode)) {
                nodes.push(tempNode);
                aggr.push(...tempNode.getBoids());

            }
        }

        if(position.x - range/2 > 0 && position.y + range/2 < this.height) {
            var tempNode = this.findCurrentNode(new Vector(position.x - range/2, position.y + range/2));
            if(!nodes.includes(tempNode)) {
                nodes.push(tempNode);
                aggr.push(...tempNode.getBoids());

            }
        }

        if(position.x + range/2 < this.width && position.y - range/2 > 0) {
            var tempNode = this.findCurrentNode(new Vector(position.x + range/2, position.y - range/2));
            if(!nodes.includes(tempNode)) {
                nodes.push(tempNode);
                aggr.push(...tempNode.getBoids());

            }
        }

        if(position.x - range/2 > 0 && position.y - range/2 > 0) {
            var tempNode = this.findCurrentNode(new Vector(position.x - range/2, position.y - range/2));
            if(!nodes.includes(tempNode)) {
                nodes.push(tempNode);
                aggr.push(...tempNode.getBoids());

            }
        }
        nodes = [];

        aggr.sort((a, b) => position.distance(a.position) - position.distance(b.position));

        if(aggr.length > 15) {
            return aggr.slice(0,15);
        }
        return aggr;
    }
}

class Node {
    constructor(x1, y1, x2, y2, depth, parent) {

        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;

        this.currentBoids = [];

        this.children = false;

        this.topleft = null;
        this.topright = null;
        this.bottomleft = null;
        this.bottomright = null;

        this.parent = null;

        this.depth = depth;

        this.lengthX = this.x2 - this.x1;
        this.lengthY = this.y2 - this.y1;

        this.halfLengthX = this.lengthX / 2;
        this.halfLengthY = this.lengthY / 2;
    }

    removeBoid(boid) {
        if(this.currentBoids != null || this.currentBoids.length === 0)
        this.currentBoids = this.currentBoids.filter( ind => ind != boid);
    }

    addBoid(boid) {
        this.currentBoids.push(boid);
    }

    getSize() {
        if(this.currentBoids != null) return this.currentBoids.length;
        return 0;
    }

    getBoids() {
        return this.currentBoids;
    }

    aggregateBoids(limit) {
        if(this.topleft.getSize() + this.topright.getSize() + this.bottomleft.getSize() + this.bottomright.getSize() < limit) {
            let arr = [];
            arr.push(...this.topleft.currentBoids);
            arr.push(...this.topright.currentBoids);
            arr.push(...this.bottomleft.currentBoids);
            arr.push(...this.bottomright.currentBoids);
            return arr;
        }
        return false;
    }

    getChildren() {
        return [this.topleft, this.topright, this.bottomleft, this.bottomright];
    }

    findNextNode(position) {
        if(position.x >= this.topleft.x1 && position.x <= this.topleft.x2 && position.y >= this.topleft.y1 && position.y <= this.topleft.y2) {
            return this.topleft;
        } else if(position.x >= this.bottomleft.x1 && position.x <= this.bottomleft.x2 && position.y >= this.bottomleft.y1 && position.y <= this.bottomleft.y2) {
            return this.bottomleft;
        } else if(position.x >= this.topright.x1 && position.x <= this.topright.x2 && position.y >= this.topright.y1 && position.y <= this.topright.y2) {
            return this.topright;
        } else if(position.x >= this.bottomright.x1 && position.x <= this.bottomright.x2 && position.y >= this.bottomright.y1 && position.y <= this.bottomright.y2) {
            return this.bottomright;
        }
    }

    split() {
        this.createNodes();

        for(var boid of this.currentBoids) {
            var currentNode = this.findNextNode(boid.position);
            currentNode.addBoid(boid);            
        }
    }

    merge(limit) {
        var aggregate = this.aggregateBoids(limit);
        if(aggregate) {
            this.removeNodes(aggregate);
        }
    }

    createNodes() {
        if(this.children) return;
        this.children = true;
        let depth = this.depth + 1;

        this.topleft = new Node(this.x1, this.y1, this.x1 + this.halfLengthX, this.y1 + this.halfLengthY, depth, this);

        this.topright = new Node(this.x1 + this.halfLengthX, this.y1, this.x2, this.y1 + this.halfLengthY, depth, this);

        this.bottomleft = new Node(this.x1, this.y1 + this.halfLengthY, this.x1 + this.halfLengthX, this.y2, depth, this);

        this.bottomright = new Node(this.x1 + this.halfLengthX, this.y1 + this.halfLengthY, this.x2, this.y2, depth, this);

    }

    removeNodes(boids) {
        this.children = false;

        this.topleft = null;
        this.topright = null;
        this.bottomleft = null;
        this.bottomright = null;

        this.currentBoids = boids;
    }

    show(ctx) {
        ctx.strokeStyle = "WHITE";
        ctx.strokeRect(this.x1, this.y1, this.lengthX, this.lengthY);
    }
}