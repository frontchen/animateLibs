// inspired by the pure css sad man https://codepen.io/knyttneve/pen/yqwXyM
const canvas = {
    init() {
        this.ele = document.createElement('canvas')
        document.body.appendChild(this.ele)
        this.resize()
        window.addEventListener('resize', () => this.resize(), false)
        this.ctx = this.ele.getContext('2d')
        return this.ctx
    },
    onResize(callback) {
        this.resizeCallback = callback
    },
    resize() {
        this.width = this.ele.width = window.innerWidth * 2
        this.height = this.ele.height = window.innerHeight * 2
        this.ele.style.width = this.ele.width * 0.5 + 'px'
        this.ele.style.height = this.ele.height * 0.5 + 'px'
        this.ctx = this.ele.getContext('2d')
        this.ctx.scale(2, 2)
        this.resizeCallback && this.resizeCallback()
    },
    run(callback) {
        requestAnimationFrame(() => {
            this.run(callback)
        })
        callback(this.ctx)
    }
}

const ctx = canvas.init()

let objects = []

class SwingBall {
    constructor(strategy, x) {
        this.x = x
        this.strategy = strategy
        this.angle = 45
        this.aSpeed = 1
    }
    draw(t) {
        ctx.save()
        ctx.beginPath()
        ctx.translate(this.x, 0)
        ctx.fillStyle = '#071635'
        ctx.lineWidth = 4
        if (this.strategy === 'linear') {
            if (Math.abs(this.angle) >= 45) {
                this.aSpeed *= -1
            }
            this.angle += this.aSpeed
            ctx.rotate(this.angle / 180 * Math.PI)
        } else {
            ctx.rotate(Math.cos(t / 180 * Math.PI) * Math.PI * 0.25)
        }
        ctx.arc(0, 200, 35, 0, 2 * Math.PI)
        ctx.moveTo(0, 0)
        ctx.lineTo(0, 200)
        ctx.stroke()
        ctx.fill()
        ctx.closePath()
        ctx.restore()
    }
}

const init = () => {
    objects = []
    objects.push(new SwingBall('linear', window.innerWidth * 0.25))
    objects.push(new SwingBall('trigonometry', window.innerWidth * 0.75))
}

document.addEventListener('click', () => {
    init()
})

init()

let tick = 0
canvas.run(ctx => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    tick += 2
    objects.forEach(obj => {
        obj.draw(tick)
    })
})

canvas.onResize(() => {
    init()
})