import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CARD_WIDTH = 70;
const CARD_HEIGHT = 100;

// Tipos de palos
type Suit = "♠" | "♣" | "♥" | "♦";
type Value =
  | "A"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K";

interface Card {
  suit: Suit;
  value: Value;
  id: string;
}

interface Exercise {
  name: string;
  reps: number;
  type: string;
}

const SUITS: Suit[] = ["♠", "♣", "♥", "♦"];
const VALUES: Value[] = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

const isBlackSuit = (suit: Suit): boolean => suit === "♠" || suit === "♣";
const isRedSuit = (suit: Suit): boolean => suit === "♥" || suit === "♦";

// Tipos de abdominales para cartas negras (figuras)
const ABDOMINAL_TYPES = [
  "Bicicleta",
  "Bolita",
  "Bisagra",
  "Tijera",
  "Giros rusos",
  "Elevaciones de cadera",
];

// Tipos de espinales para cartas rojas (figuras)
const ESPINAL_TYPES = ["Comunes", "Alternados", "Nados"];

// Obtener el ejercicio correspondiente a una carta
const getExercise = (card: Card): Exercise => {
  const { suit, value } = card;
  const isBlack = isBlackSuit(suit);
  const numericValue = ["2", "3", "4", "5", "6", "7", "8", "9", "10"].includes(
    value,
  )
    ? parseInt(value)
    : 0;

  if (value === "A") {
    return isBlack
      ? { name: "Burpees", reps: 10, type: "burpees" }
      : { name: "Burpees al revés", reps: 10, type: "burpees_reves" };
  }

  if (["2", "3", "4", "5"].includes(value)) {
    return isBlack
      ? {
          name: "Flexiones con aplauso",
          reps: numericValue,
          type: "flexiones_aplauso",
        }
      : {
          name: "Rodillas al pecho",
          reps: numericValue,
          type: "rodillas_pecho",
        };
  }

  if (["6", "7", "8", "9", "10"].includes(value)) {
    return isBlack
      ? {
          name: "Flexiones comunes",
          reps: numericValue,
          type: "flexiones_comunes",
        }
      : { name: "Sentadillas", reps: numericValue, type: "sentadillas" };
  }

  // Figuras (J, Q, K)
  if (isBlack) {
    // Cada combinación figura + palo tiene un tipo de abdominal fijo
    const abdominalMap: { [key: string]: string } = {
      "J♠": "Bicicleta",
      "J♣": "Bolita",
      "Q♠": "Bisagra",
      "Q♣": "Tijera",
      "K♠": "Giros rusos",
      "K♣": "Elevaciones de cadera",
    };
    const key = `${value}${suit}`;
    const abdominalType = abdominalMap[key];
    return {
      name: `Abdominales (${abdominalType})`,
      reps: 20,
      type: `abdominales_${key}`,
    };
  } else {
    // Cada figura roja tiene un tipo de espinal fijo
    const espinalMap: { [key: string]: string } = {
      J: "Comunes",
      Q: "Alternados",
      K: "Nados",
    };
    const espinalType = espinalMap[value];
    return {
      name: `Espinales (${espinalType})`,
      reps: 20,
      type: `espinales_${value.toLowerCase()}`,
    };
  }
};

// Crear un mazo de 52 cartas
const createDeck = (): Card[] => {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const value of VALUES) {
      deck.push({ suit, value, id: `${value}${suit}` });
    }
  }
  // Mezclar el mazo
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

// Sumar ejercicios iguales
const summarizeExercises = (cards: Card[]): Exercise[] => {
  const exerciseMap: { [key: string]: Exercise } = {};

  for (const card of cards) {
    const exercise = getExercise(card);
    if (exerciseMap[exercise.type]) {
      exerciseMap[exercise.type].reps += exercise.reps;
    } else {
      exerciseMap[exercise.type] = { ...exercise };
    }
  }

  return Object.values(exerciseMap);
};

