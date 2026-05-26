## 1. What is a Function?

Imagine a basketball game. You have a player taking a shot — this is an **input**. The result of that shot is points scored (0, 2, or 3) — this is an **output**.

## 2. What is a Function? 
Imagine a basketball stat sheet tracking a player's performance.A relation connects two groups of data. 

Formally, given two sets $A$ and $B$, a relation is a collection of ordered pairs $(x, y)$, where $x$ belongs to set $A$ and $y$ belongs to set $B$. 

## What is a Function? Example 1
Let set $A$ be a collection of specific shot attempts taken during a game, and set $B$ be the possible points awarded $(0, 2, \text{or } 3)$. The pairings of each individual shot $x$ with its resulting score $y$, written as $(x, y)$, form a relation.

## 3. What is a Function?
A **function** is a special kind of relation. For every single input, there is **exactly one** output. In our basketball shot example, if you analyze one specific shot attempt $x$, it can only have one distinct outcome $y$. A single shot cannot simultaneously result in both a miss ($0$ points) and a made basket ($2$ points). Because every single input maps to exactly one output, the relationship is a function.

## Formal Definition

A function $f$ is a rule that takes an **input** from a specific set (the **domain**) and assigns it to **exactly one output** from another specific set (the **range**).

## 4. What is a Function?
For any general function $f$ with a domain $D$, we track the data using variables:
*  **$x$** denotes the input, known as the independent variable because you choose it (e.g., choosing which player takes a shot, or selecting a specific spot on the court).
*  **$y$** denotes the output, known as the dependent variable because its value entirely depends on $x$ (e.g., the resulting points on the scoreboard).

Using function notation, we write: 

$$
y = f(x)
$$

We read this as "$y$ equals $f$ of $x$."

Let's look at a squaring function $f$, where the rule is to square the input. Let $f$ be the squaring function, written as: 
$$
f(x) = x^2
$$

The **domain** $D$ is the set of all possible inputs (all the shots a player could take).For this function, the domain is the set of all real numbers, denoted as $\mathbb{R}$. You can plug any positive number, negative number, or zero into $x$.

The **range** $R$ is the set of all resulting outputs (the actual points scored).

If a player wears jersey number $x = 3$, the function squares it to assign an output. 

$$
3^2 = 9
$$

Because multiplying any real number by itself never results in a negative value, negative numbers are completely excluded from the outputs. However, since every nonnegative real number has a real-valued square root (for example, $\sqrt{9} = 3$), every nonnegative number can be reached.

Therefore, for $f(x) = x^2$, the range is strictly the set of nonnegative real numbers ($y \geq 0$).

## What is a Function? Example 2
Think of the range like the possible scoring increments on a single possession. Your "domain" of choices includes any legal shot taken on the court. However, your "range" of outcomes is strictly limited by the rules of the game to $\{0, 1, 2, 3\}$ points. You can never shoot a single basket and walk away with $-2$ points or $2.5$ points; those values are outside the range of the scoring function.

## 5. What is a Function?
The concept of a function can be visualized using Figure 1.2, Figure 1.3, and Figure 1.4. 

## 2. Notation
Every function has a domain, but sometimes a function is described strictly by an equation—like $f(x) = x^2$—without an explicitly stated domain.

When no domain is specified, we use the natural domain. This is the set of all real numbers $x$ for which the function $f(x)$ yields a valid, real-number output.

**Explicit Domain vs. Natural Domain**
Think of this like basketball roster sizes:
*  **Explicit Domain**: A league rule explicitly states you can only have exactly $15$ players on a roster.
*  **Natural Domain**: No specific roster limit is written down, but physical constraints (like the number of seats on the team bench or jerseys available) naturally limit how many players you can actually suit up.

For 
$$ 
f(x) = x^2
$$
Because you can square any real number (positive, negative, or zero) and get a real-number result, its natural domain is the set of all real numbers ($\mathbb{R}$).

