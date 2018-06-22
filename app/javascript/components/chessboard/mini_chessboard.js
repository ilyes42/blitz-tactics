import $ from 'jquery'
import Backbone from 'backbone'
import Chess from 'chess.js'

import Pieces from './concerns/pieces'
import { uciToMove } from '../../utils'

export default class MiniChessboard extends Backbone.View {

  // options.fen         - fen string
  // options.initialMove - uci string

  initialize(options = {}) {
    this.pieces = new Pieces(this)
    if (options.fen) {
      let fen = options.fen
      if (options.initialMove) {
        const c = new Chess(fen)
        const { from, to } = c.move(uciToMove(options.initialMove))
        this.highlightSquare(from, "#fffcdd")
        this.highlightSquare(to, "#fff79b")
        fen = c.fen()
      }
      this.render(fen)
    }
  }

  render(fen) {
    if (fen.split(" ").length === 4) {
      fen += " 0 1"
    }
    this.renderFen(fen)
  }

  renderFen(fen) {
    const columns = ['a','b','c','d','e','f','g','h']
    const position = new Chess(fen)
    this.pieces.reset()
    for (let row = 8; row > 0; row--) {
      for (let j = 0; j < 8; j++) {
        let id = columns[j] + row
        let piece = position.get(id)
        if (piece) {
          this.pieces.$getPiece(piece).appendTo(this.$getSquare(id))
        }
      }
    }
  }

  highlightSquare(id, color) {
    this.$getSquare(id).css({ background: color })
  }

  $getSquare(id) {
    return this.$(`.${id}`)
  }
}
