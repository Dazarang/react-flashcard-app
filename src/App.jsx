import React, { useEffect, useState, useRef } from "react";
import FlashcardList from "./FlashcardList";
import "./App.css";
import axios from "axios";

export default function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [categories, setCategories] = useState([]);

  const categoryEl = useRef();

  const cardIdEl = useRef();
  const [cardId, setCardId] = useState(1);
  const [showCardId, setShowCardId] = useState(cardId);

  useEffect(() => {
    axios.get("http://localhost:8000/data").then((res) => {
      setCategories(res.data);
    });
  }, []);

  function handleClickAdd() {
    setCardId((prevCardId) => prevCardId + 1);
  }
  function handleClickSub() {
    setCardId((prevCardId) => prevCardId - 1);
  }

  function handleKeyPress(e) {
    if (e.keyCode == 39 || e.keyCode == 68) {
      handleClickAdd();
      handleSubmit(e);
    } else if (e.keyCode == 37 || e.keyCode == 65) {
      handleClickSub();
      handleSubmit(e);
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    // return cleanup funtion to remove the handler after use
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  });

  useEffect(() => {
    cardIdEl.current.value = cardId;
  }, [cardId]);

  function handleSubmit(e) {
    e.preventDefault();
    setShowCardId((prevShowCardId) => cardId);
    axios
      .get("http://localhost:8000/cards", {
        params: {
          id: cardIdEl.current.value,
          // id: cardId,
          category: categoryEl.current.value,
        },
      })
      .then((res) => {
        setFlashcards(
          res.data.map((questionItem, index) => {
            return {
              id: `${index}-${Date.now()}`,
              eng: questionItem.eng,
              spa: questionItem.spa,
              ex: questionItem.ex,
            };
          })
        );
      });
  }

  function handleChange() {
    setCardId((prevCardId) => (prevCardId = cardIdEl.current.valueAsNumber));
  }

  function handleCatChange(e) {
    cardIdEl.current.value = 1;
    setCardId((prevCardId) => (prevCardId = cardIdEl.current.valueAsNumber));
    handleSubmit(e);
  }
  // console.log(flashcards);
  return (
    <>
      <form className="header" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" ref={categoryEl} onChange={handleCatChange}>
            {categories.map((category) => {
              return (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="cardId">Card #</label>
          <input
            type="number"
            id="cardId"
            min="1"
            step="1"
            defaultValue={1}
            onChange={handleChange}
            ref={cardIdEl}
          />
        </div>
        <div className="form-group-btn">
          <button type="btn" className="btn btn-back" onClick={handleClickSub}>
            ??? Previous
          </button>
          <button className="btn">Get card</button>
          <button type="btn" className="btn btn-next" onClick={handleClickAdd}>
            Next ???
          </button>
        </div>
      </form>
      <div className="container">
        <span className="show-id">Current card: {showCardId}</span>

        <span className="conj-span">
          <img
            src="./conjugations.png"
            alt="conjugations"
            className="conj-img"
          />
        </span>
        <FlashcardList flashcards={flashcards} />
      </div>
      <div className="footer">
        <p>?? Made by Dena Azarang</p>
      </div>
    </>
  );
}
