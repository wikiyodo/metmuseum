import { museumSelector } from "../features/metmuseum.store";
import { useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const useStyles = makeStyles(() => ({
  cardDetails: {
    position: "absolute",
    bottom: 0,
    width: "100%"
  },
  outlinedCard: {
    backgroundColor: "rgba(0, 0, 0, 0.87) !important",
    color: "white !important"
  }
}));

function ArtDetails() {
  const { objectsDetails, galleryQueueIndexes } = useSelector(museumSelector);
  const classes = useStyles();

  const index = galleryQueueIndexes[0];
  const { title, objectName, objectURL, repository, creditLine, department } =
    objectsDetails[`_${index}`] || {};

  return (
    <Box className={classes.cardDetails}>
      <Card variant="outlined" className={classes.outlinedCard}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} gutterBottom>
            {title}
          </Typography>
          <Typography variant="h5" component="div">
            {objectName}
          </Typography>
          <Typography sx={{ mb: 1.5 }}>{department}</Typography>
          <Typography variant="body2">
            {repository}
            <br />
            {creditLine}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" href={objectURL} target="_blank">
            Learn More
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}

export default ArtDetails;
