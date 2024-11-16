import { marker } from "leaflet";
import { createContext, useState } from "react";

export const MainContext = createContext();

export const MainContextProvider = (props) => {
  const [markerPosition, setMarkerPosition] = useState([]);
  const [markerState, setMarkerState] = useState("normal");

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const [busStops, setBusStops] = useState([]);
  const [majorCheckPoints, setMajorCheckPoints] = useState([]);

  const [polyLine, setPolyLine] = useState([]);

  const [closeSource, setCloseSource] = useState();
  const [closeDest, setCloseDest] = useState();
  const [starPoint, setStarPoint] = useState();

  const sendDataToServer = async (data) => {
    try {
      const response = await fetch("http://localhost:3000/addroute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ markerPosition, polyLines: polyLine }),
      });

      if (!response.ok) {
        throw new Error("Failed to send data to the server");
      }
      console.log("Data sent successfully:", data);
    } catch (error) {
      console.error("Error sending data to the server:", error);
    }
  };

  const getDataFromServer = async (lat1, lon1, lat2, lon2) => {
    const makeRouteRequest = async (sLat, sLon, dLat, dLon) => {
      const params = new URLSearchParams({
        s_lat: sLat,
        s_lon: sLon,
        d_lat: dLat,
        d_lon: dLon,
      });

      const response = await fetch(
        `http://localhost:3000/route?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    };

    const checkBusStop = (data, targetLat, targetLon) => {
      const COORDINATE_THRESHOLD = 0.001;
      // const round_lat = Math.round(targetLat * 1000) / 1000;
      // const round_lon = Math.round(targetLon * 1000) / 1000;
      console.log("df:", data);

      return data.find(
        // Changed from some to find to get the matching point
        (point) =>
          (point.type === "busStop" || point.type === "majorCheckPoint") &&
          Math.abs(point.lt - targetLat) <= COORDINATE_THRESHOLD &&
          Math.abs(point.ln - targetLon) <= COORDINATE_THRESHOLD
      );
    };

    try {
      // Initial route request
      const {
        result: initialData,
        closestDestStop: sourceDestination,
        closestSourceStop: closestSource,
      } = await makeRouteRequest(lat1, lon1, lat2, lon2);
      console.log("Initial data received:", initialData);
      console.log("Initial src received:", sourceDestination);

      // setCloseSource([])
      console.log("adas: ", closestSource);
      setCloseDest([
        [lat2, lon2],
        [sourceDestination.stop.lt, sourceDestination.stop.ln],
      ]);
      setCloseSource([
        [lat1, lon1],
        [closestSource.stop.lt, closestSource.stop.ln],
      ]);
      // setCloseDest([lat2,lon2],[closeSource.stop.lt, closeSource.stop.ln])
      // console.log("asdasd: ", [lat2,lon2],[closeSource.stop.lt, closeSource.stop.ln])

      console.log("ele: ", initialData);

      const directBusStop = checkBusStop(
        initialData.markerPosition,
        sourceDestination.stop.lt,
        sourceDestination.stop.ln
      );

      console.log("cd ", directBusStop);
      if (directBusStop) {
        console.log("Bus stop found with the given coordinates.");

        setPolyLine(initialData.polyLines); // Using polyLines from the matching point

        return;
      }

      const majorPoints = initialData.markerPosition.filter(
        (point) => point.type === "majorCheckPoint"
      );
      console.log("st: ", majorPoints);
      if (majorCheckPoints.length >= 3) {
        const { result: secndaryData3 } = await makeRouteRequest(
          majorPoints[2].ln,
          majorPoints[2].lt,
          sourceDestination.stop.lt,
          sourceDestination.stop.ln
        );

        const directBusStop3 = checkBusStop(
          secndaryData3.markerPosition,
          sourceDestination.stop.lt,
          sourceDestination.stop.ln
        );

        if (directBusStop3) {
          console.log("Bus stop found with the given coordinates.");

          const indexx = initialData.markerPosition.findIndex(
            (item) => item.namee === majorPoints[2].namee
          );

          setStarPoint([majorPoints[2].lt, majorPoints[2].ln]);

          setPolyLine([
            initialData.polyLines.slice(0, indexx + 1),
            secndaryData3.polyLines,
          ]); // Using polyLines from the matching point
          return;
        }
      }

      const { result: secndaryData1 } = await makeRouteRequest(
        majorPoints[0].ln,
        majorPoints[0].lt,
        sourceDestination.stop.lt,
        sourceDestination.stop.ln
      );

      const directBusStop1 = checkBusStop(
        secndaryData1.markerPosition,
        sourceDestination.stop.lt,
        sourceDestination.stop.ln
      );

      if (directBusStop1) {
        console.log("Bus stop found with the given coordinates.");

        const indexx = initialData.markerPosition.findIndex(
          (item) => item.namee === majorPoints[0].namee
        );
        setStarPoint([majorPoints[0].lt, majorPoints[0].ln]);
        setPolyLine([
          initialData.polyLines.slice(0, indexx + 1),
          secndaryData1.polyLines,
        ]); // Using polyLines from the matching point
        return;
      }

      const { result: secndaryData2 } = await makeRouteRequest(
        majorPoints[1].ln,
        majorPoints[1].lt,
        sourceDestination.stop.lt,
        sourceDestination.stop.ln
      );

      const directBusStop2 = checkBusStop(
        secndaryData2.markerPosition,
        sourceDestination.stop.lt,
        sourceDestination.stop.ln
      );

      if (directBusStop2) {
        console.log("Bus stop found with the given coordinates.");

        const indexx = initialData.markerPosition.findIndex(
          (item) => item.namee === majorPoints[1].namee
        );

        setStarPoint([majorPoints[1].lt, majorPoints[1].ln]);

        setPolyLine([
          initialData.polyLines.slice(0, indexx + 1),
          secndaryData2.polyLines,
        ]); // Using polyLines from the matching point
        return;
      }

      console.log("No bus stop found in any route");
    } catch (error) {
      console.error("Error sending data to the server:", error);
    }
  };

  return (
    <MainContext.Provider
      value={{
        markerState,
        setMarkerState,
        source,
        setSource,
        destination,
        setDestination,
        getDataFromServer,
        closeSource,
        setCloseSource,
        closeDest,
        setCloseDest,
        starPoint,
        setStarPoint,
        polyLine,
        setPolyLine,
        markerPosition,
        setMarkerPosition,
        setMajorCheckPoints,
        sendDataToServer,
      }}
    >
      {props.children}
    </MainContext.Provider>
  );
};
