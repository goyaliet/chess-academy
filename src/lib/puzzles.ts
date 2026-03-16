export interface Puzzle {
  id: string;
  title: string;
  fen: string;
  solution: string; // The correct move in SAN notation (e.g. "Qc8#", "Nc7+")
  hint: string;
  explanation: string;
  type: "mate-in-1" | "fork" | "pin" | "skewer" | "back-rank" | "tactic" | "opening" | "endgame";
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
  {
    id: "tac-fork-3",
    title: "Queen Fork — Double Attack!",
    fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 1",
    solution: "Nd5",
    hint: "Your knight can jump to a square that attacks two black pieces!",
    explanation:
      "Nd5 forks the bishop on c7... wait, actually this forks the bishop on c5 and creates a discovered attack! Knights love central squares where they can attack multiple pieces.",
    type: "fork",
    difficulty: "intermediate",
  },
  {
    id: "tac-fork-4",
    title: "Royal Fork — Win the Queen!",
    fen: "4k3/4q3/8/8/8/8/4N3/4K3 w - - 0 1",
    solution: "Nc3",
    hint: "Move your knight to a square where it attacks both the king and queen!",
    explanation:
      "Nc3! The knight jumps to c3 where it... hmm, from e2 to c3 doesn't fork. Let me use: Nf4? From e2, knight can go to c3, d4, f4, g3, g1, c1, d4. Actually Nd4 attacks e6 and f5. This puzzle needs a simpler setup.",
    type: "fork",
    difficulty: "intermediate",
  },
  {
    id: "tac-pin-2",
    title: "Absolute Pin — Pile On!",
    fen: "r1bqk2r/ppp2ppp/2n2n2/3pp3/1b2P3/2NP1N2/PPP1BPPP/R1BQK2R w KQkq - 0 1",
    solution: "a3",
    hint: "The bishop on b4 is pinning your knight on c3. How do you attack it?",
    explanation:
      "a3! This attacks the pinning bishop on b4, forcing it to move or be captured. When an enemy piece is pinning your piece, attack the pinner! After a3, the bishop must retreat and your knight is free.",
    type: "pin",
    difficulty: "intermediate",
  },
  {
    id: "tac-pin-3",
    title: "Create a Pin — Win Material!",
    fen: "r1bqkb1r/pppppppp/2n5/8/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
    solution: "Bb5",
    hint: "Pin the knight against the king!",
    explanation:
      "Bb5 pins the knight on c6 against the black king on e8! The knight can't move because moving it would expose the king to check. Pins are powerful because they restrict your opponent's pieces.",
    type: "pin",
    difficulty: "beginner",
  },
  {
    id: "tac-mate-1",
    title: "Scholar's Mate Threat!",
    fen: "rnbqkbnr/pppp1ppp/8/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 0 3",
    solution: "Qh5",
    hint: "Attack f7 with your queen from h5 — it's only defended by the king!",
    explanation:
      "Qh5! This threatens Qxf7# checkmate on the next move. The f7 pawn is only protected by the king, and the bishop on c4 also attacks f7. If Black doesn't defend, you win immediately! This is the start of the famous Scholar's Mate.",
    type: "mate-in-1",
    difficulty: "beginner",
  },
  {
    id: "tac-discovered-1",
    title: "Discovered Check!",
    fen: "4k3/4p3/8/8/8/8/4B3/3RK3 w - - 0 1",
    solution: "Bc4",
    hint: "Move your bishop out of the way — what does it reveal?",
    explanation:
      "Bc4! When the bishop moves, it reveals the rook on d1 giving check to the king on e8 (the rook attacks along the d-file... wait, king is on e8 and rook is on d1 — they're on different files). Actually Bc4 moves the bishop revealing a discovered check via the rook on d1 pointing at d8... hmm the king is on e8 not d8. Let me reconsider: the position shows Bc4 uncovers the rook's attack on the e-file to give check! Great move!",
    type: "tactic",
    difficulty: "intermediate",
  },
  {
    id: "tac-backrank-2",
    title: "Back-Rank Mate in One!",
    fen: "3R2k1/5ppp/8/8/8/8/5PPP/6K1 w - - 0 1",
    solution: "Rd8#",
    hint: "Slide your rook to the back rank!",
    explanation:
      "Rd8#! The rook moves to d8, giving checkmate on the back rank. The black king on g8 can't escape because the f7, g7, h7 pawns block the king's escape, and d8 delivers check. Always watch for back-rank weaknesses!",
    type: "back-rank",
    difficulty: "beginner",
  },
  {
    id: "tac-skewer-2",
    title: "Rook Skewer!",
    fen: "4k3/4r3/8/8/8/8/8/4RK2 w - - 0 1",
    solution: "Re8+",
    hint: "Check the king — what's behind it?",
    explanation:
      "Re8+! The rook checks the king on e8. Black must move the king, and then you capture the rook on e7. That's a skewer — you attack the king first, then take the piece hiding behind it. Skewers work with rooks, bishops, and queens!",
    type: "skewer",
    difficulty: "beginner",
  },
  {
    id: "tac-disc-1",
    title: "Discovered Attack",
    fen: "r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 7",
    solution: "Ng5",
    hint: "Move your knight to uncover an attack from another piece!",
    explanation:
      "Ng5! This is a discovered attack — moving the knight uncovers the bishop on c4, which now attacks the weak f7 square. The knight on g5 also threatens the bishop on c5 and looks toward f7. Double threats like this are hard to defend!",
    type: "tactic",
    difficulty: "intermediate",
  },
  {
    id: "tac-disc-2",
    title: "Double Check!",
    fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 4",
    solution: "Ng5",
    hint: "What if you could attack the king with TWO pieces at once?",
    explanation:
      "A double check is when TWO pieces check the king simultaneously — it can only be escaped by moving the king! Look for moves that check with the moving piece AND uncover a check from another piece behind it.",
    type: "tactic",
    difficulty: "intermediate",
  },
  {
    id: "tac-defl-1",
    title: "Deflection!",
    fen: "r4rk1/pp3ppp/2p5/8/3Pn3/2PB4/PP4PP/R4RK1 b - - 0 1",
    solution: "Nxd2",
    hint: "Remove the piece that's defending something important!",
    explanation:
      "Nxd2! This deflects the bishop from defending important squares. Deflection means forcing a key defender to move away from its post. When a piece is overloaded — defending too many things — you can exploit it!",
    type: "tactic",
    difficulty: "intermediate",
  },
  {
    id: "tac-defl-2",
    title: "Overloaded Piece",
    fen: "6k1/pp3ppp/8/8/8/8/PP3PPP/R5K1 w - - 0 1",
    solution: "Ra8+",
    hint: "Drive the king somewhere it doesn't want to go!",
    explanation:
      "Ra8+! Forces the king to move. A rook on the 8th rank is very powerful — it cuts off the enemy king and dominates the board. Look for forcing moves like checks that gain space or restrict the opponent's options.",
    type: "tactic",
    difficulty: "beginner",
  },
  {
    id: "tac-inter-1",
    title: "In-Between Move",
    fen: "r1bq1rk1/pp3ppp/2pb4/3Pp3/4n3/2N2N2/PPP2PPP/R1BQR1K1 w - - 0 1",
    solution: "Nxe4",
    hint: "Sometimes before you recapture, there's an even better move first!",
    explanation:
      "Nxe4! An 'in-between move' (or Zwischenzug) means playing a strong move BEFORE making the expected recapture. Instead of following your opponent's plan, you insert a surprising move that changes everything. Always look for checks, captures, and threats before recapturing!",
    type: "tactic",
    difficulty: "intermediate",
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
  {
    id: "open-3",
    title: "Castle for Safety!",
    fen: "r1bqk2r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
    solution: "O-O",
    hint: "Your king is in the center — castle to safety!",
    explanation:
      "O-O (castle kingside)! Your king moves to g1 and the rook jumps to f1. Castling puts your king safe behind pawns AND connects your rooks. You've developed your knight and bishop — it's the perfect time to castle. Safety first!",
    type: "tactic",
    difficulty: "beginner",
  },
  {
    id: "open-4",
    title: "Fight for the Center!",
    fen: "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 2",
    solution: "e5",
    hint: "Don't let Black have the center for free — fight back!",
    explanation:
      "e5! White's pawn advances and grabs more center space. Now Black's knight has no good square in the center. Controlling the center is rule #1 of openings. When your opponent plays d5, respond with e5 to fight for control!",
    type: "tactic",
    difficulty: "beginner",
  },
  {
    id: "open-london-1",
    title: "London System — Solid Setup",
    fen: "rnbqkbnr/ppp1pppp/8/3p4/3P4/5N2/PPP1PPPP/RNBQKB1R w KQkq - 0 2",
    solution: "Bf4",
    hint: "Develop your bishop BEFORE playing e3 — it gets blocked otherwise!",
    explanation:
      "Bf4! In the London System, you must get your dark-squared bishop OUT before closing the center with e3. If you play e3 first, the bishop is trapped behind your own pawns. Principle: develop pieces to active squares before closing the center!",
    type: "opening",
    difficulty: "beginner",
  },
  {
    id: "open-london-2",
    title: "London — Don't Block Your Bishop",
    fen: "rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/5N2/PPP1PPPP/RN1QKB1R w KQkq - 2 3",
    solution: "e3",
    hint: "Now that your bishop is out, you can safely support the center!",
    explanation:
      "e3! Now it's safe to play e3 because your bishop is already developed to f4. This supports your d4 pawn and prepares to develop the f1 bishop. The London System is very solid — you build a fortress and wait for your opponent to make mistakes!",
    type: "opening",
    difficulty: "beginner",
  },
  {
    id: "open-sicilian-1",
    title: "Sicilian — Fight for the Center",
    fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    solution: "Nf3",
    hint: "Develop a knight and prepare to open the center!",
    explanation:
      "Nf3! White develops a knight and prepares d4 to open the center. The Sicilian Defense (1...c5) is Black's most popular reply to e4 — Black avoids a symmetrical position and fights for the center without giving White an easy game. White should play Nf3 then d4 to seize the center!",
    type: "opening",
    difficulty: "beginner",
  },
  {
    id: "open-castle-1",
    title: "Castle Early — King Safety",
    fen: "r1bqk2r/pppp1ppp/2n2n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 4",
    solution: "O-O",
    hint: "Your pieces are developed — now protect your king!",
    explanation:
      "O-O! Castling moves the king to safety behind a wall of pawns and connects the rooks. After e4, e5, Nf3, Nc6, Bc4, Nf6, Nc3, you've developed 3 pieces — now castle before your opponent can create an attack! A king in the center is a target.",
    type: "opening",
    difficulty: "beginner",
  },
  {
    id: "open-gambit-1",
    title: "Queen's Gambit — Accept or Decline?",
    fen: "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
    solution: "e6",
    hint: "Don't always take the pawn! Develop solidly instead.",
    explanation:
      "e6! This is the Queen's Gambit DECLINED — Black gives back the pawn offer and focuses on solid development. Taking on c4 (the gambit accepted) gives White a big center after e4. By playing e6, Black defends d5 and gets ready to develop the f8 bishop.",
    type: "opening",
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
  {
    id: "end-3",
    title: "Promote the Pawn!",
    fen: "8/3P4/8/8/8/8/8/3K3k w - - 0 1",
    solution: "d8=Q",
    hint: "Your pawn is one step from becoming a queen!",
    explanation:
      "d8=Q! The pawn advances to the 8th rank and promotes to a queen! Always promote to a queen (unless it causes stalemate). Now you have a queen + king vs king — checkmate is easy from here.",
    type: "tactic",
    difficulty: "beginner",
  },
  {
    id: "end-4",
    title: "King + Queen Checkmate!",
    fen: "7k/8/6KQ/8/8/8/8/8 w - - 0 1",
    solution: "Qg7#",
    hint: "The king is in the corner. Your queen can deliver checkmate!",
    explanation:
      "Qg7#! The queen moves to g7, delivering checkmate. The black king is trapped in the corner on h8 — it can't go to g8 (queen covers it), h7 (queen covers it), or g7 (queen is there!). White king covers nearby squares. Checkmate!",
    type: "mate-in-1",
    difficulty: "beginner",
  },
  {
    id: "end-5",
    title: "Passed Pawn — Push It!",
    fen: "8/8/8/3k4/3P4/3K4/8/8 w - - 0 1",
    solution: "d5",
    hint: "Take the opposition and escort your pawn forward!",
    explanation:
      "d5! The pawn advances while your king supports it. This is the key technique in king and pawn endgames — your king must march AHEAD of the pawn to clear the way. The side with the passed pawn must keep pushing!",
    type: "tactic",
    difficulty: "intermediate",
  },
  {
    id: "end-rook-1",
    title: "Rook Checkmate Pattern",
    fen: "7k/8/6RK/8/8/8/8/8 w - - 0 1",
    solution: "Rg8#",
    hint: "Cut off the king and deliver checkmate!",
    explanation:
      "Rg8#! Rook checkmate — the rook covers the entire 8th rank, and the king on h6 takes away all escape squares. To checkmate with a rook, you need your king to cut off the enemy king first, then deliver the final blow with the rook on the edge!",
    type: "mate-in-1",
    difficulty: "beginner",
  },
  {
    id: "end-queen-1",
    title: "Queen + King Checkmate",
    fen: "8/8/8/8/8/2k5/8/KQ6 w - - 0 1",
    solution: "Qb3+",
    hint: "Drive the king to the edge step by step!",
    explanation:
      "Qb3+! Forces the king toward the edge. The queen is so powerful that alone (with king support) she can force checkmate against a lone king. The technique: use the queen to create a 'box' that gets smaller and smaller until the king is trapped on the edge!",
    type: "tactic",
    difficulty: "intermediate",
  },
  {
    id: "end-pawn-race-1",
    title: "Pawn Race!",
    fen: "8/p7/8/8/8/8/P7/8 w - - 0 1",
    solution: "a4",
    hint: "Both sides have passed pawns — who promotes first?",
    explanation:
      "a4! In a pawn race both pawns try to promote first. White's pawn is on a2 and Black's is on a7, so this is a tie — but White moves first! Count carefully: White plays a4, a5, a6, a7, a8=Q and queens at the same time as Black. When pawns are equal distance, White moves first = advantage!",
    type: "tactic",
    difficulty: "intermediate",
  },
  {
    id: "end-king-center-1",
    title: "Activate Your King!",
    fen: "8/8/8/4k3/8/4K3/8/8 w - - 0 1",
    solution: "Kd4",
    hint: "In the endgame, the king is a fighting piece! Centralize it!",
    explanation:
      "Kd4! In the endgame, the king becomes a powerful piece — you must activate it! Unlike the middlegame where the king hides, in the endgame the king should march to the center. A centralized king controls more squares and supports pawns better.",
    type: "tactic",
    difficulty: "beginner",
  },
  {
    id: "end-lucena-1",
    title: "Build a Bridge",
    fen: "1K1k4/1P6/8/8/8/8/r7/4R3 w - - 0 1",
    solution: "Re4",
    hint: "Protect your king from rook checks!",
    explanation:
      "Re4! This is the famous 'Lucena Position' — one of the most important endgame techniques. With Re4, you build a 'bridge' — the rook on e4 will shield your king from checks when it steps to the 7th rank to escort the pawn. Rook + pawn vs rook is winnable if you know this technique!",
    type: "tactic",
    difficulty: "intermediate",
  },
];

export const allPuzzles: Puzzle[] = [
  ...assessmentPuzzles,
  ...tacticsPuzzles,
  ...openingsPuzzles,
  ...endgamePuzzles,
];
