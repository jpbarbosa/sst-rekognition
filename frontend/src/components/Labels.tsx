import { Rekognition } from "aws-sdk";
import { Item } from "./List";

export type LabelsProps = {
  item?: Item;
};

export const Labels: React.FC<LabelsProps> = ({ item }) => {
  const renderLabel = ({ Name, Confidence, Instances }: Rekognition.Label) => {
    const confidence = Confidence ? Math.round(Confidence) : 0;
    const instances = Instances ? Instances.length : 0;

    return (
      <li key={Name}>
        <div className="bar" style={{ width: `${confidence}%` }}></div>
        <div className="label">
          <span>
            {Name} - {confidence}%
          </span>
          <span>{instances ? ` - ${instances} Instances` : ""}</span>
        </div>
      </li>
    );
  };

  return (
    <div id="labels">
      <h2>Labels</h2>
      <ul className="labels">
        {item?.labels.Labels?.map((label) => renderLabel(label))}
      </ul>
    </div>
  );
};
