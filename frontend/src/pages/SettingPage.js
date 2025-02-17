import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button } from "reactstrap";

function SettingPage() {
  const navigate = useNavigate();
  const [apikey, setApiKey] = useState(null);

  const getApiKey = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/users/apiKey`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      setApiKey((old) => data.apiKey);
    }
  };

  const isAuth = () => {
    const accessToken = localStorage.getItem("accessToken");
    return accessToken != null || accessToken?.length > 0;
  };

  const signOut = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  useEffect(() => {
    if (isAuth) getApiKey();
  }, []);

  return (
    <>
      {isAuth() && (
        <div style={{ marginBottom: "50px" }}>
          <Alert color="primary">
            <p>
              {" "}
              Link to add on OBS:{" "}
              {`${window.location.origin}/overlay?token=${localStorage.getItem(
                "accessToken"
              )}`}
            </p>
            <p>
              {" "}
              Webhook link to add money:{" "}
              {`${process.env.REACT_APP_API_URL}/webhooks/add-money`}
              <pre>
                Http verb: POST <br />
                Headers: api-key: {apikey}
                <br />
                Request Body: &nbsp;
                <code>{`{ value: 100 }`}</code>
              </pre>
            </p>
            <p>
              {" "}
              Webhook link to add health:
              {`${process.env.REACT_APP_API_URL}/webhooks/add-health`}
              <pre>
                Http verb: GET <br />
                Headers: api-key: {apikey}
              </pre>
            </p>
          </Alert>
          <div className="ml-1">
            <Button onClick={() => navigate("/overlay")}>Access overlay</Button>
            &nbsp;
            <Button onClick={() => signOut()}>Sign out</Button>
          </div>
        </div>
      )}
    </>
  );
}

export default SettingPage;
