
# Chapter 1 — Review of Functions (Section 1.1)

## Learning Objectives

- Use functional notation to evaluate a function.
- Determine the domain and range of a function.
- Draw the graph of a function.
- Find the zeros of a function.
- Recognize a function from a table of values.
- Make new functions from two or more given functions.
- Describe the symmetry properties of a function.

## Introduction

In this section, we review the formal definition of a function and explore common ways functions are represented—namely, through tables, formulas, and graphs. We study formal notation and terms related to functions. We also define composition of functions and symmetry properties. Most of this material will be a review for you, but it serves as a handy reference to remind you of some of the algebraic techniques useful for working with functions.

## 1. What is a Function?

Given two sets $A$ and $B$, a set with elements that are ordered pairs $(x, y)$, where $x$ is an element of $A$ and $y$ is an element of $B$, is a relation from $A$ to $B$. A relation from $A$ to $B$ defines a relationship between those two sets. A function is a special type of relation in which each element of the first set is related to exactly one element of the second set. The element of the first set is called the input; the element of the second set is called the output. Functions are used all the time in mathematics to describe relationships between two sets. For any function, when we know the input, the output is determined, so we say that the output is a function of the input. For example, the area of a square is determined by its side length, so we say that the area (the output) is a function of its side length (the input). The velocity of a ball thrown in the air can be described as a function of the amount of time the ball is in the air. The cost of mailing a package is a function of the weight of the package. Since functions have so many uses, it is important to have precise definitions and terminology to study them.

## Formal Definition

A function $f$ consists of a set of inputs, a set of outputs, and a rule for assigning each input to exactly one output. The set of inputs is called the domain of the function. The set of outputs is called the range of the function.

## 2. What is a Function?

For example, consider the function $f$, where the domain is the set of all real numbers and the rule is to square the input. Then, the input $x = 3$ is assigned to the output $3^2 = 9$. Since every nonnegative real number has a real-value square root, every nonnegative number is an element of the range of this function. Since there is no real number with a square that is negative, the negative real numbers are not elements of the range. We conclude that the range is the set of nonnegative real numbers.

For a general function $f$ with domain $D$, we often use $x$ to denote the input and $y$ to denote the output associated with $x$. When doing so, we refer to $x$ as the independent variable and $y$ as the dependent variable, because it depends on $x$. Using function notation, we write $y = f(x)$, and we read this equation as "$y$ equals $f$ of $x$." For the squaring function described earlier, we write $f(x) = x^2$.

The concept of a function can be visualized using Figure 1.2, Figure 1.3, and Figure 1.4.

## Graph Visual

We can also visualize a function by plotting points $(x, y)$ in the coordinate plane where $y = f(x)$. The **graph of a function** is the set of all these points. For example, consider the function $f$, where the domain is the set $D = \{1, 2, 3\}$ and the rule is $f(x) = 3 - x$. In Figure 1.5, we plot a graph of this function.

## 2. Notation 

Every function has a domain. However, sometimes a function is described by an equation, as in $f(x) = x^2$, with no specific domain given. In this case, the domain is taken to be the set of all real numbers $x$ for which $f(x)$ is a real number. For example, since any real number can be squared, if no other domain is specified, we consider the domain of $f(x) = x^2$ to be the set of all real numbers. On the other hand, the square root function $f(x) = \sqrt{x}$ only gives a real output if $x$ is nonnegative. Therefore, the domain of the function $f(x) = \sqrt{x}$ is the set of nonnegative real numbers, sometimes called the natural domain.

## How To Write Notation 
For the functions $f(x) = x^2$ and $f(x) = \sqrt{x}$, the domains are sets with an infinite number of elements. Clearly we cannot list all these elements. When describing a set with an infinite number of elements, it is often helpful to use set-builder or interval notation. 

When using set-builder notation to describe a subset of all real numbers, denoted $\mathbb{R}$, we write

$$
\{x \mid x \text{ has some property}\}.
$$

We read this as the set of real numbers $x$ such that $x$ has some property. For example, if we were interested in the set of real numbers that are greater than one but less than five, we could denote this set using set-builder notation by writing

$$
\{x \mid 1 < x < 5\}.
$$

## Interval Notation
The numbers $1$ and $5$ are called the endpoints of this set. If we want to consider the set that includes the endpoints, we would denote this set by writing

