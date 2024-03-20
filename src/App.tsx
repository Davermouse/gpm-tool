import { useEffect } from "react";
import { HashRouter as Router, Route, NavLink, Routes } from "react-router-dom";

import "./App.css";

import styles from './App.module.css';
import { useGPMToolContext } from "./context/GPMToolContext";
import { EVDataEvents } from "./controls/EVDataEvents";
import { ModuleTextureBrowser } from "./controls/ModuleTextureBrowser";

import { Characters } from "./controls/Characters";
import { Publish } from "./controls/Publish";
import { Files } from "./controls/Files";
import { Home } from "./pages/Home";
import { Maps } from "./controls/Maps";

const EvDataEventsPage = () => 
  <EVDataEvents />;

const MapsPage = () => 
  <Maps />;

const ModuleTexturesPage = () =>
  <ModuleTextureBrowser />;

const CharactersPage = () =>
  <Characters />;

const FilesPage = () =>
  <Files />;

const PublishPage = () =>
  <Publish />;

const HomePage = () => 
  <Home />;

const MenuItem = 
  ({ destination, text }: 
    { destination: string, text: string }
  ) => 
    <li className={styles.menuItem}>
      <NavLink to={destination}>
        {text}
      </NavLink>
    </li>;

const LeftMenu = () => {
  return (
    <ul className="menu">
      <MenuItem
        destination="/"
        text="Home" />
      <MenuItem
        destination="/events"
        text="Events" />
      <MenuItem
        destination="/maps"
        text="Maps" />
      <MenuItem
        destination="/characters"
        text="Characters" />
      <MenuItem
        destination="/module_textures"
        text="Module textures" />
      <MenuItem
        destination="/files"
        text="Files" />
      <MenuItem
        destination="/publish"
        text="Publish" />
    </ul>
  )
}

function App() {
  const { fileStore } = useGPMToolContext();

  useEffect(() => {
    //  fileStore?.loadIso("/data/gpm01.iso");
    // fileStore?.loadIso("/data/gunparademarch.bin");
  });

  return (
    <Router>
      <div className={styles.app}>
        <header>
          <h1>GPM Tool</h1>
        </header>
        <div className={styles.content}>
         <nav>
          <LeftMenu />
         </nav>
        <main>
          <div/>
            <Routes>
              <Route path="/events" element={<EvDataEventsPage />} />
              <Route path="/maps" element={<MapsPage />} />
              <Route path="/module_textures" element={<ModuleTexturesPage />} />
              <Route path="/characters" element={<CharactersPage />} />
              <Route path="/files" element={<FilesPage/>} />
              <Route path="/publish" element={<PublishPage />} />
              <Route path="/" element={<HomePage />} />
            </Routes>
        </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
