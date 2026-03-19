import { Chess } from "chess.js";

export interface OpeningLine {
  id: string;
  lessonId: string;
  name: string;
  moves: string[];
  quizMoves: number[]; // 0-based indices into moves[] that the student plays
  playerColor: "w" | "b";
  topic: string;
}

export interface QuizPosition {
  fen: string;
  solution: string;
  moveNumber: number;
  playerColor: "w" | "b";
  lineId: string;
  lineName: string;
}

export const openingLines: OpeningLine[] = [
  // ─── Opening Principles ───────────────────────────────────────────────────
  {
    id: "principles-basic-dev",
    lessonId: "openings-principles",
    name: "Basic Development (White)",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "Nc3", "Nf6", "d3", "d6", "O-O", "O-O"],
    quizMoves: [0, 2, 4, 6, 8, 10],
    playerColor: "w",
    topic: "Opening Principles: control center, develop pieces, castle",
  },
  {
    id: "principles-d4-opening",
    lessonId: "openings-principles",
    name: "d4 Opening (White)",
    moves: ["d4", "d5", "Nf3", "Nf6", "Bf4", "e6", "e3", "Bd6", "Bg3", "O-O", "Be2", "Nbd7", "O-O", "c5"],
    quizMoves: [0, 2, 4, 6, 8, 10, 12],
    playerColor: "w",
    topic: "Opening Principles: d4 center control and development",
  },

  // ─── Italian Game ──────────────────────────────────────────────────────────
  {
    id: "italian-giuoco-piano",
    lessonId: "openings-italian",
    name: "Giuoco Piano",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "c3", "Nf6", "d4", "exd4", "cxd4", "Bb4+", "Nc3", "Nxe4", "O-O", "Bxc3", "bxc3", "d5"],
    quizMoves: [0, 2, 4, 6, 8, 10, 12, 14, 16],
    playerColor: "w",
    topic: "Italian Game / Giuoco Piano: the classical center fight after 1.e4 e5 2.Nf3 Nc6 3.Bc4",
  },
  {
    id: "italian-two-knights",
    lessonId: "openings-italian",
    name: "Two Knights Defense",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Nf6", "Ng5", "d5", "exd5", "Na5", "Bb5+", "c6", "dxc6", "bxc6", "Be2", "h6", "Nf3", "e4"],
    quizMoves: [0, 2, 4, 6, 8, 10, 12, 14, 16],
    playerColor: "w",
    topic: "Italian Game Two Knights Defense: White attacks f7 with Ng5",
  },

  // ─── Ruy Lopez ─────────────────────────────────────────────────────────────
  {
    id: "ruy-closed",
    lessonId: "openings-ruy",
    name: "Closed Ruy Lopez",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Ba4", "Nf6", "O-O", "Be7", "Re1", "b5", "Bb3", "d6", "c3", "O-O", "h3", "Nb8", "d4", "Nbd7"],
    quizMoves: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18],
    playerColor: "w",
    topic: "Ruy Lopez (Spanish Game): White pins the knight defending e5 with Bb5",
  },
  {
    id: "ruy-exchange",
    lessonId: "openings-ruy",
    name: "Ruy Lopez Exchange",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Bxc6", "dxc6", "Nxe5", "Qd4", "Nf3", "Qxe4+", "Qe2", "Qxe2+", "Kxe2"],
    quizMoves: [0, 2, 4, 6, 8, 10, 12, 14],
    playerColor: "w",
    topic: "Ruy Lopez Exchange Variation: White captures the knight on c6",
  },

  // ─── Sicilian Defense ──────────────────────────────────────────────────────
  {
    id: "sicilian-najdorf",
    lessonId: "openings-sicilian",
    name: "Sicilian Najdorf",
    moves: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "a6", "Be2", "e5", "Nb3", "Be6", "Be3", "Be7", "O-O", "O-O", "f4", "b5"],
    quizMoves: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
    playerColor: "b",
    topic: "Sicilian Najdorf: Black's most ambitious defense to 1.e4",
  },
  {
    id: "sicilian-dragon",
    lessonId: "openings-sicilian",
    name: "Sicilian Dragon",
    moves: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "g6", "Be3", "Bg7", "f3", "O-O", "Qd2", "Nc6", "Bc4", "Bd7", "O-O-O", "Rc8"],
    quizMoves: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
    playerColor: "b",
    topic: "Sicilian Dragon: Black fianchettoes the bishop on g7",
  },

  // ─── Queen's Gambit ────────────────────────────────────────────────────────
  {
    id: "qg-declined",
    lessonId: "openings-queens-gambit",
    name: "Queen's Gambit Declined",
    moves: ["d4", "d5", "c4", "e6", "Nc3", "Nf6", "Bg5", "Be7", "e3", "O-O", "Nf3", "h6", "Bh4", "b6", "cxd5", "Nxd5", "Bxe7", "Qxe7", "Nxd5", "exd5"],
    quizMoves: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18],
    playerColor: "w",
    topic: "Queen's Gambit Declined: White offers the c4 pawn to gain center",
  },
  {
    id: "qg-accepted",
    lessonId: "openings-queens-gambit",
    name: "Queen's Gambit Accepted",
    moves: ["d4", "d5", "c4", "dxc4", "Nf3", "Nf6", "e3", "e6", "Bxc4", "c5", "O-O", "a6", "dxc5", "Qxd1", "Rxd1", "Bxc5"],
    quizMoves: [0, 2, 4, 6, 8, 10, 12, 14],
    playerColor: "w",
    topic: "Queen's Gambit Accepted: White gets center space, Black gets free piece development",
  },

  // ─── London System ─────────────────────────────────────────────────────────
  {
    id: "london-main",
    lessonId: "openings-london",
    name: "London System Main",
    moves: ["d4", "d5", "Nf3", "Nf6", "Bf4", "e6", "e3", "Bd6", "Bg3", "O-O", "Nbd2", "c5", "c3", "Nc6", "Bd3", "Qe7", "O-O", "b6", "Ne5", "Bb7"],
    quizMoves: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18],
    playerColor: "w",
    topic: "London System: a solid and reliable setup with d4, Nf3, Bf4",
  },
  {
    id: "london-vs-kid",
    lessonId: "openings-london",
    name: "London vs King's Indian Setup",
    moves: ["d4", "Nf6", "Nf3", "g6", "Bf4", "Bg7", "e3", "O-O", "Be2", "d6", "h3", "Nbd7", "O-O", "c6", "c4", "Re8"],
    quizMoves: [0, 2, 4, 6, 8, 10, 12, 14],
    playerColor: "w",
    topic: "London System vs King's Indian setup",
  },

  // ─── French Defense ────────────────────────────────────────────────────────
  {
    id: "french-advance",
    lessonId: "openings-french",
    name: "French Advance",
    moves: ["e4", "e6", "d4", "d5", "e5", "c5", "c3", "Nc6", "Nf3", "Qb6", "Be2", "cxd4", "cxd4", "Nge7", "Nc3", "Nf5", "Na4", "Qa5+", "Bd2", "Bb4"],
    quizMoves: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18],
    playerColor: "w",
    topic: "French Defense Advance: White grabs space with e5",
  },
  {
    id: "french-exchange",
    lessonId: "openings-french",
    name: "French Exchange",
    moves: ["e4", "e6", "d4", "d5", "exd5", "exd5", "Nf3", "Nf6", "Bd3", "Bd6", "O-O", "O-O", "c3", "Re8"],
    quizMoves: [0, 2, 4, 6, 8, 10, 12],
    playerColor: "w",
    topic: "French Defense Exchange: symmetrical pawn structure",
  },

  // ─── Caro-Kann ─────────────────────────────────────────────────────────────
  {
    id: "caro-classical",
    lessonId: "openings-caro",
    name: "Caro-Kann Classical",
    moves: ["e4", "c6", "d4", "d5", "Nc3", "dxe4", "Nxe4", "Bf5", "Ng3", "Bg6", "h4", "h6", "Nf3", "Nd7", "h5", "Bh7", "Bd3", "Bxd3", "Qxd3", "e6", "Bd2", "Ngf6", "O-O-O", "Be7"],
    quizMoves: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22],
    playerColor: "w",
    topic: "Caro-Kann Classical: Black develops the bishop outside the pawn chain before playing e6",
  },
  {
    id: "caro-advance",
    lessonId: "openings-caro",
    name: "Caro-Kann Advance",
    moves: ["e4", "c6", "d4", "d5", "e5", "Bf5", "Nf3", "e6", "Be2", "c5", "Be3", "Nc6", "c3", "cxd4", "cxd4", "Nge7", "Nc3", "Ng6", "O-O", "Be7"],
    quizMoves: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18],
    playerColor: "w",
    topic: "Caro-Kann Advance: White claims space, Black attacks the center",
  },

  // ─── King's Indian Defense ─────────────────────────────────────────────────
  {
    id: "kid-classical",
    lessonId: "openings-kings-indian",
    name: "KID Classical",
    moves: ["d4", "Nf6", "c4", "g6", "Nc3", "Bg7", "e4", "d6", "Nf3", "O-O", "Be2", "e5", "O-O", "Nc6", "d5", "Ne7", "Ne1", "Nd7", "Nd3", "f5"],
    quizMoves: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
    playerColor: "b",
    topic: "King's Indian Defense: Black fianchettoes on g7 and fights back with e5",
  },
  {
    id: "kid-four-pawns",
    lessonId: "openings-kings-indian",
    name: "KID Four Pawns Attack",
    moves: ["d4", "Nf6", "c4", "g6", "Nc3", "Bg7", "e4", "d6", "f4", "O-O", "Nf3", "c5", "d5", "b5", "cxb5", "a6", "bxa6", "Bxa6", "Bd3", "Nbd7"],
    quizMoves: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
    playerColor: "b",
    topic: "King's Indian Four Pawns Attack: White builds a huge center, Black attacks it",
  },

  // ─── King's Gambit ─────────────────────────────────────────────────────────
  {
    id: "kings-gambit-accepted",
    lessonId: "openings-kings-gambit",
    name: "King's Gambit Accepted",
    moves: ["e4", "e5", "f4", "exf4", "Nf3", "d5", "exd5", "Nf6", "Bc4", "Nxd5", "O-O", "Be6", "Bb3", "Nc6", "d4", "Qd7", "Nc3", "Nxc3", "bxc3", "O-O-O"],
    quizMoves: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18],
    playerColor: "w",
    topic: "King's Gambit Accepted: White sacrifices the f-pawn for rapid development and center",
  },
  {
    id: "kings-gambit-declined",
    lessonId: "openings-kings-gambit",
    name: "King's Gambit Declined",
    moves: ["e4", "e5", "f4", "Bc5", "Nf3", "d6", "c3", "Nf6", "d4", "exd4", "cxd4", "Bb4+", "Nc3", "Bxc3+", "bxc3", "O-O", "Bc4", "Nc6", "O-O", "Bg4"],
    quizMoves: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18],
    playerColor: "w",
    topic: "King's Gambit Declined: Black keeps solid center instead of accepting the pawn",
  },
];