$$[1, 5] = \{x \mid 1 \leq x \leq 5\}.$$

We can use similar notation if we want to include one of the endpoints, but not the other. To denote the set of nonnegative real numbers, we would use the set-builder notation

$$\{x \mid 0 \leq x\}.$$

## Section Review: Domain and Notation
This is a recap section.

## Describing Infinite Sets
The smallest number in this set is zero, but this set does not have a largest number. Using interval notation, we would use the symbol $\infty$, which refers to positive infinity, and we would write the set as

$$[0, \infty) = \{x \mid 0 \leq x\}.$$

It is important to note that $\infty$ is not a real number. It is used symbolically here to indicate that this set includes all real numbers greater than or equal to zero. Similarly, if we wanted to describe the set of all nonpositive numbers, we could write

$$(-\infty, 0] = \{x \mid x \leq 0\}.$$

Here, the notation $-\infty$ refers to negative infinity, and it indicates that we are including all numbers less than or equal to zero, no matter how small. The set

$$(-\infty, \infty) = \{x \mid x \text{ is any real number}\}$$

refers to the set of all real numbers.

Some functions are defined using different equations for different parts of their domain. These types of functions are known as piecewise-defined functions. For example, suppose we want to define a function $f$ with a domain that is the set of all real numbers such that $f(x) = 3x + 1$ for $x \geq 2$ and $f(x) = x^2$ for $x < 2$. We denote this function by writing

$$f(x) = \begin{cases} 3x + 1 & x \geq 2 \\ x^2 & x < 2 \end{cases}$$


## Piecewise-Defined Functions

When evaluating this function for an input $x$, the equation to use depends on whether $x \geq 2$ or $x < 2$. For example, since $5 > 2$, we use the fact that $f(x) = 3x + 1$ for $x \geq 2$ and see that $f(5) = 3(5) + 1 = 16$. On the other hand, for $x = -1$, we use the fact that $f(x) = x^2$ for $x < 2$ and see that $f(-1) = 1$.

## Example 1.1
### Evaluating Functions

For the function $f(x) = 3x^2 + 2x - 1$, evaluate

a. $f(-2)$
b. $f(\sqrt{2})$
c. $f(a + h)$

### Solution

Substitute the given value for $x$ in the formula for $f(x)$.

$$f(-2) = 3(-2)^2 + 2(-2) - 1 = 12 - 4 - 1 = 7$$

$$f(\sqrt{2}) = 3(\sqrt{2})^2 + 2\sqrt{2} - 1 = 6 + 2\sqrt{2} - 1 = 5 + 2\sqrt{2}$$

$$\begin{aligned} f(a + h) &= 3(a + h)^2 + 2(a + h) - 1 \\ &= 3(a^2 + 2ah + h^2) + 2a + 2h - 1 \\ &= 3a^2 + 6ah + 3h^2 + 2a + 2h - 1 \end{aligned}$$

## Checkpoint 1.1

For $f(x) = x^2 - 3x + 5$, evaluate $f(1)$ and $f(a + h)$.

## Example 1.2
### Finding Domain and Range

For each of the following functions, determine the i. domain and ii. range.

a. $f(x) = (x - 4)^2 + 5$
b. $f(x) = \sqrt{3x + 2} - 1$
c. $f(x) = \dfrac{3}{x - 2}$

### Solution

a. Consider $f(x) = (x - 4)^2 + 5$.

   i. Since $f(x) = (x - 4)^2 + 5$ is a real number for any real number $x$, the domain of $f$ is the interval $(-\infty, \infty)$.

   ii. Since $(x - 4)^2 \geq 0$, we know $f(x) = (x - 4)^2 + 5 \geq 5$. Therefore, the range must be a subset of $\{y \mid y \geq 5\}$. To show that every element in this set is in the range, we need to show that for a given $y$ in that set, there is a real number $x$ such that $f(x) = (x - 4)^2 + 5 = y$. Solving this equation for $x$, we see that we need $x$ such that $(x - 4)^2 = y - 5$. This equation is satisfied as long as there exists a real number $x$ such that $x - 4 = \pm\sqrt{y - 5}$. Since $y \geq 5$, the square root is well-defined. We conclude that for $x = 4 \pm \sqrt{y - 5}$, $f(x) = y$, and therefore the range is $\{y \mid y \geq 5\}$.

