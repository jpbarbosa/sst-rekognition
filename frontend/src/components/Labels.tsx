import { useAppContext } from "../contexts/AppContext";
import { LabelsItem } from "./LabelsItem";

export const Labels: React.FC = () => {
  const { selectedItem } = useAppContext();

  const renderLabels = () => {
    if (!selectedItem) {
      return (
        <div className="box info">
          Select an item from the results list to see its labels.
        </div>
      );
    }
    if (selectedItem.error) {
      return <div className="box error">{selectedItem.error.message}</div>;
    }
    return (
      <ul className="labels">
        {selectedItem.labels?.Labels?.map((label) => (
          <LabelsItem label={label} />
        ))}
      </ul>
    );
  };

  return (
    <div id="labels">
      <h2>Labels</h2>
      {renderLabels()}
    </div>
  );
};
