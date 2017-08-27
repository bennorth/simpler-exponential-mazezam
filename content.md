% Simpler exponential Mazezam level family

<div class="home-link"><p><a href="http://www.redfrontdoor.org/blog/">Ben North</a>, August 2017</p></div>


## Background: Mazezam's complexity

See previous pieces and other links for the background:

- The [Mazezam](https://sites.google.com/site/malcolmsprojects/mazezam-home-page) puzzle game written by Malcolm Tyrrell;
- My flawed [2008 argument](http://redfrontdoor.org/blog/?p=174) claiming that this puzzle game is 'NP-complete' (in fact I had only showed it is 'NP-hard');
- A [January 2017 follow-up](https://bennorth.github.io/exponential-mazezam/index.html), prompted by an email from [Aaron Williams](http://simons-rock.edu/faculty/aaron-williams), describing the flaw in the previous post, and demonstrating a family of Mazezam levels whose solution-length goes up exponentially with the level size.

## Aaron's simpler exponential level family

Malcolm and I exchanged further emails with Aaron and his colleagues, with the result that Aaron simplified the exponential level family construction.  His approach is illustrated by the animation below.

As before, a light row in its leftward position means that bit is '`0`'; in its rightwards position means '`1`'.  The lowest light row represents the least-significant bit, `b0`, with higher rows representing more-significant bits.  All rows therefore start off in their leftward position.

The level consists of six vertical 'gadgets', of increasing height as you work from left to right in the level.  Each gadget allows the adjustment of one bit, provided that the requirements are met for that bit to be adjustable with the Gray code counter having the value represented by the current state of the puzzle.  Finally, there is an escape route at the right of the level, which can only be traversed when the Gray code is in its final state of `100000`.

Call a bit 'fixed' if you aren't allowed to change it with the counter in its current state.  E.g., with the counter as 101000, we are allowed to change `b0` and `b4`, so the 'fixed' bits are `b1`, `b2`, `b3`, and `b5`.  Because it's always permissible to adjust the `b0` bit, `b0` is never fixed.

In [my previous version](https://bennorth.github.io/exponential-mazezam/index.html), you cannot pass vertically through a 'fixed' row without leaving that row in the state it was before you entered it.  In the Gray counter level family, we only need a weaker constraint, namely that the state of all 'fixed' rows in one gadget are in the same state on leaving the gadget as when you entered the gadget.  I.e., my design enforced the correctness of the representation whenever the player was not in a bit-representing row, but Aaron's simplification weakens this to 'the puzzle state represents a valid Gray counter value whenever the player is not in a gadget'.  The weaker constraint is still sufficient to require the player to step through the Gray counter.

This gives a bit more freedom in the row design, which Aaron's simplification exploits.  To adjust `b4`, say, we require that `b3.b2.b1.b0` is `1000`, so that the gap in each of those light rows aligns with the gap in the dark row below it.  On passing up the gadget, `b2` is temporarily moved to its `1` state, but by the time the player passes downwards through that row, `b2` must be moved back to `0`, restoring the correct representation.  While in the gadget, the player can also change, say, `b3`, but, again, it has to be restored to its original state (`1`) for the player to get back out of the gadget.

<div id="game-container"><div id="game-canvas">
<img class="game-slice" id="slice-00" src="aw-slice-00.png">
<img class="game-slice" id="slice-01" src="aw-slice-01.png">
<img class="game-slice" id="slice-02" src="aw-slice-02.png">
<img class="game-slice" id="slice-03" src="aw-slice-03.png">
<img class="game-slice" id="slice-04" src="aw-slice-04.png">
<img class="game-slice" id="slice-05" src="aw-slice-05.png">
<img class="game-slice" id="slice-06" src="aw-slice-06.png">
<img class="game-slice" id="slice-07" src="aw-slice-07.png">
<img class="game-slice" id="slice-08" src="aw-slice-08.png">
<img class="game-slice" id="slice-09" src="aw-slice-09.png">
<img class="game-slice" id="slice-10" src="aw-slice-10.png">
<img class="game-slice" id="slice-11" src="aw-slice-11.png">
<img class="game-slice" id="slice-12" src="aw-slice-12.png">
<img id="player" src="player.png" style="display:none"></div>

<div id="controls">
<table><tr><td>Counter value:</td><td id="counter-value">0 0 0 0 0 0</td></tr>
<tr><td>Number of moves:</td><td id="n-moves">0</td></tr></table>
<form action="">
<input type="radio" name="speed" value="slow" checked="checked">Slow
<input type="radio" name="speed" value="fast">Fast
</form><p id="buttons"><button id="btn-start">Start</button><button id="btn-reset">Reset</button></p></div>
</div>

The 'Counter value' display here is bold and black when the puzzle represents a valid state.  It is shown non-bold and lighter when the puzzle is temporarily not representing the true Gray counter value.

(Thanks to [Oliver Nash](http://olivernash.org/) for the suggestion to use CSS3 transitions in the animation.)

## Solution lengths

This version needs 981 moves to solve the 6-bit level; the previous version needed 6730.

## Source code

Available on github: [bennorth/simpler-exponential-mazezam](https://github.com/bennorth/simpler-exponential-mazezam).


<div class="home-link"><p><a href="http://www.redfrontdoor.org/blog/">Ben North</a>, August 2017</p></div>
<p class="copyright-footer">This web-page content Copyright 2017 Ben North; licensed under <a href="http://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a></p></div>
