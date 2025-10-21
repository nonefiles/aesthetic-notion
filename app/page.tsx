"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Check } from "lucide-react"
import { WidgetPreview } from "@/components/widget-preview"

type WidgetType = "clock" | "weather" | "countdown"
type ClockType = "12h" | "24h" | "analog"
type Units = "celsius" | "fahrenheit"
type Forecast = "today" | "3day"
type FontStyle = "sans" | "serif" | "mono"
type Padding = "small" | "medium" | "large"

export default function Home() {
  const [widgetType, setWidgetType] = useState<WidgetType>("clock")
  const [timezone, setTimezone] = useState("America/New_York")
  const [clockType, setClockType] = useState<ClockType>("12h")
  const [showSeconds, setShowSeconds] = useState(true)
  const [city, setCity] = useState("")
  const [units, setUnits] = useState<Units>("celsius")
  const [forecast, setForecast] = useState<Forecast>("today")
  const [eventName, setEventName] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [bgColor, setBgColor] = useState("#ffffff")
  const [isTransparent, setIsTransparent] = useState(false)
  const [textColor, setTextColor] = useState("#37352F")
  const [fontStyle, setFontStyle] = useState<FontStyle>("sans")
  const [padding, setPadding] = useState<Padding>("medium")
  const [generatedUrl, setGeneratedUrl] = useState("")
  const [copied, setCopied] = useState(false)

  // Detect user's timezone on mount
  useEffect(() => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    setTimezone(userTimezone)
  }, [])

  const generateUrl = () => {
    const params = new URLSearchParams({
      type: widgetType,
      ...(widgetType === "clock" && {
        tz: timezone,
        clockType,
        seconds: showSeconds.toString(),
      }),
      ...(widgetType === "weather" && {
        city,
        units,
        forecast,
      }),
      ...(widgetType === "countdown" && {
        event: eventName,
        date: eventDate,
      }),
      bg: isTransparent ? "transparent" : bgColor,
      color: textColor,
      font: fontStyle,
      padding,
    })

    const url = `https://api.aestheticnotion.io/render?${params.toString()}`
    setGeneratedUrl(url)
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">AestheticNotion.io</h1>
            <nav className="flex gap-6">
              <a href="#embed" className="text-sm text-gray-600 hover:text-gray-900">
                How to Embed
              </a>
              <a href="#gallery" className="text-sm text-gray-600 hover:text-gray-900">
                Gallery / Examples
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Ad Slot 1 */}
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="mx-auto flex h-[90px] w-full max-w-7xl items-center justify-center">
          <div className="flex h-[90px] w-[728px] items-center justify-center bg-gray-100 text-sm text-gray-400">
            Ad Slot 1 (728x90)
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Control Panel - Left Column */}
          <div className="space-y-8 md:col-span-1">
            <div>
              <h1 className="mb-6 text-3xl font-bold text-gray-900">Create Your Free Notion Widget</h1>

              {/* Step 1: Widget Selection */}
              <div className="mb-8">
                <Label className="mb-3 block text-sm font-medium text-gray-700">Step 1: Choose Widget Type</Label>
                <Tabs value={widgetType} onValueChange={(v) => setWidgetType(v as WidgetType)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="clock">Clock</TabsTrigger>
                    <TabsTrigger value="weather">Weather</TabsTrigger>
                    <TabsTrigger value="countdown">Countdown</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Step 2: Customization */}
              <div className="mb-8">
                <Label className="mb-3 block text-sm font-medium text-gray-700">Step 2: Customize</Label>
                <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  {widgetType === "clock" && (
                    <>
                      <div>
                        <Label htmlFor="timezone" className="mb-2 block text-sm text-gray-600">
                          Timezone
                        </Label>
                        <Select value={timezone} onValueChange={setTimezone}>
                          <SelectTrigger id="timezone">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="America/New_York">Eastern (EST)</SelectItem>
                            <SelectItem value="America/Chicago">Central (CST)</SelectItem>
                            <SelectItem value="America/Denver">Mountain (MST)</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific (PST)</SelectItem>
                            <SelectItem value="Europe/London">London (GMT)</SelectItem>
                            <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                            <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                            <SelectItem value="Australia/Sydney">Sydney (AEDT)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="mb-2 block text-sm text-gray-600">Clock Type</Label>
                        <RadioGroup value={clockType} onValueChange={(v) => setClockType(v as ClockType)}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="12h" id="12h" />
                            <Label htmlFor="12h" className="font-normal">
                              Digital (12h)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="24h" id="24h" />
                            <Label htmlFor="24h" className="font-normal">
                              Digital (24h)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="analog" id="analog" />
                            <Label htmlFor="analog" className="font-normal">
                              Analog (Minimal)
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="seconds" className="text-sm text-gray-600">
                          Show Seconds?
                        </Label>
                        <Switch id="seconds" checked={showSeconds} onCheckedChange={setShowSeconds} />
                      </div>
                    </>
                  )}

                  {widgetType === "weather" && (
                    <>
                      <div>
                        <Label htmlFor="city" className="mb-2 block text-sm text-gray-600">
                          City Name
                        </Label>
                        <Input
                          id="city"
                          placeholder="e.g., New York"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </div>

                      <div>
                        <Label className="mb-2 block text-sm text-gray-600">Units</Label>
                        <RadioGroup value={units} onValueChange={(v) => setUnits(v as Units)}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="celsius" id="celsius" />
                            <Label htmlFor="celsius" className="font-normal">
                              Celsius (°C)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="fahrenheit" id="fahrenheit" />
                            <Label htmlFor="fahrenheit" className="font-normal">
                              Fahrenheit (°F)
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div>
                        <Label className="mb-2 block text-sm text-gray-600">Forecast</Label>
                        <RadioGroup value={forecast} onValueChange={(v) => setForecast(v as Forecast)}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="today" id="today" />
                            <Label htmlFor="today" className="font-normal">
                              Today Only
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="3day" id="3day" />
                            <Label htmlFor="3day" className="font-normal">
                              3-Day Forecast
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </>
                  )}

                  {widgetType === "countdown" && (
                    <>
                      <div>
                        <Label htmlFor="eventName" className="mb-2 block text-sm text-gray-600">
                          Event Name
                        </Label>
                        <Input
                          id="eventName"
                          placeholder="e.g., My Birthday"
                          value={eventName}
                          onChange={(e) => setEventName(e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="eventDate" className="mb-2 block text-sm text-gray-600">
                          Event Date
                        </Label>
                        <Input
                          id="eventDate"
                          type="date"
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Step 3: Style Settings */}
              <div>
                <Label className="mb-3 block text-sm font-medium text-gray-700">Step 3: Style Settings</Label>
                <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <Label htmlFor="bgColor" className="text-sm text-gray-600">
                        Background Color
                      </Label>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="transparent" className="text-xs text-gray-500">
                          Transparent
                        </Label>
                        <Switch id="transparent" checked={isTransparent} onCheckedChange={setIsTransparent} />
                      </div>
                    </div>
                    {!isTransparent && (
                      <div className="flex items-center gap-2">
                        <Input
                          id="bgColor"
                          type="color"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="h-10 w-20"
                        />
                        <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="flex-1" />
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="textColor" className="mb-2 block text-sm text-gray-600">
                      Text Color
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="textColor"
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="h-10 w-20"
                      />
                      <Input value={textColor} onChange={(e) => setTextColor(e.target.value)} className="flex-1" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="fontStyle" className="mb-2 block text-sm text-gray-600">
                      Font Style
                    </Label>
                    <Select value={fontStyle} onValueChange={(v) => setFontStyle(v as FontStyle)}>
                      <SelectTrigger id="fontStyle">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sans">Default (Sans Serif)</SelectItem>
                        <SelectItem value="serif">Serif</SelectItem>
                        <SelectItem value="mono">Mono</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="padding" className="mb-2 block text-sm text-gray-600">
                      Padding
                    </Label>
                    <Select value={padding} onValueChange={(v) => setPadding(v as Padding)}>
                      <SelectTrigger id="padding">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Area - Right Column */}
          <div className="space-y-6 md:col-span-2">
            <div>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Live Preview</h2>
              <div className="rounded-lg border border-gray-300 bg-gray-50 p-8">
                <WidgetPreview
                  widgetType={widgetType}
                  timezone={timezone}
                  clockType={clockType}
                  showSeconds={showSeconds}
                  city={city}
                  units={units}
                  forecast={forecast}
                  eventName={eventName}
                  eventDate={eventDate}
                  bgColor={isTransparent ? "transparent" : bgColor}
                  textColor={textColor}
                  fontStyle={fontStyle}
                  padding={padding}
                />
              </div>
            </div>

            {/* Ad Slot 2 */}
            <div className="flex justify-center md:justify-start">
              <div className="flex h-[250px] w-[300px] items-center justify-center bg-gray-100 text-sm text-gray-400">
                Ad Slot 2 (300x250)
              </div>
            </div>
          </div>
        </div>

        {/* URL Generation Section */}
        <div className="mt-12 text-center">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Step 4: Get Your Embed URL</h2>
          <Button onClick={generateUrl} size="lg" className="mb-4 bg-gray-900 px-8 py-6 text-lg hover:bg-gray-800">
            Generate Widget URL
          </Button>

          {generatedUrl && (
            <div className="mx-auto mt-6 max-w-3xl">
              <div className="flex items-center gap-2">
                <Input value={generatedUrl} readOnly className="flex-1 bg-gray-50 font-mono text-sm" />
                <Button onClick={copyToClipboard} variant="outline" className="flex items-center gap-2 bg-transparent">
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy URL
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div id="embed" className="mx-auto mt-16 max-w-3xl">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">How to Embed in Notion (3 Simple Steps)</h2>
          <ol className="space-y-4 text-gray-600">
            <li className="flex gap-3">
              <span className="font-bold text-gray-900">1.</span>
              <span>Customize your perfect widget in the panel above.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-gray-900">2.</span>
              <span>Click 'Generate Widget URL' and copy the link.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-gray-900">3.</span>
              <span>In your Notion page, type /embed and paste the link. You're done!</span>
            </li>
          </ol>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-gray-600">A free tool by Your Studio. Not affiliated with Notion.</p>
          <div className="mt-4 flex justify-center gap-6">
            <a href="#privacy" className="text-sm text-gray-500 hover:text-gray-900">
              Privacy Policy
            </a>
            <a href="#terms" className="text-sm text-gray-500 hover:text-gray-900">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
