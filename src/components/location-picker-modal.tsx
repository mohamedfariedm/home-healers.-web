"use client"

import { useState, useEffect, useRef } from "react"

interface LocationPickerModalProps {
  isOpen: boolean
  onClose: () => void
}

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

export default function LocationPickerModal({ isOpen, onClose }: LocationPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState({
    title: "الرياض - السعودية",
    address: "السعودية - الرياض - شارع الامير محمد بن سلمان",
  })
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const markerInstance = useRef<any>(null)

  useEffect(() => {
    if (isOpen && !window.google) {
      loadGoogleMapsScript()
    } else if (isOpen && window.google && mapRef.current) {
      initializeMap()
    }
  }, [isOpen])

  const loadGoogleMapsScript = () => {
    if (window.google) return

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&language=ar`
    script.async = true
    script.defer = true
    script.onload = () => {
      if (mapRef.current) {
        initializeMap()
      }
    }
    document.head.appendChild(script)
  }

  const initializeMap = () => {
    if (!window.google || !mapRef.current) return

    // Riyadh coordinates
    const riyadhCoords = { lat: 24.7136, lng: 46.6753 }

    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: riyadhCoords,
      zoom: 12,
      styles: [
        {
          featureType: "all",
          elementType: "geometry.fill",
          stylers: [{ color: "#f5f5f5" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#e9e9e9" }, { lightness: 17 }],
        },
      ],
    })

    markerInstance.current = new window.google.maps.Marker({
      position: riyadhCoords,
      map: mapInstance.current,
      draggable: true,
      title: "الموقع المحدد",
    })

    // Add click listener to map
    mapInstance.current.addListener("click", (event: any) => {
      const lat = event.latLng.lat()
      const lng = event.latLng.lng()

      markerInstance.current.setPosition({ lat, lng })

      // Reverse geocoding to get address
      const geocoder = new window.google.maps.Geocoder()
      geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
        if (status === "OK" && results[0]) {
          setSelectedLocation({
            title: "الموقع المحدد",
            address: results[0].formatted_address,
          })
        }
      })
    })
  }

  const handleSearch = () => {
    if (!window.google || !searchQuery.trim()) return

    const service = new window.google.maps.places.PlacesService(mapInstance.current)
    const request = {
      query: searchQuery,
      fields: ["name", "geometry", "formatted_address"],
    }

    service.textSearch(request, (results: any, status: any) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results[0]) {
        const place = results[0]
        const location = place.geometry.location

        mapInstance.current.setCenter(location)
        markerInstance.current.setPosition(location)

        setSelectedLocation({
          title: place.name || "الموقع المحدد",
          address: place.formatted_address || "",
        })
      }
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto" dir="rtl">
      <div className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-hidden">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-5 right-5 z-20">
          <div className="w-6 h-6 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/yKfNKc7ADc.png)] bg-[length:100%_100%] bg-no-repeat" />
        </button>

        <div className="flex flex-col h-[90vh] max-h-[800px]">
          {/* Search Bar */}
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between bg-white rounded-xl border border-[#d0d5dd] p-4 shadow-sm">
              <button onClick={handleSearch} className="w-4 h-4">
                <div className="w-4 h-4 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/y2UFjyDisd.png)] bg-cover bg-no-repeat" />
              </button>
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="او اكتب اسم المنطقة هنا...."
                  className="flex-1 text-right text-sm text-[#736b7a] placeholder-[#736b7a] bg-transparent border-none outline-none"
                />
                <div className="w-4 h-4 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/zLuyYXxCVS.png)] bg-cover bg-no-repeat" />
              </div>
            </div>
          </div>

          {/* Map Container */}
          <div className="flex-1 relative">
            <div ref={mapRef} className="w-full h-full" />

            {/* Loading fallback */}
            {!window.google && (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#62a0f6] mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">جاري تحميل الخريطة...</p>
                </div>
              </div>
            )}
          </div>

          {/* Location Info */}
          <div className="p-6 pt-4">
            <div className="flex flex-col items-end mb-6">
              <div className="flex items-center gap-2 bg-[#eff6fe] rounded-t-xl px-3 py-3 w-36">
                <span className="text-base font-bold text-[#62a0f6]">موقع الزيارة</span>
                <div className="w-4 h-4 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/WA2agUc3Bb.png)] bg-cover bg-no-repeat" />
              </div>
              <div className="flex justify-between items-center w-full bg-[#eff6fe] rounded-xl rounded-tr-none p-4">
                <button className="bg-[#62a0f6] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#5090e6] transition-colors">
                  حفظ الموقع
                </button>
                <div className="flex flex-col gap-4 items-end">
                  <span className="text-base font-semibold text-[#1e1e1e] text-right">{selectedLocation.title}</span>
                  <span className="text-base text-[#1e1e1e] text-right">{selectedLocation.address}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-[#e8eaf3] text-[#143087] py-3 px-4 rounded-xl text-sm font-semibold hover:bg-[#d5d9e8] transition-colors">
                مشاهدة المواقع المحفوظة
              </button>
              <button className="flex-1 bg-[#143087] text-white py-3 px-4 rounded-xl text-sm font-semibold hover:bg-[#0f2470] transition-colors">
                تأكيد الموقع
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
