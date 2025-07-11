interface ThermometerProps {
  percent: number
}

export default function Thermometer({ percent }: ThermometerProps) {
  function getColor() {
    if (percent < 16) {
      return 'rgb(35, 171, 68)'
    }

    if (percent < 32) {
      return 'rgb(65, 223, 103)'
    }

    if (percent < 48) {
      return 'rgb(231, 255, 8)'
    }

    if (percent < 64) {
      return 'rgb(255, 179, 0)'
    }

    if (percent < 80) {
      return 'rgb(255, 122, 29)'
    }

    if (percent <= 100) {
      return 'rgb(255, 0, 0)'
    }

    return 'rgb(0, 0, 0)'
  }

  return (
    <div className="gradient-thermometer relative flex h-[5px] w-full rounded-md">
      <div
        className="absolute top-1/2 size-6 -translate-y-1/2 rounded-full border-[5px] border-white bg-green-400 shadow-[var(--box-shadow-level-1)]"
        style={{
          left: `${percent}%`,
          background: getColor()
        }}
      />
    </div>
  )
}
