import { useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

const TOTAL_CARDS = 52;
const CARD_WIDTH = 70;
const CARD_HEIGHT = 100;

// Crear un mazo inicial con cartas del 1 al 52
const createDeck = (): number[] => {
  const deck: number[] = [];
  for (let i = 1; i <= TOTAL_CARDS; i++) {
    deck.push(i);
  }
  // Mezclar el mazo
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

export default function Index() {
  const [deck, setDeck] = useState<number[]>(createDeck());
  const [drawnCards, setDrawnCards] = useState<number[]>([]);

  const drawCards = () => {
    if (deck.length === 0) {
      // Si no hay más cartas, reiniciar el mazo
      setDeck(createDeck());
      setDrawnCards([]);
      return;
    }

    // Tomar hasta 3 cartas del mazo
    const cardsToDraw = Math.min(3, deck.length);
    const newDrawnCards = deck.slice(0, cardsToDraw);
    const remainingDeck = deck.slice(cardsToDraw);

    setDrawnCards(newDrawnCards);
    setDeck(remainingDeck);
  };

  const resetDeck = () => {
    setDeck(createDeck());
    setDrawnCards([]);
  };

  return (
    <View style={styles.container}>
      {/* Título */}
      <Text style={styles.title}>Mazo de Cartas</Text>
      <Text style={styles.subtitle}>Cartas restantes: {deck.length}</Text>

      {/* Área de cartas mostradas */}
      <View style={styles.drawnCardsContainer}>
        {drawnCards.length > 0 ? (
          <View style={styles.cardsRow}>
            {drawnCards.map((cardNumber, index) => (
              <View key={`${cardNumber}-${index}`} style={styles.card}>
                <Text style={styles.cardNumber}>{cardNumber}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.instructionText}>
            Toca el mazo para sacar 3 cartas
          </Text>
        )}
      </View>

      {/* Mazo (cara abajo) */}
      <View style={styles.deckContainer}>
        {deck.length > 0 ? (
          <TouchableOpacity onPress={drawCards} style={styles.deckCard}>
            <View style={styles.deckBack}>
              <Text style={styles.deckBackText}>🎴</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a472a",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 20,
  },
  drawnCardsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: "#fff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 2,
    borderColor: "#333",
  },
  cardNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#c41e3a",
  },
  instructionText: {
    fontSize: 18,
    color: "#aaa",
    textAlign: "center",
  },
  deckContainer: {
    marginBottom: 40,
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
  deckBackText: {
    fontSize: 40,
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