/**
 * Given an OpeningLine and a specific quizMoves array index,
 * plays through the moves up to (but not including) the quiz move,
 * then returns the position + the solution move.
 */
export function getQuizPuzzle(line: OpeningLine, quizIndex: number): QuizPosition | null {
  try {
    const quizMoveIdx = line.quizMoves[quizIndex];
    if (quizMoveIdx === undefined) return null;

    const chess = new Chess();

    // Play all moves before the quiz move
    for (let i = 0; i < quizMoveIdx; i++) {
      const result = chess.move(line.moves[i]);
      if (!result) {
        console.error(`Invalid move at index ${i}: ${line.moves[i]} in line ${line.id}`);
        return null;
      }
    }

    const fen = chess.fen();
    const solution = line.moves[quizMoveIdx];
    if (!solution) return null;

    // Validate the solution move is legal in this position
    const testChess = new Chess(fen);
    const testMove = testChess.move(solution);
    if (!testMove) {
      console.error(`Solution move ${solution} is illegal in position ${fen} (line: ${line.id})`);
      return null;
    }

    return {
      fen,
      solution: testMove.san, // normalize to SAN
      moveNumber: quizMoveIdx + 1,
      playerColor: line.playerColor,
      lineId: line.id,
      lineName: line.name,
    };
  } catch (err) {
    console.error(`getQuizPuzzle error for line ${line.id}:`, err);
    return null;
  }
}