For 
$$
f(x) = \sqrt{x}
$$ 
This function only produces a real-number output if the input is not negative (since the square root of a negative number is not a real number). Therefore, the natural domain of $f(x) = \sqrt{x}$ is the set of nonnegative real numbers ($x \geq 0$).

## 2. Notation Example 1
Think of the square root function like checking a player's total career blocks. A player can have $0$ blocks, $2$ blocks, or $500$ blocks. However, it is physically impossible to record $-3$ blocks. A negative input makes no sense in this context, so negative numbers are naturally left out of the domain.

## Interval Notation

**Interval notation** is a shorter way to write sets of numbers. 
*  **Parentheses $(a, b)$** mean the endpoints $a$ and $b$ are *not included*.
*  **Brackets $[a, b]$** mean the endpoints $a$ and $b$ *are included*.

## In Text Example 1
$[1, 5]$ means all numbers between $1$ and $5$, *including* $1$ and $5$. This is 
$$ 
\{x \mid 1 \leq x \leq 5\} 
$$

$(1, 5)$ means all numbers greater than $1$ and less than $5$, *excluding* $1$ and $5$. This is 
$$
\{x \mid 1 < x < 5\}.
$$

## Infinite Intervals
For sets that go on forever, we use $\infty$ (positive infinity) or $-\infty$ (negative infinity).

*   $\infty$ indicates that we are including all numbers greater than or equal to 0 (i.e."goes on forever in the positive direction.")
*   $-\infty$ indicates that we are including all numbers less than or equal to 0 (i.e. "goes on forever in the negative direction.")

**Important:** $\infty$ and $-\infty$ are *not* real numbers, so they always use parentheses.

