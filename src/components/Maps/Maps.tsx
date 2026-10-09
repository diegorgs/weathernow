
export default function WindyMap() {
  return (
    <section className="w-full">
      <h2 className="mb-4 text-2xl font-semibold text-slate-800">
        Mapa meteorológico
      </h2>

      <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
        <iframe
          title="Mapa meteorológico Windy"
          src="https://embed.windy.com/embed2.html?lat=-23.55&lon=-46.63&detailLat=-23.55&detailLon=-46.63&width=650&height=450&zoom=6&level=surface&overlay=rain&product=ecmwf&menu=&message=true&marker=true&calendar=now&pressure=true&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1"
          className="h-[450px] w-full"
          loading="lazy"
          allowFullScreen
        />
      </div>

      <p className="mt-2 text-sm text-slate-500">
        Visualização meteorológica fornecida pelo Windy.
      </p>
    </section>
  );
}