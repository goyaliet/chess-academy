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
        puzzleIds: [
          "tac2-fork-1", "tac2-fork-2", "tac2-fork-3", "tac2-fork-4", "tac2-fork-5",
          "tac2-fork-6", "tac2-fork-7", "tac2-fork-8", "tac2-fork-9", "tac2-fork-10",
        ],
        concepts: [
          {
            title: "What is a Fork?",
            explanation:
              "A fork is when ONE of your pieces attacks TWO of your opponent's pieces at the same time. Your opponent can only save one piece, so you win the other! This is one of the most exciting tricks in chess.",
            tip: "Always look for squares where your piece can jump to attack two enemy pieces at once.",
            fen: "r3k3/8/8/3N4/8/8/8/4K3 w - - 0 1",
          },
          {
            title: "Knight Forks",
            explanation:
              "Knights are the fork kings! Because knights move in an L-shape, they can attack pieces that can't even see them coming. A knight fork on the king and queen (called a 'family fork') wins the queen for free!",
            tip: "Knights on c7 or f7 are very dangerous — they can fork king and rook at the same time!",
            fen: "r3k3/8/8/3N4/8/8/8/4K3 w - - 0 1",
          },
          {
            title: "Pawn Forks",
            explanation:
              "Even pawns can fork! When a pawn advances and attacks two enemy pieces diagonally, that's a pawn fork. Since pawns are worth the least, you almost always win material when your pawn forks two bigger pieces.",
            tip: "If your pawn can advance to attack two enemy pieces at once, it's almost always a great move!",
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
        puzzleIds: [
          "tac2-pin-1", "tac2-pin-2", "tac2-pin-3", "tac2-pin-4", "tac2-pin-5",
          "tac2-pin-6", "tac2-pin-7", "tac2-pin-8", "tac2-pin-9", "tac2-pin-10",
        ],
        concepts: [
          {
            title: "What is a Pin?",
            explanation:
              "A pin happens when a piece can't move because moving it would expose a more valuable piece (usually the king) to attack. The pinned piece is 'frozen' — it has to stay put! Bishops, rooks, and queens can all create pins.",
            tip: "Look for enemy pieces standing in front of their king — they might be pinnable!",
            fen: "4k3/4r3/8/4Q3/8/8/8/4K3 w - - 0 1",
          },
          {
            title: "Absolute vs Relative Pins",
            explanation:
              "An absolute pin is against the king — the piece literally CANNOT move because moving would leave the king in check (illegal). A relative pin is against a less valuable piece — the pinned piece CAN move but it would lose something important.",
            tip: "An absolutely pinned piece is worth less — attack it with pawns and lesser pieces to win material!",
            fen: "r1bqk2r/pppp1ppp/2n2n2/4p3/1bB1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 4",
          },
          {
            title: "Attacking Pinned Pieces",
            explanation:
              "Once a piece is pinned, you can pile more attackers on it! A pinned piece cannot fight back effectively because it is stuck. Use pawns and less valuable pieces to attack pinned pieces and win material.",
            tip: "Count attackers vs defenders on a pinned piece — if you have more attackers, you win material!",
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
        puzzleIds: [
          "tac2-skewer-1", "tac2-skewer-2", "tac2-skewer-3", "tac2-skewer-4", "tac2-skewer-5",
          "tac2-skewer-6", "tac2-skewer-7", "tac2-skewer-8", "tac2-skewer-9", "tac2-skewer-10",
        ],
        concepts: [
          {
            title: "What is a Skewer?",
            explanation:
              "A skewer is like a pin but reversed! Instead of attacking a small piece in front of a big piece, you attack the BIG piece first (usually the king or queen). The big piece must move, and then you capture the smaller piece hiding behind it.",
            tip: "Look for situations where the enemy king and a valuable piece are lined up on a rank, file, or diagonal.",
            fen: "r7/1k6/8/8/2B5/8/8/7K w - - 0 1",
          },
          {
            title: "Rook and Queen Skewers",
            explanation:
              "Rooks and queens are great at skewering because they attack in straight lines. If the enemy king is on the same rank or file as a valuable piece, slide your rook or queen between them! The king must run, and you take the piece behind it.",
            tip: "Rook on an open file or rank can skewer a king and rook together — look for these opportunities!",
            fen: "4k3/4r3/8/8/8/8/8/4RK2 w - - 0 1",
          },
        ],
      },
      {
        id: "tactics-back-rank",
        title: "Back-Rank Weakness",
        emoji: "🏰",
        badge: "Back-Rank Guardian",
        description: "Checkmate the king trapped on the back rank!",
        puzzleIds: [
          "tac2-back-1", "tac2-back-2", "tac2-back-3", "tac2-back-4", "tac2-back-5",
          "tac2-back-6", "tac2-back-7", "tac2-back-8", "tac2-back-9", "tac2-back-10",
        ],
        concepts: [
          {
            title: "What is a Back-Rank Weakness?",
            explanation:
              "When a king castles and hides behind its pawns, it's usually safe. But if the king has no escape square, a rook or queen can deliver checkmate on the back rank! This is one of the most common ways to lose in chess.",
            tip: "Always make a 'luft' (German for air) — move one pawn (h3 or g3) to give your king an escape square!",
            fen: "6k1/5ppp/6N1/8/8/8/8/4R2K w - - 0 1",
          },
          {
            title: "Back-Rank Combinations",
            explanation:
              "Sometimes you need to sacrifice a piece or use multiple moves to create a back-rank mate. Look for ways to remove the king's defenders, block escape squares, or use discovered attacks to set up the winning rook move.",
            tip: "Before attacking the back rank, check if you need to remove any defending pieces first!",
            fen: "3R2k1/5ppp/8/8/8/8/5PPP/6K1 w - - 0 1",
          },
        ],
      },
      {
        id: "tactics-discovered",
        title: "Discovered Attacks",
        emoji: "💥",
        badge: "Discover Champion",
        description: "Unleash a hidden attacker!",
        puzzleIds: [
          "tac2-disc-1", "tac2-disc-2", "tac2-disc-3", "tac2-disc-4", "tac2-disc-5",
          "tac2-disc-6", "tac2-disc-7", "tac2-disc-8", "tac2-disc-9", "tac2-disc-10",
        ],
        concepts: [
          {
            title: "What is a Discovered Attack?",
            explanation:
              "A discovered attack happens when you move one piece and it REVEALS an attack from a piece hiding behind it. It's like opening a door to let a giant through! The piece that moves can also make a threat, creating two threats at once.",
            tip: "Look for pieces lined up on a rank, file, or diagonal — moving the front piece can reveal a hidden attack!",
            fen: "r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 7",
          },
          {
            title: "Discovered Check",
            explanation:
              "A discovered check is a discovered attack on the enemy king — one of the most powerful moves in chess! The moving piece can go ANYWHERE (capture, make a threat, go to safety) because the discovered check forces the king to deal with the check first.",
            tip: "Discovered checks are so strong because the moving piece can do anything — even capture a piece — while delivering check!",
            fen: "r1bqk2r/ppp2ppp/2n2n2/3pp3/3PP3/2N2N2/PPP1BPPP/R1BQK2R w KQkq - 0 5",
          },
        ],
      },
      {
        id: "tactics-double-check",
        title: "Double Check",
        emoji: "⚡",
        badge: "Double Check Expert",
        description: "Check with TWO pieces at once — unstoppable!",
        puzzleIds: [
          "tac2-dbl-1", "tac2-dbl-2", "tac2-dbl-3", "tac2-dbl-4", "tac2-dbl-5",
          "tac2-dbl-6", "tac2-dbl-7", "tac2-dbl-8", "tac2-dbl-9", "tac2-dbl-10",
        ],
        concepts: [
          {
            title: "What is Double Check?",
            explanation:
              "A double check is when TWO of your pieces check the king simultaneously. It's the most powerful move in chess because you can't block two checks at once — the only way to escape is to MOVE THE KING! Use double check to force the king into a mating net.",
            tip: "Double check can only be answered by moving the king — use it when you need to force the king somewhere specific!",
            fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 4",
          },
          {
            title: "Delivering Double Check",
            explanation:
              "To give a double check, move a piece so that it ITSELF gives check, AND it also uncovers a check from another piece behind it. Knights are especially good at this because they jump over pieces and can uncover a discovered check while also checking the king directly.",
            tip: "A double check + mate combination wins the game instantly — always look for these explosive moves!",
            fen: "r1bqk2r/pppp1Bpp/2n2n2/4p3/2B1P3/2N5/PPPP1pPP/R1BbK2R w KQkq - 0 7",
          },
        ],
      },
      {
        id: "tactics-deflection",
        title: "Deflection",
        emoji: "🎣",
        badge: "Deflection Pro",
        description: "Lure the defender away from its post!",
        puzzleIds: [
          "tac2-defl-1", "tac2-defl-2", "tac2-defl-3", "tac2-defl-4", "tac2-defl-5",
          "tac2-defl-6", "tac2-defl-7", "tac2-defl-8", "tac2-defl-9", "tac2-defl-10",
        ],
        concepts: [
          {
            title: "What is Deflection?",
            explanation:
              "Deflection means forcing an important defender to move away from the square or piece it is protecting. Often you sacrifice a piece to pull the defender away, then win big on the next move. It's like distracting a guard so you can sneak past!",
            tip: "Ask yourself: which enemy piece is defending the most important square? Can you force it away?",
            fen: "r4rk1/pp3ppp/2p5/8/3Pn3/2PB4/PP4PP/R4RK1 b - - 0 1",
          },
          {
            title: "Overloaded Defenders",
            explanation:
              "An overloaded piece is one that is defending TOO MANY things at once. If a rook must guard both the back rank and a piece on the 7th rank, it can't do both! Attack one target to pull the rook away, then win the other target.",
            tip: "When a piece is overloaded, capture one of the things it defends — the piece can't take back without losing the other!",
            fen: "6k1/pp3ppp/8/8/8/8/PP3PPP/R5K1 w - - 0 1",
          },
        ],
      },
      {
        id: "tactics-decoy",
        title: "Decoy & Attraction",
        emoji: "🎯",
        badge: "Decoy Master",
        description: "Drag the enemy king into a trap!",
        puzzleIds: [
          "tac2-decoy-1", "tac2-decoy-2", "tac2-decoy-3", "tac2-decoy-4", "tac2-decoy-5",
          "tac2-decoy-6", "tac2-decoy-7", "tac2-decoy-8", "tac2-decoy-9", "tac2-decoy-10",
        ],
        concepts: [
          {
            title: "What is a Decoy?",
            explanation:
              "A decoy (also called attraction) forces an enemy piece ONTO a square where it can be captured or where it becomes a problem. Unlike deflection (pushing a piece away), decoy PULLS a piece to a specific square — usually by offering a sacrifice the opponent cannot refuse.",
            tip: "Sacrifice a piece to pull the enemy king or queen to a square where your other pieces can attack it!",
            fen: "k7/2Q5/1K6/8/8/8/8/8 w - - 0 1",
          },
          {
            title: "Attraction Sacrifices",
            explanation:
              "An attraction sacrifice gives up material on purpose to drag the enemy king to a specific square. Often the king is attracted onto a square where it gets forked, skewered, or mated. The more valuable the piece you attract, the better the follow-up must be!",
            tip: "After your sacrifice, always have a clear follow-up move — the attraction only works if there's a winning continuation!",
            fen: "r3k3/8/8/3N4/8/8/8/4K3 w - - 0 1",
          },
        ],
      },
      {
        id: "tactics-remove-defender",
        title: "Removing the Defender",
        emoji: "🛡️",
        badge: "Defender Destroyer",
        description: "Eliminate the piece guarding your target!",
        puzzleIds: [
          "tac2-rem-1", "tac2-rem-2", "tac2-rem-3", "tac2-rem-4", "tac2-rem-5",
          "tac2-rem-6", "tac2-rem-7", "tac2-rem-8", "tac2-rem-9", "tac2-rem-10",
        ],
        concepts: [
          {
            title: "Removing the Defender",
            explanation:
              "If an important square or piece is defended, you can capture or chase away the defender. Once the defender is gone, your target is vulnerable! This is one of the most important tactical ideas — before you attack, clear the way.",
            tip: "Before launching an attack, ask: what piece is guarding my target? Can I capture it or force it away?",
            fen: "6k1/5ppp/6N1/8/8/8/8/4R2K w - - 0 1",
          },
          {
            title: "Capture or Chase",
            explanation:
              "You can remove a defender by CAPTURING it (even as a sacrifice), or by CHASING it away with a threat. For example, attacking a bishop that defends a key square with a pawn can force it to retreat, opening up your attack.",
            tip: "Sometimes sacrificing a piece to remove a key defender is worth it — count the material carefully first!",
            fen: "r1bqk2r/pppp1ppp/2n2n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 4",
          },
        ],
      },
      {
        id: "tactics-zwischenzug",
        title: "Zwischenzug (In-Between Move)",
        emoji: "↔️",
        badge: "Zwischenzug Expert",
        description: "Play a surprise move before the expected recapture!",
        puzzleIds: [
          "tac2-zwi-1", "tac2-zwi-2", "tac2-zwi-3", "tac2-zwi-4", "tac2-zwi-5",
          "tac2-zwi-6", "tac2-zwi-7", "tac2-zwi-8", "tac2-zwi-9", "tac2-zwi-10",
        ],
        concepts: [
          {
            title: "What is Zwischenzug?",
            explanation:
              "Zwischenzug (pronounced 'TSVI-shen-tsoog') is a German word meaning 'in-between move.' Instead of doing what your opponent expects (like recapturing), you play a STRONGER move first! This surprises your opponent and often wins extra material or checkmate.",
            tip: "Before you recapture, always ask: is there an even better move I can play first?",
            fen: "r1bq1rk1/pp3ppp/2pb4/3Pp3/4n3/2N2N2/PPP2PPP/R1BQR1K1 w - - 0 1",
          },
          {
            title: "Spotting In-Between Moves",
            explanation:
              "In-between moves are usually checks, captures of more valuable pieces, or moves that create unstoppable threats. The key is to NOT follow the expected sequence — look for something better before recapturing. This can turn a losing or equal position into a win!",
            tip: "Always check for checks, captures, and threats before making your 'obvious' move. The best move might be a surprise!",
            fen: "r1bqr1k1/pp3ppp/2pb4/3Pp3/4n3/2N2N2/PPP2PPP/R1BQR1K1 w - - 0 1",
          },
        ],
      },
      {
        id: "tactics-queen-mate",
        title: "Queen Checkmates",
        emoji: "♛",
        badge: "Queen of Checkmate",
        description: "Deliver checkmate with the most powerful piece!",
        puzzleIds: [
          "tac2-qmate-1", "tac2-qmate-2", "tac2-qmate-3", "tac2-qmate-4", "tac2-qmate-5",
          "tac2-qmate-6", "tac2-qmate-7", "tac2-qmate-8", "tac2-qmate-9", "tac2-qmate-10",
        ],
        concepts: [
          {
            title: "Queen Checkmate Patterns",
            explanation:
              "The queen is the most powerful piece and can deliver checkmate in many ways! Together with the king, the queen can force the enemy king to the edge of the board and deliver mate. The queen can also team up with rooks, bishops, and knights for beautiful checkmates.",
            tip: "Always use your king to help the queen — the queen alone can't deliver checkmate without the king's support!",
            fen: "k7/2Q5/1K6/8/8/8/8/8 w - - 0 1",
          },
          {
            title: "Edge-of-Board Checkmates",
            explanation:
              "The enemy king is most vulnerable on the edge of the board because it has fewer squares to escape to. Push the enemy king to the side or corner using your queen, then deliver checkmate with your queen while your king covers the remaining escape squares.",
            tip: "The queen boxes in the king, the king covers escape squares — teamwork delivers checkmate!",
            fen: "7k/5K2/6Q1/8/8/8/8/8 w - - 0 1",
          },
          {
            title: "Queen + Knight Mates",
            explanation:
              "The queen and knight work wonderfully together because the knight attacks squares the queen cannot! The knight's L-shape movement can cover the corners and give checkmate when the queen controls lines and diagonals. Look for smothered-style finishes!",
            tip: "Queen and knight together can deliver checkmate even with fewer total pieces — they complement each other perfectly!",
            fen: "5k2/5N2/4K3/8/8/8/8/4Q3 w - - 0 1",
          },
        ],
      },
      {
        id: "tactics-rook-mate",
        title: "Rook Checkmates",
        emoji: "♜",
        badge: "Rook Mate Champion",
        description: "Use the rook's power on ranks and files!",
        puzzleIds: [
          "tac2-rmate-1", "tac2-rmate-2", "tac2-rmate-3", "tac2-rmate-4", "tac2-rmate-5",
          "tac2-rmate-6", "tac2-rmate-7", "tac2-rmate-8", "tac2-rmate-9", "tac2-rmate-10",
        ],
        concepts: [
          {
            title: "Back-Rank Rook Checkmate",
            explanation:
              "When the enemy king is castled and has no escape square, a rook on the back rank delivers checkmate. This is called a back-rank mate. The king's own pawns act as a prison! Always remember to make a breathing square (h3, g3, or h6, g6) for your king.",
            tip: "If you can land your rook on the 8th rank (or 1st rank) with the enemy king trapped, it's often checkmate!",
            fen: "6k1/5ppp/6N1/8/8/8/8/4R2K w - - 0 1",
          },
          {
            title: "Lawnmower Checkmate",
            explanation:
              "Two rooks (or a rook and queen) can 'mow' across the board rank by rank, cutting off the king until it runs out of space. One rook cuts off escape while the other delivers check, pushing the king back until it hits the edge and gets mated.",
            tip: "Two rooks on adjacent ranks push the king back like a lawn mower — very powerful in the endgame!",
            fen: "k7/8/KR6/8/8/8/8/8 w - - 0 1",
          },
          {
            title: "Rook + King Checkmate",
            explanation:
              "With just one rook and king versus a lone king, you can force checkmate. Use the rook to cut the enemy king off on one file, then march your king toward it. The enemy king gets pushed to the edge and mate follows with the rook on the back rank.",
            tip: "In a rook endgame, remember: your king must HELP the rook deliver checkmate. King + Rook teamwork wins!",
            fen: "1k6/8/1K6/R7/8/8/8/8 w - - 0 1",
          },
        ],
      },
      {
        id: "tactics-smothered",
        title: "Smothered Mate",
        emoji: "🤏",
        badge: "Smothered Mate Master",
        description: "The knight suffocates the king with its own pieces!",
        puzzleIds: [
          "tac2-smth-1", "tac2-smth-2", "tac2-smth-3", "tac2-smth-4", "tac2-smth-5",
          "tac2-smth-6", "tac2-smth-7", "tac2-smth-8", "tac2-smth-9", "tac2-smth-10",
        ],
        concepts: [
          {
            title: "What is Smothered Mate?",
            explanation:
              "Smothered mate is a beautiful checkmate where a KNIGHT delivers the final blow to a king that is surrounded by its own pieces! The king is smothered — it cannot escape because its own pieces block every escape square. A knight in the corner can deliver this stunning finish.",
            tip: "Look for a king with all nearby squares blocked by its own pieces — a knight can deliver smothered mate there!",
            fen: "6rk/6pp/8/8/8/8/6N1/7K w - - 0 1",
          },
          {
            title: "The Classic Smothered Mate Pattern",
            explanation:
              "The most famous smothered mate sequence involves giving a queen sacrifice! You offer the queen for the rook, forcing the king into the corner where it is surrounded by its own pieces. Then the knight delivers checkmate. It is one of the most beautiful combinations in chess!",
            tip: "The classic smothered mate: queen sacrifice to force the king to the corner, then knight checkmate on g8 or h7!",
            fen: "6rk/5Npp/8/8/8/8/8/6K1 w - - 0 1",
          },
        ],
      },
      {
        id: "tactics-xray",
        title: "X-Ray Attacks",
        emoji: "☢️",
        badge: "X-Ray Vision",
        description: "Attack through enemy pieces!",
        puzzleIds: [
          "tac2-xray-1", "tac2-xray-2", "tac2-xray-3", "tac2-xray-4", "tac2-xray-5",
          "tac2-xray-6", "tac2-xray-7", "tac2-xray-8", "tac2-xray-9", "tac2-xray-10",
        ],
        concepts: [
          {
            title: "What is an X-Ray Attack?",
            explanation:
              "An X-ray attack (also called an X-ray defense) happens when a piece attacks or defends THROUGH another piece. For example, if your rook is on e1 and an enemy rook is on e5 with your other rook behind it on e8, your rook on e1 indirectly defends e8 through the enemy piece!",
            tip: "Think about pieces 'seeing through' other pieces on the same line — this creates hidden attacks and defenses!",
            fen: "4r2k/8/8/8/8/8/8/4R2K w - - 0 1",
          },
          {
            title: "X-Ray in Practice",
            explanation:
              "X-ray attacks most often occur with rooks, bishops, and queens on open lines. If you move a piece off a line and your other piece behind it 'shines through' to attack something, that's the x-ray working! Understanding x-rays helps you spot threats your opponent might miss.",
            tip: "When pieces are lined up, removing one can reveal an x-ray attack from the piece behind. Always check for these hidden threats!",
            fen: "k7/2r5/8/2R5/8/8/2R5/K7 w - - 0 1",
          },
        ],
      },
      {
        id: "tactics-stalemate-trap",
        title: "Stalemate Traps",
        emoji: "🕳️",
        badge: "Stalemate Savior",
        description: "Turn certain defeat into a draw!",
        puzzleIds: [
          "tac2-stale-1", "tac2-stale-2", "tac2-stale-3", "tac2-stale-4", "tac2-stale-5",
          "tac2-stale-6", "tac2-stale-7", "tac2-stale-8", "tac2-stale-9", "tac2-stale-10",
        ],
        concepts: [
          {
            title: "What is Stalemate?",
            explanation:
              "Stalemate happens when a player has NO legal moves but their king is NOT in check. It's a DRAW — not a win for the player with more pieces! Stalemate is the losing player's best friend. If you're losing, try to reach stalemate. If you're winning, avoid it!",
            tip: "When you're about to lose, try to sacrifice all your pieces — if only your king is left with no legal moves, it's stalemate and a draw!",
            fen: "7k/8/6QK/8/8/8/8/8 b - - 0 1",
          },
          {
            title: "Creating Stalemate",
            explanation:
              "When losing badly, look for ways to give all your pieces away or create positions where your king has no moves but isn't in check. Great players use this trick to escape lost endgames. The key is removing all your pawns or sacrificing pieces so only the stalemated king remains.",
            tip: "In a losing endgame, sacrifice your pieces to leave your king with no moves — it might just save the draw!",
            fen: "8/8/8/8/k7/p7/P7/K7 w - - 0 1",
          },
          {
            title: "Avoiding Stalemate When Winning",
            explanation:
              "When you are winning with a big advantage, you must be careful NOT to stalemate your opponent! Always make sure the enemy king has at least one legal move before delivering your 'final' move. Leave an escape square or the game might end in a draw instead of a win.",
            tip: "Before delivering 'checkmate', check that the king actually has moves but is in check — if it has no moves but isn't in check, it's stalemate!",
            fen: "8/8/8/8/8/k7/8/KQ6 w - - 0 1",
          },
        ],
      },
      {
        id: "tactics-arabian",
        title: "Arabian Mate",
        emoji: "🌙",
        badge: "Arabian Mate Expert",
        description: "Rook and knight deliver checkmate in style!",
        puzzleIds: [
          "tac2-arab-1", "tac2-arab-2", "tac2-arab-3", "tac2-arab-4", "tac2-arab-5",
          "tac2-arab-6", "tac2-arab-7", "tac2-arab-8", "tac2-arab-9", "tac2-arab-10",
        ],
        concepts: [
          {
            title: "What is Arabian Mate?",
            explanation:
              "Arabian Mate is a beautiful checkmate pattern using a rook and knight together. The king is trapped in a corner, the rook delivers check on the rank or file, and the knight covers all the king's escape squares. This pattern is hundreds of years old and still surprises players today!",
            tip: "For Arabian Mate, place the rook on the file or rank next to the cornered king, and the knight covering the squares the rook doesn't!",
            fen: "7k/5R2/6N1/8/8/8/8/7K w - - 0 1",
          },
          {
            title: "Setting Up Arabian Mate",
            explanation:
              "To set up Arabian Mate, you need to drive the enemy king to the corner (h8 or a8 typically), then coordinate your rook and knight. The rook goes to the 7th or 8th rank to deliver check, while the knight is placed so it covers the king's remaining escape squares.",
            tip: "Practice getting your rook to g7 or f7 and your knight to f6 — that sets up Arabian Mate on h8!",
            fen: "7k/6R1/5N2/8/8/8/8/7K w - - 0 1",
          },
        ],
      },
      {
        id: "tactics-bodens",
        title: "Boden's Mate",
        emoji: "✝️",
        badge: "Boden's Expert",
        description: "Two bishops deliver a deadly cross-fire checkmate!",
        puzzleIds: [
          "tac2-boden-1", "tac2-boden-2", "tac2-boden-3", "tac2-boden-4", "tac2-boden-5",
          "tac2-boden-6", "tac2-boden-7", "tac2-boden-8", "tac2-boden-9", "tac2-boden-10",
        ],
        concepts: [
          {
            title: "What is Boden's Mate?",
            explanation:
              "Boden's Mate is when two bishops work together to deliver checkmate on an open board. The king is trapped by its own pieces and the two bishops attack from crossing diagonals, creating an unstoppable cross-fire. It often appears after castling queenside when the king has not moved its bishop pawns.",
            tip: "Boden's Mate needs two bishops on crossing diagonals and a king trapped by its own pieces — look for this pattern after queenside castling!",
            fen: "2kr3r/ppp2ppp/2n5/8/8/8/PPP2PPP/2KR1B1R w - - 0 1",
          },
          {
            title: "The Classic Boden Setup",
            explanation:
              "In the classic Boden's Mate, the enemy king is on c8 (after queenside castling) with pieces blocking its escape. One bishop sacrifices to open the diagonal, and the other bishop delivers check. The king cannot escape because its own pieces trap it from all sides.",
            tip: "In the Boden pattern, one bishop takes a piece to open lines, then the other bishop delivers the final checkmate!",
            fen: "2k5/ppp2ppp/8/8/6B1/8/PPP2PPP/2K4B w - - 0 1",
          },
        ],
      },
      {
        id: "tactics-windmill",
        title: "Windmill Tactic",
        emoji: "🌀",
        badge: "Windmill Wizard",
        description: "Spin like a windmill to win piece after piece!",
        puzzleIds: [
          "tac2-wind-1", "tac2-wind-2", "tac2-wind-3", "tac2-wind-4", "tac2-wind-5",
          "tac2-wind-6", "tac2-wind-7", "tac2-wind-8", "tac2-wind-9", "tac2-wind-10",
        ],
        concepts: [
          {
            title: "What is the Windmill?",
            explanation:
              "The windmill is one of the most spectacular tactics in chess! It uses a rook (or queen) and a bishop (or knight) to give a series of discovered checks, winning a piece on each turn. The pattern keeps repeating like a windmill spinning — check, take a piece, check, take a piece, over and over!",
            tip: "The windmill uses discovered check — move one piece to take something, it reveals a check, then the other piece comes back and checks again!",
            fen: "r2qr1k1/ppp2ppp/2n5/3p4/3P4/2N2N2/PPP2PPP/R2QR1K1 w - - 0 1",
          },
          {
            title: "Setting Up the Windmill",
            explanation:
              "To execute a windmill, you need two attacking pieces lined up so moving one gives discovered check with the other. The piece that moves keeps taking enemy material while the stationary piece keeps giving check. Famous games by Reti and Torre showed windmills winning many pieces in a row!",
            tip: "Look for a bishop or rook behind your knight or another piece — if you can set up discovered checks, the windmill can win lots of material!",
            fen: "r2q1rk1/ppp2ppp/2n5/3p4/3P4/2N5/PPP2PPP/R2Q1RK1 w - - 0 1",
          },
        ],
      },
      {
        id: "tactics-zugzwang",
        title: "Zugzwang",
        emoji: "😰",
        badge: "Zugzwang Master",
        description: "Every move makes your position WORSE!",
        puzzleIds: [
          "tac2-zug-1", "tac2-zug-2", "tac2-zug-3", "tac2-zug-4", "tac2-zug-5",
          "tac2-zug-6", "tac2-zug-7", "tac2-zug-8", "tac2-zug-9", "tac2-zug-10",
        ],
        concepts: [
          {
            title: "What is Zugzwang?",
            explanation:
              "Zugzwang (German for 'compulsion to move') is when any move you make HURTS you! If you could skip your turn, you would hold the position — but in chess you MUST move. Zugzwang most often happens in the endgame when kings and pawns are fighting and every move loses.",
            tip: "In zugzwang, the player who has to move LOSES. Use this to your advantage in king and pawn endgames!",
            fen: "8/8/8/3k4/3P4/3K4/8/8 b - - 0 1",
          },
          {
            title: "Creating Zugzwang",
            explanation:
              "To put your opponent in zugzwang, you need to reach a position where ALL their moves weaken their position. In pawn endgames, you can use triangulation (moving your king in a triangle) to 'waste a move' and give your opponent the move at the critical moment.",
            tip: "Triangulation means moving your king in a 3-square triangle to transfer the move to your opponent — a powerful zugzwang technique!",
            fen: "8/8/8/8/3k4/8/3P4/3K4 w - - 0 1",
          },
        ],
      },
      {
        id: "tactics-combination",
        title: "Tactical Combinations",
        emoji: "🔗",
        badge: "Combination Artist",
        description: "Chain multiple tactics together for the win!",
        puzzleIds: [
          "tac2-combo-1", "tac2-combo-2", "tac2-combo-3", "tac2-combo-4", "tac2-combo-5",
          "tac2-combo-6", "tac2-combo-7", "tac2-combo-8", "tac2-combo-9", "tac2-combo-10",
        ],
        concepts: [
          {
            title: "What is a Tactical Combination?",
            explanation:
              "A tactical combination chains multiple tactical ideas together — fork, then pin, then checkmate! Real chess games are won by combining the tactics you've learned. The best combinations often start with a surprising sacrifice to open lines or remove defenders.",
            tip: "Look for forcing moves (checks, captures, threats) and ask after each one: what does my opponent HAVE to do? Then plan what comes next!",
            fen: "r1bqk2r/pppp1ppp/2n2n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 4",
          },
          {
            title: "Forcing Sequences",
            explanation:
              "A combination works because every move is FORCING — checks, captures, and threats that leave your opponent with only one or two replies. When you calculate, follow the forcing moves first. If your sequence is forced all the way to a win, you have found a combination!",
            tip: "Calculate in order: checks first, then captures, then threats. Forced moves show you the combination!",
            fen: "r2qr1k1/ppp2ppp/2np1n2/4p3/2B1P3/2N2N2/PPP2PPP/R1BQ1RK1 w - - 0 1",
          },
          {
            title: "Sacrifices Start Combinations",
            explanation:
              "The most beautiful combinations begin with a sacrifice that seems to give away material. But the sacrifice forces the opponent's pieces onto bad squares or opens lines for a devastating attack. Great chess players see these sacrifices and trust their calculation!",
            tip: "Don't be afraid to calculate a sacrifice — if all your opponent's responses lead to a win for you, the sacrifice is correct!",
            fen: "r1b1k2r/ppppqppp/2n2n2/4p3/2B1P3/2N2N2/PPPPQPPP/R1B1K2R w KQkq - 4 5",
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
        puzzleIds: [],
        concepts: [
          {
            title: "Rule 1: Control the Center",
            explanation:
              "The center (e4, d4, e5, d5) is the most important area of the board. Pieces in the center control the most squares. Start by moving your center pawns (e-pawn and d-pawn) to claim space. Whoever controls the center usually controls the game.",
            tip: "Play 1.e4 or 1.d4 as White to grab the center immediately!",
            fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          },
          {
            title: "Rule 2: Develop Your Pieces",
            explanation:
              "Develop means moving your knights and bishops from their starting squares to active positions in the first few moves. Don't move the same piece twice in the opening and don't move your queen out too early — get all your pieces into the game first.",
            tip: "Knights before bishops is the classic guideline. Aim to develop all pieces before move 10!",
            fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 2",
          },
          {
            title: "Rule 3: Castle Your King",
            explanation:
              "Castling moves the king to safety behind a wall of pawns and connects your rooks. Try to castle within the first 10 moves. A king stuck in the center is a sitting target — your opponent can open files and launch a deadly attack.",
            tip: "Castle kingside (O-O) more often than queenside — it's usually quicker and safer!",
            fen: "rnbqk2r/pppp1ppp/5n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
          },
        ],
      },
      {
        id: "openings-italian",
        title: "Italian Game",
        emoji: "🇮🇹",
        badge: "Italian Master",
        description: "One of the oldest and most powerful 1.e4 openings",
        puzzleIds: [],
        concepts: [
          {
            title: "The Italian Setup: 1.e4 e5 2.Nf3 Nc6 3.Bc4",
            explanation:
              "White places the bishop on c4, aimed directly at Black's weak f7 square (only protected by the king). This is a principled opening — it controls the center, develops pieces, and prepares to castle. It has been played for over 500 years and is still dangerous at any level.",
            tip: "With Bc4, always watch for the Scholar's Mate threat: Qh5 and Qxf7# if Black isn't careful!",
            fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
          },
          {
            title: "Giuoco Piano: The Quiet Game",
            explanation:
              "After 3...Bc5, both sides have developed bishops to active squares. White plays c3 and d4 to build a strong center. This leads to rich, tactical middlegames where both sides fight hard for control. 'Giuoco Piano' means 'quiet game' in Italian — but it is anything but quiet!",
            tip: "In the Giuoco Piano, c3 followed by d4 is White's plan. Play it to grab the center before Black can stabilize.",
            fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
          },
          {
            title: "Two Knights Defense",
            explanation:
              "If Black plays 3...Nf6 instead of Bc5, it is the Two Knights Defense. Black fights back immediately and dares White to attack with Ng5 targeting f7. The resulting positions are sharp and complex — perfect for players who love tactical battles.",
            tip: "After 3...Nf6 4.Ng5 d5 5.exd5 Na5, White must retreat the bishop or accept complications. Know your theory before entering this line!",
            fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
          },
        ],
      },
      {
        id: "openings-ruy",
        title: "Ruy Lopez",
        emoji: "🏰",
        badge: "Ruy Lopez Expert",
        description: "The most respected 1.e4 opening — played at the highest level",
        puzzleIds: [],
        concepts: [
          {
            title: "The Pin: 1.e4 e5 2.Nf3 Nc6 3.Bb5",
            explanation:
              "The Ruy Lopez (Spanish Game) puts the bishop on b5, indirectly attacking Black's e5 pawn by threatening to capture the knight that defends it. It is one of the most deeply studied openings in chess history and remains popular from beginners to world champions.",
            tip: "The bishop on b5 doesn't win the e5 pawn immediately — it just puts pressure. The threat is always more powerful than the execution!",
            fen: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
          },
          {
            title: "Closed Ruy Lopez: Slow and Positional",
            explanation:
              "After 3...a6 4.Ba4 Nf6 5.O-O Be7 6.Re1, White builds up slowly with d4 and c3, aiming for a central advantage. Black defends patiently with ...b5, ...d6, and ...O-O. This is a marathon, not a sprint — White slowly improves all pieces while maintaining pressure.",
            tip: "In the Closed Ruy, castle early and play h3 before d4 to prevent ...Bg4 pins. Patience wins in this system!",
            fen: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
          },
          {
            title: "Exchange Ruy Lopez: Simplified",
            explanation:
              "After 3...a6 4.Bxc6 dxc6, White trades the bishop for the knight. This gives Black doubled pawns but the two bishops. The endgames are slightly favorable for White due to Black's pawn weaknesses. It is a solid, reliable choice when you want to simplify.",
            tip: "In the Exchange Ruy, trade pieces and head for the endgame — White's better pawn structure gives a small but lasting advantage.",
            fen: "r1bqkbnr/1ppp1ppp/p1n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4",
          },
        ],
      },
      {
        id: "openings-sicilian",
        title: "Sicilian Defense",
        emoji: "🛡️",
        badge: "Sicilian Defender",
        description: "Black's most ambitious and popular reply to 1.e4",
        puzzleIds: [],
        concepts: [
          {
            title: "Why 1...c5? The Asymmetry Principle",
            explanation:
              "The Sicilian (1.e4 c5) is the most popular reply to 1.e4. Instead of mirroring White with e5, Black fights for the center differently — c5 attacks the d4 square without giving White a symmetrical position. This creates unbalanced play where Black can fight for a win rather than just a draw.",
            tip: "Play the Sicilian when you want to win as Black! Its asymmetry means both sides can play for the full point.",
            fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
          },
          {
            title: "Sicilian Najdorf: 5...a6",
            explanation:
              "After 1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3, Black plays 5...a6. This flexible move prevents Nb5 and Bb5+, keeping all options open. The Najdorf is Bobby Fischer's and Garry Kasparov's favorite — the most popular Sicilian variation in elite chess.",
            tip: "a6 is flexible — it stops Nb5 and Bb5+, and prepares ...b5 for queenside counterplay. Always a good move in the Najdorf!",
            fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
          },
          {
            title: "Sicilian Dragon: The Fianchetto",
            explanation:
              "In the Dragon, Black plays ...g6 and ...Bg7, creating a powerful fianchettoed bishop that 'breathes fire' along the long diagonal. Black castles kingside and launches counterplay with ...Rc8 and ...Nc6. The Yugoslav Attack (White castles queenside) leads to one of the most explosive positions in chess.",
            tip: "The Dragon bishop on g7 is Black's secret weapon. Activate it and use the long diagonal to pressure White's queenside!",
            fen: "rnbqkb1r/pp1ppp1p/5np1/2p5/3PP3/2N5/PPP2PPP/R1BQKBNR w KQkq - 0 4",
          },
        ],
      },
      {
        id: "openings-queens-gambit",
        title: "Queen's Gambit",
        emoji: "♛",
        badge: "Queen's Gambit Expert",
        description: "White's most classical d4 opening — a pawn offer for center control",
        puzzleIds: [],
        concepts: [
          {
            title: "1.d4 d5 2.c4 — The Offer",
            explanation:
              "The Queen's Gambit offers the c4 pawn to lure Black's d5 pawn away from the center. If Black takes (Queen's Gambit Accepted), White plays e4 and establishes a big center. If Black declines, White still has a space advantage. It is one of the oldest and most respected openings.",
            tip: "White is not really gambling — the c4 pawn can almost always be recaptured. The gambit is really about center control!",
            fen: "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 2",
          },
          {
            title: "Queen's Gambit Declined: Solid Defense",
            explanation:
              "After 2...e6, Black declines the pawn and focuses on solid development. The main line goes 3.Nc3 Nf6 4.Bg5 Be7. Black's position is solid but somewhat passive — the light-squared bishop is often called 'the bad bishop' because it is locked behind its own pawns.",
            tip: "In the QGD, Black must solve the problem of the light-squared bishop. Play ...dxc4 or ...c5 to free it eventually!",
            fen: "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 2",
          },
          {
            title: "Queen's Gambit Accepted: Free Development",
            explanation:
              "After 2...dxc4, Black accepts the pawn. White cannot keep the pawn but gains a free hand in the center with e4. Black uses the extra tempo to develop quickly with ...Nf6, ...e6, ...c5. The resulting positions are dynamic and equal if Black plays accurately.",
            tip: "In the QGA, Black gives back the c4 pawn quickly and fights for active piece play. Don't try to hold onto the extra pawn — develop instead!",
            fen: "rnbqkbnr/ppp1pppp/8/8/2pPP3/8/PP3PPP/RNBQKBNR b KQkq - 0 3",
          },
        ],
      },
      {
        id: "openings-london",
        title: "London System",
        emoji: "🏙️",
        badge: "London System Expert",
        description: "A solid, reliable system for White — easy to learn, hard to beat",
        puzzleIds: [],
        concepts: [
          {
            title: "The London Setup: d4, Nf3, Bf4",
            explanation:
              "The London System builds a solid structure with d4, Nf3, and Bf4, followed by e3 and Be2. It works against almost any Black setup and requires little theory. The bishop must come out BEFORE e3 — otherwise it gets locked behind its own pawns forever.",
            tip: "Always play Bf4 BEFORE e3 in the London. Once you play e3 first, the bishop is imprisoned for the rest of the game!",
            fen: "rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/5N2/PPP1PPPP/RN1QKB1R b KQkq - 3 3",
          },
          {
            title: "London Middlegame Plans",
            explanation:
              "After completing development with Be2 (or Bd3) and O-O, White has several plans: Nbd2-e5 to occupy the strong e5 outpost, c3 and Bd3 to build a battery, or the Ne5 + f4 kingside advance. The London is deceptively dangerous because White's setup is always the same but the plan adapts.",
            tip: "In the London, Ne5 is your best friend. A knight on e5 controls d7, f7, g6, c6 — an outpost that is extremely hard for Black to challenge!",
            fen: "rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/5N2/PPP1PPPP/RN1QKB1R b KQkq - 3 3",
          },
          {
            title: "London vs King's Indian",
            explanation:
              "When Black plays ...Nf6, ...g6, and ...Bg7 (King's Indian setup), the London remains solid. White continues the same plan: Bf4, e3, Be2, O-O, and h3 to prevent ...Ng4. Black's fianchettoed bishop and White's bishop on f4 often clash in interesting ways.",
            tip: "Against the King's Indian setup, play h3 before or after Nbd2 to prevent ...Ng4 harassing your bishop. Solid play wins in the long run!",
            fen: "rnbqk2r/ppppppbp/5np1/8/3P1B2/5N2/PPP1PPPP/RN1QKB1R w KQkq - 2 4",
          },
        ],
      },
      {
        id: "openings-french",
        title: "French Defense",
        emoji: "🥐",
        badge: "French Defense Expert",
        description: "Black builds a solid fortress and counterattacks the center",
        puzzleIds: [],
        concepts: [
          {
            title: "1.e4 e6 — The French Idea",
            explanation:
              "In the French Defense, Black plays 1...e6 preparing ...d5 to challenge White's center. The idea is to allow White to build a center with e4+d4, then attack it. The trade-off is that Black's light-squared bishop on c8 often becomes passive — the main challenge of the French.",
            tip: "In the French, always look to free your light-squared bishop. Play ...c5 or ...f6 to open lines for it!",
            fen: "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
          },
          {
            title: "Advance Variation: e5 Grabs Space",
            explanation:
              "After 1.e4 e6 2.d4 d5 3.e5, White grabs space and restricts Black's pieces. Black fights back with ...c5, attacking the d4 pawn. The pawn chain (White: e5-d4, Black: e6-d5) defines the position. White attacks on the kingside; Black counterattacks on the queenside.",
            tip: "In the Advance, White must watch the queenside. Black's ...c5-cxd4 and ...Nc6 can quickly undermine the whole center!",
            fen: "rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 0 4",
          },
          {
            title: "Exchange Variation: Symmetrical Simplicity",
            explanation:
              "After 3.exd5 exd5, the pawns are exchanged and the position is symmetrical. White has no pawn center advantage but can develop freely. The resulting positions are often slightly better for White due to the initiative. A good choice when you want a quiet, technical game.",
            tip: "In the French Exchange, develop quickly and put rooks on the open e-file. White gets a small but lasting positional edge with accurate play.",
            fen: "rnbqkbnr/ppp2ppp/8/3p4/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 0 4",
          },
        ],
      },
      {
        id: "openings-caro",
        title: "Caro-Kann Defense",
        emoji: "🛡️",
        badge: "Caro-Kann Expert",
        description: "A solid alternative to 1...e5 — develop the bishop before closing the center",
        puzzleIds: [],
        concepts: [
          {
            title: "1.e4 c6 — The Caro-Kann Idea",
            explanation:
              "The Caro-Kann prepares ...d5 with c6 support, creating a very solid center. Unlike the French, Black's light-squared bishop can come out BEFORE playing ...e6. This is the key advantage — the bishop develops to f5 or g4 naturally, avoiding the 'bad bishop' problem.",
            tip: "The Caro-Kann's main strength is the active bishop. Get it to f5 or g4 BEFORE closing the center with ...e6!",
            fen: "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
          },
          {
            title: "Classical Caro-Kann: 4...Bf5",
            explanation:
              "After 1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4, Black develops the bishop to f5 — the hallmark of the Classical variation. White often plays Ng3 to chase the bishop, then h4-h5 to harass it. Black must be careful but gets a very solid, active position.",
            tip: "After Ng3 Bg6, don't be afraid of h4-h5. Play ...h6 to give the bishop a safe square on h7 — it stays active and the position stays solid.",
            fen: "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
          },
          {
            title: "Advance Caro-Kann: Space vs Activity",
            explanation:
              "After 3.e5, White pushes the pawn and restricts Black. Black plays ...Bf5 to develop the bishop early (the key Caro-Kann idea), then attacks the center with ...c5 and ...Nc6. The resulting middlegame is a battle between White's space and Black's counterplay.",
            tip: "In the Advance Caro, Black must challenge the center with ...c5. Passive play lets White build an overwhelming position — always fight back!",
            fen: "rnbqkbnr/pp2pppp/2p5/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3",
          },
        ],
      },
      {
        id: "openings-kings-indian",
        title: "King's Indian Defense",
        emoji: "🐉",
        badge: "King's Indian Expert",
        description: "Black's most dynamic reply to 1.d4 — the dragon counter-punch",
        puzzleIds: [],
        concepts: [
          {
            title: "The Fianchetto: ...Nf6, ...g6, ...Bg7",
            explanation:
              "In the King's Indian, Black plays ...Nf6, ...g6, and ...Bg7, building a powerful fianchettoed bishop on g7 — the 'dragon bishop'. Black allows White to build a huge center with d4+e4, then attacks it with ...e5 (or ...c5). It is one of the most fighting defenses in chess.",
            tip: "The King's Indian bishop on g7 is Black's most important piece. Keep it active — if it gets blocked, the whole defense suffers!",
            fen: "rnbqk2r/ppppppbp/5np1/8/2PPP3/2N5/PP3PPP/R1BQKBNR b KQkq e3 0 4",
          },
          {
            title: "Classical KID: ...e5 — The Counter",
            explanation:
              "After 1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.Nf3 O-O 6.Be2 e5, Black challenges the center. White often plays 7.O-O and later d5, closing the center. Then both sides launch opposite-wing attacks — White on the queenside, Black on the kingside. The positions are incredibly sharp.",
            tip: "In the Classical KID, after White plays d5, attack on the kingside with ...f5 and ...Nf4. The race between opposite wing attacks decides the game!",
            fen: "rnbqk2r/ppppppbp/5np1/8/2PPP3/2N5/PP3PPP/R1BQKBNR b KQkq e3 0 4",
          },
          {
            title: "Four Pawns Attack: Extreme Aggression",
            explanation:
              "After 5.f4, White builds a massive four-pawn center (d4, e4, c4, f4). This is very ambitious but slightly overextended. Black fights back with ...c5 and ...b5, hitting the big center. The games are wild and double-edged — both sides play for a win.",
            tip: "Against the Four Pawns Attack, play ...c5 and ...b5 immediately to break up White's center. Passive play against 4 pawns is a recipe for defeat!",
            fen: "rnbqk2r/ppppppbp/5np1/8/2PPPP2/2N5/PP4PP/R1BQKBNR b KQkq f3 0 4",
          },
        ],
      },
      {
        id: "openings-kings-gambit",
        title: "King's Gambit",
        emoji: "🗡️",
        badge: "King's Gambit Expert",
        description: "White sacrifices the f-pawn for a blazing attack — old but deadly",
        puzzleIds: [],
        concepts: [
          {
            title: "1.e4 e5 2.f4 — The Sacrifice",
            explanation:
              "The King's Gambit offers the f-pawn to lure Black's e5 pawn away from the center, giving White a free hand with d4 and Nf3. It was the most popular opening in the 19th century. Modern theory has tamed it but not refuted it — the King's Gambit remains sharp and dangerous.",
            tip: "The f-pawn sacrifice gains center control and rapid development. If Black accepts, White gets d4+e4 and a raging attack!",
            fen: "rnbqkbnr/pppp1ppp/8/8/4Pp2/5N2/PPPP2PP/RNBQKB1R b KQkq - 1 3",
          },
          {
            title: "King's Gambit Accepted: Sharp Play",
            explanation:
              "After 2...exf4, Black accepts the pawn. White plays 3.Nf3 to stop ...Qh4+, then d4 to seize the center. Black must choose between holding the f4 pawn (risky) or giving it back for development. The resulting positions are extremely sharp and full of tactical opportunities.",
            tip: "After accepting the King's Gambit, Black should NOT try to hold the f4 pawn. Give it back and develop quickly — material equality with active pieces is fine!",
            fen: "rnbqkbnr/pppp1ppp/8/8/4Pp2/5N2/PPPP2PP/RNBQKB1R b KQkq - 1 3",
          },
          {
            title: "King's Gambit Declined: Solid Refusal",
            explanation:
              "After 2...Bc5 (Falkbeer Counter-Gambit) or 2...d5 (Falkbeer), Black declines and fights for the center. The most popular decline is 2...Bc5, developing the bishop actively. White must be careful — the open f-file can become a weakness if the attack fails.",
            tip: "2...Bc5 is a great practical choice against the King's Gambit. Develop solidly, castle quickly, and the gambited f-pawn becomes a long-term weakness for White!",
            fen: "rnbqkbnr/pppp1ppp/8/4p3/4PP2/8/PPPP2PP/RNBQKBNR b KQkq f3 0 2",
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
