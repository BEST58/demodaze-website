var gameCanvas = document.getElementById('gameCanvas');
var gameScore = document.getElementById('gameScore');
var rawScore = 0;

var gameWidth = document.getElementsByClassName('mainContent')[0].clientWidth - 60;

var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composites = Matter.Composites,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Composite = Matter.Composite,
    Constraint = Matter.Constraint,
    Bodies = Matter.Bodies;

// create engine
var engine = Engine.create(),
    world = engine.world;

// create renderer
var render = Render.create({
    canvas: gameCanvas,
    engine: engine,
    options: {
        width: gameWidth,
        height: 600,
        showAngleIndicator: true,
        wireframes: false // <-- important
    }
});

Render.run(render);

// create runner
// var runner = Runner.create();
// Runner.run(runner, engine);

// add bodies
var rows = 10,
    columns = 4,
    yy = 600 - 25 - 40 * rows;

if(gameWidth < 600) columns = 2;
else if(gameWidth < 700) columns = 3;

var towerBoxes = [];
for (let c = 0; c < columns; c++) {    
    for (let i = 0; i < rows; i++) {
        let box = Bodies.rectangle(gameWidth * 41/80 + c * 40, yy + i * 40, 40, 40, {density: 0.07, label: 'gamePiece'})
        towerBoxes.push(box)
        Composite.add(world, box);
    }
}

// var stack = Composites.stack(400, yy, 5, rows, 0, 0, function(x, y) {
//     return Bodies.rectangle(x, y, 40, 40, {density: 0.07});
// });

Composite.add(world, [
    // walls
    Bodies.rectangle(gameWidth * 4/8, 0, gameWidth, 50, { isStatic: true }),
    Bodies.rectangle(gameWidth * 45/80, 600, gameWidth * 28/80, 50, {
        isStatic: true,
        render: {
            fillStyle: 'white',
            strokeStyle: 'white',
            lineWidth: 1
        }
    }),
    Bodies.rectangle(gameWidth, 300, 50, 600, { isStatic: true }),
    Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
]);

var ball = Bodies.circle(gameWidth * 3/8, 500, gameWidth * 5/80, {
    density: 0.04,
    frictionAir: 0.005,
    render: {
        fillStyle: 'blue',
        strokeStyle: 'darkblue',
        lineWidth: 3
    }
});
var score = Bodies.rectangle(gameWidth * 7/9, 600, gameWidth * 5/80, 50, {
    isStatic: true,
    isSensor: true,
    render: {
        strokeStyle: 'orange',
        lineWidth: 3
    }
});

Composite.add(world, score);
Composite.add(world, ball);
Composite.add(world, Constraint.create({
    pointA: { x: gameWidth * 3/8, y: 100 },
    bodyB: ball
}));

var dragBody = null

Matter.Events.on(engine, 'beforeUpdate', function(event) {
    if (dragBody != null) {
       if (dragBody.velocity.x > 25.0) {
           Matter.Body.setVelocity(dragBody, {x: 25, y: dragBody.velocity.y });
       }
       if (dragBody.velocity.y > 25.0) {
           Matter.Body.setVelocity(dragBody, {x: dragBody.velocity.x, y: 25 });
       }
       if (dragBody.positionImpulse.x > 25.0) {
           dragBody.positionImpulse.x = 25.0;
       }
       if (dragBody.positionImpulse.y > 25.0) {
           dragBody.positionImpulse.y = 25.0;
       }
   }
});

// add mouse control
var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        },
    });

Composite.add(world, mouseConstraint);

Matter.Events.on(mouseConstraint, 'startdrag', function(event) {
    dragBody = event.body;
    if(dragBody.label == 'gamePiece') {
        Matter.Body.setStatic(dragBody, true)
    }
});

Matter.Events.on(mouseConstraint, 'mouseup', function(event) {
    if(dragBody && dragBody.label == 'gamePiece') {
        Matter.Body.setStatic(dragBody, false)
    }
});


// keep the mouse in sync with rendering
render.mouse = mouse;

// fit the render viewport to the scene
Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: gameWidth, y: 600 }
});

let scoringPieceX = score.position.x
let scoringPieceY = score.position.y

function update() {
    
    Engine.update(engine)

    for (let i = 0; i < towerBoxes.length; i++) {
        const element = towerBoxes[i];
        if(Math.abs(element.position.x - scoringPieceX) < 40 && Math.abs(element.position.y - scoringPieceY) < 30) {
            // scored
            console.log("piece scored")
            rawScore += 1;
            gameScore.innerHTML = "Game Score: "+rawScore + "/"+columns*rows+" ("+(rawScore/(columns*rows)*100).toFixed(2)+"%)"
            Composite.remove(world, element)
            towerBoxes.splice(i, 1)
            i--
        } else if(element.position.y > 640) {
            // off screen
            console.log("piece lost")
            Composite.remove(world, element)
            towerBoxes.splice(i, 1)
            i--
        }
    }

    window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update);

function reset() {
    window.location.reload(false); 
}