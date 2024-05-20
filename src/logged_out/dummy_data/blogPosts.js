import React, { Fragment } from "react";
import { Typography } from "@mui/material";

const content = (
  <Fragment>
    <Typography variant="h6" paragraph>
      Research and Development Department of TPL Trakker Ltd
    </Typography>
    <Typography paragraph>
      6.70565x12.42912 ft is the total area of the room.
    </Typography>
    
    
    <Typography variant="h6" paragraph>
      Title
    </Typography>
    
  </Fragment>
);

const posts = [
  {
    title: "Site 1",
    id: 1,
    date: 1576281600,
    src: `${process.env.PUBLIC_URL}/images/logged_out/RD.jpg`,
    snippet:
      "R&D Section of TPL Trakker Ltd.",
    content: content,
  },
  {
    title: "Site 2",
    id: 2,
    date: 1576391600,
    src: `${process.env.PUBLIC_URL}/images/logged_out/blockA.jpeg`,
    snippet:
      "Block A of TPL Trakker Ltd.",
    content: content,
  },
  {
    title: "Site 3",
    id: 3,
    date: 1577391600,
    src: `${process.env.PUBLIC_URL}/images/logged_out/random1.png`,
    snippet:
      "Random Site.",
    content: content,
  },
  
];

export default posts;