import { Text, Title1 } from "@fluentui/react-components";
import { t } from "i18next";
import { useCallback, useEffect, useState } from "react";
import { Trans } from "react-i18next";
import { Link } from "react-router-dom";

import { EtaPredictionXml } from "../../models/etaXml";
import {
  BranchEta,
  EtaContainerParams,
  FavouriteEtaRedux,
} from "../../models/favouriteEta";
import useNavigate from "../../routes/navigate";
import { useAppSelector } from "../../store";
import RawDisplay from "../rawDisplay/RawDisplay";
import { FetchXMLWithCancelToken } from "../utils/fetch";
import { extractEtaDataFromXml } from "../utils/xmlParser";
import { EtaCard } from "./EtaCard";

export default function EtaCardContainer(props: EtaContainerParams) {
  const [rawEta, setRawEta] = useState<EtaPredictionXml>();
  const [processedEtaList, setProcessedEtaList] = useState<BranchEta[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [toggleFetch, setToggleFetch] = useState(false);
  const [etaCards, setEtaCards] = useState<JSX.Element[]>();
  const { navigate } = useNavigate();
  const favouriteEtas: FavouriteEtaRedux = useAppSelector(
    (state) => state.favouriteEtas
  );

  // called every minute to fetch latest data
  useEffect(() => {
    const interval = setInterval(() => {
      setToggleFetch((prevToggleFetch) => !prevToggleFetch);
    }, 60000);

    // Return a function that will clear the interval on unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchEtaData = async () => {
      const { parsedData, error } = await FetchXMLWithCancelToken(
        props.dataUrl,
        {
          signal: controller.signal,
          method: "GET",
        }
      );

      return { parsedData, error };
    };

    if (props.dataUrl.length > 0) {
      fetchEtaData().then(({ parsedData, error }) => {
        if (error || !parsedData) {
          setIsLoaded(true);
          return;
        }

        if (parsedData.body.Error) {
          navigate("/404");
        }

        setRawEta(parsedData);
        setProcessedEtaList(extractEtaDataFromXml(parsedData));
        setIsLoaded(true);
      });
    } else if (props.isLoaded) {
      setIsLoaded(true);
    }

    return () => {
      controller.abort();
    };
  }, [props.dataUrl, props.isLoaded, toggleFetch]);

  useEffect(() => {
    const result = processedEtaList.flatMap((eta) => {
      if (!eta.id) return [];

      if (props.shdFilterNonFavourite) {
        if (!favouriteEtas.ids.includes(eta.id)) return [];

        eta.stopId = favouriteEtas.entities[eta.id].stopId;
      }

      return (
        <li key={eta.id}>
          <EtaCard eta={eta} stopId={props.stopId} />
        </li>
      );
    });

    setEtaCards(result);
  }, [processedEtaList]);

  const Title = useCallback(() => {
    return processedEtaList[0] !== undefined && props.shdShowTitle ? (
      <Link to={`/lines/${processedEtaList[0].routeTag}`}>
        <Title1 className="TitleLink">{processedEtaList[0].stopTitle}</Title1>
      </Link>
    ) : null;
  }, [processedEtaList]);

  const EtaCards = useCallback(() => {
    switch (true) {
      case !isLoaded:
        return null;
      case processedEtaList.length === 0:
        return (
          <section className="itemInfoPlaceholder">
            <Text>
              <Trans>{t("home.etaReminder")}</Trans>
            </Text>
          </section>
        );
      case etaCards === undefined:
      case etaCards && etaCards.length === 0:
        return (
          <section className="itemInfoPlaceholder">
            <Text>{t("home.homeNoEta")}</Text>
          </section>
        );
      case etaCards && etaCards.length > 0:
        return (
          <div>
            <ul className="etaCardList">{etaCards}</ul>
          </div>
        );
      default:
        return null;
    }
  }, [etaCards, isLoaded]);

  return (
    <div className="etaCardContainer">
      <Title />
      <EtaCards />
      <RawDisplay data={rawEta} />
    </div>
  );
}
