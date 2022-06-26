import { observer } from "mobx-react";
import { useGPMToolContext } from "../context/GPMToolContext";
import { Upload } from "../controls/Upload"

export const Home = observer(() => {
    const { fileStore } = useGPMToolContext();
    const loaded = fileStore && fileStore.evFile !== null;

    return (
        <>
            <p>Welcome to a very early version of gpm-tool. This tool can currently open a <a href="https://en.wikipedia.org/wiki/Gunparade_March">Gunparade March</a> BIN file, and allows you to:</p>

            <ul>
                <li>View the script for story events in the game</li>
                <li>Browse raw textures</li>
                <li>Make changes to the text in story events</li>
                <li>Save out a BIN file containing a version of the game with your text changes</li>
            </ul>

            <p>This tool is capable of saving text for events with escape codes such that text with (currently only capitalised) Latin characters will render correctly in the game.</p>

            <p>This tool can decompress the images used in the game, but in many cases the dimensions of these aren't saved with the image, and for images other than event images, we can't easily determine the correct palette to use. If an image looks wrong, try adjusting the size control next to up or down an option to find the correct size.</p>

            <p>Although you are required to use your browser's upload UI to open the .BIN file, no data from this tool will ever leave your machine, and no data from the game is included with this tool.</p>

            <p>Full source for this tool is available at <a href="https://github.com/Davermouse/gpm-tool">https://github.com/Davermouse/gpm-tool</a>.</p>

            <p>If you have an comments of feedback please make an issue on Github, or send me a message at <a href="https://twitter.com/davidmilesuk">@davidmilesuk</a> or <a href="mailto:me@davidmiles.dev">me@davidmiles.dev</a>.</p>

            <p>To get started, please use the control below to load a valid .BIN file for the game. This should be a approximately ~440MB </p>

            { !loaded && <Upload /> }
            { loaded && <p>Game successfully loaded. Use to tabs on the left to navigate to a more interesting page.</p> }
        </>
    )
});
