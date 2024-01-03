import logo from './logo.svg';
import React from "react";
import './App.css';
import Title from "./components/Title"

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};

console.log("야옹");




const Form = ({ updateMainCat }) => {
  const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);
  const [value, setValue] = React.useState(""); //input 값 
  const [errorMessage, setErrorMessage] = React.useState("");

  function handleInputChange(e) { //로그를 찍기 위함
    //console.log(e.target.value.toUpperCase()); //대문자로 변경
    const userValue = e.target.value;

    setErrorMessage("");
    if (includesHangul(userValue)) {
      setErrorMessage("한글은 입력할 수 없습니다.");
    }
    setValue(userValue.toUpperCase());
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    if (value === "") {
      setErrorMessage("빈 값으로 만들 수 없습니다.");
      return; //updateMainCat() 부르지 않고 끝나도록 
    }
    updateMainCat(value);
  }
  return ( //input 변경시마다 handleInputChange 부른다, 위에서 만든 상태값 value를 input의 value에 할당
    <form onSubmit={handleFormSubmit}>
      <input type="text" name="name" placeholder="영어 대사를 입력해주세요" value={value} onChange={handleInputChange} />
      <button type="submit">생성 </button>
      <p style={{ color: "red" }}>{errorMessage}</p>
    </form>
  );
};



function CatItem(props) {
  return (
    <li>
      <img src={props.img} style={{ width: "150px" }} />
    </li>
  );
}

function Favorites({ favorites }) {
  if (favorites.length === 0) {
    return <div>사진 위 하트를 눌러 고양이 사진을 저장해봐요!</div>;
  }
  return (
    <ul className="favorites">
      {favorites.map(cat => <CatItem img={cat} key={cat} />)}
    </ul>
  );
}

const MainCard = ({ img, onHeartClick, alreadyFavorite }) => { //아래에 handl~도 props로 넘겼으니까 여기서 받아야함
  const heartIcon = alreadyFavorite ? "💖" : "🤍";
  return (
    <div className="main-card">
      <img src={img} alt="고양이" width="400" />
      <button onClick={onHeartClick}>{heartIcon}</button>
    </div>
  );
};

const App = () => {

  const CAT1 = "resources\\DOG1.jpg";
  const CAT2 = "resources\\DOG2.jpg";
  const CAT3 = "resources\\DOG3.jpg";

  //const [counter, setCounter] = React.useState(1); //초기값 1
  //const [counter, setCounter] = React.useState(jsonLocalStorage.getItem('counter')); //로컬스토리지 저장된 카운터 불러옴. 성능 최적화를 위해 아래처럼 변경함
  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem("counter");
  })
  //const counter = counterState[0];
  //const setCounter = counterState[1]; // counter 조작용
  const [mainCat, setMainCat] = React.useState(CAT1);
  //const [favorites, setFavorites] = React.useState(jsonLocalStorage.getItem('favorites') || []); //state 추가. 성능 최적화를 위해 아래처럼 변경
  const [favorites, setFavorites] = React.useState(() => {
    return jsonLocalStorage.getItem('favorites') || []
  })

  const alreadyFavorite = favorites.includes(mainCat);//

  console.log("카운터", counter);

  async function setInitialCat() {
    const newCat = await fetchCat('First cat');
    console.log(newCat)
    setMainCat(newCat);
  }

  React.useEffect(() => {
    setInitialCat();
  }, []);


  async function updateMainCat(value) {
    //event.preventDefault(); //리프레시 막기 위함

    const newCat = await fetchCat(value);
    console.log("폼 전송됨");

    setMainCat(newCat);

    //setCounter(nextCounter);
    setCounter((prev) => { //prev : 기존값 
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem('counter', nextCounter);
      return nextCounter; //생성버튼 연타했을 때 하나씩 올라가는게 보이도록
    })

  }

  function handleHeartClick() {
    const nextFavorites = [...favorites, mainCat];
    console.log("하트 눌렀음");
    setFavorites(nextFavorites) //favorites를 펼쳐서 쓴 다음, CAT3를 추가
    jsonLocalStorage.setItem('favorites', nextFavorites)
  }

  const counterTitle = counter === null ? "" : counter + '번째 ';

  return ( //props로 넘길 땐 on~이라고 한다. 

    <div>
      <Title>{counterTitle}강아지 가라사대</Title>


      <Form updateMainCat={updateMainCat} />
      <MainCard img={mainCat} onHeartClick={handleHeartClick} alreadyFavorite={alreadyFavorite} />
      <Favorites favorites={favorites} />
    </div>
  );
};

export default App;
