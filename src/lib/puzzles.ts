export interface Puzzle {
  id: string;
  title: string;
  fen: string;
  solution: string; // The correct move in SAN notation (e.g. "Qc8#", "Nc7+")
  hint: string;
  explanation: string;
  type: "mate-in-1" | "fork" | "pin" | "skewer" | "back-rank" | "tactic";
  difficulty: "beginner" | "intermediate";
}

export const assessmentPuzzles: Puzzle[] = [
  {
    id: "assess-1",
    title: "Checkmate in One!",
    fen: "k7/2Q5/1K6/8/8/8/8/8 w - - 0 1",
    solution: "Qc8#",
    hint: "Move your queen to the 8th rank to trap the king.",
    explanation:
      "Brilliant! Qc8# is checkmate! The queen on c8 attacks the black king, and the white king on b6 covers all escape squares (a7 and b7). The black king has nowhere to run — that's checkmate! ♛",
    type: "mate-in-1",
    difficulty: "beginner",
  },
  {
    id: "assess-2",
    title: "Knight Fork!",
    fen: "r3k3/8/8/3N4/8/8/8/4K3 w - - 0 1",
    solution: "Nc7+",
    hint: "Your knight can attack the king AND the rook at the same time!",
    explanation:
      "Excellent! Nc7+ is a fork! Your knight jumps to c7, giving check to the black king on e8 AND attacking the rook on a8. The king must move out of check, and then you capture the rook for free. That's a fork — one piece attacking two enemies at once! ♞",
    type: "fork",
    difficulty: "beginner",
  },
  {
    id: "assess-3",
    title: "Back-Rank Checkmate!",
    fen: "6k1/5ppp/6N1/8/8/8/8/4R2K w - - 0 1",
    solution: "Re8#",
    hint: "Slide your rook to the 8th rank. The knight helps!",
    explanation:
      "Perfect! Re8# is checkmate! Your rook slides to e8, attacking the black king on g8. The black king can't escape to f8 or h8 because your knight on g6 covers both squares. The pawns on f7, g7, h7 block the king from going forward. This is called a back-rank mate! ♜",
    type: "back-rank",
    difficulty: "beginner",
  },
  {
    id: "assess-4",
    title: "Skewer the King!",
    fen: "r7/1k6/8/8/2B5/8/8/7K w - - 0 1",
    solution: "Bd5+",
    hint: "Move your bishop to attack the king. What's hiding behind it?",
    explanation:
      "Great thinking! Bd5+ is a skewer! Your bishop moves to d5, attacking the black king on b7. The king MUST move, and then your bishop captures the rook on a8. A skewer is like a reverse pin — you attack the king first, and win the piece behind it! ♝",
    type: "skewer",
    difficulty: "beginner",
  },
  {
    id: "assess-5",
    title: "Win the Pinned Piece!",
    fen: "4k3/4r3/8/4Q3/8/8/8/4K3 w - - 0 1",
    solution: "Qxe7",
    hint: "The black rook can't move — it's protecting the king. Can you take it?",
    explanation:
      "Yes! Qxe7 wins the rook! The black rook on e7 is pinned — if it moves, the king on e8 would be exposed. But here you can just capture it directly with your queen! The rook was 'stuck' protecting the king, so it couldn't fight back. That's how pins win material! ♛",
    type: "pin",
    difficulty: "beginner",
  },
];