b. Consider $f(x) = \sqrt{3x + 2} - 1$.

   i. To find the domain of $f$, we need the expression $3x + 2 \geq 0$. Solving this inequality, we conclude that the domain is $\{x \mid x \geq -2/3\}$.

   ii. To find the range of $f$, we note that since $\sqrt{3x + 2} \geq 0$, $f(x) = \sqrt{3x + 2} - 1 \geq -1$. Therefore, the range of $f$ must be a subset of the set $\{y \mid y \geq -1\}$. To show that every element in this set is in the range of $f$, we need to show that for all $y$ in this set, there exists a real number $x$ in the domain such that $f(x) = y$. Let $y \geq -1$. Then, $f(x) = y$ if and only if $\sqrt{3x + 2} - 1 = y$. Solving this equation for $x$, we see that $x$ must solve the equation $\sqrt{3x + 2} = y + 1$. Since $y \geq -1$, such an $x$ could exist. Squaring both sides of this equation, we have $3x + 2 = (y + 1)^2$. Therefore, we need $3x = (y + 1)^2 - 2$, which implies $x = \frac{1}{3}(y + 1)^2 - \frac{2}{3}$. We just need to verify that $x$ is in the domain of $f$. Since the domain of $f$ consists of all real numbers greater than or equal to $-2/3$, and $\frac{1}{3}(y + 1)^2 - \frac{2}{3} \geq -\frac{2}{3}$, there does exist an $x$ in the domain of $f$. We conclude that the range of $f$ is $\{y \mid y \geq -1\}$.

c. Consider $f(x) = \dfrac{3}{x - 2}$.

   i. Since $\dfrac{3}{x - 2}$ is defined when the denominator is nonzero, the domain is $\{x \mid x \neq 2\}$.

   ii. To find the range of $f$, we need to find the values of $y$ such that there exists a real number $x$ in the domain with the property that $\dfrac{3}{x - 2} = y$. Solving this equation for $x$, we find that $x = \dfrac{3}{y} + 2$. Therefore, as long as $y \neq 0$, there exists a real number $x$ in the domain such that $f(x) = y$. Thus, the range is $\{y \mid y \neq 0\}$.

## Evaluating Piecewise Functions

Find the domain and range for $f(x) = \sqrt{4 - 2x} + 5$.

## Representing Functions

Typically, a function is represented using one or more of the following tools:
* A table
* A graph
* A formula

We can identify a function in each form, but we can also use them together. For instance, we can plot on a graph the values from a table or create a table from a formula.

## Tables

Functions described using a table of values arise frequently in real-world applications. Consider the following simple example. We can describe temperature on a given day as a function of time of day. Suppose we record the temperature every hour for a 24-hour period starting at midnight. We let our input variable $x$ be the time after midnight, measured in hours, and the output variable $y$ be the temperature $x$ hours after midnight, measured in degrees Fahrenheit. We record our data in Table 1.1.

## Tables Continued
We can see from the table that temperature is a function of time, and the temperature decreases, then increases, and then decreases again. However, we cannot get a clear picture of the behavior of the function without graphing it.

## Graphs

Given a function $f$ described by a table, we can provide a visual picture of the function in the form of a graph. Graphing the temperatures listed in Table 1.1 can give us a better idea of their fluctuation throughout the day. Figure 1.6 shows the plot of the temperature function.

## Graphs Continued
From the points plotted on the graph in Figure 1.6, we can visualize the general shape of the graph. It is often useful to connect the dots in the graph, which represent the data from the table. In this example, although we cannot make any definitive conclusion regarding what the temperature was at any time for which the temperature was not recorded, given the number of data points collected and the pattern in these points, it is reasonable to suspect that the temperatures at other times followed a similar pattern, as we can see in Figure 1.7.

## Algebraic Formulas

Sometimes we are not given the values of a function in table form, rather we are given the values in an explicit formula. Formulas arise in many applications. For example, the area of a circle of radius $r$ is given by the formula $A(r) = \pi r^2$. When an object is thrown upward from the ground with an initial velocity $v_0$ ft/s, its height above the ground from the time it is thrown until it hits the ground is given by the formula $s(t) = -16t^2 + v_0 t$. When $P$ dollars are invested in an account at an annual interest rate $r$ compounded continuously, the amount of money after $t$ years is given by the formula $A(t) = Pe^{rt}$. Algebraic formulas are important tools to calculate function values. Often we also represent these functions visually in graph form.

