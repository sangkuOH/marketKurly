import React, { useState, useRef, useEffect } from "react";
import { FlatList, Text } from "react-native";
import * as Animatable from "react-native-animatable";
import styled from "styled-components";
import { search } from "../../config";
import mixIn from "../../Styles/Mixin";

export default function Search({ navigation }) {
  const [searchVal, setSearchVal] = useState("");
  const [data, setData] = useState();
  const searchRef = useRef();

  const searchData = async (text) => {
    try {
      setSearchVal(text);
      const res = await fetch(`${search}`, {
        method: "POST",
        body: JSON.stringify({
          keyword: text,
        }),
      });
      const resJson = await res.json();
      const newResJson = resJson.products;
      setData(newResJson);
    } catch (e) {
      console.log("페치에 실패했습니다.");
    }
  };

  const renderItem = ({ item }) => {
    return (
      <ResultList
        onPress={() =>
          navigation.navigate("ProductDetail", {
            productId: item.id,
          })
        }
      >
        <ResultItem>{item.name}</ResultItem>
      </ResultList>
    );
  };

  const clearInput = () => {
    searchRef.current.ref.clear();
    setSearchVal("");
    setData("");
  };

  return (
    <Container>
      <SearchBarWrap>
        <SearchIcon
          source={{
            uri: "https://webstockreview.net/images/search-icon-png-4.png",
          }}
          touch={searchVal}
        />
        <SearchBar
          ref={searchRef}
          placeholder="     검색어를 입력해 주세요"
          onChangeText={(text) => searchData(text)}
          touch={searchVal}
          animation={searchVal.length > 0 ? typed : false}
        />
        <Cancel
          touch={searchVal}
          animation={searchVal.length > 0 ? btnIn : false}
          onPress={() => clearInput()}
        >
          <Text>취소</Text>
        </Cancel>
      </SearchBarWrap>
      <ResultContainer>
        <ResultLabel>상품 바로가기</ResultLabel>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, idx) => idx.toString()}
        />
      </ResultContainer>
    </Container>
  );
}

const Container = styled.View``;

const SearchBarWrap = styled.View`
  position: relative;
  ${mixIn.flex("row", "flex-start", "center")};
  width: 100%;
`;

const Cancel = Animatable.createAnimatableComponent(styled.TouchableOpacity`
  display: ${({ touch }) => (touch.length > 0 ? "flex" : "none")};
  padding-left: 10px;
`);

const SearchIcon = styled.Image`
  position: absolute;
  left: 19;
  width: 20px;
  height: 20px;
  z-index: ${({ touch }) => (touch.length > 0 ? -1 : 1)};
`;

const SearchBar = Animatable.createAnimatableComponent(styled.TextInput`
  width: ${({ touch }) => (touch.length > 0 ? "80%" : "95%")};
  height: 50px;
  margin: 10px;
  padding-left: 10px;
  border-radius: 10;
  background-color: ${({ theme }) => theme.color.White};
`);

const ResultContainer = styled.View`
  height: 100%;
  background-color: ${({ theme }) => theme.color.White};
`;

const ResultLabel = styled.Text`
  height: 50px;
  padding-left: 10px;
  line-height: 60px;
  font-size: 12px;
  color: ${({ theme }) => theme.color.SubtitlePaleGrey};
`;

const ResultList = styled.TouchableOpacity`
  height: 60px;
  padding-left: 10px;
  border: 0.3px solid #ddd;
  background-color: ${({ theme }) => theme.color.White};
`;

const ResultItem = styled.Text`
  line-height: 60px;
`;

const typed = {
  0: {
    width: "95%",
  },
  1: {
    width: "80%",
  },
};

const btnIn = {
  0: {
    animation: false,
  },
  1: {
    animation: "slideInRight",
  },
};