export const tacticsPuzzles: Puzzle[] = [
  {
    id: "tac-fork-1",
    title: "Knight Fork — Fork the Royals!",
    fen: "r3k3/8/8/3N4/8/8/8/4K3 w - - 0 1",
    solution: "Nc7+",
    hint: "A knight can attack the king AND the rook at once!",
    explanation:
      "Nc7+ forks the king and rook! After the king moves, you win the rook for free. Knights are amazing because they jump over pieces and can attack two targets simultaneously.",
    type: "fork",
    difficulty: "beginner",
  },
  {
    id: "tac-fork-2",
    title: "Queen Fork — Attack Two at Once!",
    fen: "r1bqk3/pppp1ppp/2n2n2/8/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 1",
    solution: "d5",
    hint: "Can you push a pawn to attack two black pieces at once?",
    explanation:
      "d5! This pawn pushes forward and attacks both the knight on c6 and the knight on f6 (through the center). When one pawn threatens two pieces, that's a pawn fork! Your opponent can only save one knight.",
    type: "fork",
    difficulty: "intermediate",
  },
  {
    id: "tac-pin-1",
    title: "Pin to Win!",
    fen: "4k3/4r3/8/4Q3/8/8/8/4K3 w - - 0 1",
    solution: "Qxe7",
    hint: "The rook can't move — it's protecting the king!",
    explanation:
      "Qxe7 wins the rook! It's pinned against the king. A pin means a piece can't move because moving would expose a more valuable piece (the king) to attack. Use pins to win material!",
    type: "pin",
    difficulty: "beginner",
  },
  {
    id: "tac-skewer-1",
    title: "Skewer — King First, Rook Second!",
    fen: "r7/1k6/8/8/2B5/8/8/7K w - - 0 1",
    solution: "Bd5+",
    hint: "Attack the king — what's hiding behind it?",
    explanation:
      "Bd5+ skewers the king! The king must escape the check, then you take the rook. A skewer is like a pin but backwards — you attack the MORE valuable piece (king) first, then take the piece behind it.",
    type: "skewer",
    difficulty: "beginner",
  },
  {
    id: "tac-backrank-1",
    title: "Back-Rank Weakness!",
    fen: "6k1/5ppp/6N1/8/8/8/8/4R2K w - - 0 1",
    solution: "Re8#",
    hint: "The king is trapped by its own pawns. Use your rook!",
    explanation:
      "Re8#! The black king is trapped on the back rank by its own pawns. This is called a back-rank weakness. Your knight covers the escape squares and your rook delivers checkmate. Always make a 'luft' (escape square) for your king with h6 or g6!",
    type: "back-rank",
    difficulty: "beginner",
  },
];

export const openingsPuzzles: Puzzle[] = [
  {
    id: "open-1",
    title: "Control the Center!",
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    solution: "e4",
    hint: "Move a CENTER pawn two squares forward!",
    explanation:
      "e4! This is the most popular first move in chess. It grabs the center (e4 and d4 squares), opens lines for your bishop and queen, and gives your pieces room to develop. Control the center — that's Rule #1 of openings!",
    type: "tactic",
    difficulty: "beginner",
  },
  {
    id: "open-2",
    title: "Develop Your Knights!",
    fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
    solution: "e5",
    hint: "Black should also control the center!",
    explanation:
      "e5! Black fights for the center too. This leads to an Open Game — one of the most exciting types of chess. When both sides control the center, exciting battles begin!",
    type: "tactic",
    difficulty: "beginner",
  },
];

export const endgamePuzzles: Puzzle[] = [
  {
    id: "end-1",
    title: "Queen Checkmate!",
    fen: "k7/2Q5/1K6/8/8/8/8/8 w - - 0 1",
    solution: "Qc8#",
    hint: "The king is in the corner. Deliver checkmate!",
    explanation:
      "Qc8#! Queen and King working together deliver checkmate. The queen goes to c8 (giving check), while your king covers the escape squares on a7 and b7. King + Queen vs King is the most basic checkmate to learn!",
    type: "mate-in-1",
    difficulty: "beginner",
  },
  {
    id: "end-2",
    title: "Rook Checkmate!",
    fen: "6k1/5ppp/6N1/8/8/8/8/4R2K w - - 0 1",
    solution: "Re8#",
    hint: "Use your rook on the back rank!",
    explanation:
      "Re8#! Rook checkmate on the back rank. The enemy king was trapped by its own pawns. Always watch for back-rank weaknesses in rook endgames!",
    type: "mate-in-1",
    difficulty: "beginner",
  },
];
