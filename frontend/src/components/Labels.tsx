import { Rekognition, AWSError } from "aws-sdk";
import { useAppContext } from "../contexts/AppContext";

export const Labels: React.FC = () => {
  const { selectedItem } = useAppContext();

  const renderError = (error: AWSError) => {
    return <div>{error.message}</div>;
  };

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
      {selectedItem?.error ? (
        renderError(selectedItem?.error)
      ) : (
        <ul className="labels">
          {selectedItem?.labels?.Labels?.map((label) => renderLabel(label))}
        </ul>
      )}
    </div>
  );
};