## In Text Example 2
*   All non-negative numbers (like a player's score): 
$$
[0, \infty) = \{x \mid x \geq 0\}
$$

*   All non-positive numbers: 
$$ 
(-\infty, 0] = \{x \mid x \leq 0\}
$$

*   All real numbers (like any possible change in score): 
$$ 
(-\infty, \infty) = \{x \mid x \text{ is any real number}\}
$$

## Piecewise-Defined Functions

Sometimes, a function uses different rules (formulas) depending on the input. These are called **piecewise-defined functions**.

Think about a basketball player's bonus points:
*   If they score $10$ points or more, they get $5$ bonus points.
*   If they score less than $10$ points, they get $2$ bonus points.

Let $x$ be the points scored. Let $B(x)$ be the bonus points. We write this as:
$$
B(x) = \begin{cases}
5 & x \geq 10 \\
2 & x < 10
\end{cases}
$$
This function has two "pieces," each with its own rule and input condition.

## Evaluating Piecewise Functions

To evaluate a piecewise function, first check which condition your input ($x$) satisfies. Then use the rule for that specific condition.

Using the bonus points example:
$$
B(x) = \begin{cases}
5 & x \geq 10 \\
2 & x < 10
\end{cases}
$$

*   **Evaluate $B(12)$:**
    *   Is $12 \geq 10$? Yes.
    *   So, use the rule $B(x) = 5$.
    *   $B(12) = 5$. (A player scoring $12$ points gets $5$ bonus points.)

*   **Evaluate $B(7)$:**
    *   Is $7 \geq 10$? No.
    *   Is $7 < 10$? Yes.
    *   So, use the rule $B(x) = 2$.
    *   $B(7) = 2$. (A player scoring $7$ points gets $2$ bonus points.)

## Tables
Functions described using a table of values are incredibly common in real-world sports analytics. Let's look at a simple example.We can describe a basketball team's total score as a function of the game time elapsed. Suppose we record the score at the end of every quarter during a standard $48$-minute game.

We let our input variable $x$ be the time elapsed since tip-off, measured in minutes. The output variable $y$ will be the team's total score $x$ minutes into the game. To give a better picture of the game flow, let's record the team's total score every 6 minutes in Table 1.1.

## Tables Continued
We can see from the table that the total team score is a function of game time, and the score consistently increases as the game progresses. However, we cannot get a clear picture of the exact scoring pace and behavior of the function without graphing it.

## Graphs
Given a function $f$ described by a table, we can provide a visual picture of the relationship in the form of a graph. Graphing the total points listed in our game log can give us a clearer idea of the team's scoring pace and momentum throughout the game.

## Graphs Continued
From the points plotted on our graph, we can visualize the general shape of the team's scoring momentum. It is often useful to connect these dots, which represent the exact data points from our game log.Although we cannot make a definitive conclusion about the exact score at times we didn't record (for example, at $x = 10$ minutes), we have collected enough data points to see a clear pattern. Given this consistent scoring pace, it is reasonable to suspect that the total points at unrecorded times followed a very similar trajectory along that connected line.

## Algebraic Formulas
Sometimes, functions are given as explicit algebraic formulas rather than tables. Formulas are powerful tools because they allow you to calculate outputs instantly for any given input.

Let's think about the physics of a jump shot. When a player shoots the ball, its height above the floor in feet can be modeled as a function of time $t$ in seconds. A common formula for a shot looks like this:
$$
h(t) = -16t^2 + 24t + 6
$$
Given a formula for a function $f$, the graph is simply the set of all points $(x, f(x))$. To graph a formula like our jump shot, you can start by plugging in different times ($t$) to create a table of outputs ($h(t)$), and then plot those points to see the arc of the ball.

**Zeros of a Function (x-intercepts)**

When looking at a function's table or graph, we often want to know when the output is exactly zero, or $f(x) = 0$. These specific input values are called the **zeros of the function**. On a graph, the zeros are where the line intersects the $x$-axis.

## Algebraic Formulas Analogy 1
For our jump shot function $h(t)$, setting $h(t) = 0$ calculates the exact moment the ball hits the floor (when its height is zero).

## 2. Algebraic Formulas
Depending on the rule, the graph of a function might never hit the $x$-axis, or it might cross it multiple times.

**The y-intercept**

Another key point of interest is the $y$-intercept, which occurs when the input is zero. It is represented by the coordinate $(0, f(0))$.

## Algebraic Formulas Analogy 2
In our formula $h(t)$, plugging in $t = 0$ gives $h(0) = 6$. This is the $y$-intercept. In the real world, this represents the initial release height of the ball the exact moment it leaves the player's hands ($6$ feet off the ground).

## 3. Algebraic Formulas
Because a function maps every input to exactly one output, the graph of a function can have, at most, one $y$-intercept. If $x = 0$ is a valid input in the domain, there is exactly one intercept. If it isn't, there is none.

## 4. Algebraic Formulas
Because every valid input $c$ has exactly one output $f(c)$, we can use a quick visual check on any graph to see if it is a true function. This is called the **Vertical Line Test**.

If you draw a vertical line at $x = c$, it will intersect the graph of a function exactly once. If a vertical line crosses a graph two or more times, it means a single input has multiple outputs. If that happens, the graph is not a function.

Here is a test of the Vertical Line Test at time, $t$, equal to 50 seconds. 

## 1. Increasing and Decreasing Functions
When tracking data in a game, we often want to know if the numbers are trending up or down.
*  Decreasing Functions: A function is decreasing if the values of $f(x)$ get smaller as $x$ gets larger.

## Analogy 1: Increasing and Decreasing Functions 
Think of the $24$-second shot clock. As time ($x$) increases, the remaining seconds on the clock ($f(x)$) only go down.

## 2. Increasing and Decreasing Functions
*  Increasing Functions: A function is increasing if the values of $f(x)$ get larger as $x$ gets larger.

## Analogy 2: Increasing and Decreasing Functions 
Think of a team's total score. As the game minutes ($x$) increase, the total points ($f(x)$) only go up.

## 3. Increasing and Decreasing Functions
It is important to note that a function doesn't have to choose just one direction. A function can increase on some intervals and decrease on others.

Let's bring back our jump shot formula from the previous section:
$$
h(t) = -16t^2 + 24t + 6
$$
When the player releases the ball, its height goes up until it reaches the highest point of its arc, and then it drops down toward the basket. By finding the peak of the shot (which happens exactly at $0.75$ seconds), we can break the function into two distinct pieces:
*  The height is increasing on the interval $(0, 0.75)$ seconds.
*  After hitting the peak, the height is decreasing on the interval $(0.75, 1.72)$ seconds as it falls.

We make the mathematical idea of increasing or decreasing over specific intervals more precise in the next definition. 

## Combining Functions
Now that we understand the basic properties of functions, we can combine them using simple math (like addition or subtraction) to create entirely new, useful functions.For example, consider a player's Plus/Minus statistic. Let the input $x$ be the number of minutes a specific player is on the court.
*  Let $O(x)$ be the function describing the points the player's team scores during those $x$ minutes.
*  Let $D(x)$ be the function describing the points the opposing team scores during those same $x$ minutes.To calculate the player's overall impact (their Plus/Minus), we subtract the points given up from the points scored. We can define this entirely new function as:
$$
PM(x) = O(x) - D(x)
$$
By simply taking the difference between two existing functions, we built a brand-new one.

Alternatively, we can create a new function by composing two functions. For example, given the functions $f(x) = x^2$ and $g(x) = 3x + 1$, the composite function $f \circ g$ is defined such that 
$$ 
(f \circ g)(x) = f(g(x)) = (g(x))^2 = (3x + 1)^2
$$ 

The composite function $g \circ f$ is defined such that
$$ 
(g \circ f)(x) = g(f(x)) = 3f(x) + 1 = 3x^2 + 1
$$ 

Note that these two new functions are different from each other.

## Composite Functions
When we compose functions, we evaluate a function of a function. It is a chain reaction where the output of the first function becomes the exact input for the second.

Suppose the energy a player expends, $E$, is a function of the minutes they play, $t$. We write this as $E(t)$. 

Next, suppose the hours of recovery time a player needs, $R$, is a function of the energy they expended, $E$. We write this as $R(E)$.By combining these two functions, we can calculate a player's required recovery time directly from their minutes played by evaluating $R(E(t))$. We have defined a new **composite function**, denoted $R \circ E$, which is defined for all valid times $t$ as:
$$
(R \circ E)(t) = R(E(t))
$$
Because recovery time is a function of energy, and energy is a function of minutes played, $(R \circ E)(t)$ makes perfect logical sense. It does not make sense to calculate $(E \circ R)(t)$ because a player's in-game energy expenditure is not a function of their post-game recovery time.

## 1. Symmetry in Functions
The graphs of certain functions have symmetry properties that help us quickly understand the function's behavior and predict the shape of its graph.

**Symmetry About the y-Axis**

Consider the function:
$$
f(x) = x^4 - 2x^2 - 3
$$
If you take the part of this curve that lies to the right of the $y$-axis and flip it over the $y$-axis, it lands exactly on top of the curve to the left. When a graph mirrors itself like this, we say it has symmetry about the $y$-axis.

## Symmetry in Functions Analogy 1
Think of a perfectly balanced automated shooting machine placed directly in front of the hoop (on the $y$-axis). If it shoots with the exact same power and angle to the left wing as it does to the right wing, the flight paths of the balls will mirror each other perfectly across the center line.

## 2. Symmetry in Functions
Now, consider this function:
$$
f(x) = x^3 - 4x
$$
If you take this graph and rotate it 180° around the origin $(0,0)$, the resulting graph will look completely identical to the original. This is called **symmetry about the origin**.

## Symmetry in Functions Analogy 2
Imagine a full-court transition drill where Player A starts at the bottom-left corner of the court and Player B starts at the top-right corner. If both players run identical diagonal routes toward the center circle and pass each other at the exact center logo, their paths are symmetric about the origin. If you rotated the entire clipboard diagram 180° around the center logo, the play design would look exactly the same.