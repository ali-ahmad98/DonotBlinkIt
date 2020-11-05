import React, { useEffect, useState } from "react";
import { MDBAnimation } from "mdbreact";

export const CookieAndPrivacy = () => {
  let [cookies, setCookies] = useState(true);

  useEffect(() => {
    // let cookie = JSON.parse(window.localStorage.getItem("cookie"));

    // if (cookie > 1) {
      setCookies(false);
    // }
  }, []);
  return (
    <>
      {cookies && (
        <MDBAnimation type="slideOut" duration="1s" delay="2s">
          <div className="cookie">
            <p>
              <span>Cookie & Privacy</span> {window.innerWidth < 600 && <br />}{" "}
              This website uses cookies to ensure you get the best experiance on
              our website.{" "}
              <i onClick={() => setCookies(false)} className="fa fa-close"></i>
            </p>
          </div>
        </MDBAnimation>
      )}
    </>
  );
};
