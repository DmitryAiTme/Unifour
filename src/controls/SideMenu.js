import Button from "./Button";
import "./controlsStyle.css";
import logo from "../logo.svg";

export default function SideMenu() {
  const buttonNames = [
    { text: "telegram", mode: "socials", pic: { logo } },
    { text: "x", mode: "socials", pic: { logo } },
    { text: "discord", mode: "socials", pic: { logo } },
    { text: "github", mode: "socials", pic: { logo } },
  ];
  const buttons = buttonNames.map((props, index) => (
    <Button key={index} {...props} />
  ));
  return <menu id="menu-side"> {buttons} </menu>;
}
