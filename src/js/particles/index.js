var Particle;

Particle = function(posx,posy,radius) {

    this.position = {
        x: posx || 0,
        y: posy || 0
    };

    if(typeof radius == 'function') {
        this.radius = radius();
    } else {
        this.radius = radius || 0;
    }

    this.status = 'standing'; // Статусы: standing || moving

    this.direction = this.position;

    this.speed = 1; // 1 пиксель в секунду

    this.spotlightTimeStamp = undefined;

};

Particle.prototype.stop = function() {
    this.status = 'standing';
    this.spotlightTimeStamp = undefined;
    this.direction = this.position;
};

Particle.prototype.move = function(posx,posy,speed) {

    this.status = 'moving';

    this.spotlightTimeStamp = undefined;

    var deltaX = posx - this.position.x,
        deltaY = posy - this.position.y,
        distance = Math.sqrt(deltaX*deltaX + deltaY*deltaY);

    this.direction = {
        x: posx,
        y: posy,
        distance: distance,
        sin: deltaY / distance,
        cos: deltaX / distance
    };

    this.startPoint = this.position;

    this.speed = speed || 1;

};

Particle.prototype.getPosition = function getPosition(movetime) {

    var time = movetime / 1000;

    if(this.status == 'moving') {
        if(this.spotlightTimeStamp) {
            var deltaTime = time - this.spotlightTimeStamp,
                distance = (deltaTime * this.speed);

            var posy = this.direction.sin * distance,
                posx = this.direction.cos * distance;

            this.position = {
                x: posx + this.startPoint.x,
                y: posy + this.startPoint.y
            };

            if(distance > this.direction.distance) {
                this.status = 'standing';
                this.spotlightTimeStamp = undefined;
                this.position = this.direction;
            }

        } else {
            this.spotlightTimeStamp = time;
        }
        return true;
    } else {
        return false;
    }
};

window.generateParticles = function(count, size, originX, originY) {

    window.balls = window.balls || [];

    for (var i = 0; i <= count; i++) {
        var x = originX || Math.random() * window.innerWidth,
            y = originY || Math.random() * window.innerHeight;
        (function(particle){
            window.balls.push(particle);
        })(new Particle(x,y,size));
    }
};

module.exports = Particle;