export default function Index() {
  const [deck, setDeck] = useState<Card[]>(createDeck());
  const [drawnCards, setDrawnCards] = useState<Card[]>([]);
  const [history, setHistory] = useState<Card[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  const drawCards = () => {
    if (deck.length === 0) {
      setDeck(createDeck());
      setDrawnCards([]);
      setHistory([]);
      setHistoryIndex(null);
      return;
    }

    const cardsToDraw = Math.min(3, deck.length);
    const newDrawnCards = deck.slice(0, cardsToDraw);
    const remainingDeck = deck.slice(cardsToDraw);

    if (drawnCards.length > 0) {
      setHistory((prev) => [...prev, drawnCards]);
    }
    
    setDrawnCards(newDrawnCards);
    setDeck(remainingDeck);
    setHistoryIndex(null);
  };

  const resetDeck = () => {
    setDeck(createDeck());
    setDrawnCards([]);
    setHistory([]);
    setHistoryIndex(null);
  };

  const goBack = () => {
    if (history.length === 0) return;
    if (historyIndex === null) {
      setHistoryIndex(history.length - 1);
    } else if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
    }
  };

  const goForward = () => {
    if (historyIndex === null) return;
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
    } else {
      setHistoryIndex(null);
    }
  };

  const currentDisplayCards = historyIndex !== null ? history[historyIndex] : drawnCards;
  const exercises = summarizeExercises(currentDisplayCards);

  return (
    <View style={styles.container}>
      {/* Título */}
      <Text style={styles.title}>💀 El Juego De Las Cartas 💀</Text>
      <Text style={styles.subtitle}>Cartas restantes: {deck.length}</Text>

      {/* Área de cartas mostradas */}
      <View style={styles.drawnCardsContainer}>
        {currentDisplayCards.length > 0 ? (
          <>
            <View style={styles.cardsRow}>
              {currentDisplayCards.map((card, index) => (
                <View
                  key={`${card.id}-${index}`}
                  style={[
                    styles.card,
                    isRedSuit(card.suit) ? styles.cardRed : styles.cardBlack,
                  ]}
                >
                  <Text
                    style={[
                      styles.cardSuitTop,
                      isRedSuit(card.suit) ? styles.textRed : styles.textBlack,
                    ]}
                  >
                    {card.suit}
                  </Text>
                  <Text
                    style={[
                      styles.cardValue,
                      isRedSuit(card.suit) ? styles.textRed : styles.textBlack,
                    ]}
                  >
                    {card.value}
                  </Text>
                  <Text
                    style={[
                      styles.cardSuitBottom,
                      isRedSuit(card.suit) ? styles.textRed : styles.textBlack,
                    ]}
                  >
                    {card.suit}
                  </Text>
                </View>
              ))}
            </View>

            {/* Resumen de ejercicios */}
            <ScrollView style={styles.exerciseContainer}>
              <Text style={styles.exerciseTitle}>📋 Ejercicios:</Text>
              {exercises.map((exercise, index) => (
                <View key={index} style={styles.exerciseItem}>
                  <Text style={styles.exerciseReps}>{exercise.reps}x</Text>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                </View>
              ))}
            </ScrollView>
          </>
        ) : (
          <Text style={styles.instructionText}>
            Toca el mazo para sacar 3 cartas
          </Text>
        )}
      </View>

      {/* Mazo (cara abajo) con Botones de Historial */}
      <View style={styles.deckSectionContainer}>
        <TouchableOpacity 
          onPress={goBack} 
          disabled={history.length === 0 || historyIndex === 0}
          style={[
            styles.historyButtonNav, 
            history.length === 0 ? styles.hiddenButton : ((history.length === 0 || historyIndex === 0) && styles.disabledButton)
          ]}
        >
          <Text style={styles.historyButtonNavText}>⬅️</Text>
        </TouchableOpacity>

        <View style={styles.deckContainer}>
          {deck.length > 0 ? (
            <TouchableOpacity onPress={drawCards} style={styles.deckCard}>
              <View style={styles.deckBack}>
                <Image
                  source={require("../assets/images/Calaveramt.jpg")}
                  style={styles.deckImage}
                />
                <Text style={styles.deckCount}>{deck.length}</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={resetDeck} style={styles.emptyDeck}>
              <Text style={styles.emptyDeckText}>🔄</Text>
              <Text style={styles.resetText}>Reiniciar</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity 
          onPress={goForward} 
          disabled={history.length === 0 || historyIndex === null}
          style={[
            styles.historyButtonNav, 
            history.length === 0 ? styles.hiddenButton : (historyIndex === null && styles.disabledButton)
          ]}
        >
          <Text style={styles.historyButtonNavText}>➡️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a472a",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingTop: 60,
    paddingBottom: 80,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
    textAlign: "center",
    width: "100%",
    flexShrink: 0,
  },
  subtitle: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 20,
  },
  drawnCardsContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    paddingTop: 10,
  },
  cardsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: "#fff",
    borderRadius: 8,
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 2,
    paddingVertical: 5,
  },
  cardBlack: {
    borderColor: "#333",
  },
  cardRed: {
    borderColor: "#c41e3a",
  },
  cardSuitTop: {
    fontSize: 14,
    fontWeight: "bold",
  },
  cardValue: {
    fontSize: 28,
    fontWeight: "bold",
  },
  cardSuitBottom: {
    fontSize: 14,
    fontWeight: "bold",
  },
  textBlack: {
    color: "#000",
  },
  textRed: {
    color: "#c41e3a",
  },
  exerciseContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginTop: 15,
  },
  exerciseTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffd700",
    marginBottom: 15,
    textAlign: "center",
  },
  exerciseItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  exerciseReps: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ff6b35",
    marginRight: 10,
    minWidth: 55,
  },
  exerciseName: {
    fontSize: 17,
    color: "#fff",
    flex: 1,
  },
  instructionText: {
    fontSize: 18,
    color: "#aaa",
    textAlign: "center",
  },
  deckSectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 40,
    marginTop: 20,
  },
  historyButtonNav: {
    padding: 15,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
  },
  historyButtonNavText: {
    fontSize: 24,
  },
  disabledButton: {
    opacity: 0.3,
  },
  hiddenButton: {
    opacity: 0,
  },
  deckContainer: {
    alignItems: "center",
  },
  deckCard: {
    width: CARD_WIDTH + 10,
    height: CARD_HEIGHT + 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  deckBack: {
    width: "100%",
    height: "100%",
    backgroundColor: "#8b0000",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#ffd700",
  },
  deckImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  deckCount: {
    fontSize: 14,
    color: "#ffd700",
    fontWeight: "bold",
    marginTop: 5,
  },
  emptyDeck: {
    width: CARD_WIDTH + 10,
    height: CARD_HEIGHT + 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#666",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  emptyDeckText: {
    fontSize: 30,
  },
  resetText: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 5,
  },
});
