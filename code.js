let type = "WebGL"
if (!PIXI.utils.isWebGLSupported()) {
    type = "canvas"
}
let socialDistancing = false;
let quarantining = false;
var timeIncrement=3;
function Person(condition, x, y, infect, infectedTime,x1,x2,x3,x4,x5) {
    this.condition = condition;
    this.x = x;
    this.y = y;
    this.infect = infect;
    this.infectedTime = infectedTime;
    this.time = 0;
    this.symptoms = false;
    this.quarantined = false;
    this.symptomTime = 0;
    this.alive = true;
    this.sprite1=new PIXI.Sprite(x1);
    this.sprite2=new PIXI.Sprite(x2);
    this.sprite3=new PIXI.Sprite(x3);
    this.sprite4=new PIXI.Sprite(x4);
    this.sprite5=new PIXI.Sprite(x5);
}
Person.prototype.progress = function (deathRate, moveTime, morgueX, morgueY, hospitalX, hospitalY, centerX, centerY, hospitalFull, quarantine) {
    if (this.condition == 1) {
        this.time++;
        if (this.symptoms == true) {
            this.symptomTime++;
        }
        if (this.symptoms && this.symptomTime >= moveTime && !this.quarantined && !hospitalFull && quarantine) {
            this.quarantined = true;
            this.x = hospitalX;
            this.y = hospitalY;
        }
        //console.log(this.infectedTime);
        if (this.time >= this.infectedTime) {
            this.symptoms = false;
            this.condition = 2;
            if (this.quarantined) {
                this.x = centerX;
                this.y = centerY;
                this.quarantined = false;
            }
            if (Math.random() < deathRate) {
                this.alive = false;
                this.x = morgueX;
                this.y = morgueY;
            }
        }
    }
}
Person.prototype.move2 = function (speed, bX, bY, bW, bH, p, socialDistance) {
    if (this.alive && !this.quarantined) {
        let angle = 2 * Math.PI * Math.random();
        let radius = Math.random();
        let moveX = speed * radius * Math.cos(angle);
        let moveY = speed * radius * Math.sin(angle);
        let num = 1;
        for (let i = 0; i < p.length; i++) {
            if (!(this == p[i]) && p[i].alive && !p[i].quarantined) {
                if (this.getDistance(p[i]) <= socialDistance) {
                    num++;
                    let deltaX = (p[i].x - this.x);
                    let deltaY = (p[i].y - this.y);
                    let m = this.mag(deltaX, deltaY);
                    if (m > 0) {
                        moveX += -deltaX / m * speed;
                        moveY += -deltaY / m * speed;
                    } else {
                        moveX += speed * Math.cos(angle);
                        moveY += speed * Math.sin(angle);
                    }
                }
            }
        }
        moveX /= num;
        moveY /= num;
        let ta = Math.tan(angle);
        if ((this.x + moveX) < bX) {
            moveX = bX - this.x;
            moveY = (bX - this.x) * ta;
        }
        if ((this.y + moveY) < bY) {
            moveY = bY - this.y;
            moveX = (bX - this.x) / ta;
        }
        if ((this.x + moveX) > (bX + bW)) {
            moveX = bX + bW - this.x;
            moveY = (bX + bW - this.x) * ta;
        }
        if ((this.y + moveY) > (bY + bH)) {
            moveY = bY + bH - this.y;
            moveX = (bY + bH - this.y) / ta;
        }
        if (Math.abs(moveY) > speed * radius) {
            moveY = 0;
        }
        if (Math.abs(moveX) > speed * radius) {
            moveX = 0;
        }
        this.x += moveX;
        this.y += moveY;
        if (this.x > (bX + bW)) {
            this.x = bX + bW;
        }
        if (this.x < bX) {
            this.x = bX;
        }
        if (this.y > (bY + bH)) {
            this.y = bY + bH;
        }
        if (this.y < bY) {
            this.y = bY;
        }
    }
}
Person.prototype.mag = function (x, y) {
    return Math.sqrt(x * x + y * y);
}
Person.prototype.move = function (speed, bX, bY, bW, bH) {
    if (this.alive && !this.quarantined) {
        let angle = 2 * Math.PI * Math.random();
        let radius = Math.random();
        let moveX = speed * radius * Math.cos(angle);
        let moveY = speed * radius * Math.sin(angle);
        if ((this.x + moveX) < bX) {
            moveX = bX - this.x;
            moveY = (bX - this.x) * Math.tan(angle);
        }
        if ((this.y + moveY) < bY) {
            moveY = bY - this.y;
            moveX = (bX - this.x) / Math.tan(angle);
        }
        if ((this.x + moveX) > (bX + bW)) {
            moveX = bX + bW - this.x;
            moveY = (bX + bW - this.x) * Math.tan(angle);
        }
        if ((this.y + moveY) > (bY + bH)) {
            moveY = bY + bH - this.y;
            moveX = (bY + bH - this.y) / Math.tan(angle);
        }
        if (Math.abs(moveY) > speed * radius) {
            moveY = 0;
        }
        if (Math.abs(moveX) > speed * radius) {
            moveX = 0;
        }
        this.x += moveX;
        this.y += moveY;
        if (this.x > (bX + bW)) {
            this.x = bX + bW;
        }
        if (this.x < bX) {
            this.x = bX;
        }
        if (this.y > (bY + bH)) {
            this.y = bY + bH;
        }
        if (this.y < bY) {
            this.y = bY;
        }
    }
}
Person.prototype.create = function (g) {
    if (this.condition == 0) {
        this.sprite1.x=this.x-3;
        this.sprite1.y=this.y-3;
        app.stage.addChild(this.sprite1);
    } else if (this.condition == 1) {
        if (!this.quarantined) {
            this.sprite2.x=this.x-this.infect;
            this.sprite2.y=this.y-this.infect;
            app.stage.addChild(this.sprite2);
        } else {
            this.sprite3.x=this.x-3;
            this.sprite3.y=this.y-3;
            app.stage.addChild(this.sprite3);
        }
    } else if (this.condition == 2) {
        if (this.alive) {
            this.sprite4.x=this.x-3;
            this.sprite4.y=this.y-3;
            app.stage.addChild(this.sprite4);
        } else {
            this.sprite5.x=this.x-3;
            this.sprite5.y=this.y-3;
            app.stage.addChild(this.sprite5);
        }
    }
    g.lineStyle(0,0x000000,0);
}
Person.prototype.getDistance = function (p) {
    return this.mag(p.x - this.x, p.y - this.y);
}
Person.prototype.spread = function (p, symptomRate) {
    if (!this.quarantined) {
        if (this.condition == 1) {
            for (let i = 0; i < p.length; i++) {
                if (this.getDistance(p[i]) <= this.infect) {
                    if (p[i].condition == 0) {
                        p[i].condition = 1;
                        if (Math.random() < symptomRate) {
                            p[i].symptoms = true;
                        }
                    }
                }
            }
        }
    }
}
function Community(x, y, w, h, morgueX, morgueY, hospitalX, hospitalY, graphX, graphY, graphW, graphH, size, speed, infect, infectedTime, doSocialDistance, startSocialDistance, socialDistance, quarantine, startQuarantine, moveTime, hospitalCapacity, deathRate, symptomRate) {
    this.infect = parseInt(infect);
    this.speed = speed;
    this.size = size;
    this.infectedTime = infectedTime;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    const p=new PIXI.Graphics();
    p.beginFill(0x0000FF);
    p.lineStyle(1, 0x000000, 0);
    p.drawCircle(3,3,3);
    p.endFill();
    const x1=PIXI.RenderTexture.create(6,6);
    app.renderer.render(p,x1);
    p.clear();
    p.beginFill(0xFF0000);
    //p.lineStyle(1, 0x000000, 0);
    p.drawCircle(this.infect,this.infect,3.0);
    p.endFill();
    p.lineStyle(1, 0xFF0000, 1);
    p.drawCircle(this.infect,this.infect,this.infect);
    const x2=PIXI.RenderTexture.create(this.infect*2,this.infect*2);
    app.renderer.render(p,x2);
    p.clear();
    p.beginFill(0xFF5000);
    p.lineStyle(1, 0x000000, 0);
    p.drawCircle(3,3,3);
    p.endFill();
    const x3=PIXI.RenderTexture.create(6,6);
    app.renderer.render(p,x3);
    p.clear();
    p.beginFill(0xFF00FF);
    p.lineStyle(1, 0x000000, 0);
    p.drawCircle(3,3,3);
    p.endFill();
    const x4=PIXI.RenderTexture.create(6,6);
    app.renderer.render(p,x4);
    p.clear();
    p.beginFill(0x000000);
    p.lineStyle(1, 0x000000, 0);
    p.drawCircle(3,3,3);
    p.endFill();
    const x5=PIXI.RenderTexture.create(6,6);
    app.renderer.render(p,x5);
    this.p = [];
    this.p.push(new Person(1, this.x + Math.random() * this.w, this.y + Math.random() * this.h, this.infect, this.infectedTime,x1,x2,x3,x4,x5));
    for (let i = 0; i < size - 1; i++) {
        this.p.push(new Person(0, this.x + Math.random() * this.w, this.y + Math.random() * this.h, this.infect, this.infectedTime,x1,x2,x3,x4,x5));
    }
    this.time = 0;
    this.socialDistance = socialDistance;
    this.startSocialDistance = startSocialDistance;
    this.quarantine = quarantine;
    this.startQuarantine = startQuarantine;
    this.moveTime = moveTime;
    this.hospitalCapacity = hospitalCapacity;
    this.deathRate = deathRate;
    this.morgueX = morgueX;
    this.morgueY = morgueY;
    this.hospitalX = hospitalX;
    this.hospitalY = hospitalY;
    this.symptomRate = symptomRate;
    this.graphX = graphX;
    this.graphY = graphY;
    this.graphW = graphW;
    this.graphH = graphH;
    this.states = [];
    this.states.push([this.size, 0, 0, 0, 0]);
    this.doSocialDistance = doSocialDistance;
}
Community.prototype.drawMe = function (g, t, t1, t2,t3,t4,t5,t6,t7,t8, size) {
    for (let i = app.stage.children.length - 1; i >= 0; i--) {
        app.stage.removeChild(app.stage.getChildAt(i));
    }
    g.clear();
    g.lineStyle(1, 0x000000, 1);
    g.drawRect(this.x, this.y, this.w, this.h);
    for (let i = 0; i < this.p.length; i++) {
        this.p[i].create(g);
    }
    t.text = Math.floor(Math.floor(this.time*3/24)/7)+" Weeks, "+Math.floor(this.time*3/24)%7+" Days, " +this.time*3%24+ " Hours";
    t.position.set(20, 20);
    if (this.quarantine) {
        t1.text = this.numberHospital()+" PPL\nQuarantine";
        t1.position.set(this.hospitalX - 20, this.hospitalY + 20);
    }
    t2.text = this.numberDead()+" PPL\nMorgue";
    t2.position.set(this.morgueX - 20, this.morgueY + 20);
    this.graph(g,t3,t4,t5,t6,t7,t8);
    app.stage.addChild(g);
    app.stage.addChild(t);
    app.stage.addChild(t1);
    app.stage.addChild(t2);
    app.stage.addChild(t3);
    app.stage.addChild(t4);
    app.stage.addChild(t5);
    app.stage.addChild(t6);
    app.stage.addChild(t7);
    app.stage.addChild(t8);
}
Community.prototype.numberSpreading = function () {
    let num = 0;
    for (let i = 0; i < this.p.length; i++) {
        if (!this.p[i].quarantined && this.p[i].condition == 1) {
            num++;
        }
    }
    return num;
}
Community.prototype.numberHospital = function () {
    let num = 0;
    for (let i = 0; i < this.p.length; i++) {
        if (this.p[i].quarantined) {
            num++;
        }
    }
    return num;
}
Community.prototype.numberDead = function () {
    let num = 0;
    for (let i = 0; i < this.p.length; i++) {
        if (!this.p[i].alive) {
            num++;
        }
    }
    return num;
}
Community.prototype.numberImmune = function () {
    let num = 0;
    for (let i = 0; i < this.p.length; i++) {
        if (this.p[i].condition == 2 && this.p[i].alive) {
            num++;
        }
    }
    return num;
}
Community.prototype.numberUntouched = function () {
    let num = 0;
    for (let i = 0; i < this.p.length; i++) {
        if (this.p[i].condition == 0) {
            num++;
        }
    }
    return num;
}
Community.prototype.graph = function (g,t3,t4,t5,t6,t7,t8) {
    t3.text="PPL";
    t3.position.set(this.graphX-60,this.graphY+this.graphH/2);
    t4.text="Hours";
    t4.position.set(this.graphX+this.graphW/2-30,this.graphY+this.graphH);
    t5.text="0";
    t6.text="0";
    t5.position.set(this.graphX,this.graphY+this.graphH);
    t6.position.set(this.graphX-20,this.graphY+this.graphH-30);
    t7.text=this.size+"";
    t8.position.set(this.graphX+this.graphW-40,this.graphY+this.graphH);
    t8.text=this.time*3+"";
    t7.position.set(this.graphX-65,this.graphY);
    for (let i = 0; i < this.states.length; i++) {
        let h3 = this.states[i][0] * this.graphH / this.size;
        let h1 = this.states[i][1] * this.graphH / this.size;
        let h4 = this.states[i][2] * this.graphH / this.size;
        let h2 = this.states[i][3] * this.graphH / this.size;
        let h5 = this.states[i][4] * this.graphH / this.size;
        let w = this.graphW / this.states.length;
        let x = i * w + this.graphX;
        g.beginFill(0xFF0000);
        g.drawRect(x, this.graphY + this.graphH - h1, w, h1);
        g.endFill();
        g.beginFill(0xFF00FF);
        g.drawRect(x, this.graphY + this.graphH - h2 - h1, w, h2);
        g.endFill();
        g.beginFill(0xFF5000);
        g.drawRect(x, this.graphY + this.graphH - h4 - h2 - h1, w, h4);
        g.endFill();
        g.beginFill(0x000000);
        g.drawRect(x, this.graphY + this.graphH - h5 - h4 - h2 - h1, w, h5);
        g.endFill();
        g.beginFill(0x0000FF);
        g.drawRect(x, this.graphY + this.graphH - h3 - h2 - h1-h4-h5, w, h3);
        g.endFill();
        if ((this.doSocialDistance && i == this.startSocialDistance) || (this.quarantine && i == this.startQuarantine)) {
            g.beginFill(0xFFFF00);
            g.drawRect(x, this.graphY, 1, this.graphH);
            g.endFill();
        }
    }
}
Community.prototype.done = function () {
    for (let i = 0; i < this.p.length; i++) {
        if (this.p[i].condition == 1) {
            return false;
        }
    }
    return true;
}
Community.prototype.update = function () {
    for (let i = 0; i < this.p.length; i++) {
        this.p[i].progress(this.deathRate, this.moveTime, this.morgueX, this.morgueY, this.hospitalX, this.hospitalY, this.x + this.w / 2, this.y + this.h / 2, (this.hospitalCapacity <= this.numberHospital()), this.quarantine && (this.time >= this.startQuarantine));
        if (this.time >= this.startSocialDistance && this.doSocialDistance) {
            this.p[i].move2(this.speed, this.x, this.y, this.w, this.h, this.p, this.socialDistance);
        } else {
            this.p[i].move(this.speed, this.x, this.y, this.w, this.h);
        }
    }
    for (let i = 0; i < this.p.length; i++) {
        this.p[i].spread(this.p, this.symptomRate);
    }
    this.states.push([this.numberUntouched(), this.numberSpreading(), this.numberHospital(), this.numberImmune(), this.numberDead()]);
    this.time++;
}
function setSimulation() {
    let socialDistance1 = 0;
    let startSocialDistance1 = 0;
    let startQuarantine1 = 0;
    let moveTime1 = 0;
    let hospitalCapacity1 = 0;
    let symptomRate1 = 0;
    if (socialDistancing) {
        socialDistance1 = document.getElementById("socialDistance").value;
        startSocialDistance1 = document.getElementById("startSocialDistance").value;
    }
    if (quarantining) {
        startQuarantine1 = document.getElementById("startQuarantine").value;
        moveTime1 = document.getElementById("moveTime").value;
        hospitalCapacity1 = document.getElementById("hospitalCapacity").value;
        symptomRate1 = document.getElementById("symptomRate").value;
    }
    return new Community(180, 100, 600, 600, 50, 300, 50, 500, 880, 100, 400, 400, document.getElementById("size").value, document.getElementById("speed").value, document.getElementById("infect").value, document.getElementById("infectedTime").value/timeIncrement, socialDistancing, startSocialDistance1/timeIncrement, socialDistance1, quarantining, startQuarantine1/timeIncrement, moveTime1/timeIncrement, hospitalCapacity1, document.getElementById("deathRate").value, symptomRate1);
}
function MassSim(n){
    this.cs=[];
    this.unaffectedMap={};
    for(let i=0;i<n;i++){
        this.cs[i]=setSimulation();
        while(!this.cs[i].done()){
            console.log(this.cs[i].time);
            this.cs[i].update();
        }
        let num=this.cs[i].numberUntouched()
        if(!this.unaffectedMap[num]){
            this.unaffectedMap[num]=1;
        }else{
            this.unaffectedMap[num]+=1;
        }
    }
    this.drawMe=function(g){
        let x=100;
        let y=100;
        let w=500;
        let h=500;
        g.beginFill(0x000000);
        g.drawRect(x,y+h,w,1);
        let keys=Object.keys(this.unaffectedMap);
        let g1=greatest(keys);
        let l=least(keys);
        let v=greatestValue(keys,this.unaffectedMap);
        let deltaX=w/(g1-l+1);
        for(let i=0;i<keys.length;i++){
            console.log(keys[i]);
            let xPos=x+deltaX*(keys[i]-l);
            let hBar=h*this.unaffectedMap[keys[i]]/v;
            g.drawRect(xPos,y+h-hBar,deltaX,hBar);
        }
        g.endFill();
        app2.stage.addChild(g);
    }
}
function least(keys){
    let l=keys[0]
    for(let i=0;i<keys.length;i++){
        if(keys[i]<l){
            l=keys[i];
        }
    }
    return l;
}
function greatest(keys){
    let l=keys[0]
    for(let i=0;i<keys.length;i++){
        if(keys[i]>l){
            l=keys[i];
        }
    }
    return l;
}
function greatestValue(keys,values){
    let l=keys[0];
    for(let i=0;i<keys.length;i++){
        if(values[keys[i]]>values[l]){
            l=keys[i];
        }
    }
    return values[l];
}