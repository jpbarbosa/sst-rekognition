/// <reference types="vite-plugin-svgr/client" />

import { ReactComponent as Rekognition } from "../assets/rekognition.svg";

export const Header: React.FC = () => {
  return (
    <header>
      <div className="title">
        <Rekognition />
        <div>
          <h1>SST Rekognition</h1>
          <p className="subtitle">
            An event-driven app to label images on top of AWS
          </p>
        </div>
      </div>
      <div>
        <a
          href="https://github.com/jpbarbosa/sst-rekognition"
          target="_blank"
          className="button"
        >
          GitHub
        </a>
      </div>
    </header>
  );
};
