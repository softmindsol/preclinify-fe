export function debounce(func, delay) {
  let timer;

  return function (...args) {
    const context = this;

    // Clear the previous timer
    clearTimeout(timer);

    // Set a new timer
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

export function getFeedbackMessage(accuracy) {
  
  if (accuracy >= 0 && accuracy <= 5) return "Bit of a rocky start, but don’t fret—you’ll get there!";
  if (accuracy >= 6 && accuracy <= 10) return "Alright, you’re off the mark! Let’s crack on!";
  if (accuracy >= 11 && accuracy <= 15) return "Making some headway! Keep at it, you’re doing alright!";
  if (accuracy >= 16 && accuracy <= 20) return "You’re on your way! A bit more graft and you’ll be flying!";
  if (accuracy >= 21 && accuracy <= 25) return "Good show! Let’s pick up the pace a bit now!";
  if (accuracy >= 26 && accuracy <= 30) return "Not too bad! Time to knuckle down!";
  if (accuracy >= 31 && accuracy <= 35) return "You’re getting there! Keep at it, nearly halfway!";
  if (accuracy >= 36 && accuracy <= 40) return "Halfway-ish! You’re coming along nicely!";
  if (accuracy >= 41 && accuracy <= 45) return "Not far off halfway! Keep grafting!";
  if (accuracy >= 46 && accuracy <= 50) return "Halfway there! Top effort so far, keep it going!";
  if (accuracy >= 51 && accuracy <= 55) return "More than halfway! You’re on the up now!";
  if (accuracy >= 56 && accuracy <= 60) return "You’re really picking up steam now, well in!";
  if (accuracy >= 61 && accuracy <= 65) return "Brilliant! You’re onto something here!";
  if (accuracy >= 66 && accuracy <= 70) return "Nicely done! You’re well on track!";
  if (accuracy >= 71 && accuracy <= 75) return "Top drawer effort! Keep pushing!";
  if (accuracy >= 76 && accuracy <= 80) return "So close! You’re absolutely smashing it!";
  if (accuracy >= 81 && accuracy <= 85) return "Brilliant work! Nearly at the top!";
  if (accuracy >= 86 && accuracy <= 90) return "You’re on fire! Just a bit more and you’ve nailed it!";
  if (accuracy >= 91 && accuracy <= 95) return "That’s cracking! Sure you’re not showing off?";
  if (accuracy >= 96 && accuracy <= 99) return "Almost flawless! You’re absolutely banging it!";
  if (accuracy === 100) return "Spot on! You’ve smashed it—top marks!";
  return "Invalid accuracy value!";
}