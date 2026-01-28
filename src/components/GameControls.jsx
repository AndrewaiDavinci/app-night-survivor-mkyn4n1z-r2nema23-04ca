export default function GameControls({ onStart }) {
  return (
    <button
      onClick={onStart}
      className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors text-lg"
    >
      Start Game
    </button>
  )
}
