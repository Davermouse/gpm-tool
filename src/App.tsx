import React, { ReactNode, useEffect } from "react";
import { HashRouter as Router, Route, Link, Routes } from "react-router-dom";

import "./App.css";
import { useGPMToolContext } from "./context/GPMToolContext";
import { GPMFileList } from "./controls/GPMFileList";
import { TexturePreview } from "./controls/TexturePreview";
import { EVDataEvents } from "./controls/EVDataEvents";
import { ModuleTextureBrowser } from "./controls/ModuleTextureBrowser";

import clsx from "clsx";
import { Characters } from "./controls/Characters";
import { Publish } from "./controls/Publish";
import { Upload } from "./controls/Upload";
import { Files } from "./controls/Files";
import { Home } from "./pages/Home";
import { Maps } from "./controls/Maps";

import DashboardIcon from '@mui/icons-material/Dashboard';
import { AppBar, Container, CssBaseline, Divider, Grid, IconButton, List, ListItem, ListItemIcon, ListItemText, Paper, Toolbar, Typography, createTheme, styled } from "@mui/material";
import MuiDrawer from '@mui/material/Drawer';
import { Menu } from "@mui/icons-material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import PublishIcon from '@mui/icons-material/Publish';

/*const drawerWidth = 240;
const useStyles = createTheme({
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
});*/

const drawerWidth: number = 240;

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const Title = ({ children }: { children: ReactNode }) => {
  return (
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {children}
    </Typography>
  );
};

const EvDataEventsPage = () => <Grid container spacing={3}>
  <Grid item xs={12}>
    <Paper>
      <Title>Events</Title>
      <EVDataEvents />
    </Paper>
  </Grid>
</Grid>;

const MapsPage = () => <Grid container spacing={3}>
<Grid item xs={12}>
  <Paper>
    <Title>Maps</Title>
    <Maps />
  </Paper>
</Grid>
</Grid>;

const ModuleTexturesPage = () =>  <Grid item xs={12}>
<Paper>
  <Title>Module texture browser</Title>
  <ModuleTextureBrowser />
</Paper>
</Grid>;

const CharactersPage = () => <Grid item xs={12}>
<Paper>
  <Title>Characters</Title>
  <Characters />
</Paper>
</Grid>;

const FilesPage = () => <Grid item xs={12}>
<Paper>
  <Title>Files</Title>
  <Files />
</Paper>
</Grid>;

const PublishPage = () => <Grid item xs={12}>
<Paper>
  <Title>Publish</Title>
  <Publish />
</Paper>
</Grid>;

const HomePage = () => <Grid item xs={12}>
<Paper>
  <Title>Home</Title>
  <Home />
</Paper>
</Grid>;

function App() {
  //const classes = useStyles();
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
       
        <Drawer
          variant="permanent"
          open={open}
        >
          <div>
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
        <main>
          <div/>
          <Container maxWidth="lg">
            <Routes>
              <Route path="/events" element={<EvDataEventsPage />} />
              <Route path="/maps" element={<MapsPage />} />
              <Route path="/module_textures" element={<ModuleTexturesPage />} />
              <Route path="/characters" element={<CharactersPage />} />
              <Route path="/files" element={<FilesPage/>} />
              <Route path="/publish" element={<PublishPage />} />
              <Route path="/" element={<HomePage />} />
            </Routes>
          </Container>
        </main>
      </div>
    </Router>
  );
}

export default App;
