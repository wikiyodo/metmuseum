import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  addNewItem,
  getDepartments,
  getObject,
  getObjects,
  increment,
  museumSelector
} from "./features/metmuseum.store";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import ConnectionErrorBar from "./components/ConnectionErrorBar";
import ProgressBar from "./components/ProgressBar";
import ArtDetails from "./components/ArtDetails";
import { ART_WORK_INTERVAL } from "./helpers/config";

const useStyles = makeStyles(() => ({
  app: {
    position: "absolute",
    height: "100%",
    width: "100%",
    overflow: "hidden",
    display: "flex",
    flex: 1,
    justifyContent: "center"
  }
}));
let storeInterval = null;

function App() {
  const dispatch = useDispatch();
  const { objectsDetails, galleryQueueIndexes, timer } =
    useSelector(museumSelector);
  const classes = useStyles();
  const [start, setStart] = useState(false);
  const sliderRef = useRef();
  const startIncrement = () => {
    storeInterval = setInterval(() => dispatch(increment()), 1000);
  };
  const stopIncrement = () => {
    clearInterval(storeInterval);
  };

  useEffect(() => {
    dispatch(getObjects(true));
    dispatch(getDepartments());
  }, []);

  useEffect(() => {
    if (!start) return;

    if (storeInterval) {
      stopIncrement();
    }

    startIncrement();
  }, [start]);

  useEffect(() => {
    if (!start && galleryQueueIndexes.length > 0) setStart(true);
  }, [galleryQueueIndexes]);

  useEffect(() => {
    if (timer == ART_WORK_INTERVAL - 1) handleChange();
  }, [timer, sliderRef]);

  useEffect(() => {
    // for each indexes getObject
    galleryQueueIndexes.map(objectID => {
      if (!objectsDetails[`_${objectID}`]) dispatch(getObject({ objectID }));
    });
  }, [galleryQueueIndexes]);
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(prev => {
      if (storeInterval) {
        stopIncrement();
      }

      if (prev) {
        startIncrement();
      }

      return !prev;
    });
  };

  const handleClickAway = () => {
    setOpen(false);

    if (storeInterval) {
      clearInterval(storeInterval);
    }

    storeInterval = setInterval(() => dispatch(increment()), 1000);
    console.log("wikwiwwkwiwkwiwk");
  };

  const index = galleryQueueIndexes[0];
  const { primaryImage, title } = objectsDetails[`_${index}`] || {};

  const handleChange = useCallback(() => {
    dispatch(addNewItem(index));
  }, [index]);

  return (
    <>
      <ProgressBar />
      <ConnectionErrorBar />
      <ClickAwayListener onClickAway={handleClickAway}>
        <div className={classes.app}>
          <img
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              height: "auto",
              width: "auto"
            }}
            src={primaryImage || "/default.jpg"}
            onClick={handleClick}
            alt={title}
          />

          {open && <ArtDetails />}
        </div>
      </ClickAwayListener>
    </>
  );
}

export default App;
