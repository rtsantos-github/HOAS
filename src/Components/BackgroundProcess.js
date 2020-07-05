import React from "react";
import { Backdrop, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

export default function BackgroundProcess(props) {
  const useStyle = makeStyles((themes) => ({
    backdrop: {
      zIndex: themes.zIndex.drawer + 1,
      color: "#fff",
    },
  }));

  const PageStyle = useStyle();
  return (
    <div>
      <Backdrop
        open={props.open}
        onClose={() => props.onClose()}
        className={PageStyle.backdrop}
      >
        <CircularProgress color="primary" />
      </Backdrop>
    </div>
  );
}
