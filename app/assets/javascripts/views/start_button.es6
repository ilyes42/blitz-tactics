{

  // Click this to start the puzzles
  //
  class StartButton extends Backbone.View {

    get el() {
      return ".start"
    }

    get events() {
      return {
        "click" : "_startPuzzles"
      }
    }

    initialize() {
      this.listenTo(d, "puzzles:fetched", () => {
        this.$el.removeClass("disabled")
      })
    }

    _startPuzzles() {
      d.trigger("puzzles:next")
      d.trigger("puzzles:start")
    }

  }


  Views.StartButton = StartButton

}