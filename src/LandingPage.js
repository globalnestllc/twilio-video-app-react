import React from "react";
import {Grid, Typography} from "@mui/material";
import {landscape_logo} from "@eventdex/assets/images";

export default function LandingPage() {
    return (
        <Grid
            container
            direction={"column"}
            justifyContent={"space-around"}
            alignItems={"center"}
            style={{maxHeight: "500px", height: "100%"}}
        >
            <img src={landscape_logo} />
            <Typography variant={"h3"}> Eventdex video conferencing </Typography>
            <Typography variant={"body1"}>
                {" "}
                Please use the link provided to join meeting.
            </Typography>
        </Grid>
    );
}
