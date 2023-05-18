class Circle{
    constructor() {
        this.type = 'circle';
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = g_selectedSize;
        this.segments = 10;
    }

    render(){
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;
        gl.disableVertexAttribArray(a_Position);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        var d = size/200.0;

        let angleStep = 360/this.segments;

        for(var angle = 0; angle < 360;angle = angle + angleStep){
            let centerpt = [xy[0], xy[1]];
            let ang1 = angle;
            let ang2 = ang1 + angleStep;
            let vec1 = [Math.cos(ang1*Math.PI/180)*d, Math.sin(ang1*Math.PI/180)*d];
            let vec2 = [Math.cos(ang2*Math.PI/180)*d, Math.sin(ang2*Math.PI/180)*d];
            let pt1 = [centerpt[0]+vec1[0], centerpt[1]+vec1[1]];
            let pt2 = [centerpt[0]+vec2[0], centerpt[1]+vec2[1]];
            drawTriangle( [xy[0], xy[1], pt1[0], pt1[1], pt2[0], pt2[1]]);

        }
    }
}
