import type { ForecastEntry } from './forecastApi'
import {
  createTemperatureChartPoints,
  createTemperatureDayLabels,
  type ChartPadding,
} from './temperatureChart'

type TemperatureChartProps = Readonly<{
  entries: readonly ForecastEntry[]
  timezone: number
}>

const CHART_WIDTH = 640
const CHART_HEIGHT = 280
const CHART_PADDING: ChartPadding = {
  top: 28,
  right: 16,
  bottom: 52,
  left: 56,
}

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'UTC',
})

const temperatureFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 1,
})

const dayFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
  timeZone: 'UTC',
})

const formatDateTime = (timestamp: number, timezone: number): string =>
  dateTimeFormatter.format(new Date((timestamp + timezone) * 1000))

const formatTemperature = (temperature: number): string =>
  `${temperatureFormatter.format(temperature)} °C`

const formatDay = (timestamp: number, timezone: number): string =>
  dayFormatter.format(new Date((timestamp + timezone) * 1000))

export function TemperatureChart({
  entries,
  timezone,
}: TemperatureChartProps) {
  const points = createTemperatureChartPoints(
    entries,
    CHART_WIDTH,
    CHART_HEIGHT,
    CHART_PADDING,
  )

  if (points.length === 0) {
    return null
  }

  const temperatures = points.map((point) => point.temperature)
  const minimum = Math.min(...temperatures)
  const maximum = Math.max(...temperatures)
  const plotBottom = CHART_HEIGHT - CHART_PADDING.bottom
  const plotMiddle =
    CHART_PADDING.top + (plotBottom - CHART_PADDING.top) / 2
  const temperatureTicks =
    minimum === maximum
      ? [{ temperature: minimum, y: plotMiddle }]
      : [
          { temperature: maximum, y: CHART_PADDING.top },
          { temperature: (minimum + maximum) / 2, y: plotMiddle },
          { temperature: minimum, y: plotBottom },
        ]
  const dayLabels = createTemperatureDayLabels(points, timezone)

  return (
    <section className="temperature-chart">
      <h2>Vývoj teploty</h2>

      <div className="temperature-chart__summary">
        <span>Minimum: {formatTemperature(minimum)}</span>
        <span>Maximum: {formatTemperature(maximum)}</span>
      </div>

      <div className="temperature-chart__scroll">
        <div className="temperature-chart__canvas">
          <svg
            className="temperature-chart__plot"
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            role="img"
          >
            <title>Vývoj teploty v tříhodinových intervalech</title>
            {temperatureTicks.map((tick) => (
              <g key={tick.temperature}>
                <line
                  className="temperature-chart__grid"
                  x1={CHART_PADDING.left}
                  x2={CHART_WIDTH - CHART_PADDING.right}
                  y1={tick.y}
                  y2={tick.y}
                />
                <text
                  className="temperature-chart__scale"
                  x={CHART_PADDING.left - 10}
                  y={tick.y + 6}
                  textAnchor="end"
                >
                  {temperatureFormatter.format(tick.temperature)}
                </text>
              </g>
            ))}
            <line
              className="temperature-chart__axis"
              x1={CHART_PADDING.left}
              x2={CHART_PADDING.left}
              y1={CHART_PADDING.top}
              y2={plotBottom}
            />
            <line
              className="temperature-chart__axis"
              x1={CHART_PADDING.left}
              x2={CHART_WIDTH - CHART_PADDING.right}
              y1={plotBottom}
              y2={plotBottom}
            />
            <text
              className="temperature-chart__axis-title"
              x={CHART_PADDING.left}
              y="20"
            >
              °C
            </text>
            {dayLabels.map((label) => (
              <text
                className="temperature-chart__day"
                key={label.date}
                x={label.x}
                y={CHART_HEIGHT - 16}
                textAnchor="middle"
              >
                {formatDay(label.timestamp, timezone)}
              </text>
            ))}
            <polyline
              className="temperature-chart__line"
              points={points.map((point) => `${point.x},${point.y}`).join(' ')}
            />
            {points.map((point) => (
              <circle
                className="temperature-chart__point"
                key={point.timestamp}
                cx={point.x}
                cy={point.y}
                r="6"
              >
                <title>
                  {formatDateTime(point.timestamp, timezone)}:{' '}
                  {formatTemperature(point.temperature)}
                </title>
              </circle>
            ))}
          </svg>
        </div>
      </div>
    </section>
  )
}
