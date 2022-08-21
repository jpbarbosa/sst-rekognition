/// <reference types="vite-plugin-svgr/client" />

import { ReactComponent as Rekognition } from "../../public/rekognition.svg";

export const Header: React.FC = () => {
  return (
    <header>
      <Rekognition />
      <div>
        <h1>SST Rekognition</h1>
        <p>An event-driven app to label images on top of AWS</p>
      </div>
    </header>
  );
};
