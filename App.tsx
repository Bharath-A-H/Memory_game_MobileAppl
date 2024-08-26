/* eslint-disable @typescript-eslint/no-shadow */
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';

// Define a type for the card objects
type Card = {
  id: number;
  value: string;
  revealed: boolean;
  matched: boolean;
};

const App = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [moves, setMoves] = useState(0);
  const [win, setWin] = useState(false);
  const [lose, setLose] = useState(false);
  const [selectedCards, setSelectedCards] = useState<number[]>([]); // Store the index of selected cards
  const [playerName, setPlayerName] = useState('');
  const maxMoves = 15;

  const generateCards = (): Card[] => {
    const cardValues = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F'];
    const shuffledCards = cardValues.sort(() => Math.random() - 0.5);
    return shuffledCards.map((value, index) => ({ id: index, value, revealed: false, matched: false }));
  };

  useEffect(() => {
    resetGame();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetGame = () => {
    setCards(generateCards());
    setMoves(0);
    setWin(false);
    setLose(false);
    setSelectedCards([]);
  };

  const handleCardClick = (index: number) => {
    if (selectedCards.length === 2) {return;} // Prevent more than two selections

    const newCards = [...cards];
    const card = newCards[index];

    if (!card.revealed && !card.matched) {
      card.revealed = true;
      const newSelectedCards = [...selectedCards, index];
      setSelectedCards(newSelectedCards);

      if (newSelectedCards.length === 2) {
        setTimeout(() => checkMatch(newSelectedCards), 1000);
      }

      setCards(newCards);
      setMoves(prevMoves => prevMoves + 1);
    }
  };

  const checkMatch = (selectedCards: number[]) => {
    const [firstIndex, secondIndex] = selectedCards;
    const newCards = [...cards];

    if (newCards[firstIndex].value === newCards[secondIndex].value) {
      newCards[firstIndex].matched = true;
      newCards[secondIndex].matched = true;

      if (newCards.every(card => card.matched)) {
        setWin(true);
        Alert.alert('Congratulations!', `${playerName}, you won!`);
      }
    } else {
      newCards[firstIndex].revealed = false;
      newCards[secondIndex].revealed = false;
    }

    setCards(newCards);
    setSelectedCards([]);

    if (moves >= maxMoves && !newCards.every(card => card.matched)) {
      setLose(true);
      Alert.alert('Game Over', `${playerName}, you lost. Better luck next time!`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Match the Cards</Text>
      {!lose && (
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={playerName}
          onChangeText={setPlayerName}
        />
      )}
      <View style={styles.board}>
        {cards.map((card, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, card.revealed || card.matched ? styles.cardRevealed : null]}
            onPress={() => handleCardClick(index)}
          >
            <Text style={styles.cardText}>{card.revealed || card.matched ? card.value : '?'}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.scoreboard}>Moves: {moves}</Text>
      {win || lose ? (
        <TouchableOpacity style={styles.button} onPress={resetGame}>
          <Text style={styles.buttonText}>Play Again</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2980b9',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF',
  },
  input: {
    width: '80%',
    padding: 10,
    borderColor: '#333',
    borderWidth: 2,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    color: '#333',
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5c258d',
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  cardRevealed: {
    backgroundColor: '#1f4037',
  },
  cardText: {
    fontSize: 30,
    color: '#FFFFFF',
  },
  scoreboard: {
    fontSize: 20,
    color: '#FFFFFF',
    marginTop: 20,
  },
  button: {
    padding: 15,
    marginTop: 20,
    backgroundColor: '#61dafb',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
    color: '#cb1720',
  },
});

export default App;
