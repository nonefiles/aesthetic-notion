"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface WidgetPreviewProps {
  widgetType: "clock" | "weather" | "countdown"
  timezone: string
  clockType: "12h" | "24h" | "analog"
  showSeconds: boolean
  city: string
  units: "celsius" | "fahrenheit"
  forecast: "today" | "3day"
  eventName: string
  eventDate: string
  bgColor: string
  textColor: string
  fontStyle: "sans" | "serif" | "mono"
  padding: "small" | "medium" | "large"
}

export function WidgetPreview({
  widgetType,
  timezone,
  clockType,
  showSeconds,
  city,
  units,
  forecast,
  eventName,
  eventDate,
  bgColor,
  textColor,
  fontStyle,
  padding,
}: WidgetPreviewProps) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const paddingClasses = {
    small: "p-4",
    medium: "p-6",
    large: "p-8",
  }

  const fontClasses = {
    sans: "font-sans",
    serif: "font-serif",
    mono: "font-mono",
  }

  const formatTime = () => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      ...(showSeconds && { second: "2-digit" }),
      hour12: clockType === "12h",
    }
    return time.toLocaleTimeString("en-US", options)
  }

  const calculateCountdown = () => {
    if (!eventDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    const target = new Date(eventDate).getTime()
    const now = time.getTime()
    const diff = target - now

    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    }
  }

  const renderClock = () => {
    if (clockType === "analog") {
      const hours = time.getHours() % 12
      const minutes = time.getMinutes()
      const seconds = time.getSeconds()

      const hourAngle = hours * 30 + minutes * 0.5
      const minuteAngle = minutes * 6
      const secondAngle = seconds * 6

      return (
        <div className="relative mx-auto h-48 w-48">
          <svg viewBox="0 0 200 200" className="h-full w-full">
            {/* Clock face */}
            <circle cx="100" cy="100" r="90" fill="none" stroke={textColor} strokeWidth="2" />
            {/* Hour markers */}
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30 - 90) * (Math.PI / 180)
              const x1 = 100 + 80 * Math.cos(angle)
              const y1 = 100 + 80 * Math.sin(angle)
              const x2 = 100 + 90 * Math.cos(angle)
              const y2 = 100 + 90 * Math.sin(angle)
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={textColor} strokeWidth="2" />
            })}
            {/* Hour hand */}
            <line
              x1="100"
              y1="100"
              x2={100 + 50 * Math.sin((hourAngle * Math.PI) / 180)}
              y2={100 - 50 * Math.cos((hourAngle * Math.PI) / 180)}
              stroke={textColor}
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Minute hand */}
            <line
              x1="100"
              y1="100"
              x2={100 + 70 * Math.sin((minuteAngle * Math.PI) / 180)}
              y2={100 - 70 * Math.cos((minuteAngle * Math.PI) / 180)}
              stroke={textColor}
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Second hand */}
            {showSeconds && (
              <line
                x1="100"
                y1="100"
                x2={100 + 75 * Math.sin((secondAngle * Math.PI) / 180)}
                y2={100 - 75 * Math.cos((secondAngle * Math.PI) / 180)}
                stroke={textColor}
                strokeWidth="1"
                strokeLinecap="round"
              />
            )}
            {/* Center dot */}
            <circle cx="100" cy="100" r="4" fill={textColor} />
          </svg>
        </div>
      )
    }

    return (
      <div className="text-center">
        <div className="text-6xl font-bold tracking-tight">{formatTime()}</div>
        <div className="mt-2 text-sm opacity-70">
          {time.toLocaleDateString("en-US", { timeZone: timezone, dateStyle: "long" })}
        </div>
      </div>
    )
  }

  const renderWeather = () => {
    // Mock weather data
    const temp = units === "celsius" ? "22" : "72"
    const unit = units === "celsius" ? "°C" : "°F"

    return (
      <div className="text-center">
        <div className="mb-2 text-2xl font-semibold">{city || "City Name"}</div>
        <div className="mb-4 text-6xl font-bold">
          {temp}
          {unit}
        </div>
        <div className="text-lg opacity-70">☀️ Sunny</div>
        {forecast === "3day" && (
          <div className="mt-6 flex justify-center gap-4">
            <div className="text-center">
              <div className="text-sm opacity-70">Tomorrow</div>
              <div className="text-2xl font-semibold">
                {Number.parseInt(temp) + 2}
                {unit}
              </div>
              <div className="text-sm">⛅</div>
            </div>
            <div className="text-center">
              <div className="text-sm opacity-70">Day 3</div>
              <div className="text-2xl font-semibold">
                {Number.parseInt(temp) - 1}
                {unit}
              </div>
              <div className="text-sm">🌧️</div>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderCountdown = () => {
    const countdown = calculateCountdown()

    return (
      <div className="text-center">
        <div className="mb-4 text-2xl font-semibold">{eventName || "Event Name"}</div>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <div className="text-4xl font-bold">{countdown.days}</div>
            <div className="text-sm opacity-70">Days</div>
          </div>
          <div>
            <div className="text-4xl font-bold">{countdown.hours}</div>
            <div className="text-sm opacity-70">Hours</div>
          </div>
          <div>
            <div className="text-4xl font-bold">{countdown.minutes}</div>
            <div className="text-sm opacity-70">Minutes</div>
          </div>
          <div>
            <div className="text-4xl font-bold">{countdown.seconds}</div>
            <div className="text-sm opacity-70">Seconds</div>
          </div>
        </div>
        {eventDate && (
          <div className="mt-4 text-sm opacity-70">
            {new Date(eventDate).toLocaleDateString("en-US", { dateStyle: "long" })}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn("rounded-lg", paddingClasses[padding], fontClasses[fontStyle])}
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      {widgetType === "clock" && renderClock()}
      {widgetType === "weather" && renderWeather()}
      {widgetType === "countdown" && renderCountdown()}
    </div>
  )
}
