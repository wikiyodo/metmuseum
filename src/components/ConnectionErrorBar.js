import { museumSelector } from "../features/metmuseum.store";
import { useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import Box from "@mui/material/Box";

const useStyles = makeStyles(() => ({
  connectionAlert: {
    backgroundColor: "rgba(0, 0, 0, 0.87) !important",
    color: "white !important",
    textAlign: "center",
    width: "100%",
    padding: "10px 20px"
  }
}));

function ConnectionErrorBar() {
  const { connectionFailed } = useSelector(museumSelector);
  const classes = useStyles();

  return (
    <>
      {connectionFailed && (
        <Box sx={{ width: "100%" }}>
          <Box className={classes.connectionAlert}>
            Connection Failed, please check internet connection!
          </Box>
        </Box>
      )}
    </>
  );
}

export default ConnectionErrorBar;
