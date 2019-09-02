import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(row, column) {
    // Needed since we use a one-dimensional array
    const rowOffset = row * 3;

    return (
        <Square key={'square-' + row + '-' + column}
                value={this.props.squares[rowOffset + column]}
                onClick={() => this.props.onClick(rowOffset + column)} />
    );
  }

  renderBoard() {
    const board = [];

    for (let row = 0; row < 3; row++) {
      const squares = [];
      for (let column = 0; column < 3; column++) {
        squares.push(this.renderSquare(row, column));
      }
      board.push(<div className="board-row">{squares}</div>);
    }

    return board;
  }

  render() {
    return (
      <div>
        {this.renderBoard()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      return (
        <li key={move} className={(step === current) ? "current" : ""}>
          <button onClick={() => this.jumpTo(move)}>{describeMove(move, history)}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares}
                 onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function describeMove(move, history) {
  if (!move) {
    return 'Go to game start';
  }

  const previousStep = history[move - 1];
  const currentStep = history[move];

  const movePosition = currentStep.squares.findIndex((element, index) => {
    return previousStep.squares[index] !== currentStep.squares[index];
  });

  // We add 1 to the calculations below to display a human-friendly position (so it starts at 1, not 0)
  const boardSize = currentStep.squares.length; // This is hard-coded for now, it could be provided by the Game component to dynamically generate a board of a specific size
  const columnPosition = movePosition % Math.sqrt(boardSize) + 1;
  const rowPosition = Math.floor(movePosition / Math.sqrt(boardSize)) + 1;

  return 'Go to move #' + move + ' (column: ' + columnPosition + ', row: ' + rowPosition + ')';
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
