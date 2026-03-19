"use client";

import { Chessboard } from "react-chessboard";
type PieceDropHandlerArgs = { piece: unknown; sourceSquare: string; targetSquare: string | null };

interface Props {
  fen: string;
  onDrop: (args: PieceDropHandlerArgs) => boolean;
  orientation: "white" | "black";
  draggable: boolean;
  squareStyles?: Record<string, React.CSSProperties>;
  onPieceClick?: (args: { isSparePiece: boolean; piece: { pieceType: string }; square: string | null }) => void;
  onPieceDrag?: (args: { isSparePiece: boolean; piece: { pieceType: string }; square: string | null }) => void;
  size?: number;
}

export default function PracticeBoard({
  fen,
  onDrop,
  orientation,
  draggable,
  squareStyles,
  onPieceClick,
  onPieceDrag,
  size = 480,
}: Props) {
  return (
    <div style={{ width: size, height: size }}>
      <Chessboard
        options={{
          position: fen,
          onPieceDrop: onDrop,
          boardOrientation: orientation,
          allowDragging: draggable,
          darkSquareStyle: { backgroundColor: "#4a3728" },
          lightSquareStyle: { backgroundColor: "#f0d9b5" },
          animationDurationInMs: 200,
          boardStyle: { width: size, height: size },
          squareStyles,
          onPieceClick,
          onPieceDrag,
        }}
      />
    </div>
  );
}
