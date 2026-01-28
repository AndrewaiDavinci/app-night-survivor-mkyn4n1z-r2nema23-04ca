import { useRef, useEffect, useCallback } from 'react'

const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 400
const PLAYER_SIZE = 20
const PLAYER_SPEED = 5

export default function GameCanvas({ isPlaying, onGameOver, onScoreUpdate }) {
  const canvasRef = useRef(null)
  const playerRef = useRef({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 })
  const keysRef = useRef({})
  const frameRef = useRef(0)

  const draw = useCallback((ctx) => {
    // Clear canvas
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw player
    const player = playerRef.current
    ctx.fillStyle = '#4ade80'
    ctx.beginPath()
    ctx.arc(player.x, player.y, PLAYER_SIZE / 2, 0, Math.PI * 2)
    ctx.fill()

    // Draw grid lines (decorative)
    ctx.strokeStyle = '#ffffff10'
    ctx.lineWidth = 1
    for (let i = 0; i < CANVAS_WIDTH; i += 40) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, CANVAS_HEIGHT)
      ctx.stroke()
    }
    for (let i = 0; i < CANVAS_HEIGHT; i += 40) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(CANVAS_WIDTH, i)
      ctx.stroke()
    }
  }, [])

  const update = useCallback(() => {
    const player = playerRef.current
    const keys = keysRef.current

    // Update player position based on keys
    if (keys['ArrowUp'] || keys['KeyW']) {
      player.y = Math.max(PLAYER_SIZE / 2, player.y - PLAYER_SPEED)
    }
    if (keys['ArrowDown'] || keys['KeyS']) {
      player.y = Math.min(CANVAS_HEIGHT - PLAYER_SIZE / 2, player.y + PLAYER_SPEED)
    }
    if (keys['ArrowLeft'] || keys['KeyA']) {
      player.x = Math.max(PLAYER_SIZE / 2, player.x - PLAYER_SPEED)
    }
    if (keys['ArrowRight'] || keys['KeyD']) {
      player.x = Math.min(CANVAS_WIDTH - PLAYER_SIZE / 2, player.x + PLAYER_SPEED)
    }

    // Score increment over time
    frameRef.current++
    if (frameRef.current % 60 === 0) {
      onScoreUpdate(10)
    }
  }, [onScoreUpdate])

  useEffect(() => {
    if (!isPlaying) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId

    // Reset player position
    playerRef.current = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 }
    frameRef.current = 0

    const handleKeyDown = (e) => {
      keysRef.current[e.code] = true
    }

    const handleKeyUp = (e) => {
      keysRef.current[e.code] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    const gameLoop = () => {
      update()
      draw(ctx)
      animationId = requestAnimationFrame(gameLoop)
    }

    gameLoop()

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      cancelAnimationFrame(animationId)
    }
  }, [isPlaying, draw, update])

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="rounded-lg border-2 border-gray-700"
    />
  )
}
