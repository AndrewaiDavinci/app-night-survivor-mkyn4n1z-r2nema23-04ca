export default function ScoreBoard({ score }) {
  return (
    <div className="bg-gray-800 rounded-lg px-6 py-3 mb-4">
      <p className="text-gray-400 text-sm">SCORE</p>
      <p className="text-3xl font-bold text-white">{score.toLocaleString()}</p>
    </div>
  )
}
