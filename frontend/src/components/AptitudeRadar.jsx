import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'

function labelize(key) {
  return key
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export default function AptitudeRadar({ aptitude }) {
  const data = Object.entries(aptitude || {}).map(([key, value]) => ({
    subject: labelize(key),
    value,
    fullMark: 100,
  }))

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-paper/50">
        Take the Discovery Quiz to see your aptitude map.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data} outerRadius="75%">
        <PolarGrid stroke="#233152" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#F6F3EC', fontSize: 11 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        <Radar name="Aptitude" dataKey="value" stroke="#F0A93C" fill="#F0A93C" fillOpacity={0.35} />
      </RadarChart>
    </ResponsiveContainer>
  )
}
