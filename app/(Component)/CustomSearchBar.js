import * as React from "react";
import { Searchbar, elevation } from "react-native-paper";

const MyComponent = () => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const onChangeSearch = (query) => setSearchQuery(query);

  return (
    <Searchbar
      placeholder="Search"
      onChangeText={onChangeSearch}
      value={searchQuery}
      elevation={elevation}
      theme={{ colors: { primary: "black" } }}
      style={{
        backgroundColor: "white",
        borderRadius: 10,
        borderColor: "grey",
        borderWidth: 0.5,
      }}
    />
  );
};

export default MyComponent;
