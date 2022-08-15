import React, { createContext, useContext, useState } from "react";
import { Item } from "../../../types/Item";

type AppContextInterface = {
  uploadId?: string;
  setUploadId: Function;
  selectedItem?: Item;
  setSelectedItem: Function;
};

const AppContext = createContext<AppContextInterface>({
  setUploadId: () => {},
  setSelectedItem: () => {},
});

type AppContextProviderProps = {
  children: React.ReactNode;
};

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}) => {
  const [uploadId, setUploadId] = useState();
  const [selectedItem, setSelectedItem] = useState<Item>();

  return (
    <AppContext.Provider
      value={{ uploadId, setUploadId, selectedItem, setSelectedItem }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
