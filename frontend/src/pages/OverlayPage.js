import React, { useEffect, useState } from "react";
import Pusher from "pusher-js";
import dayjs from "dayjs";
import ProgressBar from "../components/ProgressBar";

Pusher.logToConsole = true;

var pusher = new Pusher(process.env.REACT_APP_PUSH_APP_KEY, {
  cluster: process.env.REACT_APP_PUSH_CLUSER,
});

function OverlayPage() {
  const [timer, setTimer] = useState(dayjs().format("HH:mm:ss"));
  const [money, setMoney] = useState(0);
  const [healthProgress, setHealthProgress] = useState(0);
  const [providedToken, setProvidedToken] = useState(null);

  const addMoney = (data) => {
    setMoney((old) => old + parseInt(data.value));
  };

  const reduceHealth = () => {
    setHealthProgress(healthProgress - 10);
  };

  const addHealth = () => {
    setHealthProgress((old) => {
      if (old >= 100) {
        return old;
      }
      return old + 10;
    });
  };

  useEffect(() => {
    const hasToken =
      window.location.search.replace("?", "").indexOf("token") > -1;
    setProvidedToken(hasToken);

    if (!hasToken) {
      return;
    }

    const reduceHealthInterval = setInterval(() => {
      reduceHealth();
    }, 10 * 1000);
    const updateTimerInterval = setInterval(() => {
      setTimer(dayjs().format("HH:mm:ss"));
    }, 1 * 1000);

    const channel = pusher.subscribe("my-channel");
    channel.bind("add-money", addMoney);
    channel.bind("add-health", addHealth);

    setHealthProgress(50);

    return () => {
      clearInterval(reduceHealthInterval);
      clearInterval(updateTimerInterval);

      channel.disconnect();
    };
  }, []);

  return (
    <>
      {providedToken && (
        <div className="hud">
          <div className="timer" style={{ color: "white" }}>
            {timer}
          </div>
          <div className="health-bar">
            <ProgressBar healthProgress={healthProgress} />
          </div>
          <div className="money">R${money}</div>
        </div>
      )}
      {!providedToken && <p>You need to provide a token to load the overlay</p>}
    </>
  );
}

export default OverlayPage;