Given an algebraic formula for a function $f$, the graph of $f$ is the set of points $(x, f(x))$, where $x$ is in the domain of $f$ and $f(x)$ is in the range. To graph a function given by a formula, it is helpful to begin by using the formula to create a table of inputs and outputs. If the domain of $f$ consists of an infinite number of values, we cannot list all of them, but because listing some of the inputs and outputs can be very useful, it is often a good way to begin.

When creating a table of inputs and outputs, we typically check to determine whether zero is an output. Those values of where $f(x) = 0$ are called the zeros of a function. For example, the zeros of $f(x) = x^2 - 4$ are $x = \pm 2$. The zeros determine where the graph of $f$ intersects the $x$-axis, which gives us more information about the shape of the graph of the function. The graph of a function may never intersect the x-axis, or it may intersect multiple (or even infinitely many) times.

Another point of interest is the $y$-intercept, if it exists. The $y$-intercept is given by $(0, f(0))$.

Since a function has exactly one output for each input, the graph of a function can have, at most, one $y$-intercept. If $x = 0$ is in the domain of a function $f$ then $f$ has exactly one $y$-intercept. If $x = 0$ is not in the domain of $f$, then $f$ has no $y$-intercept. Similarly, for any real number $c$, if $c$ is in the domain of $f$, there is exactly one output $f(c)$, and the line $x = c$ intersects the graph of $f$ exactly once. On the other hand, if $c$ is not in the domain of $f$, $f(c)$ is not defined and the line $x = c$ does not intersect the graph of $f$. This property is summarized in the vertical line test.

## Rule: Vertical Line Test

Given a function $f$, every vertical line that may be drawn intersects the graph of $f$ no more than once. If any vertical line intersects a set of points more than once, the set of points does not represent a function.

## Vertical Line Test Continued
We can use this test to determine whether a set of plotted points represents the graph of a function (Figure 1.8).

## Example 1.3
### Finding Zeros and $y$-Intercepts of a Function

Consider the function $f(x) = -4x + 2$. Find all zeros of $f$. Find the $y$-intercept (if any). Sketch a graph of $f$.

### Solution

To find the zeros, solve $f(x) = -4x + 2 = 0$. We discover that $f$ has one zero at $x = 1/2$. The $y$-intercept is given by $(0, f(0)) = (0, 2)$. Given that $f$ is a linear function of the form $f(x) = mx + b$ that passes through the points $(1/2, 0)$ and $(0, 2)$, we can sketch the graph of $f$ (Figure 1.9).

## Checkpoint 1.3

Find the zeros of $f(x) = x^3 - 5x^2 + 6x$.

<!-- TODO: Example 1.4 is missing from this source. -->

## Example 1.5
### Finding the Height of a Free-Falling Object

If a ball is dropped from a height of 100ft, its height $s$ at time $t$ is given by the function $s(t) = -16t^2 + 100$, where $s$ is measured in feet and $t$ is measured in seconds. The domain is restricted to the interval $[0, c]$, where $t = 0$ is the time when the ball is dropped and $t = c$ is the time when the ball hits the ground.

a. Create a table showing the height $s(t)$ when $t = 0, 0.5, 1, 1.5, 2$, and $2.5$. Using the data from the table, determine the domain for this function. That is, find the time $c$ when the ball hits the ground.
b. Sketch a graph of $s$.

## Increasing and Decreasing Functions

Note that for this function and the function $f(x) = -4x + 2$ graphed in Figure 1.9, the values of $f(x)$ are getting smaller as $x$ is getting larger. A function with this property is said to be decreasing. On the other hand, for the function $f(x) = \sqrt{x + 3} + 1$ graphed in Figure 1.10, the values of $f(x)$ are getting larger as the values of $x$ are getting larger. A function with this property is said to be increasing. It is important to note, however, that a function can be increasing on some interval or intervals and decreasing over a different interval or intervals. For example, using our temperature function in Figure 1.6, we can see that the function is decreasing on the interval $(0, 4)$, increasing on the interval $(4, 14)$, and then decreasing on the interval $(14, 23)$. We make the idea of a function increasing or decreasing over a particular interval more precise in the next definition.

