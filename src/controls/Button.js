import './controlsStyle.css';
import logo from '../logo.svg';

export default function Button({ mode, text, onClick }) {
    if (mode === "text") {
        return <button id='button-text' onClick={onClick}> { text } </button>
    } else if (mode === "connect") {
        return <button id="button-connect"> { text } </button>
    } else if (mode === "socials") {
        return <button id="button-socials"> <img src={ logo } alt={ text } /> </button>
    } else if (mode === "image") {
        return <button id="button-image"> <img src={ logo } alt={ text } /> </button>
    } else if (mode === "output") {
        return <label id="button-output"> { text } </label>
    }
}
