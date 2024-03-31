import Scene from "../canvas/Scene"
import { deg2rad } from "../utils/MathUtils"

const drawLine = (context, x, y, length, angle, width) => {
    context.save()
    context.beginPath()
    context.translate(x, y)
    context.rotate(angle)
    context.lineWidth = width
    context.moveTo(0, 0)
    context.lineTo(length, 0)
    context.stroke()
    context.restore()
}

export default class Clock extends Scene {
    constructor(id) {
        super(id)

        this.params['hour-hand-width'] = 8
        this.params['minute-hand-width'] = 5
        this.params['second-hand-width'] = 2
        this.params.color = "#fb923c"

        this.updateTime()
    }

    resize() {
        super.resize()

        this.mainRadius = Math.min(this.width, this.height) * 0.5 * 0.65
        this.deltaRadius = this.mainRadius * 0.075

        this.drawUpdate()
    }

    updateTime() {
        const now = new Date()
        this.hours = now.getHours()
        this.minutes = now.getMinutes()
        this.seconds = now.getSeconds()
    }

    update() {
        if (!super.update()) return false
        
        this.updateTime()
        this.drawUpdate()

        return true
    }

    drawHourMarks() {
        const hourMarkRadius = this.mainRadius * 0.9
        const markSize = 5
        for (let hour = 0; hour < 12; hour++) {
            const angle = deg2rad((360 / 12) * hour - 90)
            const x = this.width / 2 + hourMarkRadius * Math.cos(angle)
            const y = this.height / 2 + hourMarkRadius * Math.sin(angle)
    
            this.context.beginPath()
            this.context.arc(x, y, markSize, 0, Math.PI * 2)
            this.context.fill()
        }
    }

    drawUpdate() {
        this.clear()

        this.context.lineCap = 'round'
        this.context.strokeStyle = this.params.color

        this.context.beginPath()
        this.context.arc(this.width / 2, this.height / 2, this.mainRadius, 0, Math.PI * 2)
        this.context.stroke()

        this.context.fillStyle = this.params.color
        this.drawHourMarks()
    

        this.drawHands()
    }

    drawHands() {
        const secondAngle = deg2rad((360 / 60) * this.seconds - 90)
        const minuteAngle = deg2rad((360 / 60) * this.minutes - 90 + (this.seconds / 60) * 6)
        const hourAngle = deg2rad((360 / 12) * this.hours - 90 + (this.minutes / 60) * 30)

        drawLine(this.context, this.width / 2, this.height / 2, this.mainRadius * 0.9, secondAngle, this.params['second-hand-width'])
        drawLine(this.context, this.width / 2, this.height / 2, this.mainRadius * 0.75, minuteAngle, this.params['minute-hand-width'])
        drawLine(this.context, this.width / 2, this.height / 2, this.mainRadius * 0.5, hourAngle, this.params['hour-hand-width'])
    }
}
