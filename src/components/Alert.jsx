import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AlertMessage = (props) => {
  if (props.message && props.message.length > 0) {
    toast(
      props.href ? (
        <>
          Shared Link:
          <a href={props.href} target="_blank" rel="noopener noreferrer">
            {props.href}
          </a>
        </>
      ) : (
        props.message
      ),
      {
        position: "bottom-left",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        type: "dark",
      }
    );
  }
};
