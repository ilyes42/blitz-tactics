import { dispatch, subscribe } from '../../../store'

const updateInterval = 50

// Amount of time spent on this round so far
//
export default class Timer {
  timer = false

  get el() {
    return document.querySelector(`.times`)
  }

  constructor() {
    this.timerEl = this.el.querySelector(`.timer`)
    this.lapsEl = this.el.querySelector(`.laps`)
    subscribe({
      'puzzles:start': () => this.startTimer(),
      'puzzles:next': () => this.startTimer(),
      'puzzles:lap': () => this.nextLap(),
    })
  }

  elapsedTimeMs() {
    return ~~(Date.now() - this.startTime)
  }

  formattedTime(integer) {
    const minutes = ~~( integer / 60 )
    const seconds = integer % 60
    return `${minutes}:${("0" + seconds).slice(-2)}`
  }

  formattedElapsedTime() {
    return this.formattedTime(~~(this.elapsedTimeMs() / 1000))
  }

  startTimer() {
    if (this.startTime || this.timer) {
      return
    }
    let lastElapsed
    this.startTime = Date.now()
    this.timer = setInterval(() => {
      const elapsed = this.formattedElapsedTime()
      if (elapsed !== lastElapsed) {
        lastElapsed = elapsed
        this.timerEl.textContent = elapsed
      }
    }, updateInterval)
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = false
    }
  }

  nextLap() {
    if (this.elapsedTimeMs() === 0) {
      return
    }
    this.stopTimer()
    const lastLap =`<div>${this.formattedElapsedTime()}</div>`
    this.lapsEl.innerHTML = lastLap + this.lapsEl.innerHTML
    this.notify()
    this.startTime = false
    this.startTimer()
  }

  notify() {
    dispatch(`round:complete`, this.elapsedTimeMs())
  }
}
