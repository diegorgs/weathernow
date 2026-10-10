import { useContext, useEffect, useState } from "react";
import { CityContext } from "../../context/CityContext";

type Coordinates = {
  lat: number;
  lon: number;
};

const DEFAULT_POSITION: Coordinates = {
  lat: -23.55,
  lon: -46.63,
};

export default function WindyMap() {
  const context = useContext(CityContext);
  const city = context?.city ?? null;
  const position = city
    ? { lat: city.latitude, lon: city.longitude }
    : DEFAULT_POSITION;
  const [status, setStatus] = useState("Obtendo localização...");

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocalização não suportada no navegador.");
      return;
    }

    setStatus("Solicitando sua localização...");

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        context?.setCity({
          name: "Minha localização",
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        setStatus("Exibindo sua localização atual");
      },
      () => {
        context?.setCity({
          name: "São Paulo",
          latitude: DEFAULT_POSITION.lat,
          longitude: DEFAULT_POSITION.lon,
        });
        setStatus("Permissão de localização bloqueada. Exibindo São Paulo.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  useEffect(() => {
    if (city) {
      setStatus(`Exibindo ${city.name}`);
      return;
    }

    requestLocation();
  }, [city]);

  const mapUrl = new URL("https://embed.windy.com/embed2.html");
  mapUrl.searchParams.set("lat", position.lat.toString());
  mapUrl.searchParams.set("lon", position.lon.toString());
  mapUrl.searchParams.set("detailLat", position.lat.toString());
  mapUrl.searchParams.set("detailLon", position.lon.toString());
  mapUrl.searchParams.set("zoom", "8");
  mapUrl.searchParams.set("level", "surface");
  mapUrl.searchParams.set("overlay", "rain");
  mapUrl.searchParams.set("product", "ecmwf");
  mapUrl.searchParams.set("menu", "");
  mapUrl.searchParams.set("message", "true");
  mapUrl.searchParams.set("marker", "true");
  mapUrl.searchParams.set("calendar", "now");
  mapUrl.searchParams.set("pressure", "true");
  mapUrl.searchParams.set("type", "map");
  mapUrl.searchParams.set("location", "coordinates");
  mapUrl.searchParams.set("metricWind", "default");
  mapUrl.searchParams.set("metricTemp", "default");

  return (
    <section className="w-full">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">
            Mapa meteorológico
          </h2>
          <p className="text-sm text-slate-500">{status}</p>
        </div>

        <button
          type="button"
          onClick={requestLocation}
          className="rounded-lg bg-sky-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
        >
          Usar minha localização
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <iframe
          key={`${position.lat}-${position.lon}`}
          title="Mapa meteorológico Windy"
          src={mapUrl.toString()}
          className="h-112.5 w-full"
          loading="lazy"
          allow="geolocation"
          allowFullScreen
        />
      </div>
    </section>
  );
}
