import { museumSelector } from "../features/metmuseum.store";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { ART_WORK_INTERVAL } from "../helpers/config";

function ProgressBar() {
  const { timer } = useSelector(museumSelector);

  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress
        variant="determinate"
        value={(timer * 100) / ART_WORK_INTERVAL}
      />
    </Box>
  );
}

export default ProgressBar;
