export interface Lesson {
  id: string;
  title: string;
  emoji: string;
  description: string;
  concepts: Concept[];
  puzzleIds: string[];
  badge: string;
}

export interface Concept {
  title: string;
  explanation: string;
  tip: string;
  fen?: string; // optional board position to show
  moves?: string[]; // moves to animate
}

export interface Module {
  id: string;
  title: string;
  emoji: string;
  description: string;
  color: string;
  lessons: Lesson[];
}

export const modules: Module[] = [
  {
    id: "tactics",
    title: "Tactics",
    emoji: "⚔️",
    description: "Learn the sharp moves that win material and deliver checkmate",
    color: "from-red-900 to-red-800",
    lessons: [
      {
        id: "tactics-fork",
        title: "Forks",
        emoji: "♞",
        badge: "Fork Master",
        description: "Attack two pieces at once!",
        puzzleIds: ["tac-fork-1", "tac-fork-2"],
        concepts: [
          {
            title: "What is a Fork?",
            explanation:
              "A fork is when ONE of your pieces attacks TWO of your opponent's pieces at the same time. The opponent can only save one piece, so you win the other! Knights are the best at forks because they jump in unexpected ways.",
            tip: "Always look for squares where your knight can jump to attack two enemy pieces at once.",
            fen: "r3k3/8/8/3N4/8/8/8/4K3 w - - 0 1",
          },
          {
            title: "Knight Forks",
            explanation:
              "Knights are the fork kings! Because knights move in an L-shape, they can attack pieces that can't even see them coming. A knight fork on the king and queen (called a 'family fork') wins the queen!",
            tip: "Knights on c7 or f7 are very dangerous — they can fork king and rook or even king and queen!",
            fen: "r3k3/8/8/3N4/8/8/8/4K3 w - - 0 1",
          },
          {
            title: "Pawn Forks",
            explanation:
              "Even pawns can fork! When a pawn advances and attacks two enemy pieces diagonally, that's a pawn fork. Since pawns are worth less than other pieces, you usually win material when your pawn forks two bigger pieces.",
            tip: "If your pawn can advance to attack two enemy pieces, it's usually a great move!",
            fen: "r1bqk3/pppp1ppp/2n2n2/8/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 1",
          },
        ],
      },
      {
        id: "tactics-pin",
        title: "Pins",
        emoji: "📌",
        badge: "Pin Wizard",
        description: "Freeze enemy pieces in place!",
        puzzleIds: ["tac-pin-1"],
        concepts: [
          {
            title: "What is a Pin?",
            explanation:
              "A pin happens when a piece can't move because moving it would expose a more valuable piece (usually the king) to attack. The pinned piece is 'frozen' — it has to stay put!",
            tip: "Look for enemy pieces standing in front of their king — they might be pinnable!",
            fen: "4k3/4r3/8/4Q3/8/8/8/4K3 w - - 0 1",
          },
          {
            title: "Absolute Pins",
            explanation:
              "An absolute pin is when a piece is pinned against the king — it literally CANNOT move because moving would leave the king in check (which is illegal). You can attack these pinned pieces again and again!",
            tip: "An absolutely pinned piece is worth less — attack it with pawns and lesser pieces to win material!",
            fen: "4k3/4r3/8/4Q3/8/8/8/4K3 w - - 0 1",
          },
        ],
      },
      {
        id: "tactics-skewer",
        title: "Skewers",
        emoji: "🗡️",
        badge: "Skewer Expert",
        description: "The reverse pin — attack the king first!",
        puzzleIds: ["tac-skewer-1"],
        concepts: [
          {
            title: "What is a Skewer?",
            explanation:
              "A skewer is like a pin but reversed! Instead of attacking a small piece in front of a big piece, you attack the BIG piece first (usually the king). The big piece must move, and you capture the smaller piece behind it.",
            tip: "Look for situations where the enemy king and a valuable piece are lined up on a rank, file, or diagonal.",
            fen: "r7/1k6/8/8/2B5/8/8/7K w - - 0 1",
          },
        ],
      },
      {
        id: "tactics-backrank",
        title: "Back-Rank Weakness",
        emoji: "🏰",
        badge: "Back-Rank Guardian",
        description: "Checkmate the king trapped on the back rank!",
        puzzleIds: ["tac-backrank-1"],
        concepts: [
          {
            title: "What is a Back-Rank Weakness?",
            explanation:
              "When a king castles and hides behind its pawns, it's usually safe. But if the king has no escape square (no pawn moved to make a 'hole'), a rook or queen can deliver checkmate on the back rank!",
            tip: "Always make a 'luft' (German for air) — move one pawn (h3 or g3) to give your king an escape square!",
            fen: "6k1/5ppp/6N1/8/8/8/8/4R2K w - - 0 1",
          },
        ],
      },
    ],
  },
  {
    id: "openings",
    title: "Openings",
    emoji: "♟️",
    description: "Start your games with the best moves and control the center",
    color: "from-blue-900 to-blue-800",
    lessons: [
      {
        id: "openings-principles",
        title: "3 Opening Principles",
        emoji: "📜",
        badge: "Opening Scholar",
        description: "The 3 rules every chess player must follow",
        puzzleIds: ["open-1"],
        concepts: [
          {
            title: "Rule 1: Control the Center",
            explanation:
              "The center (the e4, d4, e5, d5 squares) is the most important area of the board. Pieces in the center control the most squares. Move your center pawns (e-pawn and d-pawn) first!",
            tip: "Play 1.e4 or 1.d4 as White to grab the center immediately!",
            fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          },
          {
            title: "Rule 2: Develop Your Pieces",
            explanation:
              "Develop means moving your pieces (knights and bishops) from their starting squares to active positions. Don't move the same piece twice in the opening! Get ALL your pieces out before attacking.",
            tip: "Develop knights before bishops — 'knights before bishops' is a classic rule!",
            fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 2",
          },
          {
            title: "Rule 3: Castle Your King",
            explanation:
              "Castling puts your king to safety and connects your rooks. Try to castle within the first 10 moves! A king stuck in the center is very dangerous — your opponent can attack it easily.",
            tip: "Castle kingside (0-0) more often than queenside — it's usually safer!",
            fen: "rnbqk2r/pppp1ppp/5n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
          },
        ],
      },
      {
        id: "openings-italian",
        title: "The Italian Game",
        emoji: "🇮🇹",
        badge: "Italian Master",
        description: "One of the oldest and most popular openings!",
        puzzleIds: ["open-2"],
        concepts: [
          {
            title: "How the Italian Game Works",
            explanation:
              "The Italian Game starts: 1.e4 e5 2.Nf3 Nc6 3.Bc4. White puts the bishop on c4, pointing at Black's weak f7 square (it's only defended by the king!). This is a great opening for beginners because it follows all 3 opening rules.",
            tip: "With Bc4, always look for the Scholar's Mate threat: Qh5 and Qxf7# if Black isn't careful!",
            fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
          },
        ],
      },
      {
        id: "openings-sicilian",
        title: "Sicilian Defense",
        emoji: "🛡️",
        badge: "Sicilian Defender",
        description: "Black's sharpest reply to 1.e4!",
        puzzleIds: [],
        concepts: [
          {
            title: "What is the Sicilian Defense?",
            explanation:
              "After 1.e4, Black plays 1...c5! This is the Sicilian Defense — the most popular chess opening in the world. Instead of mirroring White with e5, Black fights for the center differently. c5 attacks the d4 square without letting White build a perfect center.",
            tip: "The Sicilian creates unbalanced positions — great if you want to play for a win as Black!",
            fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2",
          },
        ],
      },
    ],
  },
  {
    id: "endgames",
    title: "Endgames",
    emoji: "👑",
    description: "Turn your advantage into a win in the final phase of the game",
    color: "from-purple-900 to-purple-800",
    lessons: [
      {
        id: "endgames-kq",
        title: "King + Queen vs King",
        emoji: "♛",
        badge: "Endgame Maestro",
        description: "The most basic checkmate to learn",
        puzzleIds: ["end-1"],
        concepts: [
          {
            title: "How to Checkmate with Queen + King",
            explanation:
              "To checkmate with Queen + King, you need to push the enemy king to the EDGE of the board (any side or corner). Then use your queen to take away squares while your king comes to help. The checkmate happens when the king is in the corner and has no escape.",
            tip: "Your king is a powerful piece in the endgame — use it! Bring it to the center first.",
            fen: "k7/2Q5/1K6/8/8/8/8/8 w - - 0 1",
          },
        ],
      },
      {
        id: "endgames-kr",
        title: "King + Rook vs King",
        emoji: "♜",
        badge: "Rook Endgame Expert",
        description: "The lawnmower technique!",
        puzzleIds: ["end-2"],
        concepts: [
          {
            title: "The Lawnmower Technique",
            explanation:
              "With King + Rook, use the 'lawnmower' method: cut the enemy king off rank by rank. The rook cuts off the enemy king on one side, then your king marches up to help. Eventually the enemy king is pushed to the edge and gets mated.",
            tip: "Keep your rook as far away from the enemy king as possible — a rook on the opposite side of the board is safe and controls more squares.",
            fen: "6k1/5ppp/6N1/8/8/8/8/4R2K w - - 0 1",
          },
        ],
      },
      {
        id: "endgames-pawns",
        title: "Pawn Endgames",
        emoji: "♟️",
        badge: "Pawn Power Expert",
        description: "King opposition and pawn promotion",
        puzzleIds: [],
        concepts: [
          {
            title: "King Opposition",
            explanation:
              "In pawn endgames, the kings 'fight' each other. When two kings face each other with one square between them, they're in OPPOSITION. The player who has opposition (forces the other king to move first) usually wins! This is the key concept in all pawn endgames.",
            tip: "To win a pawn endgame, march your king in FRONT of your pawn, take opposition, and escort it to promotion!",
            fen: "8/8/8/3k4/3P4/3K4/8/8 w - - 0 1",
          },
          {
            title: "Pawn Promotion",
            explanation:
              "When your pawn reaches the 8th rank (or 1st rank for Black), it promotes! You can choose: Queen (almost always the best), Rook, Bishop, or Knight. Always promote to a Queen unless it causes stalemate!",
            tip: "Watch out for stalemate! If promoting to a Queen would leave the enemy king with no moves but not in check — choose a Rook instead.",
            fen: "8/3P4/8/8/8/8/8/3K3k w - - 0 1",
          },
        ],
      },
    ],
  },
  {
    id: "strategy",
    title: "Strategy",
    emoji: "🧠",
    description: "Think like a grandmaster — plans, piece activity, and pawn structure",
    color: "from-green-900 to-green-800",
    lessons: [
      {
        id: "strategy-pieces",
        title: "Piece Activity",
        emoji: "🔥",
        badge: "Active Piece Expert",
        description: "Good pieces vs bad pieces",
        puzzleIds: [],
        concepts: [
          {
            title: "Good vs Bad Bishops",
            explanation:
              "A 'good bishop' is one that's NOT blocked by its own pawns. A 'bad bishop' is stuck behind pawns of the same color! Try to keep your pawns on the OPPOSITE color of your bishop so it stays active.",
            tip: "Before placing your pawns, think about which color your bishop is on. Keep pawns on the other color!",
            fen: "8/8/3p4/2pP4/2P5/8/8/8 w - - 0 1",
          },
          {
            title: "Outposts for Knights",
            explanation:
              "An 'outpost' is a square that your opponent's pawns can't attack. If you put a knight on an outpost deep in enemy territory, it becomes incredibly powerful! A knight on e5 or d5 in the middle of the board is like having an extra piece.",
            tip: "Look for squares that enemy pawns can't reach — those are perfect homes for your knights!",
            fen: "r1bqr1k1/ppp2ppp/2np1n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQR1K1 w - - 0 1",
          },
        ],
      },
      {
        id: "strategy-pawns",
        title: "Pawn Structure",
        emoji: "🏗️",
        badge: "Pawn Structure Pro",
        description: "Understand passed, doubled, and isolated pawns",
        puzzleIds: [],
        concepts: [
          {
            title: "Passed Pawns",
            explanation:
              "A passed pawn is a pawn with NO enemy pawns in front of it on the same file or adjacent files. Passed pawns are very strong because they can march all the way to promotion! 'A passed pawn must be pushed!' — this is a famous chess saying.",
            tip: "Create a passed pawn in the endgame — it's like having an extra piece that can become a queen!",
            fen: "8/8/8/3p4/3P4/8/8/8 w - - 0 1",
          },
          {
            title: "Weaknesses: Doubled & Isolated Pawns",
            explanation:
              "Doubled pawns are two pawns of the same color on the same file — they're weak because they can't protect each other. Isolated pawns have no friendly pawns on neighboring files — they need pieces to protect them. Avoid creating these weaknesses!",
            tip: "When you capture with a pawn, think about whether it creates doubled or isolated pawns before you take!",
            fen: "8/8/8/8/2PP4/8/8/8 w - - 0 1",
          },
        ],
      },
      {
        id: "strategy-planning",
        title: "How to Make a Plan",
        emoji: "📋",
        badge: "Strategic Thinker",
        description: "What to do when there's no tactic",
        puzzleIds: [],
        concepts: [
          {
            title: "The 3-Step Planning Method",
            explanation:
              "When you can't find a tactic, use this plan: (1) Look at your WORST piece — move it to a better square. (2) Find your opponent's WEAKEST square — attack it. (3) Improve your king's safety if needed. This simple method will make you a stronger player!",
            tip: "Ask yourself: 'Which of my pieces is doing the least? How can I make it more active?'",
            fen: "r1bqr1k1/ppp2ppp/2np1n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQR1K1 w - - 0 1",
          },
          {
            title: "Imbalances",
            explanation:
              "The best chess players look for 'imbalances' — differences between the two positions. Do you have more space? Better piece coordination? A passed pawn? A safer king? Whichever side has the advantage should ATTACK. The side with a disadvantage should play defensively and try to simplify.",
            tip: "If you're winning, simplify the position — trade pieces! If you're losing, keep pieces on the board and create complications.",
            fen: "r1bqr1k1/ppp2ppp/2np1n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQR1K1 w - - 0 1",
          },
        ],
      },
    ],
  },
];
