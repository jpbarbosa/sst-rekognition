import { Rekognition } from "aws-sdk";

export type LabelsItemProps = {
  label: Rekognition.Label;
};

export const LabelsItem: React.FC<LabelsItemProps> = ({ label }) => {
  const { Name, Confidence, Instances } = label;

  const confidence = Confidence ? Math.round(Confidence * 10) / 10 : 0;
  const instances = Instances ? Instances.length : 0;

  return (
    <li>
      <div className="bar" style={{ width: `${confidence}%` }}></div>
      <div className="label">
        <span className="name">{Name}</span>
        <span className="info">
          {confidence}%{instances ? ` with ${instances} Instances` : ""}
        </span>
      </div>
    </li>
  );
};
