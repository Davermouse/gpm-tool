import React, { useEffect, useState } from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";

import "./App.css";
import { useGPMToolContext } from "./context/GPMToolContext";
import { GPMFileList } from "./controls/GPMFileList";
import { TexturePreview } from "./controls/TexturePreview";
import { EVDataEvents } from "./controls/EVDataEvents";
import { ModuleTextureBrowser } from "./controls/ModuleTextureBrowser";
import CssBaseline from "@material-ui/core/CssBaseline";

import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import DashboardIcon from "@material-ui/icons/Dashboard";
import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { Characters } from "./controls/Characters";
import { Publish as PublishIcon } from "@material-ui/icons";
import { Publish } from "./controls/Publish";
import { Upload } from "./controls/Upload";
import { Files } from "./controls/Files";
import { Home } from "./pages/Home";
import { Maps } from "./controls/Maps";

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
}));

const Title: React.FC<{}> = ({ children }) => {
  return (
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {children}
    </Typography>
  );
};

function App() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const { fileStore } = useGPMToolContext();

  useEffect(() => {
    //  fileStore?.loadIso("/data/gpm01.iso");
    // fileStore?.loadIso("/data/gunparademarch.bin");
  });

  return (
    <Router>
      <div className="App">
        <CssBaseline />
        <AppBar className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              className={clsx(
                classes.menuButton,
                open && classes.menuButtonHidden
              )}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              GPM Tool
            </Typography>
            <IconButton color="inherit"></IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          open={open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
            <Link to="/">
              <ListItem button>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
            </Link>
            <Link to="/events">
              <ListItem button>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Events" />
              </ListItem>
            </Link>
            <Link to="/maps">
              <ListItem button>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Maps" />
              </ListItem>
            </Link>
            <Link to="/characters">
              <ListItem button>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Characters" />
              </ListItem>
            </Link>
            <Link to="/module_textures">
              <ListItem button>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Module textures" />
              </ListItem>
            </Link>
            <Link to="/files">
              <ListItem button>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Files" />
              </ListItem>
            </Link>
            <Link to="/publish">
              <ListItem button>
                <ListItemIcon>
                  <PublishIcon />
                </ListItemIcon>
                <ListItemText primary="Publish" />
              </ListItem>
            </Link>
          </List>
          <Divider />
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Switch>
              <Route path="/events">
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Paper className={classes.paper}>
                      <Title>Events</Title>
                      <EVDataEvents />
                    </Paper>
                  </Grid>
                </Grid>
              </Route>
              <Route path="/maps">
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Paper className={classes.paper}>
                      <Title>Maps</Title>
                      <Maps />
                    </Paper>
                  </Grid>
                </Grid>
              </Route>
              <Route path="/module_textures">
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <Title>Module texture browser</Title>
                    <ModuleTextureBrowser />
                  </Paper>
                </Grid>
              </Route>
              <Route path="/characters">
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <Title>Characters</Title>
                    <Characters />
                  </Paper>
                </Grid>
              </Route>
              <Route path="/files">
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <Title>Files</Title>
                    <Files />
                  </Paper>
                </Grid>
              </Route>
              <Route path="/publish">
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <Title>Publish</Title>
                    <Publish />
                  </Paper>
                </Grid>
              </Route>
              <Route path="/">
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <Title>Home</Title>
                    <Home />
                  </Paper>
                </Grid>
              </Route>
            </Switch>
          </Container>
        </main>
      </div>
    </Router>
  );
}

export default App;
