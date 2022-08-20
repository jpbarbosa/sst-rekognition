import moment from "moment";
import { Item } from "../../../types/Item";
import { useAppContext } from "../contexts/AppContext";

type ListItemProps = {
  item: Item;
};

export const ListItem: React.FC<ListItemProps> = ({ item }) => {
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
    <tr
      key={item.id}
      className={getItemClassName(item)}
      onClick={() => handleItemClick(item)}
    >
      <td>
        <div className="date">
          {moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss")}
        </div>
        <div className="id">{item.id}</div>
      </td>
      <td>
        <button>{item.error ? "Error" : "Labels"}</button>
      </td>
    </tr>
  );
};
