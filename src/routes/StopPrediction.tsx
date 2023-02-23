import { t } from "i18next";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import EtaCardContainer from "../components/etaCard/EtaCardContainer";
import { stopsDataEndpoint } from "../constants/dataEndpoints";

export default function StopPrediction() {
  const params = useParams();
  const stopId = params.stopId ?? "";
  const [dataUrl, setDataUrl] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    document.title = t("stops.browserTitle", { stopId });
    setDataUrl(stopsDataEndpoint.concat(stopId));
    setIsLoaded(true);
  });

  return (
    <main className="stopPredictionPage">
      <EtaCardContainer
        dataUrl={dataUrl}
        shdShowTitle
        stopId={stopId}
        isLoaded={isLoaded}
      />
    </main>
  );
}