## Definition: Increasing and Decreasing

We say that a function $f$ is increasing on the interval $I$ if for all $x_1, x_2 \in I$,

$$
f(x_1) \leq f(x_2) \text{ when } x_1 < x_2.
$$

We say $f$ is strictly increasing on the interval $I$ if for all $x_1, x_2 \in I$,

$$
f(x_1) < f(x_2) \text{ when } x_1 < x_2.
$$

We say that a function $f$ is decreasing on the interval $I$ if for all $x_1, x_2 \in I$,

$$
f(x_1) \geq f(x_2) \text{ if } x_1 < x_2.
$$

We say that a function $f$ is strictly decreasing on the interval $I$ if for all $x_1, x_2 \in I$,

$$
f(x_1) > f(x_2) \text{ if } x_1 < x_2.
$$

## Inc. and Dec. Continued
For example, the function $f(x) = 3x$ is increasing on the interval $(-\infty, \infty)$ because $3x_1 < 3x_2$ whenever $x_1 < x_2$. On the other hand, the function $f(x) = -x^3$ is strictly decreasing on the interval $(-\infty, \infty)$ because $-x_1^3 > -x_2^3$ whenever $x_1 < x_2$ (Figure 1.11).

## Combining Functions

Now that we have reviewed the basic characteristics of functions, we can see what happens to these properties when we combine functions in different ways, using basic mathematical operations to create new functions. For example, if the cost for a company to manufacture $x$ items is described by the function $C(x)$ and the revenue created by the sale of $x$ items is described by the function $R(x)$, then the profit on the manufacture and sale of $x$ items is defined as $P(x) = R(x) - C(x)$. Using the difference between two functions, we created a new function.

Alternatively, we can create a new function by composing two functions. For example, given the functions $f(x) = x^2$ and $g(x) = 3x + 1$, the composite function $f \circ g$ is defined such that 
$$ 
(f \circ g)(x) = f(g(x)) = (g(x))^2 = (3x + 1)^2
$$ 

The composite function $g \circ f$ is defined such that
$$ 
(g \circ f)(x) = g(f(x)) = 3f(x) + 1 = 3x^2 + 1
$$ 

Note that these two new functions are different from each other.

## Combining Functions with Mathematical Operators

To combine functions using mathematical operators, we simply write the functions with the operator and simplify. Given two functions $f$ and $g$, we can define four new functions:

$$ 
Sum: (f + g)(x) = f(x) + g(x)  
$$ 

$$
Difference: (f - g)(x) = f(x) - g(x)
$$ 

$$
Product: (f \cdot g)(x) = f(x) \cdot g(x)
$$

$$
\text{Quotient: } \left(\frac{f}{g}\right)(x) = \frac{f(x)}{g(x)}, \quad g(x) \neq 0
$$

## Example 1.6
### Combining Functions Using Mathematical Operations

Given the functions $f(x) = 2x - 3$ and $g(x) = x^2 - 1$, find each of the following functions and state its domain.

1. $(f + g)(x)$
2. $(f - g)(x)$
3. $(f \cdot g)(x)$
4. $(f / g)(x)$

### Solution

1. $(f + g)(x) = (2x - 3) + (x^2 - 1) = x^2 + 2x - 4$. The domain of this function is the interval $(-\infty, \infty)$.
2. $(f - g)(x) = (2x - 3) - (x^2 - 1) = -x^2 + 2x - 2$. The domain of this function is the interval $(-\infty, \infty)$.
3. $(f \cdot g)(x) = (2x - 3)(x^2 - 1) = 2x^3 - 3x^2 - 2x + 3$. The domain of this function is the interval $(-\infty, \infty)$.
4. $(f / g)(x) = \dfrac{2x - 3}{x^2 - 1}$. The domain of this function is $\{x \mid x \neq \pm 1\}$.

## Checkpoint 1.4

For $f(x) = x^2 + 3$ and $g(x) = 2x - 5$, find $(f/g)(x)$ and state its domain.

## Function Composition

