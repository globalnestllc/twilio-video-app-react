import {makeStyles} from "tss-react/mui";
import {Dialog, DialogContent} from "@mui/material";
import React, {useState} from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import MuiDialogTitle from "@mui/material/DialogTitle";
import {useTheme} from "@mui/material/styles";
import withStyles from "@mui/styles/withStyles";
import {urlFor_RestApi} from "@eventdex/core/src/context";
import {useWindowMessageCallback} from "./useWindowMessageCallback";
import useMediaQuery from "@mui/material/useMediaQuery";
import {urlFor_PublicApi, usePrevious} from "@eventdex/core/context";
import {useSelector} from "react-redux";
import {getNoAuth} from "@eventdex/core/context";

const useStyles = makeStyles()((theme) => ({
    dialogPaper: {
        height: "80%",
        [theme.breakpoints.down("md")]: {
            height: "100%",
        },
    },

    iframe: {
        width: "100%",
        height: "100%",
        border: "none",
    },
}));
const styles = (theme) => ({
    root: {
        margin: 0,
        padding: 0,
    },
    closeButton: {
        position: "absolute",
        right: 0,
        top: 0,
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const {children, classes, onClose, ...other} = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={onClose}
                    size="large"
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

export default function AfterCallSurveyDialog(props) {
    const {roomName} = props;
    const {classes} = useStyles();

    const [isOpen, setIsOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    const videoRoomState = useSelector((state) => state.ed_video.videoRoomState);
    const eventId = useSelector((state) => state.ed_video.video.sessionData?.event_id || null);
    const surveyUrl = urlFor_PublicApi("/apex/BLN_POSTMMAPP", {eventid: eventId, slug: roomName});
    const surveyQueryUrl = urlFor_PublicApi("/services/apexrest/BLN_ASC_CheckMMSurvey", {
        eventid: eventId,
        slug: roomName,
    });

    const prevVideoRoomState = usePrevious(videoRoomState);
    const callEnded = !!(
        prevVideoRoomState &&
        prevVideoRoomState !== videoRoomState &&
        videoRoomState === "disconnected"
    );

    React.useEffect(() => {
        async function checkSurvey() {
            // let result = await new Promise(resolve=>{
            //   setTimeout(()=>{
            //       resolve({data:{hasSurvey:true}});
            //     },3000)
            // })

            try {
                let response = await getNoAuth({url: surveyQueryUrl});
                let result = JSON.parse(response.data);
                console.log("Disconnected: survey result:", result);
                return result;
            } catch (e) {
                return false;
            }
        }

        if (callEnded) {
            checkSurvey().then((hasSurvey) => {
                setIsOpen(hasSurvey);
            });
        }
    }, [callEnded]);

    function handleCloseDialog() {
        setIsOpen(false);
    }

    function handleIframeMessage(message, data) {
        if (data === "iframe_message" || message === "iframe_message") {
            handleCloseDialog();
        }
    }
    useWindowMessageCallback(handleIframeMessage);

    return (
        <Dialog
            fullScreen={fullScreen}
            fullWidth={true}
            maxWidth={"md"}
            open={isOpen}
            aria-labelledby="survey questions"
            classes={{paper: classes.dialogPaper}}
        >
            <DialogTitle id="max-width-dialog-title" onClose={handleCloseDialog}>
                {/*Please answer the following questions*/}
            </DialogTitle>

            <iframe src={surveyUrl} className={classes.iframe} />
        </Dialog>
    );
}
