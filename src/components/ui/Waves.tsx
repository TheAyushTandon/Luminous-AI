'use client'
import * as React from 'react'
import { useEffect, useRef } from 'react'
import { createNoise2D } from 'simplex-noise'

interface Point {
    x: number
    y: number
    wave: { x: number; y: number }
    cursor: {
        x: number
        y: number
        vx: number
        vy: number
    }
}

interface WavesProps {
    className?: string
    strokeColor?: string
    backgroundColor?: string
    pointerSize?: number
}

export function Waves({
    className = "",
    strokeColor = "#bac4fa",
    backgroundColor = "#0B0F14",
    pointerSize = 0.5
}: WavesProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const svgRef = useRef<SVGSVGElement>(null)
    const mouseRef = useRef({
        x: -10,
        y: 0,
        lx: 0,
        ly: 0,
        sx: 0,
        sy: 0,
        v: 0,
        vs: 0,
        a: 0,
        set: false,
    })
    const pathsRef = useRef<SVGPathElement[]>([])
    const linesRef = useRef<Point[][]>([])
    const noiseRef = useRef<((x: number, y: number) => number) | null>(null)
    const rafRef = useRef<number | null>(null)
    const boundingRef = useRef<DOMRect | null>(null)

    useEffect(() => {
        if (!containerRef.current || !svgRef.current) return

        noiseRef.current = createNoise2D()
        setSize()
        setLines()

        window.addEventListener('resize', onResize)
        window.addEventListener('mousemove', onMouseMove, { passive: true })

        rafRef.current = requestAnimationFrame(tick)

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
            window.removeEventListener('resize', onResize)
            window.removeEventListener('mousemove', onMouseMove)
        }
    }, [])

    const setSize = () => {
        if (!containerRef.current || !svgRef.current) return

        boundingRef.current = containerRef.current.getBoundingClientRect()
        const { width, height } = boundingRef.current

        svgRef.current.style.width = `${width}px`
        svgRef.current.style.height = `${height}px`
    }

    const setLines = () => {
        if (!svgRef.current || !boundingRef.current) return

        const { width, height } = boundingRef.current
        linesRef.current = []

        pathsRef.current.forEach(path => {
            path.remove()
        })
        pathsRef.current = []

        // Increased gap for better performance
        const xGap = 16  // Doubled from 8
        const yGap = 16  // Doubled from 8

        const oWidth = width + 200
        const oHeight = height + 30

        const totalLines = Math.ceil(oWidth / xGap)
        const totalPoints = Math.ceil(oHeight / yGap)

        const xStart = (width - xGap * totalLines) / 2
        const yStart = (height - yGap * totalPoints) / 2

        for (let i = 0; i < totalLines; i++) {
            const points: Point[] = []

            for (let j = 0; j < totalPoints; j++) {
                const point: Point = {
                    x: xStart + xGap * i,
                    y: yStart + yGap * j,
                    wave: { x: 0, y: 0 },
                    cursor: { x: 0, y: 0, vx: 0, vy: 0 },
                }

                points.push(point)
            }

            const path = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'path'
            )
            path.setAttribute('fill', 'none')
            path.setAttribute('stroke', strokeColor)
            path.setAttribute('stroke-width', '1')
            path.style.opacity = '0.25'

            svgRef.current.appendChild(path)
            pathsRef.current.push(path)

            linesRef.current.push(points)
        }
    }

    const onResize = () => {
        setSize()
        setLines()
    }

    const onMouseMove = (e: MouseEvent) => {
        if (!boundingRef.current) return

        const mouse = mouseRef.current
        mouse.x = e.pageX - boundingRef.current.left
        mouse.y = e.pageY - boundingRef.current.top + window.scrollY

        if (!mouse.set) {
            mouse.sx = mouse.x
            mouse.sy = mouse.y
            mouse.lx = mouse.x
            mouse.ly = mouse.y
            mouse.set = true
        }
    }

    const movePoints = (time: number) => {
        const { current: lines } = linesRef
        const { current: mouse } = mouseRef
        const { current: noise } = noiseRef

        if (!noise) return

        lines.forEach((points) => {
            points.forEach((p: Point) => {
                // Very slow wave calculation
                const move = noise(
                    p.x * 0.002,
                    (p.y + time * 0.03) * 0.002  // Reduced from 0.15 to 0.03 for very slow motion
                ) * 6

                p.wave.x = Math.cos(move) * 8
                p.wave.y = Math.sin(move) * 4

                // Reduced mouse interaction
                const dx = p.x - mouse.sx
                const dy = p.y - mouse.sy
                const d = Math.hypot(dx, dy)
                const l = 150

                if (d < l) {
                    const s = 1 - d / l
                    const f = s * 0.3

                    p.cursor.vx += Math.cos(mouse.a) * f * mouse.vs * 0.0002
                    p.cursor.vy += Math.sin(mouse.a) * f * mouse.vs * 0.0002
                }

                p.cursor.vx += (0 - p.cursor.x) * 0.02
                p.cursor.vy += (0 - p.cursor.y) * 0.02

                p.cursor.vx *= 0.9
                p.cursor.vy *= 0.9

                p.cursor.x += p.cursor.vx
                p.cursor.y += p.cursor.vy

                p.cursor.x = Math.min(40, Math.max(-40, p.cursor.x))
                p.cursor.y = Math.min(40, Math.max(-40, p.cursor.y))
            })
        })
    }

    const moved = (point: Point, withCursorForce = true) => {
        return {
            x: point.x + point.wave.x + (withCursorForce ? point.cursor.x : 0),
            y: point.y + point.wave.y + (withCursorForce ? point.cursor.y : 0),
        }
    }

    const drawLines = () => {
        const { current: lines } = linesRef
        const { current: paths } = pathsRef

        lines.forEach((points, lIndex) => {
            if (points.length < 2 || !paths[lIndex]) return

            const firstPoint = moved(points[0], false)
            let d = `M ${firstPoint.x} ${firstPoint.y}`

            for (let i = 1; i < points.length; i++) {
                const current = moved(points[i])
                d += `L ${current.x} ${current.y}`
            }

            paths[lIndex].setAttribute('d', d)
        })
    }

    const tick = (time: number) => {
        const { current: mouse } = mouseRef

        mouse.sx += (mouse.x - mouse.sx) * 0.1
        mouse.sy += (mouse.y - mouse.sy) * 0.1

        const dx = mouse.x - mouse.lx
        const dy = mouse.y - mouse.ly
        const d = Math.hypot(dx, dy)

        mouse.v = d
        mouse.vs += (d - mouse.vs) * 0.1
        mouse.vs = Math.min(100, mouse.vs)

        mouse.lx = mouse.x
        mouse.ly = mouse.y

        mouse.a = Math.atan2(dy, dx)

        movePoints(time)
        drawLines()

        rafRef.current = requestAnimationFrame(tick)
    }

    return (
        <div
            ref={containerRef}
            className={`waves-component ${className}`}
            style={{
                backgroundColor,
                position: 'absolute',
                top: 0,
                left: 0,
                margin: 0,
                padding: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
            } as React.CSSProperties}
        >
            <svg
                ref={svgRef}
                className="block w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
            />
        </div>
    )
}