When we compose functions, we take a function of a function. For example, suppose the temperature $T$ on a given day is described as a function of time $t$ (measured in hours after midnight) as in Table 1.1. Suppose the cost $C$, to heat or cool a building for 1 hour, can be described as a function of the temperature $T$. Combining these two functions, we can describe the cost of heating or cooling a building as a function of time by evaluating $C(T(t))$. We have defined a new function, denoted $C \circ T$, which is defined such that $(C \circ T)(t) = C(T(t))$ for all $t$ in the domain of $T$. This new function is called a composite function. We note that since cost is a function of temperature and temperature is a function of time, it makes sense to define this new function $(C \circ T)(t)$. It does not make sense to consider $(T \circ C)(t)$, because temperature is not a function of cost.

## Definition: Function Composition

Consider the function $f$ with domain $A$ and range $B$, and the function $g$ with domain $D$ and range $E$. If $B$ is a subset of $D$, then the composite function $(g \circ f)(x)$ is the function with domain $A$ such that $(g \circ f)(x) = g(f(x))$.

## Definition: Function Composition Continued
A composite function $g \circ f$ can be viewed in two steps. First, the function $f$ maps each input $x$ in the domain of $f$ to its output $f(x)$ in the range of $f$. Second, since the range of $f$ is a subset of the domain of $g$, the output $f(x)$ is an element in the domain of $g$, and therefore it is mapped to an output $g(f(x))$ in the range of $g$. In Figure 1.12, we see a visual image of a composite function.

## Checkpoint 1.5

Let $f(x) = 2 - 5x$. Let $g(x) = \sqrt{x}$. Find $(f \circ g)(x)$.

## Symmetry of Functions

The graphs of certain functions have symmetry properties that help us understand the function and the shape of its graph. For example, consider the function $f(x) = x^4 - 2x^2 - 3$ shown in Figure 1.13(a). If we take the part of the curve that lies to the right of the y-axis and flip it over the y-axis, it lays exactly on top of the curve to the left of the y-axis. In this case, we say the function has symmetry about the y-axis. On the other hand, consider the function $f(x) = x^3 - 4x$ shown in Figure 1.13(b). If we take the graph and rotate it 180° about the origin, the new graph will look exactly the same. In this case, we say the function has symmetry about the origin.

## Symmetry of Functions-1
If we are given the graph of a function, it is easy to see whether the graph has one of these symmetry properties. But without a graph, how can we determine algebraically whether a function $f$ has symmetry? Looking at Figure 1.13 again, we see that since $f$ is symmetric about the $y$-axis, if the point $(x, y)$ is on the graph, the point $(-x, y)$ is on the graph. In other words, $f(-x) = f(x)$. If a function $f$ has this property, we say $f$ is an even function, which has symmetry about the y-axis. For example, $f(x) = x^2$ is even because 
$$
f(-x) = (-x)^2 = x^2 = f(x)
$$ 

In contrast, looking at Figure 1.13 again, if a function $f$ is symmetric about the origin, then whenever the point $(x, y)$ is on the graph, the point $(-x, -y)$ is also on the graph. In other words, $f(-x) = -f(x)$. If $f$ has this property, we say $f$ is an odd function, which has symmetry about the origin. For example, $f(x) = x^3$ is odd because 
$$
f(-x) = (-x)^3 = -x^3 = -f(x)
$$

## Definition: Even and Odd Functions

If $f(x) = f(-x)$ for all $x$ in the domain of $f$, then $f$ is an even function. An even function is symmetric about the y-axis.

If $f(-x) = -f(x)$ for all $x$ in the domain of $f$, then $f$ is an odd function. An odd function is symmetric about the origin.

## Absolute Value Function
One symmetric function that arises frequently is the absolute value function, written as $|x|$. The absolute value function is defined as

$$
f(x) = \begin{cases} -x & x < 0 \\ x & x \geq 0 \end{cases}
$$

Some students describe this function by stating that it "makes everything positive." By the definition of the absolute value function, we see that if $x < 0$, then $|x| = -x > 0$, and if $x > 0$, then $|x| = x > 0$. However, for $x = 0$, $|x| = 0$. Therefore, it is more accurate to say that for all nonzero inputs, the output is positive, but if $x = 0$, the output $|x| = 0$. We conclude that the range of the absolute value function is $\{y \mid y \geq 0\}$. In Figure 1.14, we see that the absolute value function is symmetric about the y-axis and is therefore an even function.
