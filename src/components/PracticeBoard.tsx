"use client";

import { Chessboard } from "react-chessboard";
type PieceDropHandlerArgs = { piece: unknown; sourceSquare: string; targetSquare: string | null };

interface Props {
  fen: string;
  onDrop: (args: PieceDropHandlerArgs) => boolean;
  orientation: "white" | "black";
  draggable: boolean;
}

export default function PracticeBoard({ fen, onDrop, orientation, draggable }: Props) {
  return (
    <div style={{ width: 400, height: 400 }}>
      <Chessboard
        options={{
          position: fen,
          onPieceDrop: onDrop,
          boardOrientation: orientation,
          allowDragging: draggable,
          darkSquareStyle: { backgroundColor: "#4a3728" },
          lightSquareStyle: { backgroundColor: "#f0d9b5" },
          animationDurationInMs: 200,
          boardStyle: { width: 400, height: 400 },
        }}
      />
    </div>
  );
}
