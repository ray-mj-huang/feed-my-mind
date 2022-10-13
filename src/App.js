/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { collection, setDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import './App.css';
import Card from './Card';
import ReadingMode from './ReadingMode';

function Container({ children }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        background: '#cccccc',
      }}
    >
      {children}
    </div>
  );
}

function App() {
  // 寫入 data 測試
  async function submitData() {
    // e.preventDefault();
    const newUserRef = doc(collection(db, 'collect-test'));
    await setDoc(newUserRef, {
      userId: newUserRef.id,
      userEmail: 'ray.mj.huang@gmail.com',
      userName: 'Ray',
      title: '來點測試！',
      article: 'React Context 應該這樣用，bla bla bla ... 嗚嗚。',
    });
    // eslint-disable-next-line
    console.log(`安安！${newUserRef.id}`);
  }

  const [nextId, setInicialId] = useState(1);

  const [cards, setCards] = useState([]);

  const [isRead, setIsRead] = useState(false);

  const [readingCardId, setReadingCardId] = useState(0);

  useEffect(() => {
    if (cards.length > 0) { setInicialId(cards[0].id + 1); }
  }, [cards]);

  function handleStoreItem() {
    localStorage.setItem('myData', JSON.stringify(cards));
  }

  function handleOnRead(cardId) {
    setIsRead(true);
    setReadingCardId(cardId);
  }

  function handleDelete(cardId) {
    setCards(cards.filter((c) => c.id !== cardId));
  }

  const cardList = cards.map((c) => (
    <Card
      key={c.id}
      card={c}
      onRead={() => {
        handleOnRead(c.id);
      }}
      onDelete={() => handleDelete(c.id)}
    />
  ));

  return (
    <Container>
      {isRead && (
        <ReadingMode
          cardId={readingCardId}
          cards={cards}
          setCards={setCards}
          setIsRead={setIsRead}
        />
      )}

      <button onClick={() => submitData()}>測試</button>

      <h1>Feedy Notes</h1>

      <p>Welcome to Feedy Notes, hope you will enjoy it!</p>
      <div
        style={{ marginBottom: '30px' }}
      />
      <button
        onClick={handleStoreItem}
      >
        儲存到 localStorage
      </button>
      <button
        onClick={() => {
          const newData = JSON.parse(localStorage.getItem('myData'));
          setCards(newData);
        }}
      >
        從 localStorage 載入我的筆記
      </button>

      <hr />

      <p>{nextId}</p>

      <button
        onClick={() => {
          setCards([{
            id: nextId, isEdit: false, title: '標題', content: '內文',
          }, ...cards]);
          setInicialId((id) => id + 1);
        }}
      >
        新增筆記
      </button>

      <div
        style={{
          width: '100%',
          maxWidth: '1400px',
        }}
      >
        <div
          className="cardContainer"
        >
          {cardList}
        </div>
      </div>

    </Container>
  );
}

export default App;
