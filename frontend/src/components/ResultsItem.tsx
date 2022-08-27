/// <reference types="vite-plugin-svgr/client" />

import moment from "moment";
import { Item } from "../../../types/Item";
import { useAppContext } from "../contexts/AppContext";
import { ReactComponent as Arrow } from "../assets/arrow.svg";

type ResultsItemProps = {
  item: Item;
};

export const ResultsItem: React.FC<ResultsItemProps> = ({ item }) => {
  const { selectedItem, setSelectedItem, setUploadId } = useAppContext();

  const getItemClassName = (item: Item) => {
    const classes = [
      selectedItem?.id === item.id ? "selected" : "",
      item.error ? "error" : "success",
    ];
    return classes.join(" ");
  };

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
    setUploadId(undefined);
  };

  return (
    <li
      className={getItemClassName(item)}
      onClick={() => handleItemClick(item)}
    >
      <div>
        <div className="date">
          {moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss")}
        </div>
        <div className="id">{item.id}</div>
      </div>
      <Arrow />
    </li>
  );
};
